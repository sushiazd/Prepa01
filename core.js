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
      clk.hidden = false; aiBar();
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
    // les compétences à retravailler, de la plus faible à la moins faible, parmi celles déjà travaillées ou
    // atteintes dans le parcours (pas les chapitres à venir, comme la partie 2 d'ato avant le CC de la partie 1)
    function weakSkills(n = 5) {
      const P = pst(), rate = {}, f = frontier(P), fi = f ? cfg.SK.indexOf(f) : cfg.SK.length - 1;
      ls.get(HK, []).slice(-8).forEach(r => Object.keys(r.sk || {}).forEach(k => { const t = rate[k] || (rate[k] = [0, 0]); t[0] += r.sk[k][0]; t[1] += r.sk[k][1]; }));
      let pool = cfg.SK.filter((k, i) => i <= fi || skS(P, k.id).n > 0 || rate[k.id]);
      if (pool.length < n) pool = pool.concat(cfg.SK.filter(k => !pool.includes(k)).slice(0, n - pool.length));
      return pool.map(k => {
        const i = cfg.SK.indexOf(k);
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

    /* ---------- Copie rendue : corrigés des parties ratées masqués ----------
       Une partie dont une réponse est fausse ou vide garde son corrigé fermé (« Voir le corrigé ») : on peut
       la chercher encore hors chrono avant de lire la solution. La page appelle hideCorr() à la fin de
       renderExam quand la copie est rendue (EXAM.done), une fois les pastilles Juste / Faux / Vide posées. */
    // Retenter à chaud : dans une partie masquée, on corrige ses réponses (ou son code) puis « Vérifier mon essai ».
    // Purement local : ni la note, ni la copie enregistrée ne changent. Tout juste → « ✓ Trouvé après coup ! »
    // et le corrigé s'ouvre. La page fournit cfg.examItems (questions du sujet), cfg.check, cfg.valOf (et cfg.fbHTML).
    const barText = n => `${n} corrigé${n > 1 ? 's' : ''} masqué${n > 1 ? 's' : ''} : les parties avec une réponse fausse ou vide. Corrige tes réponses et clique sur « Vérifier mon essai », ou ouvre « Voir le corrigé ».`;
    function hideCorr() {
      if (cfg.EXAM && cfg.EXAM.ai) { aiDecorate(); return; }   // copie corrigée par une IA : ses remarques à côté du corrigé, rien de masqué
      const hidden = $$('details.corr', app).filter(det => $$('.fb .pill', det.closest('.ex') || det.parentElement).some(p => !p.classList.contains('ok')));
      hidden.forEach(det => {
        det.open = false; det.querySelector('summary').textContent = 'Voir le corrigé';
        if (cfg.examItems) det.insertAdjacentHTML('beforebegin', `<div class="row retry" style="margin-top:14px"><button type="button" class="btn btn-primary" data-act="tryPart">Vérifier mon essai</button><span class="fine" data-trymsg>Tant que le corrigé est fermé, tu peux encore chercher : modifie tes réponses ci-dessus. Ça ne change ni la note ni la copie.</span></div>`);
      });
      if (!hidden.length || !app.firstElementChild) return;
      app.firstElementChild.insertAdjacentHTML('afterend', `<section class="card" id="corrBar"><div class="row"><p class="sub" style="margin:0;flex:1;min-width:220px">${barText(hidden.length)}</p><button type="button" class="btn" data-act="revealAll">Tout révéler</button></div></section>`);
    }
    async function tryPart(b) {
      const part = b.closest('.ex') || b.parentElement.parentElement, det = $('details.corr', part), msg = $('[data-trymsg]', part);
      const items = cfg.examItems().filter(it => $(`.it[data-id="${it.id}"]`, part));
      b.disabled = true; msg.textContent = 'Vérification…';
      let ok = 0;
      for (const it of items) {
        const r = await cfg.check(it, cfg.valOf(part, it.id)), fb = $(`.it[data-id="${it.id}"] .fb`, part);
        if (fb) fb.innerHTML = '<span class="fine">essai :</span> ' + (cfg.fbHTML ? cfg.fbHTML(r) : PILL[r.st] + (r.msg ? ' <span>' + esc(r.msg) + '</span>' : ''));
        if (r.st === 'ok') ok++;
      }
      b.disabled = false;
      const n = (+part.dataset.tries || 0) + 1; part.dataset.tries = n;
      if (cfg.typeset) cfg.typeset(part);
      if (ok === items.length) {
        b.closest('.retry').outerHTML = `<div class="row" style="margin-top:14px"><span class="pill ok">✓ Trouvé après coup !${n > 1 ? ` (${n} essais)` : ''}</span><span class="fine">Pas compté dans la note de la copie.</span></div>`;
        if (det) { det.open = true; det.querySelector('summary').textContent = 'Correction'; }
        const left = $$('[data-act="tryPart"]', app).length, bar = $('#corrBar');
        if (bar) { if (left) $('p', bar).textContent = barText(left); else bar.remove(); }
      } else msg.innerHTML = `<b style="color:var(--bad)">✗ Pas encore</b> : ${items.length - ok} réponse${items.length - ok > 1 ? 's' : ''} fausse${items.length - ok > 1 ? 's' : ''} ou vide${items.length - ok > 1 ? 's' : ''} (essai n° ${n}). Cherche encore, ou ouvre le corrigé.`;
    }
    // corrigé ouvert à la main : plus d'essai possible pour cette partie
    document.addEventListener('toggle', e => {
      const d = e.target, r = d.open && d.matches && d.matches('details.corr') && d.previousElementSibling;
      if (!r || !r.classList.contains('retry')) return;
      r.remove();
      const left = $$('[data-act="tryPart"]', app).length, bar = $('#corrBar');
      if (bar) { if (left) $('p', bar).textContent = barText(left); else bar.remove(); }
    }, true);
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-act="tryPart"]');
      if (t) { if (cfg.EXAM && cfg.EXAM.done) tryPart(t); return; }
      if (!e.target.closest('[data-act="revealAll"]')) return;
      $$('details.corr', app).forEach(d => { d.open = true; });
      $$('.retry', app).forEach(r => r.remove());
      const bar = $('#corrBar'); if (bar) bar.remove();
    });

    /* ---------- Copie sur papier corrigée par une IA externe (ChatGPT, Claude, Gemini…) ----------
       Pendant un sujet blanc, l'élève rédige sur papier ou tablette. On génère un prompt qui contient tout le
       sujet, les réponses exactes et le corrigé détaillé de chaque partie (la vérité de référence) ; l'élève
       l'envoie à l'IA de son choix avec la photo de sa copie, puis colle la réponse. Le bloc JSON entre
       ===PREPA01_START=== et ===PREPA01_END=== donne les points de chaque partie : la copie est rendue avec
       cette note, enregistrée (« Corrigé IA ») et la maîtrise des compétences est mise à jour.
       La page fournit cfg.exam() (les parties du sujet) et, si besoin, cfg.answerText(item). */
    const AI_RULES = {
      ato: 'Exige la configuration électronique complète (1s2 2s2 2p6…) : une notation abrégée avec un gaz rare, [Ar] ou (Ar), ne rapporte pas les points quand l\'énoncé demande la configuration complète. Exige les justifications demandées (pourquoi un ion est hydrogénoïde, comparaison de rayons ou d\'énergies d\'ionisation), les conversions et unités (nm, m, eV, J), les cases quantiques dessinées, et en partie 2 des schémas de Lewis dessinés avec tous les doublets et charges formelles.',
      algo: 'Le code est écrit à la main, sans interpréteur : vérifie la syntaxe Python (indentation, deux-points, return et non print), le respect des interdictions de l\'énoncé (max, min, sum, count…), les cas limites (liste vide, 0, un seul élément) et la justification des complexités. Une fonction correcte écrite autrement que le corrigé a tous les points ; une fonction qui ne marcherait pas si on l\'exécutait n\'a pas les points du résultat.',
      phys: 'Exige le schéma, le référentiel et le repère, le bilan des forces complet, les projections sur les axes, les expressions littérales avant toute application numérique, l\'homogénéité, les unités et le bon nombre de chiffres significatifs. Une démonstration demandée doit être menée jusqu\'au bout.',
      meca: 'Exige l\'isolement du solide, le schéma des actions mécaniques extérieures, les torseurs écrits au bon point avec toutes leurs composantes, la justification des actions transmissibles par chaque liaison, le principe fondamental de la statique écrit en entier (résultante et moment), les unités.',
      ms1: 'Exige les justifications : pas de table de vérité quand l\'énoncé l\'interdit, quantificateurs écrits dans le bon ordre, négations exactes, raisonnement annoncé (absurde, contraposée, récurrence, double inclusion) et mené jusqu\'au bout, dénombrements justifiés (ordre, répétitions, formule utilisée).',
      ma2: 'Exige les justifications : domaine de définition et de dérivabilité, continuité ou intégrabilité justifiées, développements limités démontrés quand l\'énoncé le demande, tableaux de variations complets, limites justifiées (croissances comparées, DL), calculs menés proprement jusqu\'au résultat simplifié.',
      el2: 'Exige les schémas (circuit redessiné, générateur de Thévenin équivalent), le fléchage des tensions et des courants, les lois utilisées nommées (Millman, pont diviseur, lois des mailles et des nœuds), l\'équation différentielle établie, la constante de temps, les tracés demandés et les unités.'
    };
    // texte lisible d'un morceau de HTML (énoncés, corrigés) : schémas signalés, TeX gardé tel quel
    const toText = h => {
      const d = document.createElement('div');
      d.innerHTML = String(h == null ? '' : h).replace(/<svg[\s\S]*?<\/svg>/gi, ' [schéma] ').replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/t[dh]>/gi, ' | ').replace(/<\/(p|li|h\d|tr|div|pre|ul|ol|table)>/gi, '$&\n').replace(/<li[^>]*>/gi, '• ');
      return d.textContent.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    };
    function answerOf(it) {
      const a = cfg.answerText ? cfg.answerText(it) : null;
      if (a != null && a !== '') return String(a);
      if (it.type === 'choice') { const o = (it.opts || []).find(o => String(o.v) === String(it.ans)); return o ? toText(o.t) : String(it.ans); }
      if (it.sol != null && typeof it.sol !== 'function') return toText(String(it.sol));
      if (typeof it.val === 'number') return String(+it.val.toPrecision(6)).replace('.', ',') + (it.unit ? ' ' + it.unit : '');
      if (it.ans != null) return Array.isArray(it.ans) ? it.ans.join(', ') : typeof it.ans === 'object' ? JSON.stringify(it.ans) : String(it.ans);
      return '';
    }
    const skillsOf = ex => [...new Set([].concat(...ex.parts.map(p => p.items.map(skOf))))];
    const fmtP = x => String(Math.round(x * 100) / 100).replace('.', ',');
    function aiPrompt() {
      const exs = cfg.exam(), S = window.SiteSubjects && SiteSubjects.get(id), name = S && S.name ? S.name : id;
      const L = [`Tu es un professeur correcteur exigeant à l'ESIR (prépa intégrée, CUPGE 1re année). L'étudiant t'envoie en photo sa copie manuscrite pour le sujet blanc suivant : ${name}, ${Math.round(cfg.DUR / 60)} min, sans document, noté sur 20.`,
        '', 'Consignes de correction :',
        '- Corrige comme au vrai contrôle sur table : la démarche, les justifications, les schémas, les unités et la rédaction comptent, pas seulement le résultat. Un résultat juste sans justification n\'a pas tous les points.',
        '- Pour chaque partie, la solution exacte et le corrigé détaillé sont donnés ci-dessous : c\'est la référence absolue. Ne refais pas les calculs autrement et ne t\'en écarte pas.',
        '- Une partie absente ou illisible sur la photo vaut 0 point (status "vide"). Si la photo est floue, dis-le dans ton retour.',
        `- Rigueur propre à la matière : ${AI_RULES[id] || 'exige des justifications complètes.'}`,
        '- Points par multiples de 0,25, entre 0 et le barème de la partie.', '', '=== SUJET ET CORRIGÉ DE RÉFÉRENCE ==='];
      exs.forEach((ex, i) => {
        L.push('', `--- Partie ${i + 1} (idx ${i}) · ${ex.title} · barème : /${fmtP(ex.pts)} · compétences (cid) : ${skillsOf(ex).join('+')} ---`);
        ex.parts.forEach((p, j) => {
          L.push(`Question ${i + 1}.${j + 1}${p.title ? ' · ' + toText(p.title) : ''}`, toText(p.q), 'Réponses exactes attendues :');
          p.items.forEach(it => L.push(`  - ${toText(it.label || it.lab || '') || 'réponse'} : ${answerOf(it)}`));
          L.push('Corrigé détaillé :', toText(p.corr));
        });
      });
      const tpl = { v: 1, note: 0, general: 'Bilan global court…', parts: exs.map((ex, i) => ({ idx: i, cid: skillsOf(ex).join('+'), pts: 0, max: ex.pts, status: 'juste | partiel | faux | vide', good: 'Ce qui est bien rédigé et justifié…', missing: 'Ce qui manque, erreurs de rédaction ou de calcul…', advice: `Conseil précis pour avoir ${fmtP(ex.pts)}/${fmtP(ex.pts)} au vrai contrôle` })) };
      L.push('', '=== FORMAT DE TA RÉPONSE ===', 'Fais d\'abord un retour lisible pour l\'étudiant, partie par partie. Termine OBLIGATOIREMENT par ce bloc, avec exactement une entrée par partie (idx 0 à ' + (exs.length - 1) + ') et note = somme des pts :',
        '===PREPA01_START===', JSON.stringify(tpl, null, 2), '===PREPA01_END===');
      return L.join('\n');
    }
    // lecture tolérante de la réponse collée : bloc entre balises, sinon le dernier objet JSON qui contient « parts »
    function aiParse(raw, exs) {
      let s = String(raw || '');
      const m = /===\s*PREPA01_START\s*===([\s\S]*?)===\s*PREPA01_END\s*===/.exec(s);
      if (m) s = m[1];
      s = s.replace(/```(?:json)?/gi, '');
      // tel quel, puis sans virgules finales, puis guillemets typographiques “ ” remplacés (seulement en dernier recours)
      const tryJSON = t => { for (const u of [t, t.replace(/,\s*([}\]])/g, '$1'), t.replace(/,\s*([}\]])/g, '$1').replace(/[“”]/g, '"')]) { try { return JSON.parse(u); } catch (e) { /* essai suivant */ } } return null; };
      let j = null;
      for (let i = s.length - 1; i >= 0 && !j; i--) {
        if (s[i] !== '{') continue;
        let depth = 0, str = false;
        for (let k = i; k < s.length; k++) {
          const c = s[k];
          if (str) { if (c === '\\') k++; else if (c === '"') str = false; continue; }
          if (c === '"') str = true; else if (c === '{') depth++; else if (c === '}' && --depth === 0) { const o = tryJSON(s.slice(i, k + 1)); if (o && Array.isArray(o.parts)) j = o; break; }
        }
      }
      if (!j) throw new Error('je ne trouve pas le bloc JSON de la correction (entre ===PREPA01_START=== et ===PREPA01_END===).');
      const num = v => typeof v === 'number' ? v : parseFloat(String(v == null ? '' : v).replace(',', '.'));
      const txt = v => String(v == null ? '' : v).trim().slice(0, 2000);
      const parts = exs.map((ex, i) => {
        const p = j.parts.find(x => num(x.idx) === i) || (j.parts.length === exs.length && j.parts[i] && j.parts[i].idx == null ? j.parts[i] : null);
        if (!p) throw new Error(`la partie ${i + 1} (idx ${i}) manque dans la correction.`);
        let pts = num(p.pts); const mx = num(p.max);
        if (isFinite(mx) && mx > 0 && Math.abs(mx - ex.pts) > 1e-9 && pts <= mx) pts = pts / mx * ex.pts;   // barème recopié autrement : ramené au vrai
        if (!isFinite(pts) || pts < 0 || pts > ex.pts + 1e-9) throw new Error(`partie ${i + 1} : ${p.pts} point(s) pour un barème de ${fmtP(ex.pts)}.`);
        pts = Math.round(pts * 100) / 100;
        const st = String(p.status || '').toLowerCase(), r = pts / ex.pts;
        return { idx: i, t: ex.title, cid: skillsOf(ex).join('+'), pts, max: ex.pts, status: ['juste', 'partiel', 'faux', 'vide'].includes(st) ? st : r >= 1 ? 'juste' : r > 0 ? 'partiel' : 'faux',
          good: txt(p.good), missing: txt(p.missing), advice: txt(p.advice) };
      });
      return { general: txt(j.general), parts, note: Math.round(parts.reduce((a, p) => a + p.pts, 0) * 100) / 100, noteIA: num(j.note) };
    }
    // la copie est rendue avec la note de l'IA : copie enregistrée, maîtrise des compétences mise à jour
    function aiFinish(raw) {
      const E = cfg.EXAM; if (!E || E.done) throw new Error('aucun sujet blanc en cours.');
      const exs = cfg.exam(), c = aiParse(raw, exs), now = Date.now();
      stopTick(); TALLY = {};
      Object.assign(E, { done: true, running: false, closed: true, note: c.note, ai: { general: c.general, parts: c.parts, at: now } });
      const sk = {}, rr = {};
      c.parts.forEach((p, i) => skillsOf(exs[i]).forEach(k => { const t = sk[k] || (sk[k] = [0, 0]); t[0] += p.pts / p.max; t[1]++; }));
      Object.keys(sk).forEach(k => { rr[k] = sk[k][0] / sk[k][1]; sk[k] = [Math.round(sk[k][0] * 100) / 100, sk[k][1]]; });
      const H = ls.get(HK, []);
      H.push(Object.assign({ id: String(E.seed), ts: now, note: c.note, dur: Math.min(cfg.DUR, Math.round((now - E.t0) / 1000)), sk, ai: { general: c.general, parts: c.parts } }, E.target ? { cible: true } : {}));
      ls.set(HK, H);
      const P = pst();
      Object.keys(rr).forEach(k => { if (!skById(k)) return; const s = skS(P, k), r = rr[k], gain = r >= 0.99 ? 30 : r >= 0.75 ? 15 : r >= 0.5 ? 0 : -20; s.m = Math.max(0, Math.min(MMAX, s.m + gain)); s.last = now; if (isVal(s)) s.ever = true; });
      ls.set(PK, P);
      const { exs: _x, ...rest } = E; ls.set(EK, rest);
      const m = $('#aiModal'); if (m) m.remove();
      cfg.renderExam(); window.scrollTo(0, 0);
      toast(`Copie corrigée par l'IA : ${fmtP(c.note)}/20.`);
    }
    const aiPartHTML = p => `<div class="ai-part ${esc(p.status)}"><div class="row"><span class="pill ${p.status === 'juste' ? 'ok' : p.status === 'partiel' ? 'part' : 'bad'}">${fmtP(p.pts)}/${fmtP(p.max)} · corrigé IA</span></div>
      ${p.good ? `<p><b>✓ Ce qui est validé</b> ${esc(p.good)}</p>` : ''}${p.missing ? `<p><b>✗ Points perdus sur ta copie</b> ${esc(p.missing)}</p>` : ''}${p.advice ? `<p><b>💡 Conseil DS</b> ${esc(p.advice)}</p>` : ''}</div>`;
    function aiDecorate() {
      const ai = cfg.EXAM.ai, cards = $$('section.card', app).filter(s => $('.ex', s));
      cards.forEach((card, i) => { const p = ai.parts[i]; if (!p) return; $$('.fb', card).forEach(f => { f.innerHTML = ''; }); const h = $('h2', card); if (h) h.insertAdjacentHTML('afterend', aiPartHTML(p)); });
      if (app.firstElementChild) app.firstElementChild.insertAdjacentHTML('afterend', `<section class="card ai-sum"><div class="row"><span class="pill ai">Corrigé IA</span><b>${fmtP(cfg.EXAM.note)}/20</b><span class="fine">Note donnée par l'IA sur ta copie papier, avec le corrigé du site comme référence. Les réponses tapées à l'écran ne comptent pas.</span></div>${ai.general ? `<p class="sub" style="margin-top:8px">${esc(ai.general)}</p>` : ''}</section>`);
    }
    // étiquette d'une copie dans « Mes copies »
    const copyTag = r => (r.cible ? ' · ciblé' : '') + (r.ai ? ` <span class="pill ai">Corrigé IA</span> <button type="button" class="linkbtn" data-aicopy="${esc(r.id)}">voir</button>` : '');
    function aiReport(rid, btn) {
      const r = ls.get(HK, []).filter(x => String(x.id) === String(rid) && x.ai).pop(); if (!r) return;
      const old = $('#aiReport'); if (old) old.remove();
      const host = btn.closest('section') || app.lastElementChild;
      host.insertAdjacentHTML('afterend', `<section class="card" id="aiReport"><div class="row"><h2>Copie du ${new Date(r.ts).toLocaleDateString('fr-FR')} · ${fmtP(r.note)}/20</h2><span class="pill ai">Corrigé IA</span><span class="sp"></span><button type="button" class="btn btn-ghost" data-act="aiReportClose">Fermer</button></div>
        ${r.ai.general ? `<p class="sub">${esc(r.ai.general)}</p>` : ''}${r.ai.parts.map(p => `<h3 style="font:600 17px/1.3 var(--serif);margin-top:14px">${esc(p.t || 'Partie ' + (p.idx + 1))}</h3>${aiPartHTML(p)}`).join('')}</section>`);
      $('#aiReport').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // bandeau du sujet en cours, puis panneau en deux étapes
    function aiBar() {
      if (!cfg.exam || $('#aiBar') || !app.firstElementChild) return;
      app.firstElementChild.insertAdjacentHTML('afterend', `<section class="card ai-bar" id="aiBar"><div class="row"><p class="sub" style="margin:0;flex:1;min-width:220px">Tu rédiges sur papier ou sur tablette ? Fais corriger ta vraie copie (schémas, justifications, rédaction) par une IA, avec le corrigé exact de ce sujet.</p><button type="button" class="btn btn-primary" data-act="aiOpen">📸 Corriger ma copie papier / tablette avec une IA</button></div></section>`);
    }
    function aiOpen() {
      const old = $('#aiModal'); if (old) old.remove();
      const prompt = aiPrompt();
      document.body.insertAdjacentHTML('beforeend', `<div class="ai-modal" id="aiModal" role="dialog" aria-modal="true" aria-labelledby="aiTitle"><div class="ai-box">
        <div class="row"><h2 id="aiTitle">Corriger ma copie avec une IA</h2><span class="sp"></span><button type="button" class="btn btn-ghost" data-act="aiClose" aria-label="Fermer">✕</button></div>
        <p class="sub">Rédige le sujet sur papier ou tablette, comme au vrai contrôle. Puis :</p>
        <h3>1. Copier le prompt de correction</h3>
        <p class="fine">Colle-le dans ChatGPT, Claude ou Gemini avec la photo (ou le PDF) de ta copie. Il contient tout le sujet, les réponses exactes et le corrigé détaillé, pour que l'IA ne se trompe pas.</p>
        <div class="row" style="margin-top:8px"><button type="button" class="btn btn-primary" data-act="aiCopy">📋 Copier le prompt pour ChatGPT / Claude / Gemini</button><span class="fine" id="aiCopied"></span></div>
        <details style="margin-top:8px"><summary class="fine" style="cursor:pointer">Voir le prompt</summary><textarea class="ai-text" id="aiPrompt" readonly>${esc(prompt)}</textarea></details>
        <h3>2. Coller le retour de l'IA</h3>
        <p class="fine">Colle toute sa réponse (ou seulement le bloc entre ===PREPA01_START=== et ===PREPA01_END===). La copie sera rendue avec sa note et enregistrée dans « Mes copies ».</p>
        <textarea class="ai-text" id="aiPaste" placeholder="Colle ici la réponse de l'IA…"></textarea>
        <div class="row" style="margin-top:8px"><button type="button" class="btn btn-primary" data-act="aiImport">Importer la correction IA</button><span class="fine" id="aiMsg" role="status"></span></div>
      </div></div>`);
    }
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-act^="ai"], [data-aicopy]'); if (!b) return;
      const act = b.dataset.act;
      if (b.dataset.aicopy) { aiReport(b.dataset.aicopy, b); return; }
      if (act === 'aiOpen') { if (cfg.EXAM && !cfg.EXAM.done) aiOpen(); }
      else if (act === 'aiClose') { const m = $('#aiModal'); if (m) m.remove(); }
      else if (act === 'aiReportClose') { const r = $('#aiReport'); if (r) r.remove(); }
      else if (act === 'aiCopy') {
        const t = $('#aiPrompt'), done = ok => { $('#aiCopied').textContent = ok ? '✓ Copié : colle-le dans l\'IA avec la photo de ta copie.' : 'Copie impossible : ouvre « Voir le prompt » et copie-le à la main.'; };
        const fallback = () => { try { t.closest('details').open = true; t.select(); done(document.execCommand('copy')); } catch (err) { done(false); } };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(() => done(true), fallback); else fallback();
      } else if (act === 'aiImport') {
        try { aiFinish($('#aiPaste').value); } catch (err) { const m = $('#aiMsg'); if (m) { m.textContent = 'Import impossible : ' + (err.message || err); m.style.color = 'var(--bad)'; } }
      }
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
      tally, examRecord, examPlan, weakSkills, weakPlan, weakButton, hideCorr, copyTag, aiPrompt, aiParse };
  };
})();
