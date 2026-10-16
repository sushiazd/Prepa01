/* =====================================================================
   PROBLÈME DU JOUR — banque de problèmes (onglet « Problème du jour » de index.html)
   Des problèmes qui demandent une idée (astuce, symétrie, changement de point de vue)
   plutôt qu'une méthode du cours, au niveau Terminale spé maths / début de L1.
   Champs : id (clé de la progression, ne jamais la changer), t titre, th thème, d difficulté 1 à 3,
   q énoncé, a réponse (nombre), ans réponse affichée (LaTeX), fmt forme attendue, tol tolérance (sinon
   réponse exacte), h indices progressifs, s solution. Toutes les réponses ont été vérifiées par calcul
   (sommes, dénombrements par force brute, intégrales numériques).
   Le problème du jour n est PDJ_BANK[n % longueur] : ajouter les nouveaux problèmes à la fin, pour ne pas
   changer ceux des jours déjà passés pendant le premier tour.
   ===================================================================== */
(function () {
  const R = String.raw;
  window.PDJ_START = '2026-10-10';   // jour n° 0
  window.PDJ_BANK = [
    {
      id: 'racines', t: 'Racines en cascade', th: 'Sommes', d: 2,
      q: R`Calculer \[S=\frac{1}{\sqrt1+\sqrt2}+\frac{1}{\sqrt2+\sqrt3}+\frac{1}{\sqrt3+\sqrt4}+\cdots+\frac{1}{\sqrt{99}+\sqrt{100}}.\]`,
      a: 9, ans: R`9`, fmt: 'un entier',
      h: [R`Chaque terme a un dénominateur de la forme \(\sqrt k+\sqrt{k+1}\). Que donne la multiplication par la quantité conjuguée ?`,
        R`\(\dfrac{1}{\sqrt k+\sqrt{k+1}}=\dfrac{\sqrt{k+1}-\sqrt k}{(k+1)-k}=\sqrt{k+1}-\sqrt k\).`,
        R`Écris la somme avec cette forme : presque tout se simplifie (somme télescopique).`],
      s: R`<p>En multipliant par la quantité conjuguée, \(\dfrac{1}{\sqrt k+\sqrt{k+1}}=\sqrt{k+1}-\sqrt k\) car \((\sqrt{k+1}+\sqrt k)(\sqrt{k+1}-\sqrt k)=1\).</p>
        <p>Donc \(S=(\sqrt2-\sqrt1)+(\sqrt3-\sqrt2)+\cdots+(\sqrt{100}-\sqrt{99})\). Chaque racine intermédiaire apparaît une fois avec \(+\) et une fois avec \(-\) : il reste \(S=\sqrt{100}-\sqrt1=10-1=9\).</p>`
    },
    {
      id: 'piles11', t: 'Onze contre dix', th: 'Probabilités', d: 2,
      q: R`Alice lance 11 pièces équilibrées, Bob en lance 10. Quelle est la probabilité qu'Alice obtienne strictement plus de « pile » que Bob ?`,
      a: 0.5, ans: R`\dfrac12`, fmt: 'une fraction ou un décimal',
      h: [R`Pas besoin de loi binomiale : mets de côté la 11<sup>e</sup> pièce d'Alice et compare d'abord 10 pièces contre 10 pièces.`,
        R`Après 10 pièces chacun, appelle \(p\) la probabilité qu'Alice mène, \(p\) aussi celle que Bob mène (symétrie), et \(q\) celle d'une égalité. Que vaut \(2p+q\) ?`,
        R`Alice gagne si elle menait déjà, ou s'il y avait égalité et que sa 11<sup>e</sup> pièce tombe sur pile.`],
      s: R`<p>Comparons d'abord les 10 premières pièces d'Alice aux 10 pièces de Bob. Par symétrie, Alice mène avec une probabilité \(p\), Bob mène avec la même probabilité \(p\), et il y a égalité avec une probabilité \(q\), où \(2p+q=1\).</p>
        <p>Lançons la 11<sup>e</sup> pièce d'Alice : si Alice menait, elle reste devant ; si Bob menait, il ne peut pas être dépassé (au mieux égalité) ; en cas d'égalité, Alice passe devant si la pièce donne pile, avec probabilité \(\frac12\).</p>
        <p>La probabilité cherchée est donc \(p+\frac q2=\frac{2p+q}{2}=\frac12\). Le résultat ne dépend même pas du nombre de pièces, tant qu'Alice en a une de plus.</p>`
    },
    {
      id: 'fourmi', t: 'La fourmi sur le cube', th: 'Géométrie', d: 2,
      q: R`Une fourmi est posée sur un sommet d'un cube d'arête 1. Elle veut rejoindre le sommet opposé (le plus éloigné) en marchant sur la surface du cube. Quelle est la longueur du plus court chemin ?`,
      a: Math.sqrt(5), ans: R`\sqrt5`, fmt: 'valeur exacte, par exemple sqrt(2)',
      h: [R`La diagonale intérieure \(\sqrt3\) est interdite (la fourmi ne traverse pas le cube), et passer par une arête puis une diagonale de face donne \(1+\sqrt2\). On peut faire mieux.`,
        R`Déplie le cube : pose à plat deux faces voisines que la fourmi traverse.`,
        R`Dépliées, les deux faces forment un rectangle \(1\times2\) ; le départ et l'arrivée sont deux coins opposés de ce rectangle.`],
      s: R`<p>Le chemin traverse au moins deux faces. En dépliant deux faces adjacentes, on obtient un rectangle de côtés 1 et 2, et le départ et l'arrivée sont deux coins opposés de ce rectangle.</p>
        <p>Dans le plan, le plus court chemin est le segment : longueur \(\sqrt{1^2+2^2}=\sqrt5\approx2{,}236\), mieux que \(1+\sqrt2\approx2{,}414\). Ce segment coupe l'arête commune en son milieu : sur le cube, la fourmi vise le milieu d'une arête.</p>`
    },
    {
      id: 'fonc12', t: 'Une équation sur les fonctions', th: 'Fonctions', d: 1,
      q: R`Une fonction \(f\) définie sur \(\mathbb R^*\) vérifie, pour tout réel \(x\neq0\), \[f(x)+2f\!\left(\frac1x\right)=3x.\] Que vaut \(f(2)\) ?`,
      a: -1, ans: R`-1`, fmt: 'un nombre',
      h: [R`Écris l'égalité pour \(x=2\) : elle fait intervenir \(f(2)\) et \(f\left(\frac12\right)\). Il manque une équation.`,
        R`Écris aussi l'égalité pour \(x=\frac12\). Tu obtiens un système de deux équations à deux inconnues.`],
      s: R`<p>Avec \(x=2\) : \(f(2)+2f\left(\frac12\right)=6\). Avec \(x=\frac12\) : \(f\left(\frac12\right)+2f(2)=\frac32\).</p>
        <p>En multipliant la seconde par 2 et en retranchant la première : \(4f(2)-f(2)=3-6\), donc \(3f(2)=-3\) et \(f(2)=-1\).</p>
        <p>Plus généralement, la même manœuvre (remplacer \(x\) par \(\frac1x\)) donne \(f(x)=\frac2x-x\), qui vérifie bien l'équation.</p>`
    },
    {
      id: 'echiquier', t: "L'échiquier écorné", th: 'Raisonnement', d: 2,
      q: R`On retire d'un échiquier \(8\times8\) deux cases situées dans des coins opposés (a1 et h8). Il reste 62 cases. De combien de façons peut-on recouvrir exactement ces 62 cases avec 31 dominos, chaque domino couvrant deux cases voisines ?`,
      a: 0, ans: R`0`, fmt: 'un entier',
      h: [R`N'essaie pas de compter les pavages : regarde les couleurs des cases.`,
        R`Un domino posé couvre toujours une case blanche et une case noire. De quelles couleurs sont les deux cases retirées ?`],
      s: R`<p>Deux coins opposés de l'échiquier ont la même couleur (a1 et h8 sont noires). Il reste donc 32 cases d'une couleur et 30 de l'autre.</p>
        <p>Or chaque domino couvre une case blanche et une case noire : 31 dominos couvriraient 31 cases de chaque couleur. C'est impossible, il y a donc <strong>0</strong> pavage. Le coloriage remplace une énumération impossible à la main.</p>`
    },
    {
      id: 'symetrie', t: 'Une symétrie cachée', th: 'Intégrales', d: 2,
      q: R`Calculer \[I=\int_0^{\pi/2}\frac{(\sin x)^{2026}}{(\sin x)^{2026}+(\cos x)^{2026}}\,\mathrm dx.\]`,
      a: Math.PI / 4, ans: R`\dfrac{\pi}{4}`, fmt: 'valeur exacte, par exemple pi/3',
      h: [R`Aucune primitive n'est accessible. Pose \(J\), la même intégrale avec \((\cos x)^{2026}\) au numérateur. Que vaut \(I+J\) ?`,
        R`Fais le changement de variable \(u=\frac\pi2-x\) dans \(I\) : que deviennent \(\sin x\) et \(\cos x\) ?`],
      s: R`<p>Soit \(J\) l'intégrale analogue avec \((\cos x)^{2026}\) au numérateur. Alors \(I+J=\displaystyle\int_0^{\pi/2}1\,\mathrm dx=\frac\pi2\).</p>
        <p>Avec \(u=\frac\pi2-x\), on a \(\sin x=\cos u\), \(\cos x=\sin u\), et les bornes s'échangent (\(\mathrm dx=-\mathrm du\)) : \(I=\displaystyle\int_0^{\pi/2}\frac{(\cos u)^{2026}}{(\cos u)^{2026}+(\sin u)^{2026}}\,\mathrm du=J\).</p>
        <p>Donc \(2I=\frac\pi2\) et \(I=\frac\pi4\), quel que soit l'exposant.</p>`
    },
    {
      id: 'quatre', t: 'Quatre entiers consécutifs', th: 'Algèbre', d: 2,
      q: R`Calculer, sans calculatrice, \[\sqrt{2026\times2027\times2028\times2029+1}.\]`,
      a: 4110755, ans: R`4\,110\,755`, fmt: 'un entier',
      h: [R`Essaie sur de petits nombres : \(1\cdot2\cdot3\cdot4+1=25\), \(2\cdot3\cdot4\cdot5+1=121\), \(3\cdot4\cdot5\cdot6+1=361\)… Ce sont des carrés parfaits.`,
        R`Groupe les facteurs extrêmes et les facteurs du milieu : \(n(n+3)\) et \((n+1)(n+2)=n(n+3)+2\).`,
        R`Avec \(m=n^2+3n\), on obtient \(m(m+2)+1=(m+1)^2\).`],
      s: R`<p>Pour \(n\) entier, \(n(n+3)=n^2+3n\) et \((n+1)(n+2)=n^2+3n+2\). Avec \(m=n^2+3n\) : \[n(n+1)(n+2)(n+3)+1=m(m+2)+1=m^2+2m+1=(m+1)^2.\]</p>
        <p>Donc la racine vaut \(n^2+3n+1\). Pour \(n=2026\) : \(2026^2+3\times2026+1=4\,104\,676+6\,078+1=4\,110\,755\).</p>`
    },
    {
      id: 'rectangles', t: "Les rectangles de l'échiquier", th: 'Dénombrement', d: 1,
      q: R`Combien de rectangles (carrés compris), formés de cases entières, peut-on dessiner sur un échiquier \(8\times8\) ?`,
      a: 1296, ans: R`1296`, fmt: 'un entier',
      h: [R`Compter par taille de rectangle est long. Change de point de vue : un rectangle est délimité par des lignes du quadrillage.`,
        R`L'échiquier est tracé avec 9 lignes verticales et 9 lignes horizontales. Un rectangle correspond à un choix de 2 verticales et 2 horizontales.`],
      s: R`<p>Un rectangle est entièrement déterminé par ses deux côtés verticaux, choisis parmi les 9 lignes verticales du quadrillage, et ses deux côtés horizontaux, choisis parmi les 9 lignes horizontales.</p>
        <p>Il y en a donc \(\binom92\times\binom92=36\times36=1296\).</p>`
    },
    {
      id: 'inverse', t: "Passer à l'inverse", th: 'Suites', d: 2,
      q: R`La suite \((u_n)\) est définie par \(u_0=1\) et, pour tout \(n\in\mathbb N\), \[u_{n+1}=\frac{u_n}{1+u_n}.\] Que vaut \(u_{2025}\) ?`,
      a: 1 / 2026, ans: R`\dfrac{1}{2026}`, fmt: 'une fraction',
      h: [R`Calcule les premiers termes : \(u_1=\frac12\), \(u_2=\frac13\)… Conjecture, mais il faut une preuve.`,
        R`Regarde plutôt la suite \(v_n=\dfrac1{u_n}\) (tous les termes sont strictement positifs). Que vaut \(v_{n+1}\) en fonction de \(v_n\) ?`],
      s: R`<p>Par récurrence, \(u_n>0\) pour tout \(n\). On pose \(v_n=\frac1{u_n}\) : \(v_{n+1}=\dfrac{1+u_n}{u_n}=\dfrac1{u_n}+1=v_n+1\).</p>
        <p>La suite \((v_n)\) est arithmétique de raison 1 et \(v_0=1\), donc \(v_n=n+1\) et \(u_n=\dfrac1{n+1}\). Ainsi \(u_{2025}=\dfrac1{2026}\).</p>`
    },
    {
      id: 'premier6', t: 'Le premier qui fait 6', th: 'Probabilités', d: 2,
      q: R`Alice et Bob lancent un dé équilibré à tour de rôle, Alice commence. Le premier qui obtient un 6 gagne. Quelle est la probabilité qu'Alice gagne ?`,
      a: 6 / 11, ans: R`\dfrac{6}{11}`, fmt: 'une fraction',
      h: [R`On peut sommer une série géométrique, mais il y a plus rapide : appelle \(p\) la probabilité cherchée.`,
        R`Si Alice et Bob ratent tous les deux leur premier lancer (probabilité \(\frac56\times\frac56\)), la partie recommence exactement comme au début.`,
        R`Écris \(p=\frac16+\frac{25}{36}\,p\).`],
      s: R`<p>Soit \(p\) la probabilité qu'Alice gagne. Au premier tour : Alice gagne tout de suite avec probabilité \(\frac16\) ; sinon Bob gagne avec probabilité \(\frac16\) ; sinon (probabilité \(\frac56\cdot\frac56=\frac{25}{36}\)) on revient à la situation de départ.</p>
        <p>Donc \(p=\frac16+\frac{25}{36}p\), soit \(\frac{11}{36}p=\frac16\) et \(p=\frac{6}{11}\approx0{,}545\). Commencer donne un léger avantage.</p>`
    },
    {
      id: 'aires', t: 'Deux aires qui se complètent', th: 'Intégrales', d: 2,
      q: R`Calculer \[\int_0^1 e^x\,\mathrm dx+\int_1^e\ln x\,\mathrm dx.\] Une figure suffit, sans aucune primitive de \(\ln\).`,
      a: Math.E, ans: R`e`, fmt: 'valeur exacte (e, ln, sqrt…)',
      h: [R`Les courbes de \(\exp\) et de \(\ln\) sont symétriques par rapport à la droite \(y=x\).`,
        R`La première intégrale est l'aire sous la courbe de \(\exp\) entre \(x=0\) et \(x=1\). Par la symétrie, la seconde est l'aire comprise entre la courbe de \(\exp\) et l'axe des ordonnées, pour \(y\) entre 1 et \(e\).`,
        R`Ensemble, ces deux régions remplissent un rectangle. Lequel ?`],
      s: R`<p>La symétrie par rapport à \(y=x\) échange la courbe de \(\ln\) et celle de \(\exp\). Elle envoie la région sous la courbe de \(\ln\) (pour \(1\le x\le e\)) sur la région située à gauche de la courbe de \(\exp\), entre \(x=0\) et \(x=1\), pour \(1\le y\le e\).</p>
        <p>Cette région et la région sous la courbe de \(\exp\) sur \([0;1]\) se complètent exactement pour former le rectangle \([0;1]\times[0;e]\), d'aire \(e\). La somme vaut donc \(e\).</p>
        <p>Vérification : \((e-1)+\big[x\ln x-x\big]_1^e=(e-1)+1=e\).</p>`
    },
    {
      id: 'carnet', t: 'Cent affirmations', th: 'Logique', d: 2,
      q: R`Un carnet contient 100 affirmations numérotées de 1 à 100. L'affirmation n° \(k\) dit : « Exactement \(k\) des affirmations de ce carnet sont fausses. » Combien de ces affirmations sont vraies ?`,
      a: 1, ans: R`1`, fmt: 'un entier',
      h: [R`Deux affirmations différentes peuvent-elles être vraies en même temps ?`,
        R`Il y a donc au plus une affirmation vraie. Peut-il n'y en avoir aucune ? Regarde alors l'affirmation n° 100.`],
      s: R`<p>Les affirmations se contredisent deux à deux (elles donnent des nombres différents de fausses), donc au plus une est vraie.</p>
        <p>Si aucune n'était vraie, les 100 seraient fausses, et l'affirmation n° 100 serait vraie : contradiction. Il y a donc exactement <strong>une</strong> affirmation vraie, et 99 fausses : c'est l'affirmation n° 99, et tout est cohérent.</p>`
    },
    {
      id: 'sansresoudre', t: 'Sans résoudre', th: 'Algèbre', d: 1,
      q: R`Un réel \(x\) non nul vérifie \(x+\dfrac1x=3\). Que vaut \(x^4+\dfrac1{x^4}\) ?`,
      a: 47, ans: R`47`, fmt: 'un entier',
      h: [R`Inutile de calculer \(x\) (ce serait \(\frac{3\pm\sqrt5}2\)). Élève \(x+\frac1x\) au carré.`,
        R`\(\left(x+\frac1x\right)^2=x^2+2+\frac1{x^2}\), donc \(x^2+\frac1{x^2}=7\). Recommence.`],
      s: R`<p>\(\left(x+\frac1x\right)^2=x^2+\frac1{x^2}+2\), donc \(x^2+\frac1{x^2}=9-2=7\).</p>
        <p>De même \(\left(x^2+\frac1{x^2}\right)^2=x^4+\frac1{x^4}+2\), donc \(x^4+\frac1{x^4}=49-2=47\).</p>`
    },
    {
      id: 'tangente', t: 'Une seule solution', th: 'Fonctions', d: 2,
      q: R`Pour quelle valeur du réel \(a>0\) l'équation \(e^x=ax\) a-t-elle exactement une solution réelle ?`,
      a: Math.E, ans: R`e`, fmt: 'valeur exacte (e, ln, sqrt…)',
      h: [R`Interprète graphiquement : la droite \(y=ax\) passe par l'origine et coupe la courbe de \(\exp\).`,
        R`La courbe de \(\exp\) est convexe : une droite la coupe en 0, 1 ou 2 points. Une seule solution (avec \(a>0\)) correspond à une droite tangente.`,
        R`Cherche la tangente à la courbe de \(\exp\) qui passe par l'origine : au point d'abscisse \(t\), elle a pour équation \(y=e^t(x-t)+e^t\).`],
      s: R`<p>Pour \(a>0\), les solutions sont les abscisses des points communs à la droite \(y=ax\) et à la courbe convexe de \(\exp\). Il y en a exactement une lorsque la droite est tangente à la courbe.</p>
        <p>La tangente au point d'abscisse \(t\) est \(y=e^t(x-t)+e^t\) ; elle passe par l'origine si \(e^t(1-t)=0\), soit \(t=1\). C'est la droite \(y=ex\) : donc \(a=e\).</p>
        <p>Autre approche : pour \(x>0\), l'équation s'écrit \(a=\frac{e^x}{x}\), et \(g(x)=\frac{e^x}x\) décroît sur \(]0;1]\) puis croît, de minimum \(g(1)=e\). Pour \(0<a<e\) : aucune solution, pour \(a>e\) : deux.</p>`
    },
    {
      id: 'voisins', t: 'Des parties sans voisins', th: 'Dénombrement', d: 3,
      q: R`Combien de parties de \(\{1,2,\dots,10\}\) (la partie vide comprise) ne contiennent jamais deux entiers consécutifs ?`,
      a: 144, ans: R`144`, fmt: 'un entier',
      h: [R`Note \(a_n\) le nombre de telles parties de \(\{1,\dots,n\}\). Calcule \(a_1\), \(a_2\), \(a_3\) à la main.`,
        R`Distingue les parties qui contiennent \(n\) et celles qui ne le contiennent pas. Si \(n\) est dedans, \(n-1\) ne l'est pas.`,
        R`On obtient \(a_n=a_{n-1}+a_{n-2}\) avec \(a_1=2\) et \(a_2=3\).`],
      s: R`<p>Soit \(a_n\) le nombre de parties de \(\{1,\dots,n\}\) sans deux entiers consécutifs. Une telle partie :</p>
        <ul><li>ne contient pas \(n\) : c'est une partie convenable de \(\{1,\dots,n-1\}\), il y en a \(a_{n-1}\) ;</li>
        <li>contient \(n\) : alors elle ne contient pas \(n-1\), et le reste est une partie convenable de \(\{1,\dots,n-2\}\), il y en a \(a_{n-2}\).</li></ul>
        <p>Donc \(a_n=a_{n-1}+a_{n-2}\), avec \(a_1=2\) (\(\varnothing\), \(\{1\}\)) et \(a_2=3\). On trouve successivement 2, 3, 5, 8, 13, 21, 34, 55, 89, 144 : \(a_{10}=144\) (ce sont les nombres de Fibonacci).</p>`
    },
    {
      id: 'demicercle', t: 'Le carré dans le demi-cercle', th: 'Géométrie', d: 1,
      q: R`Un carré est inscrit dans un demi-disque de rayon 1 : un de ses côtés est posé sur le diamètre et ses deux autres sommets sont sur le demi-cercle. Quelle est l'aire du carré ?`,
      a: 0.8, ans: R`\dfrac45`, fmt: 'une fraction ou un décimal',
      h: [R`Par symétrie, le carré est centré sur le centre \(O\) du demi-disque.`,
        R`Si le côté vaut \(c\), un sommet du haut est à la distance horizontale \(\frac c2\) de \(O\) et à la hauteur \(c\). Il est sur le cercle de rayon 1.`],
      s: R`<p>Par symétrie, le carré est centré sur \(O\). Avec un côté \(c\), un sommet supérieur a pour coordonnées \(\left(\frac c2;c\right)\) dans un repère d'origine \(O\). Il est sur le cercle : \(\frac{c^2}4+c^2=1\), donc \(\frac54c^2=1\).</p>
        <p>L'aire vaut \(c^2=\frac45\).</p>`
    },
    {
      id: 'produitgeant', t: "La dérivée d'un produit géant", th: 'Fonctions', d: 2,
      q: R`Soit \(f(x)=(x-1)(x-2)(x-3)\cdots(x-10)\). Calculer \(f'(1)\).`,
      a: -362880, ans: R`-9!=-362\,880`, fmt: 'un entier',
      h: [R`Développer est hors de question. Écris \(f(x)=(x-1)\,g(x)\) avec \(g(x)=(x-2)\cdots(x-10)\).`,
        R`\(f'(x)=g(x)+(x-1)g'(x)\). Que vaut le second terme en \(x=1\) ?`],
      s: R`<p>Avec \(f(x)=(x-1)g(x)\) et \(g(x)=(x-2)(x-3)\cdots(x-10)\) : \(f'(x)=g(x)+(x-1)g'(x)\), donc \(f'(1)=g(1)\).</p>
        <p>\(g(1)=(-1)(-2)\cdots(-9)=(-1)^9\times9!=-362\,880\).</p>`
    },
    {
      id: 'doubles', t: 'Les doublés', th: 'Probabilités', d: 2,
      q: R`On lance 10 fois un dé équilibré. On appelle « doublé » deux lancers consécutifs qui donnent le même résultat (par exemple 4, 4, 4 compte deux doublés). Quelle est l'espérance du nombre de doublés ?`,
      a: 1.5, ans: R`\dfrac32`, fmt: 'une fraction ou un décimal',
      h: [R`La loi du nombre de doublés est compliquée, mais on ne demande que l'espérance.`,
        R`Écris le nombre de doublés comme une somme de 9 variables de Bernoulli : \(X_k=1\) si les lancers \(k\) et \(k+1\) sont égaux.`,
        R`L'espérance est linéaire, même si les \(X_k\) ne sont pas indépendantes.`],
      s: R`<p>Pour \(k\) de 1 à 9, soit \(X_k\) qui vaut 1 si les lancers \(k\) et \(k+1\) sont égaux, 0 sinon. Le nombre de doublés est \(X=X_1+\cdots+X_9\).</p>
        <p>Quel que soit le lancer \(k\), le suivant lui est égal avec probabilité \(\frac16\) : \(E(X_k)=\frac16\). Par linéarité de l'espérance (valable sans indépendance), \(E(X)=9\times\frac16=\frac32\).</p>`
    },
    {
      id: 'partieentiere', t: 'Partie entière des racines', th: 'Sommes', d: 2,
      q: R`On note \(\lfloor x\rfloor\) la partie entière de \(x\) (le plus grand entier inférieur ou égal à \(x\)). Calculer \[\lfloor\sqrt1\rfloor+\lfloor\sqrt2\rfloor+\lfloor\sqrt3\rfloor+\cdots+\lfloor\sqrt{100}\rfloor.\]`,
      a: 625, ans: R`625`, fmt: 'un entier',
      h: [R`Les termes sont constants par paquets : \(\lfloor\sqrt k\rfloor=1\) pour \(k=1,2,3\), puis 2 pour \(k=4,\dots,8\)…`,
        R`\(\lfloor\sqrt k\rfloor=m\) exactement quand \(m^2\le k\le (m+1)^2-1\) : cela fait \(2m+1\) valeurs de \(k\).`,
        R`La somme vaut \(\sum_{m=1}^{9}m(2m+1)+10\).`],
      s: R`<p>Regroupons les \(k\) selon la valeur \(m=\lfloor\sqrt k\rfloor\) : \(m^2\le k<(m+1)^2\), soit \(2m+1\) entiers, pour \(m\) de 1 à 9, et le dernier terme \(k=100\) vaut 10.</p>
        <p>Somme : \(\sum_{m=1}^{9}m(2m+1)+10=3+10+21+36+55+78+105+136+171+10=625\).</p>
        <p>Ou avec les formules : \(2\sum m^2+\sum m=2\times285+45=615\), plus 10.</p>`
    },
    {
      id: 'aiguilles', t: 'Les aiguilles se croisent', th: 'Raisonnement', d: 2,
      q: R`Entre midi (inclus) et minuit (exclu), combien de fois la grande et la petite aiguille d'une horloge sont-elles exactement superposées ?`,
      a: 11, ans: R`11`, fmt: 'un entier',
      h: [R`La réponse n'est pas 12 : vers 1 h 05, la petite aiguille a déjà avancé.`,
        R`Mesure les angles en tours depuis midi. Après \(t\) heures, la grande aiguille a fait \(t\) tours et la petite \(\frac{t}{12}\) tour.`,
        R`Elles sont superposées quand la grande aiguille a exactement un nombre entier de tours d'avance : \(t-\frac t{12}=k\), \(k\in\mathbb N\).`],
      s: R`<p>Après \(t\) heures (\(0\le t<12\)), la grande aiguille a fait \(t\) tours, la petite \(\frac t{12}\). Elles coïncident quand l'écart est un nombre entier de tours : \(\frac{11t}{12}=k\), soit \(t=\frac{12k}{11}\).</p>
        <p>La condition \(0\le\frac{12k}{11}<12\) donne \(k=0,1,\dots,10\) : <strong>11</strong> superpositions (midi, vers 13 h 05, 14 h 11…, la suivante étant minuit, exclu).</p>`
    },
    {
      id: 'quartdisque', t: 'Une intégrale sans primitive', th: 'Intégrales', d: 1,
      q: R`Calculer \[\int_{-2}^{2}\sqrt{4-x^2}\,\mathrm dx.\]`,
      a: 2 * Math.PI, ans: R`2\pi`, fmt: 'valeur exacte, par exemple pi/3',
      h: [R`Pas de primitive connue en Terminale. Quelle courbe représente \(y=\sqrt{4-x^2}\) ?`,
        R`\(y=\sqrt{4-x^2}\iff x^2+y^2=4\) et \(y\ge0\).`],
      s: R`<p>La courbe \(y=\sqrt{4-x^2}\) est le demi-cercle supérieur de centre \(O\) et de rayon 2 (\(x^2+y^2=4\), \(y\ge0\)).</p>
        <p>L'intégrale est l'aire du demi-disque : \(\frac12\pi\times2^2=2\pi\).</p>`
    },
    {
      id: 'comite', t: 'Le comité', th: 'Dénombrement', d: 3,
      q: R`Calculer \[\binom50^2+\binom51^2+\binom52^2+\binom53^2+\binom54^2+\binom55^2.\] Bonus : trouver la formule générale pour \(\sum_{k=0}^{n}\binom nk^2\).`,
      a: 252, ans: R`\binom{10}5=252`, fmt: 'un entier',
      h: [R`Le calcul direct est faisable, mais cherche une interprétation : \(\binom5k^2=\binom5k\binom5{5-k}\).`,
        R`Imagine un groupe de 5 filles et 5 garçons. Combien de comités de 5 personnes contiennent exactement \(k\) filles ?`],
      s: R`<p>Dans un groupe de 5 filles et 5 garçons, un comité de 5 personnes avec \(k\) filles se choisit de \(\binom5k\binom5{5-k}=\binom5k^2\) façons.</p>
        <p>En sommant sur \(k\), on compte tous les comités de 5 personnes parmi 10 : \(\sum_k\binom5k^2=\binom{10}5=252\). De même \(\sum_{k=0}^n\binom nk^2=\binom{2n}n\).</p>
        <p>Vérification directe : \(1+25+100+100+25+1=252\).</p>`
    },
    {
      id: 'carreplus', t: 'Un changement de variable', th: 'Suites', d: 2,
      q: R`La suite \((u_n)\) est définie par \(u_0=3\) et \(u_{n+1}=u_n^2-2u_n+2\). Le nombre \(u_{10}-1\) est une puissance de 2 : \(u_{10}-1=2^N\). Trouver \(N\).`,
      a: 1024, ans: R`N=2^{10}=1024`, fmt: 'un entier',
      h: [R`Reconnais une identité remarquable dans \(u_n^2-2u_n+2\).`,
        R`\(u_{n+1}-1=(u_n-1)^2\). Pose \(v_n=u_n-1\).`],
      s: R`<p>\(u_{n+1}=(u_n-1)^2+1\), donc \(v_n=u_n-1\) vérifie \(v_{n+1}=v_n^2\), avec \(v_0=2\).</p>
        <p>Alors \(v_1=2^2\), \(v_2=2^4\), et par récurrence \(v_n=2^{2^n}\). Donc \(u_{10}-1=2^{2^{10}}=2^{1024}\) : \(N=1024\).</p>`
    },
    {
      id: 'corde', t: 'La corde autour de la Terre', th: 'Géométrie', d: 1,
      q: R`On tend une corde autour de la Terre, le long de l'équateur (rayon environ 6371 km). On rallonge la corde de 1 mètre et on la soulève uniformément pour qu'elle forme un cercle concentrique. À quelle hauteur au-dessus du sol se trouve-t-elle ? Réponse en centimètres, arrondie à l'unité.`,
      a: 100 / (2 * Math.PI), tol: 0.5, ans: R`\dfrac{100}{2\pi}\approx16\text{ cm}`, fmt: 'un nombre de centimètres',
      h: [R`L'intuition dit « presque rien ». Calcule plutôt : note \(R\) le rayon de la Terre et \(h\) la hauteur.`,
        R`\(2\pi(R+h)=2\pi R+1\). Que se passe-t-il avec \(R\) ?`],
      s: R`<p>La longueur de la corde passe de \(2\pi R\) à \(2\pi(R+h)=2\pi R+1\) (en mètres), donc \(2\pi h=1\) et \(h=\frac1{2\pi}\) m \(\approx15{,}9\) cm, soit environ <strong>16 cm</strong>.</p>
        <p>Le rayon de la Terre n'intervient pas : le résultat serait le même autour d'une orange.</p>`
    },
    {
      id: 'puissances', t: 'Des puissances qui commutent', th: 'Fonctions', d: 3,
      q: R`Combien existe-t-il de couples d'entiers \((a,b)\) avec \(1\le a<b\) tels que \(a^b=b^a\) ?`,
      a: 1, ans: R`1\ \text{(le couple }(2,4))`, fmt: 'un entier',
      h: [R`Passe au logarithme : \(a^b=b^a\iff b\ln a=a\ln b\iff\dfrac{\ln a}a=\dfrac{\ln b}b\).`,
        R`Étudie \(g(x)=\dfrac{\ln x}{x}\) sur \(]0;+\infty[\) : elle croît sur \(]0;e]\) et décroît sur \([e;+\infty[\).`,
        R`Si \(g(a)=g(b)\) avec \(a<b\), alors \(a<e<b\). Quels entiers \(a\) restent possibles ?`],
      s: R`<p>\(a^b=b^a\iff\dfrac{\ln a}a=\dfrac{\ln b}b\). La fonction \(g(x)=\dfrac{\ln x}x\) a pour dérivée \(\dfrac{1-\ln x}{x^2}\) : elle est strictement croissante sur \(]0;e]\), strictement décroissante sur \([e;+\infty[\).</p>
        <p>Si \(g(a)=g(b)\) avec \(a<b\), on a forcément \(a<e<b\), donc \(a=1\) ou \(a=2\). Pour \(a=1\) : \(1=b\), impossible. Pour \(a=2\) : \(g\) est injective sur \([e;+\infty[\) et \(g(4)=\frac{\ln4}4=\frac{\ln2}2=g(2)\), donc \(b=4\).</p>
        <p>Il y a un seul couple : \((2,4)\), avec \(2^4=4^2=16\).</p>`
    },
    {
      id: 'perenoel', t: 'Le Père Noël secret', th: 'Probabilités', d: 2,
      q: R`Quatre amis écrivent chacun leur prénom sur un papier, mélangent les papiers et en tirent chacun un au hasard. Quelle est la probabilité que personne ne tire son propre prénom ?`,
      a: 3 / 8, ans: R`\dfrac{9}{24}=\dfrac38`, fmt: 'une fraction',
      h: [R`Il y a \(4!=24\) tirages équiprobables. Il faut compter ceux où personne n'a son propre papier.`,
        R`Compte le contraire avec le principe d'inclusion-exclusion, ou classe selon ce que tire la personne A : elle tire le papier de B (puis 3 cas symétriques).`,
        R`Si A tire le papier de B : soit B tire celui de A (et C, D s'échangent : 1 façon), soit B ne tire pas celui de A (2 façons). Cela fait 3 cas pour chacun des 3 choix de A.`],
      s: R`<p>Il y a \(4!=24\) tirages équiprobables. Comptons ceux sans point fixe. La personne A tire le papier d'une des trois autres, disons B (on multipliera par 3).</p>
        <ul><li>Si B tire le papier de A, C et D doivent s'échanger leurs papiers : 1 façon.</li>
        <li>Sinon, B tire celui de C ou de D, et il ne reste qu'une possibilité valable pour les deux autres : 2 façons.</li></ul>
        <p>Total : \(3\times3=9\) tirages, d'où une probabilité \(\frac9{24}=\frac38\). (Inclusion-exclusion : \(24-4\cdot6+6\cdot2-4\cdot1+1=9\).)</p>`
    },
    {
      id: 'telescope', t: 'Un produit qui se télescope', th: 'Sommes', d: 1,
      q: R`Calculer \[P=\left(1-\frac1{2^2}\right)\left(1-\frac1{3^2}\right)\left(1-\frac1{4^2}\right)\cdots\left(1-\frac1{100^2}\right).\]`,
      a: 101 / 200, ans: R`\dfrac{101}{200}`, fmt: 'une fraction',
      h: [R`Factorise chaque facteur : \(1-\frac1{k^2}=\frac{(k-1)(k+1)}{k^2}\).`,
        R`Sépare en deux produits : \(\prod\frac{k-1}{k}\) et \(\prod\frac{k+1}{k}\). Chacun se simplifie en cascade.`],
      s: R`<p>\(1-\frac1{k^2}=\frac{k-1}k\cdot\frac{k+1}k\). Donc \(P=\displaystyle\prod_{k=2}^{100}\frac{k-1}k\times\prod_{k=2}^{100}\frac{k+1}k\).</p>
        <p>Le premier produit vaut \(\frac12\cdot\frac23\cdots\frac{99}{100}=\frac1{100}\), le second \(\frac32\cdot\frac43\cdots\frac{101}{100}=\frac{101}2\). Donc \(P=\frac{101}{200}\).</p>`
    },
    {
      id: 'idempotentes', t: 'Appliquer deux fois, comme une fois', th: 'Ensembles', d: 3,
      q: R`Combien existe-t-il d'applications \(f:\{1,2,3\}\to\{1,2,3\}\) telles que \(f\circ f=f\) ?`,
      a: 10, ans: R`10`, fmt: 'un entier',
      h: [R`Il y a \(3^3=27\) applications en tout : ne les teste pas une par une. Que dit \(f(f(x))=f(x)\) sur un élément \(y=f(x)\) de l'image ?`,
        R`La condition équivaut à : \(f(y)=y\) pour tout \(y\) de l'image de \(f\). Classe les applications selon leur image.`,
        R`Si l'image a \(k\) éléments, ils sont fixes, et chacun des \(3-k\) autres éléments est envoyé n'importe où dans l'image.`],
      s: R`<p>\(f\circ f=f\) signifie que \(f\) fixe chaque élément de son image \(I\). Réciproquement, une telle application est déterminée par \(I\) et par l'image (dans \(I\)) des éléments hors de \(I\).</p>
        <p>Image à 1 élément : \(\binom31\times1^2=3\). À 2 éléments : \(\binom32\times2^1=6\). À 3 éléments : l'identité, 1. Total : \(3+6+1=10\).</p>`
    },
    {
      id: 'cosinus', t: 'Un produit de cosinus', th: 'Trigonométrie', d: 3,
      q: R`Calculer \[\cos\frac{\pi}{7}\times\cos\frac{2\pi}{7}\times\cos\frac{4\pi}{7}.\] On pourra utiliser \(\sin(2a)=2\sin a\cos a\).`,
      a: -1 / 8, ans: R`-\dfrac18`, fmt: 'une fraction',
      h: [R`Les angles doublent à chaque facteur. Multiplie le produit par \(\sin\frac\pi7\) (qui n'est pas nul).`,
        R`\(\sin\frac\pi7\cos\frac\pi7=\frac12\sin\frac{2\pi}7\), puis \(\sin\frac{2\pi}7\cos\frac{2\pi}7=\frac12\sin\frac{4\pi}7\)… Va jusqu'au bout.`,
        R`Tu arrives à \(\frac18\sin\frac{8\pi}7\). Compare \(\sin\frac{8\pi}7\) et \(\sin\frac\pi7\).`],
      s: R`<p>Soit \(P\) le produit et \(s=\sin\frac\pi7\neq0\). En appliquant trois fois \(\sin a\cos a=\frac12\sin2a\) :</p>
        <p>\(sP=\frac12\sin\frac{2\pi}7\cos\frac{2\pi}7\cos\frac{4\pi}7=\frac14\sin\frac{4\pi}7\cos\frac{4\pi}7=\frac18\sin\frac{8\pi}7\).</p>
        <p>Or \(\sin\frac{8\pi}7=\sin\left(\pi+\frac\pi7\right)=-\sin\frac\pi7=-s\). Donc \(sP=-\frac s8\) et \(P=-\frac18\).</p>`
    },
    {
      id: 'hanoi', t: 'La tour de Hanoï', th: 'Suites', d: 2,
      q: R`Une tour de 10 disques de tailles toutes différentes est empilée sur le premier de trois piquets, du plus grand (en bas) au plus petit. On veut la reconstruire sur le troisième piquet en déplaçant un seul disque à la fois, sans jamais poser un disque sur un plus petit. Quel est le nombre minimal de déplacements ?`,
      a: 1023, ans: R`2^{10}-1=1023`, fmt: 'un entier',
      h: [R`Note \(h_n\) le minimum pour \(n\) disques. Pour bouger le plus grand disque, où doivent être les \(n-1\) autres ?`,
        R`Il faut déplacer les \(n-1\) petits sur le piquet du milieu, puis le grand, puis les \(n-1\) petits par-dessus : \(h_n=2h_{n-1}+1\).`,
        R`Regarde \(h_n+1\).`],
      s: R`<p>Le plus grand disque ne peut bouger que lorsque les \(n-1\) autres sont tous sur un même autre piquet : il faut au moins \(h_{n-1}\) déplacements avant, 1 pour lui, et \(h_{n-1}\) après pour reposer les autres dessus. Et cette stratégie fonctionne, donc \(h_n=2h_{n-1}+1\), avec \(h_1=1\).</p>
        <p>Alors \(h_n+1=2(h_{n-1}+1)\) : la suite \((h_n+1)\) est géométrique de raison 2 et \(h_1+1=2\), donc \(h_n=2^n-1\). Pour 10 disques : \(1023\).</p>`
    },
    {
      id: 'tetraedre', t: 'Le tétraèdre dans le cube', th: 'Géométrie', d: 2,
      q: R`Dans un cube d'arête 1, on choisit quatre sommets deux à deux non reliés par une arête : ils forment un tétraèdre régulier (ses arêtes sont des diagonales de faces). Quel est le volume de ce tétraèdre ?`,
      a: 1 / 3, ans: R`\dfrac13`, fmt: 'une fraction',
      h: [R`Plutôt qu'une formule de volume du tétraèdre régulier, regarde ce qu'il faut enlever au cube pour obtenir le tétraèdre.`,
        R`On retire 4 « coins » : chacun est une pyramide dont le sommet est un des 4 autres sommets du cube, avec trois arêtes de longueur 1 deux à deux perpendiculaires.`],
      s: R`<p>Le cube privé du tétraèdre se compose de 4 pyramides, une par sommet non choisi. Chacune a pour base un demi-carré (aire \(\frac12\)) et pour hauteur 1 : volume \(\frac13\times\frac12\times1=\frac16\).</p>
        <p>Volume du tétraèdre : \(1-4\times\frac16=\frac13\).</p>`
    },
    {
      id: 'kcnk', t: 'Une somme pondérée', th: 'Dénombrement', d: 2,
      q: R`Calculer \[\sum_{k=0}^{10}k\binom{10}{k}=0\binom{10}0+1\binom{10}1+2\binom{10}2+\cdots+10\binom{10}{10}.\]`,
      a: 5120, ans: R`10\times2^9=5120`, fmt: 'un entier',
      h: [R`Interprétation : dans un groupe de 10 personnes, \(k\binom{10}k\) compte les façons de choisir un comité de \(k\) personnes puis un président dans ce comité.`,
        R`Compte autrement : choisis d'abord le président, puis le reste du comité.`],
      s: R`<p>\(\sum_k k\binom{10}k\) compte les couples (comité, président du comité) dans un groupe de 10 personnes.</p>
        <p>Autrement : on choisit le président (10 façons), puis n'importe quelle partie des 9 autres pour compléter le comité (\(2^9\) façons). Total : \(10\times2^9=5120\).</p>
        <p>Variante : dériver \((1+x)^{10}=\sum\binom{10}kx^k\) puis prendre \(x=1\).</p>`
    },
    {
      id: 'harmonique', t: 'Une somme qui se stabilise', th: 'Suites', d: 3,
      q: R`Déterminer la limite, quand \(n\to+\infty\), de \[S_n=\frac1{n+1}+\frac1{n+2}+\cdots+\frac1{2n}.\]`,
      a: Math.LN2, ans: R`\ln 2`, fmt: 'valeur exacte (ln, e, sqrt…)',
      h: [R`Il y a \(n\) termes, tous entre \(\frac1{2n}\) et \(\frac1n\) : \(S_n\) est entre \(\frac12\) et 1. Il faut plus fin.`,
        R`Compare chaque terme à une intégrale : pour \(k\ge2\), \(\displaystyle\int_k^{k+1}\frac{\mathrm dx}x\le\frac1k\le\int_{k-1}^{k}\frac{\mathrm dx}x\).`,
        R`En sommant pour \(k\) de \(n+1\) à \(2n\), tu encadres \(S_n\) entre deux intégrales de \(\frac1x\).`],
      s: R`<p>La fonction \(x\mapsto\frac1x\) est décroissante, donc pour \(k\ge2\) : \(\displaystyle\int_k^{k+1}\frac{\mathrm dx}x\le\frac1k\le\int_{k-1}^k\frac{\mathrm dx}x\).</p>
        <p>En sommant pour \(k=n+1,\dots,2n\) : \(\ln\frac{2n+1}{n+1}\le S_n\le\ln\frac{2n}{n}=\ln2\).</p>
        <p>Comme \(\frac{2n+1}{n+1}\to2\) et \(\ln\) est continue, le théorème des gendarmes donne \(S_n\to\ln2\approx0{,}693\).</p>`
    },
    {
      id: 'iteration', t: 'Itérer 2026 fois', th: 'Fonctions', d: 1,
      q: R`Soit \(f(x)=\dfrac1{1-x}\). On applique \(f\) 2026 fois de suite au nombre 3 : \(f(f(\cdots f(3)\cdots))\). Quel nombre obtient-on ?`,
      a: -0.5, ans: R`-\dfrac12`, fmt: 'une fraction',
      h: [R`Calcule \(f(3)\), puis \(f(f(3))\), puis encore une fois.`,
        R`On revient à 3 au bout de 3 applications : tout dépend du reste de la division de 2026 par 3.`],
      s: R`<p>\(f(3)=-\frac12\), \(f\left(-\frac12\right)=\frac23\), \(f\left(\frac23\right)=3\) : les valeurs reviennent tous les 3 pas (en fait \(f\circ f\circ f(x)=x\) pour tout \(x\neq0,1\)).</p>
        <p>Comme \(2026=3\times675+1\), le résultat est \(f(3)=-\frac12\).</p>`
    },
    {
      id: 'tiroirs', t: 'Cinq points dans un carré', th: 'Raisonnement', d: 2,
      q: R`Quel est le plus petit entier \(n\) tel que : quelle que soit la façon de placer \(n\) points dans un carré de côté 2 (bord compris), il y en a toujours deux à une distance inférieure ou égale à \(\sqrt2\) ?`,
      a: 5, ans: R`5`, fmt: 'un entier',
      h: [R`Montre d'abord que 4 points ne suffisent pas : trouve une position où ils sont tous loin les uns des autres.`,
        R`Pour 5 points : découpe le carré en 4 petits carrés de côté 1. Quelle est la plus grande distance entre deux points d'un même petit carré ?`,
        R`Principe des tiroirs : 5 points dans 4 petits carrés, deux tombent dans le même.`],
      s: R`<p>Avec 4 points aux quatre coins, toutes les distances valent 2 ou \(2\sqrt2\), plus que \(\sqrt2\) : \(n=4\) ne convient pas.</p>
        <p>Avec 5 points, on découpe le carré en 4 carrés de côté 1. Par le principe des tiroirs, deux points sont dans le même petit carré, donc à distance au plus sa diagonale \(\sqrt2\). La réponse est \(n=5\).</p>`
    },
    {
      id: 'contrainte', t: 'Un minimum sous contrainte', th: 'Inégalités', d: 3,
      q: R`Trouver la plus petite valeur de \[\left(x+\frac1x\right)^2+\left(y+\frac1y\right)^2\] pour des réels \(x>0\) et \(y>0\) tels que \(x+y=1\).`,
      a: 12.5, ans: R`\dfrac{25}{2}`, fmt: 'une fraction ou un décimal',
      h: [R`On devine le minimum en \(x=y=\frac12\). Pour le prouver sans dériver, utilise \(a^2+b^2\ge\frac{(a+b)^2}2\) (qui vient de \((a-b)^2\ge0\)).`,
        R`Avec \(a=x+\frac1x\) et \(b=y+\frac1y\) : \(a+b=1+\frac1x+\frac1y=1+\frac{1}{xy}\).`,
        R`Majore \(xy\) quand \(x+y=1\) : \(xy\le\frac14\).`],
      s: R`<p>Posons \(a=x+\frac1x\), \(b=y+\frac1y\). Comme \((a-b)^2\ge0\), \(a^2+b^2\ge\frac{(a+b)^2}2\).</p>
        <p>Or \(a+b=x+y+\frac{x+y}{xy}=1+\frac1{xy}\), et \(xy\le\left(\frac{x+y}2\right)^2=\frac14\) (car \((x-y)^2\ge0\)), donc \(a+b\ge5\).</p>
        <p>Ainsi \(a^2+b^2\ge\frac{25}2\), avec égalité pour \(x=y=\frac12\) (\(a=b=\frac52\)). Le minimum vaut \(\frac{25}2\).</p>`
    },
    {
      id: 'etoiles', t: 'Des étoiles et des barres', th: 'Dénombrement', d: 2,
      q: R`Combien existe-t-il de triplets d'entiers naturels \((a,b,c)\) tels que \(a+b+c=10\) ?`,
      a: 66, ans: R`\binom{12}2=66`, fmt: 'un entier',
      h: [R`Représente une solution par 10 étoiles et 2 barres de séparation : par exemple \(\star\star|\star\star\star\star\star|\star\star\star\) pour \((2,5,3)\).`,
        R`Une solution correspond exactement à une façon de placer les 2 barres parmi les 12 positions.`],
      s: R`<p>On écrit 10 étoiles et 2 barres à la suite : les étoiles avant la première barre comptent pour \(a\), entre les deux pour \(b\), après pour \(c\). Chaque triplet correspond à une seule suite et réciproquement.</p>
        <p>Il suffit de choisir la place des 2 barres parmi 12 : \(\binom{12}2=66\). (Ou directement : pour \(a\) fixé, \(b\) prend \(11-a\) valeurs, et \(11+10+\cdots+1=66\).)</p>`
    },
    {
      id: 'derivee2026', t: 'La dérivée 2026-ième', th: 'Fonctions', d: 2,
      q: R`Soit \(g(x)=x\,e^x\). Calculer \(g^{(2026)}(0)\), la dérivée 2026-ième de \(g\) en 0.`,
      a: 2026, ans: R`2026`, fmt: 'un entier',
      h: [R`Calcule \(g'\), \(g''\), \(g'''\) : une forme apparaît.`,
        R`Conjecture \(g^{(n)}(x)=(x+n)e^x\) et prouve-la par récurrence.`],
      s: R`<p>\(g'(x)=(x+1)e^x\), \(g''(x)=(x+2)e^x\). Si \(g^{(n)}(x)=(x+n)e^x\), alors \(g^{(n+1)}(x)=e^x+(x+n)e^x=(x+n+1)e^x\) : par récurrence, \(g^{(n)}(x)=(x+n)e^x\) pour tout \(n\).</p>
        <p>Donc \(g^{(2026)}(0)=2026\).</p>`
    },
    {
      id: 'zeros', t: 'Les zéros de 100!', th: 'Raisonnement', d: 2,
      q: R`Par combien de zéros se termine l'écriture décimale de \(100!=1\times2\times3\times\cdots\times100\) ?`,
      a: 24, ans: R`24`, fmt: 'un entier',
      h: [R`Chaque zéro final vient d'un facteur \(10=2\times5\). Il y a beaucoup plus de facteurs 2 que de facteurs 5.`,
        R`Compte les facteurs 5 : un par multiple de 5… mais certains nombres en apportent deux.`],
      s: R`<p>Le nombre de zéros finaux est le nombre de facteurs 10, donc le nombre de facteurs 5 dans \(100!\) (les facteurs 2 sont plus nombreux).</p>
        <p>Il y a 20 multiples de 5 entre 1 et 100, et 4 d'entre eux (25, 50, 75, 100) sont multiples de 25 et apportent un 5 de plus : \(20+4=24\) zéros.</p>`
    },
    {
      id: 'croissantes', t: 'Des fonctions strictement croissantes', th: 'Dénombrement', d: 2,
      q: R`Combien existe-t-il de fonctions strictement croissantes de \(\{1,2,3,4\}\) dans \(\{1,2,\dots,10\}\) ?`,
      a: 210, ans: R`\binom{10}4=210`, fmt: 'un entier',
      h: [R`Une telle fonction est déterminée par ses valeurs \(f(1)<f(2)<f(3)<f(4)\).`,
        R`Si on connaît l'ensemble \(\{f(1),f(2),f(3),f(4)\}\), y a-t-il un seul ordre possible ?`],
      s: R`<p>Une fonction strictement croissante prend 4 valeurs distinctes ; à l'inverse, un ensemble de 4 valeurs distinctes donne une seule fonction strictement croissante (on les range dans l'ordre).</p>
        <p>Il y a donc autant de fonctions que de parties à 4 éléments de \(\{1,\dots,10\}\) : \(\binom{10}4=210\).</p>`
    }
  ];
})();
