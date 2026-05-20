export const APP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Warframe MR Tracker</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0a0f;color:#e8e8f0;font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh}
.hidden{display:none!important}
button{cursor:pointer;border:none;font-family:inherit}
input,select{font-family:inherit}
a{color:#c8a951}

/* ── AUTH ─────────────────────────────────── */
.auth-screen{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px}
.auth-card{background:#141420;border:1px solid #2a2a3a;border-radius:8px;padding:40px;width:100%;max-width:400px}
.auth-card h1{color:#c8a951;text-align:center;font-size:24px;letter-spacing:3px;margin-bottom:6px}
.auth-subtitle{color:#555;text-align:center;font-size:12px;letter-spacing:1px;margin-bottom:28px}
.auth-tabs{display:flex;border-bottom:1px solid #2a2a3a;margin-bottom:24px}
.auth-tab{flex:1;background:none;color:#666;padding:10px;font-size:13px;letter-spacing:1px;border-bottom:2px solid transparent;transition:all .2s}
.auth-tab.active{color:#c8a951;border-bottom-color:#c8a951}
.form-group{margin-bottom:16px}
.form-group label{display:block;color:#666;font-size:11px;letter-spacing:1px;margin-bottom:6px}
.form-group input{width:100%;background:#0f0f1a;border:1px solid #2a2a3a;color:#e8e8f0;padding:10px 12px;border-radius:4px;font-size:14px;outline:none;transition:border-color .2s}
.form-group input:focus{border-color:#c8a951}
.btn-primary{width:100%;background:#c8a951;color:#0a0a0f;padding:12px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:2px;margin-top:8px;transition:background .2s}
.btn-primary:hover{background:#d4b86a}
.btn-primary:disabled{opacity:.5;cursor:not-allowed}
.auth-error{color:#e05f00;font-size:12px;margin-top:10px;text-align:center;min-height:16px}

/* ── APP LAYOUT ───────────────────────────── */
.app{display:flex;flex-direction:column;min-height:100vh}

/* ── HEADER ───────────────────────────────── */
.header{background:#0d0d18;border-bottom:1px solid #2a2a3a;padding:0 20px;display:flex;align-items:center;gap:16px;height:60px;position:sticky;top:0;z-index:100;flex-shrink:0}
.header-logo{color:#c8a951;font-size:16px;font-weight:700;letter-spacing:3px;flex-shrink:0}
.header-mr{display:flex;align-items:center;gap:12px;flex:1;min-width:0}
.mr-badge{background:#141420;border:1px solid #c8a951;color:#c8a951;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:2px;flex-shrink:0}
.mr-bar-wrap{flex:1;min-width:0;max-width:300px}
.mr-bar-label{display:flex;justify-content:space-between;color:#555;font-size:10px;margin-bottom:4px}
.mr-bar{height:3px;background:#1e1e2e;border-radius:2px;overflow:hidden}
.mr-bar-fill{height:100%;background:linear-gradient(90deg,#c8a951,#e05f00);border-radius:2px;transition:width .3s}
.header-xp{color:#555;font-size:12px;flex-shrink:0}
.header-right{margin-left:auto;display:flex;align-items:center;gap:12px;flex-shrink:0}
.header-user{color:#666;font-size:13px}
.btn-logout{background:#1a1a2a;color:#666;border:1px solid #2a2a3a;padding:6px 14px;border-radius:4px;font-size:11px;letter-spacing:1px;transition:all .2s}
.btn-logout:hover{border-color:#e05f00;color:#e05f00}

/* ── TABS ─────────────────────────────────── */
.tabs-wrap{background:#0d0d18;border-bottom:1px solid #2a2a3a;overflow-x:auto;scrollbar-width:none;flex-shrink:0}
.tabs-wrap::-webkit-scrollbar{display:none}
.tabs{display:flex;padding:0 20px;width:max-content}
.tab{background:none;color:#666;padding:11px 15px;font-size:12px;letter-spacing:1px;border-bottom:2px solid transparent;transition:all .2s;white-space:nowrap}
.tab:hover{color:#c8a951}
.tab.active{color:#c8a951;border-bottom-color:#c8a951}

/* ── CONTROLS ─────────────────────────────── */
.controls{padding:10px 20px;display:flex;align-items:center;gap:10px;background:#0a0a0f;border-bottom:1px solid #141425;flex-wrap:wrap;flex-shrink:0}
.search{flex:1;min-width:180px;max-width:320px;background:#141420;border:1px solid #2a2a3a;color:#e8e8f0;padding:7px 12px;border-radius:4px;font-size:13px;outline:none;transition:border-color .2s}
.search:focus{border-color:#c8a951}
.search::placeholder{color:#3a3a4a}
.ctrl-label{color:#555;font-size:11px;white-space:nowrap;letter-spacing:1px}
.ctrl-select{background:#141420;border:1px solid #2a2a3a;color:#e8e8f0;padding:7px 10px;border-radius:4px;font-size:12px;outline:none;cursor:pointer}
.ctrl-select:focus{border-color:#c8a951}
.ctrl-count{margin-left:auto;color:#444;font-size:11px;white-space:nowrap}
.save-status{font-size:11px;color:#444;white-space:nowrap}
.save-status.saving{color:#c8a951}
.save-status.saved{color:#4a9a6a}
.save-status.error{color:#e05f00}

/* ── GRID ─────────────────────────────────── */
.item-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;padding:14px 20px;align-content:start}

/* ── CARD ─────────────────────────────────── */
.item-card{background:#141420;border:1px solid #2a2a3a;border-radius:6px;overflow:hidden;transition:border-color .2s}
.item-card:hover{border-color:#3a3a55}
.item-card.maxed{border-color:#c8a95130}
.item-img-wrap{height:72px;background:#0f0f1a;display:flex;align-items:center;justify-content:center;overflow:hidden}
.item-img{width:100%;height:100%;object-fit:contain;padding:6px}
.item-letter{width:44px;height:44px;border-radius:50%;background:#1e1e2e;display:flex;align-items:center;justify-content:center;color:#c8a951;font-size:14px;font-weight:700;flex-shrink:0}
.item-body{padding:9px 11px 11px}
.item-name{font-size:12px;font-weight:600;color:#d8d8e8;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.item-bar{height:2px;background:#1e1e2e;border-radius:1px;overflow:hidden;margin-bottom:5px}
.item-bar-fill{height:100%;background:linear-gradient(90deg,#c8a951,#e05f00);border-radius:1px;transition:width .15s}
.item-rank-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.item-rank{font-size:11px;color:#666}
.item-rank b{color:#c8a951}
.item-xp{font-size:10px;color:#555}
.item-slider{width:100%;accent-color:#c8a951;cursor:pointer;height:14px}
.item-gild{font-size:9px;color:#e05f00;letter-spacing:1px;margin-top:5px;opacity:.8}

/* ── EMPTY ────────────────────────────────── */
.empty{grid-column:1/-1;text-align:center;padding:60px 20px;color:#444}

/* ── TOAST ────────────────────────────────── */
.toast{position:fixed;bottom:20px;right:20px;background:#1e1e2e;border:1px solid #3a3a55;color:#c8c8d8;padding:10px 16px;border-radius:6px;font-size:13px;transform:translateY(60px);opacity:0;transition:all .25s;pointer-events:none;z-index:999;max-width:300px}
.toast.show{transform:translateY(0);opacity:1}

/* ── RESPONSIVE ───────────────────────────── */
@media(max-width:640px){
  .header{padding:0 12px;gap:8px}
  .header-mr,.header-xp{display:none}
  .item-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));padding:10px 12px;gap:8px}
  .controls{padding:8px 12px}
  .tabs{padding:0 12px}
}
</style>
</head>
<body>

<!-- ── AUTH SCREEN ───────────────────────── -->
<div id="auth-screen" class="auth-screen">
  <div class="auth-card">
    <h1>MR TRACKER</h1>
    <p class="auth-subtitle">WARFRAME MASTERY RANK TRACKER</p>
    <div class="auth-tabs">
      <button class="auth-tab active" id="tab-login" onclick="switchAuthTab('login')">LOGIN</button>
      <button class="auth-tab" id="tab-register" onclick="switchAuthTab('register')">REGISTER</button>
    </div>
    <div class="form-group">
      <label>USERNAME</label>
      <input type="text" id="auth-user" autocomplete="username" onkeydown="if(event.key==='Enter')submitAuth()">
    </div>
    <div class="form-group">
      <label>PASSWORD</label>
      <input type="password" id="auth-pass" autocomplete="current-password" onkeydown="if(event.key==='Enter')submitAuth()">
    </div>
    <p class="auth-error" id="auth-err"></p>
    <button class="btn-primary" id="auth-btn" onclick="submitAuth()">LOGIN</button>
  </div>
</div>

<!-- ── MAIN APP ──────────────────────────── -->
<div id="app" class="app hidden">
  <header class="header">
    <div class="header-logo">MR TRACKER</div>
    <div class="header-mr">
      <div class="mr-badge" id="mr-badge">MR 0</div>
      <div class="mr-bar-wrap">
        <div class="mr-bar-label">
          <span id="mr-cur">0 XP</span>
          <span id="mr-next">Next: 2,500 XP</span>
        </div>
        <div class="mr-bar"><div class="mr-bar-fill" id="mr-fill" style="width:0%"></div></div>
      </div>
    </div>
    <div class="header-xp" id="hdr-xp">0 total XP</div>
    <div class="header-right">
      <span class="header-user" id="hdr-user"></span>
      <button class="btn-logout" onclick="logout()">LOGOUT</button>
    </div>
  </header>

  <div class="tabs-wrap"><div class="tabs" id="tabs"></div></div>

  <div class="controls">
    <input class="search" type="search" id="search" placeholder="Search items…" oninput="renderGrid()">
    <span class="ctrl-label">SORT</span>
    <select class="ctrl-select" id="sort" onchange="renderGrid()">
      <option value="name-asc">Name (A→Z)</option>
      <option value="name-desc">Name (Z→A)</option>
      <option value="prog-desc">Progress (High→Low)</option>
      <option value="prog-asc">Progress (Low→High)</option>
    </select>
    <span class="ctrl-count" id="item-count"></span>
    <span class="save-status" id="save-status"></span>
  </div>

  <main class="item-grid" id="grid"></main>
</div>

<div class="toast" id="toast"></div>

<script>
// ── State ──────────────────────────────────────────────────
const S = {
  user: null, items: [], progress: {},
  category: 'all', dirty: new Set(),
  saveTimer: null, inactTimer: null,
};

const CAT = {
  all:'All', warframe:'Warframes', primary:'Primary', secondary:'Secondary',
  melee:'Melee', companion:'Companions', companion_weapon:'Sentinel Wpns',
  archwing:'Archwing', archgun:'Arch-Guns', archmelee:'Arch-Melee',
  kdrive:'K-Drives', necramech:'Necramechs', kitgun:'Kitguns',
  zaw:'Zaws', amp:'Amps', plexus:'Plexus',
};

// ── MR ─────────────────────────────────────────────────────
function totalXP() {
  let x = 0;
  for (const it of S.items) x += (S.progress[it.id] ?? 0) * it.xpPerRank;
  return x;
}

function xpToMR(xp) {
  const LR_BASE = 2250000, LR_STEP = 147500;
  if (xp >= LR_BASE + LR_STEP) {
    const lr = Math.floor((xp - LR_BASE) / LR_STEP);
    return { label: 'LR ' + lr, rank: lr, prevAt: LR_BASE + (lr - 1) * LR_STEP, nextAt: LR_BASE + lr * LR_STEP };
  }
  for (let n = 30; n >= 1; n--) {
    if (xp >= n * n * 2500) return { label: 'MR ' + n, rank: n, prevAt: n * n * 2500, nextAt: (n+1)*(n+1)*2500 };
  }
  return { label: 'MR 0', rank: 0, prevAt: 0, nextAt: 2500 };
}

function updateMR() {
  const xp = totalXP();
  const mr = xpToMR(xp);
  const range = mr.nextAt - mr.prevAt;
  const pct = range > 0 ? Math.min(100, ((xp - mr.prevAt) / range) * 100) : 100;
  document.getElementById('mr-badge').textContent = mr.label;
  document.getElementById('mr-fill').style.width = pct + '%';
  document.getElementById('mr-cur').textContent = fmt(xp) + ' XP';
  document.getElementById('mr-next').textContent = 'Next: ' + fmt(mr.nextAt) + ' XP';
  document.getElementById('hdr-xp').textContent = fmt(xp) + ' total XP';
}

function fmt(n) { return n.toLocaleString(); }

// ── Inactivity ─────────────────────────────────────────────
const INACTIVE_MS = 3 * 60 * 60 * 1000;
function resetInact() {
  clearTimeout(S.inactTimer);
  S.inactTimer = setTimeout(() => { toast('Logged out due to inactivity.'); logout(); }, INACTIVE_MS);
}
['mousemove','keydown','click','scroll','touchstart'].forEach(e =>
  document.addEventListener(e, resetInact, { passive: true })
);

// ── Auth ───────────────────────────────────────────────────
let authMode = 'login';

function switchAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  document.getElementById('auth-btn').textContent = mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT';
  document.getElementById('auth-pass').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  document.getElementById('auth-err').textContent = '';
}

async function submitAuth() {
  const username = document.getElementById('auth-user').value.trim();
  const password = document.getElementById('auth-pass').value;
  const errEl = document.getElementById('auth-err');
  const btn = document.getElementById('auth-btn');
  errEl.textContent = '';
  if (!username || !password) { errEl.textContent = 'Please fill in all fields.'; return; }
  btn.disabled = true;
  try {
    const res = await fetch('/api/auth/' + authMode, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error ?? 'Something went wrong.'; return; }
    await initApp(data.username);
  } catch { errEl.textContent = 'Network error. Please try again.'; }
  finally { btn.disabled = false; }
}

async function logout() {
  clearTimeout(S.inactTimer);
  clearTimeout(S.saveTimer);
  if (S.dirty.size > 0) await saveProgress();
  await fetch('/api/auth/logout', { method: 'POST' });
  S.user = null; S.items = []; S.progress = {}; S.dirty.clear();
  document.getElementById('app').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('auth-user').value = '';
  document.getElementById('auth-pass').value = '';
}

// ── Boot ────────────────────────────────────────────────────
async function initApp(username) {
  S.user = username;
  document.getElementById('hdr-user').textContent = username;
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  const [ir, pr] = await Promise.all([fetch('/api/items'), fetch('/api/progress')]);
  S.items = await ir.json();
  const prog = await pr.json();
  if (!prog.error) S.progress = prog;
  buildTabs();
  renderGrid();
  updateMR();
  resetInact();
}

(async () => {
  try {
    const res = await fetch('/api/me');
    if (res.ok) { const d = await res.json(); await initApp(d.username); }
  } catch {}
})();

// ── Tabs ────────────────────────────────────────────────────
function buildTabs() {
  const cats = ['all', ...[...new Set(S.items.map(i => i.category))]];
  document.getElementById('tabs').innerHTML = cats.map(c =>
    \`<button class="tab\${c === S.category ? ' active' : ''}" data-cat="\${c}" onclick="setCategory('\${c}')">\${CAT[c] ?? c}</button>\`
  ).join('');
}

function setCategory(cat) {
  S.category = cat;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
  renderGrid();
}

// ── Grid ────────────────────────────────────────────────────
function renderGrid() {
  const q = document.getElementById('search').value.toLowerCase();
  const sort = document.getElementById('sort').value;

  let list = S.items.filter(it => {
    if (S.category !== 'all' && it.category !== S.category) return false;
    if (q && !it.name.toLowerCase().includes(q)) return false;
    return true;
  });

  list.sort((a, b) => {
    if (sort === 'name-asc')  return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    const pa = (S.progress[a.id] ?? 0) / a.maxRank;
    const pb = (S.progress[b.id] ?? 0) / b.maxRank;
    return sort === 'prog-desc' ? pb - pa : pa - pb;
  });

  document.getElementById('item-count').textContent = list.length + ' items';
  document.getElementById('grid').innerHTML =
    list.length ? list.map(it => card(it)).join('') : '<div class="empty"><p>No items found.</p></div>';
}

function imgUrl(name) {
  return 'https://wiki.warframe.com/wiki/Special:Redirect/file/' + encodeURIComponent(name.replace(/ /g, '_')) + '.png';
}

function card(it) {
  const rank = S.progress[it.id] ?? 0;
  const pct  = it.maxRank > 0 ? (rank / it.maxRank) * 100 : 0;
  const xp   = rank * it.xpPerRank;
  const maxXP = it.maxRank * it.xpPerRank;
  const letters = it.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return \`<div class="item-card\${rank === it.maxRank ? ' maxed' : ''}" id="c-\${it.id}">
  <div class="item-img-wrap">
    <img class="item-img" src="\${imgUrl(it.name)}" alt="" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="item-letter" style="display:none">\${letters}</div>
  </div>
  <div class="item-body">
    <div class="item-name" title="\${it.name}">\${it.name}</div>
    <div class="item-bar"><div class="item-bar-fill" style="width:\${pct}%"></div></div>
    <div class="item-rank-row">
      <span class="item-rank">RANK <b>\${rank}</b> / \${it.maxRank}</span>
      <span class="item-xp">\${fmt(xp)} / \${fmt(maxXP)} XP</span>
    </div>
    <input type="range" class="item-slider" min="0" max="\${it.maxRank}" value="\${rank}"
      oninput="setRank('\${it.id}',+this.value,this)">
    \${it.requiresGilding ? '<div class="item-gild">REQUIRES GILDING FOR MASTERY</div>' : ''}
  </div>
</div>\`;
}

// ── Progress ────────────────────────────────────────────────
function setRank(id, rank, slider) {
  S.progress[id] = rank;
  S.dirty.add(id);
  const it   = S.items.find(i => i.id === id);
  const card = document.getElementById('c-' + id);
  if (it && card) {
    const pct = it.maxRank > 0 ? (rank / it.maxRank) * 100 : 0;
    card.querySelector('.item-bar-fill').style.width = pct + '%';
    card.querySelector('.item-rank b').textContent   = rank;
    card.querySelector('.item-xp').textContent       = fmt(rank * it.xpPerRank) + ' / ' + fmt(it.maxRank * it.xpPerRank) + ' XP';
    card.classList.toggle('maxed', rank === it.maxRank);
  }
  updateMR();
  scheduleSave();
}

function scheduleSave() {
  clearTimeout(S.saveTimer);
  setSaveStatus('saving', 'Unsaved…');
  S.saveTimer = setTimeout(saveProgress, 1500);
}

async function saveProgress() {
  if (!S.dirty.size) return;
  const updates = [...S.dirty].map(id => ({ id, rank: S.progress[id] ?? 0 }));
  S.dirty.clear();
  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      setSaveStatus('saved', 'Saved');
      setTimeout(() => setSaveStatus('', ''), 2000);
    } else {
      setSaveStatus('error', 'Save failed');
    }
  } catch { setSaveStatus('error', 'Save failed'); }
}

function setSaveStatus(cls, txt) {
  const el = document.getElementById('save-status');
  el.className = 'save-status' + (cls ? ' ' + cls : '');
  el.textContent = txt;
}

// ── Toast ───────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}
</script>
</body>
</html>`;
