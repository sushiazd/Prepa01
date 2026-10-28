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
    return {
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
  };
})();
