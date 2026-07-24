# Mettre en service le formulaire de contact

Ce guide explique, pas à pas, comment activer le formulaire de la page **« Nous écrire »**
(`contact.html`). Une fois en place :

- chaque demande de contact devient une **fiche (« issue ») sur votre dépôt GitHub**, que
  vous suivez, étiquetez et clôturez comme un mini-suivi ;
- vous recevez une **alerte par e-mail** à chaque nouvelle demande.

> **À faire à la rentrée.** Le formulaire est volontairement **inactif jusqu'à la première
> séance constitutive, en septembre 2026**. Le site l'indique clairement aux visiteurs.
> Réalisez les étapes ci-dessous quand vous êtes prête à recevoir les messages.

Comptez environ 20 à 30 minutes. Aucune compétence technique avancée n'est requise : il s'agit
surtout de copier-coller et de cliquer.

---

## Vue d'ensemble

```
Visiteur du site  ─►  Formulaire (contact.html)  ─►  Connecteur (Cloudflare Worker)
                                                          │
                                                          ▼
                                        Création d'une « issue » sur GitHub
                                                          │
                                          ┌───────────────┴───────────────┐
                                          ▼                               ▼
                              Suivi des demandes sur GitHub      Alerte par e-mail
```

Pourquoi un « connecteur » ? Un site GitHub Pages est **statique** : il ne peut pas recevoir de
message tout seul. Le connecteur est un tout petit programme gratuit qui fait le lien entre le
formulaire et GitHub. Le **jeton d'accès** (mot de passe technique) reste stocké côté connecteur :
il n'apparaît **jamais** dans le site public.

---

## Étape 1 — Créer un jeton d'accès GitHub

1. Connectez-vous à GitHub avec le compte qui administre le dépôt du site.
2. Ouvrez **Settings** (réglages du compte) → tout en bas à gauche **Developer settings** →
   **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
3. Renseignez :
   - **Token name** : `connecteur-formulaire-gem`
   - **Expiration** : 1 an (à renouveler ensuite).
   - **Resource owner** : l'organisation **gem-autisme-istres**.
   - **Repository access** : *Only select repositories* → cochez
     **gem-autisme-istres.github.io**.
   - **Permissions** → *Repository permissions* → **Issues** : passez sur **Read and write**.
4. Cliquez **Generate token** et **copiez le jeton** (chaîne commençant par `github_pat_…`).
   ⚠️ Il ne s'affichera qu'une seule fois — gardez-le de côté quelques minutes, le temps de
   l'étape 2. Ne le collez nulle part dans le site.

---

## Étape 2 — Déployer le connecteur sur Cloudflare (gratuit)

1. Créez un compte gratuit sur <https://dash.cloudflare.com> (ou connectez-vous).
2. Dans le menu, ouvrez **Workers & Pages** → **Create** → **Create Worker**.
3. Donnez-lui un nom, par exemple `gem-contact`, puis **Deploy** (un code d'exemple est créé).
4. Cliquez **Edit code**. Supprimez tout le contenu et **collez le contenu du fichier
   [`connecteur/worker.js`](connecteur/worker.js)** de ce dépôt. Cliquez **Deploy**.
5. Notez l'adresse publique du Worker affichée en haut, du type
   `https://gem-contact.VOTRE-COMPTE.workers.dev`. Vous en aurez besoin à l'étape 4.

### Configurer les variables du Worker

Toujours dans la page du Worker : onglet **Settings** → **Variables and Secrets**.

- **Ajouter un secret** (bouton *Add* → type *Secret*) :
  - Nom : `GITHUB_TOKEN` — Valeur : le jeton copié à l'étape 1.
- **Ajouter deux variables** (type *Text*, en clair) :
  - `DEPOT` = `gem-autisme-istres/gem-autisme-istres.github.io`
  - `ORIGINE_AUTORISEE` = `https://gem-autisme-istres.github.io`

Cliquez **Deploy** / **Save** pour enregistrer.

---

## Étape 3 — Activer l'alerte e-mail

Deux petites actions, une seule fois :

1. **Définir qui est prévenu.** Sur GitHub, dépôt **gem-autisme-istres.github.io** →
   **Settings** → **Secrets and variables** → **Actions** → onglet **Variables** →
   **New repository variable** :
   - Name : `MAINTENEUR_GITHUB`
   - Value : **votre identifiant GitHub personnel** (celui qui doit recevoir les alertes),
     sans le `@`.

   Le workflow [`.github/workflows/alerte-contact.yml`](.github/workflows/alerte-contact.yml)
   (déjà présent dans le dépôt) publiera alors, à chaque nouvelle demande, un commentaire qui
   vous mentionne — ce qui déclenche l'e-mail.

2. **Vérifier vos préférences d'e-mail GitHub.** Sur GitHub → **Settings** (compte personnel) →
   **Notifications** : assurez-vous que la catégorie **Participating** est bien envoyée par
   **e-mail**. C'est le réglage par défaut.

> Astuce complémentaire : vous pouvez aussi cliquer **Watch** → **All Activity** sur le dépôt
> pour suivre toute l'activité. La mention configurée ci-dessus suffit toutefois à recevoir
> l'alerte de façon fiable.

---

## Étape 4 — Activer le formulaire dans le site

1. Ouvrez le fichier [`js/contact.js`](js/contact.js).
2. Modifiez les **deux premières valeurs** en haut du fichier :

   ```js
   var FORMULAIRE_ACTIF = true;                       // au lieu de false
   var POINT_DE_TERMINAISON = "https://gem-contact.VOTRE-COMPTE.workers.dev"; // l'adresse de l'étape 2
   ```

3. *(Facultatif mais conseillé)* Mettez à jour le texte du bandeau et du bouton dans
   `contact.html` pour retirer la mention « à partir de septembre 2026 » une fois le formulaire
   ouvert.
4. Enregistrez, puis publiez les modifications (commit + push sur la branche `main`).
   GitHub Pages met le site à jour automatiquement en une à deux minutes.

---

## Étape 5 — Tester

1. Ouvrez la page **« Nous écrire »** du site en ligne.
2. Remplissez le formulaire avec vos propres coordonnées et envoyez.
3. Vérifiez que :
   - une nouvelle **issue** « Demande de contact — … » apparaît sur le dépôt GitHub
     (onglet **Issues**, étiquette `demande-contact`) ;
   - vous recevez l'**e-mail** d'alerte peu après.

Tout fonctionne ? Le formulaire est en service. 🎉

---

## Suivre et gérer les demandes

- Chaque demande = une **issue**. Répondez à la personne par e-mail ou téléphone (coordonnées
  indiquées dans l'issue), puis **fermez l'issue** une fois traitée.
- Utilisez les **étiquettes** (`à traiter`, `traité`, `à recontacter`…) pour votre suivi.
- L'onglet **Issues → Closed** garde l'historique de toutes les demandes.

## Confidentialité (RGPD)

- Les issues d'un dépôt **public** sont visibles de tous. Comme elles contiennent des
  coordonnées personnelles, il est recommandé de créer les demandes dans un **dépôt privé
  séparé** (par ex. `gem-autisme-istres/contacts`). Pour cela, créez ce dépôt privé, donnez au
  jeton (étape 1) l'accès à ce dépôt, et mettez `DEPOT` (étape 2) à
  `gem-autisme-istres/contacts`. Le workflow d'alerte est alors à copier dans ce dépôt privé.
- Le formulaire ne collecte que le strict nécessaire pour répondre (nom, ville, e-mail ou
  téléphone, message) et l'annonce clairement à la personne, qui doit cocher son accord.

## En cas de souci

- **Aucune issue ne se crée** : vérifiez le secret `GITHUB_TOKEN` et la variable `DEPOT` du
  Worker ; consultez les **logs** du Worker (onglet *Logs* dans Cloudflare).
- **Message d'erreur sur le site à l'envoi** : vérifiez que `POINT_DE_TERMINAISON` (dans
  `js/contact.js`) correspond exactement à l'adresse du Worker, et que `ORIGINE_AUTORISEE`
  correspond à l'adresse du site.
- **Pas d'e-mail** : vérifiez la variable `MAINTENEUR_GITHUB` et vos préférences de
  notifications GitHub.
