/* =====================================================================
   Leçons « Comprendre » d'électronique numérique (ELECn · J. Bézy-Wendling) :
   Séquence A (logique combinatoire), Séquence B (logique séquentielle), Séquence C (conversion CAN/CNA).
   Une leçon par compétence du parcours (clé = id de SK dans index.html) : l'image concrète,
   une prédiction « Devine d'abord », l'explication avec les notations du cours, une question sans enjeu,
   puis un calcul guidé au format des TD et quizz. meth sert d'indice dans les exercices.
   ===================================================================== */
(function () {
  'use strict';
  window.SITE_LEARN = function (H) {
    const { Ch, Nn, Bw } = H;
    const guided = '<p class="fine">Calcul guidé : fais-le sur ta feuille, étape par étape, puis tape les résultats.</p>';
    const L = {
      /* =================== SÉQUENCE A : LOGIQUE COMBINATOIRE =================== */
      num: {
        title: 'Bases 2, 8, 10, 16 : grouper les bits',
        meth: 'en base \\(B\\), le rang \\(i\\) pèse \\(B^i\\) (et \\(B^{-1}, B^{-2}\\dots\\) après la virgule). Entre binaire et octal, groupe par 3 bits à partir de la virgule ; entre binaire et hexadécimal (A=10…F=15), groupe par 4 bits. De la base 10 vers une base \\(B\\) : divisions entières successives par \\(B\\), restes lus de bas en haut.',
        steps: [
          {
            h: 'Un même nombre, quatre écritures pondérées',
            guess: {
              q: 'En base 2, que vaut le poids du bit juste à gauche du bit des unités (rang 0) ?',
              items: [Ch('réponse', [['2', '2'], ['10', '10'], ['8', '8']], '2')]
            },
            body: `<p>Dans toute base \\(B\\), chaque position a un <b>poids</b> égal à une puissance de \\(B\\) (poids forts à gauche, poids faibles à droite) :</p>
              \\[N = \\sum_{i=0}^{n-1} a_i\\,B^i\\]
              <ul><li><b>Base 2 (binaire)</b> : 2 symboles \\(\\{0, 1\\}\\) (bits), poids \\(1, 2, 4, 8, 16, 32, 64, 128\\dots\\)</li>
              <li><b>Base 8 (octal)</b> : 8 symboles \\(\\{0\\dots 7\\}\\), poids \\(1, 8, 64\\dots\\)</li>
              <li><b>Base 16 (hexadécimal)</b> : 16 symboles \\(\\{0\\dots 9, \\mathrm{A}, \\mathrm{B}, \\mathrm{C}, \\mathrm{D}, \\mathrm{E}, \\mathrm{F}\\}\\) où \\(\\mathrm{A}=10, \\mathrm{B}=11, \\mathrm{C}=12, \\mathrm{D}=13, \\mathrm{E}=14, \\mathrm{F}=15\\).</li></ul>
              <p>Après la virgule, les poids sont \\(B^{-1}, B^{-2}, B^{-3}\\dots\\) En binaire : \\(2^{-1}=0{,}5\\), \\(2^{-2}=0{,}25\\), \\(2^{-3}=0{,}125\\).</p>`,
            ask: {
              q: 'Que vaut \\(10110_2\\) en décimal ?',
              items: [Nn('N_{10}', 22)],
              why: '\\(1\\times 2^4 + 0\\times 2^3 + 1\\times 2^2 + 1\\times 2^1 + 0\\times 2^0 = 16 + 4 + 2 = 22_{10}\\).'
            }
          },
          {
            h: 'Le raccourci binaire ↔ octal (3 bits) et hexadécimal (4 bits)',
            body: `<p>Comme \\(8 = 2^3\\) et \\(16 = 2^4\\), on convertit <b>sans passer par la base 10</b> :</p>
              <ul><li><b>Binaire ↔ Octal</b> : coupe en paquets de <b>3 bits</b> en partant de la virgule (ajoute des 0 aux extrémités si besoin).</li>
              <li><b>Binaire ↔ Hexadécimal</b> : coupe en paquets de <b>4 bits</b> en partant de la virgule.</li></ul>
              <p>Pour convertir un grand entier décimal vers la base \\(B\\), on divise successivement le quotient par \\(B\\) jusqu'à obtenir un quotient nul, et on lit les <b>restes de bas en haut</b> (le dernier reste est le poids fort).</p>`,
            ask: {
              q: 'Convertis \\(1011\\,1001_2\\) en hexadécimal :',
              items: [Bw('N_{16}', 'B9')],
              why: '\\(1011_2 = 8+2+1 = 11 = \\mathrm{B}\\) et \\(1001_2 = 8+1 = 9\\), donc \\(\\mathrm{B9}_{16}\\).'
            }
          },
          {
            h: 'Calcul guidé : nombre à virgule (Quizz Numération)',
            body: `${guided}<p>On veut convertir \\(13{,}625_{10}\\) en binaire, octal et hexadécimal :</p>
              <ol><li>Partie entière : \\(13 = 8 + 4 + 1 = 1101_2\\).</li>
              <li>Partie fractionnaire : \\(0{,}625 = 0{,}5 + 0{,}125 = 2^{-1} + 2^{-3} = 0{,}101_2\\), donc \\(1101{,}101_2\\).</li>
              <li>Pour l'hexadécimal, complète à 4 bits après la virgule : \\(1101{,}1010_2\\).</li></ol>`,
            ask: {
              q: 'Résultats en octal et en hexadécimal (avec une virgule) :',
              items: [Bw('N_8', '15,5'), Bw('N_{16}', 'D,A')],
              why: 'En octal (blocs de 3 bits autour de la virgule) : \\(001\\,101{,}101_2 = 15{,}5_8\\). En hexa (blocs de 4 bits) : \\(1101{,}1010_2 = \\mathrm{D{,}A}_{16}\\).'
            }
          }
        ]
      },

      addb: {
        title: 'Addition binaire, opérateur ADD et complément à 2',
        meth: 'addition binaire de droite à gauche : \\(1+1 = 0\\) (retenue 1), \\(1+1+1 = 1\\) (retenue 1). L\'opérateur ADD sur \\(n\\) bits fournit la somme \\(\\text{SOM}\\) et la retenue sortante \\(\\text{rep} = r_n\\). En complément à 2 sur \\(n\\) bits : bit de gauche = signe (\\(1\\) si négatif) ; pour opposer un nombre, inverse tous les bits et ajoute 1.',
        steps: [
          {
            h: 'Additionner bit par bit et propager la retenue',
            guess: {
              q: 'En binaire, que donne \\(1 + 1 + 1\\) (deux bits à 1 plus une retenue entrante à 1) ?',
              items: [Ch('réponse', [['11', 'somme \\(s_i = 1\\) et retenue \\(r_{i+1} = 1\\)'], ['10', 'somme \\(s_i = 0\\) et retenue \\(r_{i+1} = 1\\)'], ['01', 'somme \\(s_i = 1\\) et retenue \\(r_{i+1} = 0\\)']], '11')]
            },
            body: `<p>L'algorithme d'addition binaire part de \\(r_0 = 0\\) à droite et calcule rang par rang \\((x_i, y_i, r_i) \\mapsto (r_{i+1}, s_i)\\) :</p>
              <ul><li>0 ou un seul <code>1</code> : \\(s_i = x_i + y_i + r_i\\), retenue \\(r_{i+1} = 0\\) ;</li>
              <li>deux <code>1</code> (total 2, soit \\(10_2\\)) : \\(s_i = 0\\), retenue \\(r_{i+1} = 1\\) ;</li>
              <li>trois <code>1</code> (total 3, soit \\(11_2\\)) : \\(s_i = 1\\), retenue \\(r_{i+1} = 1\\).</li></ul>
              <p>L'opérateur <b>ADD</b> sur \\(n\\) bits reçoit \\(X\\) et \\(Y\\), et délivre le mot \\(\\text{SOM} = s_{n-1}\\dots s_0\\) ainsi que le bit <b>rep</b> (report ou retenue sortante \\(r_n\\)).</p>`,
            ask: {
              q: 'Pour \\(X = 1011_2\\) et \\(Y = 0011_2\\) sur 4 bits, que valent \\(\\text{SOM}\\) et \\(\\text{rep}\\) ?',
              items: [Bw('\\text{SOM}', '1110'), Nn('\\text{rep}', 0)],
              why: '\\(11 + 3 = 14 = 1110_2\\) : cela tient sur 4 bits, donc \\(\\text{SOM} = 1110\\) et \\(\\text{rep} = 0\\).'
            }
          },
          {
            h: 'Entiers signés : le complément à 2 (TD Séquence A)',
            body: `<p>Pour coder les nombres négatifs sur \\(n\\) bits en <b>complément à 2</b> :</p>
              <ul><li>Le bit de poids fort (à gauche) donne le <b>signe</b> : <code>0</code> = positif, <code>1</code> = négatif.</li>
              <li>Pour passer de \\(+X\\) à \\(-X\\) : on <b>inverse tous les bits</b> (complément à 1) puis on <b>ajoute 1</b>. (Astuce rapide : en partant de la droite, garde tous les bits jusqu'au premier <code>1</code> inclus, puis inverse tous les bits suivants.)</li></ul>`,
            ask: {
              q: 'Code \\(-2\\) en complément à 2 sur 4 bits :',
              items: [Bw('-2\\text{ sur 4 bits}', '1110')],
              why: '\\(+2 = 0010_2\\). En inversant tous les bits : \\(1101\\), plus \\(1\\) : \\(1110\\).'
            }
          },
          {
            h: 'Calcul guidé : décoder un octet signé en complément à 2',
            body: `${guided}<p>On donne l'octet signé en complément à 2 : <code>11011001</code> (TD Chap A1 Ex 3).</p>
              <ol><li>Bit de gauche = <code>1</code>, donc le nombre est négatif.</li>
              <li>Inverse tous les bits : <code>00100110</code>, puis ajoute 1 : <code>00100111</code>.</li>
              <li>Convertis cette valeur absolue en décimal, puis remets le signe moins.</li></ol>`,
            ask: {
              q: 'Valeur décimale :',
              items: [Nn('N_{10}', -39)],
              why: '\\(00100111_2 = 32 + 4 + 2 + 1 = 39\\), donc <code>11011001</code> code \\(-39\\).'
            }
          }
        ]
      },

      boole: {
        title: 'Portes logiques, Boole et De Morgan',
        meth: 'ET = produit (\\(&\\)), OU = somme (\\(\\ge 1\\)), XOR = \\(A\\oplus B = \\bar{A}B + A\\bar{B}\\) (\\(=1\\)), XNOR = coïncidence \\(\\overline{A\\oplus B} = \\bar{A}\\bar{B} + AB\\). Absorption : \\(A + AB = A\\) et \\(A + \\bar{A}B = A + B\\). De Morgan : casser une barre change \\(\\cdot\\) en \\(+\\) (et inversement).',
        steps: [
          {
            h: 'Les portes élémentaires et leurs deux symboles',
            guess: {
              q: 'La porte « coïncidence » (XNOR, \\(\\overline{A\\oplus B}\\)) à 2 entrées vaut 1 lorsque :',
              items: [Ch('réponse', [['eq', '\\(A\\) et \\(B\\) sont égaux (00 ou 11)'], ['diff', '\\(A\\) et \\(B\\) sont différents (01 ou 10)'], ['11', 'seulement quand \\(A=1\\) et \\(B=1\\)']], 'eq')]
            },
            body: `<p>Le cours présente côte à côte les symboles américains et européens (rectangulaires) :</p>
              <ul><li><b>ET (AND)</b> : \\(S = A\\cdot B\\), symbole rectangle <code>&amp;</code>.</li>
              <li><b>OU (OR)</b> : \\(S = A + B\\), symbole rectangle <code>&gt;=1</code>.</li>
              <li><b>NON-ET (NAND)</b> : \\(\\overline{A\\cdot B}\\), et <b>NON-OU (NOR)</b> : \\(\\overline{A+B}\\).</li>
              <li><b>OU exclusif (XOR)</b> : \\(A\\oplus B = \\bar{A}B + A\\bar{B}\\) (sortie à 1 si un nombre impair d'entrées vaut 1), symbole <code>=1</code>.</li>
              <li><b>Coïncidence (XNOR)</b> : \\(\\overline{A\\oplus B} = \\bar{A}\\bar{B} + AB\\) (sortie à 1 si \\(A = B\\)), symbole <code>=1</code> avec sortie inversée.</li></ul>`,
            ask: {
              q: 'Que vaut \\(A \\oplus 1\\) ?',
              items: [Ch('réponse', [['na', '\\(\\bar{A}\\)'], ['a', '\\(A\\)'], ['1', '\\(1\\)'], ['0', '\\(0\\)']], 'na')],
              why: '\\(A\\oplus 1 = \\bar{A}\\cdot 1 + A\\cdot 0 = \\bar{A}\\) : un XOR avec une entrée forcée à 1 agit comme un inverseur commandé.'
            }
          },
          {
            h: 'Absorption et théorèmes de De Morgan',
            body: `<p>Deux règles d'absorption reviennent dans tous les exercices :</p>
              \\[A + A\\cdot B = A \\qquad ; \\qquad A + \\bar{A}\\cdot B = A + B\\]
              <p><b>Théorèmes de De Morgan</b> : couper une grande barre inverse l'opérateur sous la barre :</p>
              \\[\\overline{A\\cdot B} = \\bar{A} + \\bar{B} \\qquad ; \\qquad \\overline{A + B} = \\bar{A}\\cdot\\bar{B}\\]
              <p>Pour réaliser une fonction <b>uniquement avec des portes NAND</b> (ou uniquement NOR), on écrit \\(F = \\overline{\\overline{F}}\\) et on casse la barre du bas avec De Morgan.</p>`,
            ask: {
              q: 'Simplifie \\(F = A + \\bar{A}B + \\bar{A}\\bar{B}C\\) :',
              items: [Ch('réponse', [['abc', '\\(A + B + C\\)'], ['ab', '\\(A + B\\)'], ['p', '\\(A\\cdot B\\cdot C\\)']], 'abc')],
              why: '\\(A + \\bar{A}B = A + B\\), puis \\((A+B) + \\overline{(A+B)}\\,C = A + B + C\\) (Quizz Boole Q2).'
            }
          },
          {
            h: 'Calcul guidé : passage au tout-NAND',
            body: `${guided}<p>On veut câbler \\(F = A\\cdot B + C\\cdot D\\) uniquement avec des portes NAND à 2 entrées :</p>
              <ol><li>Double complémentation : \\(F = \\overline{\\overline{A\\cdot B + C\\cdot D}}\\).</li>
              <li>Applique De Morgan à la barre intermédiaire : le \\(+\\) devient un \\(\\cdot\\).</li></ol>`,
            ask: {
              q: 'Expression tout-NAND obtenue :',
              items: [Ch('réponse', [['ok', '\\(\\overline{\\overline{A\\cdot B}\\cdot\\overline{C\\cdot D}}\\) (3 portes NAND)'], ['ko1', '\\(\\overline{A\\cdot B} + \\overline{C\\cdot D}\\)'], ['ko2', '\\(\\overline{\\overline{A+B} + \\overline{C+D}}\\)']], 'ok')],
              why: 'Une somme de produits se transforme directement en un arbre de portes NAND : deux NAND au premier étage et une NAND en sortie.'
            }
          }
        ]
      },

      canon: {
        title: 'Formes canoniques (SDP, PDS) et liste de poids',
        meth: 'Somme de Produits (SDP) : prends les lignes où \\(F=1\\), écris \\(x_i\\) si le bit vaut 1 et \\(\\bar{x}_i\\) s\'il vaut 0. Produit de Sommes (PDS) : prends les lignes où \\(F=0\\), écris \\(x_i\\) si le bit vaut 0 et \\(\\bar{x}_i\\) s\'il vaut 1. Liste de poids : équivalents décimaux des lignes où \\(F=1\\).',
        steps: [
          {
            h: 'Somme de Produits (SDP) vs Produit de Sommes (PDS)',
            guess: {
              q: 'Dans une forme canonique à 3 variables \\((a,b,c)\\), combien de variables contient chaque terme ?',
              items: [Ch('réponse', [['3', 'toujours les 3 variables (directes ou complémentées)'], ['1', '1 ou 2 variables'], ['2', 'seulement les variables à 1']], '3')]
            },
            body: `<p>Une forme est dite <b>canonique</b> si chaque terme contient <b>toutes les variables</b> :</p>
              <ul><li><b>Somme de Produits (SDP)</b> : on lit les lignes où <b>\\(F = 1\\)</b>. Pour \\(a=1, b=0, c=1\\), le produit vaut 1, donc on écrit \\(a\\bar{b}c\\).</li>
              <li><b>Produit de Sommes (PDS)</b> : on lit les lignes où <b>\\(F = 0\\)</b>. Pour que la somme vaille 0 quand \\(a=0, b=1, c=0\\), on inverse : \\((a + \\bar{b} + c)\\).</li></ul>`,
            ask: {
              q: 'Pour \\(F(a,b,c)\\), la seule ligne où \\(F=0\\) est \\(a=1, b=1, c=0\\). Quelle est sa forme canonique PDS ?',
              items: [Ch('réponse', [['ok', '\\(\\bar{a} + \\bar{b} + c\\)'], ['ko1', '\\(a + b + \\bar{c}\\)'], ['ko2', '\\(ab\\bar{c}\\)']], 'ok')],
              why: 'Ligne \\(F=0\\) en \\(110\\) : on inverse chaque bit pour écrire une somme nulle en \\(110\\), soit \\((\\bar{a} + \\bar{b} + c)\\).'
            }
          },
          {
            h: 'La représentation par liste de nombres (poids décimaux)',
            body: `<p>En affectant les poids binaires \\(2^{n-1}\\dots 2^0\\) aux variables \\(a, b, c\\dots\\), chaque terme de la SDP correspond à un entier décimal (la somme des poids des variables non barrées).</p>
              <p>On note simplement : \\(F(a,b,c) = 1\\) pour \\((1, 3, 6)\\), ou \\(F = (1, 3, 6)\\). S'il y a des cas indifférents, on ajoute la liste où \\(F = X\\).</p>`,
            ask: {
              q: 'À quel nombre de la liste de poids correspond le terme \\(a\\bar{b}cd\\) (avec \\(a\\) poids fort et \\(d\\) poids faible) ?',
              items: [Nn('\\text{poids}', 11)],
              why: '\\(a=1, b=0, c=1, d=1 \\implies 1011_2 = 8 + 2 + 1 = 11\\).'
            }
          },
          {
            h: 'Calcul guidé : mettre sous forme canonique SDP',
            body: `${guided}<p>Soit \\(F(a,b,c) = a\\bar{b}\\). Il manque la variable \\(c\\).</p>
              <ol><li>Multiplie par \\((c + \\bar{c}) = 1\\) : \\(F = a\\bar{b}c + a\\bar{b}\\bar{c}\\).</li>
              <li>Traduis les deux termes en binaire (\\(100_2\\) et \\(101_2\\)) pour trouver la liste de nombres.</li></ol>`,
            ask: {
              q: 'Quels sont les deux nombres (le plus petit puis le plus grand) de la liste de poids ?',
              items: [Nn('n_1', 4), Nn('n_2', 5)],
              why: '\\(a\\bar{b}\\bar{c} \\to 100_2 = 4\\) et \\(a\\bar{b}c \\to 101_2 = 5\\), donc \\(F = (4, 5)\\).'
            }
          }
        ]
      },

      karn: {
        title: 'Tableaux de Karnaugh : regrouper par puissances de 2',
        meth: 'range les lignes et colonnes en code Gray (00, 01, 11, 10). Regroupe les 1 par paquets de 1, 2, 4, 8 cases (bords opposés et 4 coins sont adjacents) ; un paquet de \\(2^k\\) cases élimine \\(k\\) variables (celles qui changent d\'état dans le paquet). Prends un X à 1 seulement s\'il agrandit un paquet.',
        steps: [
          {
            h: 'Pourquoi l\'ordre 00 – 01 – 11 – 10 (code Gray)',
            guess: {
              q: 'Dans l\'entête d\'un tableau de Karnaugh, après 00 et 01 vient :',
              items: [Ch('réponse', [['11', '11 puis 10'], ['10', '10 puis 11']], '11')]
            },
            body: `<p>Dans un tableau de Karnaugh, deux cases voisines (y compris d'un bord à l'autre ou aux <b>4 coins</b>) ne doivent différer que d'<b>une seule variable</b> : c'est le <b>code Gray</b> (<code>00 - 01 - 11 - 10</code>).</p>
              <ul><li>Regrouper <b>2 cases</b> (doublet) élimine <b>1 variable</b> ;</li>
              <li>Regrouper <b>4 cases</b> (quartet) élimine <b>2 variables</b> ;</li>
              <li>Regrouper <b>8 cases</b> (octet) élimine <b>3 variables</b>.</li></ul>
              <p>On ne garde dans le produit que les variables qui <b>ne changent pas</b> à l'intérieur du groupement.</p>`,
            ask: {
              q: 'Sur une grille à 4 variables \\((a,b,c,d)\\), combien de variables restent dans le terme d\'un quartet (4 cases) ?',
              items: [Nn('\\text{variables}', 2)],
              why: '\\(4 = 2^2\\) cases éliminent 2 variables sur 4 : il en reste \\(4 - 2 = 2\\).'
            }
          },
          {
            h: 'États indifférents X et forme Produit de Sommes',
            body: `<p>Lorsqu'une combinaison d'entrée est impossible ou indifférente, on note <b><code>X</code></b> (ou <code>-</code>, \\(\\Phi\\)) dans la case :</p>
              <ul><li>On remplace un <code>X</code> par <code>1</code> <b>seulement s'il permet de doubler la taille d'un groupement de 1</b> ; sinon on le laisse à 0.</li>
              <li>Pour obtenir une forme <b>Produit de Sommes (PDS)</b> simplifiée : on regroupe les <b><code>0</code></b> (en prenant les <code>X</code> utiles avec les 0) pour écrire \\(\\bar{F}\\), puis on applique De Morgan pour obtenir \\(F\\).</li></ul>`,
            ask: {
              q: 'Peut-on former un groupement composé uniquement de cases X ?',
              items: [Ch('réponse', [['n', 'non, jamais : cela ajouterait un terme inutile'], ['o', 'oui, il faut couvrir tous les X']], 'n')],
              why: 'Les X sont des jokers : on ne les utilise que pour agrandir les paquets qui couvrent les vrais 1.'
            }
          },
          {
            h: 'Calcul guidé : lire un groupement des 4 coins',
            body: `${guided}<p>Dans un tableau à 4 variables \\(ab\\) (lignes <code>00, 01, 11, 10</code>) et \\(cd\\) (colonnes <code>00, 01, 11, 10</code>), les <code>1</code> occupent exactement les <b>4 coins</b> : lignes <code>00</code> et <code>10</code>, colonnes <code>00</code> et <code>10</code>.</p>
              <ol><li>Entre les lignes <code>00</code> et <code>10</code>, quelle variable reste constante à 0 ?</li>
              <li>Entre les colonnes <code>00</code> et <code>10</code>, quelle variable reste constante à 0 ?</li></ol>`,
            ask: {
              q: 'Quel est le terme simplifié correspondant aux 4 coins ?',
              items: [Ch('réponse', [['bd', '\\(\\bar{b}\\cdot\\bar{d}\\)'], ['ac', '\\(\\bar{a}\\cdot\\bar{c}\\)'], ['abcd', '\\(\\bar{a}\\bar{b}\\bar{c}\\bar{d}\\)']], 'bd')],
              why: 'Sur les lignes 00 et 10, \\(a\\) change mais \\(b = 0\\) ; sur les colonnes 00 et 10, \\(c\\) change mais \\(d = 0\\) : le quartet des 4 coins vaut \\(\\bar{b}\\bar{d}\\).'
            }
          }
        ]
      },

      mux: {
        title: 'Multiplexeurs (MUX) et additionneurs',
        meth: 'additionneur complet 1 bit : \\(S = A\\oplus B\\oplus R_e\\) et \\(R_s = AB + R_e(A\\oplus B)\\) (2 demi-additionneurs + 1 porte OU). MUX \\(2^n\\) vers 1 : \\(S = \\sum m_i E_i\\) ; avec \\(n+1\\) variables sur un MUX à \\(n\\) adresses, mets \\(n\\) variables sur les adresses et identifie \\(E_i \\in \\{0, 1, z, \\bar{z}\\}\\).',
        steps: [
          {
            h: 'Demi-additionneur et additionneur complet 1 bit',
            guess: {
              q: 'Combien de demi-additionneurs faut-il pour construire un additionneur complet 1 bit ?',
              items: [Ch('réponse', [['2', '2 demi-additionneurs et 1 porte OU'], ['1', '1 seul demi-additionneur'], ['4', '4 demi-additionneurs']], '2')]
            },
            body: `<p>Un <b>demi-additionneur</b> additionne 2 bits \\(A\\) et \\(B\\) : \\(S = A\\oplus B\\) et \\(R = A\\cdot B\\).</p>
              <p>Un <b>additionneur complet</b> additionne 3 bits \\((A, B, R_e)\\) (avec la retenue entrante \\(R_e\\)) :</p>
              \\[S = A \\oplus B \\oplus R_e \\qquad ; \\qquad R_s = A\\cdot B + R_e\\cdot(A \\oplus B)\\]
              <p>En mettant 4 additionneurs complets en cascade (retenue \\(R_s\\) reliée au \\(R_e\\) suivant), on obtient un additionneur 4 bits (CI <b>7483</b>).</p>`,
            ask: {
              q: 'Pour \\(A = 1, B = 0, R_e = 1\\), que donnent les sorties \\(S\\) et \\(R_s\\) de l\'additionneur complet ?',
              items: [Nn('S', 0), Nn('R_s', 1)],
              why: '\\(1 + 0 + 1 = 2 = 10_2\\), donc \\(S = 0\\) et \\(R_s = 1\\).'
            }
          },
          {
            h: 'Synthèse d\'une fonction logique avec un MUX',
            body: `<p>Un <b>multiplexeur (MUX) \\(2^n\\) vers 1</b> aiguille l'entrée \\(E_i\\) sélectionnée par les \\(n\\) entrées d'adresse vers la sortie \\(S\\). Pour un MUX 4 vers 1 d'adresses \\(B, A\\) :</p>
              \\[S = \\bar{B}\\bar{A}\\,E_0 + \\bar{B}A\\,E_1 + B\\bar{A}\\,E_2 + BA\\,E_3\\]
              <ul><li><b>Fonction de \\(n\\) variables sur MUX \\(2^n\\to 1\\)</b> : relie les \\(n\\) variables aux adresses, et mets \\(E_i = 1\\) si \\(i\\) est dans la liste de poids, \\(0\\) sinon.</li>
              <li><b>Fonction de \\(n+1\\) variables \\((x,y,z)\\) sur MUX \\(2^n\\to 1\\)</b> : relie \\(x,y\\) aux adresses \\(B,A\\), factorise \\(F\\) selon \\(\\bar{x}\\bar{y}, \\bar{x}y, x\\bar{y}, xy\\), et identifie chaque \\(E_i \\in \\{0, 1, z, \\bar{z}\\}\\).</li></ul>`,
            ask: {
              q: 'On câble \\(F(x,y,z) = \\bar{x}\\bar{y}z + \\bar{x}y\\bar{z} + xy\\) sur un MUX 4 vers 1 (adresses \\(B=x, A=y\\)). Que vaut \\(E_3\\) ?',
              items: [Ch('E_3', [['1', '\\(1\\)'], ['0', '\\(0\\)'], ['z', '\\(z\\)'], ['nz', '\\(\\bar{z}\\)']], '1')],
              why: 'Le terme en \\(xy\\) (adresse \\(BA = 11\\), donc \\(E_3\\)) est \\(xy\\cdot 1\\) : par identification, \\(E_3 = 1\\) (et \\(E_0 = z, E_1 = \\bar{z}, E_2 = 0\\)).'
            }
          },
          {
            h: 'Calcul guidé : fonction de 3 variables sur MUX 4 vers 1',
            body: `${guided}<p>Soit \\(F(x,y,z) = 1\\) pour \\((1, 2, 3, 6)\\), avec \\(x\\) poids 4, \\(y\\) poids 2, \\(z\\) poids 1. On relie \\(x, y\\) aux adresses \\(B, A\\) d'un MUX 4 vers 1.</p>
              <ol><li>Pour \\(xy = 00\\) (lignes 0 et 1) : \\(F=1\\) en 1 (\\(z=1\\)), donc \\(E_0 = z\\).</li>
              <li>Pour \\(xy = 01\\) (lignes 2 et 3) : \\(F=1\\) en 2 et 3 (\\(z=0\\) et \\(z=1\\)), donc \\(E_1 = 1\\).</li>
              <li>Trouve \\(E_2\\) (lignes 4 et 5) et \\(E_3\\) (lignes 6 et 7).</li></ol>`,
            ask: {
              q: 'Que valent \\(E_2\\) et \\(E_3\\) ?',
              items: [Ch('E_2', [['0', '0'], ['1', '1'], ['z', '\\(z\\)'], ['nz', '\\(\\bar{z}\\)']], '0'), Ch('E_3', [['0', '0'], ['1', '1'], ['z', '\\(z\\)'], ['nz', '\\(\\bar{z}\\)']], 'nz')],
              why: 'Lignes 4 et 5 absentes : \\(E_2 = 0\\). Entre 6 (\\(z=0\\)) et 7 (\\(z=1\\)), seul 6 est présent : \\(E_3 = \\bar{z}\\).'
            }
          }
        ]
      },

      /* =================== SÉQUENCE B : LOGIQUE SÉQUENTIELLE =================== */
      basc: {
        title: 'Bascules RS, D et JK, entrées RAU/RAZ',
        meth: 'une bascule synchrone ne change d\'état que sur le front actif d\'horloge (\\(\\uparrow\\) ou \\(\\downarrow\\)), sauf si une entrée asynchrone prioritaire RAU (force 1) ou RAZ (force 0) est active. Bascule D : \\(Q_{n+1} = D\\) (avec \\(D = \\bar{Q}\\), divise \\(F_H\\) par 2). Bascule JK : \\(Q_{n+1} = J_n\\overline{Q_n} + \\overline{K_n}Q_n\\) (si \\(J=K=1\\), basculement \\(\\overline{Q_n}\\)).',
        steps: [
          {
            h: 'Effet mémoire, front d\'horloge et bascules RS / D',
            guess: {
              q: 'On relie la sortie complémentée \\(\\bar{Q}\\) d\'une bascule D sur son entrée \\(D\\), avec une horloge à 10 kHz. La fréquence du signal \\(Q\\) vaut :',
              items: [Ch('réponse', [['5', '5 kHz (divisée par 2)'], ['10', '10 kHz'], ['20', '20 kHz']], '5')]
            },
            body: `<p>Un circuit séquentiel a une <b>mémoire</b> : l'état suivant \\(Q_{n+1}\\) (ou \\(Q^+\\)) dépend des entrées et de l'état présent \\(Q_n\\), et ne change qu'au <b>front actif</b> de l'horloge \\(H\\) (montant \\(\\uparrow\\) : triangle <code>&gt;</code> ; descendant \\(\\downarrow\\) : bulle + triangle <code>o&gt;</code>).</p>
              <ul><li><b>Bascule RS</b> : \\(S=0, R=0 \\to Q_n\\) (mémoire) ; \\(S=0, R=1 \\to 0\\) ; \\(S=1, R=0 \\to 1\\) ; \\(S=1, R=1\\) <b>interdit</b>.</li>
              <li><b>Bascule D</b> : \\(Q_{n+1} = D\\). En rebouclant \\(D = \\bar{Q}\\), la sortie change d'état à chaque front de \\(H\\) : il faut <b>2 périodes d'horloge</b> pour un cycle complet de \\(Q\\), donc \\(F_Q = F_H / 2\\).</li></ul>`,
            ask: {
              q: 'Trois bascules D montées en diviseur de fréquence par 2 en cascade divisent la fréquence d\'horloge par :',
              items: [Nn('\\text{facteur}', 8)],
              why: 'Chaque bascule divise la fréquence par 2 : \\(2^3 = 8\\).'
            }
          },
          {
            h: 'La bascule JK et les entrées asynchrones RAU / RAZ',
            body: `<p>La <b>bascule JK</b> lève l'interdiction de la RS : quand \\(J = 1\\) et \\(K = 1\\), elle <b>bascule</b> (\\(Q_{n+1} = \\overline{Q_n}\\)). Son équation caractéristique (à connaître par cœur) est :</p>
              \\[Q_{n+1} = J_n\\cdot\\overline{Q_n} + \\overline{K_n}\\cdot Q_n\\]
              <p>Les entrées asynchrones <b>RAU</b> (Remise À Un / Preset) et <b>RAZ</b> (Remise À Zéro / Clear) sont <b>prioritaires sur l'horloge \\(H\\)</b> : elles forcent immédiatement \\(Q=1\\) ou \\(Q=0\\) sans attendre un front (attention au petit rond : \\(\\overline{\\text{RAU}}\\) et \\(\\overline{\\text{RAZ}}\\) sont actives au niveau <b>bas 0</b>).</p>`,
            ask: {
              q: 'Une bascule JK est dans l\'état \\(Q_n = 1\\). Au front actif de \\(H\\), on a \\(J = 0\\) et \\(K = 0\\). Que vaut \\(Q_{n+1}\\) ?',
              items: [Nn('Q_{n+1}', 1)],
              why: '\\(J=0, K=0\\) est le mode mémoire : \\(Q_{n+1} = 0\\cdot 0 + 1\\cdot 1 = 1\\).'
            }
          },
          {
            h: 'Calcul guidé : transformer une bascule JK en bascule D',
            body: `${guided}<p>On dispose d'une bascule JK (\\(Q^+ = J\\bar{Q} + \\bar{K}Q\\)) et on veut qu'elle se comporte comme une bascule D (\\(Q^+ = D\\)).</p>
              <ol><li>Écris \\(D = D(\\bar{Q} + Q) = D\\cdot\\bar{Q} + D\\cdot Q\\).</li>
              <li>Identifie avec \\(J\\cdot\\bar{Q} + \\bar{K}\\cdot Q\\).</li></ol>`,
            ask: {
              q: 'Comment relier \\(J\\) et \\(K\\) à l\'entrée \\(D\\) ?',
              items: [Ch('réponse', [['ok', '\\(J = D\\) et \\(K = \\bar{D}\\)'], ['ko1', '\\(J = D\\) et \\(K = D\\)'], ['ko2', '\\(J = \\bar{D}\\) et \\(K = D\\)']], 'ok')],
              why: 'Par identification : \\(J = D\\) et \\(\\bar{K} = D \\iff K = \\bar{D}\\).'
            }
          }
        ]
      },

      cpta: {
        title: 'Compteurs asynchrones et modulo',
        meth: 'dans un compteur asynchrone, toutes les bascules sont en mode basculement (\\(J=K=1\\) ou \\(D=\\bar{Q}\\)) ; seule \\(B_0\\) reçoit \\(H\\). Compteur croissant : front \\(\\downarrow\\) piloté par \\(Q_i\\) (ou front \\(\\uparrow\\) piloté par \\(\\overline{Q_i}\\)). Modulo \\(N < 2^n\\) : une porte détecte l\'état transitoire \\(N\\) et active RAZ.',
        steps: [
          {
            h: 'Comment savoir s\'il compte ou décompte',
            guess: {
              q: 'Combien de bascules faut-il au minimum pour réaliser un compteur modulo 10 (qui compte de 0 à 9) ?',
              items: [Nn('n', 4)]
            },
            body: `<p>Un compteur <b>modulo \\(N\\)</b> parcourt \\(N\\) états distincts (de \\(0\\) à \\(N-1\\)) ; il faut \\(n\\) bascules telles que \\(2^{n-1} < N \\le 2^n\\) (pour \\(N=10\\), \\(2^3=8 < 10 \\le 16 = 2^4\\), donc 4 bascules).</p>
              <p>Dans un compteur <b>asynchrone</b>, chaque bascule est en basculement (\\(J=K=1\\)) et sert d'horloge à la suivante :</p>
              <ul><li>Pour <b>compter (croissant)</b>, \\(Q_{i+1}\\) doit basculer quand \\(Q_i\\) passe de <b>1 à 0</b> (front descendant de \\(Q_i\\)) : on relie \\(H_{i+1}\\) à <b>\\(Q_i\\)</b> si les bascules sont à front \\(\\downarrow\\), ou à <b>\\(\\overline{Q_i}\\)</b> si elles sont à front \\(\\uparrow\\).</li>
              <li>Dans les deux autres cas (\\(Q_i\\) sur front \\(\\uparrow\\), ou \\(\\overline{Q_i}\\) sur front \\(\\downarrow\\)), c'est un <b>décompteur</b>.</li></ul>`,
            ask: {
              q: 'Trois bascules JK à front montant (\\(\\uparrow\\)) ont chacune leur horloge reliée à la sortie \\(Q_i\\) de la précédente. Ce montage est un :',
              items: [Ch('réponse', [['dec', 'décompteur modulo 8'], ['cpt', 'compteur croissant modulo 8']], 'dec')],
              why: 'Un front montant de \\(Q_i\\) correspond au passage \\(0 \\to 1\\) : basculer \\(Q_{i+1}\\) à ce moment fait décompter (000 → 111 → 110…).'
            }
          },
          {
            h: 'Troncature asynchrone (modulo N) et retard cumulé',
            body: `<p>Pour arrêter un compteur asynchrone croissant au <b>modulo \\(N\\)</b> (états \\(0\\) à \\(N-1\\)), on détecte l'apparition de l'<b>état transitoire \\(N\\)</b> avec une porte logique (ET vers <code>RAZ</code>, ou NAND vers \\(\\overline{\\text{RAZ}}\\)) qui remet aussitôt toutes les bascules à 0.</p>
              <p><b>Limite du compteur asynchrone</b> : chaque bascule ajoute un retard de propagation \\(t_p\\). La \\(n\\)-ième bascule commute avec un retard \\(n\\cdot t_p\\), ce qui impose \\(T_H > n\\cdot t_p\\).</p>`,
            ask: {
              q: 'Pour réaliser un compteur asynchrone modulo 6 \\((Q_2Q_1Q_0)\\) avec remise à zéro sur l\'état transitoire, quel état binaire doit déclencher la RAZ ?',
              items: [Bw('Q_2Q_1Q_0', '110')],
              why: 'Un compteur modulo 6 parcourt les 6 états 0, 1, 2, 3, 4, 5 (de 000 à 101) ; dès qu\'il atteint 6 (\\(110_2\\), soit \\(Q_2\\cdot Q_1\\)), la RAZ le ramène immédiatement à 000.'
            }
          },
          {
            h: 'Calcul guidé : fréquence maximale d\'un compteur asynchrone',
            body: `${guided}<p>Un compteur asynchrone à 4 bascules utilise des bascules dont le temps de propagation est \\(t_p = 25\\) ns.</p>
              <ol><li>Retard total de la 4<sup>e</sup> bascule : \\(4 \\times t_p\\).</li>
              <li>Fréquence maximale d'horloge : \\(f_{max} = \\dfrac{1}{4\\,t_p}\\) en MHz.</li></ol>`,
            ask: {
              q: 'Résultats :',
              items: [Nn('\\text{retard total (ns)}', 100), Nn('f_{max}\\ (\\mathrm{MHz})', 10)],
              why: '\\(4 \\times 25 = 100\\) ns \\(= 10^{-7}\\) s, d\'où \\(f_{max} = 1 / 10^{-7} = 10\\) MHz.'
            }
          }
        ]
      },

      cpts: {
        title: 'Synthèse de compteurs synchrones (D et JK)',
        meth: 'toutes les bascules reçoivent la même horloge \\(H\\). 1) Table d\'état présent \\(Q_i\\) / état suivant \\(Q_i^+\\) (avec X pour les états hors cycle). 2) Karnaugh de chaque \\(Q_i^+\\). 3) En bascules D : \\(D_i = Q_i^+\\). En bascules JK : écris \\(Q_i^+ = (\\text{Terme 1})\\cdot\\overline{Q_i} + (\\text{Terme 2})\\cdot Q_i\\), d\'où \\(J_i = \\text{Terme 1}\\) et \\(K_i = \\overline{\\text{Terme 2}}\\).',
        steps: [
          {
            h: 'La méthode d\'identification sur l\'équation caractéristique JK',
            guess: {
              q: 'Après simplification par Karnaugh, on trouve \\(Q_1^+ = Q_0\\overline{Q_1} + \\overline{Q_0}Q_1\\). Avec une bascule JK (\\(Q_1^+ = J_1\\overline{Q_1} + \\overline{K_1}Q_1\\)), que valent \\(J_1\\) et \\(K_1\\) ?',
              items: [Ch('réponse', [['q0', '\\(J_1 = Q_0\\) et \\(K_1 = Q_0\\)'], ['nq0', '\\(J_1 = Q_0\\) et \\(K_1 = \\overline{Q_0}\\)'], ['1', '\\(J_1 = 1\\) et \\(K_1 = 1\\)']], 'q0')]
            },
            body: `<p>Dans le cours de Mme Bézy-Wendling, on synthétise un compteur synchrone <b>par identification algébrique</b> :</p>
              <ol><li>On dresse la table de transition \\((Q_2, Q_1, Q_0) \\to (Q_2^+, Q_1^+, Q_0^+)\\) en mettant des <b><code>X</code></b> pour les états hors cycle.</li>
              <li>On simplifie chaque \\(Q_i^+\\) par un tableau de Karnaugh.</li>
              <li>Avec des <b>bascules D</b> : \\(D_i = Q_i^+\\) directement (pour un compteur binaire standard : \\(D_0 = \\overline{Q_0}\\), \\(D_1 = Q_1 \\oplus Q_0\\), \\(D_2 = Q_2 \\oplus (Q_1Q_0)\\)).</li>
              <li>Avec des <b>bascules JK</b> : on met \\(Q_i^+\\) sous la forme \\((\\text{Terme 1})\\cdot\\overline{Q_i} + (\\text{Terme 2})\\cdot Q_i\\) et on identifie avec \\(J_i\\overline{Q_i} + \\overline{K_i}Q_i\\) :
              \\[J_i = \\text{Terme 1} \\qquad\\text{et}\\qquad \\overline{K_i} = \\text{Terme 2} \\iff K_i = \\overline{\\text{Terme 2}}\\]</li></ol>`,
            ask: {
              q: 'Si \\(Q_2^+ = Q_1\\cdot\\overline{Q_2} + Q_2\\), que valent \\(J_2\\) et \\(K_2\\) ?',
              items: [Ch('réponse', [['ok', '\\(J_2 = Q_1\\) et \\(K_2 = 0\\)'], ['ko1', '\\(J_2 = Q_1\\) et \\(K_2 = 1\\)'], ['ko2', '\\(J_2 = 1\\) et \\(K_2 = Q_1\\)']], 'ok')],
              why: 'Ici \\(\\text{Terme 1} = Q_1 \\implies J_2 = Q_1\\), et \\(\\text{Terme 2} = 1 \\implies \\overline{K_2} = 1 \\iff K_2 = 0\\).'
            }
          },
          {
            h: 'États hors cycle et compteur intégré 74HC163',
            body: `<p>Une fois les équations de \\(D_i\\) ou \\((J_i, K_i)\\) choisies, les cases <code>X</code> ont pris une valeur fixée (0 ou 1) : il faut toujours <b>recalculer \\(Q^+\\) pour les états hors cycle</b> afin de vérifier qu'ils rejoignent bien le cycle principal (pas de blocage parasite).</p>
              <p>Sur le compteur synchrone 4 bits <b>74HC163</b>, la sortie de retenue <b>RCO</b> passe à 1 lorsque le compteur atteint <b>15 (<code>1111</code>)</b>, ce qui permet de cascader plusieurs compteurs.</p>`,
            ask: {
              q: 'Un compteur 3 bits a pour équations \\(Q_2^+ = Q_1Q_0\\), \\(Q_1^+ = \\overline{Q_2}(Q_1\\oplus Q_0)\\), \\(Q_0^+ = \\overline{Q_2}\\,\\overline{Q_0}\\). S\'il démarre dans l\'état parasite 6 (<code>110</code>), quel est son état suivant ?',
              items: [Bw('Q_2^+Q_1^+Q_0^+', '000')],
              why: 'Pour \\(Q_2Q_1Q_0 = 110\\) : \\(\\overline{Q_2} = 0\\) et \\(Q_1Q_0 = 0\\), donc \\(Q_2^+ = 0, Q_1^+ = 0, Q_0^+ = 0\\) : il rejoint immédiatement l\'état 000 du cycle !'
            }
          },
          {
            h: 'Calcul guidé : synthèse JK (TD Séquence B Ex 3)',
            body: `${guided}<p>Dans le compteur synchrone modulo 6 (états 0 à 5, états 6 et 7 à X), les tableaux de Karnaugh donnent :</p>
              \\[Q_0^+ = \\overline{Q_0} \\quad ; \\quad Q_1^+ = \\overline{Q_2}\\,Q_0\\,\\overline{Q_1} + \\overline{Q_0}\\,Q_1 \\quad ; \\quad Q_2^+ = Q_1Q_0\\,\\overline{Q_2} + \\overline{Q_0}\\,Q_2\\]`,
            ask: {
              q: 'Identifie \\(J_1\\) et \\(K_1\\) pour la bascule 1 :',
              items: [Ch('J_1, K_1', [['ok', '\\(J_1 = \\overline{Q_2}\\,Q_0\\) et \\(K_1 = Q_0\\)'], ['ko1', '\\(J_1 = Q_0\\) et \\(K_1 = \\overline{Q_2}\\,Q_0\\)'], ['ko2', '\\(J_1 = \\overline{Q_2}\\,Q_0\\) et \\(K_1 = \\overline{Q_0}\\)']], 'ok')],
              why: 'Devant \\(\\overline{Q_1}\\) on lit \\(J_1 = \\overline{Q_2}\\,Q_0\\) ; devant \\(Q_1\\) on lit \\(\\overline{K_1} = \\overline{Q_0}\\), donc \\(K_1 = Q_0\\).'
            }
          }
        ]
      },

      reg: {
        title: 'Registres de stockage et à décalage',
        meth: 'un registre de \\(n\\) bits = \\(n\\) bascules D sur la même horloge \\(H\\). Chargement commandé par \\(ch\\) : MUX 2→1 devant chaque \\(D_i\\), \\(D_i = \\overline{ch}\\cdot Q_i + ch\\cdot e_i\\). Décalage à droite : \\(q_3q_2q_1q_0 := d\\,q_3q_2q_1\\). Compteur en anneau à \\(n\\) bascules : un seul 1 circule en boucle, modulo \\(n\\).',
        steps: [
          {
            h: 'Chargement commandé et décalage série',
            guess: {
              q: 'Dans un registre à décalage à droite de 4 bits (\\(D_3 = e_{\\text{série}}, D_2 = Q_3, D_1 = Q_2, D_0 = Q_1\\)), combien de coups d\'horloge faut-il pour qu\'un bit entré en \\(D_3\\) arrive sur la sortie \\(Q_0\\) ?',
              items: [Nn('\\text{coups d\'horloge}', 4)]
            },
            body: `<p>Un <b>registre</b> associe \\(n\\) bascules D commandées par la même horloge \\(H\\) :</p>
              <ul><li><b>Chargement commandé par <code>ch</code></b> : un MUX 2 vers 1 devant chaque entrée \\(D_i\\) donne \\(D_i = \\overline{ch}\\cdot Q_i + ch\\cdot e_i\\) (si \\(ch=0\\), maintien \\(Q_i^+ = Q_i\\) ; si \\(ch=1\\), chargement \\(Q_i^+ = e_i\\)).</li>
              <li><b>Registre bidirectionnel universel</b> (commande \\(s_1s_0\\) sur des MUX 4 vers 1) : <code>00</code> maintien, <code>01</code> décalage à droite (<code>R q3q2q1</code>), <code>10</code> décalage à gauche (<code>q2q1q0 L</code>), <code>11</code> chargement parallèle (<code>d3d2d1d0</code>).</li></ul>`,
            ask: {
              q: 'Le registre contient \\(q_3q_2q_1q_0 = 1011\\). Après un front d\'horloge en mode décalage à droite (<code>s1s0 = 01</code>) avec l\'entrée série droite \\(R = 0\\), que contient-il ?',
              items: [Bw('q_3q_2q_1q_0', '0101')],
              why: '\\(R=0\\) entre à gauche en \\(q_3\\), et \\(101\\) se décale d\'un rang vers la droite (le dernier 1 sort) : <code>0101</code>.'
            }
          },
          {
            h: 'Le compteur en anneau (TD Séquence B Chap B3)',
            body: `<p>En rebouclant la sortie d'un registre à décalage de \\(n\\) bascules sur son entrée série (\\(D_0 = Q_{n-1}\\)) et en initialisant la première bascule à <code>1</code> (via <code>RAU</code>) et les \\(n-1\\) autres à <code>0</code> (via <code>RAZ</code>), un unique <code>1</code> tourne en boucle (sur 3 bits : <code>100 → 010 → 001 → 100</code>).</p>
              <p>C'est un <b>compteur en anneau modulo \\(n\\)</b> : chaque sortie a une fréquence \\(F_H / n\\).</p>`,
            ask: {
              q: 'Quel est le modulo d\'un compteur en anneau à 4 bascules initialisé à 1000 ?',
              items: [Nn('\\text{modulo}', 4)],
              why: 'Le 1 occupe successivement chacune des 4 bascules (1000, 0100, 0010, 0001) : 4 états distincts, donc modulo 4.'
            }
          },
          {
            h: 'Calcul guidé : suivre un registre sur 3 coups d\'horloge',
            body: `${guided}<p>Un registre 4 bits \\(q_3q_2q_1q_0\\) vaut initialement <code>0000</code>. Il décale à droite (\\(q_3q_2q_1q_0 := R\\,q_3q_2q_1\\)) et reçoit successivement sur \\(R\\) les bits <code>1</code>, puis <code>1</code>, puis <code>0</code> aux 3 premiers fronts de \\(H\\).</p>`,
            ask: {
              q: 'Quel est l\'état \\(q_3q_2q_1q_0\\) après le 3e front ?',
              items: [Bw('q_3q_2q_1q_0', '0110')],
              why: 'Front 1 (\\(R=1\\)) : <code>1000</code> ; front 2 (\\(R=1\\)) : <code>1100</code> ; front 3 (\\(R=0\\)) : <code>0110</code>.'
            }
          }
        ]
      },

      /* =================== SÉQUENCE C : CONVERSION CAN / CNA =================== */
      ech: {
        title: 'Chaîne d\'acquisition, échantillonnage et quantification',
        meth: 'chaîne à 5 blocs : Transducteur (capteur) → CAN → Système numérique → CNA → Actionneur. Sur \\(n\\) bits : \\(2^n\\) états, \\(N_{max} = 2^n - 1\\) intervalles, pas (quantum) \\(q = P = V_{max} / (2^n - 1)\\). Par défaut, une tension \\(V_e\\) est codée par \\(N = \\lfloor V_e / P \\rfloor\\), soit \\(V_d = N\\cdot P\\).',
        steps: [
          {
            h: 'Les 5 blocs de la chaîne et l\'échantillonnage-blocage',
            guess: {
              q: 'Dans la chaîne d\'acquisition et de régulation, quel bloc transforme la grandeur physique (température, pression…) en tension électrique analogique ?',
              items: [Ch('réponse', [['tr', 'le transducteur (capteur)'], ['can', 'le CAN'], ['act', 'l\'actionneur']], 'tr')]
            },
            body: `<p>La chaîne complète comporte <b>5 blocs</b> dans l'ordre :</p>
              <p><b>① Transducteur (capteur)</b> → <i>analogique</i> → <b>② CAN</b> → <i>numérique</i> → <b>③ Système numérique (ordinateur)</b> → <i>numérique</i> → <b>④ CNA</b> → <i>analogique</i> → <b>⑤ Actionneur</b>.</p>
              <p>La conversion A→N se fait en <b>3 étapes</b> :</p>
              <ol><li><b>Échantillonnage-blocage</b> : prélève la tension toutes les \\(T_e = 1/F_e\\) et la maintient constante pendant le temps de conversion (signal en escalier).</li>
              <li><b>Quantification</b> : découpe l'échelle en multiples du <b>pas (ou quantum) \\(P = q\\)</b>.</li>
              <li><b>Codage</b> : associe le mot binaire \\([a_{n-1}\\dots a_0]\\) de valeur décimale \\(N\\).</li></ol>`,
            ask: {
              q: 'Pour un CAN de \\(n = 3\\) bits avec \\(V_{max} = 1{,}75\\) V (TD Séquence C Ex 1), que valent \\(N_{max} = 2^n - 1\\) et le pas \\(P = V_{max}/N_{max}\\) ?',
              items: [Nn('N_{max}', 7), Nn('P', 0.25, 'V')],
              why: 'Sur 3 bits, \\(N_{max} = 2^3 - 1 = 7\\) intervalles, donc \\(P = 1{,}75 / 7 = 0{,}25\\) V.'
            }
          },
          {
            h: 'Codage par défaut : arrondir au multiple inférieur du pas',
            body: `<p>Avec la convention du cours (<b>codage par valeur par défaut</b>), toute tension \\(V_e\\) comprise entre \\(N\\cdot P\\) et \\((N+1)\\cdot P\\) est ramenée à la valeur discrète immédiatement inférieure \\(V_d = N\\cdot P\\), codée par l'entier \\(N = \\lfloor V_e / P \\rfloor\\).</p>
              <p>Augmenter la fréquence d'échantillonnage \\(F_e\\) rapproche l'escalier en temps du signal réel ; augmenter le nombre de bits \\(n\\) divise le pas \\(P\\) et réduit l'erreur de quantification en amplitude.</p>`,
            ask: {
              q: 'Avec un pas \\(P = 0{,}25\\) V sur 3 bits, un échantillon vaut \\(V_e = 1{,}40\\) V. Que valent la tension quantifiée par défaut \\(V_d\\) et l\'entier \\(N\\) ?',
              items: [Nn('V_d', 1.25, 'V'), Nn('N', 5)],
              why: '\\(1{,}40 / 0{,}25 = 5{,}6\\) : par défaut on garde \\(N = 5\\) pas (binaire <code>101</code>), soit \\(V_d = 5 \\times 0{,}25 = 1{,}25\\) V.'
            }
          },
          {
            h: 'Calcul guidé : passer de 3 bits à 4 bits (TD Séquence C Ex 1)',
            body: `${guided}<p>On remplace le CAN 3 bits par un CAN <b>4 bits</b> avec \\(V_{max} = 1{,}875\\) V.</p>
              <ol><li>Calcule \\(N_{max} = 2^4 - 1\\).</li>
              <li>Déduis-en le nouveau pas \\(P = V_{max} / N_{max}\\).</li>
              <li>Pour un échantillon \\(V_d = 1{,}25\\) V, trouve \\(N\\) et le code binaire sur 4 bits.</li></ol>`,
            ask: {
              q: 'Résultats :',
              items: [Nn('P', 0.125, 'V'), Nn('N', 10), Bw('a_3a_2a_1a_0', '1010')],
              why: '\\(N_{max} = 15\\), \\(P = 1{,}875 / 15 = 0{,}125\\) V, et \\(1{,}25 / 0{,}125 = 10 = 1010_2\\).'
            }
          }
        ]
      },

      cnacan: {
        title: 'Convertisseurs CNA (pondéré, R–2R) et CAN (rampe, CAS)',
        meth: 'CNA : \\(V_S = K\\cdot N\\), avec \\(K = \\text{Pas} = V_{max}/(2^n-1)\\) et résolution \\(r(\\%) = 100/(2^n-1)\\). CNA 4 bits pondéré : \\(V_S = -\\dfrac{R_S V_{ref}}{8R}N\\) ; réseau R–2R 4 bits : \\(V_S = -\\dfrac{R_S V_{ref}}{32R}N\\). CAN simple rampe : \\(V_{Ax} > V_A\\) en fin de conversion, durée variable \\(N\\cdot T\\). CAN à approximations successives (CAS) : dichotomie du MSB au LSB, \\(V_{Ax} \\le V_A\\), durée fixe \\(n\\cdot T\\).',
        steps: [
          {
            h: 'CNA : facteur de proportionnalité K, pleine échelle et architectures',
            guess: {
              q: 'Pourquoi préfère-t-on le CNA à réseau R–2R au CNA à résistances pondérées dès que le nombre de bits est grand ?',
              items: [Ch('réponse', [['2v', 'il n\'utilise que 2 valeurs de résistances (R et 2R), faciles à fabriquer avec précision'], ['0v', 'il ne contient aucune résistance'], ['op', 'il n\'a pas besoin d\'AOP']], '2v')]
            },
            body: `<p>Tout CNA vérifie \\(\\text{Sortie} = K \\times N\\), où \\(N\\) est l'entier décimal du mot binaire d'entrée et \\(K = \\text{Pas} = \\dfrac{V_{max}}{2^n - 1}\\) est le <b>facteur de proportionnalité</b> (ou résolution analogique). En pourcentage : \\(r(\\%) = \\dfrac{100}{2^n - 1}\\).</p>
              <p>Avec un AOP idéal en régime linéaire (\\(V^- = V^+ = 0\\) V, masse virtuelle), sur <b>4 bits</b> \\((a_3a_2a_1a_0)\\) :</p>
              <ul><li><b>CNA à résistances pondérées</b> (branches \\(R, 2R, 4R, 8R\\)) : \\(I_S = \\dfrac{V_{ref}}{8R}\\,N\\) et \\(V_S = -R_S I_S = -\\dfrac{R_S V_{ref}}{8R}\\,N\\).</li>
              <li><b>CNA à réseau R–2R</b> (uniquement \\(R\\) et \\(2R\\)) : les tensions aux nœuds valent \\(V_{ref}/2, V_{ref}/4, V_{ref}/8, V_{ref}/16\\), d'où \\(I_S = \\dfrac{V_{ref}}{32R}\\,N\\) et \\(V_S = -\\dfrac{R_S V_{ref}}{32R}\\,N\\).</li></ul>`,
            ask: {
              q: 'Un CNA 5 bits délivre \\(I_S = 10\\) mA pour l\'entrée <code>10100</code> (TD Chap C2 Ex 1). Que valent \\(K\\) et \\(I_S\\) pour <code>11101</code> ?',
              items: [Nn('K', 0.5, 'mA'), Nn('I_S', 14.5, 'mA')],
              why: '\\(10100_2 = 20 \\implies K = 10 / 20 = 0{,}5\\) mA. Pour \\(11101_2 = 29\\), \\(I_S = 0{,}5 \\times 29 = 14{,}5\\) mA.'
            }
          },
          {
            h: 'Les deux CAN du cours : simple rampe vs approximations successives (CAS)',
            body: `<p>Les deux CAN au programme utilisent un CNA interne (sortie \\(V_{Ax}\\)) et un comparateur face à la tension à convertir \\(V_A\\) :</p>
              <ul><li><b>CAN à simple rampe numérique (à compteur)</b> : le compteur part de 0 et s'incrémente à chaque période d'horloge \\(T\\) tant que \\(V_{Ax} < V_A\\). Dès que \\(V_{Ax} \\ge V_A\\) (ou \\(V_{Ax} + V_T \\ge V_A\\) avec un seuil \\(V_T\\)), le signal <code>FDC</code> passe à 0 et bloque l'horloge. En fin de conversion, \\(V_{Ax} > V_A\\) et le temps de conversion est <b>variable et lent : \\(t_{conv} = N\\times T\\)</b>.</li>
              <li><b>CAN à approximations successives (CAS)</b> : teste les bits un par un du <b>MSB vers le LSB</b> (dichotomie). Il met \\(Q_i = 1\\) : si \\(V_{Ax} > V_A\\), il remet \\(Q_i = 0\\) ; si \\(V_{Ax} \\le V_A\\), il garde \\(Q_i = 1\\). En fin de conversion, \\(V_{Ax} \\le V_A\\) et le temps de conversion est <b>fixe et très court : \\(t_{conv} = n\\times T\\)</b>.</li></ul>`,
            ask: {
              q: 'Pour un CAN de 10 bits cadencé à \\(F_H = 1\\) MHz (\\(T = 1\\ \\mu\\text{s}\\)), combien de temps prend une conversion avec un CAS ?',
              items: [Nn('t_{conv}', 10, 'µs')],
              why: 'Le CAS teste exactement 1 bit par période d\'horloge : \\(t_{conv} = n\\times T = 10 \\times 1\\ \\mu\\text{s} = 10\\ \\mu\\text{s}\\) (contre jusqu\'à \\(1023\\ \\mu\\text{s}\\) pour un CAN simple rampe !).'
            }
          },
          {
            h: 'Calcul guidé : CAN simple rampe de 10 bits (TD Chap C3 Ex 1)',
            body: `${guided}<p>Un CAN simple rampe 10 bits a \\(V_{max} = 10{,}23\\) V, une tension de seuil du comparateur \\(V_T = 0{,}1\\) mV et une horloge \\(F_H = 1\\) MHz (\\(T = 1\\ \\mu\\text{s}\\)). La conversion s'arrête dès que \\(V_{Ax} + V_T \\ge V_A\\). On applique \\(V_A = 1{,}253\\) V.</p>
              <ol><li>Sur 10 bits, \\(N_{max} = 2^{10} - 1 = 1023\\). Calcule le pas \\(p = V_{max} / 1023\\).</li>
              <li>Condition d'arrêt : \\(V_{Ax} \\ge V_A - V_T = 1{,}2529\\) V. Comme \\(V_{Ax} = N\\cdot p\\), trouve le premier entier \\(N\\) qui vérifie \\(N\\cdot p \\ge 1{,}2529\\) V, puis la durée \\(t_{conv} = N\\cdot T\\).</li></ol>`,
            ask: {
              q: 'Résultats :',
              items: [Nn('p', 10, 'mV'), Nn('N', 126), Nn('t_{conv}', 126, 'µs')],
              why: '\\(p = 10{,}23 / 1023 = 0{,}01\\) V \\(= 10\\) mV. \\(N \\ge 1{,}2529 / 0{,}01 = 125{,}29 \\implies N = 126\\) (soit \\(0001111110_2\\)), et \\(t_{conv} = 126 \\times 1\\ \\mu\\text{s} = 126\\ \\mu\\text{s}\\).'
            }
          }
        ]
      }
    };
    return L;
  };
})();
