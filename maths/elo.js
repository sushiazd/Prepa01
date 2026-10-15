/* =====================================================================
   Elo absolu du QCM maths (0 à 2500) — partagé par maths/index.html et moi/index.html
   ---------------------------------------------------------------------
   Chaque type de question a une difficulté fixe sur la même échelle qu'un Elo : on réussit une question
   de difficulté d une fois sur deux quand on a d d'Elo, 9 fois sur 10 avec 500 de plus (échelle 500).
   Repères par thème (30 réponses de base) : 1000 ≈ 50 % de justes ; 1420 ≈ 90 % ; 1750 = 100 % ; avec en plus
   15 questions Hardcore : ≈ 1950 à moitié justes, ≈ 2350 à 90 %, 2500 (GM) toutes justes. L'Elo est la moyenne
   des 21 thèmes : 2500 = tout le programme maîtrisé, Hardcore compris.
   - Un niveau par thème : estimation la plus probable à partir des 30 dernières réponses aux questions
     normales et des 15 dernières en Hardcore du thème, plus deux réponses fictives « à moitié justes » contre
     1000 (un thème peu travaillé reste près de 1000, une seule question réussie ne le fait pas exploser). Juste = 1, vide = 1/3, faux = 0 (partiel entre).
   - L'Elo est la moyenne des 21 thèmes : un thème jamais travaillé compte 1000, donc impossible
     d'être GM sans tout le programme. Il ne dépend ni du nombre de questions faites ni du groupe.
   - Une même question (même qid) refaite ne compte qu'une fois ; les copies presque vides (≥ 80 % de
     réponses à 0) sont ignorées ; les copies du prof importées comptent (une réponse par question notée).
   - Erreur marquée « erreur de calcul » : la méthode est sue, elle ne coûte que 30 % d'une vraie erreur
     (comme dans les points faibles). Une fausse vaut alors 0,7 au lieu de 0, une partielle entre les deux.
   Difficultés calibrées le 15/10/2026 sur les 717 réponses du site (modèle logistique, a priori 1000) ;
   Hardcore fixé à 2000. Un modèle absent de la table prend la difficulté de son thème.
   ===================================================================== */
(function (root) {
  'use strict';
  const SCALE = 500, C = Math.LN10 / SCALE, MAX = 2500, WIN = 30, WIN_HC = 15, HC = 2000, PRIOR = 2;
  const THEMES = ['polynomes', 'puiss_rad', 'ln_exp', 'eq_exp', 'fractions', 'developpement', 'equations', 'domaine', 'derivees', 'integrales',
    'limites', 'inegalites', 'equa_diff', 'geometrie', 'continuite', 'suites', 'etude_fonction', 'binomiale', 'espace', 'trigo', 'recurrence'];
  const DIFF = {
    theme: { binomiale: 1050, continuite: 1150, derivees: 970, developpement: 1010, domaine: 990, eq_exp: 1070, equa_diff: 1050, equations: 1060, espace: 990, etude_fonction: 1070, fractions: 1000, geometrie: 1200, inegalites: 940, integrales: 1060, limites: 1040, ln_exp: 1060, polynomes: 1060, puiss_rad: 920, recurrence: 1030, suites: 1090, trigo: 1050 },
    tpl: { bin: 1000, bin_seuil: 1100, cont_c1: 1210, cont_inv: 1120, cont_one: 1200, denombr: 1000, deriv_comp: 1010, deriv_trig: 950, deriv_value: 950, dev_canon: 1030, dev_coef: 960, dev_prod3: 990, dom_inv_exp: 970, dom_mix: 970, dom_quad: 1010, domain: 960, edo: 1090, edo_part: 1020, eq_abs: 1030, eq_exp_ineq: 1110, eq_exp_inv: 1040, eq_exp_lin: 1010, eq_pow_base: 1100, eq_quad: 1120, eq_sqrt: 1030, esp_inter: 970, esp_plane_eq: 970, esp_proj: 1030, exp_ln: 1030, exp_ln_val: 1090, fact_ident: 1070, fct: 1210, fct_asym_hom: 1040, fct_ln: 990, fct_poly3: 1140, fct_xexp: 1060, frac_lin_eq: 980, frac_nest: 1040, frac_rat: 1040, frac_same_den: 960, frac_simplify: 980, geo: 1160, geo_circle: 1290, geo_circle_tan: 1240, geo_scal: 1120, ineq: 920, ineq_exp_lin: 1020, ineq_quad: 1090, integ: 1080, integ_area: 1140, integ_mean: 1030, lim_compare: 1010, lim_croiss: 970, lim_exp_quot: 1100, lim_point: 1140, lim_rational: 1010, lim_seq_geo: 990, limit: 1140, ln_decomp: 1040, ln_sum: 1020, parab: 1220, poly_comb: 1100, poly_viete: 1000, pow_props: 900, proba_tot: 1010, puiss: 940, rad_conj: 960, rad_cube: 950, rec_bound: 1000, rec_sum: 1100, sqrt_sum: 890, suite_seuil: 1060, suite_sum: 1050, suite_sum2: 1060, suite_terms: 1110, suite_theo: 1060, system: 1020, system3: 1150, trig_eq: 1020, trig_study: 1160, trig_values: 1030, tvi_count: 1190, va_lin: 1100 }
  };
  // Titres, comme aux échecs
  const TITLES = [[2500, 'GM', 'Grand Maître : tout le programme maîtrisé, Hardcore compris'], [2400, 'MI', 'Maître International'], [2300, 'MF', 'Maître FIDE'],
    [2200, 'CM', 'Candidat Maître'], [2000, 'Expert', 'Expert : toutes les questions de base, et une bonne part du Hardcore'], [1800, 'Classe A', 'Classe A'],
    [1600, 'Classe B', 'Classe B'], [1400, 'Classe C', 'Classe C'], [1200, 'Classe D', 'Classe D'], [-Infinity, 'Classe E', 'Classe E']];
  const title = elo => { const t = TITLES.find(([min]) => Math.round(elo) >= min); return { abbr: t[1], name: t[2] }; };

  const tplOf = id => { const m = /^gen\.([a-z0-9_]+)\.[0-9a-z]+(?:\.\d+)?$/.exec(String(id)); return m ? m[1] : null; };
  const key = id => { const m = /^gen\.([a-z0-9_]+)\.[0-9a-z]+(?:\.(\d+))?$/.exec(String(id)); return m ? 'g:' + m[1] + (m[2] ? '#' + m[2] : '') : 'b:' + id; };
  const diffOf = (qid, theme) => {
    const t = qid && tplOf(qid);
    if (t && t.startsWith('hc_')) return HC;
    return (t && DIFF.tpl[t]) || DIFF.theme[theme] || 1000;
  };
  const expect = (elo, d) => 1 / (1 + 10 ** ((d - elo) / SCALE));
  // Niveau le plus probable sur un thème (Newton ; les réponses fictives à 0,5 contre 1000 le gardent fini et stable)
  function level(list) {
    const all = list.concat(Array.from({ length: PRIOR }, () => ({ d: 1000, s: 0.5 })));
    let x = 1000;
    for (let it = 0; it < 40; it++) {
      let g = 0, h = 0;
      all.forEach(a => { const e = expect(x, a.d); g += C * (a.s - e); h += C * C * e * (1 - e); });
      const step = Math.max(-300, Math.min(300, g / h));
      x += step;
      if (Math.abs(step) < 0.05) break;
    }
    return Math.max(0, Math.min(MAX, x));
  }

  /* members : [{ id, attempts: [{ at, results: [{ qid, theme, pts, t, skip }] }], controls: [{ at | date, items: [{ theme, pts, max }] }] }]
     Renvoie { rank: [{ m, elo, title, themes, n, ok, hist, d7 }] (du meilleur au moins bon), Q: difficulté par clé, QN, QS } */
  function rank(members) {
    const obs = [];
    members.forEach(m => {
      (m.attempts || []).forEach(a => obs.push({ who: m.id, at: a.at, items: (a.results || []).filter(r => !r.skip && r.theme).map(r => ({ qid: r.qid, theme: r.theme, pts: +r.pts, max: 1, slip: !!r.slip })) }));
      (m.controls || []).forEach(c => obs.push({ who: m.id, at: c.at != null ? c.at : (Date.parse(c.date) || 0), items: (c.items || []).filter(i => i.theme).map(i => ({ theme: i.theme, pts: +i.pts, max: +i.max || 1 })) }));
    });
    const A = {}, LV = {}, N = {}, OK = {}, H = {}, DONE = new Set(), Q = {}, QN = {}, QS = {};
    const global = who => THEMES.reduce((s, th) => s + (LV[who] && LV[who][th] != null ? LV[who][th] : 1000), 0) / THEMES.length;
    obs.sort((a, b) => a.at - b.at).forEach(o => {
      if (!o.items.length || o.items.filter(i => i.pts === 0).length / o.items.length >= 0.8) return;   // copie abandonnée
      const touched = new Set();
      o.items.forEach(i => {
        if (!THEMES.includes(i.theme)) return;
        if (i.qid) { const k = o.who + '|' + i.qid; if (DONE.has(k)) return; DONE.add(k); }      // question refaite : ne compte plus
        const d = diffOf(i.qid, i.theme), s0 = Math.min(1, Math.max(0, (i.pts / i.max + 0.5) / 1.5));
        const s = i.slip && s0 < 1 ? s0 + 0.7 * (1 - s0) : s0;                                     // erreur de calcul : 30 % de la perte
        const T = (A[o.who] = A[o.who] || {})[i.theme] = (A[o.who][i.theme] || { n: [], h: [] });
        (d >= HC ? T.h : T.n).push({ d, s });
        touched.add(i.theme);
        N[o.who] = (N[o.who] || 0) + 1;
        if (i.pts >= i.max) OK[o.who] = (OK[o.who] || 0) + 1;
        const qk = i.qid ? key(i.qid) : 'c:' + i.theme;
        Q[qk] = d; QN[qk] = (QN[qk] || 0) + 1; QS[qk] = (QS[qk] || 0) + (i.pts >= i.max ? 1 : 0);
      });
      if (!touched.size) return;
      const L = LV[o.who] = LV[o.who] || {};
      touched.forEach(th => { const T = A[o.who][th]; L[th] = level(T.n.slice(-WIN).concat(T.h.slice(-WIN_HC))); });
      (H[o.who] = H[o.who] || [[o.at - 1, 1000]]).push([o.at, global(o.who)]);
    });
    const wk = Date.now() - 7 * 864e5;
    const list = members.filter(m => N[m.id]).map(m => {
      const elo = global(m.id), hist = H[m.id];
      return { m, elo, title: title(elo), themes: Object.fromEntries(THEMES.map(th => [th, LV[m.id][th] != null ? LV[m.id][th] : 1000])),
        n: N[m.id], ok: OK[m.id] || 0, hist, d7: elo - ((hist.filter(([t]) => t < wk).pop() || [0, 1000])[1]) };
    }).sort((a, b) => b.elo - a.elo);
    return { rank: list, Q, QN, QS };
  }

  root.QcmElo = { rank, title, key, diffOf, level, expect, THEMES, DIFF, MAX };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.QcmElo;
})(typeof window !== 'undefined' ? window : globalThis);
