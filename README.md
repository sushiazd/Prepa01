# QCM maths · mise en ligne

Le site tient en 4 fichiers :

| Fichier | Rôle |
|---|---|
| `index.html` | le site complet (QCM, import de PDF, catalogue, comptes, groupes) |
| `config.js` | l'adresse de ta base Supabase (à remplir, étape 4) |
| `supabase.sql` | la base de données et ses règles de sécurité (étape 2) |
| `README.md` | ce guide |

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
2. *uploading an existing file* → glisse `index.html`, `config.js`, `supabase.sql`, `README.md` → *Commit changes*.
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

Remplace `index.html` dans le dépôt GitHub (*Add file → Upload files*). Ne touche pas à `config.js`. Les données des comptes ne sont pas affectées.

## Limites connues

- Pas encore de « mot de passe oublié » : en cas d'oubli, le compte peut être supprimé depuis Supabase (*Authentication → Users*) et recréé.
- Le « temps d'entraînement » ne compte que les épreuves faites sur le site (pauses exclues).
- Une épreuve en cours ou en pause reste sur le téléphone où elle a été commencée ; elle est envoyée sur le compte une fois rendue.
- Les projets Supabase gratuits peuvent être mis en pause après une période d'inactivité : il suffit de les relancer depuis le tableau de bord Supabase.
