/* =====================================================================
   Maîtrise et Elo du QCM maths (0 à 2500) — un seul calcul pour tout le site : maths/index.html (pastilles,
   bilan, « Selon mes erreurs », catalogue, contrôles de groupe, Historique, classement) et moi/index.html.
   ---------------------------------------------------------------------
   Maîtrise d'un thème = FIABILITÉ × COUVERTURE (0 à 100 %).
   - Fiabilité : ce qu'on peut affirmer sans trop risquer de ton taux de réussite récent dans le thème. C'est la
     borne basse de Wilson (z = 1,28, la méthode de Reddit ou Yelp pour classer par note sans se laisser
     tromper par 3 avis), calculée sur tes réponses pondérées par leur récence : chaque nouvelle réponse du
     thème multiplie le poids des anciennes par 0,9 (une erreur pèse moitié moins après 7 réponses). 100 % de
     fiabilité = on est assez sûr que tu réussis au moins 80 % des questions du thème. Beaucoup d'erreurs
     passées → il faut plus de réussites pour remonter ; une faute isolée ne ruine pas tout.
   - Couverture : la moyenne, sur TOUS les types de questions du thème (les modèles du générateur), de ta
     dernière réponse à ce type (juste 1, juste mais « au pif » 1/2, vide 1/3, faux 0, partielle entre les deux). Un type jamais vu
     compte 50 % : on ne sait pas (comme un Elo de départ). 100 % de couverture = chaque type du thème réussi
     la dernière fois. Réussir 5 questions d'un seul type sur 20 ne prouve donc pas qu'on maîtrise le thème.
   Repères (thème de 9 types, jamais travaillé) : 5 justes sur 5 types → 69 %, 9 justes (un par type) → 99 %,
   12 → 100 %. 5 justes sur un seul type → 50 %. 6 faux puis 9 justes → 68 %, 15 → 87 %, 20 → 95 %.
   Elo = moyenne des 21 thèmes de (2000 × maîtrise + bonus Hardcore). 2000 = tout le programme maîtrisé ;
   un thème jamais travaillé compte 0. Bonus Hardcore (0 à +500) : sur les 15 dernières questions Hardcore
   du thème, +33 par juste (une vide ou une partielle en partie) ; 2500 (GM) = tout maîtrisé, Hardcore compris.
   Score d'une réponse : juste = 1, vide = 1/3, faux = 0, partielle entre les deux ; une erreur annotée
   « erreur de calcul » ne coûte que 30 % d'une vraie erreur. Une même question (même qid) refaite ne compte
   qu'une fois ; les copies presque vides (≥ 80 % de réponses à 0) sont ignorées ; les copies du prof importées
   comptent dans la fiabilité (elles n'ont pas de type de question, donc pas dans la couverture).
   Le catalogue des types par thème est recopié ci-dessous (pour moi/) ; maths/ le remplace par celui du
   générateur au chargement (setCatalog), donc un nouveau modèle y est compté tout de suite.
   La table DIFF (difficulté de chaque type, calibrée le 15/10/2026) ne sert qu'à comparer les questions entre
   elles (page moi/), pas au calcul de la maîtrise.
   ===================================================================== */
(function (root) {
  'use strict';
  const MAX = 2500, BASE_MAX = 2000, BONUS = 500, WIN_HC = 15, HC = 2000;
  const LAMBDA = 0.9, Z = 1.28, TARGET = 0.8, UNSEEN = 0.5;
  const THEMES = ['polynomes', 'puiss_rad', 'ln_exp', 'eq_exp', 'fractions', 'developpement', 'equations', 'domaine', 'derivees', 'integrales',
    'limites', 'inegalites', 'equa_diff', 'geometrie', 'continuite', 'suites', 'etude_fonction', 'binomiale', 'espace', 'trigo', 'recurrence'];
  let CATALOG = {
    polynomes: ['poly_comb', 'poly_viete', 'poly_param', 'poly_factor', 'poly_count', 'poly_bicarre', 'poly_sign', 'poly_quad_sym', 'poly_double'],
    puiss_rad: ['puiss', 'rad_cube', 'rad_conj', 'rad_denest', 'pow_factor', 'sqrt_sum', 'sqrt_conj2', 'pow_props', 'pow_compare', 'rad_sum', 'rad_sq2'],
    ln_exp: ['ln_sum', 'exp_ln', 'exp_quot', 'ln_props', 'ln_decomp', 'exp_simpl', 'exp_ln_val', 'ln_ineq', 'exp_ln_coef'],
    eq_exp: ['eq_exp', 'eq_exp_sum', 'eq_exp_ineq', 'eq_exp_lin', 'eq_exp_inv', 'ineq_exp_lin', 'eq_pow_base'],
    fractions: ['frac_nest', 'frac_rat', 'frac_ops', 'frac_same_den', 'frac_simplify', 'frac_decomp', 'frac_lin_eq'],
    developpement: ['develop', 'fact_ident', 'fact_common', 'dev_coef', 'dev_canon', 'dev_cube_coef', 'dev_prod3'],
    equations: ['eq_lin', 'eq_ln', 'eq_quad', 'eq_extr', 'system', 'ineq_quad', 'ineq_quot', 'eq_sqrt', 'system3', 'eq_param', 'eq_abs'],
    domaine: ['domain', 'dom_quad', 'dom_mix', 'dom_ln_quot', 'dom_sqrt_ln', 'dom_inv_exp'],
    derivees: ['deriv', 'deriv_comp', 'deriv_value', 'deriv_tangent', 'deriv_second', 'deriv_trig', 'deriv_quot_val', 'deriv_comp_val', 'deriv_chain'],
    integrales: ['integ', 'integ_poly', 'integ_ipp', 'integ_mean', 'integ_area', 'integ_trig', 'integ_props', 'prim_choice', 'integ_exp_lin', 'integ_ln_uprime'],
    limites: ['limit', 'lim_croiss', 'lim_point', 'lim_side', 'lim_seq_geo', 'lim_compare', 'lim_rational', 'lim_exp_quot', 'lim_mix'],
    geometrie: ['geo_d', 'geo_d2', 'inter', 'parab', 'geo', 'geo_circle', 'geo_scal', 'geo_line_vec', 'geo_circle_tan'],
    inegalites: ['ineq', 'ineq_b', 'ineq_logic', 'ineq_order', 'ineq_square'],
    equa_diff: ['edo', 'edo_ivp', 'edo_hom', 'edo_ivp_b', 'edo_part', 'edo_check', 'edo_prim'],
    continuite: ['cont3', 'cont_c1', 'cont_inv', 'cont_one', 'tvi_interval', 'tvi_count', 'cont_fixed'],
    suites: ['suite', 'suite_sum', 'suite_terms', 'suite_sum2', 'suite_monot', 'suite_seuil', 'suite_rec_terms', 'suite_theo', 'suite_rank', 'suite_geo_find'],
    etude_fonction: ['fct', 'fct_poly3', 'fct_xexp', 'fct_ln', 'fct_convex', 'fct_min_inv', 'fct_asym_hom'],
    binomiale: ['bin', 'denombr', 'bin_exact', 'va_lin', 'bienayme', 'proba_tot', 'bin_seuil', 'bin_esp_var'],
    espace: ['esp_plane_eq', 'esp_param', 'esp_inter', 'esp_proj', 'esp_vec', 'esp_pos', 'esp_dist', 'esp_ortho_m'],
    trigo: ['trig_values', 'trig_eq', 'trig_ineq', 'trig_props', 'trig_study', 'trig_ident', 'trig_parity'],
    recurrence: ['rec_formula', 'rec_sum', 'rec_bound', 'rec_steps', 'rec_conj']
  };
  const DIFF = {
    theme: { binomiale: 1050, continuite: 1150, derivees: 970, developpement: 1010, domaine: 990, eq_exp: 1070, equa_diff: 1050, equations: 1060, espace: 990, etude_fonction: 1070, fractions: 1000, geometrie: 1200, inegalites: 940, integrales: 1060, limites: 1040, ln_exp: 1060, polynomes: 1060, puiss_rad: 920, recurrence: 1030, suites: 1090, trigo: 1050 },
    tpl: { bin: 1000, bin_seuil: 1100, cont_c1: 1210, cont_inv: 1120, cont_one: 1200, denombr: 1000, deriv_comp: 1010, deriv_trig: 950, deriv_value: 950, dev_canon: 1030, dev_coef: 960, dev_prod3: 990, dom_inv_exp: 970, dom_mix: 970, dom_quad: 1010, domain: 960, edo: 1090, edo_part: 1020, eq_abs: 1030, eq_exp_ineq: 1110, eq_exp_inv: 1040, eq_exp_lin: 1010, eq_pow_base: 1100, eq_quad: 1120, eq_sqrt: 1030, esp_inter: 970, esp_plane_eq: 970, esp_proj: 1030, exp_ln: 1030, exp_ln_val: 1090, fact_ident: 1070, fct: 1210, fct_asym_hom: 1040, fct_ln: 990, fct_poly3: 1140, fct_xexp: 1060, frac_lin_eq: 980, frac_nest: 1040, frac_rat: 1040, frac_same_den: 960, frac_simplify: 980, geo: 1160, geo_circle: 1290, geo_circle_tan: 1240, geo_scal: 1120, ineq: 920, ineq_exp_lin: 1020, ineq_quad: 1090, integ: 1080, integ_area: 1140, integ_mean: 1030, lim_compare: 1010, lim_croiss: 970, lim_exp_quot: 1100, lim_point: 1140, lim_rational: 1010, lim_seq_geo: 990, limit: 1140, ln_decomp: 1040, ln_sum: 1020, parab: 1220, poly_comb: 1100, poly_viete: 1000, pow_props: 900, proba_tot: 1010, puiss: 940, rad_conj: 960, rad_cube: 950, rec_bound: 1000, rec_sum: 1100, sqrt_sum: 890, suite_seuil: 1060, suite_sum: 1050, suite_sum2: 1060, suite_terms: 1110, suite_theo: 1060, system: 1020, system3: 1150, trig_eq: 1020, trig_study: 1160, trig_values: 1030, tvi_count: 1190, va_lin: 1100 }
  };
  // Titres, comme aux échecs
  const TITLES = [[2500, 'GM', 'Grand Maître : tout le programme maîtrisé, Hardcore compris'], [2400, 'MI', 'Maître International'], [2300, 'MF', 'Maître FIDE'],
    [2200, 'CM', 'Candidat Maître'], [2000, 'Expert', 'Expert : tout le programme maîtrisé (chaque thème fiable et couvert)'], [1800, 'Classe A', 'Classe A'],
    [1600, 'Classe B', 'Classe B'], [1400, 'Classe C', 'Classe C'], [1200, 'Classe D', 'Classe D'], [-Infinity, 'Classe E', 'Classe E']];
  const title = elo => { const t = TITLES.find(([min]) => Math.round(elo) >= min); return { abbr: t[1], name: t[2] }; };

  const tplOf = id => { const m = /^gen\.([a-z0-9_]+)\.[0-9a-z]+(?:\.\d+)?$/.exec(String(id)); return m ? m[1] : null; };
  const key = id => { const m = /^gen\.([a-z0-9_]+)\.[0-9a-z]+(?:\.(\d+))?$/.exec(String(id)); return m ? 'g:' + m[1] + (m[2] ? '#' + m[2] : '') : 'b:' + id; };
  const diffOf = (qid, theme) => {
    const t = qid && tplOf(qid);
    if (t && t.startsWith('hc_')) return HC;
    return (t && DIFF.tpl[t]) || DIFF.theme[theme] || 1000;
  };
  // catalogue du générateur : { thème: [types normaux] }
  function setCatalog(c) { if (c && typeof c === 'object') CATALOG = c; }

  /* ---------- Maîtrise d'un thème ---------- */
  const wilson = (S, n) => { if (n <= 0) return 0; const p = S / n, z2 = Z * Z; return (p + z2 / (2 * n) - Z * Math.sqrt(Math.max(0, p * (1 - p) / n + z2 / (4 * n * n)))) / (1 + z2 / n); };
  const newTheme = () => ({ S: 0, n: 0, cnt: 0, last: {}, h: [] });
  function addTo(T, th, i, s) {
    if (i.qid && tplOf(i.qid) && tplOf(i.qid).startsWith('hc_')) { T.h.push({ s }); return; }
    T.S = T.S * LAMBDA + s; T.n = T.n * LAMBDA + 1; T.cnt++;
    const tp = i.qid && tplOf(i.qid);
    if (tp && (CATALOG[th] || []).includes(tp)) T.last[tp] = i.conf === 'p' && s >= 1 ? 0.5 : s;   // juste « au pif » : à moitié couvert
  }
  function themeMastery(T, th) {
    const types = CATALOG[th] || [];
    if (!T || !T.cnt) return { M: 0, R: 0, C: 0, n: 0, seen: 0, types: types.length };
    const R = Math.min(1, wilson(T.S, T.n) / TARGET);
    const C = types.length ? types.reduce((a, tp) => a + (tp in T.last ? T.last[tp] : UNSEEN), 0) / types.length : 1;
    return { M: R * C, R, C, n: T.cnt, seen: Object.keys(T.last).length, types: types.length };
  }
  const bonus = list => Math.min(BONUS, BONUS / WIN_HC * list.reduce((t, a) => t + a.s, 0));
  const themeLevel = (T, th) => Math.min(MAX, BASE_MAX * themeMastery(T, th).M + bonus((T ? T.h : []).slice(-WIN_HC)));
  // score d'une réponse : faux (−0,5) 0, vide 1/3, juste 1 ; erreur de calcul : 30 % de la perte
  const scoreOf = i => { const s0 = Math.min(1, Math.max(0, (i.pts / i.max + 0.5) / 1.5)); return i.slip && s0 < 1 ? s0 + 0.7 * (1 - s0) : s0; };

  // copies d'un membre → observations dans l'ordre (épreuves et copies du prof)
  function observations(m) {
    const obs = [];
    (m.attempts || []).forEach(a => obs.push({ who: m.id, at: a.at, items: (a.results || []).filter(r => !r.skip && r.theme).map(r => ({ qid: r.qid, theme: r.theme, pts: +r.pts, max: 1, slip: !!r.slip, conf: r.conf })) }));
    (m.controls || []).forEach(c => obs.push({ who: m.id, at: c.at != null ? c.at : (Date.parse(c.date) || 0), items: (c.items || []).filter(i => i.theme).map(i => ({ theme: i.theme, pts: +i.pts, max: +i.max || 1 })) }));
    return obs;
  }

  /* members : [{ id, attempts: [{ at, results: [{ qid, theme, pts, t, skip, slip }] }], controls: [{ at | date, items: [{ theme, pts, max }] }] }]
     Renvoie { rank: [{ m, elo, title, themes, mastery, n, ok, hist, d7 }] (du meilleur au moins bon), Q: difficulté par clé, QN, QS }
     themes : niveau 0–2500 de chaque thème ; mastery : { M, R, C, n, seen, types } de chaque thème */
  function rank(members) {
    const obs = [].concat(...members.map(observations));
    const A = {}, N = {}, OK = {}, H = {}, DONE = new Set(), Q = {}, QN = {}, QS = {};
    const level = (who, th) => themeLevel(A[who] && A[who][th], th);
    const global = who => THEMES.reduce((s, th) => s + level(who, th), 0) / THEMES.length;
    obs.sort((a, b) => a.at - b.at).forEach(o => {
      if (!o.items.length || o.items.filter(i => i.pts === 0).length / o.items.length >= 0.8) return;   // copie abandonnée
      let touched = false;
      o.items.forEach(i => {
        if (!THEMES.includes(i.theme)) return;
        if (i.qid) { const k = o.who + '|' + i.qid; if (DONE.has(k)) return; DONE.add(k); }      // question refaite : ne compte plus
        const T = (A[o.who] = A[o.who] || {})[i.theme] = (A[o.who][i.theme] || newTheme());
        addTo(T, i.theme, i, scoreOf(i));
        touched = true;
        N[o.who] = (N[o.who] || 0) + 1;
        if (i.pts >= i.max) OK[o.who] = (OK[o.who] || 0) + 1;
        const d = diffOf(i.qid, i.theme), qk = i.qid ? key(i.qid) : 'c:' + i.theme;
        Q[qk] = d; QN[qk] = (QN[qk] || 0) + 1; QS[qk] = (QS[qk] || 0) + (i.pts >= i.max ? 1 : 0);
      });
      if (touched) (H[o.who] = H[o.who] || [[o.at - 1, 0]]).push([o.at, global(o.who)]);
    });
    const wk = Date.now() - 7 * 864e5;
    const list = members.filter(m => N[m.id]).map(m => {
      const elo = global(m.id), hist = H[m.id];
      return { m, elo, title: title(elo), themes: Object.fromEntries(THEMES.map(th => [th, level(m.id, th)])),
        mastery: Object.fromEntries(THEMES.map(th => [th, themeMastery(A[m.id] && A[m.id][th], th)])),
        n: N[m.id], ok: OK[m.id] || 0, hist, d7: elo - ((hist.filter(([t]) => t < wk).pop() || [0, 0])[1]) };
    }).sort((a, b) => b.elo - a.elo);
    return { rank: list, Q, QN, QS };
  }
  // Maîtrise d'un seul compte : { themes: { thème: { M, R, C, n, seen, types } }, level: { thème: 0–2500 }, elo }
  function mastery(m) {
    const r = rank([Object.assign({ id: m.id || 'moi' }, m)]).rank[0];
    if (r) return { themes: r.mastery, level: r.themes, elo: r.elo };
    return { themes: Object.fromEntries(THEMES.map(th => [th, themeMastery(null, th)])), level: Object.fromEntries(THEMES.map(th => [th, 0])), elo: 0 };
  }

  root.QcmElo = { rank, mastery, title, key, diffOf, bonus, themeLevel, themeMastery, setCatalog, catalog: () => CATALOG, THEMES, DIFF, MAX, TARGET };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.QcmElo;
})(typeof window !== 'undefined' ? window : globalThis);
