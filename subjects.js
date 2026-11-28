/* =====================================================================
   Matières du site : la seule liste des pages, des contrôles et de leurs dates.
   Un CC déplacé ou une nouvelle matière se règle ICI, pour l'accueil, le planning et chaque page.
   - ade : intitulé du créneau dans l'emploi du temps ADE (planning.cache.v1, voir planning.js)
   - dates : tous les CC de la matière sur l'année (copie d'ADE du 17/11), utilisés tant que l'emploi du temps
     n'est pas chargé sur l'appareil (vide = « date à confirmer »)
   - nth : quand plusieurs pages se partagent une matière (CC1 / CC2), la page prend le n-ième CC de l'année
     (0 = le premier) : le CC1 tombe toujours avant le CC2, même si un CC est déplacé ou annulé.
     S'il y a moins de CC que de pages, les dernières pages partagent le dernier CC (shared: true), sauf avec
     later: true (CC pas encore placé, qui tombera après : date à confirmer, tbc: true)
   - count : nombre de CC de l'année quand certains ne sont pas encore dans ADE ; ceux qui manquent sont
     comptés AVANT ceux qui y sont (CC1 sans date, CC2 déjà placé) et rendus avec tbc: true
   - ignore : ancien créneau d'un CC déplacé, ignoré tant qu'ADE ne le retire pas
   - cc1 : compétences au programme du CC1 quand la page prépare deux CC (le CC2 porte sur tout le parcours).
     La page est ouverte pour un CC (ccNum : ?cc=1 ou ?cc=2 dans l'adresse, venant des cases de l'accueil, sinon
     le prochain CC) ; pour le CC1 elle ne garde que ces compétences (scope), partout : parcours, cours, exercices
   - name : nom court (tableau de bord moi/) ; skills : nombre de compétences du parcours (affiché sur l'accueil),
     sans les compétences bonus (bonus : leurs identifiants, non comptées)
   Usage : <script src="subjects.js"></script> avant les autres scripts. API : window.SiteSubjects
   ===================================================================== */
(function () {
  'use strict';
  const word = w => new RegExp(`(^|[^A-Za-z])${w}([^A-Za-z]|$)`);
  const MATH = word('MATHS?');
  // ADE au 17/11 : les CC du 6/11 n'ont pas eu lieu (mouvement social, CC écrits suspendus le 4/11) ;
  // élec analogique CC1 le 2/12 et CC2 le 14/12, maths CC1 le 30/11 et CC2 (analyse) le 6/01
  const ELEC_CC = ['2026-12-02T14:00:00Z', '2026-12-14T07:00:00Z'], MATH_CC = ['2026-11-30T07:00:00Z', '2027-01-06T07:00:00Z'];
  const LIST = [
    // QCM : ADE n'a plus que ceux de septembre (les suivants ont disparu début novembre) ; tous passés → date à confirmer
    { id: 'maths', name: 'QCM maths', page: 'maths/', ade: /QCM/i, qcm: true,
      dates: ['2026-09-18T13:00:00Z', '2026-09-28T14:45:00Z'] },
    { id: 'ms1', name: 'Maths S1', page: 'maths-s1/', ade: MATH, nth: 0, dates: MATH_CC, skills: 16 },
    { id: 'ma2', name: 'Analyse', page: 'maths-s1-analyse/', ade: MATH, nth: 1, later: true, dates: MATH_CC, skills: 14 },
    // CC1 « L'atome » (prévu le 20/10, reporté) le 25/11 ; CC2 (tout le cours) le 8/01 (ADE au 24/11, après la disparition du 16/12)
    { id: 'ato', name: 'Atomistique', page: 'ato/', ade: word('ATO'), count: 2, dates: ['2026-11-25T12:15:00Z', '2027-01-08T13:45:00Z'], skills: 22,
      cc1: ['noyau', 'iso', 'onde', 'niv', 'trans', 'serie', 'nq', 'conf', 'exc', 'case', 'place', 'prop', 'lewis'] },
    { id: 'elec', name: 'Élec CC1', page: 'elec/', ade: /ELECa/i, nth: 0, dates: ELEC_CC, skills: 21, bonus: ['thv'] },
    { id: 'el2', name: 'Élec CC2', page: 'elec2/', ade: /ELECa/i, nth: 1, later: true, dates: ELEC_CC, skills: 9 },
    // Électronique numérique (CUPGE1-ELECn-S1) : CC1 (Séquence A) le 4/12, CC2 (Séquences A, B, C) le 12/01
    { id: 'eln', name: 'Élec num.', page: 'elecn/', ade: /ELECn/i, dates: ['2026-12-04T08:45:00Z', '2027-01-12T14:00:00Z'], skills: 12,
      cc1: ['num', 'addb', 'boole', 'canon', 'karn', 'mux'] },
    // DS 1 (23/10, puis 5/11, puis « semaine du 9/11 ») jamais passé et absent d'ADE au 17/11 : count 2 le place avant
    // le DS 2 du 7/12, « date à confirmer » ; l'oral sur machine les 6-7/01 (avec { oral: true })
    { id: 'algo', name: 'Algo', page: 'algo/', ade: word('ALGO'), count: 2, dates: ['2026-12-07T11:45:00Z'], skills: 26,
      cc1: ['types', 'trace', 'boucles', 'fonc', 'code1', 'suite', 'cplx', 'dicho', 'list', 'alias', 'str', 'mat', 'minmax', 'code2', 'fusion', 'dict', 'code3', 'qcm'] },
    // CC1 de physique le 28/09 (avant le site) : la page prépare le CC2
    { id: 'phys', name: 'Méca du point', page: 'phys/', ade: word('PHYS'), nth: 1, dates: ['2026-09-28T11:15:00Z', '2026-12-02T08:45:00Z'], skills: 16 },
    { id: 'meca', name: 'Ingé méca', page: 'meca/', ade: word('MECA'), dates: ['2026-12-09T12:15:00Z'], skills: 11 }
  ];
  const CC = word('CC'), byId = {};
  LIST.forEach(s => { byId[s.id] = s; s.ignoreTs = (s.ignore || []).map(Date.parse); });
  const cache = () => { try { return JSON.parse(localStorage.getItem('planning.cache.v1') || 'null'); } catch (e) { return null; } };
  const ignored = (id, ts) => !!byId[id] && byId[id].ignoreTs.includes(ts);

  // Créneaux d'évaluation de la matière dans l'emploi du temps, du plus tôt au plus tard, sur toute l'année
  // (o.oral : garder aussi les oraux)
  // créneau réservé au tiers-temps (« Tiers temps CC … »), mais pas un CC « (tiers-temps inclus) », qui est le vrai CC (ATO, 25/11)
  const TIERS = t => /tiers[\s-]*temps/i.test(t) && !/inclus/i.test(t);
  function events(id, o = {}) {
    const s = byId[id], c = cache();
    if (!s || !c || !Array.isArray(c.evs)) return [];
    return c.evs.filter(e => s.ade.test(e.t) && (s.qcm || CC.test(e.t)) && !TIERS(e.t) && !/rattrapage/i.test(e.t) && (o.oral || !/oraux/i.test(e.t))
      && !s.ignoreTs.includes(e.s)).sort((a, b) => a.s - b.s);
  }
  // Tous les CC de la matière : l'emploi du temps s'il en a, sinon les dates de secours ; avec count, les CC
  // pas encore placés d'abord (ts: null). n : numéro du CC dans l'année
  function slots(id, o) {
    const s = byId[id], evs = events(id, o);
    const list = evs.length ? evs.map(e => ({ ts: e.s, ev: e })) : (s.dates || []).map(d => ({ ts: Date.parse(d), ev: null }));
    const miss = Math.max(0, (s.count || 0) - list.length);
    if (!miss) return list.map((x, i) => Object.assign(x, { n: i + 1 }));
    // CC manquants : un créneau ADE du même jour qu'une date de secours prend son rang (dates = les derniers CC de
    // l'année quand il y en a moins que count) ; les autres CC connus vont aux derniers rangs libres, les manquants
    // restent sans date (ex. ATO : le CC1 du 25/11 est dans ADE, le CC2 n'y est plus → CC2 « à confirmer »)
    const dates = s.dates || [], off = s.count - dates.length, day = t => new Date(t).toDateString();
    const out = Array.from({ length: s.count }, () => null), rest = [];
    list.forEach(x => {
      const k = dates.findIndex(d => day(Date.parse(d)) === day(x.ts)) + off;
      if (k >= off && !out[k]) out[k] = x; else rest.push(x);
    });
    for (let k = s.count - 1; k >= 0 && rest.length; k--) if (!out[k]) out[k] = rest.pop();
    return out.map((x, i) => Object.assign(x || { ts: null, ev: null }, { n: i + 1 }));
  }
  // Contrôle de la page : { ts, ev (créneau ADE ou null pour une date de secours), n, past, shared, tbc, before }.
  // Page avec nth : son CC de l'année ; sinon le prochain, ou le dernier avec past: true s'ils sont tous passés.
  // tbc : CC sans date (ts null), before : date du CC suivant qui en a une (il tombera avant).
  // null si aucune date connue du tout (CC à confirmer)
  function next(id, o) {
    const s = byId[id]; if (!s) return null;
    const list = slots(id, o); if (!list.length) return null;
    const soon = Date.now() - 3 * 3600e3, past = x => x.ts != null && x.ts <= soon;
    const out = (x, shared) => {
      const after = x.ts == null ? list.find(y => y.n > x.n && y.ts != null) : null;
      return Object.assign({ past: past(x), shared, tbc: x.ts == null, before: after ? after.ts : null }, x);
    };
    if (s.nth != null && s.later && s.nth >= list.length) return { ts: null, ev: null, n: s.nth + 1, past: false, shared: false, tbc: true, before: null };
    if (s.nth != null) return out(list[Math.min(s.nth, list.length - 1)], s.nth >= list.length);
    const n = list.find(x => !past(x));
    if (!n && s.qcm) return null;   // QCM : plus aucun de prévu → « date à confirmer », pas « passé »
    return out(n || list[list.length - 1], false);
  }
  const cc = (id, o) => { const n = next(id, o); return n ? n.ts : null; };
  // n-ième CC de l'année d'une matière (1 = CC1), même forme que next() ; null s'il n'existe pas
  function slot(id, n) {
    const list = byId[id] ? slots(id) : [], x = list[n - 1]; if (!x) return null;
    const after = x.ts == null ? list.find(y => y.n > x.n && y.ts != null) : null;
    return Object.assign({ past: x.ts != null && x.ts <= Date.now() - 3 * 3600e3, shared: false, tbc: x.ts == null, before: after ? after.ts : null }, x);
  }
  // CC préparé par la page : ?cc=1 / ?cc=2 dans l'adresse (cases de l'accueil), sinon le prochain CC
  function ccNum(id) {
    let q = 0; try { q = +new URLSearchParams(location.search).get('cc'); } catch (e) { /* ignore */ }
    if (q === 1 || q === 2) return q;
    const n = next(id); return n ? n.n : 1;
  }
  // compétences de la page pour ce CC : celles de cc1 pour le CC1, toutes sinon
  function scope(id, SK) {
    const s = byId[id];
    return s && s.cc1 && ccNum(id) === 1 ? SK.filter(k => s.cc1.includes(k.id)) : SK;
  }
  // Sprint avant le CC : nombre de jours (0 = jour J) quand le CC de la page tombe dans les SPRINT jours, sinon null
  const SPRINT = 10;
  function sprint(id) {
    const n = next(id); if (!n || n.ts == null || n.past) return null;
    const d = Math.round((new Date(new Date(n.ts).toDateString()) - new Date(new Date().toDateString())) / 864e5);
    return d >= 0 && d <= SPRINT ? d : null;
  }
  // Page de révision d'un créneau ADE (CC ou cours) : parmi les pages de la matière, celle dont le CC est le
  // premier à partir de ce créneau, sinon la dernière
  function pageOf(ev) {
    const m = LIST.filter(s => s.ade.test(ev.t) && (!s.qcm || /QCM/i.test(ev.t)));
    const qcm = m.find(s => s.qcm); if (qcm) return qcm.page;
    if (m.length < 2) return m[0] ? m[0].page : null;
    const ahead = m.map(s => ({ s, ts: cc(s.id) })).filter(x => x.ts != null && x.ts >= ev.s).sort((a, b) => a.ts - b.ts);
    return (ahead.length ? ahead[0].s : m[m.length - 1]).page;
  }
  // Copie de sujet blanc qui compte (<id>.hist.v1) : pas une copie vide. Les nouvelles copies vides ont vide: true
  // (et ne sont plus enregistrées) ; avant le 28/11, une copie à 0 sans aucune réponse gardée (a, ans, self) était
  // une copie rendue vide, le plus souvent par la fin du chrono
  const filled = v => v != null && (Array.isArray(v) ? v.length > 0 : typeof v === 'object' ? Object.keys(v).length > 0 : String(v).trim() !== '');
  function realCopy(r) {
    if (!r || r.vide) return false;
    if (+r.note !== 0 || r.a > 0 || r.ann) return true;   // ann : vrai CC rédigé sur papier, gardé
    return Object.values(r.ans || {}).some(filled) || Object.values(r.self || {}).some(Boolean);
  }
  window.SiteSubjects = { list: LIST, get: id => byId[id] || null, events, next, slot, cc, ccNum, scope, sprint, pageOf, ignored, realCopy };
})();
