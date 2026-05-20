export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return handleHealth(env);
    }

    return new Response(SETUP_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

async function handleHealth(env) {
  try {
    await env.DB.prepare('SELECT 1').run();
    return json({ ok: true, db: 'connected' });
  } catch (e) {
    return json({ ok: false, db: e.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const SETUP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warframe MR Tracker</title>
  <style>
    body {
      margin: 0;
      background: #0a0a0f;
      color: #e8e8f0;
      font-family: 'Segoe UI', system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      text-align: center;
      padding: 48px;
      border: 1px solid #2a2a3a;
      border-radius: 8px;
      background: #141420;
      max-width: 480px;
    }
    h1 { color: #c8a951; margin: 0 0 8px; font-size: 28px; letter-spacing: 2px; }
    p  { color: #888; margin: 0 0 24px; }
    .badge {
      display: inline-block;
      background: #1e1e2e;
      border: 1px solid #c8a951;
      color: #c8a951;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 13px;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>MR TRACKER</h1>
    <p>Warframe Mastery Rank Tracker</p>
    <span class="badge">DEPLOYING</span>
  </div>
</body>
</html>`;
