/* =====================================================================
   Matières du site : la seule liste des pages, des contrôles et de leurs dates.
   Un CC déplacé ou une nouvelle matière se règle ICI, pour l'accueil, le planning et chaque page.
   - ade : intitulé du créneau dans l'emploi du temps ADE (planning.cache.v1, voir planning.js)
   - dates : tous les CC de la matière sur l'année (copie d'ADE du 28/10), utilisés tant que l'emploi du temps
     n'est pas chargé sur l'appareil (vide = « date à confirmer »)
   - nth : quand plusieurs pages se partagent une matière (CC1 / CC2), la page prend le n-ième CC de l'année
     (0 = le premier) : le CC1 tombe toujours avant le CC2, même si un CC est déplacé ou annulé.
     S'il y a moins de CC que de pages, les dernières pages partagent le dernier CC (shared: true)
   - count : nombre de CC de l'année quand certains ne sont pas encore dans ADE ; ceux qui manquent sont
     comptés AVANT ceux qui y sont (CC1 sans date, CC2 déjà placé) et rendus avec tbc: true
   - ignore : ancien créneau d'un CC déplacé, ignoré tant qu'ADE ne le retire pas
   - name : nom court (tableau de bord moi/) ; skills : nombre de compétences du parcours (affiché sur l'accueil),
     sans les compétences bonus (bonus : leurs identifiants, non comptées)
   Usage : <script src="subjects.js"></script> avant les autres scripts. API : window.SiteSubjects
   ===================================================================== */
(function () {
  'use strict';
  const word = w => new RegExp(`(^|[^A-Za-z])${w}([^A-Za-z]|$)`);
  const MATH = word('MATHS?');
  // ADE au 28/10 : un seul CC d'élec analogique (6/11) depuis l'annulation du 16/10 et la disparition du 2/11
  const ELEC_CC = ['2026-11-06T07:00:00Z'], MATH_CC = ['2026-11-06T08:45:00Z', '2027-01-06T07:00:00Z'];
  const LIST = [
    { id: 'maths', name: 'QCM maths', page: 'maths/', ade: /QCM/i, qcm: true,
      dates: ['2026-09-18T13:00:00Z', '2026-09-28T14:45:00Z', '2026-11-06T13:00:00Z', '2026-11-16T07:45:00Z', '2026-12-02T14:00:00Z', '2026-12-17T09:15:00Z', '2027-01-14T11:00:00Z'] },
    { id: 'ms1', name: 'Maths S1', page: 'maths-s1/', ade: MATH, nth: 0, dates: MATH_CC, skills: 16 },
    { id: 'ma2', name: 'Analyse', page: 'maths-s1-analyse/', ade: MATH, nth: 1, dates: MATH_CC, skills: 14 },
    // CC1 « L'atome » prévu le 20/10, pas encore passé et sans nouvelle date ; CC2 (tout le cours) le 16/12
    { id: 'ato', name: 'Atomistique', page: 'ato/', ade: word('ATO'), count: 2, dates: ['2026-12-16T08:45:00Z'], skills: 17 },
    { id: 'elec', name: 'Élec CC1', page: 'elec/', ade: /ELECa/i, nth: 0, dates: ELEC_CC, skills: 21, bonus: ['thv'] },
    { id: 'el2', name: 'Élec CC2', page: 'elec2/', ade: /ELECa/i, nth: 1, dates: ELEC_CC, skills: 9 },
    // DS du 23/10 reporté au 5/11, puis DS 2 le 7/12 (et l'oral sur machine en janvier, avec { oral: true })
    { id: 'algo', name: 'Algo', page: 'algo/', ade: word('ALGO'), dates: ['2026-11-05T15:45:00Z', '2026-12-07T12:15:00Z'], skills: 18 },
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
  function events(id, o = {}) {
    const s = byId[id], c = cache();
    if (!s || !c || !Array.isArray(c.evs)) return [];
    return c.evs.filter(e => s.ade.test(e.t) && (s.qcm || CC.test(e.t)) && !/tiers|rattrapage/i.test(e.t) && (o.oral || !/oraux/i.test(e.t))
      && !s.ignoreTs.includes(e.s)).sort((a, b) => a.s - b.s);
  }
  // Tous les CC de la matière : l'emploi du temps s'il en a, sinon les dates de secours ; avec count, les CC
  // pas encore placés d'abord (ts: null). n : numéro du CC dans l'année
  function slots(id, o) {
    const s = byId[id], evs = events(id, o);
    const list = evs.length ? evs.map(e => ({ ts: e.s, ev: e })) : (s.dates || []).map(d => ({ ts: Date.parse(d), ev: null }));
    const miss = Math.max(0, (s.count || 0) - list.length);
    return Array.from({ length: miss }, () => ({ ts: null, ev: null })).concat(list).map((x, i) => Object.assign(x, { n: i + 1 }));
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
    if (s.nth != null) return out(list[Math.min(s.nth, list.length - 1)], s.nth >= list.length);
    const n = list.find(x => !past(x));
    return out(n || list[list.length - 1], false);
  }
  const cc = (id, o) => { const n = next(id, o); return n ? n.ts : null; };
  // Page de révision d'un créneau ADE (CC ou cours) : parmi les pages de la matière, celle dont le CC est le
  // premier à partir de ce créneau, sinon la dernière
  function pageOf(ev) {
    const m = LIST.filter(s => s.ade.test(ev.t) && (!s.qcm || /QCM/i.test(ev.t)));
    const qcm = m.find(s => s.qcm); if (qcm) return qcm.page;
    if (m.length < 2) return m[0] ? m[0].page : null;
    const ahead = m.map(s => ({ s, ts: cc(s.id) })).filter(x => x.ts != null && x.ts >= ev.s).sort((a, b) => a.ts - b.ts);
    return (ahead.length ? ahead[0].s : m[m.length - 1]).page;
  }
  window.SiteSubjects = { list: LIST, get: id => byId[id] || null, events, next, cc, pageOf, ignored };
})();
