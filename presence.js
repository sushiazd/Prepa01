/* =====================================================================
   Présence en ligne et invitations (1v1 et FFA), partagées par toutes les pages.
   - Chaque compte connecté rejoint le canal temps réel « site-lobby » :
     les autres le voient avec une pastille verte dans la liste du 1v1.
   - Une invitation reçue s'affiche en bas de l'écran, sur n'importe quelle page.
   Usage :
     <script src="presence.js" defer></script>                 → démarre seul (accueil, élec)
     <script src="../presence.js" data-external defer></script> → la page appelle SitePresence.start(sb)
   ===================================================================== */
(function () {
  'use strict';
  const script = document.currentScript;
  const ROOT = new URL('.', script.src).href;
  const external = script.hasAttribute('data-external');
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js';
  const INVITE_MS = 30000;

  let sb = null, me = null, ch = null, status = 'online', userSeq = 0;
  let online = new Map();                       // id → { pseudo, status: 'online' | 'duel' }
  const listeners = {};
  const emit = (ev, data) => (listeners[ev] || []).forEach(f => { try { f(data); } catch (e) { console.warn(e); } });
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const meta = () => ({ pseudo: me.pseudo, status, at: Date.now() });

  const P = window.SitePresence = {
    ROOT, INVITE_MS,
    start,
    on(ev, f) { (listeners[ev] = listeners[ev] || []).push(f); },
    get me() { return me; },
    get online() { return online; },
    setStatus(s) { status = s; if (ch && me) ch.track(meta()).catch(() => {}); },
    // kind : invite | accept | decline | cancel
    send(kind, to, extra) {
      if (!ch || !me) return Promise.resolve('error');
      return ch.send({ type: 'broadcast', event: 'duel', payload: Object.assign({ kind, to, from: me.id, fromPseudo: me.pseudo }, extra || {}) });
    }
  };

  function start(client) {
    if (sb || !client) return;
    sb = client;
    // Jamais de requête attendue dans ce rappel (blocage possible de supabase-js) : on diffère.
    sb.auth.onAuthStateChange((ev, session) => setTimeout(() => setUser(session), 0));
  }

  async function setUser(session) {
    const uid = session ? session.user.id : null;
    if (me && me.id === uid) return;
    if (!me && !uid) { emit('me', null); return; }
    const seq = ++userSeq;
    leave();
    if (!uid) { emit('me', null); return; }
    const { data } = await sb.from('profiles').select('pseudo').eq('id', uid).maybeSingle();
    if (seq !== userSeq) return;
    me = { id: uid, pseudo: (data && data.pseudo) || 'joueur' };
    emit('me', me);
    join();
  }

  function leave() {
    if (ch) { sb.removeChannel(ch); ch = null; }
    me = null; online = new Map(); emit('presence', online);
  }

  function join() {
    // ack : send() n'est résolu qu'une fois le message reçu par le serveur (sinon un message
    // envoyé juste avant de changer de page, comme « accept », peut se perdre)
    ch = sb.channel('site-lobby', { config: { presence: { key: me.id }, broadcast: { self: false, ack: true } } });
    ch.on('presence', { event: 'sync' }, () => {
      const st = ch.presenceState(), m = new Map();
      Object.keys(st).forEach(id => {
        const metas = st[id] || [];
        if (!metas.length) return;
        m.set(id, { pseudo: metas[metas.length - 1].pseudo, status: metas.some(x => x.status === 'duel') ? 'duel' : 'online' });
      });
      online = m; emit('presence', online);
    });
    ch.on('broadcast', { event: 'duel' }, ({ payload: p }) => {
      if (!me || !p || p.to !== me.id || p.from === me.id) return;
      if (p.kind === 'invite') {
        if (status === 'duel') P.send('decline', p.from, { match: p.match, busy: true });
        else showInvite(p);
      } else if (p.kind === 'cancel') dropInvite(p.match);
      emit(p.kind, p);
    });
    ch.subscribe(s => { if (s === 'SUBSCRIBED' && me) ch.track(meta()).catch(() => {}); });
  }

  /* ---------- Invitation reçue ---------- */
  let box = null;
  function ensureBox() {
    if (box) return box;
    const css = document.createElement('style');
    css.textContent = `
.sp-box{position:fixed;right:16px;bottom:16px;z-index:9999;display:grid;gap:10px;width:min(360px,calc(100vw - 32px))}
.sp-inv{position:relative;overflow:hidden;padding:16px 16px 18px;border-radius:14px;background:var(--sheet,#fffefb);color:var(--ink,#1c1b19);
  border:1px solid var(--pen,#2446c8);box-shadow:0 18px 40px -16px rgba(0,0,0,.45);font:15px/1.45 var(--sans,Inter,system-ui,sans-serif);animation:sp-in .25s ease-out}
.sp-inv b{font-weight:700}
.sp-inv .sp-k{font:600 11.5px/1 var(--sans,Inter,system-ui,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:var(--pen,#2446c8);margin-bottom:6px}
.sp-row{display:flex;gap:8px;margin-top:12px}
.sp-row button{flex:1;min-height:40px;border-radius:10px;font:600 14px/1 var(--sans,Inter,system-ui,sans-serif);cursor:pointer;border:1px solid var(--rule-strong,#cdc8bb);background:var(--sheet,#fffefb);color:var(--ink,#1c1b19)}
.sp-row .sp-ok{background:var(--pen,#2446c8);border-color:var(--pen,#2446c8);color:var(--pen-ink,#fff)}
.sp-bar{position:absolute;left:0;bottom:0;height:3px;background:var(--pen,#2446c8);animation:sp-bar linear forwards}
@keyframes sp-in{from{transform:translateY(12px);opacity:0}}
@keyframes sp-bar{from{width:100%}to{width:0}}
@media (prefers-reduced-motion:reduce){.sp-inv,.sp-bar{animation:none}}`;
    document.head.appendChild(css);
    box = document.createElement('div');
    box.className = 'sp-box'; box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
    return box;
  }
  function dropInvite(match) { const el = box && box.querySelector(`[data-match="${CSS.escape(String(match))}"]`); if (el) el.remove(); }
  function showInvite(p) {
    dropInvite(p.match);
    const el = document.createElement('div');
    const ffa = p.mode === 'ffa';
    el.className = 'sp-inv'; el.dataset.match = p.match;
    el.innerHTML = `<div class="sp-k">${ffa ? '★ Partie FFA' : '⚔ Défi 1v1'} · Maths</div><div><b>${esc(p.fromPseudo)}</b> ${ffa ? 't\'invite à une partie FFA (chacun pour soi).' : 'te défie en duel.'}</div>
      <div class="sp-row"><button type="button" class="sp-no">Refuser</button><button type="button" class="sp-ok">Accepter</button></div>
      <span class="sp-bar" style="animation-duration:${INVITE_MS}ms"></span>`;
    const timer = setTimeout(() => el.remove(), INVITE_MS);
    el.querySelector('.sp-no').onclick = () => { clearTimeout(timer); el.remove(); P.send('decline', p.from, { match: p.match }); };
    el.querySelector('.sp-ok').onclick = async () => {
      clearTimeout(timer);
      el.querySelector('.sp-row').innerHTML = '<span>Connexion au duel…</span>';
      try { await Promise.race([P.send('accept', p.from, { match: p.match }), new Promise(r => setTimeout(r, 3000))]); } catch (e) { /* on y va quand même */ }
      location.href = `${ROOT}duel/?m=${encodeURIComponent(p.match)}&vs=${encodeURIComponent(p.from)}${ffa ? '&ffa=1' : ''}`;
    };
    ensureBox().appendChild(el);
    try { if (navigator.vibrate) navigator.vibrate(120); } catch (e) { /* ignore */ }
  }

  /* ---------- Indicateur de compte, à gauche du bouton thème (toutes les pages) ---------- */
  let badge = null, known = false;                // known : la session a été vérifiée auprès de Supabase
  const SYNC_TITLE = { sync: ' · synchronisation en cours…', ok: ' · progression synchronisée', err: ' · synchronisation incomplète, nouvel essai plus tard', notable: ' · base pas encore prête pour la synchro' };
  function renderBadge() {
    const theme = document.getElementById('themeBtn');
    if (!theme) return;
    if (!badge) {
      const css = document.createElement('style');
      css.textContent = `
.sp-top{display:inline-flex;align-items:center;gap:10px;min-width:0}
.sp-acc{display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--rule-strong,#cdc8bb);background:var(--sheet,#fffefb);color:var(--ink,#1c1b19);
  font:500 14px/1 var(--sans,Inter,system-ui,sans-serif);text-decoration:none;white-space:nowrap;max-width:230px}
.sp-acc:hover{border-color:var(--ink-2,#55524b)}
.sp-acc i{width:9px;height:9px;border-radius:50%;flex:none;background:#9a978e}
.sp-acc[data-s="in"] i{background:#0ca30c}
.sp-acc[data-s="sync"] i{background:#fab219}
.sp-acc[data-s="err"] i{background:#d03b3b}
.sp-acc .sp-l{color:var(--ink-2,#55524b)}
.sp-acc b{font-weight:600;overflow:hidden;text-overflow:ellipsis}
.sp-acc[data-s="out"]{border-color:var(--pen,#2446c8);color:var(--pen,#2446c8)}
.sp-acc[data-s="out"] .sp-l{color:inherit}
body[data-view="exam"] .sp-acc{display:none}
@media (max-width:720px){ .sp-acc{padding:0 12px;max-width:130px} .sp-acc .sp-l{display:none} .sp-acc[data-s="out"] .sp-l{display:inline} }`;
      document.head.appendChild(css);
      const wrap = document.createElement('span');
      wrap.className = 'sp-top';
      theme.parentNode.insertBefore(wrap, theme);
      badge = document.createElement('a');
      badge.className = 'sp-acc';
      wrap.appendChild(badge); wrap.appendChild(theme);
    }
    const A = window.SiteAccount, st = A && A.user ? A.status : '';
    badge.href = ROOT + '#compte';
    if (me) {
      badge.dataset.s = st === 'sync' ? 'sync' : st === 'err' || st === 'notable' ? 'err' : 'in';
      badge.innerHTML = `<i></i><span class="sp-l">Connecté ·</span><b>${esc(me.pseudo)}</b>`;
      badge.title = `Connecté en tant que ${me.pseudo}${SYNC_TITLE[st] || ''}. Cliquer pour gérer le compte.`;
    } else if (!known && hasSession()) {
      badge.dataset.s = 'wait';
      badge.innerHTML = '<i></i><span class="sp-l">Connexion…</span>';
      badge.title = 'Vérification du compte…';
    } else {
      badge.dataset.s = 'out';
      badge.innerHTML = '<i></i><span class="sp-l">Non connecté</span>';
      badge.title = 'Tu n\'es pas connecté : ta progression reste sur cet appareil. Cliquer pour te connecter.';
    }
  }
  P.on('me', () => { known = true; renderBadge(); });
  function hookAccount() {
    const A = window.SiteAccount; if (!A) return;
    A.on('status', renderBadge); A.on('change', renderBadge);
    A.ready.then(() => { if (!A.user && !sb) known = true; renderBadge(); });
  }
  if (window.SiteAccount) hookAccount(); else window.addEventListener('siteaccount', hookAccount, { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBadge); else renderBadge();

  /* ---------- Démarrage autonome (pages sans client Supabase) ---------- */
  function hasSession() {
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^sb-.*-auth-token$/.test(k)) return true; } } catch (e) { /* ignore */ }
    return false;
  }
  const load = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
  async function autoStart() {
    if (!hasSession()) return;                  // pas connecté : rien à charger
    try {
      if (!window.QCM_CONFIG) await load(ROOT + 'config.js');
      const C = window.QCM_CONFIG || {};
      if (!C.supabaseUrl || !C.supabaseAnonKey) return;
      if (!window.supabase || !window.supabase.createClient) await load(SUPABASE_JS);
      start(window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey));
    } catch (e) { console.warn('Présence 1v1 indisponible', e); }
  }
  if (!external) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoStart); else autoStart();
  }
})();
