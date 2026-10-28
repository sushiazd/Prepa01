/* =====================================================================
   Leçons « Comprendre » de l'électronique (CC1 : séquence 1 du CM). Une leçon par compétence du parcours
   (clé = id de SK dans index.html), sauf les démonstrations (elles ont leur onglet). Elle passe avant les
   exercices : l'image physique (potentiel = altitude, courant = débit), une prédiction « Devine d'abord »,
   l'explication, puis une question sans enjeu. meth = ce qu'il faut reconnaître et la méthode (sert d'indice).
   Moteur : SiteLessons (core.js). Notations du cours (S. Avrillon, O. Lafond) : convention récepteur,
   flèche de tension U_AB pointée vers A, 0 V sur la ligne du bas.
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function () {
    const C = (lab, opts, ans) => ({ type: 'choice', lab, opts: opts.map(([v, t]) => ({ v, t })), ans });
    const N = (lab, val, unit, tol) => ({ type: 'num', lab, val, unit, tol });
    const INK = 'fill:var(--ink-2);font:15px var(--sans)', LINE = 'stroke:var(--ink-2);stroke-width:2;fill:none';
    // résistance horizontale de (x, y) à (x + 60, y), étiquette au-dessus
    const Rh = (x, y, lab) => `<rect x="${x + 12}" y="${y - 8}" width="36" height="16" style="${LINE};fill:var(--sheet)"/><line x1="${x}" y1="${y}" x2="${x + 12}" y2="${y}" style="${LINE}"/><line x1="${x + 48}" y1="${y}" x2="${x + 60}" y2="${y}" style="${LINE}"/><text x="${x + 30}" y="${y - 14}" text-anchor="middle" style="${INK}">${lab}</text>`;
    const Rv = (x, y, lab) => `<rect x="${x - 8}" y="${y + 12}" width="16" height="36" style="${LINE};fill:var(--sheet)"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 12}" style="${LINE}"/><line x1="${x}" y1="${y + 48}" x2="${x}" y2="${y + 60}" style="${LINE}"/><text x="${x + 14}" y="${y + 34}" style="${INK}">${lab}</text>`;
    const W = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="${LINE}"/>`;
    const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="3.5" style="fill:var(--ink-2)"/>`;
    const SERIE_PARA = `<svg class="lfig" viewBox="0 0 420 150" role="img" aria-label="À gauche deux résistances en série, à droite deux résistances en parallèle">
      <text x="20" y="20" style="${INK};font-weight:600">série</text>${W(20, 70, 40, 70)}${Rh(40, 70, 'R₁')}${Rh(100, 70, 'R₂')}${W(160, 70, 180, 70)}${dot(20, 70)}${dot(180, 70)}
      <text x="20" y="120" style="${INK}">un seul chemin, même courant</text>
      <text x="240" y="20" style="${INK};font-weight:600">parallèle</text>${dot(240, 70)}${dot(400, 70)}${W(240, 70, 260, 70)}${W(380, 70, 400, 70)}${W(260, 45, 260, 95)}${W(380, 45, 380, 95)}${Rh(290, 45, 'R₁')}${W(260, 45, 290, 45)}${W(350, 45, 380, 45)}${Rh(290, 95, '')}<text x="320" y="122" text-anchor="middle" style="${INK}">R₂</text>${W(260, 95, 290, 95)}${W(350, 95, 380, 95)}
      <text x="240" y="145" style="${INK}">deux chemins, même tension</text></svg>`;

    const L = {
      /* =================== Les bases =================== */
      ohm: { title: 'Tension, courant, résistance', meth: 'repère la résistance, la tension à ses bornes et le courant qui la traverse, puis \\(U = R\\,I\\) avec \\(U\\) en V, \\(R\\) en kΩ et \\(I\\) en mA (les puissances de 10 se compensent).', steps: [
        { h: 'Le potentiel, c\'est une altitude',
          guess: { q: 'Une bille roule dans une gouttière en pente. Plus la pente entre deux points est forte, plus la bille…', items: [C('réponse', [['v', 'va vite (fort débit)'], ['l', 'va lentement'], ['r', 'ne dépend pas de la pente']], 'v')] },
          body: `<p>En électricité, chaque point d'un circuit a un <b>potentiel</b> \\(V\\) (en volts) : pense à une <b>altitude</b>. La <b>tension</b> entre deux points est une <b>différence d'altitude</b> :</p>\\[U_{AB} = V_A - V_B\\]
            <p>Les charges « descendent » les potentiels comme la bille descend la pente : le <b>courant</b> \\(I\\) (en ampères) est le <b>débit</b> de charges, et plus la tension est grande, plus le débit est grand. Une <b>résistance</b> est un passage étroit qui freine ce débit.</p>
            <p>Le 0 V, c'est le « niveau de la mer » : on le choisit (en général la ligne du bas du schéma). Seules les différences comptent.</p>`,
          ask: { q: 'Le point A est à 9 V et le point B à 3 V. Que vaut la tension \\(U_{AB}\\) ?', items: [N('\\(U_{AB}\\)', 6, 'V')],
            why: '\\(U_{AB} = V_A - V_B = 9 - 3 = 6\\) V. Et \\(U_{BA} = -6\\) V : c\'est la même différence d\'altitude, vue dans l\'autre sens.' } },
        { h: 'La loi d\'Ohm : le débit est proportionnel à la pente',
          guess: { q: 'Aux bornes d\'une résistance, on double la tension. Le courant…', items: [C('réponse', [['x2', 'double'], ['x4', 'est multiplié par 4'], ['d2', 'est divisé par 2'], ['eq', 'ne change pas']], 'x2')] },
          body: `<p>Pour une résistance, le courant est <b>proportionnel</b> à la tension : deux fois plus de pente, deux fois plus de débit. Le coefficient, c'est la résistance :</p>\\[U = R\\,I\\]
            <p>À tension fixée, une grande résistance laisse passer peu de courant (passage très étroit) : \\(I = U/R\\).</p>`,
          ask: { q: 'Une résistance de 2 kΩ a 6 V à ses bornes. Quel courant la traverse ?', items: [N('\\(I\\)', 3, 'mA')],
            why: '\\(I = U/R = 6\\ \\text{V} / 2\\ \\text{k}\\Omega = 3\\) mA.' } },
        { h: 'Le réflexe des kΩ et des mA',
          guess: { q: '\\(8\\ \\text{V} / 4\\ \\text{k}\\Omega\\) =', items: [C('réponse', [['A', '2 A'], ['mA', '2 mA'], ['32', '32 mA'], ['uA', '2 µA']], 'mA')] },
          body: `<p>Au CC, il n'y a pas de calculatrice : on garde les nombres simples en travaillant en <b>kΩ</b> et en <b>mA</b>. Comme \\(1\\ \\text{k}\\Omega = 10^{3}\\ \\Omega\\) et \\(1\\ \\text{mA} = 10^{-3}\\ \\text{A}\\), les deux puissances de 10 se compensent :</p>
            <ul><li>des V divisés par des kΩ donnent des <b>mA</b> ;</li><li>des kΩ multipliés par des mA donnent des <b>V</b>.</li></ul>
            <p>Ainsi \\(8/4 = 2\\) mA, sans écrire une seule puissance de 10.</p>`,
          ask: { q: '\\(1{,}5\\ \\text{k}\\Omega \\times 4\\ \\text{mA}\\) =', items: [N('\\(U\\)', 6, 'V')],
            why: '\\(1{,}5 \\times 4 = 6\\) : kΩ fois mA donne des volts, donc 6 V.' } }
      ] },

      conv: { title: 'Flécher un circuit', meth: 'sur une résistance (récepteur), flèche de tension opposée à la flèche de courant, et alors \\(U = R\\,I\\) ; sur un générateur, les deux flèches dans le même sens, la tension pointe vers le \\(+\\).', steps: [
        { h: 'La flèche de tension pointe vers le potentiel « du haut »',
          body: `<p>Sur un schéma, une tension se dessine par une flèche. Convention du cours : la flèche de \\(U_{AB}\\) part de B et <b>pointe vers A</b>. Si \\(U_{AB} > 0\\), A est plus haut que B : la flèche pointe vers le haut de la pente.</p>
            <p>Le courant, lui, se dessine par une flèche sur le fil. On choisit son sens <b>librement</b> : si on s'est trompé, le calcul donnera un nombre négatif, et c'est tout.</p>`,
          ask: { q: 'La flèche de la tension \\(U_{AB}\\) pointe vers :', items: [C('réponse', [['A', 'A'], ['B', 'B']], 'A')],
            why: 'Elle pointe vers A, le premier indice : \\(U_{AB} = V_A - V_B\\).' } },
        { h: 'Récepteur : les charges descendent, les flèches sont opposées',
          guess: { q: 'Dans une résistance, le courant circule…', items: [C('réponse', [['hb', 'du potentiel le plus haut vers le plus bas'], ['bh', 'du potentiel le plus bas vers le plus haut']], 'hb')] },
          body: `<p>Une résistance ne fournit pas d'énergie : les charges la traversent en <b>descendant</b> les potentiels, comme la bille descend la gouttière. Le courant va donc du point haut vers le point bas.</p>
            <p>La flèche de tension pointe vers le point haut, la flèche de courant vers le point bas : elles sont <b>opposées</b>. C'est la <b>convention récepteur</b>, et c'est seulement dans ce cas que</p>\\[U = R\\,I \\quad\\text{(avec le signe +)}\\]`,
          ask: { q: 'Sur une résistance de 2 kΩ, quelqu\'un a dessiné les flèches de \\(U\\) et de \\(I\\) <b>dans le même sens</b>, avec \\(I = 3\\) mA. Que vaut \\(U\\) ?', items: [N('\\(U\\)', -6, 'V')],
            why: 'Flèches dans le même sens sur un récepteur : \\(U = -R\\,I = -6\\) V. Pour éviter ce signe, on flèche toujours les résistances en convention récepteur.' } },
        { h: 'Générateur : il fait remonter les charges',
          guess: { q: 'Une pile alimente une lampe. Le courant sort de la pile par sa borne…', items: [C('réponse', [['p', '\\(+\\)'], ['m', '\\(-\\)']], 'p')] },
          body: `<p>Un générateur, c'est une <b>pompe</b> : il remonte les charges du bas vers le haut, puis elles redescendent dans le reste du circuit. Le courant sort donc par la borne \\(+\\), le point haut.</p>
            <p>Sa flèche de tension pointe vers le \\(+\\), et la flèche de courant aussi : les deux flèches sont <b>dans le même sens</b> (convention générateur).</p>`,
          ask: { q: 'Pour un générateur, la flèche de tension et la flèche de courant sont :', items: [C('réponse', [['m', 'dans le même sens'], ['o', 'opposées']], 'm')],
            why: 'Même sens pour un générateur, opposées pour un récepteur. C\'est la première chose vérifiée dans ta copie.' } },
        { h: 'Un courant négatif n\'est pas une erreur',
          body: `<p>Tu flèches un courant \\(I\\) vers la droite, le calcul donne \\(I = -2\\) mA : ça veut seulement dire que 2 mA circulent <b>vers la gauche</b>. On garde le signe jusqu'au bout, sans changer les flèches.</p>`,
          ask: { q: 'Tu trouves \\(I_2 = -1\\) mA. Que fais-tu ?', items: [C('réponse', [['k', 'je garde −1 mA : le courant va dans l\'autre sens'], ['f', 'je retourne la flèche et je refais tout'], ['e', 'c\'est forcément une erreur de calcul']], 'k')],
            why: 'Le signe porte l\'information du sens. Retourner la flèche en cours de route fait des erreurs de signe partout ailleurs.' } }
      ] },

      /* =================== Résistance équivalente =================== */
      as2: { title: 'Série et parallèle', meth: 'deux résistances sont en série si le même courant les traverse (aucun fil ne part entre elles) : on additionne ; en parallèle si elles sont branchées entre les deux mêmes nœuds : produit sur somme.', steps: [
        { h: 'Deux façons de brancher',
          body: `${SERIE_PARA}<ul><li><b>Série</b> : bout à bout, rien ne part entre elles. Il n'y a qu'un chemin : le <b>même courant</b> les traverse.</li>
            <li><b>Parallèle</b> : leurs deux bornes sont reliées aux <b>deux mêmes nœuds</b>. Elles ont la <b>même tension</b> à leurs bornes, et le courant se partage.</li></ul>`,
          ask: { q: 'Deux résistances sont branchées entre les deux mêmes nœuds A et B. Elles sont :', items: [C('réponse', [['s', 'en série'], ['p', 'en parallèle']], 'p')],
            why: 'Mêmes deux nœuds, donc même tension : parallèle.' } },
        { h: 'En série, les résistances s\'additionnent',
          guess: { q: 'Deux résistances \\(R\\) en série équivalent à :', items: [C('réponse', [['2', '\\(2R\\)'], ['1', '\\(R\\)'], ['h', '\\(R/2\\)']], '2')] },
          body: `<p>Deux passages étroits l'un après l'autre freinent deux fois plus. En calcul : le même \\(I\\) traverse les deux, donc \\(U = R_1 I + R_2 I = (R_1 + R_2) I\\) :</p>\\[R_{eq} = R_1 + R_2 + \\dots\\]`,
          ask: { q: '1 kΩ, 2 kΩ et 4 kΩ en série :', items: [N('\\(R_{eq}\\)', 7, 'kΩ')], why: 'On additionne : 7 kΩ.' } },
        { h: 'En parallèle, on ouvre un deuxième chemin',
          guess: { q: 'Deux résistances \\(R\\) en parallèle équivalent à :', items: [C('réponse', [['2', '\\(2R\\)'], ['1', '\\(R\\)'], ['h', '\\(R/2\\)']], 'h')] },
          body: `<p>Deux chemins côte à côte, c'est deux fois plus de passage : le courant total double, la résistance équivalente est divisée par deux. En calcul : même tension \\(U\\), les courants s'ajoutent, \\(I = U/R_1 + U/R_2\\), donc</p>\\[\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\qquad\\Longrightarrow\\qquad R_{eq} = \\frac{R_1 R_2}{R_1 + R_2}\\ \\text{(produit sur somme)}\\]
            <p>Conséquence utile pour vérifier : en parallèle, \\(R_{eq}\\) est toujours <b>plus petite que la plus petite</b> des résistances.</p>`,
          ask: { q: '3 kΩ en parallèle avec 6 kΩ :', items: [N('\\(R_{eq}\\)', 2, 'kΩ')], why: '\\(\\dfrac{3\\times6}{3+6} = \\dfrac{18}{9} = 2\\) kΩ, bien plus petit que 3 kΩ.' } }
      ] },

      asn: { title: 'Plusieurs branches, résistances inutiles', meth: '\\(n\\) résistances \\(R\\) identiques en parallèle font \\(R/n\\) ; une résistance court-circuitée par un fil ou reliée à rien par une borne ne sert à rien : on l\'enlève.', steps: [
        { h: 'n branches identiques : R/n',
          guess: { q: 'Trois résistances \\(3R\\) en parallèle :', items: [C('réponse', [['9', '\\(9R\\)'], ['3', '\\(3R\\)'], ['1', '\\(R\\)']], '1')] },
          body: `<p>\\(n\\) chemins identiques, c'est \\(n\\) fois plus de passage : \\(\\dfrac{1}{R_{eq}} = \\dfrac{n}{R}\\), donc \\(R_{eq} = R/n\\). Le prof adore : \\(4R \\parallel 4R = 2R\\), \\(3R \\parallel 3R \\parallel 3R = R\\), \\(2R \\parallel 2R = R\\).</p>`,
          ask: { q: '\\(6R \\parallel 6R \\parallel 3R\\) = ? (indice : regroupe d\'abord les deux \\(6R\\))', items: [C('\\(R_{eq}\\)', [['a', '\\(R\\)'], ['b', '\\(1{,}5R\\)'], ['c', '\\(2R\\)'], ['d', '\\(15R\\)']], 'b')],
            why: '\\(6R \\parallel 6R = 3R\\), puis \\(3R \\parallel 3R = 1{,}5R\\).' } },
        { h: 'Court-circuit : le fil gagne toujours',
          guess: { q: 'Une résistance est en parallèle avec un simple fil. Le courant passe…', items: [C('réponse', [['f', 'entièrement par le fil'], ['r', 'entièrement par la résistance'], ['m', 'moitié-moitié']], 'f')] },
          body: `<p>Un fil a une résistance nulle : la tension à ses bornes vaut \\(0\\). La résistance en parallèle a donc \\(U = 0\\), et \\(I = U/R = 0\\) : elle est <b>court-circuitée</b>, on l'efface du schéma.</p>
            <p>De même, une résistance dont une borne n'est reliée à rien (un « cul-de-sac ») n'est traversée par aucun courant : on l'enlève aussi.</p>`,
          ask: { q: 'Une résistance \\(R\\) court-circuitée par un fil compte pour :', items: [C('réponse', [['0', 'rien (on l\'enlève)'], ['R', '\\(R\\)'], ['h', '\\(R/2\\)']], '0')], why: 'Elle n\'est traversée par aucun courant : elle disparaît du calcul.' } },
        { h: 'Le piège du bout de montage',
          body: `<p>Dans les annales 2022 et 2025, une résistance est dessinée <b>tout au bout</b>, horizontale, et son autre borne rejoint la ligne du bas par un fil. Elle forme quand même une branche entre le fil du haut et le fil du bas : elle compte comme une <b>branche verticale</b> en parallèle avec la voisine.</p>
            <p>Le réflexe : suis les fils avec le doigt. Deux points reliés par un fil sans rien dessus sont le <b>même nœud</b>, quelle que soit la forme du dessin.</p>`,
          ask: { q: 'Au bout du réseau, une \\(4R\\) verticale et une \\(4R\\) reliée à la ligne du bas par un fil. Ensemble, elles valent :', items: [C('réponse', [['8', '\\(8R\\)'], ['2', '\\(2R\\)'], ['4', '\\(4R\\)']], '2')],
            why: 'Elles relient les deux mêmes nœuds : \\(4R \\parallel 4R = 2R\\). C\'est exactement le piège de 2022.' } }
      ] },

      lad1: { title: 'Réseau en échelle : partir du bout', meth: 'commence au bout opposé à A et B : regroupe la dernière résistance verticale avec l\'horizontale qui la précède (série), puis avec la verticale suivante (parallèle), et remonte vers A et B en alternant.', steps: [
        { h: 'Par quel bout commencer ?',
          guess: { q: 'Pour calculer \\(R_{AB}\\) d\'un réseau en échelle, on commence…', items: [C('réponse', [['ab', 'près de A et B'], ['f', 'au bout opposé à A et B'], ['m', 'au milieu']], 'f')] },
          body: `<p>Près de A et B, tout dépend de tout le reste : impossible de dire ce qui est en série. Au <b>bout opposé</b>, au contraire, la situation est claire : la dernière résistance verticale et l'horizontale juste avant sont traversées par le même courant, donc <b>en série</b>.</p>
            <p>On les remplace par une seule résistance, qui devient la nouvelle « dernière branche verticale » : elle est <b>en parallèle</b> avec la verticale précédente. Et on recommence : série, parallèle, série… jusqu'à A et B.</p>`,
          ask: { q: 'Après avoir regroupé le bout en une seule résistance verticale, elle est avec la verticale précédente :', items: [C('réponse', [['s', 'en série'], ['p', 'en parallèle']], 'p')], why: 'Elles relient les deux mêmes fils (haut et bas) : parallèle.' } },
        { h: 'Un exemple jusqu\'au bout',
          body: `<p>Réseau de A vers le bout : une \\(R\\) horizontale, puis une \\(4R\\) verticale, puis une \\(2R\\) horizontale, puis une \\(2R\\) verticale au bout.</p>
            <ol><li>Au bout : \\(2R\\) (horizontale) et \\(2R\\) (verticale) en série : \\(4R\\).</li><li>Ce \\(4R\\) est en parallèle avec la \\(4R\\) verticale : \\(2R\\).</li><li>Ce \\(2R\\) est en série avec la \\(R\\) horizontale côté A : \\(3R\\).</li></ol>
            <p>Au CC, chaque étape s'écrit avec un petit schéma et la phrase « … et … sont en série (parallèle) car … » : c'est ce que veut dire « en expliquant ».</p>`,
          ask: { q: 'Même réseau, mais la \\(4R\\) verticale est remplacée par une \\(12R\\). \\(R_{AB}/R\\) = ?', items: [N('\\(R_{AB}/R\\)', 4)],
            why: 'Bout : \\(2R + 2R = 4R\\) ; \\(4R \\parallel 12R = \\dfrac{48}{16}R = 3R\\) ; plus la \\(R\\) horizontale : \\(4R\\).' } }
      ] },

      lad2: { title: 'Échelle niveau CC : lire le schéma', meth: 'suis les fils pour repérer les nœuds (deux points reliés par un fil = un seul nœud), enlève ce qui est court-circuité, puis applique la méthode du bout : série, parallèle, série…', steps: [
        { h: 'Un nœud, c\'est tout un morceau de fil',
          body: `<p>Les schémas du CC sont parfois dessinés « bizarrement » (en 2021, A est en bas). La parade : <b>colorier</b> mentalement chaque morceau de fil d'une couleur. Tout ce qui est relié sans résistance a la même couleur : c'est un seul nœud, au même potentiel.</p>
            <p>Deux résistances qui touchent les deux mêmes couleurs sont en parallèle ; deux résistances qui se suivent avec une couleur qui ne touche qu'elles deux sont en série.</p>`,
          ask: { q: 'Deux résistances partagent une borne, et ce nœud commun ne touche rien d\'autre. Elles sont :', items: [C('réponse', [['s', 'en série'], ['p', 'en parallèle']], 's')], why: 'Rien ne part du nœud commun : le même courant les traverse, elles sont en série.' } },
        { h: 'Plusieurs branches d\'un coup',
          body: `<p>En 2025, quatre branches sont en parallèle au même endroit. Pas de panique : on peut regrouper dans n'importe quel ordre, par exemple les identiques d'abord. \\(R \\parallel 2R \\parallel R\\) : les deux \\(R\\) font \\(R/2\\), puis \\(\\dfrac{R}{2} \\parallel 2R = \\dfrac{R\\cdot 2R/2}{R/2 + 2R} = \\dfrac{R^2}{5R/2} = \\dfrac{2R}{5}\\).</p>
            <p>Autre méthode : additionner les inverses, \\(\\dfrac{1}{R} + \\dfrac{1}{2R} + \\dfrac{1}{R} = \\dfrac{5}{2R}\\), donc \\(\\dfrac{2R}{5}\\).</p>`,
          ask: { q: '\\(2R \\parallel 2R \\parallel R\\) = ?', items: [C('\\(R_{eq}\\)', [['a', '\\(R/2\\)'], ['b', '\\(5R\\)'], ['c', '\\(2R/5\\)'], ['d', '\\(R\\)']], 'a')],
            why: '\\(2R \\parallel 2R = R\\), puis \\(R \\parallel R = R/2\\).' } }
      ] },

      /* =================== Kirchhoff =================== */
      nd: { title: 'Loi des nœuds : rien ne se perd', meth: 'à un nœud, la somme des courants qui arrivent égale la somme des courants qui partent (avec leurs signes, d\'après le sens des flèches).', steps: [
        { h: 'Un carrefour de tuyaux',
          guess: { q: 'À un nœud arrivent 5 mA. Une branche emporte 2 mA. L\'autre branche emporte :', items: [N('\\(I\\)', 3, 'mA')] },
          body: `<p>Les charges ne s'accumulent nulle part dans un fil : tout ce qui arrive à un nœud en repart, comme l'eau à un carrefour de tuyaux.</p>\\[\\sum I_{\\text{entrants}} = \\sum I_{\\text{sortants}}\\]
            <p>« Entrant » et « sortant » se lisent sur <b>les flèches que tu as dessinées</b>, pas sur le sens réel : si une flèche entre et que le courant vaut \\(-1\\) mA, il sort 1 mA en vrai, et l'équation reste juste.</p>`,
          ask: { q: 'Au nœud A, les flèches de \\(I_1 = 4\\) mA et \\(I_2 = -1\\) mA entrent, celle de \\(I_3\\) sort. \\(I_3\\) = ?', items: [N('\\(I_3\\)', 3, 'mA')],
            why: '\\(I_3 = I_1 + I_2 = 4 + (-1) = 3\\) mA : on écrit l\'équation avec les flèches, les signes font le reste.' } }
      ] },

      ml: { title: 'Loi des mailles : faire le tour', meth: 'choisis un sens de parcours de la maille ; les tensions dont la flèche va dans ce sens comptent \\(+\\), les autres \\(-\\), et la somme vaut 0.', steps: [
        { h: 'Revenir à son point de départ',
          guess: { q: 'Tu fais une randonnée en boucle et tu reviens au parking. Ton dénivelé total (montées comptées +, descentes −) vaut :', items: [C('réponse', [['0', '0'], ['p', 'positif'], ['d', 'ça dépend du chemin']], '0')] },
          body: `<p>Le potentiel est une altitude. Si on fait le tour d'une boucle fermée (une <b>maille</b>) et qu'on revient au point de départ, la somme des différences d'altitude est nulle :</p>\\[\\sum_{\\text{maille}} \\pm\\,U_k = 0\\]
            <p>Pour les signes : on choisit un sens de parcours ; une tension dont la flèche est dans ce sens compte \\(+\\), dans l'autre sens \\(-\\).</p>`,
          ask: { q: 'Maille : générateur \\(E = 12\\) V, puis deux résistances de tensions \\(U_1 = 5\\) V et \\(U_2\\) (fléchées en récepteur). \\(U_2\\) = ?', items: [N('\\(U_2\\)', 7, 'V')],
            why: '\\(E - U_1 - U_2 = 0\\), donc \\(U_2 = 12 - 5 = 7\\) V : le générateur remonte de 12 V, les résistances redescendent de 12 V au total.' } },
        { h: 'Combien d\'équations ?',
          body: `<p>Avec trois branches reliant deux nœuds (le cas de l'Ex 3), il y a trois mailles possibles, mais la troisième est la somme des deux autres : elle n'apporte rien. On écrit donc <b>2 lois des mailles + 1 loi des nœuds</b> pour 3 courants inconnus.</p>`,
          ask: { q: 'Pour trouver 3 courants inconnus dans un circuit à 3 branches, on écrit :', items: [C('réponse', [['a', '3 lois des mailles'], ['b', '2 lois des mailles + 1 loi des nœuds'], ['c', '3 lois des nœuds']], 'b')],
            why: 'Autant d\'équations indépendantes que d\'inconnues : 2 mailles + 1 nœud.' } }
      ] },

      loop: { title: 'Courant dans une maille', meth: 'une seule maille : un seul courant \\(I\\). Loi des mailles avec \\(U = R\\,I\\) sur chaque résistance, puis isole \\(I\\).', steps: [
        { h: 'Une maille, un courant',
          guess: { q: 'Un générateur \\(E = 9\\) V alimente 1 kΩ et 2 kΩ en série. Le courant vaut :', items: [N('\\(I\\)', 3, 'mA')] },
          body: `<p>Dans une seule boucle, il n'y a qu'un chemin : un seul courant \\(I\\). La loi des mailles donne \\(E - R_1 I - R_2 I = 0\\), donc</p>\\[I = \\frac{E}{R_1 + R_2}\\]
            <p>C'est logique : le générateur « voit » la résistance équivalente \\(R_1 + R_2\\).</p>`,
          ask: { q: 'Même circuit avec 2 kΩ et 4 kΩ et \\(E = 12\\) V. Tension aux bornes de la 4 kΩ ?', items: [N('\\(U\\)', 8, 'V')],
            why: '\\(I = 12/6 = 2\\) mA, puis \\(U = 4 \\times 2 = 8\\) V.' } },
        { h: 'Deux générateurs dans la même maille',
          body: `<p>Si deux générateurs sont tête-bêche dans la boucle, l'un pousse, l'autre freine : \\(E_1 - R_1 I - E_2 - R_2 I = 0\\), donc \\(I = \\dfrac{E_1 - E_2}{R_1 + R_2}\\). Si \\(E_2 > E_1\\), le courant est négatif : il tourne dans l'autre sens.</p>`,
          ask: { q: '\\(E_1 = 10\\) V et \\(E_2 = 4\\) V opposés, \\(R_1 + R_2 = 3\\) kΩ. \\(I\\) = ?', items: [N('\\(I\\)', 2, 'mA')], why: '\\(I = (10 - 4)/3 = 2\\) mA.' } }
      ] },

      /* =================== Ponts diviseurs =================== */
      pdt: { title: 'Le pont diviseur de tension', meth: 'des résistances en série sous une tension \\(U\\), sans courant qui part entre elles : \\(U_k = \\dfrac{R_k}{\\sum R_i}\\,U\\) (chaque résistance prend sa part de la tension, proportionnellement à sa valeur).', steps: [
        { h: 'La tension se partage au prorata',
          guess: { q: 'Deux résistances, 1 kΩ et 3 kΩ, en série sous 8 V. Laquelle a la plus grande tension ?', items: [C('réponse', [['1', 'la 1 kΩ'], ['3', 'la 3 kΩ'], ['eq', 'les deux pareil']], '3')] },
          body: `<p>Le même courant traverse les deux, et \\(U = R\\,I\\) : la plus grosse résistance prend la plus grosse part de la tension. Avec \\(I = \\dfrac{U}{R_1 + R_2}\\) (une maille), on trouve</p>\\[U_1 = R_1 I = \\frac{R_1}{R_1 + R_2}\\,U\\qquad U_k = \\frac{R_k}{\\sum_i R_i}\\,U\\]
            <p>Ici : \\(U_{3k} = \\dfrac{3}{4}\\times 8 = 6\\) V et \\(U_{1k} = 2\\) V. Total 8 V : rien ne se perd.</p>`,
          ask: { q: '2 kΩ, 3 kΩ et 5 kΩ en série sous 20 V. Tension aux bornes de la 5 kΩ ?', items: [N('\\(U\\)', 10, 'V')], why: '\\(\\dfrac{5}{10}\\times 20 = 10\\) V.' } },
        { h: 'La condition : aucun courant ne s\'échappe',
          body: `<p>La démonstration utilise « le même courant dans toutes les résistances ». Si une charge \\(R_L\\) est branchée au milieu, une partie du courant part par elle : le pont diviseur direct est <b>faux</b>. Il faut d'abord regrouper \\(R_L\\) avec la résistance à laquelle elle est en parallèle (c'est la méthode de l'Ex 4).</p>`,
          ask: { q: 'Une charge est branchée entre les deux résistances d\'un pont. Pour la tension à ses bornes :', items: [C('réponse', [['d', 'pont diviseur direct avec les deux résistances'], ['r', 'd\'abord \\(R_{eq}\\) = charge en parallèle, puis pont diviseur']], 'r')],
            why: 'Un courant part dans la charge : on la regroupe d\'abord, sinon le résultat est faux.' } },
        { h: 'La démonstration (Ex 1, 2021)',
          body: `<p>Elle tient en trois lignes, à savoir par cœur :</p><ol><li>Loi des mailles : \\(U = U_1 + \\dots + U_N\\), et Ohm sur chaque résistance : \\(U = (R_1 + \\dots + R_N)\\,I\\).</li><li>On isole \\(I = \\dfrac{U}{\\sum R_i}\\).</li><li>Ohm sur \\(R_k\\) : \\(U_k = R_k I = \\dfrac{R_k}{\\sum R_i}\\,U\\).</li></ol><p>Avec le schéma fléché (convention récepteur partout) : 4 points.</p>`,
          ask: { q: 'Dans la démonstration, quelle loi donne la tension totale \\(U\\) en fonction des \\(U_k\\) ?', items: [C('réponse', [['m', 'la loi des mailles'], ['n', 'la loi des nœuds']], 'm')], why: 'Faire le tour : \\(U = \\sum U_k\\).' } }
      ] },

      pdc: { title: 'Le pont diviseur de courant', meth: 'des résistances en parallèle traversées au total par \\(I\\) : \\(I_k = \\dfrac{1/R_k}{\\sum 1/R_i}\\,I\\) ; pour deux, \\(I_1 = \\dfrac{R_2}{R_1 + R_2}\\,I\\) (l\'autre résistance au numérateur).', steps: [
        { h: 'Le courant préfère le chemin facile',
          guess: { q: '3 mA se partagent entre 1 kΩ et 2 kΩ en parallèle. Combien passent dans la 1 kΩ ?', items: [N('\\(I_1\\)', 2, 'mA')] },
          body: `<p>En parallèle, les résistances ont la <b>même tension</b>. Avec \\(I = U/R\\), la plus petite résistance laisse passer le plus de courant : le courant se partage en proportion de \\(1/R\\).</p>\\[I_1 = \\frac{R_2}{R_1 + R_2}\\,I\\]
            <p>Ici \\(I_1 = \\dfrac{2}{3}\\times 3 = 2\\) mA et \\(I_2 = 1\\) mA. Le piège : c'est <b>l'autre</b> résistance au numérateur (la 2 kΩ pour le courant de la 1 kΩ).</p>`,
          ask: { q: '6 mA se partagent entre 2 kΩ et 4 kΩ en parallèle. Courant dans la 4 kΩ ?', items: [N('\\(I\\)', 2, 'mA')], why: '\\(I_{4k} = \\dfrac{2}{2+4}\\times 6 = 2\\) mA (la 2 kΩ au numérateur), et 4 mA dans la 2 kΩ.' } },
        { h: 'La démonstration (Ex 1, 2024)',
          body: `<ol><li>Même tension \\(U\\) aux bornes de toutes les branches : \\(I_k = U/R_k\\).</li><li>Loi des nœuds : \\(I = \\sum I_k = U\\sum \\dfrac{1}{R_i}\\), donc \\(U = \\dfrac{I}{\\sum 1/R_i}\\).</li><li>On remplace : \\(I_k = \\dfrac{1/R_k}{\\sum 1/R_i}\\,I\\).</li></ol>`,
          ask: { q: 'Dans cette démonstration, quelle loi relie \\(I\\) aux \\(I_k\\) ?', items: [C('réponse', [['m', 'la loi des mailles'], ['n', 'la loi des nœuds']], 'n')], why: 'Le courant total se répartit dans les branches : loi des nœuds.' } }
      ] },

      /* =================== Millman =================== */
      mi1: { title: 'Millman : le potentiel d\'un nœud', meth: '0 V sur la ligne du bas, puis \\(V_A = \\dfrac{\\sum V_k/R_k}{\\sum 1/R_k}\\) : chaque branche apporte \\(E/R\\) en haut (\\(+E\\) si le \\(+\\) est côté A, \\(-E\\) sinon, 0 sans générateur) et \\(1/R\\) en bas.', steps: [
        { h: 'Une moyenne pondérée',
          guess: { q: 'Un nœud A est relié par trois résistances identiques à des points à 0 V, 0 V et 9 V. \\(V_A\\) vaut :', items: [N('\\(V_A\\)', 3, 'V')] },
          body: `<p>Le nœud A « tire » vers le potentiel de chaque point auquel il est relié. Avec des résistances identiques, il se met à la <b>moyenne</b> : \\((0 + 0 + 9)/3 = 3\\) V.</p>
            <p>D'où ça vient : loi des nœuds en A, avec le courant de chaque branche \\(\\dfrac{V_k - V_A}{R_k}\\) (Ohm) : \\(\\sum \\dfrac{V_k - V_A}{R_k} = 0\\). On isole \\(V_A\\) :</p>\\[V_A = \\frac{\\sum V_k / R_k}{\\sum 1/R_k}\\]
            <p>C'est une moyenne des \\(V_k\\) avec des poids \\(1/R_k\\) : une petite résistance tire plus fort.</p>`,
          ask: { q: 'A est relié à 12 V par \\(R\\) et à 0 V par \\(2R\\). \\(V_A\\) = ?', items: [N('\\(V_A\\)', 8, 'V')],
            why: '\\(V_A = \\dfrac{12/R + 0/(2R)}{1/R + 1/(2R)} = \\dfrac{12}{1{,}5} = 8\\) V : plus près de 12 V, car la branche vers 12 V a la plus petite résistance.' } },
        { h: 'Branches avec un générateur',
          body: `<p>Une branche « générateur \\(E\\) + résistance \\(R\\) » vers la ligne du bas (0 V) : le point au bout de \\(R\\) est à \\(+E\\) si le \\(+\\) du générateur est côté A, et à \\(-E\\) s'il est retourné. Elle apporte donc \\(\\pm\\dfrac{E}{R}\\) au numérateur et \\(\\dfrac{1}{R}\\) au dénominateur.</p>
            <p>Une branche avec seulement une résistance vers le 0 V apporte \\(0\\) en haut, mais <b>bien \\(1/R\\) en bas</b> : c'est l'oubli classique.</p>`,
          ask: { q: 'Trois branches entre A et la masse : \\(E_1 = 6\\) V + R (\\(+\\) côté A), R seule, \\(E_2 = 3\\) V + R (\\(+\\) côté A). \\(V_A\\) = ?', items: [N('\\(V_A\\)', 3, 'V')],
            why: '\\(V_A = \\dfrac{6/R + 0/R + 3/R}{3/R} = \\dfrac{9}{3} = 3\\) V. La branche sans générateur compte bien dans le dénominateur.' } },
        { h: 'Puis le courant, par la loi d\'Ohm',
          body: `<p>Une fois \\(V_A\\) connu, le courant d'une branche vient tout seul : pour une branche « \\(E\\) + \\(R\\) » avec le courant fléché vers A, \\(R\\,I = E - V_A\\). Pour une résistance seule vers le 0 V avec le courant fléché de A vers le bas, \\(R\\,I = V_A - 0\\).</p>`,
          ask: { q: 'Dans l\'exemple précédent (\\(V_A = 3\\) V, \\(R = 1\\) kΩ), courant fourni par la branche de \\(E_1 = 6\\) V vers A ?', items: [N('\\(I_1\\)', 3, 'mA')], why: '\\(R\\,I_1 = E_1 - V_A = 6 - 3 = 3\\) V, donc \\(I_1 = 3\\) mA.' } }
      ] },

      mi2: { title: 'Millman en littéral', meth: 'écris chaque terme \\(\\pm E/R\\) et \\(1/R\\), puis multiplie le haut et le bas par le même facteur (par exemple \\(2R\\)) pour faire disparaître les fractions.', steps: [
        { h: 'Faire disparaître les R',
          guess: { q: 'Branches : \\(E_1\\) + R, R seule, \\(E_2\\) + R (tous les \\(+\\) côté A). \\(V_A\\) = ?', items: [C('\\(V_A\\)', [['a', '\\(\\dfrac{E_1 + E_2}{2}\\)'], ['b', '\\(\\dfrac{E_1 + E_2}{3}\\)'], ['c', '\\(E_1 + E_2\\)']], 'b')] },
          body: `<p>\\(V_A = \\dfrac{E_1/R + 0 + E_2/R}{3/R}\\). On multiplie haut et bas par \\(R\\) : \\(V_A = \\dfrac{E_1 + E_2}{3}\\). Les \\(R\\) disparaissent toujours d'un résultat de tension : un potentiel ne peut pas dépendre de l'unité choisie pour les résistances.</p>
            <p>Avec des valeurs différentes, on multiplie par le plus petit multiple commun. Branches \\(E_1\\) + \\(R\\), rien + \\(2R\\), \\(E_2\\) + \\(2R\\) : \\(\\dfrac{E_1/R + E_2/(2R)}{1/R + 1/(2R) + 1/(2R)}\\), multiplié par \\(2R\\) : \\(V_A = \\dfrac{2E_1 + E_2}{4}\\).</p>`,
          ask: { q: 'Branches : \\(E\\) + \\(R\\) (\\(+\\) côté A) et \\(2R\\) seule vers la masse. \\(V_A\\) = ?', items: [C('\\(V_A\\)', [['a', '\\(\\dfrac{E}{2}\\)'], ['b', '\\(\\dfrac{2E}{3}\\)'], ['c', '\\(\\dfrac{E}{3}\\)']], 'b')],
            why: '\\(\\dfrac{E/R}{1/R + 1/(2R)}\\) ; fois \\(2R\\) : \\(\\dfrac{2E}{2 + 1} = \\dfrac{2E}{3}\\). C\'est aussi le pont diviseur \\(\\dfrac{2R}{R + 2R}E\\) : les deux méthodes concordent.' } },
        { h: 'Vérifier l\'homogénéité',
          body: `<p>Un potentiel s'écrit toujours (combinaison de \\(E\\)) / (nombre) ; un courant, (combinaison de \\(E\\)) / (nombre \\(\\times R\\)). Si ton \\(V_A\\) contient un \\(R\\) qui traîne, il y a une erreur : vérifie avant l'AN.</p>`,
          ask: { q: 'Tu trouves \\(V_A = \\dfrac{E_1 + E_2}{3R}\\). C\'est :', items: [C('réponse', [['ok', 'possible'], ['ko', 'forcément faux : ce n\'est pas une tension']], 'ko')], why: 'Des volts divisés par des ohms donnent des ampères, pas des volts : il manque une simplification par \\(R\\).' } }
      ] },

      /* =================== Exercices complets =================== */
      x3a: { title: 'Ex 3 : deux générateurs, la stratégie', meth: 'Q1 un courant par branche + tensions fléchées ; Q2 deux lois des mailles, la loi des nœuds en A et Ohm ; Q3 exprime les deux autres courants en fonction de celui de la branche sans générateur, remplace dans la loi des nœuds ; Q5 Millman pour vérifier.', steps: [
        { h: 'Le plan de l\'Ex 3, et pourquoi il marche',
          body: `<p>Trois branches entre deux nœuds A et B (en bas), deux générateurs. Trois courants inconnus \\(I_1, I_2, I\\) : il faut trois équations.</p>
            <ol><li>Flécher : un courant par branche, puis les tensions (récepteur sur les résistances, vers le \\(+\\) sur les générateurs).</li>
            <li>Deux mailles : chacune contient la branche sans générateur. Elles donnent \\(I_1\\) et \\(I_2\\) en fonction de \\(I\\).</li>
            <li>Loi des nœuds en A : \\(I_1 + I_2 = I\\) (selon tes flèches). On remplace : une équation avec \\(I\\) seul.</li>
            <li>On réinjecte pour avoir \\(I_1\\) et \\(I_2\\), puis AN en mA.</li></ol>`,
          ask: { q: 'Pourquoi exprimer \\(I_1\\) et \\(I_2\\) en fonction de \\(I\\) (le courant de la branche sans générateur) ?', items: [C('réponse', [['a', 'parce que chaque maille contient cette branche, donc chaque maille relie \\(I\\) à un autre courant'], ['b', 'parce que \\(I\\) est toujours le plus grand'], ['c', 'c\'est imposé par le prof, sans raison']], 'a')],
            why: 'Chaque maille passe par la branche du milieu : elle donne directement \\(I_1\\) (ou \\(I_2\\)) en fonction de \\(I\\).' } },
        { h: 'Un exemple court',
          guess: { q: 'Branches : \\(E_1 = 8\\) V + R, R seule (courant \\(I\\) vers le bas), \\(E_2 = 8\\) V + R. Avec \\(R = 1\\) kΩ, \\(I\\) = ?', items: [N('\\(I\\)', 16 / 3, 'mA', 0.02)] },
          body: `<p>Maille de gauche : \\(E_1 - R I_1 - R I = 0\\), donc \\(I_1 = \\dfrac{E_1 - R I}{R}\\). De même \\(I_2 = \\dfrac{E_2 - R I}{R}\\).</p>
            <p>Nœud : \\(I_1 + I_2 = I\\), donc \\(E_1 + E_2 - 2R I = R I\\), \\(I = \\dfrac{E_1 + E_2}{3R} = \\dfrac{16}{3}\\) mA ≈ 5,33 mA.</p>
            <p>Vérification par Millman : \\(V_A = \\dfrac{E_1 + E_2}{3} = \\dfrac{16}{3}\\) V et \\(R I = V_A\\) : même résultat.</p>`,
          ask: { q: 'Dans cet exemple, que vaut \\(I_1\\) ?', items: [N('\\(I_1\\)', 8 / 3, 'mA', 0.02)], why: '\\(I_1 = \\dfrac{E_1 - R I}{R} = 8 - \\dfrac{16}{3} = \\dfrac{8}{3}\\) ≈ 2,67 mA ; et \\(I_1 + I_2 = 2\\times\\dfrac{8}{3} = \\dfrac{16}{3} = I\\) : la loi des nœuds est vérifiée.' } }
      ] },

      x4: { title: 'Ex 4 : un circuit avec une charge', meth: 'simplifie d\'abord : la résistance du milieu en parallèle avec la branche de \\(R_L\\) donne \\(R_{eq}\\) ; pont diviseur pour \\(U\\) (ou Millman au nœud du haut), puis pont diviseur entre la résistance en série avec \\(R_L\\) et \\(R_L\\).', steps: [
        { h: 'Pourquoi on ne peut pas aller directement à R_L',
          guess: { q: 'Générateur \\(E\\), puis \\(R\\) en série, puis au nœud du haut deux branches : \\(R\\) seule et \\(R_L\\). Peut-on écrire \\(U_L = \\dfrac{R_L}{R + R_L}E\\) ?', items: [C('réponse', [['o', 'oui'], ['n', 'non']], 'n')] },
          body: `<p>Non : une partie du courant part dans la branche du milieu, le courant dans \\(R\\) et dans \\(R_L\\) n'est pas le même. La méthode :</p>
            <ol><li>Regrouper les deux branches en parallèle : \\(R_{eq} = R \\parallel R_L = \\dfrac{R R_L}{R + R_L}\\).</li>
            <li>Maintenant \\(R\\) et \\(R_{eq}\\) sont en série : pont diviseur \\(U = \\dfrac{R_{eq}}{R + R_{eq}}E\\).</li>
            <li>\\(U\\) est la tension aux bornes de \\(R_L\\) (même nœuds) : \\(U_L = U\\).</li></ol>`,
          ask: { q: 'Avec \\(R_L = R\\) dans ce circuit, \\(U_L\\) = ?', items: [C('\\(U_L\\)', [['a', '\\(E/2\\)'], ['b', '\\(E/3\\)'], ['c', '\\(2E/3\\)']], 'b')],
            why: '\\(R_{eq} = R/2\\), puis \\(U = \\dfrac{R/2}{R + R/2}E = \\dfrac{1}{3}E\\).' } },
        { h: 'Le cas R_L = kR',
          body: `<p>La dernière question remplace \\(R_L\\) par \\(kR\\) dans le résultat général et simplifie par \\(R\\) : il reste un nombre fois \\(E\\) (tension) ou fois \\(E/R\\) (courant). Puis l'AN. « Simplifier au maximum » veut dire : plus aucun \\(R\\) ni \\(R_L\\) dans la réponse finale.</p>`,
          ask: { q: 'Résultat général \\(U_L = \\dfrac{R_L}{R + 2R_L}E\\). Avec \\(R_L = 2R\\) :', items: [C('\\(U_L\\)', [['a', '\\(\\dfrac{2}{5}E\\)'], ['b', '\\(\\dfrac{2}{3}E\\)'], ['c', '\\(\\dfrac{1}{2}E\\)']], 'a')], why: '\\(\\dfrac{2R}{R + 4R}E = \\dfrac{2}{5}E\\).' } }
      ] },

      x3b: { title: 'Ex 3 niveau CC : rédiger et vérifier', meth: 'même plan que l\'Ex 3 simple ; vérifie l\'homogénéité (un courant = combinaison de \\(E\\) / (nombre × R)) et la loi des nœuds sur tes valeurs numériques avant de rendre.', steps: [
        { h: 'Les points faciles qu\'on perd',
          body: `<ul><li>Le schéma fléché <b>recopié</b> (Q1) : courants nommés, tensions dans la bonne convention.</li><li>La loi d'Ohm écrite <b>sur le schéma</b>, à côté de chaque résistance (\\(U_1 = R I_1\\)…).</li><li>Les résultats littéraux <b>encadrés</b> avant l'AN, l'AN avec l'unité (mA).</li><li>La vérification : \\(I_1 + I_2 = I\\) sur les nombres.</li></ul>
            <p>Une résistance dessinée sur le fil du haut appartient à la branche de son côté : elle est en série avec le reste de cette branche.</p>`,
          ask: { q: 'Tu trouves \\(I_1 = 2\\) mA, \\(I_2 = 1\\) mA et \\(I = 4\\) mA avec \\(I_1 + I_2 = I\\) attendu. Conclusion ?', items: [C('réponse', [['ok', 'c\'est bon'], ['ko', 'il y a une erreur quelque part']], 'ko')], why: '\\(2 + 1 \\ne 4\\) : la loi des nœuds n\'est pas vérifiée, donc un calcul est faux. Trente secondes de vérification qui sauvent des points.' } }
      ] },

      lad3: { title: 'Ex 2 costaud : redessiner', meth: 'redessine le réseau en échelle bien droit (ligne du haut, ligne du bas), repère les nœuds en suivant les fils, puis applique la méthode du bout, une étape à la fois.', steps: [
        { h: 'Redessiner avant de calculer',
          body: `<p>Quand le schéma est tordu, perds une minute à le <b>redessiner</b> : une ligne du haut, une ligne du bas, les branches verticales entre les deux, dans l'ordre. Ensuite, la méthode du bout ne change pas.</p>
            <p>Garde chaque résultat intermédiaire en multiple de \\(R\\) (par exemple \\(\\dfrac{6R}{5}\\)) : avec des fractions, une erreur se voit tout de suite.</p>`,
          ask: { q: '\\(2R \\parallel 3R\\) = ?', items: [C('réponse', [['a', '\\(\\dfrac{6R}{5}\\)'], ['b', '\\(5R\\)'], ['c', '\\(\\dfrac{5R}{6}\\)']], 'a')], why: 'Produit sur somme : \\(\\dfrac{6R^2}{5R} = \\dfrac{6R}{5}\\), plus petit que \\(2R\\) comme il se doit.' } }
      ] },

      x3c: { title: 'Les pièges : générateur retourné, courant négatif', meth: 'un générateur dont le \\(+\\) est en bas compte avec un signe \\(-\\) dans les mailles et dans Millman ; un courant négatif circule simplement dans l\'autre sens.', steps: [
        { h: 'Générateur retourné',
          guess: { q: 'Branche \\(E_2\\) + \\(R\\) avec le \\(+\\) de \\(E_2\\) vers la ligne du bas. Dans Millman, elle apporte au numérateur :', items: [C('réponse', [['p', '\\(+E_2/R\\)'], ['m', '\\(-E_2/R\\)'], ['0', '0']], 'm')] },
          body: `<p>En partant du 0 V et en montant dans la branche, on traverse le générateur du \\(+\\) vers le \\(-\\) : on <b>descend</b> de \\(E_2\\). Le point en haut de la branche est donc à \\(-E_2\\), d'où le terme \\(-\\dfrac{E_2}{R}\\). Dans les mailles, sa tension est fléchée vers le bas : elle compte avec le signe opposé.</p>`,
          ask: { q: 'Branches : \\(E\\) + R (\\(+\\) côté A), R seule, \\(E\\) + R retourné. \\(V_A\\) = ?', items: [N('\\(V_A\\)', 0, 'V')], why: '\\(\\dfrac{E/R + 0 - E/R}{3/R} = 0\\) : les deux générateurs se compensent.' } }
      ] },

      thv: { title: 'Le générateur de Thévenin', meth: 'enlève \\(R_L\\) : \\(E_{th}\\) = tension à vide entre ses bornes (pont diviseur ou Millman), \\(R_{th}\\) = résistance vue de ses bornes, générateurs éteints (remplacés par des fils) ; puis \\(U_L = \\dfrac{R_L}{R_{th} + R_L}E_{th}\\).', steps: [
        { h: 'Vu de la charge, tout circuit est une pile',
          guess: { q: 'On remplace tout un circuit (générateurs + résistances), vu depuis deux bornes, par :', items: [C('réponse', [['a', 'une seule résistance'], ['b', 'un générateur \\(E_{th}\\) en série avec une résistance \\(R_{th}\\)'], ['c', 'un seul générateur']], 'b')] },
          body: `<p>Théorème de Thévenin : vu de deux bornes, n'importe quel circuit de générateurs et de résistances se comporte comme un générateur \\(E_{th}\\) en série avec une résistance \\(R_{th}\\). C'est ce qu'est une vraie pile : une tension, et une résistance interne.</p>
            <ul><li>\\(E_{th}\\) : la tension entre les bornes <b>à vide</b> (rien de branché).</li><li>\\(R_{th}\\) : la résistance vue des bornes quand on <b>éteint</b> les générateurs (un générateur de tension éteint devient un fil).</li></ul>
            <p>Ensuite, avec la charge : un simple pont diviseur, \\(U_L = \\dfrac{R_L}{R_{th} + R_L}E_{th}\\).</p>`,
          ask: { q: 'Générateur \\(E\\), \\(R\\) en série, puis \\(R\\) vers la masse ; les bornes sont aux bornes de cette dernière \\(R\\). \\(R_{th}\\) = ?', items: [C('\\(R_{th}\\)', [['a', '\\(2R\\)'], ['b', '\\(R/2\\)'], ['c', '\\(R\\)']], 'b')],
            why: 'Générateur éteint = fil : les deux \\(R\\) relient les deux bornes, elles sont en parallèle, \\(R/2\\). Et \\(E_{th} = E/2\\) (pont diviseur à vide).' } }
      ] }
    };
    /* ---------- Schémas de circuits « à deux rails » (fil du haut, ligne du bas à 0 V) ----------
       br : branches verticales { x, els: [{ k: 'R' | 'E', lab }] } ; top : résistances sur le fil du haut
       { x1, x2, lab } ; ab : bornes A (haut) et B (bas) à gauche ; w : largeur */
    const RVb = (x, yc, lab) => `<rect x="${x - 8}" y="${yc - 18}" width="16" height="36" style="${LINE};fill:var(--sheet)"/><text x="${x + 13}" y="${yc + 5}" style="${INK}">${lab}</text>`;
    const GVb = (x, yc, lab) => `<circle cx="${x}" cy="${yc}" r="14" style="${LINE};fill:var(--sheet)"/><line x1="${x}" y1="${yc - 9}" x2="${x}" y2="${yc + 9}" style="${LINE}"/><text x="${x - 16}" y="${yc - 14}" style="${INK};font-size:14px">+</text><text x="${x + 19}" y="${yc + 5}" style="${INK}">${lab}</text>`;
    function rail(o) {
      const xs = o.br.map(b => b.x), x0 = o.ab ? 30 : Math.min(...xs), x1 = Math.max(...xs), Y1 = 40, Y2 = 170, w = o.w || 420;
      let s = W(x0, Y1, x1, Y1) + W(x0, Y2, x1, Y2);
      o.br.forEach(b => {
        s += W(b.x, Y1, b.x, Y2);
        const n = b.els.length;
        b.els.forEach((e, i) => { const yc = n === 1 ? (Y1 + Y2) / 2 : Y1 + (Y2 - Y1) * (i + 1) / (n + 1); s += e.k === 'E' ? GVb(b.x, yc, e.lab) : RVb(b.x, yc, e.lab); });
      });
      (o.top || []).forEach(t => { const xm = (t.x1 + t.x2) / 2; s += `<rect x="${xm - 18}" y="${Y1 - 8}" width="36" height="16" style="${LINE};fill:var(--sheet)"/><text x="${xm}" y="${Y1 - 14}" text-anchor="middle" style="${INK}">${t.lab}</text>`; });
      if (o.ab) s += `<circle cx="${x0}" cy="${Y1}" r="4" style="${LINE};fill:var(--sheet)"/><circle cx="${x0}" cy="${Y2}" r="4" style="${LINE};fill:var(--sheet)"/><text x="${x0 - 6}" y="${Y1 + 22}" text-anchor="end" style="${INK}">A</text><text x="${x0 - 6}" y="${Y2 - 8}" text-anchor="end" style="${INK}">B</text>`;
      (o.nodes || []).forEach(([x, lab]) => { s += dot(x, Y1) + `<text x="${x}" y="${Y1 - 14}" text-anchor="middle" style="${INK};font-weight:600">${lab}</text>`; });
      if (o.gnd) s += `<text x="${x1 + 8}" y="${Y2 + 5}" style="${INK};font-size:13px">0 V</text>`;
      return `<svg class="lfig" viewBox="0 0 ${w} 200" role="img" aria-label="${o.alt || 'schéma du circuit'}">${s}</svg>`;
    }
    const R = lab => ({ k: 'R', lab }), E = lab => ({ k: 'E', lab });
    const guided = '<p class="fine">Calcul guidé : fais-le sur ta feuille, étape par étape, puis tape les résultats intermédiaires.</p>';

    /* ---------- Étapes ajoutées : schémas et calculs guidés, à la suite des étapes de chaque leçon ---------- */
    const MORE = {
      ohm: [
        { h: 'Calcul guidé : un générateur et une résistance',
          body: `${rail({ br: [{ x: 120, els: [E('12 V')] }, { x: 300, els: [R('4 kΩ')] }], alt: 'un générateur de 12 V branché sur une résistance de 4 kΩ' })}${guided}
            <ol><li>La résistance est branchée directement aux bornes du générateur : elle a <b>toute</b> sa tension, \\(U = 12\\) V.</li><li>Loi d'Ohm : \\(I = U/R\\), en V et kΩ pour avoir des mA.</li><li>Si on remplace la résistance par une deux fois plus grande, que devient le courant ?</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(I\\)', 3, 'mA'), N('\\(I\\) avec 8 kΩ', 1.5, 'mA')], why: '\\(I = 12/4 = 3\\) mA ; avec 8 kΩ, \\(12/8 = 1{,}5\\) mA : deux fois moins de passage, deux fois moins de débit.' } }
      ],
      conv: [
        { h: 'Calcul guidé : flécher puis calculer',
          body: `${rail({ br: [{ x: 120, els: [E('9 V')] }, { x: 300, els: [R('3 kΩ')] }], alt: 'un générateur de 9 V et une résistance de 3 kΩ' })}${guided}
            <ol><li>On flèche \\(I\\) sortant du \\(+\\) du générateur (convention générateur) : il descend dans la résistance, qu'on flèche en récepteur, tension \\(U\\) vers le haut.</li><li>La résistance a la tension du générateur : \\(U = 9\\) V, donc \\(I = U/R\\).</li><li>Un camarade a fléché \\(I'\\) dans l'autre sens. Que trouve-t-il ?</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(I\\)', 3, 'mA'), N("\\(I'\\)", -3, 'mA')], why: '\\(I = 9/3 = 3\\) mA. Fléché dans l\'autre sens, le même courant vaut \\(I\' = -3\\) mA : le signe dit seulement que la flèche est à l\'envers.' } }
      ],
      as2: [
        { h: 'Calcul guidé : série et parallèle mélangés',
          body: `${rail({ ab: true, br: [{ x: 220, els: [R('3 kΩ')] }, { x: 360, els: [R('6 kΩ')] }], top: [{ x1: 30, x2: 220, lab: '2 kΩ' }], alt: 'entre A et B : 2 kΩ en série avec 3 kΩ et 6 kΩ en parallèle' })}${guided}
            <ol><li>Les deux résistances verticales relient les deux mêmes fils : elles sont en <b>parallèle</b>. Produit sur somme.</li><li>Ce groupe est traversé par tout le courant venant de la 2 kΩ : il est en <b>série</b> avec elle. On additionne.</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(3 \\parallel 6\\)', 2, 'kΩ'), N('\\(R_{AB}\\)', 4, 'kΩ')], why: '\\(\\dfrac{3\\times6}{9} = 2\\) kΩ, puis \\(2 + 2 = 4\\) kΩ.' } }
      ],
      asn: [
        { h: 'Calcul guidé : trois branches d\'un coup',
          body: `${rail({ ab: true, br: [{ x: 180, els: [R('4R')] }, { x: 270, els: [R('4R')] }, { x: 360, els: [R('2R')] }], top: [{ x1: 30, x2: 180, lab: 'R' }], alt: 'R en série avec trois branches 4R, 4R et 2R en parallèle' })}${guided}
            <ol><li>Les deux \\(4R\\) identiques d'abord : \\(4R/2\\).</li><li>Le résultat avec la \\(2R\\) : encore deux résistances égales.</li><li>Puis la \\(R\\) du haut, en série.</li></ol>`,
          ask: { q: 'Résultats (en multiples de \\(R\\)) :', items: [N('\\(4R \\parallel 4R \\parallel 2R\\) (en R)', 1), N('\\(R_{AB}\\) (en R)', 2)], why: '\\(4R \\parallel 4R = 2R\\), puis \\(2R \\parallel 2R = R\\), plus \\(R\\) en série : \\(2R\\).' } }
      ],
      lad1: [
        { h: 'Calcul guidé : une échelle complète',
          body: `${rail({ ab: true, br: [{ x: 160, els: [R('6R')] }, { x: 290, els: [R('6R')] }, { x: 400, els: [R('R')] }], top: [{ x1: 30, x2: 160, lab: 'R' }, { x1: 160, x2: 290, lab: 'R' }, { x1: 290, x2: 400, lab: '2R' }], w: 440, alt: 'réseau en échelle de trois étages' })}${guided}
            <ol><li>Au bout : la \\(R\\) verticale et la \\(2R\\) horizontale juste avant sont en série.</li><li>Ce groupe est en parallèle avec la \\(6R\\) verticale du milieu.</li><li>Puis en série avec la \\(R\\) horizontale du milieu, en parallèle avec la \\(6R\\) côté A, et enfin en série avec la \\(R\\) côté A.</li></ol>`,
          ask: { q: 'Étapes (en multiples de \\(R\\)) :', items: [N('étape 1', 3), N('étape 2', 2), N('\\(R_{AB}\\)', 3)], why: '\\(R + 2R = 3R\\) ; \\(3R \\parallel 6R = \\dfrac{18}{9}R = 2R\\) ; \\(2R + R = 3R\\) ; \\(3R \\parallel 6R = 2R\\) ; plus \\(R\\) côté A : \\(R_{AB} = 3R\\). Chaque étage : une série, puis une parallèle.' } }
      ],
      nd: [
        { h: 'Calcul guidé : un nœud à quatre branches',
          body: `<p>Au nœud A arrivent (d'après les flèches) \\(I_1 = 5\\) mA et \\(I_2\\) ; en partent \\(I_3 = 2\\) mA et \\(I_4 = 6\\) mA.</p>${guided}
            <ol><li>Écris la loi : entrants = sortants.</li><li>Isole \\(I_2\\).</li><li>Le signe te dit si \\(I_2\\) entre vraiment.</li></ol>`,
          ask: { q: 'Résultat :', items: [N('\\(I_2\\)', 3, 'mA')], why: '\\(5 + I_2 = 2 + 6\\), donc \\(I_2 = 3\\) mA, positif : il entre bien dans A.' } }
      ],
      ml: [
        { h: 'Calcul guidé : deux mailles',
          body: `${rail({ br: [{ x: 90, els: [E('10 V')] }, { x: 230, els: [R('U₂')] }, { x: 370, els: [R('U₃')] }], top: [{ x1: 90, x2: 230, lab: 'U₁' }], alt: 'générateur de 10 V, une résistance en haut de tension U1, puis deux résistances en parallèle de tensions U2 et U3' })}${guided}
            <p>On connaît \\(U_1 = 4\\) V (fléchée en récepteur). Les tensions \\(U_2\\) et \\(U_3\\) sont fléchées vers le haut.</p>
            <ol><li>Maille de gauche (générateur, \\(U_1\\), \\(U_2\\)) : \\(E - U_1 - U_2 = 0\\).</li><li>Maille de droite (\\(U_2\\) et \\(U_3\\)) : \\(U_2 - U_3 = 0\\). Deux branches en parallèle ont la même tension !</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(U_2\\)', 6, 'V'), N('\\(U_3\\)', 6, 'V')], why: '\\(U_2 = 10 - 4 = 6\\) V et \\(U_3 = U_2 = 6\\) V : la loi des mailles redémontre que deux branches en parallèle ont la même tension.' } }
      ],
      loop: [
        { h: 'Calcul guidé : courant et tensions d\'une maille',
          body: `${rail({ br: [{ x: 110, els: [E('12 V')] }, { x: 330, els: [R('3 kΩ')] }], top: [{ x1: 110, x2: 330, lab: '1 kΩ' }], alt: 'un générateur de 12 V, une résistance de 1 kΩ en haut et une de 3 kΩ' })}${guided}
            <ol><li>Une seule maille : \\(I = \\dfrac{E}{R_1 + R_2}\\).</li><li>Puis chaque tension par la loi d'Ohm.</li><li>Vérifie : les deux tensions additionnées redonnent \\(E\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(I\\)', 3, 'mA'), N('\\(U_{3k}\\)', 9, 'V'), N('\\(U_{1k}\\)', 3, 'V')], why: '\\(I = 12/4 = 3\\) mA ; \\(U_{3k} = 9\\) V, \\(U_{1k} = 3\\) V, total 12 V.' } }
      ],
      pdt: [
        { h: 'Calcul guidé : pont diviseur puis charge',
          body: `${rail({ br: [{ x: 90, els: [E('12 V')] }, { x: 300, els: [R('2 kΩ')] }], top: [{ x1: 90, x2: 300, lab: '1 kΩ' }], nodes: [[300, 'S']], alt: 'générateur de 12 V, 1 kΩ en haut, 2 kΩ vers la masse, sortie S' })}${guided}
            <ol><li>Sans charge : pont diviseur, \\(U_S = \\dfrac{2}{1 + 2}\\times12\\).</li><li>On branche maintenant une charge de 2 kΩ entre S et la masse. Elle est en parallèle avec la 2 kΩ : regroupe-les d'abord.</li><li>Nouveau pont diviseur avec cette résistance équivalente.</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(U_S\\) à vide', 8, 'V'), N('\\(U_S\\) avec la charge', 6, 'V')], why: 'À vide : \\(8\\) V. Avec la charge : \\(2 \\parallel 2 = 1\\) kΩ, puis \\(\\dfrac{1}{1 + 1}\\times12 = 6\\) V. La charge fait baisser la tension : c\'est pour ça qu\'on ne peut pas appliquer le pont diviseur directement.' } }
      ],
      pdc: [
        { h: 'Calcul guidé : trois branches',
          body: `<p>6 mA se partagent entre trois branches en parallèle : 1 kΩ, 2 kΩ et 2 kΩ.</p>${guided}
            <ol><li>Les poids sont les \\(1/R\\) : 1, 1/2, 1/2 (en kΩ⁻¹). Leur somme ?</li><li>\\(I_k = \\dfrac{1/R_k}{\\sum 1/R}\\,I\\).</li><li>Vérifie : la somme des trois courants redonne 6 mA.</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(I_{1k}\\)', 3, 'mA'), N('\\(I_{2k}\\) (chacune)', 1.5, 'mA')], why: 'Somme des poids : 2. \\(I_{1k} = \\dfrac{1}{2}\\times6 = 3\\) mA, et \\(\\dfrac{1/2}{2}\\times6 = 1{,}5\\) mA dans chaque 2 kΩ : \\(3 + 1{,}5 + 1{,}5 = 6\\).' } }
      ],
      mi1: [
        { h: 'Calcul guidé : Millman sur un vrai circuit',
          body: `${rail({ br: [{ x: 90, els: [R('1 kΩ'), E('6 V')] }, { x: 230, els: [R('2 kΩ')] }, { x: 370, els: [R('2 kΩ'), E('4 V')] }], nodes: [[230, 'A']], gnd: true, alt: 'trois branches entre A et la masse : 1 kΩ et 6 V, 2 kΩ seule, 2 kΩ et 4 V' })}${guided}
            <ol><li>0 V sur la ligne du bas. Les deux générateurs ont leur \\(+\\) côté A.</li><li>Numérateur : \\(\\dfrac{6}{1} + \\dfrac{0}{2} + \\dfrac{4}{2}\\). Dénominateur : \\(\\dfrac11 + \\dfrac12 + \\dfrac12\\).</li><li>Puis le courant dans la 2 kΩ seule, de A vers le bas : \\(V_A / 2\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [N('numérateur', 8), N('\\(V_A\\)', 4, 'V'), N('\\(I\\) dans la 2 kΩ seule', 2, 'mA')], why: 'Numérateur \\(6 + 0 + 2 = 8\\), dénominateur \\(2\\) : \\(V_A = 4\\) V. Courant \\(4/2 = 2\\) mA vers le bas.' } }
      ],
      mi2: [
        { h: 'Calcul guidé : Millman puis un courant, en littéral',
          body: `<p>Branches entre A et la masse : \\(E\\) + \\(R\\), \\(2R\\) seule, \\(2E\\) + \\(2R\\) (tous les \\(+\\) côté A).</p>${guided}
            <ol><li>Écris \\(V_A\\) avec les termes \\(E/R\\), \\(0/2R\\), \\(2E/2R\\) et les \\(1/R\\).</li><li>Multiplie haut et bas par \\(2R\\).</li><li>Courant dans la \\(2R\\) seule : \\(V_A/(2R)\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [C('\\(V_A\\)', [['a', '\\(E\\)'], ['b', '\\(\\dfrac{4E}{3}\\)'], ['c', '\\(\\dfrac{3E}{2}\\)']], 'a'), C('\\(I\\) dans la \\(2R\\)', [['a', '\\(\\dfrac{E}{2R}\\)'], ['b', '\\(\\dfrac{E}{R}\\)'], ['c', '\\(\\dfrac{2E}{3R}\\)']], 'a')],
            why: '\\(V_A = \\dfrac{E/R + 0 + E/R}{1/R + 1/(2R) + 1/(2R)} = \\dfrac{2E/R}{2/R} = E\\). Puis \\(I = \\dfrac{E}{2R}\\) : une tension divisée par une résistance, c\'est bien homogène à un courant.' } }
      ],
      x3a: [
        { h: 'Calcul guidé : l\'Ex 3 de A à Z',
          body: `${rail({ br: [{ x: 90, els: [R('R'), E('E₁')] }, { x: 230, els: [R('R')] }, { x: 370, els: [R('R'), E('E₂')] }], nodes: [[230, 'A']], gnd: true, alt: 'trois branches : R et E1, R seule, R et E2' })}${guided}
            <p>\\(E_1 = 12\\) V, \\(E_2 = 6\\) V, \\(R = 1\\) kΩ. \\(I_1\\) et \\(I_2\\) montent vers A dans les branches des générateurs, \\(I\\) descend dans la branche du milieu.</p>
            <ol><li>Maille gauche : \\(E_1 - R I_1 - R I = 0\\) ; maille droite : \\(E_2 - R I_2 - R I = 0\\).</li><li>Nœud A : \\(I_1 + I_2 = I\\). On remplace : \\(E_1 + E_2 - 2RI = RI\\).</li><li>Puis \\(I_1\\) et \\(I_2\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(I\\)', 6, 'mA'), N('\\(I_1\\)', 6, 'mA'), N('\\(I_2\\)', 0, 'mA')], why: '\\(I = \\dfrac{E_1 + E_2}{3R} = \\dfrac{18}{3} = 6\\) mA ; \\(I_1 = 12 - 6 = 6\\) mA ; \\(I_2 = 6 - 6 = 0\\) : aucun courant dans la branche de \\(E_2\\) (le point A est justement à 6 V). Vérification : \\(6 + 0 = 6\\).' } }
      ],
      x4: [
        { h: 'Calcul guidé : la charge, en nombres',
          body: `${rail({ br: [{ x: 70, els: [E('E')] }, { x: 230, els: [R('R')] }, { x: 380, els: [R('R_L')] }], top: [{ x1: 70, x2: 230, lab: 'R' }, { x1: 230, x2: 380, lab: 'R' }], alt: 'générateur E, R en haut, R vers la masse, puis R en haut et la charge RL' })}${guided}
            <p>\\(E = 12\\) V, \\(R = R_L = 1\\) kΩ.</p>
            <ol><li>Branche de droite : \\(R\\) (haut) en série avec \\(R_L\\) : \\(2\\) kΩ.</li><li>En parallèle avec la \\(R\\) du milieu : \\(R_{eq}\\).</li><li>Pont diviseur : \\(U = \\dfrac{R_{eq}}{R + R_{eq}}E\\), puis \\(U_L = \\dfrac{R_L}{R + R_L}U\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(R_{eq}\\)', 2 / 3, 'kΩ'), N('\\(U\\)', 4.8, 'V'), N('\\(U_L\\)', 2.4, 'V')], why: '\\(R_{eq} = 1 \\parallel 2 = \\dfrac23\\) kΩ ; \\(U = \\dfrac{2/3}{1 + 2/3}\\times12 = \\dfrac25\\times12 = 4{,}8\\) V ; \\(U_L = \\dfrac12\\times4{,}8 = 2{,}4\\) V.' } }
      ],
      x3b: [
        { h: 'Calcul guidé : vérifier par Millman',
          body: `<p>Mêmes branches que l'Ex 3 : \\(E_1\\) + \\(R\\), \\(R\\) seule, \\(E_2\\) + \\(2R\\). \\(E_1 = 9\\) V, \\(E_2 = 6\\) V, \\(R = 1\\) kΩ.</p>${guided}
            <ol><li>Millman : \\(V_A = \\dfrac{9/1 + 0 + 6/2}{1 + 1 + 1/2}\\).</li><li>Courant dans la branche du milieu : \\(V_A/R\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(V_A\\)', 4.8, 'V'), N('\\(I\\)', 4.8, 'mA')], why: '\\(V_A = \\dfrac{12}{2{,}5} = 4{,}8\\) V et \\(I = 4{,}8\\) mA. Si tes lois de Kirchhoff donnent autre chose, une équation est fausse.' } }
      ],
      lad3: [
        { h: 'Calcul guidé : échelle avec fractions',
          body: `<p>De A vers le bout : \\(R\\) en haut, \\(2R\\) verticale, \\(R\\) en haut, puis \\(R\\) et \\(R\\) en parallèle au bout (deux verticales).</p>${guided}
            <ol><li>Le bout : \\(R \\parallel R\\).</li><li>En série avec la \\(R\\) du haut.</li><li>En parallèle avec la \\(2R\\), puis en série avec la \\(R\\) côté A.</li></ol>`,
          ask: { q: 'Étapes (en multiples de \\(R\\)) :', items: [N('bout', 0.5), N('après la série', 1.5), N('\\(R_{AB}\\)', 1 + 6 / 7)], why: '\\(R/2\\) ; \\(1{,}5R\\) ; \\(1{,}5R \\parallel 2R = \\dfrac{3R^2}{3{,}5R} = \\dfrac{6R}{7}\\) ; plus \\(R\\) : \\(\\dfrac{13R}{7} \\approx 1{,}86R\\).' } }
      ],
      x3c: [
        { h: 'Calcul guidé : un générateur retourné',
          body: `<p>Branches entre A et la masse : \\(E_1 = 12\\) V + \\(R\\) (\\(+\\) côté A), \\(R\\) seule, \\(E_2 = 3\\) V + \\(R\\) avec le \\(+\\) <b>en bas</b>. \\(R = 1\\) kΩ.</p>${guided}
            <ol><li>Millman avec \\(-E_2/R\\) pour la branche retournée.</li><li>Courant de la branche de \\(E_2\\), fléché vers A : \\(R I_2 = -E_2 - V_A\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(V_A\\)', 3, 'V'), N('\\(I_2\\)', -6, 'mA')], why: '\\(V_A = \\dfrac{12 + 0 - 3}{3} = 3\\) V. En haut de la branche de \\(E_2\\), le potentiel est \\(-3\\) V : \\(I_2 = \\dfrac{-3 - 3}{1} = -6\\) mA. Le signe moins : le courant descend en réalité dans cette branche.' } }
      ],
      thv: [
        { h: 'Calcul guidé : Thévenin puis la charge',
          body: `${rail({ br: [{ x: 70, els: [E('12 V')] }, { x: 230, els: [R('3 kΩ')] }, { x: 380, els: [R('R_L')] }], top: [{ x1: 70, x2: 230, lab: '6 kΩ' }, { x1: 230, x2: 380, lab: '1 kΩ' }], alt: 'générateur 12 V, 6 kΩ en haut, 3 kΩ vers la masse, 1 kΩ en haut puis la charge' })}${guided}
            <ol><li>\\(E_{th}\\) : on enlève \\(R_L\\) ; plus de courant dans la 1 kΩ, donc pont diviseur 6 kΩ / 3 kΩ.</li><li>\\(R_{th}\\) : générateur éteint (fil) : \\(6 \\parallel 3\\), plus la 1 kΩ en série.</li><li>Avec \\(R_L = 3\\) kΩ : \\(U_L = \\dfrac{R_L}{R_{th} + R_L}E_{th}\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [N('\\(E_{th}\\)', 4, 'V'), N('\\(R_{th}\\)', 3, 'kΩ'), N('\\(U_L\\)', 2, 'V')], why: '\\(E_{th} = \\dfrac{3}{9}\\times12 = 4\\) V ; \\(R_{th} = 2 + 1 = 3\\) kΩ ; \\(U_L = \\dfrac36\\times4 = 2\\) V.' } }
      ]
    };
    Object.entries(MORE).forEach(([k, st]) => { if (L[k]) L[k].steps.push(...st); });
    return L;
  };
})();
