/* =====================================================================
   Leçons « Comprendre » de l'atomistique (1re partie : L'atome).
   Une leçon par compétence du parcours (clé = id de SK dans index.html). Elle passe avant les
   exercices : l'idée physique, une analogie, puis une question sans enjeu par étape, et un calcul
   guidé quand la compétence en demande. Les questions utilisent les mêmes types que les exercices
   (choice, num, int, conf), vérifiés par check() de la page.
   window.ATO_LEARN(H) reçoit les outils de la page : H.conf(Z), H.ionConf(Z, q)…
   Constantes du poly : h = 6,626e-34 J·s, c = 3,00e8 m/s, 1 eV = 1,602e-19 J, R_H = 1,097e7 m⁻¹.
   ===================================================================== */
(function () {
  'use strict';
  window.ATO_LEARN = function (H) {
    const ch = (v, t) => ({ v, t });
    const choice = (label, opts, ans) => ({ type: 'choice', label, opts: opts.map(([v, t]) => ch(v, t)), ans });
    const num = (label, unit, val, tol = 0.02) => ({ type: 'num', label, unit, val, tol });
    const int = (label, val) => ({ type: 'int', label, val });
    const conf = (Z, label, o) => ({ type: 'conf', label, conf: o || H.conf(Z), Z });

    /* ---------- Figures (SVG, couleurs du thème ; 420 de large pour rester lisibles sur téléphone) ---------- */
    const INK = 'fill:var(--ink-2);font:15px var(--sans)';
    function wavePath(x0, y0, w, lam, A) { let d = ''; for (let x = 0; x <= w; x += 2) d += (x ? 'L' : 'M') + (x0 + x) + ' ' + (y0 - A * Math.sin(2 * Math.PI * x / lam)).toFixed(1); return d; }
    function dim(x1, x2, y, label) {
      return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" style="stroke:var(--ink-2)" stroke-width="1.2"/><path d="M${x1} ${y}l7 -4v8z M${x2} ${y}l-7 -4v8z" style="fill:var(--ink-2)"/>
        <line x1="${x1}" y1="${y - 6}" x2="${x1}" y2="${y + 20}" style="stroke:var(--ink-2)" stroke-dasharray="3 3"/><line x1="${x2}" y1="${y - 6}" x2="${x2}" y2="${y + 20}" style="stroke:var(--ink-2)" stroke-dasharray="3 3"/>
        <text x="${(x1 + x2) / 2}" y="${y - 7}" text-anchor="middle" style="${INK};font-style:italic;font-size:17px">${label}</text>`;
    }
    const WAVES = `<svg class="lfig" viewBox="0 0 420 226" role="img" aria-label="Deux ondes : une de grande longueur d'onde (rouge), une de petite longueur d'onde (violette)">
      ${dim(50, 170, 24, 'λ')}<path d="${wavePath(20, 70, 380, 120, 24)}" fill="none" stroke="#e11d48" stroke-width="2.5"/>
      <text x="20" y="116" style="${INK}">grande λ (rouge) : ν petite</text>
      ${dim(32, 80, 146, 'λ')}<path d="${wavePath(20, 182, 380, 48, 20)}" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
      <text x="20" y="222" style="${INK}">petite λ (violet) : ν grande</text></svg>`;
    // spectre de 100 à 1000 nm, raies optionnelles [λ nm, étiquette]
    const xs = l => 20 + (l - 100) / 900 * 380;
    function spectrum(lines = []) {
      const stops = [[400, '#7c3aed'], [450, '#2563eb'], [495, '#06b6d4'], [530, '#22c55e'], [580, '#eab308'], [615, '#f97316'], [680, '#dc2626'], [750, '#7f1d1d']];
      return `<svg class="lfig" viewBox="0 0 420 ${lines.length ? 150 : 112}" role="img" aria-label="Spectre électromagnétique de l'ultraviolet à l'infrarouge">
        <defs><linearGradient id="lgVis" x1="0" x2="1">${stops.map(([l, c]) => `<stop offset="${((l - 400) / 350).toFixed(3)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
        <rect x="${xs(100)}" y="32" width="${xs(400) - xs(100)}" height="38" style="fill:var(--sheet-2);stroke:var(--rule-strong)"/>
        <rect x="${xs(400)}" y="32" width="${xs(750) - xs(400)}" height="38" fill="url(#lgVis)"/>
        <rect x="${xs(750)}" y="32" width="${xs(1000) - xs(750)}" height="38" style="fill:var(--sheet-2);stroke:var(--rule-strong)"/>
        <text x="${(xs(100) + xs(400)) / 2}" y="56" text-anchor="middle" style="${INK};font-weight:700">UV</text>
        <text x="${(xs(750) + xs(1000)) / 2}" y="56" text-anchor="middle" style="${INK};font-weight:700">IR</text>
        <text x="${xs(400)}" y="24" text-anchor="middle" style="${INK};font-size:14px">400 nm</text><text x="${xs(750)}" y="24" text-anchor="middle" style="${INK};font-size:14px">750 nm</text>
        ${lines.length ? '' : `<text x="20" y="96" style="${INK};font-size:14px">← plus d'énergie</text><text x="400" y="96" text-anchor="end" style="${INK};font-size:14px">moins d'énergie →</text>`}
        ${lines.map(([l, t], i) => `<line x1="${xs(l)}" y1="28" x2="${xs(l)}" y2="74" stroke="#111" stroke-width="2.5"/><line x1="${xs(l)}" y1="28" x2="${xs(l)}" y2="74" stroke="#fff" stroke-width="1"/><line x1="${xs(l)}" y1="74" x2="${xs(l)}" y2="${[96, 118, 96, 118][i % 4] - 13}" style="stroke:var(--ink-2)" stroke-dasharray="2 2"/><text x="${xs(l)}" y="${[96, 118, 96, 118][i % 4]}" text-anchor="middle" style="${INK};font-size:14px">${t}</text>`).join('')}</svg>`;
    }
    // diagramme d'énergie de H : flèches [départ, arrivée, x, couleur], étiquettes [x, texte, couleur]
    const yE = E => 30 + 236 * (-E / 13.6), yN = n => n === Infinity ? 30 : yE(-13.6 / (n * n));
    function levels(arrows = [], labels = []) {
      const L = [1, 2, 3, 4, 5, 6].map(n => `<line x1="62" y1="${yN(n).toFixed(1)}" x2="332" y2="${yN(n).toFixed(1)}" style="stroke:var(--ink-2)" stroke-width="${n <= 3 ? 1.6 : 0.8}" ${n > 3 ? 'stroke-dasharray="4 3"' : ''}/>`).join('');
      const lab = [[1, '−13,6'], [2, '−3,40'], [3, '−1,51']].map(([n, e]) => `<text x="56" y="${yN(n) + 5}" text-anchor="end" style="${INK}">n = ${n}</text><text x="338" y="${yN(n) + 5}" style="${INK}">${e} eV</text>`).join('');
      const ar = arrows.map(([a, b, x, col]) => { const y1 = yN(a), y2 = yN(b), s = y2 > y1 ? 1 : -1; return `<line x1="${x}" y1="${y1.toFixed(1)}" x2="${x}" y2="${(y2 - 8 * s).toFixed(1)}" stroke="${col}" stroke-width="2.2"/><path d="M${x} ${y2.toFixed(1)}l-5 ${-9 * s}h10z" fill="${col}"/>`; }).join('');
      return `<svg class="lfig" viewBox="0 0 420 ${labels.length ? 306 : 284}" role="img" aria-label="Niveaux d'énergie de l'atome d'hydrogène">
        <line x1="62" y1="30" x2="332" y2="30" style="stroke:var(--ink-2)" stroke-width="1.6"/><text x="56" y="35" text-anchor="end" style="${INK}">n = ∞</text><text x="338" y="35" style="${INK}">0 eV</text>
        ${L}${lab}${ar}
        ${labels.map(([x, t, col]) => `<text x="${x}" y="298" text-anchor="middle" style="font:700 13.5px var(--sans);fill:${col}">${t}</text>`).join('')}</svg>`;
    }
    const tbl = (head, rows) => `<table class="t"><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`;
    const mono = s => `<span style="font-family:ui-monospace,Menlo,Consolas,monospace">${s}</span>`;

    return {
      /* =================== I. Structure de l'atome =================== */
      noyau: { title: 'Ce qu\'il y a dans un atome', meth: "\\(Z\\) = protons (c'est l'élément), \\(N = A - Z\\) neutrons, électrons = \\(Z\\) − charge (un cation a <b>perdu</b> des électrons).", steps: [
        { h: 'Un noyau minuscule qui porte presque toute la masse',
          body: `<p>Un atome, c'est un <b>noyau</b> (des protons, chargés +e, et des neutrons, neutres) entouré d'<b>électrons</b> (chargés −e). Protons et neutrons sont les <b>nucléons</b>.</p>
            <ul><li>Tailles : noyau ≈ \\(10^{-14}\\) m, atome ≈ \\(10^{-10}\\) m (1 Å). L'atome est 10 000 fois plus grand que son noyau : si le noyau était une bille de 1 cm, les électrons seraient à 100 m. <b>L'atome est surtout du vide.</b></li>
            <li>Masses : \\(m_p \\approx m_n \\approx 1{,}67\\times10^{-27}\\) kg, \\(m_e = 9{,}11\\times10^{-31}\\) kg, soit 1836 fois moins.</li></ul>`,
          ask: { q: 'Où se trouve presque toute la masse d\'un atome ?', items: [choice('réponse', [['n', 'dans le noyau'], ['e', 'dans les électrons'], ['r', 'répartie à parts égales']], 'n')],
            why: 'Les nucléons sont près de 2000 fois plus lourds que les électrons : la masse est dans le noyau, alors que le volume est donné par le nuage d\'électrons.' } },
        { h: 'Z, A et N : la carte d\'identité du noyau',
          body: `<p>On note un atome \\({}^{A}_{Z}\\mathrm{X}\\) :</p>
            <ul><li>\\(Z\\) = nombre de <b>protons</b> = numéro atomique. C'est lui qui définit l'<b>élément</b> : \\(Z = 6\\), c'est toujours du carbone.</li>
            <li>\\(A\\) = nombre de <b>nucléons</b> (nombre de masse).</li><li>\\(N = A - Z\\) = nombre de <b>neutrons</b>.</li></ul>
            <p>Un atome est neutre : il a autant d'électrons que de protons, donc \\(Z\\) électrons. Exemple : \\({}^{35}_{17}\\mathrm{Cl}\\) a 17 protons, \\(35 - 17 = 18\\) neutrons et 17 électrons.</p>`,
          ask: { q: 'Pour l\'atome \\({}^{56}_{26}\\mathrm{Fe}\\) :', items: [int('neutrons', 30), int('électrons', 26)],
            why: '\\(N = A - Z = 56 - 26 = 30\\) neutrons. Atome neutre : autant d\'électrons que de protons, 26.' } },
        { h: 'Les ions : seuls les électrons bougent',
          body: `<p>La chimie ne touche jamais au noyau. Un <b>ion</b> est un atome qui a perdu ou gagné des électrons :</p>
            <ul><li><b>Cation</b> \\(\\mathrm{X}^{q+}\\) : il a <b>perdu</b> \\(q\\) électrons. Il est positif parce qu'il lui reste plus de protons que d'électrons.</li>
            <li><b>Anion</b> \\(\\mathrm{X}^{q-}\\) : il a <b>gagné</b> \\(q\\) électrons.</li></ul>
            <p>Nombre d'électrons = \\(Z - \\text{charge}\\). Na<sup>+</sup> (Z = 11) : 10 électrons ; Cl<sup>−</sup> (Z = 17) : 18 électrons.</p>`,
          ask: { q: 'Combien d\'électrons ont ces ions ?', items: [int('\\mathrm{O}^{2-}\\ (Z = 8)', 10), int('\\mathrm{Fe}^{3+}\\ (Z = 26)', 23)],
            why: 'O<sup>2−</sup> a gagné 2 électrons : 8 + 2 = 10. Fe<sup>3+</sup> en a perdu 3 : 26 − 3 = 23. Piège classique : « + » veut dire électrons <b>perdus</b>.' } },
        { h: 'Isotopes ou isobares ?',
          body: `<ul><li><b>Isotopes</b> : même \\(Z\\), \\(N\\) différents (donc \\(A\\) différents). C'est le <b>même élément</b>, avec la même chimie et une masse différente : \\({}^{12}\\mathrm{C}\\) et \\({}^{14}\\mathrm{C}\\).</li>
            <li><b>Isobares</b> : même \\(A\\), \\(Z\\) différents. Ce sont des <b>éléments différents</b> : \\({}^{14}\\mathrm{C}\\) et \\({}^{14}\\mathrm{N}\\).</li></ul>
            <p>Moyen mnémotechnique : isoto<b>P</b>es, même nombre de <b>P</b>rotons ; isob<b>A</b>res, même <b>A</b>.</p>`,
          ask: { q: '\\({}^{40}_{18}\\mathrm{Ar}\\) et \\({}^{40}_{20}\\mathrm{Ca}\\) sont :', items: [choice('réponse', [['iso', 'isotopes'], ['bar', 'isobares'], ['ni', 'ni l\'un ni l\'autre']], 'bar')],
            why: 'Même \\(A = 40\\) mais \\(Z\\) différents (18 et 20) : deux éléments différents de même nombre de masse, ce sont des isobares.' } }
      ] },

      iso: { title: 'Isotopes et masse molaire', meth: "masse molaire = moyenne pondérée \\(M = \\sum x_i M_i\\) avec \\(\\sum x_i = 1\\) ; pour retrouver une abondance, pose \\(x\\) et \\(1 - x\\).", steps: [
        { h: 'La mole : compter les atomes par paquets',
          body: `<p>Un atome est bien trop léger pour être pesé seul. On compte donc par <b>paquets</b> : 1 mole = \\(N_A = 6{,}022\\times10^{23}\\) entités (autant que d'atomes dans 12 g de carbone 12). C'est comme une « douzaine », en beaucoup plus gros.</p>
            <p>La <b>masse molaire</b> \\(M\\) (g/mol) est la masse d'une mole. Pour un isotope, \\(M \\approx A\\) g/mol, car chaque nucléon pèse environ 1 u (1 u = 1/12 de la masse d'un atome de \\({}^{12}\\mathrm{C}\\) = \\(1{,}66\\times10^{-27}\\) kg) : \\({}^{12}\\mathrm{C}\\) fait 12 g/mol.</p>`,
          ask: { q: 'Combien d\'atomes y a-t-il dans 0,5 mol de fer ?', items: [num('N', '', 3.011e23, 0.01)],
            why: '\\(N = n \\times N_A = 0{,}5 \\times 6{,}022\\times10^{23} = 3{,}01\\times10^{23}\\) atomes.' } },
        { h: 'Un élément naturel est un mélange d\'isotopes',
          body: `<p>Le chlore naturel contient environ 75 % de \\({}^{35}\\mathrm{Cl}\\) et 25 % de \\({}^{37}\\mathrm{Cl}\\), toujours dans les mêmes proportions : ce sont les <b>abondances naturelles</b> \\(x_i\\), avec \\(\\sum x_i = 1\\).</p>
            <p>La masse molaire du tableau périodique est donc une <b>moyenne pondérée</b>, comme une moyenne avec coefficients :</p>\\[M = \\sum_i x_i M_i = 0{,}75\\times35 + 0{,}25\\times37 = 35{,}5\\ \\text{g/mol}\\]
            <p>C'est pour ça que \\(M(\\mathrm{Cl})\\) n'est pas un nombre entier.</p>`,
          ask: { q: 'Le bore naturel contient 20 % de \\({}^{10}\\mathrm{B}\\) (10,01 g/mol) et 80 % de \\({}^{11}\\mathrm{B}\\) (11,01 g/mol). Sa masse molaire ?', items: [num('M', 'g/mol', 10.81, 0.002)],
            why: '\\(M = 0{,}20\\times10{,}01 + 0{,}80\\times11{,}01 = 2{,}002 + 8{,}808 = 10{,}81\\) g/mol. Le résultat est plus proche de 11 : c\'est l\'isotope majoritaire.' } },
        { h: 'Le sens inverse : retrouver les abondances (CC 2021)',
          body: `<p>Le CC de 2021 donnait \\(M(\\mathrm{Cu}) = 63{,}55\\) g/mol et les isotopes \\({}^{63}\\mathrm{Cu}\\) (62,93 g/mol) et \\({}^{65}\\mathrm{Cu}\\) (64,93 g/mol). On cherche les proportions.</p>
            <p>On appelle \\(x\\) la proportion de \\({}^{63}\\mathrm{Cu}\\) ; l'autre vaut \\(1 - x\\) :</p>\\[M = x M_1 + (1 - x) M_2 \\Rightarrow x = \\frac{M - M_2}{M_1 - M_2}\\]
            <p>Avant de calculer, devine : la moyenne est plus près de l'isotope le plus abondant. Après, vérifie que \\(0 < x < 1\\).</p>`,
          ask: { q: 'Pour le cuivre :', items: [choice('sans calcul', [['63', '\\({}^{63}\\mathrm{Cu}\\) est majoritaire'], ['65', '\\({}^{65}\\mathrm{Cu}\\) est majoritaire']], '63'), num('x({}^{63}\\mathrm{Cu})', '%', 69, 0.015)],
            why: '63,55 est plus proche de 62,93 que de 64,93, donc \\({}^{63}\\mathrm{Cu}\\) domine. \\(x = \\dfrac{63{,}55 - 64{,}93}{62{,}93 - 64{,}93} = \\dfrac{-1{,}38}{-2} = 0{,}69\\) : 69 % de \\({}^{63}\\mathrm{Cu}\\) et 31 % de \\({}^{65}\\mathrm{Cu}\\).' } }
      ] },

      /* =================== II. Spectres atomiques =================== */
      onde: { title: 'La lumière : onde et photons', meth: "\\(\\nu = c/\\lambda\\) et \\(E = h\\nu = hc/\\lambda\\) ; λ en mètres ; 1 eV = \\(1{,}602\\times10^{-19}\\) J.", steps: [
        { h: 'Une onde, c\'est une oscillation qui avance',
          body: `<p>La lumière est une <b>onde électromagnétique</b> : un champ électrique et un champ magnétique qui oscillent en avançant, dans le vide, à \\(c = 3{,}00\\times10^{8}\\) m/s. Deux grandeurs la décrivent :</p>
            <ul><li>la <b>longueur d'onde</b> \\(\\lambda\\) (en m) : la distance entre deux crêtes ;</li><li>la <b>fréquence</b> \\(\\nu\\) (en Hz, c'est-à-dire s⁻¹) : le nombre d'oscillations par seconde.</li></ul>${WAVES}
            <p>Elles sont liées. En une seconde, l'onde avance de \\(c\\) mètres, et chaque oscillation occupe \\(\\lambda\\) mètres : il passe donc \\(c / \\lambda\\) oscillations par seconde.</p>\\[\\nu = \\frac{c}{\\lambda}\\quad\\Longleftrightarrow\\quad c = \\lambda\\,\\nu\\]
            <p class="fine">Pas besoin de l'apprendre par cœur : ce raisonnement suffit à la retrouver.</p>`,
          ask: { q: 'Si on double la longueur d\'onde \\(\\lambda\\), que devient la fréquence \\(\\nu\\) ?', items: [choice('réponse', [['x2', 'elle double'], ['d2', 'elle est divisée par 2'], ['eq', 'elle ne change pas']], 'd2')],
            why: '\\(\\nu = c/\\lambda\\) avec \\(c\\) fixé : des crêtes deux fois plus espacées passent deux fois moins souvent. \\(\\lambda\\) et \\(\\nu\\) varient toujours en sens inverse.' } },
        { h: 'La couleur, c\'est la longueur d\'onde',
          body: `<p>Notre œil ne voit qu'une petite partie des ondes électromagnétiques : de 400 nm (violet) à 750 nm environ (rouge), avec 1 nm = \\(10^{-9}\\) m. En dessous, c'est l'<b>ultraviolet</b> (UV) ; au-dessus, l'<b>infrarouge</b> (IR).</p>${spectrum()}
            <p>La lumière blanche (le Soleil) contient toutes les longueurs d'onde : à travers un prisme, elle donne un arc-en-ciel sans trou, un <b>spectre continu</b>.</p>`,
          ask: { q: 'Une radiation de longueur d\'onde \\(\\lambda = 656\\) nm est :', items: [choice('réponse', [['uv', 'dans l\'UV'], ['r', 'visible, plutôt rouge'], ['v', 'visible, plutôt violette'], ['ir', 'dans l\'IR']], 'r')],
            why: '656 nm est entre 400 et 750 nm, du côté des grandes longueurs d\'onde : c\'est du rouge. C\'est la célèbre raie rouge de l\'hydrogène, qu\'on retrouvera.' } },
        { h: 'La lumière arrive aussi par grains : les photons',
          body: `<p>L'<b>effet photoélectrique</b> : on éclaire un métal. Des électrons sont arrachés seulement si la fréquence dépasse un seuil. Une lampe rouge très puissante n'arrache rien, alors qu'une faible lampe UV y arrive. Une onde ordinaire ne fait pas ça : en augmentant la puissance, elle finirait par apporter assez d'énergie.</p>
            <p>Explication (Planck en 1900, Einstein en 1905) : l'énergie lumineuse voyage en <b>paquets</b>, les <b>photons</b> (masse et charge nulles). Chaque photon transporte</p>\\[E = h\\,\\nu,\\qquad h = 6{,}626\\times10^{-34}\\ \\text{J·s (constante de Planck)}\\]
            <ul><li>la <b>couleur</b> (\\(\\nu\\)) fixe l'énergie de <b>chaque</b> photon ;</li><li>la <b>puissance</b> de la lampe fixe le <b>nombre</b> de photons.</li></ul>
            <p>Image : mille balles de ping-pong ne cassent pas une vitre, une seule boule de bowling si. Un électron reçoit un photon d'un coup, jamais un morceau. On dit que les échanges d'énergie sont <b>quantifiés</b>.</p>`,
          ask: { q: 'Une lampe rouge très puissante et une petite lampe UV : laquelle envoie les photons les plus énergétiques ?', items: [choice('réponse', [['r', 'la lampe rouge, car elle est plus puissante'], ['uv', 'la lampe UV'], ['eq', 'c\'est pareil']], 'uv')],
            why: 'L\'énergie d\'un photon vaut \\(h\\nu\\) : elle ne dépend que de la fréquence. Les UV ont une fréquence plus grande que le rouge. La lampe rouge envoie seulement plus de photons, chacun plus faible.' } },
        { h: 'Petite λ, grosse énergie',
          body: `<p>On combine les deux relations : \\(E = h\\nu\\) et \\(\\nu = c/\\lambda\\) donnent</p>\\[E = h\\nu = \\frac{hc}{\\lambda}\\]
            <p>C'est <b>la</b> formule du photon, tout le reste en découle. Plus \\(\\lambda\\) est petite, plus le photon est énergétique : UV > visible > IR. C'est pour ça que les UV brûlent la peau alors que les IR ne font que chauffer.</p>`,
          ask: { q: 'Par rapport à un photon de 800 nm, un photon de 200 nm transporte :', items: [choice('réponse', [['q', '4 fois moins d\'énergie'], ['eq', 'autant d\'énergie'], ['x4', '4 fois plus d\'énergie'], ['x16', '16 fois plus d\'énergie']], 'x4')],
            why: '\\(E = hc/\\lambda\\) : l\'énergie est inversement proportionnelle à \\(\\lambda\\). Une longueur d\'onde 4 fois plus petite donne une énergie 4 fois plus grande.' } },
        { h: 'Joules ou électronvolts ?',
          body: `<p>Un photon visible transporte environ \\(4\\times10^{-19}\\) J : le joule est une unité bien trop grosse à l'échelle de l'atome. On utilise l'<b>électronvolt</b> :</p>\\[1\\ \\text{eV} = 1{,}602\\times10^{-19}\\ \\text{J}\\]
            <ul><li>J → eV : on <b>divise</b> par \\(1{,}602\\times10^{-19}\\) ;</li><li>eV → J : on <b>multiplie</b> par \\(1{,}602\\times10^{-19}\\).</li></ul>
            <p>Toutes les énergies des atomes sont données en eV (par exemple 13,6 eV pour l'hydrogène). Un raccourci pour vérifier tes calculs, puisque \\(hc / e = 1{,}24\\times10^{-6}\\) m·eV :</p>\\[E\\,(\\text{eV}) \\approx \\frac{1240}{\\lambda\\,(\\text{nm})}\\]`,
          ask: { q: 'Énergie d\'un photon de 620 nm, en eV ?', items: [num('E', 'eV', 2.001, 0.03)],
            why: '\\(1240 / 620 = 2{,}00\\) eV, soit \\(2{,}00 \\times 1{,}602\\times10^{-19} = 3{,}20\\times10^{-19}\\) J. Par la formule complète : \\(hc/\\lambda = \\dfrac{6{,}626\\times10^{-34}\\times3{,}00\\times10^{8}}{620\\times10^{-9}} = 3{,}21\\times10^{-19}\\) J.' } },
        { h: 'Calcul guidé : de λ à E, une étape à la fois',
          body: `<p>On prend une radiation verte de \\(\\lambda = 500\\) nm. La méthode est toujours la même, en 4 étapes :</p>
            <ol style="padding-left:22px;margin-top:10px"><li>convertir \\(\\lambda\\) en <b>mètres</b> ;</li><li>\\(\\nu = c / \\lambda\\) ;</li><li>\\(E = h\\nu\\), en joules ;</li><li>diviser par \\(1{,}602\\times10^{-19}\\) pour l'avoir en eV.</li></ol>
            <p>Fais chaque étape ci-dessous. Les puissances de 10 s'écrivent comme \\(5\\text{e-7}\\) ou \\(5\\times10^{-7}\\).</p>`,
          ask: { q: 'Pour \\(\\lambda = 500\\) nm :', items: [num('\\lambda', 'm', 5e-7), num('\\nu', 'Hz', 6e14), num('E', 'J', 3.976e-19), num('E', 'eV', 2.482)],
            why: '\\(\\lambda = 500\\times10^{-9} = 5{,}00\\times10^{-7}\\) m → \\(\\nu = \\dfrac{3{,}00\\times10^{8}}{5{,}00\\times10^{-7}} = 6{,}00\\times10^{14}\\) Hz → \\(E = 6{,}626\\times10^{-34}\\times6{,}00\\times10^{14} = 3{,}98\\times10^{-19}\\) J → \\(\\dfrac{3{,}98\\times10^{-19}}{1{,}602\\times10^{-19}} = 2{,}48\\) eV. Vérification : \\(1240/500 = 2{,}48\\). ✓' } },
        { h: 'Le nombre d\'onde : combien de λ dans un centimètre',
          body: `<p>Le <b>nombre d'onde</b> est \\(\\bar\\nu = 1/\\lambda\\), souvent donné en cm⁻¹ (ou en m⁻¹). Il est proportionnel à l'énergie (\\(E = hc\\,\\bar\\nu\\)), c'est pour ça que les spectroscopistes l'aiment. La formule de Ritz, que tu verras dans « Séries de raies », donne justement \\(1/\\lambda\\).</p>
            <p>Piège : pour un résultat en cm⁻¹, il faut \\(\\lambda\\) en cm. 500 nm = \\(5{,}00\\times10^{-5}\\) cm.</p>`,
          ask: { q: 'Nombre d\'onde de la radiation de 500 nm, en cm⁻¹ ?', items: [num('\\bar\\nu', 'cm⁻¹', 20000)],
            why: '\\(\\bar\\nu = \\dfrac{1}{5{,}00\\times10^{-5}\\ \\text{cm}} = 2{,}00\\times10^{4}\\) cm⁻¹, soit \\(2{,}00\\times10^{6}\\) m⁻¹.' } },
        { h: 'De Broglie : la matière aussi est une onde',
          body: `<p>La lumière est à la fois une onde et des particules. En 1924, De Broglie propose la symétrie inverse : toute particule de masse \\(m\\) et de vitesse \\(v\\) (quantité de mouvement \\(p = mv\\)) a une onde associée, de longueur d'onde</p>\\[\\lambda = \\frac{h}{m v}\\]
            <p>Comme \\(h\\) est minuscule, cette onde n'est visible que pour des masses minuscules. Pour une balle de tennis de 58 g à 50 m/s, \\(\\lambda = \\dfrac{6{,}626\\times10^{-34}}{0{,}058\\times50} \\approx 2\\times10^{-34}\\) m : rien d'observable.</p>
            <p>Pour un électron dans un atome, c'est une autre histoire (calcule ci-dessous) : on ne peut plus le voir comme une petite bille sur une trajectoire. C'est la base du modèle quantique (chapitre III).</p>
            <div class="box warn"><h5>Pièges</h5>\\(m\\) en kg, \\(v\\) en m/s, \\(\\lambda\\) en m. Si on te donne l'énergie cinétique, d'abord \\(v = \\sqrt{2E_c/m}\\), avec \\(E_c\\) en <b>joules</b>.</div>`,
          ask: { q: 'Longueur d\'onde d\'un électron (\\(m = 9{,}11\\times10^{-31}\\) kg) qui va à \\(v = 2{,}2\\times10^{6}\\) m/s, en pm (1 pm = \\(10^{-12}\\) m) ?', items: [num('\\lambda', 'pm', 330.6, 0.03)],
            why: '\\(\\lambda = \\dfrac{6{,}626\\times10^{-34}}{9{,}11\\times10^{-31}\\times2{,}2\\times10^{6}} = 3{,}31\\times10^{-10}\\) m = 331 pm. C\'est la taille d\'un atome : l\'électron « ondule » à l\'échelle de l\'atome, donc sa nature d\'onde ne peut pas être ignorée.' } }
      ] },

      niv: { title: 'Les niveaux d\'énergie de l\'atome', meth: "\\(E_n = -\\dfrac{13{,}6\\,Z^2}{n^2}\\) eV pour un hydrogénoïde (un seul électron) ; ioniser depuis le niveau \\(n\\) coûte \\(-E_n\\).", steps: [
        { h: 'L\'énigme : l\'hydrogène n\'émet que quelques couleurs',
          body: `<p>Dans un tube rempli d'hydrogène sous faible pression, on applique une très haute tension : le gaz brille. À travers un prisme, on n'obtient pas un arc-en-ciel mais 4 fines raies visibles (plus d'autres dans l'UV et l'IR) :</p>${spectrum([[410.1, '410'], [434.0, '434'], [486.1, '486'], [656.3, '656 nm']])}
            <p>C'est un <b>spectre de raies</b> (discontinu). Le modèle classique de Rutherford prévoyait l'inverse : l'électron devrait tomber en spirale sur le noyau en émettant toutes les couleurs, et l'atome ne serait pas stable. Il faut un autre modèle : celui de <b>Bohr</b> (1913).</p>`,
          ask: { q: 'Ce spectre de raies montre que l\'atome d\'hydrogène émet :', items: [choice('réponse', [['all', 'de la lumière de toutes les longueurs d\'onde'], ['some', 'seulement certaines longueurs d\'onde bien précises'], ['uv', 'uniquement de l\'UV']], 'some')],
            why: 'Chaque raie est une longueur d\'onde précise, donc une énergie de photon précise (\\(E = hc/\\lambda\\)). L\'atome ne peut perdre que certaines quantités d\'énergie bien précises : son énergie est <b>quantifiée</b>.' } },
        { h: 'L\'idée de Bohr : un escalier, pas une rampe',
          body: `<p>L'électron ne peut se trouver que sur certaines orbites, chacune avec une énergie fixée : les <b>niveaux</b> \\(n = 1, 2, 3\\dots\\) (\\(n\\) est le nombre quantique principal, la « couche »). Entre deux niveaux, c'est impossible.</p>
            <p>Sur une rampe, on peut s'arrêter à n'importe quelle hauteur (énergies continues) ; sur un escalier, seulement sur les marches. Bohr calcule la hauteur de chaque marche :</p>\\[E_n = -\\frac{13{,}6}{n^2}\\ \\text{eV}\\]${levels()}`,
          ask: { q: 'Énergie du niveau \\(n = 2\\) ?', items: [num('E_2', 'eV', -3.4, 0.01)],
            why: '\\(E_2 = -\\dfrac{13{,}6}{2^2} = -\\dfrac{13{,}6}{4} = -3{,}40\\) eV.' } },
        { h: 'Pourquoi des énergies négatives ?',
          body: `<p>On choisit le <b>zéro</b> d'énergie pour un électron <b>libre</b>, immobile et très loin du noyau (\\(n \\to \\infty\\)). Un électron lié au noyau a moins d'énergie qu'un électron libre, puisqu'il faut lui en donner pour l'arracher. Donc \\(E_n < 0\\), et plus l'énergie est négative, plus l'électron est retenu.</p>
            <ul><li>\\(n = 1\\) (−13,6 eV) : le niveau le plus bas, l'<b>état fondamental</b>. C'est là qu'est l'atome normalement.</li><li>\\(n \\geq 2\\) : les <b>états excités</b>, quand l'atome a reçu de l'énergie.</li></ul>
            <p>Image : un puits. Le fond du puits, c'est \\(n = 1\\) ; le sol, c'est 0.</p>`,
          ask: { q: 'Sur quel niveau l\'électron est-il le plus fortement retenu par le noyau ?', items: [choice('réponse', [['1', '\\(n = 1\\)'], ['2', '\\(n = 2\\)'], ['inf', '\\(n = \\infty\\)']], '1')],
            why: '\\(n = 1\\) a l\'énergie la plus basse (−13,6 eV) : c\'est le fond du puits, il faut le plus d\'énergie pour en sortir. En \\(n = \\infty\\), l\'électron n\'est plus retenu du tout.' } },
        { h: 'L\'ionisation : faire sortir l\'électron de l\'atome',
          body: `<p><b>Ioniser</b>, c'est amener l'électron jusqu'à \\(n = \\infty\\) (énergie 0) : l'atome H devient l'ion H<sup>+</sup>. L'énergie à fournir est</p>\\[E_i = E_\\infty - E_n = 0 - E_n = -E_n\\]
            <p>Depuis l'état fondamental, \\(E_i = 13{,}6\\) eV : c'est <b>l'énergie d'ionisation</b> de l'hydrogène. Depuis un niveau excité, c'est plus facile, car on part de plus haut dans le puits.</p>`,
          ask: { q: 'Énergie à fournir pour ioniser H à partir du niveau \\(n = 3\\) ?', items: [num('E_i', 'eV', 1.511, 0.015)],
            why: '\\(E_3 = -13{,}6/9 = -1{,}51\\) eV, donc \\(E_i = 0 - (-1{,}51) = 1{,}51\\) eV. C\'est 9 fois moins que depuis le fondamental.' } },
        { h: 'Les marches se resserrent vers le haut',
          body: `<p>Avec \\(1/n^2\\), les niveaux se rapprochent très vite : \\(E_1 = -13{,}6\\) ; \\(E_2 = -3{,}40\\) ; \\(E_3 = -1{,}51\\) ; \\(E_4 = -0{,}85\\) ; \\(E_5 = -0{,}54\\) eV… jusqu'à 0.</p>
            <p>L'écart entre \\(n = 1\\) et \\(n = 2\\) vaut 10,2 eV, ceux du haut sont minuscules. Garde ça en tête : c'est ce qui explique pourquoi les sauts qui arrivent sur \\(n = 1\\) donnent de l'UV, et les sauts entre niveaux élevés de l'IR.</p>`,
          ask: { q: 'Quel écart d\'énergie est le plus grand ?', items: [choice('réponse', [['12', 'entre \\(n = 1\\) et \\(n = 2\\)'], ['45', 'entre \\(n = 4\\) et \\(n = 5\\)'], ['eq', 'ils sont égaux']], '12')],
            why: '\\(E_2 - E_1 = -3{,}40 + 13{,}6 = 10{,}2\\) eV, contre \\(E_5 - E_4 = -0{,}54 + 0{,}85 = 0{,}31\\) eV.' } },
        { h: 'Les hydrogénoïdes : même recette, noyau plus chargé',
          body: `<p>Le modèle de Bohr ne marche qu'avec <b>un seul électron</b> : avec plusieurs, ils se repoussent entre eux et le calcul ne tient plus. Les ions à un seul électron sont les <b>hydrogénoïdes</b> : He<sup>+</sup> (\\(Z = 2\\)), Li<sup>2+</sup> (\\(Z = 3\\)), Be<sup>3+</sup> (\\(Z = 4\\)).</p>
            <p>Leur noyau, \\(Z\\) fois plus chargé, retient plus fort l'électron :</p>\\[E_n = -13{,}6\\,\\frac{Z^2}{n^2}\\ \\text{eV}\\]
            <p>Les énergies sont \\(Z^2\\) fois plus grandes, les longueurs d'onde \\(Z^2\\) fois plus petites.</p>
            <div class="box warn"><h5>Piège</h5>He (2 électrons) n'est pas hydrogénoïde, He<sup>+</sup> l'est. Pour vérifier : nombre d'électrons = \\(Z - \\text{charge} = 1\\).</div>`,
          ask: { q: 'Lequel est un hydrogénoïde ? Puis calcule \\(E_1\\) pour He<sup>+</sup>.', items: [choice('hydrogénoïde', [['He', 'He'], ['Li+', 'Li<sup>+</sup>'], ['Li2+', 'Li<sup>2+</sup>'], ['H-', 'H<sup>−</sup>']], 'Li2+'), num('E_1(\\mathrm{He}^+)', 'eV', -54.4, 0.01)],
            why: 'Li<sup>2+</sup> : 3 − 2 = 1 électron ✓ (He, Li<sup>+</sup> et H<sup>−</sup> en ont 2). Pour He<sup>+</sup>, \\(E_1 = -13{,}6\\times\\dfrac{2^2}{1^2} = -54{,}4\\) eV, 4 fois plus bas que pour H.' } }
      ] },

      trans: { title: 'Les sauts : absorption et émission', meth: "photon émis ou absorbé : \\(|\\Delta E| = |E_{n_2} - E_{n_1}|\\), puis \\(\\lambda = hc/|\\Delta E|\\) avec \\(\\Delta E\\) en joules.", steps: [
        { h: 'Changer de marche, c\'est échanger un photon',
          body: `<p>L'électron passe d'un niveau à un autre d'un seul coup : c'est une <b>transition</b>. L'énergie se conserve : ce que l'atome gagne ou perd, c'est exactement l'énergie d'un photon.</p>
            <ul><li>Il <b>monte</b> : l'atome gagne de l'énergie en <b>absorbant</b> un photon (absorption).</li><li>Il <b>descend</b> : l'atome perd de l'énergie en <b>émettant</b> un photon (émission).</li></ul>${levels([[1, 3, 130, '#16a34a'], [3, 2, 260, '#dc2626']], [[130, 'absorption 1 → 3', '#16a34a'], [260, 'émission 3 → 2', '#dc2626']])}
            <p>Avec \\(\\Delta E = E_\\text{final} - E_\\text{initial}\\) : \\(\\Delta E > 0\\) pour une absorption, \\(\\Delta E < 0\\) pour une émission. L'énergie du photon est toujours positive : \\(E_\\text{photon} = |\\Delta E|\\).</p>`,
          ask: { q: 'L\'électron de H passe de \\(n = 4\\) à \\(n = 2\\). C\'est :', items: [choice('réponse', [['abs', 'une absorption'], ['em', 'une émission']], 'em')],
            why: 'Il descend (\\(E_2 < E_4\\)) : l\'atome perd de l\'énergie, emportée par un photon émis.' } },
        { h: 'Le lien qui fait tout le chapitre',
          body: `<p>On rassemble les deux leçons précédentes :</p>\\[|\\Delta E| = h\\nu = \\frac{hc}{\\lambda}\\]
            <p>Un saut donne une énergie, cette énergie donne une longueur d'onde, et cette longueur d'onde donne une raie dans le spectre. Comme il n'y a que quelques sauts possibles, il n'y a que quelques raies : l'énigme du spectre de l'hydrogène est résolue.</p>
            <p>Pour H, avec \\(n\\) le niveau du bas et \\(p\\) celui du haut :</p>\\[|\\Delta E| = 13{,}6\\left(\\frac{1}{n^2} - \\frac{1}{p^2}\\right)\\ \\text{eV}\\]
            <p>Tout le chapitre tient dans cet enchaînement : \\(E_n\\) (Bohr) → \\(\\Delta E\\) → \\(\\lambda = hc/|\\Delta E|\\) → couleur ou domaine.</p>`,
          ask: { q: 'Pourquoi le spectre de l\'hydrogène est-il fait de raies séparées ?', items: [choice('réponse', [['p', 'parce que le prisme sépare mal les couleurs'], ['s', 'parce que l\'électron ne saute qu\'entre des niveaux précis, donc n\'émet que des photons d\'énergies précises'], ['v', 'parce que l\'hydrogène n\'émet que dans le visible']], 's')],
            why: 'Niveaux quantifiés → sauts d\'énergies précises → photons d\'énergies précises → longueurs d\'onde précises : des raies. (Et H émet aussi dans l\'UV et l\'IR.)' } },
        { h: 'Calcul guidé : la raie rouge de l\'hydrogène',
          body: `<p>L'électron descend de \\(p = 3\\) à \\(n = 2\\). On calcule dans l'ordre :</p>
            <ol style="padding-left:22px;margin-top:10px"><li>\\(|\\Delta E|\\) en eV ;</li><li>\\(\\lambda = hc/|\\Delta E|\\), avec \\(\\Delta E\\) en <b>joules</b> (ou le raccourci \\(1240/\\Delta E\\) en eV, pour un résultat en nm) ;</li><li>le domaine.</li></ol>`,
          ask: { q: 'Transition \\(3 \\to 2\\) dans H :', items: [num('|\\Delta E|', 'eV', 1.889, 0.015), num('\\lambda', 'nm', 656.9, 0.015), choice('domaine', [['UV', 'UV'], ['visible', 'visible'], ['IR', 'IR']], 'visible')],
            why: '\\(|\\Delta E| = 13{,}6\\left(\\dfrac14 - \\dfrac19\\right) = 13{,}6\\times\\dfrac{5}{36} = 1{,}89\\) eV \\(= 3{,}03\\times10^{-19}\\) J, puis \\(\\lambda = \\dfrac{6{,}626\\times10^{-34}\\times3{,}00\\times10^{8}}{3{,}03\\times10^{-19}} = 6{,}57\\times10^{-7}\\) m = 657 nm. C\'est la raie rouge mesurée à 656 nm : la théorie retrouve la mesure, c\'est pour ça qu\'on a cru Bohr.' } },
        { h: 'Plus le saut est grand, plus λ est petite',
          body: `<p>Un grand saut donne un photon énergétique, donc une petite longueur d'onde. Les 4 raies visibles de l'hydrogène sont les retours sur \\(n = 2\\) :</p>
            ${tbl(['saut', '|ΔE| (eV)', 'λ (nm)', 'couleur'], [['3 → 2', '1,89', '656', 'rouge'], ['4 → 2', '2,55', '486', 'bleu-vert'], ['5 → 2', '2,86', '434', 'bleu'], ['6 → 2', '3,02', '410', 'violet']])}`,
          ask: { q: 'Quel photon a la plus petite longueur d\'onde ?', items: [choice('réponse', [['31', 'celui du saut 3 → 1'], ['32', 'celui du saut 3 → 2']], '31')],
            why: '\\(|\\Delta E|(3\\to1) = 13{,}6\\left(1 - \\dfrac19\\right) = 12{,}1\\) eV, bien plus que 1,89 eV : \\(\\lambda = 1240/12{,}1 = 103\\) nm (UV), contre 656 nm.' } },
        { h: 'L\'absorption : seulement le bon photon',
          body: `<p>Pour être absorbé, un photon doit avoir <b>exactement</b> l'énergie d'un saut possible : l'atome ne peut pas en prendre un morceau. Depuis le fondamental de H, les sauts possibles sont \\(1\\to2\\) (10,2 eV), \\(1\\to3\\) (12,09 eV), \\(1\\to4\\) (12,75 eV)… jusqu'à 13,6 eV (ionisation).</p>
            <p>Un photon de 5 eV traverse donc l'atome sans être absorbé. Au-delà de 13,6 eV, n'importe quel photon ionise l'atome : l'électron part, et le surplus devient son énergie cinétique.</p>`,
          ask: { q: 'Un atome H dans l\'état fondamental absorbe un photon de 12,75 eV. Sur quel niveau arrive l\'électron ?', items: [int('p', 4)],
            why: '\\(E_p = E_1 + 12{,}75 = -13{,}6 + 12{,}75 = -0{,}85\\) eV. Or \\(E_p = -13{,}6/p^2\\), donc \\(p^2 = 13{,}6/0{,}85 = 16\\) et \\(p = 4\\).' } },
        { h: 'L\'enchaînement complet, comme au CC',
          body: `<p>La partie B du CC de 2021 (8 points sur 20) faisait exactement ça sur He<sup>+</sup>. La méthode :</p>
            <ol style="padding-left:22px;margin-top:10px"><li>justifier que c'est un hydrogénoïde (un seul électron) ;</li><li>\\(E_n = -13{,}6\\,Z^2/n^2\\) eV, puis \\(|\\Delta E|\\) en eV, puis en J ;</li><li>\\(\\lambda = hc/|\\Delta E|\\) en m, puis en nm ;</li><li>le domaine : moins de 400 nm, UV ; de 400 à 750 nm, visible ; plus de 750 nm, IR ;</li><li>\\(\\nu = c/\\lambda\\) (ou \\(|\\Delta E|/h\\)).</li></ol>`,
          ask: { q: 'Pour He<sup>+</sup> (\\(Z = 2\\)), l\'électron descend de \\(n = 2\\) à \\(n = 1\\) :', items: [num('|\\Delta E|', 'eV', 40.8, 0.015), num('\\lambda', 'nm', 30.41, 0.02), choice('domaine', [['UV', 'UV'], ['visible', 'visible'], ['IR', 'IR']], 'UV'), num('\\nu', 'Hz', 9.865e15, 0.02)],
            why: '\\(|\\Delta E| = 13{,}6\\times4\\times\\left(1 - \\dfrac14\\right) = 40{,}8\\) eV \\(= 6{,}54\\times10^{-18}\\) J ; \\(\\lambda = \\dfrac{1{,}988\\times10^{-25}}{6{,}54\\times10^{-18}} = 3{,}04\\times10^{-8}\\) m = 30,4 nm, dans l\'UV ; \\(\\nu = \\dfrac{3{,}00\\times10^{8}}{3{,}04\\times10^{-8}} = 9{,}87\\times10^{15}\\) Hz. Pour H, ce même saut donnerait 122 nm : \\(Z^2 = 4\\) fois plus.' } }
      ] },

      serie: { title: 'Séries de raies et formule de Ritz', meth: "Ritz : \\(\\dfrac1\\lambda = R_H Z^2\\left(\\dfrac{1}{n_1^2} - \\dfrac{1}{n_2^2}\\right)\\) ; \\(n_1\\) fixe la série (1 Lyman, UV ; 2 Balmer, visible ; 3 Paschen, IR).", steps: [
        { h: 'Une série, ce sont tous les sauts qui arrivent sur le même niveau',
          body: `<p>On range les raies d'émission selon le niveau d'arrivée \\(n\\) (le départ \\(p > n\\) varie) :</p>${levels([[2, 1, 84, '#7c3aed'], [3, 1, 100, '#7c3aed'], [4, 1, 116, '#7c3aed'], [3, 2, 180, '#dc2626'], [4, 2, 196, '#dc2626'], [5, 2, 212, '#dc2626'], [4, 3, 280, '#b45309'], [5, 3, 296, '#b45309'], [6, 3, 312, '#b45309']], [[100, 'Lyman (UV)', '#7c3aed'], [200, 'Balmer (visible)', '#dc2626'], [305, 'Paschen (IR)', '#b45309']])}
            ${tbl(['arrivée n', 'série', 'domaine'], [['1', 'Lyman', 'UV'], ['2', 'Balmer', 'visible'], ['3', 'Paschen', 'IR'], ['4, 5', 'Brackett, Pfund', 'IR']])}
            <p>Les domaines s'expliquent par les marches : arriver sur \\(n = 1\\), c'est une grosse chute (au moins 10,2 eV) donc de l'UV ; arriver sur \\(n = 3\\), ce sont de petites chutes, donc de l'IR.</p>`,
          ask: { q: 'La raie émise lors du saut 5 → 3 appartient à la série de :', items: [choice('réponse', [['L', 'Lyman'], ['B', 'Balmer'], ['P', 'Paschen'], ['Br', 'Brackett']], 'P')],
            why: 'C\'est le niveau d\'arrivée qui compte : \\(n = 3\\), c\'est la série de Paschen (IR).' } },
        { h: 'La formule de Ritz, c\'est la même chose écrite autrement',
          body: `<p>Avant Bohr, Ritz (1908) avait trouvé, à partir des mesures seulement :</p>\\[\\frac{1}{\\lambda} = R_H\\left(\\frac{1}{n^2} - \\frac{1}{p^2}\\right),\\qquad R_H = 1{,}097\\times10^{7}\\ \\text{m}^{-1}\\]
            <p>Ce n'est pas une nouvelle loi. On divise \\(|\\Delta E| = hc/\\lambda\\) par \\(hc\\) :</p>\\[\\frac{1}{\\lambda} = \\frac{|\\Delta E|}{hc} = \\frac{13{,}6\\ \\text{eV}}{hc}\\left(\\frac{1}{n^2} - \\frac{1}{p^2}\\right)\\quad\\text{donc}\\quad R_H = \\frac{13{,}6\\ \\text{eV}}{hc}\\]
            <p>Bohr (1913) a <b>expliqué</b> la formule de Ritz, et c'est ce qui a fait le succès de son modèle. En pratique, il y a deux chemins vers le même résultat : \\(\\Delta E\\) puis \\(\\lambda = hc/\\Delta E\\), ou Ritz directement (plus rapide si on demande seulement \\(\\lambda\\)). Pour un hydrogénoïde, on remplace \\(R_H\\) par \\(Z^2 R_H\\).</p>`,
          ask: { q: 'Vérifie-le : calcule \\(\\dfrac{13{,}6\\ \\text{eV}}{hc}\\) en m⁻¹ (13,6 eV = \\(13{,}6\\times1{,}602\\times10^{-19}\\) J).', items: [num('R_H', 'm⁻¹', 1.096e7, 0.01)],
            why: '\\(\\dfrac{13{,}6\\times1{,}602\\times10^{-19}}{6{,}626\\times10^{-34}\\times3{,}00\\times10^{8}} = \\dfrac{2{,}179\\times10^{-18}}{1{,}988\\times10^{-25}} = 1{,}096\\times10^{7}\\) m⁻¹ : c\'est bien la constante de Rydberg.' } },
        { h: 'Les raies limites d\'une série',
          body: `<p>Dans une série, \\(n\\) est fixé et \\(p\\) va de \\(n + 1\\) à l'infini :</p>
            <ul><li>le plus petit saut, \\(p = n + 1\\), donne la plus petite énergie, donc \\(\\lambda_{max}\\) ;</li><li>le plus grand saut, \\(p \\to \\infty\\) (donc \\(1/p^2 \\to 0\\)), donne \\(\\lambda_{min} = n^2 / R_H\\) : c'est la « limite de série ».</li></ul>
            <p>Pour Balmer : \\(\\lambda_{max}\\) correspond à \\(3 \\to 2\\), soit 656 nm ; \\(\\lambda_{min} = 4/R_H\\). Toutes les raies de Balmer sont entre les deux.</p>`,
          ask: { q: 'Calcule :', items: [num('\\lambda_{min}\\ \\text{(Balmer)}', 'nm', 364.6, 0.01), num('\\lambda_{max}\\ \\text{(Lyman)}', 'nm', 121.5, 0.01)],
            why: 'Balmer : \\(\\lambda_{min} = \\dfrac{4}{1{,}097\\times10^{7}} = 3{,}65\\times10^{-7}\\) m = 365 nm. Lyman : \\(\\lambda_{max}\\) pour \\(2 \\to 1\\), \\(\\dfrac1\\lambda = R_H\\left(1 - \\dfrac14\\right)\\), donc \\(\\lambda = \\dfrac{1}{0{,}75\\times1{,}097\\times10^{7}} = 1{,}215\\times10^{-7}\\) m = 122 nm (UV).' } },
        { h: 'Combien de raies depuis un niveau excité ?',
          body: `<p>Depuis le niveau \\(p\\), l'électron peut redescendre directement ou par paliers. Chaque paire de niveaux entre 1 et \\(p\\) donne une raie, et il y a</p>\\[\\frac{p\\,(p - 1)}{2}\\ \\text{paires}\\]
            <p>Depuis \\(p = 3\\) : \\(3\\to1\\), \\(3\\to2\\) et \\(2\\to1\\), soit 3 raies.</p>`,
          ask: { q: 'L\'électron est excité jusqu\'à \\(p = 4\\). Combien de raies différentes peut-on observer, et combien appartiennent à la série de Balmer ?', items: [int('raies', 6), int('Balmer', 2)],
            why: '\\(4\\times3/2 = 6\\) raies : 4→3, 4→2, 4→1, 3→2, 3→1, 2→1. Celles de Balmer arrivent sur \\(n = 2\\) : 4→2 et 3→2.' } },
        { h: 'Identifier une raie : remonter au niveau de départ',
          body: `<p>On connaît \\(\\lambda\\) et la série (donc \\(n\\)) : on isole \\(p\\) dans la formule de Ritz.</p>\\[\\frac{1}{p^2} = \\frac{1}{n^2} - \\frac{1}{R_H\\,\\lambda}\\]
            <p>Exemple, 486,1 nm dans Balmer : \\(\\dfrac{1}{R_H\\lambda} = \\dfrac{1}{1{,}097\\times10^{7}\\times4{,}861\\times10^{-7}} = 0{,}1875\\), donc \\(\\dfrac1{p^2} = 0{,}25 - 0{,}1875 = 0{,}0625\\) et \\(p = 4\\).</p>
            <p>Piège : \\(\\lambda\\) en mètres. Si \\(p\\) ne tombe pas sur un entier, c'est une erreur de calcul ou de série.</p>`,
          ask: { q: 'Une raie de Balmer a pour longueur d\'onde 434,0 nm. Niveau de départ \\(p\\) ?', items: [int('p', 5)],
            why: '\\(\\dfrac{1}{R_H\\lambda} = \\dfrac{1}{1{,}097\\times10^{7}\\times4{,}340\\times10^{-7}} = 0{,}2100\\), donc \\(\\dfrac1{p^2} = 0{,}25 - 0{,}2100 = 0{,}0400\\) et \\(p^2 = 25\\), \\(p = 5\\).' } }
      ] },

      /* =================== III. Modèle quantique =================== */
      nq: { title: 'Pourquoi des nombres quantiques ?', meth: "\\(n \\geq 1\\), \\(0 \\leq \\ell \\leq n - 1\\), \\(-\\ell \\leq m_\\ell \\leq \\ell\\), \\(m_s = \\pm\\tfrac12\\) ; \\(\\ell\\) = 0, 1, 2, 3 pour s, p, d, f.", steps: [
        { h: 'Fini les trajectoires',
          body: `<p>On l'a vu avec De Broglie : l'électron d'un atome est une onde, de la taille de l'atome. Et <b>Heisenberg</b> montre qu'on ne peut pas connaître à la fois sa position et sa vitesse (\\(\\Delta x\\,\\Delta p \\geq h/4\\pi\\)). Les orbites de Bohr n'ont donc plus de sens.</p>
            <p>On décrit l'électron par une <b>fonction d'onde</b> \\(\\psi\\), solution de l'équation de Schrödinger ; \\(|\\psi|^2\\) donne la probabilité de le trouver à chaque endroit. Une <b>orbitale atomique</b> (O.A.) est une de ces fonctions : une zone où l'électron a de fortes chances d'être.</p>
            <p>Le \\(n\\) de Bohr reste, mais trois autres nombres apparaissent.</p>`,
          ask: { q: 'Une orbitale atomique, c\'est :', items: [choice('réponse', [['t', 'la trajectoire circulaire de l\'électron'], ['p', 'une région où l\'électron a une forte probabilité de se trouver'], ['n', 'une partie du noyau']], 'p')],
            why: 'On ne parle plus de trajectoire, seulement de probabilité de présence : l\'orbitale décrit le « nuage » où l\'on a des chances de trouver l\'électron.' } },
        { h: 'Une adresse en 4 parties',
          body: `<p>Chaque électron a une adresse de 4 nombres. Imagine un immeuble :</p>
            ${tbl(['nombre', 'valeurs', 'ce qu\'il fixe', 'dans l\'immeuble'], [['\\(n\\)', '1, 2, 3…', 'couche : énergie, taille', 'l\'étage'], ['\\(\\ell\\)', '0 à \\(n - 1\\)', 'sous-couche, forme : s (0), p (1), d (2), f (3)', 'le type d\'appartement'], ['\\(m_\\ell\\)', '\\(-\\ell\\) à \\(+\\ell\\)', 'orientation : \\(2\\ell + 1\\) orbitales', 'la pièce'], ['\\(m_s\\)', '\\(+\\tfrac12\\) ou \\(-\\tfrac12\\)', 'spin', 'un des 2 lits']])}
            <p>\\((n, \\ell)\\) définit une <b>sous-couche</b> (3d…) ; \\((n, \\ell, m_\\ell)\\) définit une <b>orbitale</b>, aussi appelée case quantique.</p>`,
          ask: { q: 'Pour \\(n = 2\\), \\(\\ell\\) peut valoir :', items: [choice('réponse', [['0', '0 seulement'], ['01', '0 et 1'], ['12', '1 et 2'], ['012', '0, 1 et 2']], '01')],
            why: '\\(\\ell\\) va de 0 à \\(n - 1 = 1\\) : la couche 2 a les sous-couches 2s (\\(\\ell = 0\\)) et 2p (\\(\\ell = 1\\)). Il n\'existe pas de « 2d ».' } },
        { h: 'Repérer ce qui est interdit',
          body: `<p>Trois règles : \\(\\ell < n\\) (strictement), \\(|m_\\ell| \\leq \\ell\\), \\(m_s = \\pm\\tfrac12\\).</p>
            <ul><li>\\((3, 3, 0)\\) : impossible, car \\(\\ell = n\\).</li><li>\\((2, 1, -2)\\) : impossible, car \\(|m_\\ell| > \\ell\\).</li><li>\\((4, 2, -1, +\\tfrac12)\\) : permis. C'est un électron 4d (\\(n = 4\\), \\(\\ell = 2\\)).</li></ul>`,
          ask: { q: 'Quel triplet \\((n, \\ell, m_\\ell)\\) est permis ?', items: [choice('réponse', [['a', '\\((2, 2, 0)\\)'], ['b', '\\((3, 1, -2)\\)'], ['c', '\\((3, 2, -1)\\)'], ['d', '\\((1, 1, 0)\\)']], 'c')],
            why: '\\((3, 2, -1)\\) : \\(\\ell = 2 < 3\\) et \\(|m_\\ell| = 1 \\leq 2\\), c\'est une orbitale 3d. Les autres violent \\(\\ell < n\\) ou \\(|m_\\ell| \\leq \\ell\\).' } },
        { h: 'Compter les places',
          body: `<p>Une sous-couche \\(\\ell\\) a \\(2\\ell + 1\\) orbitales, et chaque orbitale accueille 2 électrons :</p>
            ${tbl(['sous-couche', 's', 'p', 'd', 'f'], [['orbitales (cases)', '1', '3', '5', '7'], ['électrons max', '2', '6', '10', '14']])}
            <p>Une couche \\(n\\) a \\(n^2\\) orbitales, donc \\(2n^2\\) électrons au maximum : 2, 8, 18, 32…</p>`,
          ask: { q: 'Deux questions :', items: [int('\\text{e}^-\\ \\text{max pour}\\ n = 3', 18), choice('(3, 2, 1, +½) est dans', [['3s', '3s'], ['3p', '3p'], ['3d', '3d'], ['2d', '2d']], '3d')],
            why: 'Couche 3 : \\(2\\times3^2 = 18\\) électrons (3s : 2, 3p : 6, 3d : 10). L\'électron \\((3, 2, 1, +\\tfrac12)\\) a \\(n = 3\\) et \\(\\ell = 2\\) : il est dans la sous-couche 3d, qui peut contenir 10 électrons.' } },
        { h: 'La forme des orbitales',
          body: `<ul><li><b>s</b> : une sphère autour du noyau.</li><li><b>p</b> : deux lobes de part et d'autre du noyau, le long d'un axe. Il y en a trois, \\(p_x\\), \\(p_y\\) et \\(p_z\\), une par valeur de \\(m_\\ell\\).</li><li><b>d</b> : plus compliquées (souvent 4 lobes), 5 orientations.</li></ul><p>Plus \\(n\\) est grand, plus l'orbitale est grosse.</p>`,
          ask: { q: 'Combien d\'orbitales compte une sous-couche p ?', items: [choice('réponse', [['1', '1'], ['3', '3'], ['5', '5']], '3')],
            why: '\\(\\ell = 1\\), donc \\(m_\\ell \\in \\{-1, 0, +1\\}\\) : 3 orbitales, \\(p_x\\), \\(p_y\\) et \\(p_z\\).' } }
      ] },

      /* =================== IV. Atomes polyélectroniques =================== */
      conf: { title: 'Remplir les électrons dans l\'ordre', meth: "règle de Klechkowski (\\(n + \\ell\\) croissant, puis \\(n\\) croissant) : 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d… ; au plus 2 électrons en s, 6 en p, 10 en d.", steps: [
        { h: 'Avec plusieurs électrons, l\'énergie dépend de n et de ℓ',
          body: `<p>Dans H, l'énergie ne dépend que de \\(n\\). Avec plusieurs électrons, ceux de l'intérieur font écran : un électron externe ne ressent qu'une charge effective \\(Z^* = Z - \\sigma\\), plus petite que \\(Z\\). Et cet écran dépend de la forme de l'orbitale : un électron 4s pénètre plus près du noyau qu'un 3d, donc 4s est plus bas en énergie que 3d.</p>
            <p>Dans l'état fondamental, les électrons occupent les places les plus basses disponibles, comme un hôtel qu'on remplit en commençant par le rez-de-chaussée.</p>`,
          ask: { q: 'Dans l\'atome d\'hydrogène, les orbitales 2s et 2p ont :', items: [choice('réponse', [['eq', 'la même énergie'], ['s', '2s plus basse'], ['p', '2p plus basse']], 'eq')],
            why: 'H n\'a qu\'un électron, sans écran : l\'énergie ne dépend que de \\(n\\) (\\(E_2 = -3{,}40\\) eV pour les deux). C\'est dans les atomes à plusieurs électrons que 2s passe sous 2p.' } },
        { h: 'La règle de Klechkowski',
          body: `<p>On remplit par \\(n + \\ell\\) croissant ; à égalité, celle qui a le plus petit \\(n\\) d'abord.</p>
            ${tbl(['sous-couche', '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s'], [['\\(n + \\ell\\)', '1', '2', '3', '3', '4', '4', '5', '5', '5', '6', '6', '6']])}
            <p>L'ordre à connaître : ${mono('1s 2s 2p 3s 3p <b>4s 3d</b> 4p 5s 4d 5p 6s 4f 5d 6p')}. Le piège, c'est 4s avant 3d.</p>`,
          ask: { q: 'Qui se remplit en premier ?', items: [choice('4s ou 3d', [['4s', '4s'], ['3d', '3d']], '4s'), choice('4p ou 5s', [['4p', '4p'], ['5s', '5s']], '4p')],
            why: '4s : \\(n + \\ell = 4\\), 3d : \\(3 + 2 = 5\\), donc 4s d\'abord. 4p et 5s ont tous les deux \\(n + \\ell = 5\\) : le plus petit \\(n\\) passe d\'abord, donc 4p.' } },
        { h: 'Pauli : deux électrons au plus par case',
          body: `<p><b>Principe de Pauli</b> : deux électrons ne peuvent pas avoir les 4 mêmes nombres quantiques. Dans une case (même \\(n\\), \\(\\ell\\), \\(m_\\ell\\)), seul \\(m_s\\) peut changer : 2 électrons au maximum, de spins opposés (↑↓).</p><p>C'est de là que viennent les capacités s<sup>2</sup>, p<sup>6</sup>, d<sup>10</sup>, f<sup>14</sup>.</p>`,
          ask: { q: 'Une sous-couche 3p peut contenir au plus :', items: [choice('réponse', [['2', '2 électrons'], ['3', '3 électrons'], ['6', '6 électrons'], ['10', '10 électrons']], '6')],
            why: '3 cases (\\(m_\\ell = -1, 0, +1\\)) × 2 électrons = 6.' } },
        { h: 'Méthode : écrire une configuration',
          body: `<ol style="padding-left:22px;margin-top:10px"><li>Compter les électrons (\\(Z\\) pour un atome neutre).</li><li>Remplir dans l'ordre de Klechkowski, chaque sous-couche jusqu'à sa capacité.</li><li><b>Écrire</b> le résultat par \\(n\\) croissant (3d avant 4s) : c'est ce que demande le cours.</li><li>Vérifier que la somme des exposants vaut \\(Z\\).</li></ol>
            <p>Fe (\\(Z = 26\\)) : on remplit 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶, et on écrit 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s². En abrégé : (Ar) 3d⁶ 4s², où (Ar) remplace les 18 électrons de cœur 1s² … 3p⁶.</p>`,
          ask: { q: 'Configuration du soufre S (\\(Z = 16\\)) ? Écris par exemple <code>1s2 2s2 2p6…</code> ou <code>(Ne) …</code>.', items: [conf(16, '\\mathrm{S}')],
            why: '16 électrons : 1s² 2s² 2p⁶ 3s² 3p⁴ (2 + 2 + 6 + 2 + 4 = 16), soit (Ne) 3s² 3p⁴.' } },
        { h: 'Électrons de cœur et électrons de valence',
          body: `<p>Les électrons de <b>valence</b> sont ceux du \\(n\\) le plus grand, plus ceux d'une sous-couche d en cours de remplissage. Ce sont eux qui font la chimie (liaisons, ions). Les autres sont les électrons de <b>cœur</b> : la configuration du gaz rare précédent.</p>
            <p>S : (Ne) 3s² 3p⁴, soit 6 électrons de valence. Fe : (Ar) 3d⁶ 4s², soit 8 électrons de valence.</p>`,
          ask: { q: 'Combien d\'électrons de valence a le chlore (\\(Z = 17\\)) ?', items: [int('valence', 7)],
            why: 'Cl : (Ne) 3s² 3p⁵, soit 2 + 5 = 7 électrons de valence. Il lui en manque un pour avoir la structure de l\'argon : d\'où Cl<sup>−</sup>.' } }
      ] },

      exc: { title: 'Exceptions et ions', meth: "Cr, Cu, Mo, Ag : d⁵ s¹ ou d¹⁰ s¹ ; un ion d'élément de transition perd d'abord ses électrons 4s, avant les 3d.", steps: [
        { h: 'Demi-pleine ou pleine : plus stable',
          body: `<p>Une sous-couche d à moitié pleine (d⁵) ou pleine (d¹⁰) est particulièrement stable. Quand Klechkowski donne d⁴ s² ou d⁹ s², un électron s passe donc dans la sous-couche d :</p>
            <ul><li>Cr (\\(Z = 24\\)) : (Ar) 3d⁴ 4s² → <b>(Ar) 3d⁵ 4s¹</b></li><li>Cu (\\(Z = 29\\)) : (Ar) 3d⁹ 4s² → <b>(Ar) 3d¹⁰ 4s¹</b></li><li>De même dans la colonne en dessous : Mo (\\(Z = 42\\)) = (Kr) 4d⁵ 5s¹ et Ag (\\(Z = 47\\)) = (Kr) 4d¹⁰ 5s¹.</li></ul>
            <p>Ce sont les 4 exceptions du cours. Le CC de 2021 demandait Mo.</p>`,
          ask: { q: 'Configuration du cuivre Cu (\\(Z = 29\\)) ?', items: [conf(29, '\\mathrm{Cu}')],
            why: 'Klechkowski donnerait (Ar) 3d⁹ 4s², mais 3d¹⁰ pleine est plus stable : (Ar) 3d¹⁰ 4s¹, soit 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹.' } },
        { h: 'Les ions des blocs s et p visent le gaz rare',
          body: `<p>Les atomes des colonnes 1, 2 et 13 perdent 1, 2 ou 3 électrons ; ceux des colonnes 16 et 17 en gagnent 2 ou 1. Ils prennent ainsi la configuration du gaz rare le plus proche (ils deviennent <b>isoélectroniques</b> de ce gaz rare), très stable (ns² np⁶).</p>
            <ul><li>Na : (Ne) 3s¹ → Na<sup>+</sup> = (Ne)</li><li>Cl : (Ne) 3s² 3p⁵ → Cl<sup>−</sup> = (Ne) 3s² 3p⁶ = (Ar)</li></ul><p>On enlève les électrons de la couche externe (\\(n\\) le plus grand).</p>`,
          ask: { q: 'Pour le soufre S (\\(Z = 16\\), (Ne) 3s² 3p⁴) et le magnésium Mg (\\(Z = 12\\)) :', items: [choice('ion de S', [['2+', 'S<sup>2+</sup>'], ['+', 'S<sup>+</sup>'], ['-', 'S<sup>−</sup>'], ['2-', 'S<sup>2−</sup>']], '2-'), conf(12, '\\mathrm{Mg}^{2+}', H.ionConf(12, 2))],
            why: 'S a 6 électrons de valence : il en gagne 2 pour avoir (Ar), donc S<sup>2−</sup>. Mg, (Ne) 3s², perd ses 2 électrons 3s : Mg<sup>2+</sup> = 1s² 2s² 2p⁶ = (Ne).' } }
      ] },

      case: { title: 'Cases quantiques et règle de Hund', meth: "une case par orbitale, au plus 2 électrons de spins opposés (Pauli) ; dans une sous-couche, une flèche par case avant d'apparier (Hund).", steps: [
        { h: 'Dessiner les électrons dans des cases',
          body: `<p>Chaque orbitale est une case ${mono('[ ]')}, chaque électron une flèche : ↑ (\\(m_s = +\\tfrac12\\)) ou ↓ (\\(-\\tfrac12\\)). Pauli : au plus ↑↓ dans une case. Une sous-couche s a 1 case, p en a 3, d en a 5. En général, on ne dessine que la couche de valence.</p>`,
          ask: { q: 'Combien de cases compte une sous-couche d ?', items: [choice('réponse', [['3', '3'], ['5', '5'], ['7', '7'], ['10', '10']], '5')],
            why: '\\(\\ell = 2\\), donc \\(m_\\ell\\) va de −2 à +2 : 5 cases, soit 10 électrons au maximum.' } },
        { h: 'Hund : on s\'étale avant de s\'apparier',
          body: `<p><b>Règle de Hund</b> : dans des cases de même énergie (même sous-couche), les électrons occupent d'abord des cases différentes, avec des spins parallèles, avant de s'apparier. Comme dans un bus : chacun prend une banquette libre avant de s'asseoir à côté de quelqu'un.</p>
            <ul><li>N (2p³) : ${mono('[↑][↑][↑]')}, 3 électrons célibataires, et non ${mono('[↑↓][↑][ ]')}.</li><li>O (2p⁴) : ${mono('[↑↓][↑][↑]')}, 2 célibataires.</li></ul>`,
          ask: { q: 'Combien d\'électrons célibataires a le carbone (\\(Z = 6\\), 2s² 2p²) ?', items: [int('célibataires', 2)],
            why: `2p² : ${mono('[↑][↑][ ]')}, les deux électrons se placent dans deux cases différentes. 2s² est pleine (↑↓) : 2 célibataires.` } },
        { h: 'Compter les célibataires sans tout dessiner',
          body: `<p>Seules les sous-couches incomplètes ont des célibataires. Pour \\(e\\) électrons dans une sous-couche de \\(k\\) cases : si \\(e \\leq k\\), il y a \\(e\\) célibataires ; sinon, \\(2k - e\\).</p>
            <ul><li>Fe, 3d⁶ (5 cases) : \\(2\\times5 - 6 = 4\\) célibataires.</li><li>Cr, 3d⁵ 4s¹ (exception !) : 5 + 1 = 6 célibataires.</li></ul>`,
          ask: { q: 'Nombre d\'électrons célibataires :', items: [int('\\mathrm{Mn}\\ (Z = 25)', 5), int('\\mathrm{Ni}\\ (Z = 28)', 2)],
            why: 'Mn : (Ar) 3d⁵ 4s², 5 électrons dans 5 cases, soit 5 célibataires. Ni : (Ar) 3d⁸ 4s², \\(2\\times5 - 8 = 2\\) célibataires. 4s² est pleine dans les deux cas.' } }
      ] },

      /* =================== V. Tableau périodique =================== */
      place: { title: 'Lire le tableau périodique', meth: "période = plus grand \\(n\\) ; bloc = dernière sous-couche remplie ; colonne d'après les électrons de valence (s + p, ou s + d pour le bloc d).", steps: [
        { h: 'Un tableau rangé par configuration',
          body: `<p>Mendeleïev rangeait les éléments par masse ; aujourd'hui, on les range par \\(Z\\). Chaque <b>ligne</b> (période) commence une nouvelle couche : la <b>période</b> est le \\(n\\) le plus grand de la configuration. Chaque <b>colonne</b> regroupe la même configuration de valence, donc une chimie semblable : tous les alcalins (ns¹) réagissent violemment avec l'eau.</p>
            <p>Connaître la configuration, c'est connaître la place, et inversement.</p>`,
          ask: { q: 'Période du chlore, (Ne) 3s² 3p⁵ ?', items: [int('période', 3)],
            why: 'Le plus grand \\(n\\) est 3 : 3<sup>e</sup> période.' } },
        { h: 'Blocs et colonnes',
          body: `<p>Le <b>bloc</b> est la dernière sous-couche en cours de remplissage : s (colonnes 1-2), d (3 à 12, métaux de transition), p (13 à 18), f (lanthanides et actinides, sous le tableau).</p>
            ${tbl(['fin de configuration', 'colonne'], [['\\(ns^x\\)', '\\(x\\)'], ['\\((n-1)d^y\\,ns^x\\)', '\\(x + y\\)'], ['\\(ns^x\\,np^y\\)', '\\(10 + x + y\\)']])}
            <p class="fine">Exception : He (1s²) est en colonne 18, avec les gaz rares.</p>`,
          ask: { q: 'Colonnes :', items: [int('\\mathrm{Cl},\\ (\\mathrm{Ne})\\,3s^2 3p^5', 17), int('\\mathrm{Fe},\\ (\\mathrm{Ar})\\,3d^6 4s^2', 8)],
            why: 'Cl : bloc p, 10 + 2 + 5 = 17. Fe : bloc d, 6 + 2 = 8.' } },
        { h: 'Les familles à connaître',
          body: `${tbl(['colonne', 'famille', 'valence'], [['1 (sauf H)', 'alcalins', 'ns¹'], ['2', 'alcalino-terreux', 'ns²'], ['3 à 12', 'métaux de transition', '(n−1)d ns'], ['16', 'chalcogènes', 'ns² np⁴'], ['17', 'halogènes', 'ns² np⁵'], ['18', 'gaz rares', 'ns² np⁶']])}`,
          ask: { q: 'Le potassium K, (Ar) 4s¹, est :', items: [choice('réponse', [['a', 'un alcalin'], ['at', 'un alcalino-terreux'], ['h', 'un halogène'], ['t', 'un métal de transition']], 'a')],
            why: 'ns¹ : colonne 1, c\'est un alcalin (4<sup>e</sup> période).' } }
      ] },

      prop: { title: 'Pourquoi les propriétés évoluent', meth: "deux effets : \\(n\\) (distance) et \\(Z^*\\) (attraction) ; le rayon diminue vers la droite et augmente vers le bas, l'E.I. et l'électronégativité font l'inverse.", steps: [
        { h: 'Deux effets seulement : n et Z*',
          body: `<p>Tout découle de deux choses : la distance de l'électron externe (fixée par \\(n\\)) et la charge effective \\(Z^*\\) qu'il ressent (\\(Z\\) moins l'écran des électrons internes).</p>
            <ul><li><b>En descendant une colonne</b> : \\(n\\) augmente, l'électron externe est plus loin et plus écranté. L'atome est plus gros et l'électron moins retenu.</li>
            <li><b>De gauche à droite dans une période</b> : même \\(n\\), mais \\(Z\\) augmente de 1 à chaque case et les électrons d'une même couche se font mal écran. \\(Z^*\\) augmente, les électrons sont attirés plus près : l'atome est plus petit et l'électron plus retenu.</li></ul>`,
          ask: { q: 'Lequel est le plus gros : Na ou Cl (même période) ?', items: [choice('réponse', [['Na', 'Na'], ['Cl', 'Cl']], 'Na')],
            why: 'Même couche externe \\(n = 3\\), mais Cl (\\(Z = 17\\)) a un \\(Z^*\\) bien plus grand que Na (\\(Z = 11\\)) : ses électrons sont tirés vers le noyau. Na est plus gros.' } },
        { h: 'Énergie d\'ionisation et électronégativité',
          body: `<p>L'<b>énergie d'ionisation</b> (E.I.) est l'énergie qu'il faut pour arracher un électron. Plus il est retenu, plus elle est grande : elle augmente vers la droite et diminue vers le bas. Elle est maximale en haut à droite (He, Ne, F).</p>
            <p>L'<b>électronégativité</b> \\(\\chi\\) mesure la tendance à attirer les électrons d'une liaison. Elle suit la même tendance : F est le plus électronégatif (4,0), et les gaz rares n'en ont pas. Le caractère métallique, lui, va dans l'autre sens (en bas à gauche).</p>`,
          ask: { q: 'Deux comparaisons :', items: [choice('plus grande E.I.', [['Na', 'Na'], ['K', 'K']], 'Na'), choice('plus électronégatif', [['O', 'O'], ['S', 'S']], 'O')],
            why: 'Na est au-dessus de K : son électron externe (\\(n = 3\\) contre 4) est plus près du noyau, donc plus dur à arracher. O est au-dessus de S : il attire plus les électrons.' } },
        { h: 'Les ions : cation plus petit, anion plus gros',
          body: `<p>Un <b>cation</b> a perdu des électrons (souvent toute sa couche externe) : ceux qui restent sont attirés par le même noyau, il est plus petit que l'atome. Un <b>anion</b> a gagné des électrons, qui se repoussent et font plus d'écran : il est plus gros.</p>`,
          ask: { q: 'Lequel est le plus gros ?', items: [choice('réponse', [['Cl', 'Cl'], ['Cl-', 'Cl<sup>−</sup>']], 'Cl-')],
            why: 'Cl<sup>−</sup> a un électron de plus pour la même charge de noyau : plus de répulsion entre électrons, l\'ion gonfle.' } },
        { h: 'Les anomalies d\'énergie d\'ionisation',
          body: `<p>Deux exceptions à « E.I. augmente vers la droite » :</p>
            <ul><li><b>E.I.(Be) > E.I.(B)</b> : on arrache à B son électron 2p¹, plus haut en énergie que les 2s² de Be, et seul dans sa sous-couche. Il part plus facilement. De même, Mg > Al.</li>
            <li><b>E.I.(N) > E.I.(O)</b> : N, en 2p³, est à moitié plein (un électron par case, stable). O, en 2p⁴, a un électron apparié, repoussé par son voisin de case : il part plus facilement. De même, P > S.</li></ul>
            <p class="fine">Aussi : Zn (3d¹⁰ 4s² pleines) > Ga.</p>`,
          ask: { q: 'Plus grande énergie de 1<sup>re</sup> ionisation : N ou O ?', items: [choice('réponse', [['N', 'N'], ['O', 'O']], 'N')],
            why: 'Anomalie : N (2p³, demi-pleine) est plus stable. L\'électron apparié de O (2p⁴) est plus facile à arracher, donc E.I.(N) > E.I.(O), alors que O est plus à droite.' } }
      ] },

      /* =================== Partie 2 : liaisons chimiques (CC du 16/12) =================== */
      lewis: { title: 'La liaison covalente et la règle de l\'octet', meth: 'compte les électrons de valence (colonne : s + p) de tous les atomes, ajuste avec la charge, place les liaisons simples, complète les octets (2 pour H) avec des doublets non liants, et passe en liaison double si un atome manque d\'électrons.', steps: [
        { h: 'Partager pour compléter sa couche',
          guess: { q: 'Combien de doublets non liants porte l\'oxygène dans H<sub>2</sub>O ?', items: [int('doublets', 2)] },
          body: `<p>Un atome est stable quand sa couche externe est pleine, comme celle d'un gaz rare : 8 électrons (s² p⁶), la <b>règle de l'octet</b> (2 pour H, comme He). Pour y arriver sans gagner ni perdre d'électrons, deux atomes <b>mettent en commun</b> chacun un électron : c'est une liaison covalente, un doublet liant compté pour les deux.</p>
            <p>O a 6 électrons de valence (colonne 16) : il lui en manque 2, il fait 2 liaisons (avec les deux H). Ses 4 électrons restants forment 2 <b>doublets non liants</b>. Bilan autour de O : 2 liaisons (4 électrons) + 2 doublets (4 électrons) = 8.</p>`,
          ask: { q: 'Nombre total d\'électrons de valence de CO<sub>2</sub> (C : colonne 14, O : colonne 16) ?', items: [int('électrons', 16)], why: '4 + 6 + 6 = 16 électrons, soit 8 doublets : O=C=O, avec deux doublets non liants sur chaque O.' } },
        { h: 'La méthode pas à pas',
          body: `<ol><li>Total des électrons de valence (ajouter 1 par charge −, retirer 1 par charge +) ; diviser par 2 : nombre de doublets.</li><li>Atome central = le moins électronégatif (jamais H) ; liaisons simples vers les autres.</li><li>Compléter l'octet des atomes externes avec des doublets non liants, puis l'atome central.</li><li>S'il manque des électrons au centre, transformer un doublet non liant voisin en liaison double.</li></ol>`,
          ask: { q: 'Dans N<sub>2</sub> (10 électrons de valence), la liaison entre les deux N est :', items: [choice('réponse', [['1', 'simple'], ['2', 'double'], ['3', 'triple']], '3')], why: 'Chaque N a 5 électrons et en veut 8 : il doit en partager 3. N≡N, avec un doublet non liant sur chaque N.' } }
      ] },

      cf: { title: 'Charges formelles et mésomérie', meth: 'charge formelle = électrons de valence de l\'atome − (électrons des doublets non liants + nombre de liaisons) ; leur somme vaut la charge de l\'édifice ; les formes mésomères ne diffèrent que par la place des électrons.', steps: [
        { h: 'Qui a « trop » ou « pas assez » d\'électrons',
          guess: { q: 'Dans l\'ion ammonium NH<sub>4</sub><sup>+</sup>, quel atome porte la charge + ?', items: [choice('réponse', [['N', 'N'], ['H', 'un des H']], 'N')] },
          body: `<p>Dans une liaison, chaque atome « possède » un électron du doublet ; les doublets non liants sont entièrement à lui. On compare à ce qu'il a à l'état isolé (sa colonne) :</p>\\[CF = n_{\\text{valence}} - (n_{\\text{non liants}} + n_{\\text{liaisons}})\\]
            <p>N dans NH<sub>4</sub><sup>+</sup> : 5 électrons de valence, 4 liaisons, aucun doublet non liant : \\(CF = 5 - 4 = +1\\). Les H ont \\(1 - 1 = 0\\). La somme \\(+1\\) est bien la charge de l'ion.</p>`,
          ask: { q: 'Charge formelle d\'un O qui porte 3 doublets non liants (6 électrons) et 1 liaison simple ?', items: [int('CF', -1)], why: '\\(6 - (6 + 1) = -1\\), comme dans OH<sup>−</sup>.' } },
        { h: 'Mésomérie : la vraie molécule est un mélange',
          body: `<p>Parfois plusieurs schémas de Lewis sont possibles, qui ne diffèrent que par la place des doublets (ion carbonate, ozone). Aucun n'est « le vrai » : la molécule réelle est un intermédiaire, les électrons sont <b>délocalisés</b>. Dans CO<sub>3</sub><sup>2−</sup>, les trois liaisons C–O sont identiques, entre simple et double.</p>`,
          ask: { q: 'D\'une forme mésomère à l\'autre, on déplace :', items: [choice('réponse', [['e', 'des électrons (doublets)'], ['a', 'des atomes'], ['b', 'les deux']], 'e')], why: 'Les atomes restent à leur place : seuls les doublets bougent.' } }
      ] },

      vsepr: { title: 'VSEPR : les doublets se repoussent', meth: 'autour de l\'atome central, compte \\(n\\) atomes liés (X, une liaison multiple compte pour un) et \\(p\\) doublets non liants (E) ; \\(n + p\\) fixe la figure (2 linéaire, 3 triangle, 4 tétraèdre), et la forme se lit en ne regardant que les atomes.', steps: [
        { h: 'S\'écarter le plus possible',
          guess: { q: 'Forme de la molécule CH<sub>4</sub> ?', items: [choice('réponse', [['c', 'carrée plane'], ['t', 'tétraédrique'], ['p', 'pyramidale']], 't')] },
          body: `<p>Les doublets d'électrons autour de l'atome central se repoussent : ils se placent <b>le plus loin possible</b> les uns des autres. Deux doublets : à 180° (linéaire). Trois : à 120° (triangle). Quatre : dans les quatre directions d'un tétraèdre (109,5°), plus loin qu'un carré (90°).</p>
            <p>Notation AX<sub>n</sub>E<sub>p</sub> : n atomes liés, p doublets non liants. CH<sub>4</sub> = AX<sub>4</sub> : tétraèdre. NH<sub>3</sub> = AX<sub>3</sub>E : les 4 doublets forment un tétraèdre, mais on ne « voit » que les 3 H : <b>pyramide</b>. H<sub>2</sub>O = AX<sub>2</sub>E<sub>2</sub> : molécule <b>coudée</b>.</p>`,
          ask: { q: 'H<sub>2</sub>O est AX<sub>2</sub>E<sub>2</sub>. Son angle H–O–H est :', items: [choice('réponse', [['a', 'exactement 109,5°'], ['b', 'un peu moins (104,5°)'], ['c', '180°']], 'b')], why: 'Un doublet non liant prend plus de place qu\'une liaison : les deux doublets de O écrasent l\'angle H–O–H à 104,5°.' } }
      ] },

      hyb: { title: 'Hybridation et liaisons σ, π', meth: '\\(n + p\\) = 2, 3, 4 → hybridation sp, sp², sp³ ; une liaison simple = 1 σ ; double = 1 σ + 1 π ; triple = 1 σ + 2 π.', steps: [
        { h: 'Mélanger les orbitales pour pointer dans les bonnes directions',
          guess: { q: 'Le carbone de l\'éthylène C<sub>2</sub>H<sub>4</sub> (AX<sub>3</sub>, plan, 120°) est hybridé :', items: [choice('réponse', [['sp', 'sp'], ['sp2', 'sp²'], ['sp3', 'sp³']], 'sp2')] },
          body: `<p>Les orbitales s et p d'un atome ne pointent pas dans les directions données par la VSEPR. L'atome les « mélange » (hybride) pour obtenir des orbitales identiques bien orientées : 1 s + 3 p → 4 orbitales sp³ (tétraèdre) ; 1 s + 2 p → 3 sp² (triangle, une p reste) ; 1 s + 1 p → 2 sp (ligne, deux p restent).</p>
            <p>Les orbitales hybrides se recouvrent <b>dans l'axe</b> de la liaison : liaison <b>σ</b>. Les p restantes, parallèles, se recouvrent <b>sur le côté</b> : liaison <b>π</b>, plus faible. Une double liaison = σ + π, une triple = σ + 2 π.</p>`,
          ask: { q: 'Combien de liaisons π dans N≡N ?', items: [int('π', 2)], why: 'Une triple liaison : 1 σ dans l\'axe + 2 π sur les côtés.' } }
      ] },

      polar: { title: 'Polarité et interactions entre molécules', meth: 'une liaison entre deux atomes d\'électronégativités différentes est polarisée (δ− sur le plus électronégatif) ; le moment dipolaire de la molécule est la somme vectorielle : une molécule symétrique (CO<sub>2</sub>, CCl<sub>4</sub>) est apolaire.', steps: [
        { h: 'Un tir à la corde pour les électrons',
          guess: { q: 'La molécule CO<sub>2</sub> (linéaire, O=C=O) est-elle polaire ?', items: [choice('réponse', [['o', 'oui'], ['n', 'non']], 'n')] },
          body: `<p>Dans une liaison, l'atome le plus électronégatif tire le doublet vers lui : il porte une charge partielle δ−, l'autre δ+. Chaque liaison a un petit moment dipolaire (une flèche).</p>
            <p>Pour la molécule entière, on <b>additionne les flèches</b>. Dans CO<sub>2</sub>, les deux liaisons C=O sont polarisées, mais elles tirent en sens opposés : la somme est nulle, CO<sub>2</sub> est <b>apolaire</b>. H<sub>2</sub>O est coudée : les deux flèches ne se compensent pas, elle est <b>polaire</b>. La géométrie (VSEPR) décide.</p>`,
          ask: { q: 'Pourquoi l\'eau bout-elle à 100 °C, bien plus haut que H<sub>2</sub>S (−60 °C) ?', items: [choice('réponse', [['h', 'liaisons hydrogène entre molécules d\'eau'], ['m', 'H₂O est plus lourde'], ['c', 'liaisons covalentes plus fortes dans H₂O']], 'h')], why: 'H lié à O (très électronégatif) est attiré par les doublets d\'un O voisin : ces liaisons hydrogène retiennent les molécules entre elles. H₂O est pourtant plus légère que H₂S.' } }
      ] }
    };
  };
})();
