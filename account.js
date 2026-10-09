/* =====================================================================
   Compte du site et synchronisation des données entre appareils.
   - Un seul compte Supabase pour tout le site : la session est partagée par toutes les pages
     (même domaine), donc se connecter sur l'accueil connecte aussi le QCM maths et le 1v1.
   - Les données locales listées dans SYNC (progression élec…) sont copiées dans la table
     user_data, une ligne par clé, et fusionnées à chaque ouverture de page ou retour sur l'onglet.
   - Démarre aussi la présence en ligne (presence.js chargé avec data-external).
   Usage : <script defer src="account.js"></script>          → toujours chargé (accueil)
           <script defer src="../account.js" data-lazy></script> → seulement si une session existe
   API : SiteAccount.on('change' | 'status' | 'data', f), .user, .profile, .status,
         .signIn(email, pw), .signUp(email, pw, pseudo), .signOut(), .touch(key), .syncNow()
   ===================================================================== */
(function () {
  'use strict';
  const script = document.currentScript;
  const ROOT = new URL('.', script.src).href;
  const lazy = script.hasAttribute('data-lazy');
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js';
  const META = 'site.sync.v1';          // { owner, t: {clé: modif. locale ms}, s: {clé: dernière synchro ms} }

  /* ---------- Clés synchronisées et règles de fusion ---------- */
  const newestSkill = P => Math.max(0, ...Object.values((P && P.sk) || {}).map(s => s.last || 0));
  const SYNC = {
    // parcours : compétence par compétence, on garde la plus récemment travaillée
    'elec.path.v1': (L, R) => {
      const top = newestSkill(L) >= newestSkill(R) ? L : R, sk = {};
      new Set([...Object.keys(L.sk || {}), ...Object.keys(R.sk || {})]).forEach(id => {
        const a = (L.sk || {})[id], b = (R.sk || {})[id];
        sk[id] = !a ? b : !b ? a : (a.last || 0) > (b.last || 0) || ((a.last || 0) === (b.last || 0) && a.n >= b.n) ? a : b;
      });
      // exercice en cours : celui touché le plus récemment par l'élève (curT)
      const c = (L.curT || 0) >= (R.curT || 0) ? L : R;
      return Object.assign({}, top, { sk, n: Math.max(L.n || 0, R.n || 0), cur: c.cur || null, curT: c.curT || 0 });
    },
    // compteurs : on garde le plus avancé (additionner compterait deux fois les mêmes réponses)
    'elec.stats.v1': (L, R) => {
      const out = Object.assign({}, R, L), big = (a, b) => !a ? b : !b ? a : (a.n || 0) >= (b.n || 0) ? a : b;
      ['ex2', 'ex3', 'ex4'].forEach(k => { out[k] = big(L[k], R[k]); });
      out.demo = {}; new Set([...Object.keys(L.demo || {}), ...Object.keys(R.demo || {})]).forEach(id => { out.demo[id] = big((L.demo || {})[id], (R.demo || {})[id]); });
      return out;
    },
    // copies rendues : union par identifiant
    'elec.hist.v1': (L, R, localWins) => {
      const m = new Map();
      (localWins ? [R, L] : [L, R]).forEach(arr => (Array.isArray(arr) ? arr : []).forEach(r => { if (r && r.id) m.set(r.id, r); }));
      return [...m.values()].sort((a, b) => a.ts - b.ts);
    },
    'elec.plan.v1': null,                // le plus récent gagne
    'elec.ccdate.v1': null,
    'planning.v1': null,                 // lien d'export de l'emploi du temps (le plus récent gagne)
    // mode Streak : meilleur record par matière et par source, série en cours la plus récente
    'streak.v1': (L, R) => {
      const best = Object.assign({}, R.best || {}, L.best || {});
      Object.keys(best).forEach(k => { const a = (L.best || {})[k], b = (R.best || {})[k]; best[k] = !a ? b : !b ? a : (a.n >= b.n ? a : b); });
      const c = (L.curT || 0) >= (R.curT || 0) ? L : R;
      return { best, runs: Math.max(L.runs || 0, R.runs || 0), total: Math.max(L.total || 0, R.total || 0), cur: c.cur || null, curT: c.curT || 0 };
    }
  };
  // atomistique : mêmes règles que l'élec (parcours compétence par compétence, copies réunies)
  SYNC['ato.path.v1'] = SYNC['elec.path.v1'];
  SYNC['ato.hist.v1'] = SYNC['elec.hist.v1'];
  const KEYS = Object.keys(SYNC);

  /* ---------- Outils ---------- */
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const put = (k, v) => { try { if (v === undefined || v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const listeners = {};
  const emit = (ev, d) => (listeners[ev] || []).forEach(f => { try { f(d); } catch (e) { console.warn(e); } });
  const meta = () => { const m = get(META, {}) || {}; m.t = m.t || {}; m.s = m.s || {}; return m; };

  let sb = null, user = null, profile = null, status = 'off', userSeq = 0;
  let pushT = null, pulling = false, lastPull = 0, readyFn;
  const ready = new Promise(r => { readyFn = r; });
  const setStatus = s => { status = s; emit('status', s); };

  const A = window.SiteAccount = {
    ROOT, KEYS, ready,
    on(ev, f) { (listeners[ev] = listeners[ev] || []).push(f); },
    get client() { return sb; },
    get user() { return user; },
    get profile() { return profile; },
    get status() { return status; },
    get configured() { const C = window.QCM_CONFIG || {}; return !!(C.supabaseUrl && C.supabaseAnonKey); },
    touch(key) {
      if (!SYNC.hasOwnProperty(key)) return;
      const m = meta(); m.t[key] = Date.now(); put(META, m);
      if (!user) return;
      clearTimeout(pushT); pushT = setTimeout(push, 1200);
    },
    syncNow: () => pull(true),
    async signIn(email, password) { await boot(true); const { error } = await sb.auth.signInWithPassword({ email, password }); if (error) throw error; },
    async signUp(email, password, pseudo) {
      await boot(true);
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { pseudo } } });
      if (error) throw error;
      return !!data.session;
    },
    async signOut() {
      if (!sb) return;
      clearTimeout(pushT);                        // dernières modifs envoyées avant de partir
      for (let i = 0; pulling && i < 50; i++) await new Promise(r => setTimeout(r, 100));
      await push();
      await sb.auth.signOut();
      // comme le QCM maths : les données restent sur le compte mais quittent cet appareil
      KEYS.forEach(k => put(k, null));
      put('qcmhub.controls.v1', []); put('qcmhub.attempts.v1', []); put('qcmhub.owner.v1', null);
      put(META, {});
      emit('data', KEYS);
    }
  };

  try { window.dispatchEvent(new Event('siteaccount')); } catch (e) { /* ignore */ }

  /* ---------- Synchronisation ----------
     Toujours « lire, fusionner, puis écrire » : un envoi n'écrase jamais ce qu'un autre appareil
     a enregistré entre-temps. Une clé est « à envoyer » tant que sa modif. locale (t) est plus
     récente que sa dernière synchro réussie (s). */
  let again = false;
  async function pull(force) {
    if (!user) return;
    if (pulling) { again = true; return; }
    if (!force && Date.now() - lastPull < 20000) return;
    const uid = user.id, still = () => user && user.id === uid;
    pulling = true; setStatus('sync');
    try {
      const m = meta();
      // données locales d'un autre compte : on ne les mélange pas
      if (m.owner && m.owner !== uid) { KEYS.forEach(k => put(k, null)); m.t = {}; m.s = {}; }
      if (!m.owner) KEYS.forEach(k => { if (get(k, null) != null && !m.t[k]) m.t[k] = Date.now(); });   // données faites sans compte : on les garde
      m.owner = uid; put(META, m);
      const { data, error } = await sb.from('user_data').select('key,value,updated_at').eq('user_id', uid).in('key', KEYS);
      if (error) throw error;
      if (!still()) return;
      const m2 = meta(), snap = Date.now();     // relu : une modif. a pu arriver pendant la requête
      const R = new Map((data || []).map(r => [r.key, r])), changed = [], up = [];
      KEYS.forEach(k => {
        const loc = get(k, null), row = R.get(k), rem = row ? row.value : null, rt = row ? Date.parse(row.updated_at) : 0;
        const dirty = (m2.t[k] || 0) > (m2.s[k] || 0);
        const localWins = dirty && (m2.t[k] || 0) >= rt;
        let val;
        if (loc == null) val = rem;
        else if (rem == null) val = loc;
        else if (SYNC[k]) val = SYNC[k](loc, rem, localWins);
        else val = localWins ? loc : rem;
        if (!same(val, loc)) { put(k, val); changed.push(k); }
        if (val != null && !same(val, rem)) up.push(k);
      });
      if (up.length) await upsert(uid, up);
      // synchro réussie : seulement maintenant on marque les clés comme envoyées
      const m3 = meta(); KEYS.forEach(k => { m3.s[k] = snap; }); put(META, m3);
      lastPull = Date.now();
      if (still()) { setStatus('ok'); if (changed.length) emit('data', changed); }
    } catch (e) { console.warn('Synchronisation', e); if (still()) setStatus(/user_data/.test(String(e && e.message)) ? 'notable' : 'err'); }
    finally { pulling = false; if (again) { again = false; pull(true); } }
  }
  async function upsert(uid, keys) {
    const now = new Date().toISOString();
    const rows = keys.map(k => ({ user_id: uid, key: k, value: get(k, null), updated_at: now })).filter(r => r.value != null);
    if (!rows.length) return;
    const { error } = await sb.from('user_data').upsert(rows);
    if (error) throw error;
  }
  function push() {
    if (!user) return Promise.resolve();
    const m = meta();
    if (!KEYS.some(k => (m.t[k] || 0) > (m.s[k] || 0))) return Promise.resolve();
    return pull(true);
  }

  /* ---------- Session ---------- */
  async function setSession(session) {
    const uid = session ? session.user.id : null;
    if ((user && user.id) === uid && (uid || status !== 'off')) return;
    const seq = ++userSeq;
    user = session ? session.user : null; profile = null;
    if (!user) { setStatus('off'); emit('change', null); readyFn(); return; }
    const { data } = await sb.from('profiles').select('id,pseudo,visible').eq('id', uid).maybeSingle();
    if (seq !== userSeq) return;
    profile = data || { id: uid, pseudo: (user.user_metadata && user.user_metadata.pseudo) || 'moi' };
    emit('change', user); readyFn();
    await pull(true);
  }

  const load = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
  function hasSession() {
    try { for (let i = 0; i < localStorage.length; i++) if (/^sb-.*-auth-token$/.test(localStorage.key(i))) return true; } catch (e) { /* ignore */ }
    return false;
  }
  let booting = null;
  function boot(force) {
    if (booting) return booting;
    if (lazy && !force && !hasSession()) { readyFn(); return Promise.resolve(); }
    booting = (async () => {
      if (!window.QCM_CONFIG) await load(ROOT + 'config.js');
      if (!A.configured) throw new Error('Site non relié à sa base de données (config.js).');
      if (!window.supabase || !window.supabase.createClient) await load(SUPABASE_JS);
      sb = window.supabase.createClient(window.QCM_CONFIG.supabaseUrl, window.QCM_CONFIG.supabaseAnonKey);
      if (window.SitePresence) window.SitePresence.start(sb);
      // jamais de requête attendue dans ce rappel (blocage possible de supabase-js) : on diffère
      sb.auth.onAuthStateChange((ev, session) => setTimeout(() => setSession(session), 0));
    })();
    booting.catch(e => { console.warn('Compte indisponible', e); readyFn(); });
    return booting;
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (pushT) { clearTimeout(pushT); push(); } } else pull(false); });
  window.addEventListener('online', () => pull(true));
  window.addEventListener('pagehide', () => { if (pushT) { clearTimeout(pushT); push(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => boot(false)); else boot(false);
})();
