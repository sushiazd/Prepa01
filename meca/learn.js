/* =====================================================================
   Leçons « Comprendre » d'ingénierie mécanique (statique des solides : D. Auche, C. Clavaud, D. Loison). Une
   leçon par compétence du parcours (clé = id de SK dans index.html) : l'image concrète (clé, porte, funambule),
   une prédiction « Devine d'abord », l'explication, une question sans enjeu. meth sert d'indice.
   H = { Ch, Nn, Ex, esc } : Ch(étiquette HTML, [[valeur, texte]], bonne valeur), Nn(étiquette TeX, valeur, unité).
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function (H) {
    const { Ch, Nn } = H;
    const L = {
      /* =================== Vecteurs et moments =================== */
      proj: { title: 'Projeter une force', meth: 'repère l\'angle entre la force et un axe : composante \\(F\\cos\\alpha\\) sur cet axe (côté adjacent), \\(F\\sin\\alpha\\) sur l\'axe perpendiculaire ; les signes se lisent sur la figure (vers les \\(x\\) ou \\(y\\) négatifs : signe moins).', steps: [
        { h: 'L\'ombre de la force sur chaque axe',
          guess: { q: 'Une force de 10 N fait un angle de 30° avec l\'axe \\(\\vec x\\). Sa composante selon \\(\\vec x\\) est :', items: [Ch('réponse', [['c', '\\(10\\cos30° \\approx 8{,}7\\) N'], ['s', '\\(10\\sin30° = 5\\) N'], ['t', '10 N']], 'c')] },
          body: `<p>Projeter, c'est regarder l'<b>ombre</b> de la flèche sur chaque axe. Dans le triangle rectangle formé par la force et ses deux composantes, la composante sur l'axe qui fait l'angle \\(\\alpha\\) avec la force est le côté <b>adjacent</b> : \\(F\\cos\\alpha\\). L'autre est le côté opposé : \\(F\\sin\\alpha\\).</p>
            <p>Vérification de bon sens : si \\(\\alpha = 0\\), la force est sur l'axe, toute la force est « adjacente » (\\(\\cos 0 = 1\\)). Le piège : un angle mesuré depuis \\(\\vec y\\) au lieu de \\(\\vec x\\) échange cos et sin.</p>`,
          ask: { q: 'Une force de 20 N fait 60° avec \\(\\vec x\\), dirigée vers les \\(y\\) positifs. Sa composante selon \\(\\vec y\\) ?', items: [Nn('F_y', 17.3, 'N')], why: 'L\'axe \\(\\vec y\\) est perpendiculaire à celui de l\'angle : \\(20\\sin60° \\approx 17{,}3\\) N, positive.' } }
      ] },

      pvec: { title: 'Le produit vectoriel', meth: 'base directe : \\(\\vec x\\wedge\\vec y = \\vec z\\), \\(\\vec y\\wedge\\vec z = \\vec x\\), \\(\\vec z\\wedge\\vec x = \\vec y\\) (permutation circulaire), et dans l\'autre ordre un signe moins ; \\(\\vec u\\wedge\\vec u = \\vec 0\\) ; on développe composante par composante.', steps: [
        { h: 'Un vecteur perpendiculaire aux deux autres',
          guess: { q: 'Que vaut \\(\\vec x\\wedge\\vec y\\) dans une base orthonormée directe ?', items: [Ch('réponse', [['z', '\\(\\vec z\\)'], ['mz', '\\(-\\vec z\\)'], ['0', '\\(\\vec 0\\)']], 'z')] },
          body: `<p>\\(\\vec u\\wedge\\vec v\\) est perpendiculaire à \\(\\vec u\\) et à \\(\\vec v\\), de norme \\(uv\\sin(\\vec u, \\vec v)\\), orienté par la règle de la main droite (pouce \\(\\vec u\\), index \\(\\vec v\\), majeur \\(\\vec u\\wedge\\vec v\\)).</p>
            <ul><li>Dans l'ordre circulaire \\(x \\to y \\to z \\to x\\) : \\(\\vec x\\wedge\\vec y = \\vec z\\), \\(\\vec y\\wedge\\vec z = \\vec x\\), \\(\\vec z\\wedge\\vec x = \\vec y\\).</li><li>Dans l'autre ordre, un signe moins : \\(\\vec y\\wedge\\vec x = -\\vec z\\).</li><li>Deux vecteurs parallèles : \\(\\sin 0 = 0\\), produit nul.</li></ul>`,
          ask: { q: '\\(\\vec x\\wedge\\vec z\\) = ?', items: [Ch('réponse', [['y', '\\(\\vec y\\)'], ['my', '\\(-\\vec y\\)'], ['0', '\\(\\vec 0\\)']], 'my')], why: '\\(\\vec z\\wedge\\vec x = \\vec y\\) (ordre circulaire), donc dans l\'autre ordre \\(\\vec x\\wedge\\vec z = -\\vec y\\). C\'est le piège classique.' } }
      ] },

      moment: { title: 'Le moment d\'une force : l\'effet de levier', meth: '\\(\\vec{\\mathcal M}_A(\\vec F) = \\vec{AB}\\wedge\\vec F\\) (B = point d\'application) ; norme = force × bras de levier (distance de A à la ligne d\'action) ; nul si la force passe par A ; en plan, signe + si la force fait tourner dans le sens trigonométrique.', steps: [
        { h: 'Pourquoi la poignée est loin des gonds',
          guess: { q: 'Pour ouvrir une porte avec le moins d\'effort, on pousse…', items: [Ch('réponse', [['p', 'près des gonds'], ['l', 'loin des gonds, perpendiculairement à la porte'], ['g', 'vers les gonds, dans le plan de la porte']], 'l')] },
          body: `<p>Ce qui fait tourner, ce n'est pas la force seule mais la force <b>et</b> sa distance à l'axe. Le moment mesure cette capacité à faire tourner :</p>\\[\\|\\vec{\\mathcal M}_A\\| = F\\times d\\]
            <p>où \\(d\\) est le <b>bras de levier</b>, la distance de A à la ligne d'action de la force. Pousser vers les gonds (la force passe par l'axe) : \\(d = 0\\), rien ne tourne. C'est aussi pourquoi une clé plus longue desserre plus facilement un boulon.</p>
            <p>En vecteurs : \\(\\vec{\\mathcal M}_A = \\vec{AB}\\wedge\\vec F\\), avec le vecteur qui va <b>du point de calcul A vers le point d'application B</b>.</p>`,
          ask: { q: 'On pousse une porte avec 50 N, perpendiculairement, à 0,8 m des gonds. Moment par rapport à l\'axe des gonds ?', items: [Nn('\\mathcal M', 40, 'N·m')], why: '\\(50\\times0{,}8 = 40\\) N·m.' } }
      ] },

      /* =================== Torseurs =================== */
      transport: { title: 'Torseurs : changer de point', meth: 'la résultante ne dépend pas du point, le moment si : \\(\\vec{\\mathcal M}_B = \\vec{\\mathcal M}_A + \\vec{BA}\\wedge\\vec R\\) (« BABAR ») ; on transporte tous les torseurs au même point avant de les additionner.', steps: [
        { h: 'Un torseur = « combien ça pousse » et « combien ça fait tourner »',
          guess: { q: 'Une même force, vue depuis deux points différents. Qu\'est-ce qui change ?', items: [Ch('réponse', [['r', 'la résultante'], ['m', 'le moment'], ['rien', 'rien']], 'm')] },
          body: `<p>Une action mécanique se résume par deux vecteurs : sa <b>résultante</b> \\(\\vec R\\) (combien elle pousse) et son <b>moment</b> en un point (combien elle fait tourner autour de ce point). La force est la même partout, mais le bras de levier dépend du point : le moment change.</p>
            <p>La formule de transport le dit précisément :</p>\\[\\vec{\\mathcal M}_B = \\vec{\\mathcal M}_A + \\vec{BA}\\wedge\\vec R \\qquad\\text{(« BABAR »)}\\]
            <p>Deux torseurs ne s'additionnent que s'ils sont écrits au <b>même point</b> et dans la même base.</p>`,
          ask: { q: 'Une force \\(\\vec R = F\\vec y\\) appliquée en A (donc \\(\\vec{\\mathcal M}_A = \\vec 0\\)). B est tel que \\(\\vec{AB} = L\\vec x\\). \\(\\vec{\\mathcal M}_B\\) = ?', items: [Ch('réponse', [['a', '\\(LF\\,\\vec z\\)'], ['b', '\\(-LF\\,\\vec z\\)'], ['c', '\\(\\vec 0\\)']], 'b')], why: '\\(\\vec{BA} = -L\\vec x\\), donc \\(\\vec{\\mathcal M}_B = -L\\vec x\\wedge F\\vec y = -LF\\,\\vec z\\).' } }
      ] },

      /* =================== Liaisons =================== */
      liaisons: { title: 'Liaisons : ce qui est bloqué transmet', meth: 'pour chaque translation bloquée, une composante de force ; pour chaque rotation bloquée, une composante de moment ; en plan \\((\\vec x, \\vec y)\\) : pivot d\'axe \\(\\vec z\\) → \\(X, Y\\) ; encastrement → \\(X, Y, N\\) ; appui ponctuel de normale \\(\\vec y\\) → \\(Y\\).', steps: [
        { h: 'Une liaison pousse là où elle empêche de bouger',
          guess: { q: 'Une charnière de porte (liaison pivot) peut-elle empêcher la porte de tourner autour de son axe ?', items: [Ch('réponse', [['o', 'oui'], ['n', 'non']], 'n')] },
          body: `<p>Une liaison transmet un effort <b>exactement dans les directions où elle empêche le mouvement</b>. La charnière empêche la porte de tomber ou de partir de côté (elle transmet des forces), mais laisse tourner autour de son axe : elle ne transmet <b>aucun moment</b> autour de cet axe (si elle est parfaite, sans frottement).</p>
            <p>Règle de comptage : degrés de liberté + inconnues statiques = 6. Pivot : 1 rotation libre, 5 inconnues. En problème plan, il ne reste que \\(X\\), \\(Y\\) (forces) et \\(N\\) (moment autour de \\(\\vec z\\)).</p>`,
          ask: { q: 'En problème plan, combien d\'inconnues statiques pour un encastrement ?', items: [Nn('\\text{inconnues}', 3)], why: 'Un encastrement bloque tout : \\(X\\), \\(Y\\) et le moment \\(N\\).' } }
      ] },

      /* =================== PFS =================== */
      cables: { title: 'Tension dans des câbles', meth: 'isoler le point (ou l\'objet) suspendu, projeter sur \\(\\vec x\\) et \\(\\vec y\\) ; câbles symétriques d\'angle \\(\\theta\\) avec l\'horizontale : \\(2F\\sin\\theta = P\\), donc \\(F = \\dfrac{P}{2\\sin\\theta}\\) ; \\(\\sin\\theta\\) se lit sur la géométrie.', steps: [
        { h: 'Le funambule et le câble trop tendu',
          guess: { q: 'Une charge pend au milieu d\'un câble. Plus le câble est presque horizontal, plus sa tension est :', items: [Ch('réponse', [['g', 'grande'], ['p', 'petite'], ['eq', 'la même']], 'g')] },
          body: `<p>Seules les composantes <b>verticales</b> des deux brins portent le poids : \\(2F\\sin\\theta = P\\). Si le câble est presque horizontal, \\(\\sin\\theta\\) est tout petit, et il faut une tension énorme pour fournir la même composante verticale :</p>\\[F = \\frac{P}{2\\sin\\theta}\\]
            <p>C'est pourquoi on ne peut jamais tendre un câble chargé parfaitement à l'horizontale. Les composantes horizontales (\\(F\\cos\\theta\\)) s'annulent entre les deux brins.</p>`,
          ask: { q: '\\(P = 100\\) N, \\(\\theta = 30°\\) avec l\'horizontale. \\(F\\) = ?', items: [Nn('F', 100, 'N')], why: '\\(\\sin30° = 0{,}5\\) : \\(F = \\dfrac{100}{2\\times0{,}5} = 100\\) N. Chaque brin tire autant que tout le poids.' } }
      ] },

      encastre: { title: 'Poutre ou poteau encastré', meth: 'isoler la poutre, bilan : charges + encastrement \\((X_A, Y_A, N_A)\\) ; la résultante donne \\(X_A, Y_A\\) ; les moments en A donnent \\(N_A\\), qui compense le moment des charges (force × distance à A).', steps: [
        { h: 'L\'encastrement résiste à la rotation',
          guess: { q: 'Un plongeoir est encastré dans un mur. Quand quelqu\'un se tient au bout, le mur doit fournir :', items: [Ch('réponse', [['f', 'seulement une force vers le haut'], ['fm', 'une force vers le haut et un moment'], ['m', 'seulement un moment']], 'fm')] },
          body: `<p>Une force vers le haut compenserait le poids, mais pas sa tendance à faire <b>tourner</b> le plongeoir autour du mur. L'encastrement fournit aussi un moment \\(N_A\\) qui l'en empêche.</p>
            <p>PFS : résultante \\(Y_A = P\\) ; moments en A : \\(N_A - P\\times L = 0\\), donc \\(N_A = PL\\). Écrire les moments en A est le bon choix : les forces de l'encastrement y ont un moment nul, il ne reste qu'une inconnue.</p>`,
          ask: { q: 'Poutre encastrée de 2 m, force de 50 N vers le bas au bout. Moment d\'encastrement (en valeur absolue) ?', items: [Nn('|N_A|', 100, 'N·m')], why: '\\(50\\times2 = 100\\) N·m.' } }
      ] },

      appuis: { title: 'Appuis, réactions et basculement', meth: 'écris les moments au point d\'un appui : son inconnue disparaît, l\'autre réaction sort directement ; la résultante donne la seconde ; à la limite du basculement, l\'appui qui décolle a une réaction nulle.', steps: [
        { h: 'Choisir le point des moments pour tuer une inconnue',
          guess: { q: 'Une poutre de 4 m sur deux appuis A et B (aux extrémités). Une charge de 100 N est à 1 m de A. Quel appui porte le plus ?', items: [Ch('réponse', [['a', 'A'], ['b', 'B'], ['eq', 'les deux pareil']], 'a')] },
          body: `<p>La charge est plus près de A : A en porte davantage (comme quand on porte une planche à deux, celui qui est près de la charge porte plus).</p>
            <p>Calcul : moments en A (la réaction \\(Y_A\\) y a un moment nul) : \\(Y_B\\times4 - 100\\times1 = 0\\), donc \\(Y_B = 25\\) N. Puis la résultante : \\(Y_A = 100 - 25 = 75\\) N. Deux équations, une inconnue chacune.</p>
            <p><b>Basculement</b> : quand un appui commence à décoller, sa réaction devient nulle. On écrit \\(Y = 0\\) pour cet appui, et les moments autour de l'autre donnent la charge limite.</p>`,
          ask: { q: 'Même poutre, charge de 100 N à 3 m de A. \\(Y_A\\) = ?', items: [Nn('Y_A', 25, 'N')], why: 'Moments en A : \\(4Y_B = 300\\), \\(Y_B = 75\\) N, donc \\(Y_A = 25\\) N.' } }
      ] },

      contact3: { title: 'Trois appuis ponctuels', meth: 'trois réactions verticales inconnues : résultante sur \\(\\vec z\\) et moments autour de \\(\\vec x\\) et de \\(\\vec y\\) (en un point bien choisi, par exemple un appui) : 3 équations, 3 inconnues.', steps: [
        { h: 'Un tabouret à trois pieds ne boite jamais',
          guess: { q: 'Une table à trois pieds placés en triangle équilatéral, le poids au centre. Chaque pied porte :', items: [Ch('réponse', [['3', 'le tiers du poids'], ['2', 'la moitié du poids'], ['?', 'on ne peut pas savoir']], '3')] },
          body: `<p>Trois appuis verticaux, c'est trois inconnues, et la statique donne justement trois équations utiles : la somme des forces verticales et les moments autour de deux axes horizontaux. Le problème est déterminé (c'est pourquoi un tabouret à trois pieds ne boite pas, alors qu'une table à quatre pieds peut).</p>
            <p>Par symétrie, poids au centre : \\(P/3\\) chacun. Si le poids se rapproche d'un pied, ce pied porte plus ; les moments le disent précisément.</p>`,
          ask: { q: 'Pour une moto (trois appuis : deux roues arrière, une avant), quelle équation donne le partage avant/arrière ?', items: [Ch('réponse', [['m', 'les moments autour de l\'axe des roues arrière'], ['r', 'la résultante seule'], ['x', 'la résultante sur \\(\\vec x\\)']], 'm')], why: 'Autour de l\'axe passant par les roues arrière, seules la roue avant et le poids ont un moment : on obtient directement la réaction avant.' } }
      ] },

      moteur: { title: 'Couple de levage', meth: 'isoler le bras en pivot ; moments sur l\'axe du pivot : couple moteur \\(C\\) = poids × bras de levier horizontal \\(x_G\\) (distance horizontale entre l\'axe et le centre de gravité).', steps: [
        { h: 'Le bras de levier est horizontal',
          guess: { q: 'Tu tiens un sac à bout de bras. Quand c\'est le plus dur ?', items: [Ch('réponse', [['h', 'bras horizontal'], ['b', 'bras pendant vers le bas'], ['eq', 'pareil dans toutes les positions']], 'h')] },
          body: `<p>Le poids est vertical : son bras de levier par rapport à l'épaule est la distance <b>horizontale</b> entre l'épaule et le sac. Bras horizontal : distance maximale, moment maximal. Bras pendant : la ligne d'action passe par l'épaule, moment nul.</p>
            <p>Pour un bras de levage en pivot, le couple moteur doit équilibrer le moment du poids : \\(C = P\\times x_G\\), où \\(x_G\\) est la distance horizontale de l'axe au centre de gravité (qui dépend de l'angle du bras).</p>`,
          ask: { q: 'Bras de 200 N, centre de gravité à 0,5 m de l\'axe horizontalement. Couple moteur ?', items: [Nn('C', 100, 'N·m')], why: '\\(C = 200\\times0{,}5 = 100\\) N·m.' } }
      ] },

      /* =================== Plusieurs solides =================== */
      bielle: { title: 'Isolements successifs : la biellette', meth: 'commence par isoler les solides soumis à deux forces (biellettes, poids négligé) : les deux forces sont opposées et portées par la droite qui joint leurs points d\'application, la direction est donc connue ; puis le solide qui a le moins d\'inconnues.', steps: [
        { h: 'Deux forces : forcément alignées',
          guess: { q: 'Une barre légère est articulée à ses deux bouts et rien d\'autre ne la touche. En équilibre, la force à chaque bout est dirigée :', items: [Ch('réponse', [['a', 'le long de la barre'], ['p', 'perpendiculairement à la barre'], ['q', 'dans n\'importe quelle direction']], 'a')] },
          body: `<p>Un solide soumis à deux forces seulement est en équilibre si elles sont opposées (résultante nulle) <b>et</b> alignées (sinon elles formeraient un couple et feraient tourner la barre). Elles sont donc portées par la droite qui joint les deux points d'attache.</p>
            <p>C'est précieux : pour une biellette, on connaît la <b>direction</b> de l'effort sans calcul, il ne reste qu'une inconnue (son intensité). On isole donc d'abord les biellettes, puis les autres solides, en choisissant à chaque fois un isolement qui n'a pas plus de 3 inconnues (en plan).</p>`,
          ask: { q: 'Après avoir isolé la biellette 2 reliée au solide 3, l\'action de 3 sur 2 et celle de 2 sur 3 sont :', items: [Ch('réponse', [['o', 'opposées'], ['e', 'égales'], ['i', 'indépendantes']], 'o')], why: 'Actions réciproques : \\(\\vec F_{3\\to2} = -\\vec F_{2\\to3}\\). On reporte l\'effort trouvé, avec le signe opposé, dans l\'isolement suivant.' } }
      ] }
    };
    /* ---------- Étapes ajoutées : la méthode du PFS pas à pas, puis un calcul guidé au format du DS ---------- */
    const guided = '<p class="fine">Calcul guidé : isole le solide, fais le bilan sur ta feuille, puis tape les résultats.</p>';
    const INK = 'fill:var(--ink-2);font:15px var(--sans)';
    const arr = (x1, y1, x2, y2, c, lab, lx, ly) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 9; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${c};stroke-width:2.5"/><path d="M${x2} ${y2} L${x2 - h * Math.cos(a - 0.4)} ${y2 - h * Math.sin(a - 0.4)} L${x2 - h * Math.cos(a + 0.4)} ${y2 - h * Math.sin(a + 0.4)}Z" style="fill:${c}"/>${lab ? `<text x="${lx}" y="${ly}" style="${INK};fill:${c}">${lab}</text>` : ''}`; };
    // poutre sur deux appuis A et B, charge F
    const POUTRE = (xa, xf, xb, labF) => `<svg class="lfig" viewBox="0 0 420 170" role="img" aria-label="poutre sur deux appuis avec une charge">
      <rect x="${xa - 10}" y="70" width="${xb - xa + 20}" height="14" rx="3" style="fill:var(--sheet-2);stroke:var(--ink-2);stroke-width:1.5"/>
      <polygon points="${xa},84 ${xa - 14},110 ${xa + 14},110" style="fill:none;stroke:var(--ink-2);stroke-width:1.5"/><polygon points="${xb},84 ${xb - 14},110 ${xb + 14},110" style="fill:none;stroke:var(--ink-2);stroke-width:1.5"/>
      <text x="${xa - 4}" y="130" style="${INK}">A</text><text x="${xb - 4}" y="130" style="${INK}">B</text>
      ${arr(xf, 20, xf, 66, '#dc2626', labF, xf + 8, 34)}${arr(xa, 160, xa, 114, '#2563eb', 'Y_A', xa + 8, 150)}${arr(xb, 160, xb, 114, '#2563eb', 'Y_B', xb + 8, 150)}</svg>`;
    const MORE = {
      proj: [
        { h: 'Calcul guidé : deux forces sur un même point',
          body: `${guided}<p>\\(\\vec F_1\\) : 10 N à 30° au-dessus de \\(\\vec x\\). \\(\\vec F_2\\) : 10 N à 60° au-dessus de \\(-\\vec x\\) (vers la gauche).</p>
            <ol><li>\\(F_{1x} = 10\\cos30°\\), \\(F_{1y} = 10\\sin30°\\).</li><li>\\(F_{2x} = -10\\cos60°\\) (vers la gauche : signe moins), \\(F_{2y} = 10\\sin60°\\).</li><li>Somme composante par composante.</li></ol>`,
          ask: { q: 'Résultante (en N) :', items: [Nn('R_x', 10 * Math.cos(Math.PI / 6) - 5, 'N'), Nn('R_y', 5 + 10 * Math.sin(Math.PI / 3), 'N')], why: '\\(R_x = 8{,}66 - 5 = 3{,}66\\) N ; \\(R_y = 5 + 8{,}66 = 13{,}66\\) N. On additionne toujours des composantes, jamais des normes.' } }
      ],
      pvec: [
        { h: 'Calcul guidé : un produit vectoriel en composantes',
          body: `${guided}<p>\\(\\vec u = (1, 2, 0)\\), \\(\\vec v = (3, 0, 1)\\).</p>
            <ol><li>\\(x\\) : \\(u_yv_z - u_zv_y = 2\\times1 - 0\\times0\\).</li><li>\\(y\\) : \\(u_zv_x - u_xv_z = 0\\times3 - 1\\times1\\).</li><li>\\(z\\) : \\(u_xv_y - u_yv_x = 1\\times0 - 2\\times3\\).</li></ol>
            <p>Vérification : le résultat doit être perpendiculaire à \\(\\vec u\\) (produit scalaire nul).</p>`,
          ask: { q: 'Composantes de \\(\\vec u\\wedge\\vec v\\) :', items: [Nn('x', 2), Nn('y', -1), Nn('z', -6)], why: '\\((2, -1, -6)\\). Vérification : \\(1\\times2 + 2\\times(-1) + 0\\times(-6) = 0\\), perpendiculaire à \\(\\vec u\\).' } }
      ],
      moment: [
        { h: 'Calcul guidé : le moment en 2D, avec son signe',
          body: `${guided}<p>Force \\(\\vec F = (0, -50)\\) N (vers le bas) appliquée en B ; \\(\\vec{AB} = (2, 0)\\) m.</p>
            <ol><li>En plan : \\(\\mathcal M_{A,z} = x_{AB}F_y - y_{AB}F_x\\).</li><li>Bras de levier : la distance horizontale de A à la ligne d'action verticale.</li><li>Le signe : la force fait-elle tourner autour de A dans le sens trigonométrique ?</li></ol>`,
          ask: { q: 'Moment en A :', items: [Nn('\\mathcal M_{A,z}', -100, 'N·m')], why: '\\(2\\times(-50) - 0\\times0 = -100\\) N·m : 50 N × 2 m, dans le sens horaire (une charge à droite qui fait plonger la poutre), d\'où le signe moins.' } }
      ],
      transport: [
        { h: 'Calcul guidé : transporter un torseur',
          body: `${guided}<p>En A : \\(\\vec R = (0, -100, 0)\\) N et \\(\\vec{\\mathcal M}_A = \\vec 0\\). On veut le moment en B, avec \\(\\vec{BA} = (-3, 0, 0)\\) m.</p>
            <ol><li>BABAR : \\(\\vec{\\mathcal M}_B = \\vec{\\mathcal M}_A + \\vec{BA}\\wedge\\vec R\\).</li><li>\\((-3\\vec x)\\wedge(-100\\vec y) = 300\\,\\vec x\\wedge\\vec y\\).</li></ol>`,
          ask: { q: 'Composante \\(z\\) de \\(\\vec{\\mathcal M}_B\\) :', items: [Nn('\\mathcal M_{B,z}', 300, 'N·m')], why: '\\(\\vec x\\wedge\\vec y = \\vec z\\) : \\(\\vec{\\mathcal M}_B = 300\\,\\vec z\\) N·m. La force passe par A (moment nul en A) mais elle est à 3 m de B.' } }
      ],
      liaisons: [
        { h: 'Exercice guidé : compter inconnues et équations',
          body: `${guided}<p>Une poutre plane est tenue en A par un <b>pivot</b> d'axe \\(\\vec z\\) et en B par un <b>appui ponctuel</b> de normale \\(\\vec y\\).</p>
            <ol><li>Pivot en plan : \\(X_A, Y_A\\).</li><li>Appui ponctuel : \\(Y_B\\).</li><li>Le PFS plan donne 3 équations (\\(x\\), \\(y\\), moment).</li></ol>`,
          ask: { q: 'Bilan :', items: [Nn('\\text{inconnues}', 3), Ch('le problème', [['i', 'est résoluble (isostatique)'], ['h', 'a trop d\'inconnues (hyperstatique)']], 'i')], why: '3 inconnues, 3 équations : isostatique, on peut tout calculer.' } }
      ],
      cables: [
        { h: 'Calcul guidé : la géométrie donne l\'angle',
          body: `${guided}<p>Une charge \\(P = 600\\) N pend au milieu d'un câble de longueur totale \\(2\\ell = 10\\) m dont les extrémités sont à \\(L = 8\\) m l'une de l'autre, au même niveau.</p>
            <ol><li>Chaque brin mesure \\(\\ell = 5\\) m et couvre \\(L/2 = 4\\) m à l'horizontale.</li><li>Flèche (hauteur) : \\(h = \\sqrt{\\ell^2 - (L/2)^2}\\) ; \\(\\sin\\theta = h/\\ell\\).</li><li>\\(F = \\dfrac{P}{2\\sin\\theta}\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('h', 3, 'm'), Nn('F', 500, 'N')], why: '\\(h = \\sqrt{25 - 16} = 3\\) m, \\(\\sin\\theta = 0{,}6\\), \\(F = \\dfrac{600}{1{,}2} = 500\\) N.' } }
      ],
      encastre: [
        { h: 'Calcul guidé : potence encastrée',
          body: `${guided}<p>Un poteau vertical encastré au sol en A porte un bras horizontal de 1,5 m ; au bout, une charge de 200 N. On néglige les poids propres.</p>
            <ol><li>Résultante : \\(X_A = 0\\), \\(Y_A\\) compense la charge.</li><li>Moments en A : la charge est à 1,5 m horizontalement de A.</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('Y_A', 200, 'N'), Nn('|N_A|', 300, 'N·m')], why: '\\(Y_A = 200\\) N ; \\(|N_A| = 200\\times1{,}5 = 300\\) N·m. La hauteur du poteau n\'intervient pas : le bras de levier d\'une force verticale est horizontal.' } }
      ],
      appuis: [
        { h: 'Calcul guidé : la poutre et le basculement',
          body: `${POUTRE(70, 150, 300, 'F = 120 N')}${guided}<p>Appuis A et B distants de 6 m ; \\(F = 120\\) N à 2 m de A.</p>
            <ol><li>Moments en A : \\(6\\,Y_B - 2\\times120 = 0\\).</li><li>Résultante : \\(Y_A + Y_B = 120\\).</li><li>Si on déplaçait \\(F\\) au-delà de B (en porte-à-faux), \\(Y_A\\) deviendrait négatif : l'appui A décollerait, c'est le basculement.</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('Y_B', 40, 'N'), Nn('Y_A', 80, 'N')], why: '\\(Y_B = 240/6 = 40\\) N ; \\(Y_A = 80\\) N. L\'appui le plus proche de la charge porte le plus.' } }
      ],
      contact3: [
        { h: 'Calcul guidé : trois appuis non symétriques',
          body: `${guided}<p>Un plateau de poids 300 N repose sur trois appuis : A \\((0, 0)\\), B \\((4, 0)\\), C \\((0, 3)\\) (en m). Le centre de gravité est en \\((1, 1)\\).</p>
            <ol><li>Moments autour de l'axe \\(\\vec y\\) passant par A (bras de levier = abscisse) : \\(4Y_B - 300\\times1 = 0\\).</li><li>Moments autour de l'axe \\(\\vec x\\) passant par A (bras = ordonnée) : \\(3Y_C - 300\\times1 = 0\\).</li><li>Résultante : \\(Y_A = 300 - Y_B - Y_C\\).</li></ol>`,
          ask: { q: 'Résultats :', items: [Nn('Y_B', 75, 'N'), Nn('Y_C', 100, 'N'), Nn('Y_A', 125, 'N')], why: '\\(Y_B = 75\\) N, \\(Y_C = 100\\) N, \\(Y_A = 125\\) N : A, le plus proche du centre de gravité, porte le plus.' } }
      ],
      moteur: [
        { h: 'Calcul guidé : le couple selon l\'angle du bras',
          body: `${guided}<p>Bras de 400 N, centre de gravité à 0,5 m de l'axe du pivot. Le bras fait un angle \\(\\theta\\) avec l'horizontale.</p>
            <ol><li>Bras de levier du poids : la distance horizontale \\(0{,}5\\cos\\theta\\).</li><li>\\(C = P\\times0{,}5\\cos\\theta\\).</li></ol>`,
          ask: { q: 'Couple nécessaire :', items: [Nn('C\\ (\\theta = 0)', 200, 'N·m'), Nn('C\\ (\\theta = 60°)', 100, 'N·m')], why: 'Horizontal : \\(400\\times0{,}5 = 200\\) N·m ; à 60° : \\(\\cos60° = 0{,}5\\), donc 100 N·m. Le couple est maximal bras horizontal.' } }
      ],
      bielle: [
        { h: 'Exercice guidé : l\'ordre des isolements',
          body: `${guided}<p>Une pince : deux bras 1 et 2 articulés en O, et une biellette 3 (poids négligé) articulée en C sur 1 et en D sur 2. On connaît l'effort de serrage et on cherche l'effort dans la biellette.</p>
            <ol><li>Isoler 3 d'abord : deux forces, donc dirigées selon CD. Une seule inconnue : son intensité.</li><li>Isoler ensuite un bras (par exemple 2) : effort connu, effort de 3 de direction connue, pivot en O (2 inconnues) : 3 inconnues en tout.</li><li>Moments en O : seule l'intensité de l'effort de 3 reste dans l'équation.</li></ol>`,
          ask: { q: 'Pourquoi écrire les moments en O pour le bras 2 ?', items: [Ch('réponse', [['o', 'les inconnues du pivot en O disparaissent'], ['f', 'c\'est le point le plus facile à dessiner'], ['r', 'la résultante y est nulle']], 'o')], why: 'Les efforts du pivot passent par O : leur moment y est nul. Il ne reste que l\'inconnue cherchée.' } }
      ]
    };
    Object.entries(MORE).forEach(([k, st]) => { if (L[k]) L[k].steps.push(...st); });
    return L;
  };
})();
