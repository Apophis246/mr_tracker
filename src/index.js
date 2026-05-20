import { ITEMS } from './items.js';
import { json } from './utils.js';
import { handleRegister, handleLogin, handleLogout, handleMe } from './auth.js';
import { handleGetProgress, handleSaveProgress } from './progress.js';
import { APP_HTML } from './frontend.js';

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

    return new Response(APP_HTML, {
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
