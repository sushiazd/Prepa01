/* =====================================================================
   Moteur commun des pages de révision à parcours (ato, algo, elec2, phys, meca, maths-s1, maths-s1-analyse).
   Une nouveauté codée ici arrive dans les 7 matières d'un coup ; chaque page garde ses exercices
   (GEN, check, itemHTML…), son cours et ses écrans.
   Usage, en haut du script de la page :
     const E = SiteCore({ id: 'ato', DUR: 3600, …données et écrans de la page… });
     const { $, esc, ls, pst, startEx, … } = E;
   et à la fin : E.start();
   La page passe ses données par des accesseurs (get SK() { return SK; }) : elles ne sont lues qu'à
   l'usage, donc la page peut les déclarer après l'appel. CUR (exercice affiché), EXAM (sujet blanc) et
   VIEW (onglet) restent des variables de la page, lues et modifiées par le moteur via get / set.
   ===================================================================== */
(function () {
  'use strict';
  window.SiteCore = function (cfg) {
    /* ---------- Outils ---------- */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const app = $('#app');
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const ls = {
      get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
      set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } if (window.SiteAccount) SiteAccount.touch(k); }
    };
    let toastT = 0;
    function toast(t) { let el = $('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); } el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 3500); }
    // générateur pseudo-aléatoire à graine (un exercice se retrouve à l'identique)
    function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    const G = R => ({ int: (a, b) => a + Math.floor(R() * (b - a + 1)), pick: a => a[Math.floor(R() * a.length)], shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }, r: R });
    const newSeed = () => Math.floor(Math.random() * 4294967296);
    const PILL = { ok: '<span class="pill ok">Juste</span>', bad: '<span class="pill bad">Faux</span>', err: '<span class="pill bad">Illisible</span>', empty: '<span class="pill part">Vide</span>' };

    /* ---------- Compétences et progression (mêmes règles que le parcours d'élec) ---------- */
    const id = cfg.id, PK = id + '.path.v1', HK = id + '.hist.v1', EK = id + '.exam.v1', VAL = 100, MMAX = 130;
    const skById = k => cfg.SK.find(x => x.id === k);
    function pst() { const P = ls.get(PK, null) || {}; P.sk = P.sk || {}; P.n = P.n || 0; P.since = P.since || 0; return P; }
    function skS(P, k) { return P.sk[k] || (P.sk[k] = { m: 0, n: 0, ok: 0, st: 0, ko: 0, last: 0, ever: false }); }
    const isVal = s => s.m >= VAL, levelOf = s => s.m < 40 ? 0 : s.m < 80 ? 1 : 2;
    const frontier = P => cfg.SK.find(k => !isVal(skS(P, k.id))) || null;
    function pickNext(P) {
      const f = frontier(P), pool = cfg.SK.filter(k => k !== f && skS(P, k.id).ever);
      const rev = pool.length >= 2 && (P.since >= 6 || (P.since >= 3 && Math.random() < 0.35));
      if (f && !rev) return { k: f, review: false };
      if (!pool.length) return f ? { k: f, review: false } : null;
      const now = Date.now(), W = pool.map(k => { const s = skS(P, k.id); return [k, (MMAX + 20 - s.m) * (1 + Math.min(3, (now - s.last) / 864e5))]; });
      let r = Math.random() * W.reduce((a, w) => a + w[1], 0); for (const [k, w] of W) { if ((r -= w) <= 0) return { k, review: true }; }
      return { k: W[0][0], review: true };
    }
    function build(k, d, seed) { const ex = cfg.GEN[k](d, G(rng(seed))); ex.items.forEach((it, i) => { it.id = `${k}-${seed}-${i}`; }); return ex; }

    /* ---------- Exercice affiché (parcours ou entraînement libre) ---------- */
    // cfg.CUR : { mode: 'path'|'free', k, d, seed, review, ex, ans, first: {}, done }
    function startEx(k, o = {}) {
      const P = pst(), s = skS(P, k.id), R = o.resume || null;
      const d = R ? R.d : o.d != null ? o.d : o.review ? 2 : levelOf(s), seed = R ? R.seed : newSeed();
      cfg.CUR = { mode: o.mode || 'path', k, d, seed, review: R ? !!R.review : !!o.review, ans: R ? Object.assign({}, R.ans) : {}, first: R ? Object.assign({}, R.first) : {}, peek: !!(R && R.peek), done: false };
      cfg.CUR.ex = build(k.id, d, seed);
      if (cfg.CUR.mode === 'path' && !R) saveCur(!!o.user);
      cfg.renderEx();
    }
    function saveCur(bump = true) {
      const CUR = cfg.CUR;
      if (!CUR || CUR.mode !== 'path') return;
      const P = pst();
      P.cur = CUR.done ? null : { id: CUR.k.id, d: CUR.d, seed: CUR.seed, review: CUR.review, ans: CUR.ans, first: CUR.first, peek: CUR.peek };
      if (bump) P.curT = Date.now();
      ls.set(PK, P);
    }
    // r : part juste du premier coup (0 à 1) ; met à jour la maîtrise de la compétence
    function finish(r) {
      const CUR = cfg.CUR;
      CUR.done = true;
      const host = $('#exHost');
      $('details.corr', host).open = true;
      if (CUR.mode === 'free') { host.insertAdjacentHTML('beforeend', `<div class="card res"><div class="row"><span class="pill ${r === 1 ? 'ok' : r >= .5 ? 'part' : 'bad'}">${Math.round(r * 100)} % juste</span><span class="sp"></span><button type="button" class="btn btn-primary" data-act="again">Nouvel exercice</button></div></div>`); if (cfg.typeset) cfg.typeset(host); return; }
      const P = pst(), k = CUR.k, s = skS(P, k.id), was = isVal(s), m0 = s.m;
      s.n++; if (r === 1) s.ok++;
      const gain = CUR.review ? (r === 1 ? 15 : r >= .5 ? 0 : -30) : r === 1 ? (s.st >= 1 ? 60 : 40) : r >= .5 ? 15 : -20;
      if (r === 1) { s.st++; s.ko = 0; } else { s.st = 0; if (r < .5) s.ko++; }
      s.m = Math.max(0, Math.min(MMAX, s.m + gain)); s.last = Date.now(); if (isVal(s)) s.ever = true;
      P.n++; P.since = CUR.review ? 0 : P.since + 1; P.cur = null; P.curT = Date.now();
      ls.set(PK, P);
      const f = frontier(P), now = isVal(s);
      const title = CUR.review ? (r === 1 ? 'Toujours acquis' : was && !now ? 'Un peu oublié' : 'À surveiller') : !was && now ? 'Compétence validée !' : r === 1 ? 'Parfait' : r >= .5 ? 'Presque' : 'Pas encore';
      const msg = !was && now ? (f ? `Prochaine étape : « ${f.name} ».` : 'Tout le parcours est validé : passe au sujet blanc.') : r === 1 ? (s.m + 60 >= VAL ? 'Encore un sans-faute et c\'est validé.' : 'Continue.') : 'Lis la correction (ouverte ci-dessus) : tu restes sur cette compétence.' + (s.ko >= 2 ? ' Le prochain exercice sera plus simple.' : '');
      host.insertAdjacentHTML('beforeend', `<div class="card res"><div class="row"><span class="pill ${r === 1 ? 'ok' : r >= .5 ? 'part' : 'bad'}">${Math.round(r * 100)} % juste du premier coup</span></div><h3 style="font:600 21px/1.3 var(--serif);margin-top:10px">${esc(title)}</h3><p class="sub">${esc(msg)}</p>
        <div class="row" style="margin-top:10px"><span class="fine">Maîtrise : ${Math.min(100, Math.round(m0))} % → <b>${Math.min(100, Math.round(s.m))} %</b></span></div>
        <div class="row" style="margin-top:12px"><button type="button" class="btn btn-primary btn-lg" data-act="next">Continuer</button></div></div>`);
      if (!was && now && !CUR.review) toast('Compétence validée : ' + k.name);
      renderPathTop(); renderMap();
    }

    /* ---------- Onglets ---------- */
    const TABS = ['home', 'path', 'cours', 'exos', 'blanc'];
    function setTab(t) {
      if (cfg.EXAM && cfg.EXAM.running && t !== 'blanc') { toast('Un sujet blanc est en cours.'); t = 'blanc'; }
      cfg.VIEW = t;
      $$('#tabs .tab').forEach(b => b.setAttribute('aria-current', b.dataset.tab === t ? 'page' : 'false'));
      (t === 'path' ? vPath : cfg.views[t])();
      if (location.hash !== '#' + t) history.replaceState(null, '', '#' + t);
      window.scrollTo(0, 0);
    }

    /* ---------- Parcours ---------- */
    function renderPathTop() {
      const el = $('#pathTop'); if (!el) return;
      const SK = cfg.SK, CUR = cfg.CUR, P = pst(), done = SK.filter(k => isVal(skS(P, k.id))).length, f = frontier(P);
      el.innerHTML = `<section class="card"><div class="row"><div class="count"><b>${done}/${SK.length}</b><span>compétences validées</span></div><span class="sp"></span>
        ${CUR && CUR.mode === 'path' && !CUR.done ? '<button type="button" class="btn btn-ghost" data-act="skip">Changer d\'exercice</button>' : `<button type="button" class="btn btn-primary btn-lg" data-act="next">${P.n ? 'Continuer' : 'Commencer'}</button>`}</div>
        <div class="bar ${done / SK.length >= .75 ? '' : done / SK.length >= .35 ? 'mid' : 'low'}" style="margin-top:12px"><i style="width:${Math.round(100 * done / SK.length)}%"></i></div>
        <p class="sub" style="margin-top:8px">${f ? `Prochaine étape : <b>${esc(f.name)}</b>` : 'Tout est validé : fais un sujet blanc.'} · Deux sans-faute d'affilée valident une compétence ; en cas d'erreurs, les exercices se simplifient et les compétences validées reviennent en révision.</p></section>`;
    }
    function renderMap() {
      const el = $('#pathMap'); if (!el) return;
      const CUR = cfg.CUR, P = pst(), f = frontier(P);
      el.innerHTML = cfg.CH.map((c, ci) => `<div class="pch"><h3>${ci + 1}. ${esc(c)}</h3>${cfg.SK.filter(k => k.ch === ci).map(k => {
        const s = skS(P, k.id), val = isVal(s), open = val || k === f || s.n > 0, pct = Math.min(100, Math.round(s.m));
        return `<div class="psk ${val ? 'val' : k === f ? 'cur' : s.ever ? 'rev' : open ? 'cur' : 'lock'}"><span class="ic">${val ? '✓' : k === f ? '▶' : s.ever ? '!' : ''}</span><span class="nm">${esc(k.name)}${s.ever && !val ? '<small>à revoir</small>' : ''}</span>
          <div class="bar ${pct >= 100 ? '' : pct >= 40 ? 'mid' : 'low'}"><i style="width:${pct}%"></i></div>${open ? `<button type="button" class="btn" data-go="${k.id}">${CUR && CUR.mode === 'path' && !CUR.done && CUR.k === k ? 'Reprendre' : k === f ? 'Continuer' : 'S\'entraîner'}</button>` : '<span class="fine">verrouillé</span>'}</div>`;
      }).join('')}</div>`).join('');
    }
    function nextPath(o = {}) {
      const P = pst();
      if (!o.fresh && P.cur && skById(P.cur.id)) { startEx(skById(P.cur.id), { resume: P.cur }); renderPathTop(); renderMap(); return; }
      const n = pickNext(P); if (!n) return;
      startEx(n.k, { review: n.review, user: o.user }); renderPathTop(); renderMap();
    }
    function vPath() {
      app.innerHTML = `<div><p class="eyebrow">Parcours guidé</p><h1>Le parcours</h1></div><div id="pathTop"></div><div id="exHost" style="display:grid;gap:16px"></div><section class="card"><h2>La carte</h2><div id="pathMap"></div></section>`;
      renderPathTop(); renderMap();
      if (cfg.CUR && cfg.CUR.mode === 'path') cfg.renderEx(); else if (pst().n || pst().cur) nextPath();
    }

    /* ---------- Sujet blanc : chrono et synchronisation ---------- */
    let tick = 0;
    const stopTick = () => clearInterval(tick);
    // cfg.DUR en secondes ; cfg.clock 'ms' : 59:59, sinon 1:29:59
    function startTick() {
      clearInterval(tick); const clk = $('#clock'), EXAM = cfg.EXAM, DUR = cfg.DUR;
      if (!EXAM || EXAM.done) { clk.hidden = true; return; }
      clk.hidden = false;
      const two = n => String(n).padStart(2, '0');
      const upd = () => {
        const left = DUR - (Date.now() - EXAM.t0) / 1000, l = Math.max(0, left);
        clk.textContent = cfg.clock === 'ms' ? `${Math.floor(l / 60)}:${two(Math.floor(l % 60))}` : `${Math.floor(l / 3600)}:${two(Math.floor(l % 3600 / 60))}:${two(Math.floor(l % 60))}`;
        clk.classList.toggle('rush', left < (cfg.rush || 600)); if (left <= 0) cfg.submitExam(true);
      };
      upd(); tick = setInterval(upd, 1000);
    }
    // Sujet blanc modifié sur un autre appareil (account.js) : mêmes réponses ici, ou sujet rendu ou remplacé là-bas
    function examSynced() {
      const E = ls.get(EK, null), open = E && !E.closed && !E.done ? E : null, EXAM = cfg.EXAM;
      if (EXAM && EXAM.done) return;
      if (EXAM && open && open.seed === EXAM.seed) {
        EXAM.ans = Object.assign({}, open.ans);
        const typing = document.activeElement && document.activeElement.matches('#app input, #app textarea');
        if (cfg.VIEW === 'blanc' && !typing) cfg.renderExam();
        return;
      }
      if (EXAM) {
        cfg.EXAM = null; stopTick(); $('#clock').hidden = true;
        toast(open ? 'Un autre sujet blanc a été commencé sur ton autre appareil.' : 'Sujet blanc rendu sur ton autre appareil : la note est dans « Mes copies ».');
      }
      if (cfg.VIEW === 'blanc') cfg.views.blanc();
    }
    /* ---------- Sujet ciblé (points faibles) ----------
       Même durée et même barème sur 20 que le sujet blanc, mais une partie par compétence faible : pas
       encore validée dans le parcours, peu maîtrisée, ou souvent ratée dans les dernières copies.
       La page appelle examPlan(EXAM_PLAN) dans examExos, tally(it, score) pour chaque réponse corrigée,
       et ajoute examRecord() à la copie enregistrée (réussite par compétence, pour les prochains ciblages). */
    let TALLY = {};
    const skOf = it => it.id.slice(0, it.id.lastIndexOf('-', it.id.lastIndexOf('-') - 1));   // id : compétence-graine-n°
    function tally(it, sc) { const t = TALLY[skOf(it)] || (TALLY[skOf(it)] = [0, 0]); t[0] += sc; t[1]++; return sc; }
    function examRecord() {
      const sk = {}; Object.keys(TALLY).forEach(k => { sk[k] = [Math.round(TALLY[k][0] * 100) / 100, TALLY[k][1]]; });
      TALLY = {};
      return cfg.EXAM && cfg.EXAM.target ? { sk, cible: true } : { sk };
    }
    const examPlan = def => (cfg.EXAM && cfg.EXAM.target) || def;
    // les compétences à retravailler, de la plus faible à la moins faible
    function weakSkills(n = 5) {
      const P = pst(), rate = {};
      ls.get(HK, []).slice(-8).forEach(r => Object.keys(r.sk || {}).forEach(k => { const t = rate[k] || (rate[k] = [0, 0]); t[0] += r.sk[k][0]; t[1] += r.sk[k][1]; }));
      return cfg.SK.map((k, i) => {
        const s = skS(P, k.id), r = rate[k.id];
        const score = (isVal(s) ? 0 : 2) + (1 - Math.min(s.m, VAL) / VAL) + (r && r[1] ? 2 * (1 - r[0] / r[1]) : 0);
        return { k, s, score, i };
      }).sort((a, b) => b.score - a.score || a.i - b.i).slice(0, n);
    }
    function weakPlan() {
      const W = weakSkills();
      return W.map(({ k, s }) => [`Point faible · ${k.name}`, [[k.id, Math.max(1, levelOf(s))]], 20 / W.length]);
    }
    // bouton à côté de « Commencer » dans l'onglet Sujet blanc
    const weakButton = () => `<button type="button" class="btn btn-lg" data-act="examWeak">Sujet ciblé (points faibles)</button>
      <p class="fine" style="flex-basis:100%;order:9">Le sujet ciblé porte sur : ${weakSkills().map(w => esc(w.k.name)).join(' · ')}.</p>`;
    document.addEventListener('click', e => {
      if (!e.target.closest('[data-act="examWeak"]')) return;
      cfg.EXAM = { seed: newSeed(), t0: Date.now(), ans: {}, running: true, done: false, target: weakPlan() };
      ls.set(EK, cfg.EXAM); cfg.renderExam();
    });

    // Progression venue d'un autre appareil
    function wireAccount() {
      const A = window.SiteAccount; if (!A) return;
      A.on('data', keys => {
        if (keys.includes(EK)) examSynced();
        if (!keys.some(k => k.startsWith(id + '.'))) return;
        const CUR = cfg.CUR;
        if (CUR && CUR.mode === 'path' && !CUR.done && !Object.keys(CUR.first).length && !Object.keys(CUR.ans).length) cfg.CUR = null;
        if (cfg.VIEW === 'path') vPath(); else if (cfg.VIEW === 'home') cfg.views.home();
      });
    }

    /* ---------- Événements communs ---------- */
    document.addEventListener('change', e => { if (e.target.type === 'radio') e.target.dispatchEvent(new Event('input', { bubbles: true })); });
    document.addEventListener('toggle', e => { const CUR = cfg.CUR; if (CUR && !CUR.done && e.target.matches && e.target.matches('#exHost details.corr') && e.target.open) { CUR.peek = true; saveCur(); } }, true);
    // thème clair / sombre / automatique (même réglage sur tout le site)
    (function () {
      const ICON = { sun: '☀', moon: '☾', auto: '◐' }, KEY = 'qcm-maths-theme', btn = $('#themeBtn');
      function apply(t) { if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t; btn.textContent = ICON[t === 'auto' ? 'auto' : t === 'light' ? 'sun' : 'moon']; btn.dataset.mode = t; btn.title = 'Thème : ' + ({ auto: 'automatique', light: 'clair', dark: 'sombre' })[t]; }
      let t = 'auto'; try { t = localStorage.getItem(KEY) || 'auto'; } catch (e) { /* ignore */ }
      apply(t);
      btn.addEventListener('click', () => { const nx = ({ auto: 'light', light: 'dark', dark: 'auto' })[btn.dataset.mode]; try { localStorage.setItem(KEY, nx); } catch (e) { /* ignore */ } apply(nx); });
    })();
    if (window.SiteAccount) wireAccount(); else window.addEventListener('siteaccount', wireAccount, { once: true });

    // à appeler à la fin du script de la page : ouvre l'onglet de l'adresse (#path, #blanc…)
    function start() {
      if (window.SiteSubjects && SiteSubjects.get(id) && SiteSubjects.get(id).skills !== cfg.SK.length) console.warn(`subjects.js : ${id} a ${cfg.SK.length} compétences, pas ${SiteSubjects.get(id).skills}`);
      const boot = () => { const h = location.hash.slice(1); setTab(TABS.includes(h) ? h : 'home'); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    }

    return { $, $$, app, esc, ls, toast, rng, G, newSeed, PILL, PK, HK, EK, VAL, MMAX, skById, pst, skS, isVal, levelOf, frontier, pickNext, build,
      startEx, saveCur, finish, setTab, renderPathTop, renderMap, nextPath, vPath, startTick, stopTick, examSynced, start,
      tally, examRecord, examPlan, weakSkills, weakPlan, weakButton };
  };
})();
