import { json } from './utils.js';

export const SESSION_TTL = 3 * 60 * 60; // 3 hours in seconds

export function randomHex(bytes = 16) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password, salt, pepper) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(password + pepper), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    key, 256
  );
  return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
}

export function parseCookies(header) {
  if (!header) return {};
  const out = {};
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    out[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  }
  return out;
}

function sessionCookie(token, maxAge) {
  return `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

export async function getSession(request, env) {
  const token = parseCookies(request.headers.get('Cookie')).session;
  if (!token) return null;
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(
    'SELECT s.id, s.user_id, u.username FROM sessions s ' +
    'JOIN users u ON u.id = s.user_id ' +
    'WHERE s.id = ? AND s.expires_at > ?'
  ).bind(token, now).first();
  if (!row) return null;
  await env.DB.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?')
    .bind(now + SESSION_TTL, token).run();
  return row;
}

export async function handleRegister(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }
  const { username, password } = body ?? {};
  if (!username || !password) return json({ error: 'username and password required' }, 400);
  if (username.length < 3 || username.length > 32) return json({ error: 'username must be 3–32 characters' }, 400);
  if (!/^[A-Za-z0-9_-]+$/.test(username)) return json({ error: 'username may only contain letters, numbers, - and _' }, 400);
  if (password.length < 8) return json({ error: 'password must be at least 8 characters' }, 400);

  const pepper = env.PASSWORD_PEPPER ?? '';
  const salt = randomHex(16);
  const hash = await hashPassword(password, salt, pepper);
  const userId = randomHex(16);
  const now = Math.floor(Date.now() / 1000);

  try {
    await env.DB.prepare(
      'INSERT INTO users (id, username, password_hash, salt, created_at, last_active) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, username, hash, salt, now, now).run();
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return json({ error: 'username already taken' }, 409);
    return json({ error: 'registration failed' }, 500);
  }

  const sessionId = randomHex(32);
  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(sessionId, userId, now, now + SESSION_TTL).run();

  return new Response(JSON.stringify({ ok: true, username }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie(sessionId, SESSION_TTL) },
  });
}

export async function handleLogin(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }
  const { username, password } = body ?? {};
  if (!username || !password) return json({ error: 'username and password required' }, 400);

  const pepper = env.PASSWORD_PEPPER ?? '';
  const user = await env.DB.prepare(
    'SELECT id, username, password_hash, salt FROM users WHERE username = ?'
  ).bind(username).first();

  // Always hash even on miss to prevent timing attacks
  const hash = await hashPassword(password, user?.salt ?? 'dummy-salt', pepper);
  if (!user || hash !== user.password_hash) return json({ error: 'invalid credentials' }, 401);

  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare('UPDATE users SET last_active = ? WHERE id = ?').bind(now, user.id).run();

  const sessionId = randomHex(32);
  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(sessionId, user.id, now, now + SESSION_TTL).run();

  return new Response(JSON.stringify({ ok: true, username: user.username }), {
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie(sessionId, SESSION_TTL) },
  });
}

export async function handleLogout(request, env) {
  const token = parseCookies(request.headers.get('Cookie')).session;
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    },
  });
}

export async function handleMe(request, env) {
  const session = await getSession(request, env);
  if (!session) return json({ error: 'not authenticated' }, 401);
  return json({ ok: true, username: session.username, userId: session.user_id });
}
