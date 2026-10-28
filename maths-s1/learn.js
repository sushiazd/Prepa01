/* =====================================================================
   Leçons « Comprendre » de maths S1, CC1 (logique, ensembles, applications, relations, dénombrement ;
   A. Karfoul et M. Bauer). Une leçon par compétence du parcours (clé = id de SK dans index.html) : le sens
   des définitions avec des exemples de la vie courante, une prédiction « Devine d'abord », l'explication, une
   question sans enjeu. meth sert d'indice dans les exercices.
   H = { Ch, Nn, esc } : Ch(étiquette HTML, [[valeur, texte]], bonne valeur), Nn(étiquette TeX, valeur exacte).
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function (H) {
    const { Ch, Nn } = H;
    const VF = (lab, ans) => Ch(lab, [['1', 'vraie (1)'], ['0', 'fausse (0)']], ans);
    return {
      /* =================== Logique =================== */
      conn: { title: 'Les connecteurs : le cas de l\'implication', meth: 'une colonne par sous-formule, de l\'intérieur vers l\'extérieur ; \\(2^n\\) lignes pour \\(n\\) variables ; \\(P\\Rightarrow Q\\) n\'est fausse que sur la ligne \\(P = 1,\\ Q = 0\\).', steps: [
        { h: 'Une implication, c\'est une promesse',
          guess: { q: '« Si Napoléon était chinois, alors \\(3 - 2 = 2\\). » Cette phrase est :', items: [VF('la phrase', '1')] },
          body: `<p>Pense à \\(P\\Rightarrow Q\\) comme à une <b>promesse</b> : « si tu as ton bac (\\(P\\)), je t'offre un vélo (\\(Q\\)) ». Quand la promesse est-elle trahie ? Seulement si tu as ton bac <b>et</b> que tu n'as pas de vélo. Si tu n'as pas ton bac, je n'ai rien promis : la promesse n'est pas trahie, quoi qu'il arrive.</p>
            <table class="t"><tr><th>\\(P\\)</th><th>\\(Q\\)</th><th>\\(P\\Rightarrow Q\\)</th></tr><tr><td>0</td><td>0</td><td>1</td></tr><tr><td>0</td><td>1</td><td>1</td></tr><tr><td>1</td><td>0</td><td><b>0</b></td></tr><tr><td>1</td><td>1</td><td>1</td></tr></table>
            <p>Napoléon n'était pas chinois : l'hypothèse est fausse, donc l'implication est <b>vraie</b>.</p>`,
          ask: { q: 'Que vaut \\(P\\Rightarrow Q\\) quand \\(P\\) est vraie et \\(Q\\) fausse ?', items: [VF('\\(P\\Rightarrow Q\\)', '0')], why: 'C\'est la seule ligne où la promesse est trahie : 0.' } },
        { h: 'Tautologie, antilogie',
          body: `<p>Une formule à \\(n\\) variables a \\(2^n\\) lignes (chaque variable vaut 0 ou 1) : 4 lignes pour 2 variables, 8 pour 3. On ajoute une colonne par sous-formule, en partant de l'intérieur. Une formule vraie sur toutes les lignes est une <b>tautologie</b> ; fausse partout, une <b>antilogie</b> ; sinon elle est neutre.</p>
            <p>Le « ou » mathématique est <b>inclusif</b> : \\(P\\vee Q\\) est vraie aussi quand les deux sont vraies.</p>`,
          ask: { q: '\\(P\\vee\\neg P\\) est :', items: [Ch('réponse', [['t', 'une tautologie'], ['a', 'une antilogie'], ['n', 'neutre']], 't')], why: 'Si \\(P\\) est fausse, \\(\\neg P\\) est vraie : sur chaque ligne l\'une des deux est vraie. Toujours vraie.' } }
      ] },

      equiv: { title: 'Contraposée, réciproque, négation', meth: '\\(P\\Rightarrow Q \\equiv \\neg Q\\Rightarrow\\neg P \\equiv \\neg P\\vee Q\\) ; la réciproque \\(Q\\Rightarrow P\\) n\'est pas équivalente ; De Morgan échange \\(\\wedge\\) et \\(\\vee\\) ; \\(\\neg(P\\Rightarrow Q) \\equiv P\\wedge\\neg Q\\).', steps: [
        { h: 'La contraposée dit la même chose',
          guess: { q: '« S\'il pleut, le sol est mouillé. » Laquelle de ces phrases dit exactement la même chose ?', items: [Ch('réponse', [['r', 'Si le sol est mouillé, il pleut.'], ['c', 'Si le sol n\'est pas mouillé, il ne pleut pas.'], ['n', 'S\'il ne pleut pas, le sol n\'est pas mouillé.']], 'c')] },
          body: `<p>La <b>contraposée</b> \\(\\neg Q\\Rightarrow\\neg P\\) est équivalente : si le sol est sec, c'est qu'il ne pleut pas. La <b>réciproque</b> \\(Q\\Rightarrow P\\) ne l'est pas : le sol peut être mouillé parce qu'on l'a arrosé.</p>
            <p>Autre écriture utile : \\(P\\Rightarrow Q \\equiv \\neg P\\vee Q\\) (« il ne pleut pas, ou le sol est mouillé »).</p>`,
          ask: { q: 'La négation de « s\'il pleut, le sol est mouillé » est :', items: [Ch('réponse', [['a', 'S\'il pleut, le sol n\'est pas mouillé.'], ['b', 'Il pleut et le sol n\'est pas mouillé.'], ['c', 'Il ne pleut pas et le sol est mouillé.']], 'b')],
            why: '\\(\\neg(P\\Rightarrow Q) \\equiv P\\wedge\\neg Q\\) : la promesse est trahie quand il pleut <b>et</b> que le sol est sec. La négation d\'une implication n\'est pas une implication.' } },
        { h: 'De Morgan : nier échange « et » et « ou »',
          body: `<p>« Je n'aime pas (le thé et le café) » : il suffit qu'il y en ait un que je n'aime pas. \\(\\neg(P\\wedge Q) \\equiv \\neg P\\vee\\neg Q\\). Et \\(\\neg(P\\vee Q) \\equiv \\neg P\\wedge\\neg Q\\) : « ni l'un ni l'autre ».</p>`,
          ask: { q: '\\(\\neg(P\\vee\\neg Q)\\) est équivalente à :', items: [Ch('réponse', [['a', '\\(\\neg P\\wedge Q\\)'], ['b', '\\(\\neg P\\vee Q\\)'], ['c', '\\(P\\wedge\\neg Q\\)']], 'a')], why: 'De Morgan : \\(\\neg P\\wedge\\neg\\neg Q = \\neg P\\wedge Q\\).' } }
      ] },

      quant: { title: 'Quantificateurs : l\'ordre et la négation', meth: 'pour nier, on remplace chaque \\(\\forall\\) par \\(\\exists\\) et inversement, sans toucher aux ensembles, puis on nie la propriété finale (\\(\\leq\\) devient \\(>\\)) ; l\'ordre des quantificateurs change le sens.', steps: [
        { h: 'L\'ordre change tout',
          guess: { q: 'Laquelle de ces phrases est vraie ?', items: [Ch('réponse', [['a', 'Pour toute personne, il existe une mère de cette personne.'], ['b', 'Il existe une mère de toutes les personnes.']], 'a')] },
          body: `<p>\\(\\forall x,\\ \\exists y\\) : pour chaque \\(x\\), on peut trouver un \\(y\\), qui <b>dépend</b> de \\(x\\) (chacun sa mère). \\(\\exists y,\\ \\forall x\\) : un <b>même</b> \\(y\\) pour tous les \\(x\\) (une seule mère pour tout le monde). C'est beaucoup plus fort.</p>
            <p>En maths : \\(\\forall x\\in\\mathbb R,\\ \\exists y\\in\\mathbb R,\\ y > x\\) est vraie (prendre \\(y = x + 1\\)), mais \\(\\exists y,\\ \\forall x,\\ y > x\\) est fausse (aucun réel n'est plus grand que tous).</p>`,
          ask: { q: '\\(\\forall n\\in\\mathbb N,\\ \\exists m\\in\\mathbb N,\\ m < n\\) est :', items: [Ch('réponse', [['v', 'vraie'], ['f', 'fausse']], 'f')], why: 'Pour \\(n = 0\\), aucun entier naturel \\(m\\) n\'est plus petit : un seul contre-exemple suffit, c\'est faux.' } },
        { h: 'Nier, pas à pas',
          guess: { q: 'Le contraire de « tous les élèves ont eu la moyenne » est :', items: [Ch('réponse', [['a', 'aucun élève n\'a eu la moyenne'], ['b', 'au moins un élève n\'a pas eu la moyenne']], 'b')] },
          body: `<p>Pour qu'un « pour tout » soit faux, il suffit d'<b>un</b> contre-exemple : \\(\\neg(\\forall x,\\ P(x)) \\equiv \\exists x,\\ \\neg P(x)\\). Et \\(\\neg(\\exists x,\\ P(x)) \\equiv \\forall x,\\ \\neg P(x)\\).</p>
            <p>Exemple : « \\(f\\) est majorée » s'écrit \\(\\exists M,\\ \\forall x,\\ f(x)\\leq M\\). Sa négation : \\(\\forall M,\\ \\exists x,\\ f(x) > M\\). Attention : nier \\(\\leq\\) donne \\(>\\), pas \\(\\geq\\).</p>`,
          ask: { q: 'La négation de \\(\\forall x\\in\\mathbb R,\\ f(x) \\geq 0\\) est :', items: [Ch('réponse', [['a', '\\(\\forall x\\in\\mathbb R,\\ f(x) < 0\\)'], ['b', '\\(\\exists x\\in\\mathbb R,\\ f(x) < 0\\)'], ['c', '\\(\\exists x\\in\\mathbb R,\\ f(x) \\leq 0\\)']], 'b')], why: 'On change \\(\\forall\\) en \\(\\exists\\), l\'ensemble reste \\(\\mathbb R\\), et \\(\\geq 0\\) devient \\(< 0\\).' } }
      ] },

      raison: { title: 'Raisonner : contraposée, absurde, CN et CS', meth: 'pour \\(A\\Rightarrow B\\) difficile en direct, essaie la contraposée \\(\\neg B\\Rightarrow\\neg A\\) ; pour montrer qu\'un « pour tout » est faux, un contre-exemple ; si \\(A\\Rightarrow B\\), \\(A\\) est suffisante pour \\(B\\) et \\(B\\) nécessaire pour \\(A\\).', steps: [
        { h: 'Condition nécessaire, condition suffisante',
          guess: { q: '« Être parisien \\(\\Rightarrow\\) être français ». Être français est, pour être parisien, une condition :', items: [Ch('réponse', [['n', 'nécessaire'], ['s', 'suffisante']], 'n')] },
          body: `<p>Si \\(A\\Rightarrow B\\) : avoir \\(A\\) <b>suffit</b> pour avoir \\(B\\) (être parisien suffit pour être français), et \\(B\\) est <b>nécessaire</b> pour \\(A\\) (on ne peut pas être parisien sans être français). Mais être français ne suffit pas pour être parisien.</p>
            <p>Erreur classique : de \\(A\\Rightarrow B\\) et \\(B\\), on ne peut <b>pas</b> conclure \\(A\\) (un Lyonnais est français). De \\(A\\Rightarrow B\\) et \\(\\neg B\\), on conclut \\(\\neg A\\).</p>`,
          ask: { q: 'Pour qu\'un entier soit divisible par 4, être pair est une condition :', items: [Ch('réponse', [['n', 'nécessaire mais pas suffisante'], ['s', 'suffisante mais pas nécessaire'], ['ns', 'nécessaire et suffisante']], 'n')], why: 'Divisible par 4 \\(\\Rightarrow\\) pair, donc « pair » est nécessaire ; mais 6 est pair sans être divisible par 4 : pas suffisante.' } },
        { h: 'Contraposée et absurde',
          body: `<p>« \\(n^2\\) pair \\(\\Rightarrow\\) \\(n\\) pair » est dur en direct (partir de \\(n^2 = 2k\\) ne mène nulle part). Sa contraposée est facile : « \\(n\\) impair \\(\\Rightarrow\\) \\(n^2\\) impair » : \\(n = 2k + 1\\) donne \\(n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\\), impair.</p>
            <p><b>Absurde</b> : on suppose le contraire de ce qu'on veut, et on arrive à une contradiction (exemple : \\(\\sqrt2\\notin\\mathbb Q\\)). <b>Contre-exemple</b> : pour montrer qu'un « pour tout » est faux, un seul cas suffit.</p>`,
          ask: { q: 'Pour montrer que « tout entier impair est premier » est faux, il suffit de :', items: [Ch('réponse', [['c', 'donner un contre-exemple, comme 9'], ['r', 'faire une récurrence'], ['a', 'raisonner par l\'absurde sur tous les entiers']], 'c')], why: '9 est impair et pas premier : la phrase est fausse.' } }
      ] },

      /* =================== Ensembles =================== */
      ops: { title: 'Opérations sur les ensembles = logique', meth: '\\(\\cup\\) = « ou », \\(\\cap\\) = « et », complémentaire = « non » ; \\(A\\setminus B\\) = dans A et pas dans B ; un diagramme de Venn avant de répondre ; De Morgan : \\(\\overline{A\\cup B} = \\overline A\\cap\\overline B\\).', steps: [
        { h: 'Les mêmes règles que les connecteurs',
          guess: { q: '\\(A = \\{1, 2, 3\\}\\), \\(B = \\{2, 3, 4\\}\\). Combien d\'éléments a \\(A\\,\\Delta\\,B\\) (dans l\'un ou l\'autre, mais pas les deux) ?', items: [Nn('|A\\,\\Delta\\,B|', 2)] },
          body: `<p>Un ensemble, c'est une propriété : « \\(x\\in A\\) ». Alors \\(x\\in A\\cup B\\) veut dire « \\(x\\in A\\) <b>ou</b> \\(x\\in B\\) », \\(A\\cap B\\) « et », \\(\\overline A\\) « non ». Toutes les lois de la logique se transposent : De Morgan donne \\(\\overline{A\\cup B} = \\overline A\\cap\\overline B\\).</p>
            <ul><li>\\(A\\setminus B = A\\cap\\overline B\\) : dans \\(A\\), pas dans \\(B\\). Ici \\(\\{1\\}\\).</li><li>\\(A\\,\\Delta\\,B = (A\\setminus B)\\cup(B\\setminus A)\\) : dans un seul des deux, c'est le « ou exclusif ». Ici \\(\\{1, 4\\}\\).</li></ul>`,
          ask: { q: 'Avec les mêmes \\(A\\) et \\(B\\), \\(|A\\cup B|\\) = ?', items: [Nn('|A\\cup B|', 4)], why: '\\(A\\cup B = \\{1, 2, 3, 4\\}\\) : 4 éléments.' } }
      ] },

      crible: { title: 'La formule du crible : ne pas compter deux fois', meth: '\\(|A\\cup B| = |A| + |B| - |A\\cap B|\\) ; pour trois ensembles on ajoute les trois, on retire les intersections deux à deux, on rajoute l\'intersection triple ; avec un diagramme, on remplit en partant du centre.', steps: [
        { h: 'Pourquoi on retire l\'intersection',
          guess: { q: '20 élèves font anglais, 15 espagnol, 5 font les deux. Combien font au moins une langue ?', items: [Nn('|A\\cup E|', 30)] },
          body: `<p>Si on fait \\(20 + 15 = 35\\), les 5 élèves qui font les deux sont comptés <b>deux fois</b> (une fois dans chaque groupe). On les retire une fois :</p>\\[|A\\cup B| = |A| + |B| - |A\\cap B| = 20 + 15 - 5 = 30\\]
            <p>Pour trois ensembles, on ajoute les trois, on retire les intersections deux à deux, mais alors le centre (dans les trois) a été ajouté 3 fois et retiré 3 fois : on le rajoute.</p>\\[|A\\cup B\\cup C| = |A| + |B| + |C| - |A\\cap B| - |A\\cap C| - |B\\cap C| + |A\\cap B\\cap C|\\]`,
          ask: { q: '\\(|A| = |B| = |C| = 10\\), chaque intersection de deux vaut 4, l\'intersection des trois vaut 2. \\(|A\\cup B\\cup C|\\) = ?', items: [Nn('|A\\cup B\\cup C|', 20)], why: '\\(30 - 12 + 2 = 20\\).' } }
      ] },

      parties: { title: 'Parties, produit cartésien, partitions', meth: '\\(|\\mathcal P(E)| = 2^{|E|}\\) (chaque élément est dedans ou pas) ; \\(|E\\times F| = |E|\\times|F|\\) (couples ordonnés) ; une partition : des parties non vides, disjointes deux à deux, qui recouvrent tout.', steps: [
        { h: 'Dedans ou dehors, pour chaque élément',
          guess: { q: 'Combien de parties a l\'ensemble \\(\\{a, b, c\\}\\) (en comptant \\(\\varnothing\\) et lui-même) ?', items: [Nn('|\\mathcal P(E)|', 8)] },
          body: `<p>Pour fabriquer une partie, on décide pour chaque élément : dedans ou dehors. 2 choix pour \\(a\\), 2 pour \\(b\\), 2 pour \\(c\\) : \\(2^3 = 8\\) parties, dont \\(\\varnothing\\) (tout dehors) et \\(E\\) (tout dedans). En général \\(|\\mathcal P(E)| = 2^{|E|}\\).</p>
            <p>\\(E\\times F\\) est l'ensemble des <b>couples</b> \\((x, y)\\) : \\(|E|\\) choix pour \\(x\\), \\(|F|\\) pour \\(y\\), donc \\(|E|\\times|F|\\). Les couples sont ordonnés : \\((1, 2)\\neq(2, 1)\\).</p>`,
          ask: { q: '\\(\\{\\{1\\}, \\{2, 3\\}, \\{4\\}\\}\\) est-elle une partition de \\(\\{1, 2, 3, 4\\}\\) ?', items: [Ch('réponse', [['o', 'oui'], ['n', 'non']], 'o')], why: 'Parties non vides, sans élément commun, et leur réunion donne tout l\'ensemble : c\'est une partition.' } }
      ] },

      /* =================== Applications =================== */
      image: { title: 'Image directe, image réciproque', meth: '\\(f(A)\\) : on part de \\(A\\) et on regarde où arrivent les points ; \\(f^{-1}(B)\\) : on cherche tous les \\(x\\) dont l\'image tombe dans \\(B\\) (elle existe toujours, même si \\(f\\) n\'est pas bijective) ; un dessin de la courbe aide.', steps: [
        { h: 'Deux questions opposées',
          guess: { q: '\\(f(x) = x^2\\) sur \\(\\mathbb R\\). Que vaut \\(f^{-1}(\\{4\\})\\) ?', items: [Ch('réponse', [['a', '\\(\\{2\\}\\)'], ['b', '\\(\\{-2, 2\\}\\)'], ['c', '\\(\\{16\\}\\)']], 'b')] },
          body: `<p><b>Image directe</b> \\(f(A)\\) : « où vont les points de \\(A\\) ? ». <b>Image réciproque</b> \\(f^{-1}(B)\\) : « quels points arrivent dans \\(B\\) ? ». Pour \\(x^2\\) : \\(-2\\) et \\(2\\) arrivent tous les deux sur 4, donc \\(f^{-1}(\\{4\\}) = \\{-2, 2\\}\\).</p>
            <p>\\(f^{-1}(B)\\) est un <b>ensemble</b>, défini pour toute application, même non bijective. Il peut être vide : \\(f^{-1}(\\{-1\\}) = \\varnothing\\) (aucun carré ne vaut \\(-1\\)).</p>`,
          ask: { q: 'Toujours avec \\(f(x) = x^2\\), \\(f([-1, 2])\\) = ?', items: [Ch('réponse', [['a', '\\([1, 4]\\)'], ['b', '\\([0, 4]\\)'], ['c', '\\([-1, 4]\\)']], 'b')], why: 'Quand \\(x\\) parcourt \\([-1, 2]\\), il passe par 0 : les carrés vont de 0 (atteint en 0) à 4 (atteint en 2). D\'où \\([0, 4]\\), pas \\([1, 4]\\).' } }
      ] },

      inj: { title: 'Injective, surjective, bijective', meth: 'injective : au plus un antécédent pour chaque \\(y\\) (\\(f(x) = f(x\')\\Rightarrow x = x\'\\)) ; surjective : au moins un ; bijective : exactement un ; ça dépend des ensembles de départ et d\'arrivée.', steps: [
        { h: 'Combien d\'antécédents ?',
          guess: { q: '\\(f : \\mathbb R\\to\\mathbb R,\\ x\\mapsto x^2\\). Combien d\'antécédents a \\(y = -1\\) ?', items: [Nn('\\text{nombre}', 0)] },
          body: `<p>Pour chaque \\(y\\) de l'arrivée, on compte ses antécédents (les \\(x\\) tels que \\(f(x) = y\\)) :</p>
            <ul><li><b>injective</b> : jamais plus d'un (deux \\(x\\) différents ne tombent jamais au même endroit) ;</li><li><b>surjective</b> : toujours au moins un (tout \\(y\\) est atteint) ;</li><li><b>bijective</b> : toujours exactement un.</li></ul>
            <p>\\(x^2\\) sur \\(\\mathbb R\\to\\mathbb R\\) : \\(4\\) a deux antécédents (pas injective), \\(-1\\) n'en a aucun (pas surjective). Mais de \\(\\mathbb R_+\\) dans \\(\\mathbb R_+\\), elle est bijective : les ensembles font partie de la fonction.</p>`,
          ask: { q: '\\(f : \\mathbb R\\to\\mathbb R,\\ x\\mapsto 2x + 1\\) est :', items: [Ch('réponse', [['b', 'bijective'], ['i', 'injective seulement'], ['s', 'surjective seulement']], 'b')], why: 'Pour tout \\(y\\), \\(2x + 1 = y\\) a exactement une solution \\(x = \\dfrac{y - 1}{2}\\) : bijective.' } },
        { h: 'Avec des ensembles finis',
          body: `<p>Si \\(|E| = n\\) et \\(|F| = m\\) : une injection de \\(E\\) dans \\(F\\) n'est possible que si \\(n\\leq m\\) (pas assez de places sinon : principe des tiroirs), une surjection que si \\(n\\geq m\\). Il y a \\(m^n\\) applications en tout (\\(m\\) choix d'image pour chacun des \\(n\\) éléments).</p>`,
          ask: { q: 'Combien d\'applications de \\(\\{1, 2, 3\\}\\) dans \\(\\{a, b\\}\\) ?', items: [Nn('\\text{nombre}', 8)], why: '2 choix d\'image pour chacun des 3 éléments : \\(2^3 = 8\\). Aucune n\'est injective (3 &gt; 2).' } }
      ] },

      compo: { title: 'Composée et réciproque', meth: '\\((g\\circ f)(x) = g(f(x))\\) : on applique \\(f\\) d\'abord ; en général \\(g\\circ f\\neq f\\circ g\\) ; pour la réciproque d\'une bijection, résoudre \\(y = f(x)\\) en \\(x\\).', steps: [
        { h: 'On lit de droite à gauche',
          guess: { q: '\\(f(x) = x + 1\\), \\(g(x) = x^2\\). Que vaut \\((g\\circ f)(2)\\) ?', items: [Nn('(g\\circ f)(2)', 9)] },
          body: `<p>\\(g\\circ f\\) veut dire : d'abord \\(f\\), puis \\(g\\) sur le résultat. \\(f(2) = 3\\), puis \\(g(3) = 9\\). Dans l'autre ordre, \\((f\\circ g)(2) = f(4) = 5\\) : la composition n'est pas commutative.</p>
            <p>La <b>réciproque</b> d'une bijection fait le chemin inverse : \\(f^{-1}(f(x)) = x\\). Pour la trouver, on résout \\(y = f(x)\\) en \\(x\\) : pour \\(y = 2x + 1\\), \\(x = \\dfrac{y - 1}{2}\\), donc \\(f^{-1}(y) = \\dfrac{y - 1}{2}\\).</p>`,
          ask: { q: 'Avec les mêmes \\(f\\) et \\(g\\), \\((f\\circ g)(3)\\) = ?', items: [Nn('(f\\circ g)(3)', 10)], why: 'D\'abord \\(g(3) = 9\\), puis \\(f(9) = 10\\).' } }
      ] },

      /* =================== Relations =================== */
      rel: { title: 'Propriétés d\'une relation', meth: 'teste chaque propriété en citant sa définition : réflexive (\\(x\\mathcal Rx\\)), symétrique (\\(x\\mathcal Ry\\Rightarrow y\\mathcal Rx\\)), antisymétrique (\\(x\\mathcal Ry\\) et \\(y\\mathcal Rx\\Rightarrow x = y\\)), transitive ; un seul contre-exemple suffit pour dire non.', steps: [
        { h: 'Quatre propriétés, quatre questions',
          body: `<ul><li><b>Réflexive</b> : chacun est en relation avec lui-même (\\(x\\leq x\\)).</li><li><b>Symétrique</b> : si \\(x\\) est lié à \\(y\\), alors \\(y\\) l'est à \\(x\\) (« être frère de »… entre garçons).</li><li><b>Antisymétrique</b> : on ne peut être lié dans les deux sens que si \\(x = y\\) (\\(x\\leq y\\) et \\(y\\leq x\\) donnent \\(x = y\\)).</li><li><b>Transitive</b> : si \\(x\\) lié à \\(y\\) et \\(y\\) à \\(z\\), alors \\(x\\) à \\(z\\).</li></ul>
            <p>Équivalence = réflexive + symétrique + transitive (« avoir le même âge que »). Ordre = réflexive + antisymétrique + transitive (\\(\\leq\\), la divisibilité, l'inclusion).</p>`,
          ask: { q: 'Sur les droites du plan, « être perpendiculaire à » est-elle transitive ?', items: [Ch('réponse', [['o', 'oui'], ['n', 'non']], 'n')], why: 'Si \\(D_1\\perp D_2\\) et \\(D_2\\perp D_3\\), alors \\(D_1\\) et \\(D_3\\) sont parallèles, pas perpendiculaires. Elle n\'est pas non plus réflexive.' } }
      ] },

      classes: { title: 'Classes d\'équivalence', meth: 'la classe de \\(x\\) = tous les éléments en relation avec \\(x\\) ; les classes forment une partition ; pour la congruence modulo \\(n\\), il y a \\(n\\) classes (les restes 0 à \\(n - 1\\)).', steps: [
        { h: 'Ranger par « même caractéristique »',
          guess: { q: 'On relie deux entiers s\'ils ont le même reste dans la division par 3. En combien de groupes les entiers sont-ils rangés ?', items: [Nn('\\text{nombre de classes}', 3)] },
          body: `<p>Une relation d'équivalence dit « ont la même caractéristique » (même âge, même reste, même image par \\(f\\)…). La <b>classe</b> de \\(x\\) regroupe tous ceux qui ont la même caractéristique que lui. Deux classes sont soit identiques, soit disjointes : les classes forment une <b>partition</b>.</p>
            <p>Modulo 3, il y a 3 restes possibles (0, 1, 2), donc 3 classes : \\(\\{\\dots, 0, 3, 6, \\dots\\}\\), \\(\\{\\dots, 1, 4, 7, \\dots\\}\\), \\(\\{\\dots, 2, 5, 8, \\dots\\}\\). Un <b>système de représentants</b> : \\(\\{0, 1, 2\\}\\), un élément par classe.</p>`,
          ask: { q: '7 et 22 sont-ils dans la même classe modulo 5 ?', items: [Ch('réponse', [['o', 'oui'], ['n', 'non']], 'o')], why: '7 = 5 + 2 et 22 = 20 + 2 : même reste 2, même classe.' } }
      ] },

      ordre: { title: 'Ordre, majorants, bornes', meth: 'majorant = plus grand ou égal à tous les éléments ; maximum = majorant qui appartient à la partie ; borne supérieure = plus petit des majorants (pas forcément atteinte) ; pour la divisibilité, sup = PPCM et inf = PGCD.', steps: [
        { h: 'Maximum ou borne supérieure ?',
          guess: { q: 'La partie \\([0\\,;\\,1[\\) de \\(\\mathbb R\\) a-t-elle un plus grand élément ?', items: [Ch('réponse', [['o', 'oui, 1'], ['p', 'oui, 0,999…'], ['n', 'non']], 'n')] },
          body: `<p>1 est un majorant de \\([0\\,;\\,1[\\), mais il n'y appartient pas : ce n'est pas un maximum. Et tout nombre \\(a < 1\\) de la partie est dépassé par \\(\\dfrac{a + 1}{2}\\), encore dedans : il n'y a <b>pas</b> de plus grand élément.</p>
            <p>En revanche, 1 est le <b>plus petit des majorants</b> : c'est la <b>borne supérieure</b>. Elle existe même quand le maximum n'existe pas.</p>`,
          ask: { q: 'Pour l\'ordre « divise » sur \\(\\mathbb N^*\\), la borne supérieure de \\(\\{4, 6\\}\\) est :', items: [Nn('\\sup', 12)], why: 'Les majorants sont les multiples communs de 4 et 6 (12, 24, …) ; le plus petit pour la divisibilité est le PPCM, 12.' } }
      ] },

      /* =================== Dénombrement =================== */
      perm: { title: 'Permutations et anagrammes', meth: '\\(n\\) objets distincts se rangent de \\(n!\\) façons ; avec des répétitions, on divise par les permutations de chaque groupe d\'objets identiques : \\(\\dfrac{n!}{n_1!\\,n_2!\\cdots}\\).', steps: [
        { h: 'Ranger n objets',
          guess: { q: 'Combien d\'anagrammes (mots, ayant un sens ou non) peut-on faire avec les lettres de ABC ?', items: [Nn('\\text{nombre}', 6)] },
          body: `<p>Pour la première place, 3 choix ; il reste 2 lettres pour la deuxième, puis 1 : \\(3\\times2\\times1 = 3! = 6\\). En général, \\(n\\) objets distincts se rangent de \\(n!\\) façons.</p>
            <p>Avec des lettres identiques, on compterait plusieurs fois le même mot. Dans LILLE, échanger les trois L ne change rien : chaque mot est compté \\(3! = 6\\) fois. On divise : \\(\\dfrac{5!}{3!} = 20\\).</p>`,
          ask: { q: 'Nombre d\'anagrammes de ANANAS ?', items: [Nn('\\text{nombre}', 60)], why: '6 lettres dont 3 A et 2 N : \\(\\dfrac{6!}{3!\\,2!} = \\dfrac{720}{12} = 60\\).' } }
      ] },

      arr: { title: 'Arrangements et combinaisons', meth: 'deux questions : l\'ordre compte-t-il ? y a-t-il répétition ? Ordre et pas de répétition : \\(A_n^k = \\dfrac{n!}{(n-k)!}\\) ; ordre sans importance : \\(\\binom nk\\) ; avec répétition et ordre : \\(n^k\\).', steps: [
        { h: 'Podium ou comité ?',
          guess: { q: 'Combien de podiums (1er, 2e, 3e) possibles avec 10 coureurs ?', items: [Nn('\\text{nombre}', 720)] },
          body: `<p>Podium : l'<b>ordre compte</b> (être 1er ou 3e, ce n'est pas pareil). 10 choix pour le 1er, 9 pour le 2e, 8 pour le 3e : \\(10\\times9\\times8 = 720 = A_{10}^3\\).</p>
            <p>Comité de 3 personnes parmi 10 : l'ordre ne compte pas. Chaque comité a été compté \\(3! = 6\\) fois dans les 720 (une fois par ordre de ses membres) : \\(\\dfrac{720}{6} = 120 = \\binom{10}{3}\\).</p>
            <p>Avec répétition (un code de 4 chiffres) : \\(10^4\\).</p>`,
          ask: { q: 'Combien de façons de choisir 2 délégués (rôles identiques) dans une classe de 30 ?', items: [Nn('\\text{nombre}', 435)], why: 'L\'ordre ne compte pas : \\(\\binom{30}{2} = \\dfrac{30\\times29}{2} = 435\\).' } },
        { h: 'Le complémentaire pour « au moins un »',
          body: `<p>« Au moins une fille » regroupe beaucoup de cas (une, deux, trois…). Plus simple : tout, moins le cas « aucune fille ». Dans une classe de 10 garçons et 5 filles, comités de 3 avec au moins une fille : \\(\\binom{15}{3} - \\binom{10}{3} = 455 - 120 = 335\\).</p>`,
          ask: { q: 'Codes de 3 chiffres (0 à 9) avec au moins un 7 ?', items: [Nn('\\text{nombre}', 271)], why: 'Tous les codes moins ceux sans 7 : \\(10^3 - 9^3 = 1000 - 729 = 271\\).' } }
      ] },

      binom: { title: 'Coefficients binomiaux', meth: '\\(\\binom nk\\) = nombre de façons de choisir \\(k\\) objets parmi \\(n\\) ; \\(\\binom nk = \\binom n{n-k}\\) (choisir ceux qu\'on garde = choisir ceux qu\'on laisse) ; Pascal \\(\\binom nk + \\binom n{k+1} = \\binom{n+1}{k+1}\\) ; \\(\\sum_k\\binom nk = 2^n\\).', steps: [
        { h: 'Comprendre les formules au lieu de les apprendre',
          guess: { q: 'Sans calcul : \\(\\binom{10}{8}\\) est égal à :', items: [Ch('réponse', [['a', '\\(\\binom{10}{2}\\)'], ['b', '\\(\\binom{8}{10}\\)'], ['c', '\\(\\binom{10}{10}\\)']], 'a')] },
          body: `<ul><li><b>Symétrie</b> : choisir les 8 qu'on garde parmi 10, c'est choisir les 2 qu'on laisse : \\(\\binom{10}{8} = \\binom{10}{2} = 45\\).</li>
            <li><b>Somme</b> : \\(\\sum_k\\binom nk\\) compte toutes les parties d'un ensemble à \\(n\\) éléments, rangées par taille : \\(2^n\\).</li>
            <li><b>Pascal</b> : pour choisir \\(k + 1\\) objets parmi \\(n + 1\\), on regarde un objet précis : soit on le prend (il reste \\(k\\) à choisir parmi \\(n\\)), soit non (\\(k + 1\\) parmi \\(n\\)).</li></ul>`,
          ask: { q: '\\(\\binom40 + \\binom41 + \\binom42 + \\binom43 + \\binom44\\) = ?', items: [Nn('\\text{somme}', 16)], why: 'C\'est le nombre de parties d\'un ensemble à 4 éléments : \\(2^4 = 16\\) (1 + 4 + 6 + 4 + 1).' } }
      ] }
    };
  };
})();
