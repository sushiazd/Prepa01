/* =====================================================================
   Leçons « Comprendre » de physique (mécanique du point, B. Bêche). Une leçon par compétence du parcours
   (clé = id de SK dans index.html) : ce qui se passe physiquement, une prédiction « Devine d'abord »,
   l'explication, une question sans enjeu. meth sert d'indice dans les exercices.
   H = { Ch, Nn, Ex, K, esc } : Ch(étiquette HTML, [[valeur, texte]], bonne valeur), Nn(étiquette TeX, valeur, unité).
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function (H) {
    const { Ch, Nn } = H;
    const L = {
      /* =================== Cinématique =================== */
      polar: { title: 'Coordonnées polaires : la base qui tourne', meth: '\\(\\vec{OM} = r\\vec u_r\\) et les vecteurs de base tournent : \\(\\dot{\\vec u}_r = \\dot\\theta\\,\\vec u_\\theta\\), \\(\\dot{\\vec u}_\\theta = -\\dot\\theta\\,\\vec u_r\\) ; on dérive deux fois avec la règle du produit, sans oublier ces termes.', steps: [
        { h: 'Pourquoi dériver r u_r donne deux termes',
          guess: { q: 'Une voiture prend un virage à vitesse constante (60 km/h au compteur). Son accélération est-elle nulle ?', items: [Ch('réponse', [['o', 'oui, la vitesse ne change pas'], ['n', 'non']], 'n')] },
          body: `<p>La vitesse est un <b>vecteur</b> : dans un virage, sa norme reste la même mais sa <b>direction</b> change, donc \\(\\vec a \\neq \\vec 0\\). C'est exactement ce que capte la base polaire : \\(\\vec u_r\\) pointe toujours de O vers M, donc il <b>tourne</b> avec M.</p>
            <p>En dérivant \\(\\vec{OM} = r\\,\\vec u_r\\) (produit), on obtient \\(\\dot r\\,\\vec u_r\\) (on s'éloigne) plus \\(r\\,\\dot{\\vec u}_r = r\\dot\\theta\\,\\vec u_\\theta\\) (on tourne) :</p>\\[\\vec v = \\dot r\\,\\vec u_r + r\\dot\\theta\\,\\vec u_\\theta\\]
            <p>En redérivant, les mêmes rotations des vecteurs de base donnent le \\(-r\\dot\\theta^2\\) et le \\(2\\dot r\\dot\\theta\\) : \\(\\vec a = (\\ddot r - r\\dot\\theta^2)\\vec u_r + (r\\ddot\\theta + 2\\dot r\\dot\\theta)\\vec u_\\theta\\).</p>`,
          ask: { q: 'Mouvement circulaire uniforme (\\(r = R\\), \\(\\dot\\theta\\) constant). L\'accélération est dirigée :', items: [Ch('réponse', [['c', 'vers le centre'], ['t', 'selon la tangente'], ['n', 'elle est nulle']], 'c')], why: '\\(\\dot r = \\ddot r = \\ddot\\theta = 0\\) : il reste \\(\\vec a = -R\\dot\\theta^2\\,\\vec u_r\\), vers le centre, de norme \\(v^2/R\\).' } },
        { h: 'L\'accélération centripète',
          body: `<p>Pour un cercle parcouru à vitesse \\(v\\) constante, \\(a = \\dfrac{v^2}{R}\\) vers le centre. Plus le virage est serré (petit \\(R\\)) ou rapide, plus il faut d'accélération, donc de force (les pneus, la piste, la tension d'un fil…).</p>`,
          ask: { q: '\\(v = 10\\) m/s sur un cercle de rayon 50 m. \\(a\\) = ?', items: [Nn('a', 2, 'm/s²')], why: '\\(a = v^2/R = 100/50 = 2\\) m/s².' } }
      ] },

      chute: { title: 'Le tir : deux mouvements indépendants', meth: 'seul le poids agit : \\(\\vec a = \\vec g\\) ; horizontalement mouvement uniforme \\(x = v_0\\cos\\alpha\\,t\\), verticalement \\(y = -\\tfrac12gt^2 + v_0\\sin\\alpha\\,t\\) ; on élimine \\(t\\) pour la trajectoire.', steps: [
        { h: 'L\'horizontale ne sait rien de la verticale',
          guess: { q: 'Du même balcon, on lâche une balle et on en lance une autre horizontalement. Laquelle touche le sol en premier ?', items: [Ch('réponse', [['l', 'celle qu\'on lâche'], ['t', 'celle qu\'on lance'], ['e', 'les deux en même temps']], 'e')] },
          body: `<p>Le poids est vertical : il ne change rien à la vitesse horizontale (mouvement uniforme selon \\(x\\)), et la chute verticale est la même pour les deux balles. Elles arrivent ensemble ; celle qu'on a lancée tombe simplement plus loin.</p>
            <p>PFD : \\(m\\vec a = m\\vec g\\), donc \\(\\ddot x = 0\\) et \\(\\ddot y = -g\\). On intègre deux fois avec les conditions initiales : \\(x = v_0\\cos\\alpha\\,t\\), \\(y = -\\tfrac12gt^2 + v_0\\sin\\alpha\\,t\\). La masse a disparu : tous les objets tombent pareil (sans frottement).</p>`,
          ask: { q: 'Portée \\(P = \\dfrac{v_0^2\\sin 2\\alpha}{g}\\). Avec \\(v_0 = 10\\) m/s, \\(g = 10\\) m/s² et \\(\\alpha = 45°\\), \\(P\\) = ?', items: [Nn('P', 10, 'm')], why: '\\(\\sin 90° = 1\\) : \\(P = 100/10 = 10\\) m. C\'est la portée maximale : \\(\\sin 2\\alpha\\) vaut au plus 1, atteint pour 45°.' } }
      ] },

      /* =================== Dynamique =================== */
      plan: { title: 'Le plan incliné', meth: 'schéma, bilan (poids, réaction normale \\(N\\), frottement \\(T\\)), axes le long de la pente et perpendiculaire ; le poids se projette en \\(mg\\sin\\alpha\\) le long de la pente et \\(mg\\cos\\alpha\\) perpendiculairement, donc \\(N = mg\\cos\\alpha\\) ; en glissement \\(T = \\mu_d N\\).', steps: [
        { h: 'Choisir les axes le long de la pente',
          guess: { q: 'Un objet posé sur une pente. La réaction normale \\(N\\) du support est :', items: [Ch('réponse', [['eq', 'égale à \\(mg\\)'], ['lt', 'plus petite que \\(mg\\)'], ['gt', 'plus grande que \\(mg\\)']], 'lt')] },
          body: `<p>Avec un axe le long de la pente et un axe perpendiculaire, une seule force est « de travers » : le poids. Il se décompose en \\(mg\\sin\\alpha\\) qui tire vers le bas de la pente, et \\(mg\\cos\\alpha\\) qui plaque contre le support.</p>
            <p>Perpendiculairement, rien ne bouge : \\(N = mg\\cos\\alpha < mg\\). (Vérification : pente nulle, \\(\\cos 0 = 1\\), \\(N = mg\\) ; paroi verticale, \\(N = 0\\).) Le long de la pente : \\(m\\ddot x = mg\\sin\\alpha - T\\) pour une descente.</p>`,
          ask: { q: '\\(m = 2\\) kg, \\(g = 10\\) m/s², \\(\\alpha = 30°\\). \\(N\\) ≈ ?', items: [Nn('N', 17.3, 'N')], why: '\\(N = 2\\times10\\times\\cos 30° = 20\\times0{,}866 \\approx 17{,}3\\) N.' } },
        { h: 'Le frottement solide : juste ce qu\'il faut',
          body: `<p>Un objet immobile sur une pente ne glisse pas parce que le frottement compense exactement \\(mg\\sin\\alpha\\). Il vaut <b>ce qu'il faut</b> pour l'équilibre, dans la limite \\(T \\leq \\mu_s N\\). Si la pente devient trop forte, \\(mg\\sin\\alpha > \\mu_s mg\\cos\\alpha\\) : ça glisse, et alors \\(T = \\mu_d N\\), opposé au mouvement.</p>`,
          ask: { q: 'L\'objet reste immobile tant que :', items: [Ch('réponse', [['a', '\\(\\tan\\alpha \\leq \\mu_s\\)'], ['b', '\\(\\sin\\alpha \\leq \\mu_s\\)'], ['c', '\\(\\alpha \\leq 45°\\)']], 'a')], why: '\\(mg\\sin\\alpha \\leq \\mu_s mg\\cos\\alpha\\), on divise par \\(mg\\cos\\alpha\\) : \\(\\tan\\alpha \\leq \\mu_s\\). La masse ne compte pas.' } }
      ] },

      visq: { title: 'Frottement fluide et vitesse limite', meth: 'PFD avec \\(-\\alpha\\vec v\\) : \\(m\\dot v = mg - \\alpha v\\) ; la vitesse limite annule l\'accélération, \\(v_{lim} = mg/\\alpha\\) ; \\(\\tau = m/\\alpha\\) et \\(v(t) = v_{lim}(1 - e^{-t/\\tau})\\).', steps: [
        { h: 'Pourquoi un parachutiste arrête d\'accélérer',
          guess: { q: 'Une bille tombe dans de l\'huile depuis le repos. Sa vitesse…', items: [Ch('réponse', [['i', 'augmente sans fin'], ['l', 'augmente puis se stabilise'], ['d', 'diminue']], 'l')] },
          body: `<p>Plus la bille va vite, plus le frottement \\(\\alpha v\\) est grand. Au début il est faible et le poids accélère la bille ; puis le frottement grandit jusqu'à <b>égaler le poids</b> : plus de force nette, plus d'accélération, la vitesse est constante.</p>\\[\\dot v = 0 \\Longrightarrow \\alpha v_{lim} = mg \\Longrightarrow v_{lim} = \\frac{mg}{\\alpha}\\]
            <p>L'équation \\(\\dot v + \\dfrac{\\alpha}{m}v = g\\) est du même type que la charge d'un condensateur : \\(v(t) = v_{lim}(1 - e^{-t/\\tau})\\) avec \\(\\tau = m/\\alpha\\).</p>`,
          ask: { q: '\\(m = 0{,}1\\) kg, \\(g = 10\\) m/s², \\(\\alpha = 0{,}5\\) kg/s. \\(v_{lim}\\) = ?', items: [Nn('v_{lim}', 2, 'm/s')], why: '\\(v_{lim} = mg/\\alpha = 1/0{,}5 = 2\\) m/s.' } }
      ] },

      inert: { title: 'Référentiels non galiléens : les forces d\'inertie', meth: 'dans un référentiel qui accélère (\\(\\vec a_e\\)), on ajoute \\(-m\\vec a_e\\) (force d\'inertie d\'entraînement) au bilan ; en rotation uniforme, centrifuge \\(m\\omega^2\\vec{HM}\\), et Coriolis \\(-2m\\vec\\Omega\\wedge\\vec v_r\\) si le point bouge.', steps: [
        { h: 'La force qu\'on ressent dans le bus',
          guess: { q: 'Un bus démarre brusquement. Tu es debout : tu es poussé…', items: [Ch('réponse', [['a', 'vers l\'avant'], ['r', 'vers l\'arrière'], ['n', 'nulle part']], 'r')] },
          body: `<p>Vu du trottoir (galiléen), personne ne te pousse : tes pieds avancent avec le bus et ton corps a tendance à rester sur place. Vu du bus (qui accélère), tout se passe comme si une force te tirait vers l'arrière : la <b>force d'inertie</b> \\(-m\\vec a_e\\), opposée à l'accélération du référentiel.</p>
            <p>Dans le référentiel non galiléen, on écrit \\(m\\vec a = \\sum\\vec F - m\\vec a_e\\) (+ Coriolis en rotation). Ascenseur qui accélère vers le haut : poids apparent \\(m(g + a)\\). Pendule dans un wagon qui accélère : il penche vers l'arrière, \\(\\tan\\theta = a/g\\).</p>`,
          ask: { q: 'Une personne de 70 kg dans un ascenseur qui accélère vers le haut à 2 m/s² (\\(g = 10\\)). Poids apparent ?', items: [Nn('P_{app}', 840, 'N')], why: '\\(m(g + a) = 70\\times12 = 840\\) N : la balance indique 84 « kg ». Attention : « monter en freinant », c\'est une accélération vers le bas.' } }
      ] },

      choc: { title: 'Chocs : ce qui se conserve', meth: 'pendant un choc bref, la quantité de mouvement totale se conserve (forces intérieures opposées) ; choc élastique : l\'énergie cinétique aussi ; choc mou (corps soudés) : \\(v = \\dfrac{m_1v_1}{m_1 + m_2}\\), et de l\'énergie est perdue.', steps: [
        { h: 'Action et réaction s\'annulent',
          guess: { q: 'Un chariot de 1 kg à 6 m/s percute un chariot de 2 kg immobile et ils restent accrochés. Vitesse après le choc ?', items: [Nn('v', 2, 'm/s')] },
          body: `<p>Pendant le choc, A pousse B et B pousse A avec une force <b>opposée</b> (3e loi). Ce que l'un gagne en quantité de mouvement, l'autre le perd : la somme \\(\\vec p = m_1\\vec v_1 + m_2\\vec v_2\\) se conserve.</p>
            <p>Corps soudés : \\(m_1 v_1 = (m_1 + m_2)v\\), donc \\(v = \\dfrac{1\\times6}{3} = 2\\) m/s. L'énergie cinétique, elle, passe de 18 J à 6 J : le reste part en déformation et en chaleur. Elle ne se conserve que dans un choc <b>élastique</b> (billes dures).</p>`,
          ask: { q: 'Choc élastique entre deux billes de même masse, la seconde au repos. Après le choc, la première :', items: [Ch('réponse', [['s', 's\'arrête'], ['r', 'rebondit en arrière'], ['c', 'continue à la même vitesse']], 's')], why: '\\(v_1\' = \\dfrac{m_1 - m_2}{m_1 + m_2}v_1 = 0\\) et \\(v_2\' = v_1\\) : les billes échangent leurs vitesses (pendule de Newton).' } }
      ] },

      /* =================== Énergie =================== */
      travail: { title: 'Le travail d\'une force', meth: '\\(W = \\vec F\\cdot\\vec{AB}\\) pour une force constante : seule la composante le long du déplacement compte ; une force perpendiculaire au mouvement ne travaille pas ; poids : \\(W = -mg(z_B - z_A)\\) ; frottement : \\(-T\\times L\\).', steps: [
        { h: 'Seule la composante dans le sens du mouvement compte',
          guess: { q: 'Tu portes une valise à hauteur constante en marchant 10 m. Le travail du poids de la valise est :', items: [Ch('réponse', [['p', 'positif'], ['n', 'négatif'], ['0', 'nul']], '0')] },
          body: `<p>Le travail mesure ce qu'une force apporte (ou retire) comme énergie au mouvement : \\(W = \\vec F\\cdot\\vec{AB} = F\\,AB\\cos\\theta\\). Une force qui pousse dans le sens du mouvement donne un travail positif (moteur), contre le mouvement négatif (résistant), perpendiculaire <b>nul</b> : c'est le cas du poids pendant un déplacement horizontal, et de la réaction normale en général.</p>
            <p>Pour le poids, seul le déplacement vertical compte : \\(W = -mg(z_B - z_A)\\), quel que soit le chemin. En montée il est négatif.</p>`,
          ask: { q: 'Un objet de 2 kg monte de 3 m (\\(g = 10\\)). Travail de son poids ?', items: [Nn('W', -60, 'J')], why: '\\(W = -mg\\Delta z = -2\\times10\\times3 = -60\\) J : négatif, le poids s\'oppose à la montée.' } }
      ] },

      tec: { title: 'Le théorème de l\'énergie cinétique', meth: 'quand on cherche une vitesse à partir de positions (sans le temps) : \\(\\tfrac12mv_B^2 - \\tfrac12mv_A^2 = \\sum W_{A\\to B}\\) ; on calcule le travail de chaque force (le poids par \\(\\Delta z\\), la réaction normale ne travaille pas, le frottement \\(-TL\\)).', steps: [
        { h: 'Pas besoin du temps',
          guess: { q: 'Un objet lâché sans vitesse tombe de 5 m (\\(g = 10\\), sans frottement). Sa vitesse en bas ?', items: [Nn('v', 10, 'm/s')] },
          body: `<p>Le PFD donne l'accélération, puis il faut intégrer en temps. Si on veut juste une vitesse à une position, le TEC est bien plus rapide : la variation d'énergie cinétique est la somme des travaux.</p>\\[\\Delta E_c = \\sum W \\qquad \\tfrac12mv^2 - 0 = mgh \\Longrightarrow v = \\sqrt{2gh} = \\sqrt{100} = 10\\ \\text{m/s}\\]
            <p>La masse se simplifie. Sur un plan incliné avec frottement, on ajoute simplement \\(W_T = -T\\,L\\).</p>`,
          ask: { q: 'Même chute de 5 m, mais un frottement retire 30 J à un objet de 1 kg. \\(v\\) en bas ?', items: [Nn('v', Math.sqrt(40), 'm/s')], why: '\\(\\tfrac12v^2 = 50 - 30 = 20\\), donc \\(v = \\sqrt{40} \\approx 6{,}3\\) m/s.' } }
      ] },

      loop: { title: 'Looping : rester collé à la piste', meth: 'TEC pour la vitesse au point voulu, puis PFD projeté sur la normale (\\(a_n = v^2/r\\) vers le centre) pour la réaction \\(R\\) ; le mobile reste sur la piste tant que \\(R \\geq 0\\), la limite est \\(R = 0\\).', steps: [
        { h: 'Pourquoi on ne tombe pas en haut',
          guess: { q: 'En haut d\'un looping, le wagon a la tête en bas. Ce qui l\'empêche de tomber, c\'est :', items: [Ch('réponse', [['v', 'sa vitesse : le poids sert juste à le faire tourner'], ['f', 'une force centrifuge qui compense le poids'], ['c', 'la ceinture']], 'v')] },
          body: `<p>Pour suivre un cercle de rayon \\(r\\) à la vitesse \\(v\\), il faut une force totale vers le centre de \\(m\\dfrac{v^2}{r}\\). En haut, le poids et la réaction de la piste pointent tous les deux vers le centre (vers le bas) :</p>\\[R + mg = m\\frac{v^2}{r}\\]
            <p>Si le wagon va vite, le poids ne suffit pas et la piste doit pousser (\\(R > 0\\)). S'il va trop lentement, il faudrait \\(R < 0\\) : la piste devrait « tirer », impossible, le wagon décolle. La limite \\(R = 0\\) donne \\(v_{min}^2 = g\\,r\\) en haut.</p>`,
          ask: { q: 'Looping de rayon 2 m (\\(g = 10\\)). Vitesse minimale en haut ?', items: [Nn('v_{min}', Math.sqrt(20), 'm/s')], why: '\\(v_{min} = \\sqrt{gr} = \\sqrt{20} \\approx 4{,}5\\) m/s. Ensuite le TEC donne de quelle hauteur il faut partir.' } }
      ] },

      qcmE: { title: 'Forces et énergies : les réflexes du QCM', meth: 'une force qui ne dépend que de la position et dont le travail ne dépend pas du chemin est conservative (poids, ressort, gravitation) ; \\(E_m\\) se conserve si seules elles travaillent, sinon \\(\\Delta E_m = W_{non\\ cons}\\) (frottements : \\(E_m\\) diminue).', steps: [
        { h: 'Conservative ou pas ?',
          guess: { q: 'Le travail du frottement sur un aller-retour de A à B puis B à A est :', items: [Ch('réponse', [['0', 'nul'], ['n', 'négatif'], ['p', 'positif']], 'n')] },
          body: `<p>Le poids, sur un aller-retour, donne un travail nul (il rend en descente ce qu'il a pris en montée) : il est <b>conservatif</b>, on peut lui associer une énergie potentielle \\(mgz\\). Le frottement freine à l'aller <b>et</b> au retour : son travail dépend du chemin, il n'a pas d'énergie potentielle.</p>
            <p>Conséquence : \\(E_m = E_c + E_p\\) est constante s'il n'y a que des forces conservatives (ou des forces qui ne travaillent pas, comme \\(N\\)). Avec frottement, \\(E_m\\) diminue de \\(|W_{frott}|\\).</p>`,
          ask: { q: 'Un pendule sans frottement passe au point le plus bas. Son énergie cinétique y est :', items: [Ch('réponse', [['max', 'maximale'], ['min', 'minimale'], ['0', 'nulle']], 'max')], why: '\\(E_m\\) constante et \\(E_p = mgz\\) minimale au point le plus bas : \\(E_c\\) y est maximale.' } }
      ] },

      pot: { title: 'Énergie potentielle, équilibre, stabilité', meth: '\\(F_x = -\\dfrac{dE_p}{dx}\\) : équilibre là où \\(E_p\'(x_e) = 0\\), stable si \\(E_p\'\'(x_e) > 0\\) (minimum), instable si \\(E_p\'\'(x_e) < 0\\) (maximum) ; le mobile ne va que là où \\(E_p \\leq E_m\\).', steps: [
        { h: 'Une bille dans un paysage',
          guess: { q: 'Une bille posée au fond d\'un bol, puis une autre en équilibre au sommet d\'un bol retourné. On les pousse un peu. Laquelle revient ?', items: [Ch('réponse', [['f', 'celle du fond'], ['s', 'celle du sommet'], ['d', 'les deux']], 'f')] },
          body: `<p>Imagine la courbe \\(E_p(x)\\) comme un relief, et le mobile comme une bille dessus. La force \\(F = -\\dfrac{dE_p}{dx}\\) pousse toujours vers le bas de la pente.</p>
            <ul><li>Équilibre : là où la pente est nulle, \\(E_p'(x_e) = 0\\).</li><li>Au fond d'un creux (\\(E_p'' > 0\\)) : la bille écartée revient, équilibre <b>stable</b>.</li><li>Au sommet d'une bosse (\\(E_p'' < 0\\)) : elle s'en va, <b>instable</b>.</li></ul>
            <p>Et comme \\(E_c \\geq 0\\), le mobile ne peut aller que là où \\(E_p \\leq E_m\\).</p>`,
          ask: { q: '\\(E_p(x) = x^2 - 2x\\). Position d\'équilibre ?', items: [Nn('x_e', 1, 'm')], why: '\\(E_p\'(x) = 2x - 2 = 0\\) en \\(x = 1\\), et \\(E_p\'\' = 2 > 0\\) : équilibre stable.' } }
      ] },

      /* =================== Oscillateurs =================== */
      oh: { title: 'L\'oscillateur harmonique', meth: 'force de rappel \\(-kx\\) : le PFD donne \\(\\ddot x + \\omega_0^2x = 0\\) avec \\(\\omega_0 = \\sqrt{k/m}\\) (pendule : \\(\\sqrt{g/\\ell}\\)) ; solution \\(X_m\\cos(\\omega_0t + \\varphi)\\), constantes par les conditions initiales, \\(T_0 = 2\\pi/\\omega_0\\).', steps: [
        { h: 'Plus raide, plus vite ; plus lourd, plus lent',
          guess: { q: 'On remplace la masse au bout d\'un ressort par une masse 4 fois plus lourde. La période des oscillations :', items: [Ch('réponse', [['x4', 'est multipliée par 4'], ['x2', 'est multipliée par 2'], ['eq', 'ne change pas'], ['d2', 'est divisée par 2']], 'x2')] },
          body: `<p>Le ressort rappelle vers l'équilibre avec une force \\(-kx\\) : plus on s'écarte, plus il tire. PFD : \\(m\\ddot x = -kx\\), soit \\(\\ddot x + \\omega_0^2 x = 0\\) avec \\(\\omega_0 = \\sqrt{k/m}\\).</p>
            <p>Un ressort plus raide rappelle plus fort : oscillations plus rapides. Une masse plus lourde a plus d'inertie : plus lentes. \\(T_0 = 2\\pi\\sqrt{m/k}\\) : masse ×4, période ×2.</p>`,
          ask: { q: '\\(k = 100\\) N/m, \\(m = 1\\) kg. \\(\\omega_0\\) = ?', items: [Nn('\\omega_0', 10, 'rad/s')], why: '\\(\\sqrt{100/1} = 10\\) rad/s, et \\(T_0 = 2\\pi/10 \\approx 0{,}63\\) s.' } }
      ] },

      amorti: { title: 'L\'oscillateur amorti : trois régimes', meth: '\\(\\ddot x + 2\\lambda\\dot x + \\omega_0^2x = 0\\) avec \\(\\lambda = \\alpha/(2m)\\) ; on compare \\(\\lambda\\) et \\(\\omega_0\\) : \\(\\lambda < \\omega_0\\) pseudo-périodique, \\(\\lambda = \\omega_0\\) critique, \\(\\lambda > \\omega_0\\) apériodique.', steps: [
        { h: 'Une suspension de voiture',
          guess: { q: 'Une voiture aux amortisseurs usés passe sur une bosse. Elle…', items: [Ch('réponse', [['o', 'rebondit plusieurs fois'], ['r', 'revient lentement sans osciller']], 'o')] },
          body: `<p>Le frottement \\(-\\alpha\\dot x\\) s'ajoute au rappel : \\(\\ddot x + 2\\lambda\\dot x + \\omega_0^2 x = 0\\). Tout dépend de qui gagne, l'amortissement \\(\\lambda\\) ou le rappel \\(\\omega_0\\) :</p>
            <ul><li>\\(\\lambda < \\omega_0\\) (peu amorti) : oscillations qui s'éteignent, régime <b>pseudo-périodique</b>, pseudo-pulsation \\(\\omega = \\sqrt{\\omega_0^2 - \\lambda^2}\\) ;</li><li>\\(\\lambda > \\omega_0\\) (très amorti) : retour lent sans osciller, <b>apériodique</b> ;</li><li>\\(\\lambda = \\omega_0\\) : <b>critique</b>, le retour le plus rapide sans oscillation (le réglage idéal d'une suspension).</li></ul>`,
          ask: { q: '\\(\\lambda = 2\\) s⁻¹ et \\(\\omega_0 = 5\\) rad/s. Régime ?', items: [Ch('réponse', [['p', 'pseudo-périodique'], ['c', 'critique'], ['a', 'apériodique']], 'p')], why: '\\(\\lambda < \\omega_0\\) : peu amorti, pseudo-périodique, avec \\(\\omega = \\sqrt{25 - 4} = \\sqrt{21}\\) rad/s.' } }
      ] },

      force: { title: 'Oscillations forcées et résonance', meth: 'en régime permanent, l\'oscillateur suit la pulsation \\(\\omega\\) imposée, avec l\'amplitude \\(A(\\omega)\\) ; elle est maximale près de \\(\\omega_0\\) (résonance), d\'autant plus que l\'amortissement est faible.', steps: [
        { h: 'Pousser une balançoire au bon rythme',
          guess: { q: 'Pour faire monter haut un enfant sur une balançoire avec de petites poussées, on pousse…', items: [Ch('réponse', [['r', 'au rythme naturel de la balançoire'], ['v', 'le plus vite possible'], ['l', 'très lentement']], 'r')] },
          body: `<p>Une force \\(F_0\\cos\\omega t\\) impose son rythme : après un régime transitoire, l'oscillateur oscille à la pulsation \\(\\omega\\) de la force (pas \\(\\omega_0\\)). Son amplitude dépend de \\(\\omega\\) :</p>\\[A(\\omega) = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\lambda^2\\omega^2}}\\]
            <p>Quand \\(\\omega\\) approche \\(\\omega_0\\), le premier terme s'annule : l'amplitude devient grande, limitée seulement par l'amortissement. C'est la <b>résonance</b> (balançoire, pont qui vibre, verre qui casse).</p>`,
          ask: { q: 'Si on diminue l\'amortissement \\(\\lambda\\), le pic de résonance devient :', items: [Ch('réponse', [['h', 'plus haut et plus étroit'], ['b', 'plus bas et plus large'], ['eq', 'identique']], 'h')], why: 'Au voisinage de \\(\\omega_0\\), seul \\(4\\lambda^2\\omega^2\\) limite le dénominateur : moins d\'amortissement, pic plus haut et plus pointu.' } }
      ] },

      /* =================== Moment cinétique =================== */
      moment: { title: 'Moment cinétique', meth: '\\(\\vec L_O = \\vec{OM}\\wedge m\\vec v\\) et \\(\\dfrac{d\\vec L_O}{dt} = \\sum\\vec{\\mathcal M}_O\\) ; une force centrale (qui passe par O) a un moment nul, donc \\(\\vec L_O\\) est constant : mouvement plan, loi des aires, et \\(r_1v_1 = r_2v_2\\) là où \\(\\vec v \\perp \\vec{OM}\\).', steps: [
        { h: 'La patineuse qui ramène ses bras',
          guess: { q: 'Une patineuse qui tourne sur elle-même ramène ses bras contre elle. Elle tourne…', items: [Ch('réponse', [['p', 'plus vite'], ['m', 'moins vite'], ['eq', 'pareil']], 'p')] },
          body: `<p>Le moment cinétique \\(\\vec L_O = \\vec{OM}\\wedge m\\vec v\\) mesure « la quantité de rotation » autour de O. Il ne change que si une force exerce un moment (\\(\\vec{OM}\\wedge\\vec F\\)), c'est-à-dire tire « de côté ».</p>
            <p>Une force <b>centrale</b> (toujours dirigée vers O, comme la gravitation du Soleil) a un moment nul : \\(\\vec L_O\\) est constant. Comme \\(L = m\\,r\\,v\\) quand \\(\\vec v\\perp\\vec{OM}\\), si \\(r\\) diminue, \\(v\\) augmente : la patineuse accélère, la comète va plus vite près du Soleil.</p>`,
          ask: { q: 'Une planète passe au périhélie (\\(r_1 = 1\\) UA) à 30 km/s. À l\'aphélie (\\(r_2 = 1{,}5\\) UA), sa vitesse ?', items: [Nn('v_2\\ (\\mathrm{km/s})', 20)], why: '\\(r_1v_1 = r_2v_2\\) : \\(v_2 = 30/1{,}5 = 20\\) km/s.' } }
      ] },

      kepler: { title: 'Orbites et lois de Kepler', meth: 'orbite circulaire : la gravitation fournit l\'accélération centripète, \\(\\dfrac{GMm}{r^2} = m\\dfrac{v^2}{r}\\), donc \\(v = \\sqrt{GM/r}\\), puis \\(T = 2\\pi r/v\\) donne \\(\\dfrac{T^2}{r^3} = \\dfrac{4\\pi^2}{GM}\\) ; \\(r\\) se mesure depuis le centre de l\'astre.', steps: [
        { h: 'La Lune tombe sans arrêt',
          guess: { q: 'Un satellite plus éloigné de la Terre tourne…', items: [Ch('réponse', [['l', 'plus lentement'], ['v', 'plus vite'], ['eq', 'à la même vitesse']], 'l')] },
          body: `<p>Un satellite en orbite circulaire « tombe » en permanence vers la Terre, mais il va si vite de côté qu'il la rate toujours. La gravitation fournit exactement l'accélération centripète :</p>\\[\\frac{GMm}{r^2} = m\\frac{v^2}{r} \\Longrightarrow v = \\sqrt{\\frac{GM}{r}}\\]
            <p>Plus loin, la gravitation est plus faible : il va moins vite, sur un cercle plus grand. Avec \\(T = \\dfrac{2\\pi r}{v}\\) : \\(T^2 = \\dfrac{4\\pi^2}{GM}r^3\\), la 3e loi de Kepler (même rapport \\(T^2/r^3\\) pour tous les satellites d'un même astre).</p>`,
          ask: { q: 'On multiplie le rayon de l\'orbite par 4. La période est multipliée par :', items: [Nn('\\text{facteur}', 8)], why: '\\(T \\propto r^{3/2}\\) : \\(4^{3/2} = 8\\).' } }
      ] }
    };
    /* ---------- Étapes ajoutées : schéma et calculs guidés au format du CC ---------- */
    const guided = '<p class="fine">Calcul guidé : fais-le sur ta feuille en suivant la méthode (schéma, bilan, projection), puis tape les résultats.</p>';
    const INK = 'fill:var(--ink-2);font:15px var(--sans)', LN = 'stroke:var(--ink-2);stroke-width:2;fill:none';
    const arrow = (x1, y1, x2, y2, c) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 9; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${c};stroke-width:2.5"/><path d="M${x2} ${y2} L${x2 - h * Math.cos(a - 0.4)} ${y2 - h * Math.sin(a - 0.4)} L${x2 - h * Math.cos(a + 0.4)} ${y2 - h * Math.sin(a + 0.4)}Z" style="fill:${c}"/>`; };
    // plan incliné de 30° : poids, réaction normale, frottement, axes x (le long de la pente) et y
    const PLAN = (() => {
      const A = 30 * Math.PI / 180, x0 = 40, y0 = 190, L = 340, x1 = x0 + L * Math.cos(A), y1 = y0 - L * Math.sin(A);
      const cx = x0 + 0.55 * L * Math.cos(A), cy = y0 - 0.55 * L * Math.sin(A), ux = Math.cos(A), uy = -Math.sin(A), nx = -Math.sin(A), ny = Math.cos(A);   // u le long de la pente (vers le haut), n normale sortante
      const blk = `<polygon points="${cx - 22 * ux},${cy - 22 * uy} ${cx + 22 * ux},${cy + 22 * uy} ${cx + 22 * ux + 36 * nx},${cy + 22 * uy - 36 * ny} ${cx - 22 * ux + 36 * nx},${cy - 22 * uy - 36 * ny}" style="fill:var(--sheet-2);stroke:var(--ink-2);stroke-width:1.5"/>`;
      const gx = cx + 18 * nx, gy = cy - 18 * ny;
      return `<svg class="lfig" viewBox="0 0 420 220" role="img" aria-label="Bloc sur un plan incliné de 30 degrés avec le poids, la réaction normale et le frottement">
        <polygon points="${x0},${y0} ${x1},${y0} ${x1},${y1}" style="fill:none;stroke:var(--rule-strong);stroke-width:1.5"/>
        <path d="M${x0 + 40} ${y0} A40 40 0 0 0 ${x0 + 40 * Math.cos(A)} ${y0 - 40 * Math.sin(A)}" style="${LN};stroke-width:1.2"/><text x="${x0 + 48}" y="${y0 - 8}" style="${INK}">α</text>
        ${blk}
        ${arrow(gx, gy, gx, gy + 70, '#dc2626')}<text x="${gx + 6}" y="${gy + 78}" style="${INK};fill:#dc2626">P = mg</text>
        ${arrow(gx, gy, gx + 60 * nx, gy - 60 * ny, '#2563eb')}<text x="${gx + 64 * nx - 6}" y="${gy - 64 * ny - 4}" style="${INK};fill:#2563eb">N</text>
        ${arrow(gx, gy, gx + 55 * ux, gy + 55 * uy, '#16a34a')}<text x="${gx + 60 * ux + 4}" y="${gy + 60 * uy}" style="${INK};fill:#16a34a">T</text>
        <text x="250" y="212" style="${INK};font-size:13px">bloc qui descend : T remonte la pente</text></svg>`;
    })();
    const MORE = {
      polar: [
        { h: 'Calcul guidé : un point sur une spirale',
          body: `${guided}<p>\\(r(t) = 2t\\) (en m) et \\(\\theta(t) = 3t\\) (en rad). Vitesse à \\(t = 1\\) s ?</p>
            <ol><li>\\(\\dot r = 2\\), \\(r(1) = 2\\), \\(\\dot\\theta = 3\\).</li><li>\\(\\vec v = \\dot r\\,\\vec u_r + r\\dot\\theta\\,\\vec u_\\theta\\) : deux composantes.</li><li>Norme : \\(\\sqrt{v_r^2 + v_\\theta^2}\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('v_\\theta', 6, 'm/s'), Nn('\\|\\vec v\\|', Math.sqrt(40), 'm/s')], why: '\\(v_r = 2\\), \\(v_\\theta = r\\dot\\theta = 2\\times3 = 6\\) m/s ; \\(\\|\\vec v\\| = \\sqrt{4 + 36} = \\sqrt{40} \\approx 6{,}3\\) m/s.' } }
      ],
      chute: [
        { h: 'Calcul guidé : hauteur maximale et durée du vol',
          body: `${guided}<p>\\(v_0 = 20\\) m/s, \\(\\alpha = 30°\\), \\(g = 10\\) m/s².</p>
            <ol><li>Vitesse verticale initiale : \\(v_0\\sin\\alpha\\).</li><li>Au sommet, la vitesse verticale s'annule : \\(t_s = \\dfrac{v_0\\sin\\alpha}{g}\\).</li><li>Hauteur : \\(h = \\dfrac{(v_0\\sin\\alpha)^2}{2g}\\). Le vol dure \\(2t_s\\) (sol horizontal).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('t_s', 1, 's'), Nn('h_{max}', 5, 'm'), Nn('P', 20 * Math.sqrt(3), 'm')], why: '\\(v_0\\sin30° = 10\\) m/s ; \\(t_s = 1\\) s ; \\(h = 100/20 = 5\\) m ; portée \\(v_0\\cos\\alpha\\times2t_s = 17{,}3\\times2 \\approx 34{,}6\\) m.' } }
      ],
      plan: [
        { h: 'Calcul guidé : le bloc qui glisse',
          body: `${PLAN}${guided}<p>\\(m = 2\\) kg, \\(\\alpha = 30°\\), \\(\\mu_d = 0{,}2\\), \\(g = 10\\) m/s², le bloc descend.</p>
            <ol><li>Axe \\(y\\) (perpendiculaire) : \\(N = mg\\cos\\alpha\\).</li><li>Frottement de glissement : \\(T = \\mu_d N\\), vers le haut de la pente.</li><li>Axe \\(x\\) (vers le bas de la pente) : \\(ma = mg\\sin\\alpha - T\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('N', 17.3, 'N'), Nn('T', 3.46, 'N'), Nn('a', 3.27, 'm/s²')], why: '\\(N = 20\\cos30° \\approx 17{,}3\\) N ; \\(T = 0{,}2\\times17{,}3 \\approx 3{,}46\\) N ; \\(a = (10 - 3{,}46)/2 \\approx 3{,}27\\) m/s² (soit \\(g(\\sin\\alpha - \\mu_d\\cos\\alpha)\\), indépendant de la masse).' } }
      ],
      visq: [
        { h: 'Calcul guidé : la bille dans l\'huile',
          body: `${guided}<p>\\(m = 0{,}05\\) kg, \\(\\alpha = 0{,}25\\) kg/s, \\(g = 10\\) m/s², lâchée sans vitesse.</p>
            <ol><li>Vitesse limite : \\(v_{lim} = mg/\\alpha\\).</li><li>Temps caractéristique : \\(\\tau = m/\\alpha\\).</li><li>À \\(t = \\tau\\) : \\(v = v_{lim}(1 - e^{-1}) \\approx 0{,}63\\,v_{lim}\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('v_{lim}', 2, 'm/s'), Nn('\\tau', 0.2, 's'), Nn('v(\\tau)', 1.26, 'm/s')], why: '\\(v_{lim} = 0{,}5/0{,}25 = 2\\) m/s ; \\(\\tau = 0{,}2\\) s ; \\(v(\\tau) \\approx 1{,}26\\) m/s.' } }
      ],
      inert: [
        { h: 'Calcul guidé : le pendule dans le wagon',
          body: `${guided}<p>Un wagon accélère à \\(a = 2\\) m/s² ; une masse pend à un fil. Dans le wagon (non galiléen), à l'équilibre : poids, tension, force d'inertie \\(-m\\vec a\\) (vers l'arrière).</p>
            <ol><li>Le fil s'aligne sur la somme poids + force d'inertie : vertical \\(mg\\), horizontal \\(ma\\).</li><li>Angle avec la verticale : \\(\\tan\\theta = a/g\\).</li><li>Tension : \\(T = m\\sqrt{g^2 + a^2}\\).</li></ol>`,
          ask: { q: 'Avec \\(g = 10\\) m/s² et \\(m = 1\\) kg :', items: [Ch('\\(\\tan\\theta\\)', [['a', '0,2'], ['b', '5'], ['c', '0,5']], 'a'), Nn('T', Math.sqrt(104), 'N')], why: '\\(\\tan\\theta = 2/10 = 0{,}2\\) (environ 11°), le pendule penche vers l\'arrière. \\(T = \\sqrt{100 + 4} \\approx 10{,}2\\) N.' } }
      ],
      choc: [
        { h: 'Calcul guidé : l\'énergie perdue dans un choc mou',
          body: `${guided}<p>Wagon de 2 t à 3 m/s qui percute un wagon de 1 t immobile ; ils s'accrochent.</p>
            <ol><li>Conservation de \\(p\\) : \\(m_1v_1 = (m_1 + m_2)v\\).</li><li>\\(E_c\\) avant et après.</li><li>Différence : énergie dissipée.</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('v', 2, 'm/s'), Nn('E_c\\ \\text{avant (kJ)}', 9), Nn('E_c\\ \\text{perdue (kJ)}', 3)], why: '\\(v = 6000/3000 = 2\\) m/s ; avant : \\(\\tfrac12\\times2000\\times9 = 9\\) kJ ; après : \\(\\tfrac12\\times3000\\times4 = 6\\) kJ : 3 kJ perdus.' } }
      ],
      travail: [
        { h: 'Calcul guidé : les travaux sur une pente',
          body: `${guided}<p>Un bloc de 2 kg descend de \\(L = 4\\) m le long d'une pente à 30°, frottement \\(T = 3\\) N, \\(g = 10\\).</p>
            <ol><li>Poids : il descend de \\(h = L\\sin\\alpha\\), donc \\(W_P = +mgh\\).</li><li>Réaction normale : perpendiculaire au déplacement.</li><li>Frottement : opposé au déplacement, \\(W_T = -T\\,L\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('W_P', 40, 'J'), Nn('W_N', 0, 'J'), Nn('W_T', -12, 'J')], why: '\\(h = 2\\) m, \\(W_P = 2\\times10\\times2 = 40\\) J ; \\(W_N = 0\\) ; \\(W_T = -3\\times4 = -12\\) J.' } }
      ],
      tec: [
        { h: 'Calcul guidé : la vitesse en bas de la pente',
          body: `${guided}<p>Même bloc (2 kg, 4 m de pente à 30°, \\(T = 3\\) N), parti du repos.</p>
            <ol><li>Somme des travaux : \\(40 + 0 - 12\\).</li><li>TEC : \\(\\tfrac12mv^2 - 0 = \\sum W\\).</li><li>Isole \\(v\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('\\sum W', 28, 'J'), Nn('v', Math.sqrt(28), 'm/s')], why: '\\(\\sum W = 28\\) J, donc \\(v^2 = 28\\), \\(v \\approx 5{,}3\\) m/s. Sans frottement : \\(\\sqrt{40} \\approx 6{,}3\\) m/s.' } }
      ],
      loop: [
        { h: 'Calcul guidé : de quelle hauteur partir ?',
          body: `${guided}<p>Looping de rayon \\(r = 2\\) m (sommet à \\(2r = 4\\) m du bas), sans frottement, \\(g = 10\\). Il faut \\(v_{haut}^2 \\geq gr\\).</p>
            <ol><li>TEC entre le départ (hauteur \\(H\\), vitesse nulle) et le sommet : \\(\\tfrac12mv_{haut}^2 = mg(H - 2r)\\).</li><li>Condition : \\(2g(H - 2r) \\geq gr\\).</li><li>Donc \\(H \\geq \\dfrac{5r}{2}\\).</li></ol>`,
          ask: { q: 'Résultat :', items: [Nn('H_{min}', 5, 'm')], why: '\\(H_{min} = 2{,}5\\times2 = 5\\) m : il faut partir plus haut que le sommet du looping (4 m), à cause de la vitesse nécessaire là-haut.' } }
      ],
      qcmE: [
        { h: 'Exercice guidé : le pendule et l\'énergie',
          body: `${guided}<p>Pendule de longueur 0,8 m lâché sans vitesse à 60° de la verticale, sans frottement, \\(g = 10\\).</p>
            <ol><li>Hauteur au départ, par rapport au point le plus bas : \\(h = \\ell(1 - \\cos\\theta_0)\\).</li><li>Conservation de \\(E_m\\) : \\(\\tfrac12mv^2 = mgh\\) en bas.</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('h', 0.4, 'm'), Nn('v_{bas}', Math.sqrt(8), 'm/s')], why: '\\(h = 0{,}8\\times(1 - 0{,}5) = 0{,}4\\) m ; \\(v = \\sqrt{2gh} = \\sqrt8 \\approx 2{,}8\\) m/s. La tension du fil ne travaille pas (perpendiculaire au mouvement).' } }
      ],
      pot: [
        { h: 'Exercice guidé : étudier un potentiel',
          body: `${guided}<p>\\(E_p(x) = x^3 - 3x\\) (unités SI).</p>
            <ol><li>\\(E_p'(x) = 3x^2 - 3\\) : équilibres en \\(x = \\pm1\\).</li><li>\\(E_p''(x) = 6x\\) : signe en chaque équilibre.</li><li>Stable si \\(E_p'' > 0\\).</li></ol>`,
          ask: { q: 'L\'équilibre stable est en :', items: [Nn('x_{stable}', 1, 'm'), Ch('\\(x = -1\\) est', [['s', 'stable'], ['i', 'instable']], 'i')], why: '\\(E_p\'\'(1) = 6 > 0\\) : stable (un creux) ; \\(E_p\'\'(-1) = -6 < 0\\) : instable (une bosse).' } }
      ],
      oh: [
        { h: 'Calcul guidé : le ressort vertical',
          body: `${guided}<p>Masse \\(m = 0{,}5\\) kg au bout d'un ressort vertical \\(k = 50\\) N/m, \\(g = 10\\).</p>
            <ol><li>Équilibre : \\(k\\,\\Delta\\ell = mg\\), l'allongement à l'équilibre.</li><li>Autour de l'équilibre, le poids est compensé : on retrouve \\(\\ddot x + \\dfrac km x = 0\\).</li><li>\\(\\omega_0 = \\sqrt{k/m}\\), puis \\(T_0\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('\\Delta\\ell', 0.1, 'm'), Nn('\\omega_0', 10, 'rad/s'), Nn('T_0', 2 * Math.PI / 10, 's')], why: '\\(\\Delta\\ell = 5/50 = 0{,}1\\) m ; \\(\\omega_0 = \\sqrt{100} = 10\\) rad/s ; \\(T_0 \\approx 0{,}63\\) s. Le poids déplace l\'équilibre mais ne change pas la période.' } }
      ],
      amorti: [
        { h: 'Calcul guidé : reconnaître le régime',
          body: `${guided}<p>\\(m = 1\\) kg, \\(k = 100\\) N/m, frottement \\(\\alpha = 4\\) kg/s.</p>
            <ol><li>\\(\\omega_0 = \\sqrt{k/m}\\).</li><li>\\(\\lambda = \\dfrac{\\alpha}{2m}\\) (attention au 2).</li><li>Compare, puis pseudo-pulsation \\(\\omega = \\sqrt{\\omega_0^2 - \\lambda^2}\\) si besoin.</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('\\lambda', 2, 's⁻¹'), Nn('\\omega', Math.sqrt(96), 'rad/s'), Nn('Q', 2.5)], why: '\\(\\omega_0 = 10\\), \\(\\lambda = 2\\) : pseudo-périodique ; \\(\\omega = \\sqrt{96} \\approx 9{,}8\\) rad/s ; \\(Q = \\omega_0/(2\\lambda) = 2{,}5\\).' } }
      ],
      force: [
        { h: 'Calcul guidé : amplitude à la résonance',
          body: `${guided}<p>\\(\\omega_0 = 10\\) rad/s, \\(\\lambda = 1\\) s⁻¹, \\(F_0/m = 20\\) m/s².</p>
            <ol><li>Loin de la résonance, en très basse fréquence (\\(\\omega \\to 0\\)) : \\(A = \\dfrac{F_0/m}{\\omega_0^2}\\).</li><li>À \\(\\omega = \\omega_0\\) : \\(A = \\dfrac{F_0/m}{2\\lambda\\omega_0}\\).</li></ol>`,
          ask: { q: 'Amplitudes :', items: [Nn('A(0)', 0.2, 'm'), Nn('A(\\omega_0)', 1, 'm')], why: '\\(20/100 = 0{,}2\\) m ; \\(20/(2\\times1\\times10) = 1\\) m : cinq fois plus, c\'est le facteur de qualité \\(Q = 5\\).' } }
      ],
      moment: [
        { h: 'Calcul guidé : le pendule par le moment cinétique',
          body: `${guided}<p>Pendule de longueur \\(\\ell\\), masse \\(m\\), angle \\(\\theta\\).</p>
            <ol><li>\\(L_O = m\\ell^2\\dot\\theta\\) (vitesse \\(\\ell\\dot\\theta\\), perpendiculaire au fil).</li><li>Moment du poids en O : \\(-mg\\ell\\sin\\theta\\) (la tension passe par O : moment nul).</li><li>TMC : \\(m\\ell^2\\ddot\\theta = -mg\\ell\\sin\\theta\\).</li></ol>`,
          ask: { q: 'On obtient :', items: [Ch('équation', [['a', '\\(\\ddot\\theta + \\dfrac g\\ell\\sin\\theta = 0\\)'], ['b', '\\(\\ddot\\theta + \\dfrac\\ell g\\sin\\theta = 0\\)'], ['c', '\\(\\ddot\\theta + g\\ell\\theta = 0\\)']], 'a')], why: 'On divise par \\(m\\ell^2\\) : \\(\\ddot\\theta + \\dfrac g\\ell\\sin\\theta = 0\\), la même équation que par le PFD. Petits angles : \\(\\omega_0 = \\sqrt{g/\\ell}\\).' } }
      ],
      kepler: [
        { h: 'Calcul guidé : le satellite géostationnaire',
          body: `${guided}<p>Un satellite géostationnaire tourne en 1 jour. La Lune met environ 27 jours, à environ 384 000 km du centre de la Terre.</p>
            <ol><li>Kepler : \\(\\dfrac{T^2}{r^3}\\) est le même pour les deux.</li><li>Donc \\(r_{geo} = r_{Lune}\\left(\\dfrac{T_{geo}}{T_{Lune}}\\right)^{2/3}\\).</li><li>\\((1/27)^{2/3} = 1/9\\).</li></ol>`,
          ask: { q: 'Rayon de l\'orbite géostationnaire (en km) ≈', items: [Nn('r_{geo}\\ (\\mathrm{km})', 384000 / 9)], why: '\\(384\\,000 / 9 \\approx 42\\,700\\) km depuis le centre de la Terre, soit environ 36 000 km d\'altitude (le rayon terrestre fait 6 400 km).' } }
      ]
    };
    Object.entries(MORE).forEach(([k, st]) => { if (L[k]) L[k].steps.push(...st); });
    return L;
  };
})();
