# Révisions CC · mise en ligne

Le site regroupe plusieurs outils de révision :

| Fichier | Rôle |
|---|---|
| `index.html` | la page d'accueil : connexion au compte et lien vers chaque outil |
| `account.js` | le compte du site (connexion unique) et la synchronisation de la progression entre appareils |
| `maths/index.html` | le QCM de maths (QCM, import de PDF, catalogue, comptes, groupes) |
| `elec/index.html` | l'entraînement au CC1 d'électronique (cours, démos, exos générés, annales, sujets blancs) |
| `ato/index.html` | l'entraînement au CC d'atomistique (partie 1 « L'atome ») : parcours guidé, cours résumé, exercices générés corrigés, sujet blanc d'1 h |
| `algo/index.html` | l'entraînement au DS d'algorithmique (chapitres 1 à 4 : bases de Python, fonctions, complexité, tableaux, dictionnaires) : parcours guidé, fonctions à écrire testées en Python dans le navigateur (Pyodide, dans un Worker), cours résumé, sujet blanc d'1 h 30 |
| `maths-s1/index.html` | l'entraînement au 1er CC de MATH-S1 (logique, ensembles, applications, relations, dénombrement) : parcours guidé, réponses de type table de vérité / ensemble / intervalle corrigées automatiquement, cours résumé, sujet blanc d'1 h 30 |
| `maths-s1-analyse/index.html` | l'entraînement au 2e CC de MATH-S1 (analyse : complexes, dérivées, limites et DL, intégrales, suites) d'après le programme de révision et les annales 2025-26 : réponses en nombres complexes, primitives (vérifiées en dérivant) et DL corrigées automatiquement |
| `meca/index.html` | l'entraînement au CC d'ingénierie mécanique (statique : vecteurs, moments, torseurs, liaisons, PFS) : parcours guidé avec schémas SVG générés, exercices du DS 2023-24, cours résumé, sujet blanc d'1 h 30 |
| `phys/index.html` | l'entraînement au CC de mécanique du point (chapitres II à V : PFD, énergie, oscillateurs, moment cinétique) : parcours guidé, formules littérales vérifiées par tirage de valeurs, cours résumé + démos à savoir refaire, sujet blanc d'1 h 30 |
| `duel/index.html` | le multijoueur : 1v1 (défis et duels en direct) et FFA (salle jusqu'à 8 joueurs, le dernier survivant gagne) sur le QCM de maths |
| `streak/index.html` | le mode Streak : des questions du QCM de maths à la suite jusqu'à la première erreur, avec records (tout le programme, nouveaux types, format du QCM) |
| `planning.js` | l'onglet Planning de l'accueil : emploi du temps ADE (lien d'export `.shu` enregistré dans le compte), prochaines évaluations repérées automatiquement |
| `supabase/functions/planning/` | la fonction Supabase qui relaie l'emploi du temps (le serveur de l'université bloque la lecture directe depuis le site) ; déjà déployée sous le nom `planning` |
| `presence.js` | la présence en ligne (pastille verte) et les invitations 1v1 et FFA, chargé par toutes les pages |
| `config.js` | l'adresse de ta base Supabase (à remplir, étape 4), utilisée par le QCM de maths |
| `supabase.sql` | la base de données et ses règles de sécurité (étape 2) |
| `README.md` | ce guide |

Adresses en ligne : https://sushiazd.github.io/Prepa01/ (accueil, choix de la matière), `…/Prepa01/maths/` `…/Prepa01/elec/`, `…/Prepa01/duel/` et `…/Prepa01/streak/`.

On se connecte une seule fois, sur la page d'accueil : la session vaut pour toutes les pages. Une fois connecté, la progression d'élec (parcours, stats, copies, planning, date du CC) est enregistrée dans la table `user_data` et fusionnée à chaque ouverture de page, donc on la retrouve sur tous ses appareils. Sans compte, elle reste dans le navigateur.

### Activer la synchronisation

Supabase → **SQL Editor** : relance tout `supabase.sql` (il ajoute la table `user_data`). Tant que ce n'est pas fait, l'accueil affiche « Base pas encore prête pour la synchro ».

### Activer le 1v1

1. Envoie sur GitHub le dossier `duel`, le fichier `presence.js` et les nouvelles versions de `index.html`, `maths/index.html` et `elec/index.html`.
2. Supabase → **SQL Editor** : relance tout `supabase.sql` (il ajoute la fonction `list_players`, qui donne la liste des inscrits).
3. C'est tout : les invitations et les parties passent par le temps réel de Supabase (*Realtime*), sans table. Si rien ne bouge, vérifie dans **Project Settings → Realtime** que l'accès aux canaux publics est autorisé.

Le duel réutilise les questions générées du QCM de maths : la page `duel/` lit le générateur dans `maths/index.html`. Il faut donc toujours mettre en ligne les deux ensemble.

Compte environ 30 minutes la première fois. Tout est gratuit.

---

## 1. Créer la base de données (Supabase)

1. Va sur **supabase.com** → *Start your project* → connecte-toi avec GitHub.
2. *New project* : donne un nom (`qcm-maths`), choisis un mot de passe de base de données (garde-le quelque part), région **Europe (Paris ou Francfort)**, puis *Create new project*.
3. Attends 1 à 2 minutes que le projet soit prêt.

## 2. Installer les tables et les règles d'accès

1. Menu de gauche → **SQL Editor** → *New query*.
2. Ouvre `supabase.sql`, copie **tout** le contenu, colle-le, clique **Run**.
3. Tu dois voir *Success. No rows returned*. (Tu peux relancer le script sans risque si besoin.)

## 3. Simplifier l'inscription

Le service d'e-mails gratuit de Supabase n'envoie que quelques e-mails par heure : avec la confirmation d'adresse activée, l'inscription de tes potes bloquerait vite.

**Authentication → Sign In / Providers → Email** → désactive **Confirm email** → *Save*.

(Les noms de menus peuvent légèrement changer selon les versions de Supabase.)

## 4. Relier le site à la base

1. **Project Settings → API** (ou *API Keys*).
2. Copie **Project URL** et la clé **anon public** (parfois appelée *publishable key*).
3. Colle-les dans `config.js` entre les guillemets :
   ```js
   supabaseUrl: 'https://abcdefghijkl.supabase.co',
   supabaseAnonKey: 'eyJhbGciOi…'
   ```
   ⚠ Jamais la clé **service_role / secret** : elle donnerait tous les droits sur la base.

## 5. Mettre le site en ligne (GitHub Pages)

1. Sur **github.com** → *New repository* → nom `qcm-maths`, **Public**, *Create repository*.
2. *uploading an existing file* → glisse `index.html`, `config.js`, `supabase.sql`, `README.md` **et les dossiers `maths` et `elec`** → *Commit changes*.
3. **Settings → Pages** → *Source* : *Deploy from a branch* → branche `main`, dossier `/ (root)` → *Save*.
4. Après 1 à 2 minutes, le site est à l'adresse **`https://TON-PSEUDO.github.io/qcm-maths/`** (affichée en haut de la page *Pages*).

## 6. Dernier réglage

Supabase → **Authentication → URL Configuration** → *Site URL* = l'adresse GitHub Pages ci-dessus → *Save*.

## 7. Tester

1. Ouvre le site → onglet **Groupe** → *Créer un compte* (pseudo, e-mail, mot de passe).
2. *Créer un groupe* → un code de 6 caractères apparaît → bouton *Copier* pour l'envoyer à tes potes.
3. Tes potes ouvrent le lien, créent leur compte et entrent le code dans *Rejoindre avec un code*.

---

## Qui voit quoi

- Ton **e-mail** n'est visible par personne (seulement ton pseudo).
- Les membres de tes groupes voient tes épreuves, tes contrôles importés (notes, thèmes, début de l'énoncé) et ton temps d'entraînement.
- Décocher **« Mes stats sont visibles par mes groupes »** te rend invisible : tes stats ne comptent plus non plus dans les vues de groupe.
- Les personnes hors de tes groupes ne voient rien. Les PDF eux-mêmes ne sont jamais envoyés : seuls les scores et un court extrait de chaque question sont enregistrés.
- *Supprimer mon compte* efface tout (profil, épreuves, contrôles, adhésions).

## Mettre à jour le site

Dans le dépôt GitHub (*Add file → Upload files*), glisse le ou les fichiers modifiés en gardant leur dossier : `maths/index.html` pour le QCM, `elec/index.html` pour l'élec, `index.html` pour l'accueil. Ne touche pas à `config.js`. Les données des comptes ne sont pas affectées.

### Passage à la version « plusieurs outils »

Le QCM était à la racine du dépôt ; il est maintenant dans `maths/`. Pour migrer :

1. Envoie le nouveau `index.html` (l'accueil), puis les dossiers `maths` et `elec` entiers. GitHub crée les dossiers automatiquement.
2. Supabase → **Authentication → URL Configuration** → *Site URL* : ajoute `maths/` à la fin de l'adresse (ex. `https://sushiazd.github.io/Prepa01/maths/`).
3. Les comptes, groupes et la progression enregistrée dans le navigateur sont conservés, car le site reste sur le même domaine. Le dépôt s'appelle maintenant `Prepa01` : l'ancien lien `…/MathPrac/` ne fonctionne plus (GitHub ne redirige pas les sites Pages après un renommage), il faut partager `…/Prepa01/`.

## Limites connues

- 1v1 : les bonnes réponses sont calculées dans le navigateur, un joueur qui fouille le code pourrait tricher. Le pseudo de chaque inscrit est visible par tous les comptes connectés, dans la liste du 1v1.

- Pas encore de « mot de passe oublié » : en cas d'oubli, le compte peut être supprimé depuis Supabase (*Authentication → Users*) et recréé.
- Le « temps d'entraînement » ne compte que les épreuves faites sur le site (pauses exclues).
- Une épreuve en cours ou en pause reste sur le téléphone où elle a été commencée ; elle est envoyée sur le compte une fois rendue.
- Les projets Supabase gratuits peuvent être mis en pause après une période d'inactivité : il suffit de les relancer depuis le tableau de bord Supabase.
