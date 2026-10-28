/* =====================================================================
   Leçons « Comprendre » de l'électronique, CC2 (démonstrations, Thévenin, condensateur et bobine, circuits
   du premier ordre). Une leçon par compétence du parcours (clé = id de SK dans index.html) : l'image physique,
   une prédiction « Devine d'abord », l'explication, une question sans enjeu. meth sert d'indice dans les exercices.
   H = { Ch, Nn, Ex, K, esc } : constructeurs de questions de la page (Nn : étiquette en TeX sans délimiteurs).
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function (H) {
    const { Ch, Nn } = H;
    return {
      demos: { title: 'Les trois démonstrations, une seule idée', meth: 'schéma fléché, puis la bonne loi de Kirchhoff (nœuds pour le pont diviseur de courant et Millman, mailles pour le pont diviseur de tension), la loi d\'Ohm sur chaque résistance, on isole et on remplace.', steps: [
        { h: 'Toujours le même squelette',
          guess: { q: 'Pour démontrer le pont diviseur de courant (des résistances en parallèle), quelle loi relie le courant total aux courants des branches ?', items: [Ch('réponse', [['n', 'la loi des nœuds'], ['m', 'la loi des mailles']], 'n')] },
          body: `<p>Les trois démonstrations du CC2 ont la même structure en trois lignes :</p>
            <ol><li>une loi de Kirchhoff qui relie le « total » aux morceaux : <b>nœuds</b> (les courants s'ajoutent) ou <b>mailles</b> (les tensions s'ajoutent) ;</li>
            <li>la loi d'Ohm sur chaque résistance, pour tout écrire avec une seule inconnue commune (\\(U\\) en parallèle, \\(I\\) en série) ;</li>
            <li>on isole cette inconnue commune, et on remplace dans la loi d'Ohm de la résistance qui nous intéresse.</li></ol>
            <p>En parallèle, ce qui est commun, c'est la tension : \\(I_k = U/R_k\\), et \\(I = \\sum I_k = U\\sum 1/R_j\\). En série, c'est le courant : \\(U_k = R_k I\\) et \\(U = I\\sum R_j\\).</p>`,
          ask: { q: 'Dans le pont diviseur de tension, l\'inconnue commune à toutes les résistances est :', items: [Ch('réponse', [['i', 'le courant \\(I\\)'], ['u', 'la tension \\(U\\)']], 'i')],
            why: 'En série, le même courant traverse toutes les résistances : on l\'isole, \\(I = U/\\sum R_j\\), puis \\(U_k = R_k I\\).' } },
        { h: 'Millman : la loi des nœuds au point A',
          body: `<p>Trois branches arrivent en A, avec les courants fléchés <b>vers A</b>. Rien ne s'accumule en A : \\(I_1 + I_2 + I_3 = 0\\). Ohm sur chaque branche : \\(I_k = \\dfrac{V_k - V_A}{R_k}\\) (le courant descend de \\(V_k\\) vers \\(V_A\\)). Donc</p>\\[\\sum_k \\frac{V_k}{R_k} - V_A\\sum_k\\frac{1}{R_k} = 0 \\quad\\Longrightarrow\\quad V_A = \\frac{\\sum V_k/R_k}{\\sum 1/R_k}\\]
            <p>Le schéma avec les sens des courants est exigé : sans lui, la démonstration perd une bonne partie des points.</p>`,
          ask: { q: 'Avec tous les courants fléchés vers A, la loi des nœuds s\'écrit :', items: [Ch('réponse', [['a', '\\(I_1 + I_2 + I_3 = 0\\)'], ['b', '\\(I_1 + I_2 = I_3\\)'], ['c', '\\(I_1 = I_2 = I_3\\)']], 'a')],
            why: 'Trois flèches qui entrent et aucune qui sort : la somme des courants entrants est nulle (certains seront négatifs).' } }
      ] },

      rth: { title: 'Résistance de Thévenin : éteindre les sources', meth: 'enlève \\(R_L\\), remplace chaque source de tension par un fil, puis calcule la résistance vue des deux bornes (série, parallèle).', steps: [
        { h: 'Éteindre une source de tension, c\'est mettre un fil',
          guess: { q: 'Une source de tension éteinte (\\(E = 0\\)) se comporte comme :', items: [Ch('réponse', [['f', 'un fil'], ['o', 'un circuit ouvert (coupure)'], ['r', 'une résistance']], 'f')] },
          body: `<p>Une source de tension impose \\(U = E\\) entre ses bornes, quel que soit le courant. Éteinte, elle impose \\(U = 0\\) quel que soit le courant : c'est exactement ce que fait un <b>fil</b>. (Une source de courant éteinte impose \\(I = 0\\) : c'est une <b>coupure</b>.)</p>
            <p>\\(R_{TH}\\) mesure « la résistance que voit la charge » : on enlève \\(R_L\\), on éteint les sources, et on calcule la résistance entre les deux bornes.</p>`,
          ask: { q: 'Générateur \\(E\\) en série avec \\(R\\), puis une autre \\(R\\) vers la masse ; les bornes de sortie sont aux bornes de cette seconde \\(R\\). \\(R_{TH}\\) = ?', items: [Ch('\\(R_{TH}\\)', [['a', '\\(2R\\)'], ['b', '\\(R/2\\)'], ['c', '\\(R\\)']], 'b')],
            why: 'Source éteinte = fil : la première \\(R\\) relie aussi la borne du haut à la masse. Les deux \\(R\\) sont en parallèle entre les bornes : \\(R/2\\).' } },
        { h: 'Le circuit des annales',
          body: `<p>Trois années de suite : \\(E_1\\) avec \\(3R\\), un nœud A, deux autres branches \\(3R\\) (dont une avec \\(E_2\\)), puis une résistance \\(R\\) entre A et la borne de \\(R_L\\).</p>
            <p>Sources éteintes : les trois branches \\(3R\\) relient A à la masse, donc \\(3R\\parallel3R\\parallel3R = R\\). Puis la \\(R\\) vers la borne est en série : \\(R_{TH} = R + R = 2R\\).</p>`,
          ask: { q: 'Même circuit, mais les trois branches valent \\(2R\\) au lieu de \\(3R\\). \\(R_{TH}/R\\) = ?', items: [Nn('R_{TH}/R', 5 / 3)],
            why: '\\(2R\\parallel2R\\parallel2R = \\dfrac{2R}{3}\\), plus \\(R\\) en série : \\(\\dfrac{5R}{3}\\), soit 1,67.' } }
      ] },

      eth: { title: 'Tension de Thévenin : la tension à vide', meth: 'enlève \\(R_L\\) : aucun courant dans la résistance qui mène à la borne, donc pas de chute de tension, et \\(E_{TH} = V_A\\), calculé par Millman au nœud A.', steps: [
        { h: 'À vide, la dernière résistance ne sert à rien',
          guess: { q: 'On enlève \\(R_L\\). Quel courant traverse la résistance \\(R\\) entre le nœud A et la borne de sortie ?', items: [Ch('réponse', [['0', 'aucun'], ['a', 'le même que dans la branche de \\(E_1\\)'], ['b', 'on ne peut pas savoir']], '0')] },
          body: `<p>Sans \\(R_L\\), la borne de sortie ne mène nulle part : aucun courant ne peut traverser \\(R\\). Donc \\(U_R = R\\times 0 = 0\\) : la borne est au même potentiel que A. La tension à vide est simplement</p>\\[E_{TH} = V_A\\]
            <p>Et \\(V_A\\) se calcule par <b>Millman</b> avec les trois branches : \\(V_A = \\dfrac{E_1/3R + E_2/3R + 0/3R}{1/3R + 1/3R + 1/3R} = \\dfrac{E_1 + E_2}{3}\\).</p>`,
          ask: { q: 'Avec \\(E_1 = 6\\) V et \\(E_2 = 9\\) V dans ce circuit, \\(E_{TH}\\) = ?', items: [Nn('E_{TH}', 5, 'V')], why: '\\(E_{TH} = \\dfrac{6 + 9}{3} = 5\\) V.' } },
        { h: 'Le signe d\'une source retournée',
          body: `<p>Si \\(E_2\\) a son \\(+\\) tourné vers la masse, le haut de sa branche est à \\(-E_2\\) : son terme devient \\(-E_2/3R\\), et \\(E_{TH} = \\dfrac{E_1 - E_2}{3}\\). La branche sans source compte \\(0\\) en haut, mais bien \\(1/3R\\) en bas.</p>`,
          ask: { q: '\\(E_1 = 12\\) V, \\(E_2 = 3\\) V retournée. \\(E_{TH}\\) = ?', items: [Nn('E_{TH}', 3, 'V')], why: '\\(\\dfrac{12 - 3}{3} = 3\\) V.' } }
      ] },

      thev: { title: 'Thévenin complet : brancher la charge', meth: 'une fois \\(E_{TH}\\) et \\(R_{TH}\\) trouvés, le circuit devient une maille \\(E_{TH}\\), \\(R_{TH}\\), \\(R_L\\) : pont diviseur \\(U_L = \\dfrac{R_L}{R_{TH} + R_L}E_{TH}\\), puis l\'A.N. en simplifiant les fractions.', steps: [
        { h: 'Pourquoi Thévenin est si pratique',
          guess: { q: 'Une vraie pile de 9 V branchée sur une très petite résistance donne à ses bornes…', items: [Ch('réponse', [['9', 'toujours 9 V'], ['m', 'moins de 9 V'], ['p', 'plus de 9 V']], 'm')] },
          body: `<p>Une vraie pile a une résistance interne : quand elle débite beaucoup, une partie de la tension « se perd » dedans. Thévenin dit que <b>tout</b> circuit vu de deux bornes est une pile de ce genre : \\(E_{TH}\\) en série avec \\(R_{TH}\\).</p>
            <p>Avec la charge, il reste une seule maille, donc un pont diviseur :</p>\\[U_L = \\frac{R_L}{R_{TH} + R_L}\\,E_{TH}\\]
            <p>Avantage : si on change \\(R_L\\), on ne refait pas tout le circuit.</p>`,
          ask: { q: 'Circuit des annales : \\(R_{TH} = 2R\\), \\(E_{TH} = \\dfrac{E_1 + E_2}{3}\\). Avec \\(R_L = R\\), \\(E_1 = 6\\) V et \\(E_2 = 12\\) V, \\(U_L\\) = ?', items: [Nn('U_L', 2, 'V')],
            why: '\\(E_{TH} = 18/3 = 6\\) V et \\(U_L = \\dfrac{R}{2R + R}\\times 6 = 2\\) V.' } }
      ] },

      loi: { title: 'Condensateur et bobine : ce qui ne peut pas sauter', meth: 'condensateur \\(i = C\\,\\dfrac{du}{dt}\\) (sa tension ne peut pas sauter), bobine \\(u = L\\,\\dfrac{di}{dt}\\) (son courant ne peut pas sauter) ; \\(\\tau = RC\\) ou \\(\\tau = L/R\\), en secondes si R en Ω, C en F, L en H.', steps: [
        { h: 'Le condensateur : un réservoir de charges',
          guess: { q: 'Un condensateur est sous une tension constante depuis longtemps. Le courant qui le traverse vaut :', items: [Ch('réponse', [['0', '0'], ['max', 'le plus grand possible'], ['u', '\\(u/C\\)']], '0')] },
          body: `<p>Un condensateur stocke des charges : \\(q = C\\,u\\). Le courant, c'est le débit de charges qui arrivent : \\(i = \\dfrac{dq}{dt} = C\\,\\dfrac{du}{dt}\\).</p>
            <ul><li>Tension constante : \\(du/dt = 0\\), donc \\(i = 0\\). En continu, un condensateur est un <b>circuit ouvert</b>.</li>
            <li>Sa tension ne peut pas sauter d'un coup : il faudrait un courant infini. C'est pour ça qu'on écrit \\(u(0^+) = u(0^-)\\).</li></ul>`,
          ask: { q: 'Pour la bobine, \\(u = L\\,\\dfrac{di}{dt}\\). En continu (courant constant), une bobine se comporte comme :', items: [Ch('réponse', [['f', 'un fil'], ['o', 'un circuit ouvert']], 'f')],
            why: 'Courant constant : \\(di/dt = 0\\), donc \\(u = 0\\) quel que soit le courant : c\'est un fil. Et c\'est le <b>courant</b> d\'une bobine qui ne peut pas sauter.' } },
        { h: 'La constante de temps τ',
          body: `<p>Le produit \\(RC\\) est un temps : c'est l'échelle de temps de la charge. Même chose pour \\(L/R\\). En unités de base (Ω, F, H), \\(\\tau\\) est en secondes : \\(1\\ \\text{k}\\Omega \\times 1\\ \\mu\\text{F} = 10^{3}\\times10^{-6} = 10^{-3}\\) s = 1 ms.</p>`,
          ask: { q: '\\(R = 2\\) kΩ et \\(C = 5\\) µF. \\(\\tau\\) en ms ?', items: [Nn('\\tau\\ (\\mathrm{ms})', 10)], why: '\\(\\tau = RC = 2\\times10^{3}\\times5\\times10^{-6} = 10^{-2}\\) s = 10 ms.' } }
      ] },

      bfhf: { title: 'Basse et haute fréquence : la nature du filtre', meth: 'redessine le circuit en très basse fréquence (C → coupure, L → fil) puis en très haute fréquence (C → fil, L → coupure) ; si \\(u = e\\) en BF et \\(u = 0\\) en HF, c\'est un passe-bas ; l\'inverse, un passe-haut.', steps: [
        { h: 'Le condensateur n\'a pas le temps',
          guess: { q: 'À très haute fréquence, un condensateur se comporte comme :', items: [Ch('réponse', [['f', 'un fil'], ['o', 'un circuit ouvert']], 'f')] },
          body: `<p>À très haute fréquence, le signal change de sens si vite que le condensateur n'a pas le temps de se charger : sa tension reste presque nulle, comme un <b>fil</b>. À très basse fréquence (presque du continu), il a tout le temps de se charger, plus aucun courant ne passe : <b>circuit ouvert</b>.</p>
            <p>La bobine fait l'inverse : en BF c'est un fil, en HF elle s'oppose aux variations rapides du courant et bloque tout : circuit ouvert.</p>`,
          ask: { q: 'Circuit R puis C, sortie \\(u\\) aux bornes de C. En haute fréquence, \\(u\\) vaut :', items: [Ch('réponse', [['0', '0'], ['e', '\\(e\\)']], '0')], why: 'En HF, C est un fil : la tension à ses bornes est nulle.' } },
        { h: 'En déduire le filtre',
          body: `<p>Pour R puis C (sortie sur C) : en BF, C est ouvert, aucun courant dans R, donc \\(u = e\\) ; en HF, \\(u = 0\\). Les basses fréquences passent, les hautes sont coupées : <b>passe-bas</b>.</p>
            <p>Si la sortie est prise aux bornes de R, c'est l'inverse : en BF pas de courant donc \\(u_R = 0\\), en HF C est un fil donc \\(u_R = e\\) : <b>passe-haut</b>.</p>`,
          ask: { q: 'Circuit R puis L, sortie aux bornes de L. C\'est un :', items: [Ch('réponse', [['b', 'passe-bas'], ['h', 'passe-haut']], 'h')],
            why: 'En BF, L est un fil : \\(u_L = 0\\). En HF, L est ouverte : \\(u_L = e\\). Les hautes fréquences passent : passe-haut.' } }
      ] },

      edo: { title: 'Mettre en équation : u + τu\' = e', meth: 'loi des mailles, relation de l\'élément (\\(i = C\\,u\'\\) ou \\(u = L\\,i\'\\)), on élimine l\'autre inconnue, puis on met sous la forme \\(u + \\tau u\' = \\dots\\) en divisant pour que \\(u\\) ait le coefficient 1.', steps: [
        { h: 'Le circuit RC, ligne par ligne',
          guess: { q: 'Circuit R puis C sous \\(e(t)\\), sortie \\(u\\) sur C. Par quoi remplacer le courant \\(i\\) dans \\(e = R\\,i + u\\) ?', items: [Ch('réponse', [['a', '\\(C\\,\\dfrac{du}{dt}\\)'], ['b', '\\(\\dfrac{u}{R}\\)'], ['c', '\\(\\dfrac{e}{R}\\)']], 'a')] },
          body: `<p>Loi des mailles : \\(e = R\\,i + u\\). Le même courant traverse C : \\(i = C\\,\\dfrac{du}{dt}\\). On remplace :</p>\\[e = RC\\,\\frac{du}{dt} + u \\qquad\\text{soit}\\qquad u + \\tau\\,u' = e,\\ \\ \\tau = RC\\]
            <p>Attention, \\(i = u/R\\) serait faux : \\(u\\) est la tension aux bornes de C, pas de R.</p>`,
          ask: { q: 'Circuit L puis R, sortie \\(u\\) aux bornes de R. L\'équation est :', items: [Ch('réponse', [['a', '\\(u + \\dfrac{L}{R}u\' = e\\)'], ['b', '\\(u + RL\\,u\' = e\\)'], ['c', '\\(u + \\dfrac{R}{L}u\' = e\\)']], 'a')],
            why: '\\(e = L\\,i\' + R\\,i\\) et \\(i = u/R\\) (Ohm sur R) : \\(e = \\dfrac{L}{R}u\' + u\\), avec \\(\\tau = L/R\\).' } }
      ] },

      reponse: { title: 'Réponse à un échelon : 63 % à τ', meth: '\\(u(t) = U_1 + U_2\\,e^{-t/\\tau}\\) : \\(U_1\\) = valeur finale (régime permanent), \\(U_2\\) par la condition initiale ; charge \\(u = E(1 - e^{-t/\\tau})\\) : 63 % à \\(\\tau\\), 95 % à \\(3\\tau\\).', steps: [
        { h: 'Pourquoi une exponentielle',
          guess: { q: 'On charge un condensateur sous \\(E\\). À \\(t = \\tau\\), \\(u\\) a atteint environ :', items: [Ch('réponse', [['37', '37 % de E'], ['50', '50 % de E'], ['63', '63 % de E'], ['100', '100 % de E']], '63')] },
          body: `<p>L'équation \\(u + \\tau u' = E\\) s'écrit \\(u' = \\dfrac{E - u}{\\tau}\\) : la vitesse de charge est proportionnelle à <b>ce qui reste à faire</b>. Au début ça monte vite, puis de plus en plus lentement, comme un café qui refroidit. C'est la signature d'une exponentielle :</p>\\[u(t) = E\\left(1 - e^{-t/\\tau}\\right)\\]
            <p>À \\(t = \\tau\\) : \\(1 - e^{-1} \\approx 0{,}63\\). À \\(3\\tau\\) : 95 %. À \\(5\\tau\\) : plus de 99 %, c'est fini en pratique. La tangente à l'origine (pente \\(E/\\tau\\)) coupe la droite \\(u = E\\) à \\(t = \\tau\\) : c'est comme ça qu'on lit \\(\\tau\\) sur un graphe.</p>`,
          ask: { q: '\\(E = 10\\) V. Que vaut \\(u\\) à \\(t = \\tau\\) ?', items: [Nn('u(\\tau)', 6.3, 'V')], why: '\\(10\\times(1 - e^{-1}) \\approx 6{,}3\\) V.' } },
        { h: 'Trouver les constantes',
          body: `<p>La forme générale est \\(u(t) = U_1 + U_2\\,e^{-t/\\tau}\\). Quand \\(t \\to \\infty\\), l'exponentielle s'éteint : \\(U_1\\) est la <b>valeur finale</b> (\\(E\\) pour une charge). À \\(t = 0\\) : \\(u(0) = U_1 + U_2\\), d'où \\(U_2\\). Pour une charge depuis 0 : \\(U_2 = -E\\). Pour une décharge de \\(E\\) vers 0 : \\(U_1 = 0\\), \\(U_2 = E\\), \\(u = E\\,e^{-t/\\tau}\\).</p>`,
          ask: { q: 'Décharge de \\(E = 10\\) V vers 0. \\(u(\\tau)\\) ≈ ?', items: [Nn('u(\\tau)', 3.7, 'V')], why: '\\(10\\,e^{-1} \\approx 3{,}7\\) V : il reste 37 %.' } }
      ] },

      sinus: { title: 'Régime sinusoïdal', meth: '\\(\\omega = 2\\pi f\\), \\(T = 1/f\\) ; passe-bas du 1er ordre : amplitude \\(\\dfrac{E_0}{\\sqrt{1 + (\\omega\\tau)^2}}\\), qui vaut \\(E_0/\\sqrt2\\) à la coupure \\(\\omega_c = 1/\\tau\\).', steps: [
        { h: 'Fréquence et pulsation',
          body: `<p>\\(e(t) = E_0\\cos(\\omega t)\\) : \\(f\\) (en Hz) compte les oscillations par seconde, \\(T = 1/f\\) est la durée d'une oscillation, et la <b>pulsation</b> \\(\\omega = 2\\pi f\\) (en rad/s) compte des radians par seconde : un tour complet, c'est \\(2\\pi\\).</p>`,
          ask: { q: '\\(f = 50\\) Hz. \\(\\omega\\) ≈ ? (en rad/s)', items: [Nn('\\omega', 314, 'rad/s')], why: '\\(\\omega = 2\\pi\\times50 \\approx 314\\) rad/s.' } },
        { h: 'Ce que fait le passe-bas à un sinus',
          guess: { q: 'Un passe-bas RC reçoit un sinus de fréquence très élevée. L\'amplitude de sortie est :', items: [Ch('réponse', [['0', 'presque nulle'], ['e', 'presque \\(E_0\\)'], ['2', 'doublée']], '0')] },
          body: `<p>La sortie est un sinus de même fréquence, mais d'amplitude \\(\\dfrac{E_0}{\\sqrt{1 + (\\omega\\tau)^2}}\\). Si \\(\\omega\\tau \\ll 1\\) (lent par rapport à \\(\\tau\\)), on retrouve \\(E_0\\) ; si \\(\\omega\\tau \\gg 1\\), l'amplitude s'écrase. La frontière est la <b>coupure</b> \\(\\omega_c = 1/\\tau\\), où l'amplitude vaut \\(E_0/\\sqrt2 \\approx 0{,}71\\,E_0\\).</p>`,
          ask: { q: '\\(\\tau = 1\\) ms. Fréquence de coupure \\(f_c\\) ≈ ? (en Hz)', items: [Nn('f_c', 159, 'Hz')], why: '\\(\\omega_c = 1/\\tau = 1000\\) rad/s, \\(f_c = \\dfrac{1000}{2\\pi} \\approx 159\\) Hz.' } }
      ] }
    };
  };
})();
