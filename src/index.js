import { ITEMS } from './items.js';
import { json } from './utils.js';
import { handleRegister, handleLogin, handleLogout, handleMe } from './auth.js';
import { handleGetProgress, handleSaveProgress } from './progress.js';

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;
    const m    = request.method;

    if (path === '/api/health'        && m === 'GET')  return handleHealth(env);
    if (path === '/api/items'         && m === 'GET')  return handleItems();
    if (path === '/api/auth/register' && m === 'POST') return handleRegister(request, env);
    if (path === '/api/auth/login'    && m === 'POST') return handleLogin(request, env);
    if (path === '/api/auth/logout'   && m === 'POST') return handleLogout(request, env);
    if (path === '/api/me'            && m === 'GET')  return handleMe(request, env);
    if (path === '/api/progress'      && m === 'GET')  return handleGetProgress(request, env);
    if (path === '/api/progress'      && m === 'POST') return handleSaveProgress(request, env);

    return new Response(PLACEHOLDER_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

function handleItems() {
  return json(ITEMS);
}

async function handleHealth(env) {
  try {
    await env.DB.prepare('SELECT 1').run();
    return json({ ok: true, db: 'connected', itemCount: ITEMS.length });
  } catch (e) {
    return json({ ok: false, db: e.message }, 500);
  }
}

const PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warframe MR Tracker</title>
  <style>
    body { margin:0; background:#0a0a0f; color:#e8e8f0; font-family:'Segoe UI',system-ui,sans-serif;
           display:flex; align-items:center; justify-content:center; min-height:100vh; }
    .card { text-align:center; padding:48px; border:1px solid #2a2a3a; border-radius:8px;
            background:#141420; max-width:480px; }
    h1 { color:#c8a951; margin:0 0 8px; font-size:28px; letter-spacing:2px; }
    p  { color:#888; margin:0 0 24px; }
    .badge { display:inline-block; background:#1e1e2e; border:1px solid #c8a951;
             color:#c8a951; padding:6px 16px; border-radius:4px; font-size:13px; letter-spacing:1px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>MR TRACKER</h1>
    <p>Warframe Mastery Rank Tracker — coming soon</p>
    <span class="badge">IN DEVELOPMENT</span>
  </div>
</body>
</html>`;
