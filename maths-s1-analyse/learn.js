/* =====================================================================
   Leçons « Comprendre » d'analyse, maths S1 CC2 (L. Albera : complexes, dérivées et limites, développements
   limités, intégrales, suites). Une leçon par compétence du parcours (clé = id de SK dans index.html) : le sens
   géométrique ou intuitif, une prédiction « Devine d'abord », l'explication, une question sans enjeu.
   meth sert d'indice dans les exercices.
   H = { Ch, Nn, Ex, K, esc } : Ch(étiquette HTML, [[valeur, texte]], bonne valeur), Nn(étiquette TeX, valeur).
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function (H) {
    const { Ch, Nn } = H;
    const num = (lab, val) => Object.assign(Nn(lab, val), { tol: 0.02 });   // réponse décimale arrondie acceptée (2 %)
    return {
      /* =================== Complexes =================== */
      cform: { title: 'Calculer avec le nombre i', meth: 'on calcule comme avec des polynômes en remplaçant \\(i^2\\) par \\(-1\\) ; pour diviser, on multiplie en haut et en bas par le conjugué du dénominateur ; Moivre : \\((\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta\\).', steps: [
        { h: 'Un nombre, c\'est un point du plan',
          guess: { q: 'Multiplier un nombre complexe par \\(i\\), géométriquement, c\'est :', items: [Ch('réponse', [['r', 'le faire tourner d\'un quart de tour'], ['s', 'le symétriser par rapport à l\'axe réel'], ['d', 'le doubler']], 'r')] },
          body: `<p>\\(z = a + ib\\) se représente par le point \\((a, b)\\). Multiplier par \\(i\\) donne \\(ia + i^2b = -b + ia\\) : le point \\((a, b)\\) devient \\((-b, a)\\), il a tourné de 90°. Deux quarts de tour, c'est un demi-tour : \\(i^2 = -1\\). C'est tout le sens de \\(i\\).</p>
            <p>Calculs : on développe comme d'habitude, en remplaçant \\(i^2\\) par \\(-1\\). Pour une division, on multiplie par le <b>conjugué</b> \\(\\bar z = a - ib\\) du dénominateur, car \\(z\\bar z = a^2 + b^2\\) est réel.</p>`,
          ask: { q: 'Partie réelle de \\((2 + i)(3 - i)\\) ?', items: [Nn('\\mathrm{Re}', 7)], why: '\\(6 - 2i + 3i - i^2 = 6 + i + 1 = 7 + i\\) : partie réelle 7.' } },
        { h: 'Diviser grâce au conjugué',
          body: `<p>\\(\\dfrac{1}{1 + i} = \\dfrac{1 - i}{(1 + i)(1 - i)} = \\dfrac{1 - i}{1 + 1} = \\dfrac12 - \\dfrac12 i\\). Le dénominateur \\((1 + i)(1 - i) = 1 - i^2 = 2\\) est devenu réel : c'est le but du conjugué.</p>`,
          ask: { q: 'Partie imaginaire de \\(\\dfrac{2}{1 - i}\\) ?', items: [Nn('\\mathrm{Im}', 1)], why: '\\(\\dfrac{2(1 + i)}{(1 - i)(1 + i)} = \\dfrac{2 + 2i}{2} = 1 + i\\) : partie imaginaire 1.' } }
      ] },

      cexp: { title: 'Module, argument, forme exponentielle', meth: '\\(|z| = \\sqrt{a^2 + b^2}\\) (distance à O), l\'argument est l\'angle avec l\'axe réel (lis le quadrant sur un dessin) ; \\(z = |z|e^{i\\theta}\\) ; en multipliant, les modules se multiplient et les arguments s\'ajoutent.', steps: [
        { h: 'Une distance et un angle',
          guess: { q: 'Quel est le module de \\(3 + 4i\\) ?', items: [Nn('|z|', 5)] },
          body: `<p>Au lieu de repérer le point par \\((a, b)\\), on peut donner sa <b>distance</b> à O (le module \\(|z| = \\sqrt{a^2 + b^2}\\), Pythagore) et son <b>angle</b> avec l'axe réel (l'argument \\(\\theta\\)). Alors \\(z = |z|(\\cos\\theta + i\\sin\\theta) = |z|\\,e^{i\\theta}\\).</p>
            <p>L'intérêt : multiplier devient simple, \\(r_1e^{i\\theta_1}\\times r_2e^{i\\theta_2} = r_1r_2\\,e^{i(\\theta_1 + \\theta_2)}\\). Les distances se multiplient, les angles s'ajoutent (multiplier par \\(i = e^{i\\pi/2}\\), c'est tourner de \\(\\pi/2\\)).</p>
            <p>Piège de l'argument : \\(\\tan\\theta = b/a\\) ne suffit pas, il faut regarder le <b>quadrant</b> sur un dessin.</p>`,
          ask: { q: 'Argument de \\(-1 + i\\) (dans \\(]-\\pi, \\pi]\\)) ?', items: [Ch('\\(\\theta\\)', [['a', '\\(\\dfrac{\\pi}{4}\\)'], ['b', '\\(\\dfrac{3\\pi}{4}\\)'], ['c', '\\(-\\dfrac{\\pi}{4}\\)']], 'b')], why: 'Le point \\((-1, 1)\\) est en haut à gauche : \\(\\dfrac{3\\pi}{4}\\). \\(\\arctan(-1) = -\\dfrac\\pi4\\) donnerait le mauvais quadrant.' } }
      ] },

      cracines: { title: 'Racines et équations dans ℂ', meth: 'second degré : \\(\\Delta < 0\\) donne deux racines conjuguées \\(\\dfrac{-b \\pm i\\sqrt{-\\Delta}}{2a}\\) ; racines \\(n\\)-ièmes de \\(re^{i\\theta}\\) : module \\(r^{1/n}\\), arguments \\(\\dfrac{\\theta + 2k\\pi}{n}\\), \\(k = 0, \\dots, n - 1\\).', steps: [
        { h: 'Plus de discriminant négatif qui bloque',
          guess: { q: 'Combien de solutions complexes a \\(z^2 + z + 1 = 0\\) ?', items: [Nn('\\text{nombre}', 2)] },
          body: `<p>Dans \\(\\mathbb R\\), \\(\\Delta < 0\\) bloquait parce qu'on ne savait pas prendre \\(\\sqrt\\Delta\\). Dans \\(\\mathbb C\\), \\(-3 = (i\\sqrt3)^2\\) : on a toujours deux racines,</p>\\[z = \\frac{-b \\pm i\\sqrt{-\\Delta}}{2a} \\qquad\\text{ici}\\quad z = \\frac{-1 \\pm i\\sqrt3}{2}\\]
            <p>Elles sont conjuguées (coefficients réels). Plus généralement, une équation de degré \\(n\\) a toujours \\(n\\) racines dans \\(\\mathbb C\\) (comptées avec multiplicité).</p>`,
          ask: { q: 'Les racines cubiques de 1 sont réparties sur le cercle unité tous les :', items: [Ch('réponse', [['a', '\\(\\dfrac{2\\pi}{3}\\)'], ['b', '\\(\\dfrac{\\pi}{3}\\)'], ['c', '\\(\\pi\\)']], 'a')], why: 'Arguments \\(\\dfrac{0 + 2k\\pi}{3}\\) pour \\(k = 0, 1, 2\\) : un triangle équilatéral, un point tous les \\(\\dfrac{2\\pi}{3}\\).' } }
      ] },

      /* =================== Dérivées et limites =================== */
      deriv: { title: 'Dériver sans se tromper', meth: 'repère la structure (produit, quotient, composée) avant de dériver ; composée : \\((g\\circ u)\' = u\'\\times g\'(u)\\) ; produit : \\(u\'v + uv\'\\) ; quotient : \\(\\dfrac{u\'v - uv\'}{v^2}\\).', steps: [
        { h: 'La dérivée est une vitesse',
          guess: { q: 'Dérivée de \\(e^{3x}\\) ?', items: [Ch('réponse', [['a', '\\(e^{3x}\\)'], ['b', '\\(3e^{3x}\\)'], ['c', '\\(3xe^{3x - 1}\\)']], 'b')] },
          body: `<p>\\(f'(x)\\) est la vitesse à laquelle \\(f\\) varie quand \\(x\\) avance. Pour une composée \\(g(u(x))\\) : quand \\(x\\) avance, \\(u\\) avance \\(u'\\) fois plus vite, et \\(g\\) réagit à \\(u\\) avec la vitesse \\(g'(u)\\). Les vitesses se multiplient :</p>\\[(g\\circ u)' = u'\\times g'(u)\\]
            <p>\\(e^{3x}\\) : \\(u = 3x\\), \\(u' = 3\\), donc \\(3e^{3x}\\). \\(\\ln(x^2 + 1)\\) : \\(\\dfrac{2x}{x^2 + 1}\\). Le réflexe : d'abord dire « c'est un produit / un quotient / une composée de… », puis appliquer la règle.</p>`,
          ask: { q: 'Valeur en \\(x = 0\\) de la dérivée de \\(f(x) = x\\,e^{2x}\\) ?', items: [Nn("f'(0)", 1)], why: 'Produit : \\(f\'(x) = e^{2x} + 2xe^{2x}\\), donc \\(f\'(0) = 1\\).' } }
      ] },

      etude: { title: 'Étudier une fonction', meth: 'domaine, dérivée factorisée, signe de chaque facteur dans un tableau, variations, valeurs aux bornes et limites ; un extremum est là où \\(f\'\\) s\'annule en changeant de signe.', steps: [
        { h: 'Le signe de f\' raconte la courbe',
          guess: { q: '\\(f\'\\) s\'annule en \\(a\\) en passant de négatif à positif. En \\(a\\), \\(f\\) a :', items: [Ch('réponse', [['min', 'un minimum local'], ['max', 'un maximum local'], ['rien', 'ni l\'un ni l\'autre']], 'min')] },
          body: `<p>\\(f' < 0\\) : la courbe descend ; \\(f' > 0\\) : elle monte. Si elle descend puis monte, il y a un creux : un <b>minimum</b>. C'est pour ça qu'on veut le <b>signe</b> de \\(f'\\), donc qu'on la <b>factorise</b> : le signe d'un produit se lit facteur par facteur dans un tableau.</p>
            <p>Exemple des annales : \\(f(x) = x^2\\ln x - x^2\\) sur \\(]0, +\\infty[\\). \\(f'(x) = 2x\\ln x + x - 2x = x(2\\ln x - 1)\\). \\(x > 0\\), et \\(2\\ln x - 1 > 0\\) dès que \\(x > \\sqrt e\\) : \\(f\\) décroît puis croît, minimum en \\(\\sqrt e\\).</p>`,
          ask: { q: 'Valeur du minimum \\(f(\\sqrt e)\\) pour \\(f(x) = x^2\\ln x - x^2\\) ?', items: [num('f(\\sqrt e)', -Math.E / 2)], why: '\\(x^2 = e\\) et \\(\\ln\\sqrt e = \\dfrac12\\) : \\(f = \\dfrac e2 - e = -\\dfrac e2 \\approx -1{,}36\\).' } }
      ] },

      limites: { title: 'Limites : qui gagne ?', meth: 'forme indéterminée → factoriser par le terme dominant, ou croissances comparées (l\'exponentielle bat les puissances, qui battent le logarithme), ou un DL ; on ne conclut jamais « \\(\\infty - \\infty = 0\\) ».', steps: [
        { h: 'Les croissances comparées',
          guess: { q: 'Quand \\(x \\to +\\infty\\), \\(\\dfrac{x^{10}}{e^x}\\) tend vers :', items: [Ch('réponse', [['0', '0'], ['inf', '\\(+\\infty\\)'], ['1', '1']], '0')] },
          body: `<p>Au départ \\(x^{10}\\) est énorme, mais l'exponentielle finit toujours par gagner : chaque fois que \\(x\\) augmente de 1, \\(e^x\\) est multiplié par 2,7, alors que \\(x^{10}\\) grandit de moins en moins en proportion. Classement à l'infini : \\(\\ln x \\ll x^a \\ll e^x\\).</p>
            <p>Les formes indéterminées (\\(\\infty - \\infty\\), \\(0\\times\\infty\\), \\(\\infty/\\infty\\), \\(0/0\\)) se lèvent en factorisant par le terme qui gagne, ou par un développement limité.</p>`,
          ask: { q: '\\(\\displaystyle\\lim_{x\\to0^+} x\\ln x\\) = ?', items: [Nn('\\ell', 0)], why: 'Forme \\(0\\times(-\\infty)\\) ; la puissance gagne contre le logarithme : la limite est 0.' } }
      ] },

      /* =================== Développements limités =================== */
      dlusuels: { title: 'Les DL usuels : approcher par un polynôme', meth: 'au voisinage de 0 : \\(e^x = 1 + x + \\frac{x^2}{2} + \\dots\\), \\(\\ln(1 + x) = x - \\frac{x^2}{2} + \\dots\\), \\((1 + x)^\\alpha = 1 + \\alpha x + \\frac{\\alpha(\\alpha - 1)}{2}x^2 + \\dots\\) ; somme et produit de DL en tronquant au bon ordre.', steps: [
        { h: 'Zoomer sur une courbe',
          guess: { q: 'Pour \\(x\\) très proche de 0, \\(e^x\\) vaut environ :', items: [Ch('réponse', [['a', '\\(1 + x\\)'], ['b', '\\(x\\)'], ['c', '\\(1\\)']], 'a')] },
          body: `<p>En zoomant sur une courbe autour de 0, elle ressemble à sa tangente : \\(e^x \\approx 1 + x\\). En zoomant moins, on voit qu'elle se courbe : on ajoute \\(\\dfrac{x^2}{2}\\), etc. Un DL à l'ordre \\(n\\), c'est la meilleure approximation par un polynôme de degré \\(n\\), avec une erreur \\(o(x^n)\\) (négligeable devant \\(x^n\\)).</p>
            <p>À connaître : \\(e^x\\), \\(\\ln(1 + x)\\), \\((1 + x)^\\alpha\\), \\(\\cos\\), \\(\\sin\\), \\(\\dfrac{1}{1 - x} = 1 + x + x^2 + \\dots\\). Par exemple \\(\\sqrt{1 + x} = (1 + x)^{1/2} = 1 + \\dfrac x2 - \\dfrac{x^2}{8} + o(x^2)\\).</p>`,
          ask: { q: 'Coefficient de \\(x^2\\) dans le DL de \\(e^x\\ln(1 + x)\\) à l\'ordre 2 ?', items: [num('a_2', 0.5)], why: '\\((1 + x)(x - \\frac{x^2}{2}) = x - \\frac{x^2}{2} + x^2 + o(x^2) = x + \\frac{x^2}{2} + o(x^2)\\) : coefficient \\(\\frac12\\).' } }
      ] },

      dltaylor: { title: 'Le DL par la formule de Taylor', meth: '\\(f(x) = f(0) + f\'(0)x + \\dfrac{f\'\'(0)}{2}x^2 + \\dots + \\dfrac{f^{(n)}(0)}{n!}x^n + o(x^n)\\) : on calcule les dérivées successives en 0.', steps: [
        { h: 'Chaque coefficient vient d\'une dérivée',
          guess: { q: 'Si \\(f(x) = a_0 + a_1x + a_2x^2\\), que vaut \\(f\'\'(0)\\) ?', items: [Ch('réponse', [['a', '\\(a_2\\)'], ['b', '\\(2a_2\\)'], ['c', '\\(a_1\\)']], 'b')] },
          body: `<p>Pour un polynôme, \\(f(0) = a_0\\), \\(f'(0) = a_1\\), \\(f''(0) = 2a_2\\), et en général \\(f^{(k)}(0) = k!\\,a_k\\). Donc \\(a_k = \\dfrac{f^{(k)}(0)}{k!}\\). La formule de Taylor étend cette idée à toute fonction assez dérivable :</p>\\[f(x) = \\sum_{k=0}^{n}\\frac{f^{(k)}(0)}{k!}x^k + o(x^n)\\]`,
          ask: { q: '\\(f(0) = 1\\), \\(f\'(0) = 2\\), \\(f\'\'(0) = 6\\). Coefficient de \\(x^2\\) dans le DL ?', items: [Nn('a_2', 3)], why: '\\(\\dfrac{f\'\'(0)}{2!} = \\dfrac62 = 3\\).' } }
      ] },

      dllim: { title: 'Lever une indétermination avec un DL', meth: 'remplace chaque fonction par son DL au même ordre, simplifie : le premier terme non nul du numérateur et du dénominateur donne la limite ; si le terme se simplifie à 0, va un ordre plus loin.', steps: [
        { h: 'Garder juste assez de termes',
          guess: { q: '\\(\\displaystyle\\lim_{x\\to0}\\frac{e^x - 1 - x}{x^2}\\) = ?', items: [num('\\ell', 0.5)] },
          body: `<p>Forme \\(\\dfrac00\\). Avec \\(e^x = 1 + x + \\dfrac{x^2}{2} + o(x^2)\\), le numérateur vaut \\(\\dfrac{x^2}{2} + o(x^2)\\) : le \\(1\\) et le \\(x\\) se sont simplifiés. Donc le quotient tend vers \\(\\dfrac12\\).</p>
            <p>Règle de l'ordre : il faut pousser le DL jusqu'au premier terme qui <b>ne s'annule pas</b>. À l'ordre 1, on aurait trouvé \\(\\dfrac{o(x)}{x^2}\\) : impossible de conclure.</p>`,
          ask: { q: '\\(\\displaystyle\\lim_{x\\to0}\\frac{\\ln(1 + x) - x}{x^2}\\) = ?', items: [num('\\ell', -0.5)], why: '\\(\\ln(1 + x) - x = -\\dfrac{x^2}{2} + o(x^2)\\), donc la limite vaut \\(-\\dfrac12\\).' } }
      ] },

      /* =================== Intégrales =================== */
      riemann: { title: 'L\'intégrale comme une aire', meth: 'l\'intégrale de Riemann est la limite des sommes d\'aires de rectangles ; une fonction continue (ou monotone) sur un segment est intégrable ; \\(\\dfrac{b - a}{n}\\sum f(x_k) \\to \\int_a^b f\\).', steps: [
        { h: 'Découper en rectangles',
          guess: { q: 'Que vaut \\(\\displaystyle\\lim_{n\\to\\infty}\\frac1n\\sum_{k=1}^{n}\\frac kn\\) ?', items: [num('\\ell', 0.5)] },
          body: `<p>Pour calculer l'aire sous une courbe entre \\(a\\) et \\(b\\), on la découpe en \\(n\\) bandes de largeur \\(\\dfrac{b - a}{n}\\), on approche chaque bande par un rectangle, et on fait tendre \\(n\\) vers l'infini. La somme des aires des rectangles tend vers l'intégrale (somme de Riemann) :</p>\\[\\frac1n\\sum_{k=1}^{n}f\\Big(\\frac kn\\Big) \\xrightarrow[n\\to\\infty]{} \\int_0^1 f(x)\\,dx\\]
            <p>Avec \\(f(x) = x\\) : \\(\\int_0^1 x\\,dx = \\dfrac12\\), l'aire d'un triangle.</p>`,
          ask: { q: '\\(\\displaystyle\\lim_{n\\to\\infty}\\frac1n\\sum_{k=1}^{n}\\Big(\\frac kn\\Big)^2\\) = ?', items: [num('\\ell', 1 / 3)], why: 'Somme de Riemann de \\(x^2\\) sur \\([0, 1]\\) : \\(\\int_0^1 x^2\\,dx = \\dfrac13\\).' } }
      ] },

      prim: { title: 'Primitives et intégration par parties', meth: 'reconnais une forme \\(u\'g\'(u)\\) (par exemple \\(\\frac{u\'}{u}\\to\\ln|u|\\)) ; sinon intégration par parties \\(\\int u v\' = [uv] - \\int u\'v\\), en dérivant le facteur qui se simplifie (polynôme, ln).', steps: [
        { h: 'Reconnaître une dérivée de composée',
          guess: { q: 'Une primitive de \\(\\dfrac{2x}{x^2 + 1}\\) est :', items: [Ch('réponse', [['a', '\\(\\ln(x^2 + 1)\\)'], ['b', '\\(\\dfrac{1}{x^2 + 1}\\)'], ['c', '\\(2x\\ln x\\)']], 'a')] },
          body: `<p>Primitiver, c'est dériver à l'envers : on cherche une forme connue. \\(2x\\) est la dérivée de \\(x^2 + 1\\), donc on a \\(\\dfrac{u'}{u}\\), dérivée de \\(\\ln|u|\\).</p>
            <p>Si rien ne se reconnaît, l'<b>intégration par parties</b> transforme un produit : \\(\\int u\\,v' = [uv] - \\int u'\\,v\\). On choisit \\(u\\) = le facteur qui se <b>simplifie</b> en dérivant (un polynôme, \\(\\ln x\\)). Exemple : \\(\\int x e^x\\,dx\\), \\(u = x\\), \\(v' = e^x\\) : \\(xe^x - \\int e^x = (x - 1)e^x\\).</p>`,
          ask: { q: '\\(\\displaystyle\\int_0^1 x e^x\\,dx\\) = ?', items: [Nn('I', 1)], why: '\\([(x - 1)e^x]_0^1 = 0 - (-1) = 1\\).' } }
      ] },

      integ: { title: 'Intégrales définies', meth: '\\(\\int_a^b f = F(b) - F(a)\\) avec \\(F\\) une primitive ; changement de variable : on change aussi les bornes et le \\(dx\\) ; la parité ou une symétrie peut éviter le calcul.', steps: [
        { h: 'Une aire avec un signe',
          guess: { q: '\\(\\displaystyle\\int_{-1}^{1} x^3\\,dx\\) = ?', items: [Nn('I', 0)] },
          body: `<p>L'intégrale compte l'aire au-dessus de l'axe en positif et en dessous en négatif. \\(x^3\\) est impaire : l'aire à gauche (négative) compense exactement celle à droite. Résultat 0 sans calcul.</p>
            <p>Changement de variable \\(x = \\varphi(t)\\) : on remplace \\(x\\), on remplace \\(dx\\) par \\(\\varphi'(t)\\,dt\\), et on <b>change les bornes</b>. Exemple des annales : \\(x = 1/t\\) transforme une intégrale sur \\([1/2, 2]\\) en une intégrale sur \\([2, 1/2]\\).</p>`,
          ask: { q: '\\(\\displaystyle\\int_0^{\\pi} \\sin x\\,dx\\) = ?', items: [Nn('I', 2)], why: '\\([-\\cos x]_0^{\\pi} = 1 - (-1) = 2\\).' } }
      ] },

      elts: { title: 'Décomposition en éléments simples', meth: 'factorise le dénominateur ; écris \\(\\dfrac{A}{x - a} + \\dfrac{B}{x - b}\\) ; multiplie par \\((x - a)\\) et fais \\(x = a\\) pour trouver \\(A\\) (idem pour \\(B\\)) ; chaque terme s\'intègre en \\(\\ln\\).', steps: [
        { h: 'Casser une fraction en morceaux faciles',
          guess: { q: '\\(\\dfrac{1}{x(x + 1)}\\) est égal à :', items: [Ch('réponse', [['a', '\\(\\dfrac1x - \\dfrac{1}{x + 1}\\)'], ['b', '\\(\\dfrac1x + \\dfrac{1}{x + 1}\\)'], ['c', '\\(\\dfrac{1}{x + 1} - \\dfrac1x\\)']], 'a')] },
          body: `<p>\\(\\dfrac{1}{x(x + 1)}\\) ne s'intègre pas directement, mais \\(\\dfrac1x\\) et \\(\\dfrac{1}{x + 1}\\) oui (en \\(\\ln\\)). On cherche \\(A\\) et \\(B\\) avec \\(\\dfrac{1}{x(x + 1)} = \\dfrac Ax + \\dfrac{B}{x + 1}\\).</p>
            <p>Astuce : multiplier par \\(x\\) puis faire \\(x = 0\\) donne \\(A = \\dfrac{1}{0 + 1} = 1\\) ; multiplier par \\(x + 1\\) puis faire \\(x = -1\\) donne \\(B = \\dfrac{1}{-1} = -1\\). Vérification : \\(\\dfrac1x - \\dfrac{1}{x + 1} = \\dfrac{x + 1 - x}{x(x + 1)}\\). ✓</p>`,
          ask: { q: '\\(\\dfrac{1}{(x - 1)(x - 3)} = \\dfrac{A}{x - 1} + \\dfrac{B}{x - 3}\\). \\(B\\) = ?', items: [num('B', 0.5)], why: 'Multiplier par \\(x - 3\\) et faire \\(x = 3\\) : \\(B = \\dfrac{1}{3 - 1} = \\dfrac12\\) (et \\(A = -\\dfrac12\\)).' } }
      ] },

      /* =================== Suites =================== */
      suites: { title: 'Suites : limites et variations', meth: 'variations : signe de \\(u_{n+1} - u_n\\) (ou \\(u_{n+1}/u_n\\) comparé à 1 si \\(u_n > 0\\)) ; une suite croissante majorée converge ; pour la limite, croissances comparées ou passage à la limite dans \\(u_{n+1} = f(u_n)\\).', steps: [
        { h: 'Monter sans dépasser un plafond',
          guess: { q: 'Une suite croissante et majorée par 10 :', items: [Ch('réponse', [['c', 'converge (vers une limite ≤ 10)'], ['d', 'peut tendre vers \\(+\\infty\\)'], ['o', 'peut osciller']], 'c')] },
          body: `<p>Une suite qui monte toujours mais ne peut pas dépasser un plafond finit par « s'écraser » contre une valeur : elle <b>converge</b> (théorème de la limite monotone). La limite n'est pas forcément le plafond donné, elle est seulement en dessous.</p>
            <p>Pour les variations, on étudie le signe de \\(u_{n+1} - u_n\\). Pour une suite \\(u_{n+1} = f(u_n)\\) qui converge vers \\(\\ell\\) (avec \\(f\\) continue), la limite vérifie \\(\\ell = f(\\ell)\\).</p>`,
          ask: { q: '\\(u_{n+1} = \\dfrac{u_n}{2} + 1\\) converge. Sa limite \\(\\ell\\) = ?', items: [Nn('\\ell', 2)], why: '\\(\\ell = \\dfrac\\ell2 + 1\\), donc \\(\\dfrac\\ell2 = 1\\), \\(\\ell = 2\\).' } }
      ] }
    };
  };
})();
