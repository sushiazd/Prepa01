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
    const L = {
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
    /* ---------- Étapes ajoutées : exercices guidés au format du DS (suivre, compléter, écrire) ---------- */
    const guided = '<p class="fine">Exercice guidé : fais le tableau des variables sur ta feuille, puis tape les résultats.</p>';
    const MORE = {
      types: [
        { h: 'Exercice guidé : type et valeur, de l\'intérieur vers l\'extérieur',
          body: `${guided}<p>Pour <code>int('7') + 3 * 2 // 4</code> :</p><ol><li><code>int('7')</code> donne l'entier <code>7</code>.</li><li>Priorités : <code>*</code> et <code>//</code> avant <code>+</code>, de gauche à droite : <code>3 * 2 = 6</code>, puis <code>6 // 4 = 1</code>.</li><li><code>7 + 1</code>.</li></ol>
            <p>Et <code>7 / 2 * 2</code> ? <code>/</code> donne <code>3.5</code>, puis <code>7.0</code> : un float, même si la valeur est entière.</p>`,
          ask: { q: 'Valeurs :', items: [I("int('7') + 3 * 2 // 4", 8), C('type de 7 / 2 * 2', [['i', 'int'], ['f', 'float']], 'f')], why: '<code>7 + 1 = 8</code> ; <code>7 / 2 * 2 = 7.0</code>, un float car <code>/</code> donne toujours un float.' } }
      ],
      trace: [
        { h: 'Exercice guidé : une boucle au tableau',
          body: `${guided}${pre('a = 1\nb = 1\nfor i in range(4):\n    a, b = b, a + b\nprint(a)')}
            <p>Tableau : une ligne par tour.</p><table class="t"><tr><th>tour i</th><th>a</th><th>b</th></tr><tr><td>avant</td><td>1</td><td>1</td></tr><tr><td>0</td><td>1</td><td>2</td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>2</td><td>?</td><td>?</td></tr><tr><td>3</td><td>?</td><td>?</td></tr></table>
            <p><code>a, b = b, a + b</code> calcule les deux valeurs de droite <b>avant</b> d'affecter : c'est la suite de Fibonacci.</p>`,
          ask: { q: 'Qu\'affiche le programme ?', items: [I('affichage', 5)], why: 'Tour 2 : a = 3, b = 5 ; tour 3 : a = 5, b = 8. Il affiche 5.' } }
      ],
      boucles: [
        { h: 'Exercice guidé : que calcule cette fonction ?',
          body: `${guided}${pre('def f(n):\n    c = 0\n    for d in range(1, n + 1):\n        if n % d == 0:\n            c = c + 1\n    return c')}
            <ol><li>Fais tourner pour n = 6 : quels d donnent <code>n % d == 0</code> ?</li><li>Que compte c ?</li><li>Que vaut f(7) ? Qu'a de particulier 7 ?</li></ol>`,
          ask: { q: 'Résultats :', items: [I('f(6)', 4), I('f(7)', 2), C('f calcule', [['d', 'le nombre de diviseurs de n'], ['s', 'la somme des diviseurs de n'], ['p', 'si n est pair']], 'd')], why: 'Les diviseurs de 6 sont 1, 2, 3, 6 : f(6) = 4. 7 n\'a que 1 et 7 : f(7) = 2, c\'est un nombre premier.' } }
      ],
      fonc: [
        { h: 'Exercice guidé : une fonction qui renvoie deux valeurs',
          body: `${guided}${pre('def min_max(t):\n    m, M = t[0], t[0]\n    for x in t:\n        if x < m:\n            m = x\n        if x > M:\n            M = x\n    return m, M\n\na, b = min_max([4, -2, 7, 0])')}
            <p>Une fonction renvoie un seul objet, mais cet objet peut être un tuple : <code>return m, M</code>. À l'appel, on le « déballe » dans deux variables.</p>`,
          ask: { q: 'Valeurs :', items: [I('a', -2), I('b', 7)], why: 'Minimum −2, maximum 7. Remarque : on initialise avec <code>t[0]</code>, pas avec 0.' } }
      ],
      code1: [
        { h: 'Exercice guidé : écrire somme_chiffres(n)',
          body: `${guided}<p>On veut la somme des chiffres d'un entier positif : <code>somme_chiffres(472)</code> vaut 13.</p>
            <ol><li>Le dernier chiffre de n est <code>n % 10</code> ; enlever ce chiffre : <code>n // 10</code>.</li><li>Accumulateur <code>s = 0</code>, boucle <code>while n &gt; 0</code>.</li></ol>${pre('def somme_chiffres(n):\n    s = 0\n    while n > 0:\n        s = s + n % 10\n        n = n // 10\n    return s')}`,
          ask: { q: 'Que valent <code>somme_chiffres(9081)</code> et <code>somme_chiffres(0)</code> ?', items: [I('somme_chiffres(9081)', 18), I('somme_chiffres(0)', 0)], why: '9 + 0 + 8 + 1 = 18. Pour 0, la boucle ne tourne pas : s = 0, ce qui est juste. Teste toujours le cas limite.' } }
      ],
      cplx: [
        { h: 'Exercice guidé : compter les tours',
          body: `${guided}${pre('def f(n):\n    s = 0\n    for i in range(n):\n        for j in range(10):\n            s = s + i * j\n    k = n\n    while k > 1:\n        k = k // 2\n    return s')}
            <ol><li>Boucles imbriquées : n tours × 10 tours. Le 10 est une constante.</li><li>La boucle while divise par 2 : environ log₂ n tours.</li><li>On additionne les deux parties (elles se suivent) et on garde le terme dominant.</li></ol>`,
          ask: { q: 'Complexité de f :', items: [C('réponse', [['n', 'O(n)'], ['n2', 'O(n²)'], ['nl', 'O(n log n)']], 'n')], why: '10n + log n : le terme dominant est n, donc O(n). Une boucle de 10 tours fixes ne change pas l\'ordre de grandeur.' } }
      ],
      dicho: [
        { h: 'Exercice guidé : dérouler la dichotomie',
          body: `${guided}<p>On cherche 9 dans <code>t = [1, 3, 4, 7, 9, 11, 15]</code> avec la fonction du cours.</p>
            <table class="t"><tr><th>g</th><th>d</th><th>m</th><th>t[m]</th></tr><tr><td>0</td><td>6</td><td>3</td><td>7</td></tr><tr><td>?</td><td>6</td><td>?</td><td>?</td></tr></table>
            <p>7 &lt; 9 : la valeur est à droite, donc g = m + 1.</p>`,
          ask: { q: 'Au deuxième tour, et au final :', items: [I('m au 2e tour', 5), I('indice renvoyé', 4)], why: 'g = 4, d = 6, m = 5, t[5] = 11 &gt; 9 donc d = 4 ; puis g = d = 4, m = 4, t[4] = 9 : trouvé, la fonction renvoie 4.' } }
      ],
      list: [
        { h: 'Exercice guidé : construire une liste',
          body: `${guided}${pre('t = [3, 8, 1, 6]\nu = []\nfor x in t:\n    if x % 2 == 0:\n        u.append(x * 10)\nv = [x + 1 for x in t]')}
            <ol><li>u garde les pairs, multipliés par 10.</li><li>v est une liste en compréhension : <code>x + 1</code> pour chaque x de t.</li></ol>`,
          ask: { q: 'Valeurs :', items: [V('u', [80, 60]), V('v', [4, 9, 2, 7])], why: 'Pairs : 8 et 6, donc u = [80, 60]. v = [4, 9, 2, 7].' } }
      ],
      alias: [
        { h: 'Exercice guidé : une fonction modifie la liste',
          body: `${guided}${pre('def double(t):\n    for i in range(len(t)):\n        t[i] = 2 * t[i]\n\ndef double2(t):\n    t = [2 * x for x in t]\n\na = [1, 2]\nb = [1, 2]\ndouble(a)\ndouble2(b)')}
            <ol><li><code>double</code> modifie les cases de la liste reçue : c'est la même liste que <code>a</code>.</li><li><code>double2</code> fabrique une <b>nouvelle</b> liste et colle l'étiquette locale <code>t</code> dessus : <code>b</code> n'est pas touchée.</li></ol>`,
          ask: { q: 'Valeurs :', items: [V('a', [2, 4]), V('b', [1, 2])], why: 'a = [2, 4] (modifiée en place) ; b = [1, 2] (la nouvelle liste est perdue à la fin de double2, il manquait un return).' } }
      ],
      str: [
        { h: 'Exercice guidé : renverser une chaîne',
          body: `${guided}${pre("def renverse(s):\n    r = ''\n    for c in s:\n        r = c + r\n    return r")}
            <ol><li>À chaque tour, on colle la lettre <b>devant</b> ce qu'on a déjà.</li><li>Fais le tableau pour 'abc' : r = 'a', puis 'ba', puis…</li><li>Un palindrome est un mot égal à son renversé.</li></ol>`,
          ask: { q: 'Valeurs :', items: [V("renverse('chat')", 'tahc'), C("renverse('kayak') == 'kayak'", [['t', 'True'], ['f', 'False']], 't')], why: "'tahc' ; kayak se lit pareil dans les deux sens : True. (En Python, s[::-1] fait aussi le renversement.)" } }
      ],
      mat: [
        { h: 'Exercice guidé : somme de chaque ligne',
          body: `${guided}${pre('def sommes_lignes(m):\n    res = []\n    for ligne in m:\n        s = 0\n        for x in ligne:\n            s = s + x\n        res.append(s)\n    return res')}
            <ol><li>La boucle extérieure parcourt les lignes, l'intérieure les éléments d'une ligne.</li><li>L'accumulateur <code>s</code> est remis à 0 <b>pour chaque ligne</b>, d'où sa place dans la boucle.</li></ol>`,
          ask: { q: 'Que renvoie <code>sommes_lignes([[1, 2], [3, 4], [5, 6]])</code> ?', items: [V('valeur', [3, 7, 11])], why: '[1 + 2, 3 + 4, 5 + 6] = [3, 7, 11]. Si s = 0 était placé avant la première boucle, on obtiendrait [3, 10, 21].' } }
      ],
      code2: [
        { h: 'Exercice guidé : compter les éléments au-dessus de la moyenne',
          body: `${guided}${pre('def au_dessus(t):\n    moy = sum(t) / len(t)\n    c = 0\n    for x in t:\n        if x > moy:\n            c = c + 1\n    return c')}
            <ol><li>Deux parcours : un pour la moyenne, un pour compter. On ne peut pas comparer à la moyenne avant de l'avoir.</li><li>Si l'énoncé interdit <code>sum</code>, on calcule la somme avec une boucle et un accumulateur.</li></ol>`,
          ask: { q: 'Que renvoie <code>au_dessus([2, 4, 9, 7])</code> ?', items: [I('valeur', 2)], why: 'Moyenne 22 / 4 = 5,5 : 9 et 7 sont au-dessus, donc 2.' } }
      ],
      dict: [
        { h: 'Exercice guidé : inverser un dictionnaire',
          body: `${guided}${pre("notes = {'Ali': 12, 'Bea': 15, 'Cyr': 12}\npar_note = {}\nfor nom in notes:\n    n = notes[nom]\n    if n in par_note:\n        par_note[n].append(nom)\n    else:\n        par_note[n] = [nom]")}
            <ol><li>On parcourt les <b>clés</b> (les noms) ; la valeur <code>notes[nom]</code> devient la clé du nouveau dictionnaire.</li><li>Deux élèves ont 12 : leur liste a deux noms.</li></ol>`,
          ask: { q: 'Valeurs :', items: [V('par_note[12]', ['Ali', 'Cyr']), I('len(par_note)', 2)], why: "par_note = {12: ['Ali', 'Cyr'], 15: ['Bea']} : deux clés." } }
      ],
      code3: [
        { h: 'Exercice guidé : le mot le plus fréquent',
          body: `${guided}${pre("def plus_frequent(mots):\n    d = {}\n    for m in mots:\n        if m in d:\n            d[m] = d[m] + 1\n        else:\n            d[m] = 1\n    meilleur = mots[0]\n    for m in d:\n        if d[m] > d[meilleur]:\n            meilleur = m\n    return meilleur")}
            <ol><li>D'abord compter (le schéma du cours).</li><li>Puis chercher la clé de plus grande valeur, comme un maximum de liste.</li></ol>`,
          ask: { q: "Que renvoie <code>plus_frequent(['a', 'b', 'a', 'c', 'b', 'a'])</code> ?", items: [V('valeur', 'a')], why: "d = {'a': 3, 'b': 2, 'c': 1} : 'a'." } }
      ]
    };
    Object.entries(MORE).forEach(([k, st]) => { if (L[k]) L[k].steps.push(...st); });

    // les exercices du DS de l'an dernier (souvenir d'un étudiant) : suites, min/max, fusion, QCM à points négatifs
    Object.assign(L, {
      suite: { title: 'Programmer une suite', meth: 'une variable v = u₀, puis une boucle de n tours qui applique la relation (<code>v = 3 * v - 1</code>) ; <code>range(n)</code> fait n tours, donc u(0) renvoie u₀ ; si la relation contient n, c\'est la variable de boucle ; deux termes → deux variables.', steps: [
        { h: 'Une variable qui avance d\'un rang par tour',
          guess: { q: 'Pour passer de u<sub>0</sub> à u<sub>3</sub>, combien de fois applique-t-on la relation de récurrence ?', items: [I('tours', 3)] },
          body: `<p>Une suite définie par u<sub>0</sub> et u<sub>n+1</sub> = f(u<sub>n</sub>) se programme avec <b>une seule variable</b> qu'on fait avancer : au départ elle vaut u<sub>0</sub>, après un tour u<sub>1</sub>, après k tours u<sub>k</sub>. Pour u<sub>n</sub>, il faut donc <b>n tours</b> : <code>range(n)</code>.</p>${pre('def u(n):          # u0 = 2, u(n+1) = 3 u(n) - 1\n    v = 2\n    for k in range(n):\n        v = 3 * v - 1\n    return v')}<p>Pas besoin de liste : on ne garde que le terme courant. Complexité O(n).</p>`,
          ask: { q: 'Avec cette fonction, que renvoie <code>u(3)</code> ?', items: [I('valeur', 41)], why: '2 → 3 × 2 − 1 = 5 → 14 → 41 : trois tours.' } },
        { h: 'Quand la relation dépend du rang',
          body: `<p>Si u<sub>n+1</sub> = u<sub>n</sub> + 2n + 1, le terme ajouté change à chaque rang : c'est la <b>variable de boucle</b> qui joue le rôle de n. Au tour k, on passe de u<sub>k</sub> à u<sub>k+1</sub> en ajoutant 2k + 1.</p>${pre('def u(n):          # u0 = 0, u(n+1) = u(n) + 2n + 1\n    v = 0\n    for k in range(n):\n        v = v + 2 * k + 1\n    return v')}`,
          ask: { q: 'Que renvoie <code>u(3)</code> ?', items: [I('valeur', 9)], why: 'On ajoute 1 (k = 0), puis 3 (k = 1), puis 5 (k = 2) : 0 + 1 + 3 + 5 = 9.' } },
        { h: 'Deux termes : ne pas écraser trop tôt',
          guess: { q: `${pre('x = 0\ny = 1\nfor i in range(4):\n    x = y\n    y = x + y')}Ce code veut calculer Fibonacci (0, 1, 1, 2, 3…). Que vaut x à la fin ?`, items: [I('x', 8)] },
          body: `<p>Pour u<sub>n+2</sub> = u<sub>n+1</sub> + u<sub>n</sub>, on garde deux variables (x = u<sub>i</sub>, y = u<sub>i+1</sub>). Mais après <code>x = y</code>, l'ancien x est perdu : <code>y = x + y</code> calcule y + y. On obtient les puissances de 2 (1, 2, 4, 8), pas Fibonacci.</p>${pre('z = x + y     # avec une variable auxiliaire\nx = y\ny = z\n\nx, y = y, x + y    # ou en une ligne')}`,
          ask: { q: 'Avec la version corrigée, que vaut x après 4 tours (F<sub>4</sub>) ?', items: [I('x', 3)], why: '(x, y) : (0, 1) → (1, 1) → (1, 2) → (2, 3) → (3, 5) : x = 3.' } }
      ] },
      minmax: { title: 'Minimum et maximum : l\'exo bateau', meth: 'on part du premier élément (<code>m = t[0]</code>, pas 0), on parcourt, on remplace dès qu\'on trouve mieux ; pour un indice on garde l\'indice ; <code>&gt;</code> garde le premier en cas d\'égalité, <code>&gt;=</code> le dernier.', steps: [
        { h: 'Le schéma, et son piège',
          guess: { q: `${pre('def maximum(t):\n    m = 0\n    for x in t:\n        if x > m:\n            m = x\n    return m')}Que renvoie <code>maximum([-3, -1, -7])</code> ?`, items: [C('valeur', [['0', '0'], ['m1', '-1'], ['m7', '-7'], ['e', 'une erreur']], '0')] },
          body: `<p>Avec <code>m = 0</code>, aucun élément négatif n'est « plus grand » : la fonction renvoie 0, qui n'est même pas dans la liste. On part donc du <b>premier élément</b> : <code>m = t[0]</code> (la liste est non vide, l'énoncé le précise toujours).</p>${pre('def maximum(t):\n    m = t[0]\n    for x in t:\n        if x > m:\n            m = x\n    return m')}<p>Un seul parcours : O(n). Au DS, <code>max</code>, <code>min</code> et <code>sorted</code> sont interdits dans ce genre d'exercice.</p>`,
          ask: { q: 'Pour avoir le minimum ET le maximum en un seul parcours, on garde :', items: [C('réponse', [['2', 'deux variables, mini et maxi, initialisées à t[0]'], ['tri', 'on trie puis on prend t[0] et t[-1]'], ['2b', 'deux boucles, une pour chacun']], '2')], why: 'Deux variables mises à jour dans la même boucle : un seul parcours. Deux boucles marchent aussi (toujours O(n)) mais ne répondent pas à « un seul parcours » ; trier est plus coûteux et interdit.' } },
        { h: 'Indice : le premier ou le dernier ?',
          body: `<p>Pour renvoyer une <b>position</b>, on garde l'indice <code>im</code> du meilleur vu jusqu'ici et on compare <code>t[i]</code> à <code>t[im]</code>. Avec <code>t[i] &lt; t[im]</code>, une égalité ne remplace pas : on garde le <b>premier</b>. Avec <code>t[i] &lt;= t[im]</code>, une égalité remplace : on garde le <b>dernier</b>. Lis l'énoncé.</p>${pre('def indice_minimum(t):\n    im = 0\n    for i in range(len(t)):\n        if t[i] < t[im]:\n            im = i\n    return im')}`,
          ask: { q: 'Que renvoie cette fonction pour <code>[4, 1, 7, 1]</code> ?', items: [I('valeur', 1)], why: 'Le minimum 1 est aux indices 1 et 3 ; avec &lt; l\'égalité ne remplace pas : 1. Avec &lt;= on aurait 3.' } }
      ] },
      fusion: { title: 'Fusionner deux tableaux triés', meth: 'deux indices i et j ; tant que les deux tableaux ont des éléments, on ajoute le plus petit de t1[i] et t2[j] et on avance SON indice ; à la fin on recopie le reste de celui qui n\'est pas fini. O(n + m).', steps: [
        { h: 'Deux doigts sur deux listes',
          guess: { q: 'On fusionne [1, 5, 9] et [2, 3]. Quand la liste [2, 3] est épuisée, qu\'a-t-on déjà mis dans le résultat ?', items: [V('res', [1, 2, 3])] },
          body: `<p>Comme pour fusionner deux paquets de copies déjà classés : on regarde le haut de chaque paquet, on prend le plus petit, et on recommence. Un indice par tableau : <code>i</code> pour t1, <code>j</code> pour t2. Seul l'indice du tableau dont on a pris l'élément avance.</p>${pre('while i < len(t1) and j < len(t2):\n    if t1[i] <= t2[j]:\n        res.append(t1[i])\n        i = i + 1\n    else:\n        res.append(t2[j])\n        j = j + 1')}<p>Quand un tableau est épuisé, l'autre a encore des éléments (ici 5 et 9), déjà triés et plus grands que tout le reste : on les recopie avec deux petites boucles <code>while i &lt; len(t1)</code> et <code>while j &lt; len(t2)</code>. Les oublier est l'erreur classique.</p>`,
          ask: { q: 'Que renverrait la fusion de [1, 5, 9] et [2, 3] SANS les deux boucles de fin ?', items: [V('valeur', [1, 2, 3])], why: 'La boucle principale s\'arrête quand j = 2 (t2 épuisé) : res = [1, 2, 3], il manque 5 et 9.' } },
        { h: 'Pourquoi c\'est O(n + m)',
          body: `<p>À chaque tour, de n'importe laquelle des trois boucles, on ajoute exactement un élément à <code>res</code>. Le résultat a n + m éléments : il y a donc n + m tours, chacun en temps constant. C'est <b>O(n + m)</b>, ce qu'on écrit pour « la complexité de ton programme ».</p><p>À comparer : chercher chaque élément de t1 dans t2 avec <code>in</code> coûte n × m ; trier <code>t1 + t2</code> est plus lent et interdit dans l'exercice.</p>`,
          ask: { q: 'Pour l\'intersection de deux listes triées (éléments communs), avec la même idée des deux indices, la complexité est :', items: [C('réponse', [['nm', 'O(n + m)'], ['x', 'O(n × m)'], ['1', 'O(1)']], 'nm')], why: 'À chaque tour i ou j avance (ou les deux) : au plus n + m tours. Avec « x in t2 » pour chaque x de t1, ce serait O(n × m).' } }
      ] },
      qcm: { title: 'QCM à points négatifs : quand répondre', meth: 'lis le code de l\'intérieur vers l\'extérieur (t2[i] avant t1[…]), cherche l\'erreur cachée (chaîne + entier, indice ou clé qui n\'existe pas, fonction sans return) ; coche seulement si tu es sûr ou si tu hésites entre deux propositions.', steps: [
        { h: 'Le calcul qui décide s\'il faut répondre',
          body: `<p>Barème supposé : +1 si juste, −0,5 si faux, 0 sans réponse. Avec 4 propositions :</p><ul><li>au hasard : ¼ × 1 − ¾ × 0,5 = <b>−0,125</b> en moyenne, on perd ;</li><li>si tu as éliminé deux propositions (hésitation entre deux) : ½ × 1 − ½ × 0,5 = <b>+0,25</b>, on gagne ;</li><li>si tu es sûr : +1.</li></ul><p>Donc : pas de réponse au hasard, mais répondre dès que tu as éliminé deux propositions. Sur la page, le choix « Je ne réponds pas » vaut 0.</p>`,
          ask: { q: 'Tu as éliminé UNE proposition sur quatre. Répondre au hasard parmi les trois restantes rapporte en moyenne :', items: [C('réponse', [['p', '+0,25'], ['0', '0'], ['m', '−0,125']], '0')], why: '⅓ × 1 − ⅔ × 0,5 = ⅓ − ⅓ = 0 : ni gain ni perte.' } },
        { h: 'Les pièges classiques',
          guess: { q: `${pre("t1 = [10, 20, 30, 40]\nt2 = [3, 0, 2]\nprint(t1[t2[0]])")}Qu'affiche ce programme ?`, items: [C('affichage', [['40', '40'], ['10', '10'], ['3', '3'], ['e', 'Erreur (IndexError)']], '40')] },
          body: `<p><code>t2[0]</code> vaut 3, donc <code>t1[t2[0]]</code> = <code>t1[3]</code> = 40. Toujours de l'intérieur vers l'extérieur.</p><ul><li><code>'3' + 4</code> → TypeError ; <code>'3' * 4</code> → <code>'3333'</code> ; <code>'3' == 3</code> → False (sans erreur).</li><li><code>t[len(t)]</code> → IndexError ; <code>d['absente']</code> → KeyError ; <code>x in d</code> teste les clés.</li><li>Fonction sans <code>return</code> → None ; <code>t = t.append(x)</code> → None.</li><li><code>-7 // 2</code> = −4 (arrondi vers le bas) ; <code>int('3.5')</code> → ValueError mais <code>int(3.5)</code> = 3.</li></ul>`,
          ask: { q: "Qu'affiche <code>print('5' + str(2))</code> ?", items: [C('affichage', [['52', '52'], ['7', '7'], ['e', 'Erreur (TypeError)']], '52')], why: 'str(2) = \'2\' : deux chaînes, + les colle, \'52\' (affiché sans guillemets).' } }
      ] }
    });
    return L;
  };
})();
