/* =====================================================================
   Leçons « Comprendre » d'algorithmique (Python, cours de P. Rannou, chapitres 1 à 4). Une leçon par compétence
   du parcours (clé = id de SK dans index.html) : ce que fait vraiment Python, une prédiction « Devine d'abord »,
   l'explication, une question sans enjeu. meth sert d'indice dans les exercices.
   Questions : choice { label, opts: [{ v, t }] (texte simple), ans, wide }, int { label, val }, val { label, exp }.
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function () {
    const C = (label, opts, ans) => ({ type: 'choice', label, opts: opts.map(([v, t]) => ({ v, t })), ans, wide: true });
    const I = (label, val) => ({ type: 'int', label, val });
    const V = (label, exp) => ({ type: 'val', label, exp });
    const pre = s => `<pre><code>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code></pre>`;
    return {
      types: { title: 'Ce que Python fait de tes calculs', meth: 'évalue de l\'intérieur vers l\'extérieur en notant le type à chaque étape : <code>/</code> donne toujours un float, <code>//</code> et <code>%</code> sur des int donnent des int, + entre deux str colle les chaînes.', steps: [
        { h: 'Le type dépend de l\'opération, pas du résultat',
          guess: { q: 'Que vaut <code>9 / 3</code> en Python ?', items: [C('valeur', [['i', '3 (un int)'], ['f', '3.0 (un float)'], ['e', 'une erreur']], 'f')] },
          body: `<p>En Python, <code>/</code> est la division <b>réelle</b> : elle donne toujours un <code>float</code>, même quand ça tombe juste. Python ne regarde pas si le résultat « a l'air entier », il regarde l'opération.</p>
            <ul><li><code>13 // 2</code> = <code>6</code> : division <b>entière</b> (on garde le quotient).</li><li><code>13 % 2</code> = <code>1</code> : le <b>reste</b>. Pratique pour tester la parité : <code>n % 2 == 0</code>.</li><li><code>2 ** 10</code> = <code>1024</code> : puissance.</li></ul>
            <p>Moyen de vérifier : 13 = 2 × 6 + 1, quotient 6, reste 1.</p>`,
          ask: { q: 'Que vaut <code>17 // 5 + 17 % 5</code> ?', items: [I('valeur', 5)], why: '<code>17 // 5</code> = 3 et <code>17 % 5</code> = 2 (car 17 = 5 × 3 + 2) : total 5.' } },
        { h: 'Chaînes et nombres ne se mélangent pas',
          guess: { q: 'Que vaut <code>str(4) + str(5)</code> ?', items: [C('valeur', [['9', '9'], ['s9', "'9'"], ['45', "'45'"], ['e', 'une erreur']], '45')] },
          body: `<p>Le <code>+</code> change de sens selon le type : entre deux nombres il additionne, entre deux chaînes il <b>colle</b>. <code>str(4) + str(5)</code> colle <code>'4'</code> et <code>'5'</code> : <code>'45'</code>. Alors que <code>str(4 + 5)</code> calcule d'abord 9, puis le convertit : <code>'9'</code>.</p>
            <p>Entre une chaîne et un nombre, Python refuse : <code>'3+3=' + 6</code> provoque une <b>erreur</b> (TypeError). Il faut écrire <code>'3+3=' + str(6)</code>.</p>`,
          ask: { q: 'Valeur de <code>3 * \'ab\'</code> ?', items: [V('valeur', 'ababab')], why: 'Une chaîne multipliée par un entier est répétée : <code>\'ababab\'</code>.' } },
        { h: 'Comparer des chaînes : l\'ordre du dictionnaire',
          body: `<p>Deux chaînes se comparent <b>caractère par caractère</b>, comme dans un dictionnaire : on compare les premiers caractères, et seulement s'ils sont égaux on passe aux suivants. Donc <code>'10' &lt; '9'</code> est <code>True</code> : le caractère <code>'1'</code> vient avant <code>'9'</code>, la suite ne compte plus. Et les majuscules passent avant les minuscules.</p>`,
          ask: { q: '<code>\'zebre\' &lt; \'lion\'</code> vaut :', items: [C('valeur', [['t', 'True'], ['f', 'False']], 'f')], why: '\'z\' vient après \'l\' : la comparaison s\'arrête au premier caractère, <code>False</code>.' } }
      ] },

      trace: { title: 'Suivre un programme à la main', meth: 'fais un tableau avec une colonne par variable et une ligne par instruction ; une affectation <code>a = expr</code> calcule d\'abord expr avec les valeurs actuelles, puis range le résultat dans a.', steps: [
        { h: 'Une affectation range une valeur, une fois',
          guess: { q: `${pre('a = 3\nb = a\na = 5\nprint(b)')}Qu'est-ce qui s'affiche ?`, items: [I('affichage', 3)] },
          body: `<p><code>b = a</code> ne crée pas un lien permanent entre a et b : Python calcule la valeur de <code>a</code> à ce moment-là (3) et la range dans b. Quand a change ensuite, b garde 3.</p>
            <p>La méthode du DS : un <b>tableau</b>, une colonne par variable, une ligne par instruction exécutée. On ne garde jamais rien de tête.</p>`,
          ask: { q: `${pre('x = 2\ny = 7\nx = x + y\ny = x - y\nx = x - y')}Que vaut x à la fin ?`, items: [I('x', 7)],
            why: 'Tableau : x=2, y=7 ; x=9 ; y=9−7=2 ; x=9−2=7. Les valeurs de x et y ont été échangées (x = 7, y = 2).' } },
        { h: 'L\'échange de deux variables',
          body: `<p>Pour échanger a et b, écrire <code>a = b</code> puis <code>b = a</code> ne marche pas : après la première ligne, l'ancienne valeur de a est perdue. Il faut une variable auxiliaire :</p>${pre('c = a\na = b\nb = c')}<p>(En Python, <code>a, b = b, a</code> fait l'échange d'un coup.)</p>`,
          ask: { q: `${pre('a = 1\nb = 2\na = b\nb = a')}Que valent a et b ?`, items: [C('réponse', [['x', 'a = 2, b = 1'], ['y', 'a = 2, b = 2'], ['z', 'a = 1, b = 1']], 'y')], why: 'a reçoit 2, puis b reçoit la valeur actuelle de a, c\'est-à-dire 2. Le 1 est perdu.' } }
      ] },

      boucles: { title: 'Boucles : deviner ce que calcule une fonction', meth: 'fais tourner la boucle à la main sur 3 ou 4 tours (tableau des variables), puis reconnais le schéma : une somme, un compteur, un maximum… <code>range(a, b)</code> s\'arrête à b − 1.', steps: [
        { h: 'range s\'arrête juste avant la borne',
          guess: { q: `${pre('s = 0\nfor i in range(1, 5):\n    s = s + i')}Que vaut s ?`, items: [I('s', 10)] },
          body: `<p><code>range(1, 5)</code> donne 1, 2, 3, 4 : la borne de fin est <b>exclue</b>. Donc s = 1 + 2 + 3 + 4 = 10. Et <code>range(n)</code> donne 0, 1, …, n − 1, soit n valeurs.</p>
            <p>Pourquoi exclure la fin ? Pour que <code>range(len(t))</code> donne exactement les indices valides d'une liste t, de 0 à len(t) − 1.</p>`,
          ask: { q: 'Combien de tours fait <code>for i in range(3, 10)</code> ?', items: [I('tours', 7)], why: 'i prend 3, 4, …, 9 : 10 − 3 = 7 tours.' } },
        { h: 'Une boucle while : on revérifie à chaque tour',
          body: `<p><code>while condition:</code> teste la condition <b>avant chaque tour</b> ; dès qu'elle est fausse, on sort. Le corps doit finir par la rendre fausse, sinon la boucle ne s'arrête jamais.</p>${pre('c = 0\nwhile n > 0:\n    n = n // 2\n    c = c + 1')}<p>Ici, on divise n par 2 jusqu'à 0 : c compte le nombre de divisions. Pour reconnaître ce que fait une boucle, fais 3 ou 4 tours au tableau, puis cherche le schéma.</p>`,
          ask: { q: 'Avec n = 37 au départ, que vaut c à la fin de ce programme ?', items: [I('c', 6)], why: 'n : 37 → 18 → 9 → 4 → 2 → 1 → 0, soit 6 divisions. (c = nombre de chiffres de n en binaire.)' } }
      ] },

      fonc: { title: 'Fonctions : renvoyer, afficher, portée', meth: 'une fonction qui « renvoie » utilise <code>return</code> (pas print) ; les variables créées dedans sont locales ; un paramètre int modifié ne change rien dehors, une liste modifiée (append, t[i] = …) oui.', steps: [
        { h: 'return n\'est pas print',
          guess: { q: `${pre('def g(x):\n    print(2 * x)\n\ny = g(3)')}Que vaut y ?`, items: [C('y', [['6', '6'], ['n', 'None'], ['e', 'une erreur']], 'n')] },
          body: `<p><code>print</code> <b>montre</b> une valeur à l'écran, mais ne la donne pas au programme. <code>return</code> la <b>renvoie</b> à celui qui a appelé la fonction, qui peut la ranger dans une variable. Une fonction sans return renvoie <code>None</code>.</p>
            <p>Ici, <code>g(3)</code> affiche 6, mais y vaut <code>None</code>. Au DS, « écrire une fonction qui renvoie… » veut dire return, et rien à l'écran.</p>`,
          ask: { q: 'Une fonction qui calcule un résultat pour qu\'on s\'en serve ensuite doit finir par :', items: [C('réponse', [['r', 'return resultat'], ['p', 'print(resultat)']], 'r')], why: 'return : le résultat revient au programme appelant.' } },
        { h: 'Les variables d\'une fonction restent dedans',
          guess: { q: `${pre('def f(x):\n    x = x + 1\n\na = 3\nf(a)\nprint(a)')}Qu'affiche ce programme ?`, items: [I('affichage', 3)] },
          body: `<p>À l'appel <code>f(a)</code>, le paramètre x reçoit la valeur de a (3). Mais x est une variable <b>locale</b> : la modifier ne touche pas a. a vaut toujours 3.</p>
            <p>Les variables créées dans une fonction disparaissent à la fin de l'appel : les utiliser dehors provoque une erreur (NameError).</p>
            <p>Exception importante : si le paramètre est une <b>liste</b> et qu'on la modifie (<code>t.append(…)</code>, <code>t[0] = …</code>), c'est la même liste que dehors : la modification se voit (leçon « Copies et références »).</p>`,
          ask: { q: `${pre('def ajoute(t):\n    t.append(0)\n\nl = [1]\najoute(l)')}Que vaut l ?`, items: [V('l', [1, 0])], why: 't et l désignent la même liste : append la modifie, l vaut <code>[1, 0]</code>.' } }
      ] },

      code1: { title: 'Écrire une fonction : accumulateur et boucle', meth: 'recopie la signature, choisis un accumulateur (<code>s = 0</code>, <code>c = 0</code>, <code>res = []</code>), une boucle qui le met à jour, <code>return</code> à la fin ; teste à la main sur l\'exemple et sur un cas limite.', steps: [
        { h: 'Le squelette de presque toutes les fonctions du DS',
          body: `<p>Presque toutes les fonctions demandées suivent le même plan : une variable qui <b>accumule</b> le résultat, une boucle qui la met à jour, et un return.</p>${pre('def nb_multiples(n, k):\n    """Nombre de multiples de k entre 1 et n."""\n    c = 0\n    for i in range(1, n + 1):\n        if i % k == 0:\n            c = c + 1\n    return c')}
            <p>Pour une somme : <code>s = 0</code> puis <code>s = s + …</code>. Pour un produit : <code>p = 1</code> (pas 0 !). Pour construire une liste : <code>res = []</code> puis <code>res.append(…)</code>.</p>`,
          ask: { q: 'Pour calculer un produit de n nombres avec un accumulateur p, on initialise :', items: [C('réponse', [['0', 'p = 0'], ['1', 'p = 1'], ['n', 'p = n']], '1')], why: '0 annulerait tout le produit ; 1 est neutre pour la multiplication, comme 0 pour l\'addition.' } },
        { h: 'Tester avant de rendre',
          guess: { q: 'Dans <code>nb_multiples</code>, que se passe-t-il si on écrit <code>range(1, n)</code> au lieu de <code>range(1, n + 1)</code> ?', items: [C('réponse', [['ok', 'rien, c\'est pareil'], ['n', 'n lui-même n\'est plus testé'], ['1', '1 n\'est plus testé']], 'n')] },
          body: `<p>Les erreurs les plus fréquentes sont aux <b>bornes</b>. Le réflexe : dérouler la fonction sur l'exemple de l'énoncé, puis sur un cas limite (n = 0, liste vide, un seul élément). Avec <code>range(1, n)</code>, <code>nb_multiples(6, 3)</code> donnerait 1 au lieu de 2 : le 6 serait oublié.</p>`,
          ask: { q: 'Que renvoie <code>nb_multiples(10, 4)</code> ?', items: [I('valeur', 2)], why: 'Les multiples de 4 entre 1 et 10 sont 4 et 8 : 2.' } }
      ] },

      cplx: { title: 'Complexité : ce qui grandit avec n', meth: 'compte les opérations dans le pire cas en fonction de n et garde le terme dominant : boucles imbriquées → on multiplie, boucles successives → on additionne, une boucle qui divise n par 2 → log n.', steps: [
        { h: 'Compter, puis ne garder que l\'essentiel',
          guess: { q: 'Deux boucles <code>for</code> de n tours, l\'une dans l\'autre. Le nombre d\'opérations est de l\'ordre de :', items: [C('réponse', [['n', 'n'], ['2n', '2n'], ['n2', 'n²']], 'n2')] },
          body: `<p>La complexité dit comment le temps <b>grandit</b> quand n grandit. Pour chacun des n tours de la boucle extérieure, la boucle intérieure fait n tours : n × n = n² opérations. On écrit O(n²).</p>
            <p>On ne garde que le terme dominant, sans constante : 3n² + 5n + 2 → O(n²). Pour n = 1000, 3n² vaut 3 000 000, 5n seulement 5000 : le reste est négligeable.</p>`,
          ask: { q: `${pre('for i in range(n):\n    for j in range(i):\n        c = c + 1')}Complexité ?`, items: [C('réponse', [['n', 'O(n)'], ['n2', 'O(n²)'], ['l', 'O(log n)']], 'n2')], why: '0 + 1 + … + (n − 1) = n(n − 1)/2 tours : c\'est quand même O(n²), le 1/2 est une constante.' } },
        { h: 'Diviser par 2 à chaque tour : log n',
          body: `<p>Une boucle qui fait <code>n = n // 2</code> jusqu'à 0 fait environ log₂(n) tours : pour n = 1000, une dizaine ; pour n = 1 000 000, une vingtaine. C'est O(log n), énorme gain par rapport à O(n).</p>
            <p>Et une boucle de 100 tours <b>fixes</b>, qui ne dépend pas de n, c'est O(1) : elle ne grandit pas avec n.</p>`,
          ask: { q: 'Une boucle de n tours, puis (après, pas dedans) deux boucles imbriquées de n tours. Complexité ?', items: [C('réponse', [['a', 'O(n)'], ['b', 'O(n²)'], ['c', 'O(n³)']], 'b')], why: 'Boucles successives : on additionne, n + n², et on garde le terme dominant n².' } }
      ] },

      dicho: { title: 'Recherche dichotomique : couper en deux', meth: 'la liste doit être triée ; on garde un intervalle [g, d], on regarde le milieu m = (g + d) // 2 et on jette la moitié où la valeur ne peut pas être, tant que g ≤ d.', steps: [
        { h: 'Le jeu du « plus ou moins »',
          guess: { q: 'Tu dois trouver un nombre entre 1 et 1000 ; on te répond « plus grand » ou « plus petit ». Avec la meilleure stratégie, combien de questions au maximum ?', items: [C('réponse', [['10', 'environ 10'], ['100', 'environ 100'], ['500', 'environ 500']], '10')] },
          body: `<p>La meilleure stratégie : proposer le <b>milieu</b>. Chaque réponse élimine la moitié des possibilités : 1000 → 500 → 250 → … → 1 en une dizaine de questions (2¹⁰ = 1024).</p>
            <p>La recherche dichotomique fait pareil dans une liste <b>triée</b> : on compare au milieu, et on ne garde que la moitié où la valeur peut encore être. D'où la complexité O(log n), contre O(n) pour un parcours.</p>`,
          ask: { q: 'Dans une liste triée d\'un million d\'éléments, combien de comparaisons au plus (environ) ?', items: [C('réponse', [['20', '20'], ['1000', '1000'], ['5e5', '500 000']], '20')], why: '2²⁰ ≈ 1 000 000 : une vingtaine de coupes en deux suffisent.' } },
        { h: 'Le code, et pourquoi il faut une liste triée',
          body: `${pre('def dicho(t, x):\n    g, d = 0, len(t) - 1\n    while g <= d:\n        m = (g + d) // 2\n        if t[m] == x:\n            return m\n        elif t[m] < x:\n            g = m + 1\n        else:\n            d = m - 1\n    return -1')}
            <p>Si <code>t[m] &lt; x</code>, comme la liste est triée, tout ce qui est à gauche de m est encore plus petit : x ne peut être qu'à droite, on pose <code>g = m + 1</code>. Sans tri, ce raisonnement est faux.</p>`,
          ask: { q: 'Dans <code>t = [2, 5, 8, 12, 20]</code>, on cherche 12. Quel est le premier indice m regardé ?', items: [I('m', 2)], why: 'g = 0, d = 4, m = (0 + 4) // 2 = 2 : t[2] = 8 &lt; 12, donc g = 3, puis m = 3 et t[3] = 12, trouvé.' } }
      ] },

      list: { title: 'Listes : indices et tranches', meth: 'les indices vont de 0 à len(t) − 1, <code>t[-1]</code> est le dernier ; une tranche <code>t[a:b]</code> va de a à b − 1 et crée une nouvelle liste ; <code>append</code> ajoute un élément.', steps: [
        { h: 'On compte à partir de 0',
          guess: { q: 'Avec <code>t = [4, 7, 1, 9]</code>, que vaut <code>t[1:3]</code> ?', items: [V('t[1:3]', [7, 1])] },
          body: `<p>Le premier élément est <code>t[0]</code>, le dernier <code>t[len(t) - 1]</code>, qu'on peut aussi écrire <code>t[-1]</code>. Une tranche <code>t[a:b]</code> prend les indices a, a + 1, …, b − 1 (comme range) : <code>t[1:3]</code> = <code>[7, 1]</code>.</p>
            <p><code>t[len(t)]</code> provoque une erreur (IndexError) : cet indice n'existe pas.</p>`,
          ask: { q: 'Avec la même liste, que vaut <code>t[-1] + t[0]</code> ?', items: [I('valeur', 13)], why: 'Dernier élément 9, premier 4 : 13.' } },
        { h: 'append ou + ?',
          body: `<p><code>t.append(x)</code> ajoute <b>un</b> élément à la fin de t (t est modifiée). <code>t + [x]</code> crée une <b>nouvelle</b> liste. Et <code>t.append([1, 2])</code> ajoute une liste comme un seul élément : <code>[…, [1, 2]]</code>.</p>`,
          ask: { q: `${pre('t = [1, 2]\nt.append([3, 4])')}Que vaut <code>len(t)</code> ?`, items: [I('len(t)', 3)], why: 'La liste [3, 4] est ajoutée comme un seul élément : t = [1, 2, [3, 4]], de longueur 3.' } }
      ] },

      alias: { title: 'Copies et références', meth: '<code>y = x</code> ne copie pas une liste, les deux noms désignent la même ; pour copier : <code>list(x)</code> ou <code>x[:]</code>, et pour une liste de listes, copier chaque ligne : <code>[list(l) for l in x]</code>.', steps: [
        { h: 'Deux étiquettes sur la même boîte',
          guess: { q: `${pre('x = [1, 2]\ny = x\ny.append(3)\nprint(x)')}Qu'est-ce qui s'affiche ?`, items: [V('affichage', [1, 2, 3])] },
          body: `<p>Une variable est une <b>étiquette</b> collée sur un objet. <code>y = x</code> colle une deuxième étiquette sur la <b>même</b> liste : il n'y a qu'une liste. La modifier par y, c'est la modifier pour x aussi.</p>
            <p>Avec des int, on ne voit pas ce problème : on ne peut pas modifier un entier, <code>a = a + 1</code> crée un nouvel entier et déplace l'étiquette.</p>`,
          ask: { q: 'Pour obtenir une vraie copie indépendante d\'une liste simple x :', items: [C('réponse', [['a', 'y = x'], ['b', 'y = list(x)'], ['c', 'y = x.append()']], 'b')], why: '<code>list(x)</code> (ou <code>x[:]</code>) fabrique une nouvelle liste avec les mêmes éléments.' } },
        { h: 'Le piège des listes de listes',
          body: `<p>Pour une matrice <code>x = [[1, 2], [3, 4]]</code>, <code>list(x)</code> copie la liste extérieure, mais les lignes sont encore partagées. Il faut copier chaque ligne : <code>[list(l) for l in x]</code> (exercice 29 du poly).</p>`,
          ask: { q: `${pre('x = [[1, 2], [3, 4]]\ny = list(x)\ny[0][0] = 9')}Que vaut <code>x[0][0]</code> ?`, items: [I('x[0][0]', 9)], why: 'y est une nouvelle liste, mais y[0] et x[0] sont la même ligne : x[0][0] vaut 9.' } }
      ] },

      str: { title: 'Chaînes de caractères', meth: 'une chaîne se lit comme une liste (s[i], s[a:b], len, for c in s) mais ne se modifie pas : on construit une nouvelle chaîne (par concaténation, ou list(s) puis \'\'.join).', steps: [
        { h: 'Comme une liste, sauf qu\'on ne la modifie pas',
          guess: { q: '<code>s = \'chat\'</code> puis <code>s[0] = \'r\'</code>. Résultat ?', items: [C('réponse', [['r', 's vaut \'rhat\''], ['e', 'une erreur'], ['c', 's vaut toujours \'chat\', sans erreur']], 'e')] },
          body: `<p>Une chaîne se lit comme une liste de lettres : <code>s[0]</code>, <code>s[1:3]</code>, <code>len(s)</code>, <code>for c in s</code>. Mais elle est <b>non modifiable</b> : <code>s[0] = 'r'</code> provoque une erreur (TypeError).</p>
            <p>Pour « modifier », on en construit une nouvelle : <code>s = 'r' + s[1:]</code> donne <code>'rhat'</code>. Ou bien <code>l = list(s)</code>, on modifie la liste, puis <code>''.join(l)</code>.</p>`,
          ask: { q: 'Valeur de <code>\'-\'.join([\'a\', \'b\', \'c\'])</code> ?', items: [V('valeur', 'a-b-c')], why: 'join recolle les morceaux avec le séparateur entre eux : \'a-b-c\'.' } }
      ] },

      mat: { title: 'Matrices : des listes de lignes', meth: '<code>m[i][j]</code> = ligne i, colonne j ; <code>len(m)</code> lignes, <code>len(m[0])</code> colonnes ; deux boucles imbriquées pour tout parcourir ; créer avec <code>[[0] * p for i in range(n)]</code>.', steps: [
        { h: 'D\'abord la ligne, puis la colonne',
          guess: { q: 'Avec <code>m = [[1, 2, 3], [4, 5, 6]]</code>, que vaut <code>m[1][0]</code> ?', items: [I('m[1][0]', 4)] },
          body: `<p>Une matrice est une liste de <b>lignes</b>. <code>m[1]</code> est la deuxième ligne <code>[4, 5, 6]</code>, et <code>m[1][0]</code> son premier élément : 4.</p><p><code>len(m)</code> = nombre de lignes (2), <code>len(m[0])</code> = nombre de colonnes (3). Parcours complet :</p>${pre('for i in range(len(m)):\n    for j in range(len(m[0])):\n        ... m[i][j] ...')}`,
          ask: { q: 'Somme de la colonne 2 de m (indice 2) ?', items: [I('somme', 9)], why: 'm[0][2] + m[1][2] = 3 + 6 = 9.' } },
        { h: 'Le piège de [[0] * p] * n',
          body: `<p><code>[[0] * 3] * 2</code> crée une ligne, puis <b>deux étiquettes</b> vers cette même ligne : modifier <code>m[0][0]</code> modifie aussi <code>m[1][0]</code>. La bonne façon fabrique une nouvelle ligne à chaque tour : <code>[[0] * 3 for i in range(2)]</code>.</p>`,
          ask: { q: 'Avec <code>m = [[0] * 3] * 2</code> puis <code>m[0][0] = 5</code>, que vaut <code>m[1][0]</code> ?', items: [I('m[1][0]', 5)], why: 'Les deux lignes sont la même liste : 5.' } }
      ] },

      code2: { title: 'Écrire une fonction sur des tableaux', meth: 'parcours par indices <code>for i in range(len(t))</code> quand la position compte, par valeurs <code>for x in t</code> sinon ; pour un maximum, on part de <code>t[0]</code> (pas de 0) ; on teste sur la liste vide et sur un seul élément.', steps: [
        { h: 'Indices ou valeurs ?',
          body: `<p>Si on a besoin de la <b>position</b> (renvoyer un indice, comparer t[i] et t[i + 1]), on parcourt les indices. Sinon, parcourir les valeurs est plus simple et évite les erreurs.</p>${pre('def indice_maximum(t):\n    """Indice du maximum du tableau non vide t."""\n    im = 0\n    for i in range(len(t)):\n        if t[i] > t[im]:\n            im = i\n    return im')}`,
          ask: { q: 'Pour calculer la valeur maximale d\'une liste qui peut contenir des nombres négatifs, on initialise :', items: [C('réponse', [['0', 'm = 0'], ['t0', 'm = t[0]'], ['n', 'm = -1']], 't0')], why: 'Avec m = 0, une liste [-5, -2] renverrait 0, qui n\'y est même pas. On part du premier élément.' } },
        { h: 'Comparer des voisins',
          guess: { q: 'Pour tester si t est triée par ordre croissant, on compare t[i] et t[i + 1] pour i dans :', items: [C('réponse', [['a', 'range(len(t))'], ['b', 'range(len(t) - 1)'], ['c', 'range(1, len(t))']], 'b')] },
          body: `<p>Avec <code>range(len(t))</code>, au dernier tour i + 1 = len(t) : IndexError. Il faut s'arrêter un cran avant : <code>range(len(t) - 1)</code>.</p>${pre('def est_triee(t):\n    for i in range(len(t) - 1):\n        if t[i] > t[i + 1]:\n            return False\n    return True')}<p>Le <code>return True</code> est <b>après</b> la boucle : on ne peut conclure « triée » qu'après avoir tout vérifié.</p>`,
          ask: { q: 'Que renvoie <code>est_triee([])</code> ?', items: [C('réponse', [['t', 'True'], ['f', 'False'], ['e', 'une erreur']], 't')], why: 'La boucle ne fait aucun tour, on arrive au return True : une liste vide est triée.' } }
      ] },

      dict: { title: 'Dictionnaires : une table clé → valeur', meth: 'on accède par la clé <code>d[c]</code> (KeyError si absente : tester <code>c in d</code>) ; <code>for c in d</code> parcourt les clés ; pour compter : <code>if x in d: d[x] = d[x] + 1</code> sinon <code>d[x] = 1</code>.', steps: [
        { h: 'Un dictionnaire, c\'est un annuaire',
          guess: { q: '<code>d = {\'a\': 1}</code> puis <code>print(d[\'b\'])</code>. Résultat ?', items: [C('réponse', [['n', 'None'], ['0', '0'], ['e', 'une erreur (KeyError)']], 'e')] },
          body: `<p>Un dictionnaire associe des <b>clés</b> à des <b>valeurs</b>, comme un annuaire associe un nom à un numéro. On cherche par la clé : <code>d['a']</code>. Une clé absente provoque une erreur : on teste avant avec <code>'b' in d</code> (qui teste les <b>clés</b>, pas les valeurs).</p>
            <p>L'accès par la clé est immédiat (O(1)), même avec un million d'entrées, alors que chercher dans une liste demande de la parcourir (O(n)).</p>`,
          ask: { q: '<code>d = {\'x\': 5, \'y\': 2}</code>. Que vaut <code>\'5\' in d</code> ?', items: [C('valeur', [['t', 'True'], ['f', 'False']], 'f')], why: '<code>in</code> teste les clés (\'x\' et \'y\'), et de toute façon \'5\' est une chaîne, pas l\'entier 5 : False.' } },
        { h: 'Le schéma pour compter',
          body: `${pre('def compte(s):\n    d = {}\n    for c in s:\n        if c in d:\n            d[c] = d[c] + 1\n        else:\n            d[c] = 1\n    return d')}<p>Chaque lettre déjà vue voit son compteur augmenter ; une nouvelle lettre est créée avec 1. Ce schéma revient à presque chaque DS.</p>`,
          ask: { q: 'Dans <code>compte(\'banane\')</code>, que vaut la valeur associée à \'n\' ?', items: [I('d[\'n\']', 2)], why: 'b, a, n, a, n, e : deux n.' } }
      ] },

      code3: { title: 'Écrire une fonction avec un dictionnaire', meth: 'choisis ce qui sert de clé (ce qu\'on cherche vite) et de valeur (ce qu\'on accumule) ; dictionnaire vide au départ, mise à jour dans la boucle avec le test <code>in</code>, return du dictionnaire ou d\'un résultat calculé dessus.', steps: [
        { h: 'Choisir la clé et la valeur',
          body: `<p>Avant d'écrire, réponds à deux questions : « que veut-on retrouver vite ? » (c'est la <b>clé</b>) et « qu'accumule-t-on pour chacun ? » (c'est la <b>valeur</b>). Pour regrouper des élèves par note : clé = la note, valeur = la liste des noms.</p>${pre('def par_note(notes):\n    """notes : dictionnaire nom -> note."""\n    d = {}\n    for nom in notes:\n        n = notes[nom]\n        if n in d:\n            d[n].append(nom)\n        else:\n            d[n] = [nom]\n    return d')}`,
          ask: { q: 'Pour trouver le mot le plus fréquent d\'un texte, la clé du dictionnaire est :', items: [C('réponse', [['m', 'le mot'], ['n', 'le nombre d\'apparitions'], ['p', 'la position dans le texte']], 'm')], why: 'On compte par mot (clé = mot, valeur = compteur), puis on cherche la clé de plus grande valeur.' } }
      ] }
    };
  };
})();
