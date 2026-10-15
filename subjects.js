/* =====================================================================
   Matières du site : la seule liste des pages, des contrôles et de leurs dates.
   Un CC déplacé ou une nouvelle matière se règle ICI, pour l'accueil, le planning et chaque page.
   - ade : intitulé du créneau dans l'emploi du temps ADE (planning.cache.v1, voir planning.js)
   - from / to : fenêtre de dates quand deux pages se partagent une matière (CC1 / CC2)
   - dates : dates de secours tant que l'emploi du temps n'est pas chargé (vide = « date à confirmer »)
   - ignore : ancien créneau d'un CC déplacé, ignoré tant qu'ADE ne donne pas la nouvelle date
   - name : nom court (tableau de bord moi/) ; skills : nombre de compétences du parcours (affiché sur l'accueil)
   Usage : <script src="subjects.js"></script> avant les autres scripts. API : window.SiteSubjects
   ===================================================================== */
(function () {
  'use strict';
  const word = w => new RegExp(`(^|[^A-Za-z])${w}([^A-Za-z]|$)`);
  const MATH = word('MATHS?');
  const LIST = [
    { id: 'maths', name: 'QCM maths', page: 'maths/', ade: /QCM/i, qcm: true,
      dates: ['2026-10-15T08:15:00Z', '2026-11-05T15:45:00Z', '2026-11-16T07:45:00Z', '2026-12-02T14:00:00Z', '2026-12-17T09:15:00Z', '2027-01-14T11:00:00Z'] },
    { id: 'ms1', name: 'Maths S1', page: 'maths-s1/', ade: MATH, to: '2026-12-01', dates: ['2026-11-06T08:45:00Z'], skills: 16 },
    { id: 'ma2', name: 'Analyse', page: 'maths-s1-analyse/', ade: MATH, from: '2026-12-01', dates: ['2027-01-06T07:00:00Z'], skills: 14 },
    // CC « L'atome » prévu le 20/10, déplacé ; le CC des liaisons (16/12) viendra sur la même page
    { id: 'ato', name: 'Atomistique', page: 'ato/', ade: word('ATO'), to: '2026-12-01', dates: [], ignore: ['2026-10-20T13:00:00Z'], skills: 12 },
    // CC1 prévu le 16/10, déplacé
    { id: 'elec', name: 'Élec CC1', page: 'elec/', ade: /ELECa/i, to: '2026-10-20', dates: [], ignore: ['2026-10-16T07:45:00Z'] },
    { id: 'el2', name: 'Élec CC2', page: 'elec2/', ade: /ELECa/i, from: '2026-10-20', dates: ['2026-11-02T14:00:00Z'], skills: 9 },
    { id: 'algo', name: 'Algo', page: 'algo/', ade: word('ALGO'), to: '2026-11-01', dates: ['2026-10-23T07:45:00Z'], skills: 14 },
    { id: 'phys', name: 'Méca du point', page: 'phys/', ade: word('PHYS'), from: '2026-10-01', dates: ['2026-12-02T08:45:00Z'], skills: 16 },
    { id: 'meca', name: 'Ingé méca', page: 'meca/', ade: word('MECA'), dates: ['2026-12-09T12:15:00Z'], skills: 11 }
  ];
  const CC = word('CC'), byId = {};
  LIST.forEach(s => { byId[s.id] = s; s.ignoreTs = (s.ignore || []).map(Date.parse); });
  const cache = () => { try { return JSON.parse(localStorage.getItem('planning.cache.v1') || 'null'); } catch (e) { return null; } };
  const inWindow = (s, ts) => ts >= (s.from ? Date.parse(s.from) : -Infinity) && ts < (s.to ? Date.parse(s.to) : Infinity);
  const ignored = (id, ts) => !!byId[id] && byId[id].ignoreTs.includes(ts);

  // Créneaux d'évaluation de la matière dans l'emploi du temps, du plus tôt au plus tard
  // (o.oral : garder aussi les oraux ; o.anyDate : sans la fenêtre from / to)
  function events(id, o = {}) {
    const s = byId[id], c = cache();
    if (!s || !c || !Array.isArray(c.evs)) return [];
    return c.evs.filter(e => s.ade.test(e.t) && (s.qcm || CC.test(e.t)) && !/tiers/i.test(e.t) && (o.oral || !/oraux/i.test(e.t))
      && (o.anyDate || inWindow(s, e.s)) && !s.ignoreTs.includes(e.s)).sort((a, b) => a.s - b.s);
  }
  // Prochain contrôle : { ts, ev (créneau ADE ou null pour une date de secours), past } ; s'ils sont tous passés,
  // le dernier avec past: true ; null si aucune date connue (CC à confirmer)
  function next(id, o) {
    const s = byId[id]; if (!s) return null;
    const evs = events(id, o), list = evs.length ? evs.map(e => ({ ts: e.s, ev: e })) : (s.dates || []).map(d => ({ ts: Date.parse(d), ev: null }));
    if (!list.length) return null;
    const soon = Date.now() - 3 * 3600e3, n = list.find(x => x.ts > soon);
    return n ? Object.assign({ past: false }, n) : Object.assign({ past: true }, list[list.length - 1]);
  }
  const cc = (id, o) => { const n = next(id, o); return n ? n.ts : null; };
  // Page de révision d'un créneau ADE : la matière dont la fenêtre contient la date, sinon la première qui correspond
  function pageOf(ev) {
    const m = LIST.filter(s => s.ade.test(ev.t) && (!s.qcm || /QCM/i.test(ev.t)));
    const qcm = m.find(s => s.qcm); if (qcm) return qcm.page;
    const w = m.find(s => inWindow(s, ev.s)) || m[0];
    return w ? w.page : null;
  }
  window.SiteSubjects = { list: LIST, get: id => byId[id] || null, events, next, cc, pageOf, ignored };
})();
