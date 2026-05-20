import { ITEMS_MAP } from './items.js';
import { getSession } from './auth.js';
import { json } from './utils.js';

export async function handleGetProgress(request, env) {
  const session = await getSession(request, env);
  if (!session) return json({ error: 'not authenticated' }, 401);

  const { results } = await env.DB.prepare(
    'SELECT item_id, rank FROM progress WHERE user_id = ?'
  ).bind(session.user_id).all();

  const progress = {};
  for (const row of results) progress[row.item_id] = row.rank;
  return json(progress);
}

export async function handleSaveProgress(request, env) {
  const session = await getSession(request, env);
  if (!session) return json({ error: 'not authenticated' }, 401);

  let updates;
  try { updates = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }
  if (!Array.isArray(updates)) return json({ error: 'body must be an array' }, 400);
  if (updates.length === 0) return json({ ok: true, saved: 0 });
  if (updates.length > 2000) return json({ error: 'too many updates' }, 400);

  const stmts = [];
  for (const { id, rank } of updates) {
    const item = ITEMS_MAP.get(id);
    if (!item) continue;
    const r = Math.max(0, Math.min(Math.floor(Number(rank)), item.maxRank));
    stmts.push(
      env.DB.prepare('INSERT OR REPLACE INTO progress (user_id, item_id, rank) VALUES (?, ?, ?)')
        .bind(session.user_id, id, r)
    );
  }

  if (stmts.length > 0) await env.DB.batch(stmts);
  return json({ ok: true, saved: stmts.length });
}
