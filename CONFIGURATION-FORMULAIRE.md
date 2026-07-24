# Mettre en service le formulaire de contact

Ce guide explique, pas à pas, comment activer le formulaire de la page **« Nous écrire »**
(`contact.html`). Une fois en place :

- chaque demande de contact devient une **fiche (« issue ») dans un dépôt GitHub privé**, que
  vous suivez, étiquetez et clôturez comme un mini-suivi ;
- vous recevez une **alerte par e-mail** à chaque nouvelle demande ;
- les données personnelles restent **dans un espace privé**, séparé du site public (RGPD).

> **À faire à la rentrée.** Le formulaire est volontairement **inactif jusqu'à la première
> séance constitutive, en septembre 2026**. Le site l'indique clairement aux visiteurs.

---

## Version courte — ce qu'il reste à faire

Tout ce qui pouvait être préparé à l'avance l'a été (réglages inscrits dans le code, page de
confidentialité, guide). Il ne reste que **3 branchements**, qui exigent *votre* connexion
GitHub / Cloudflare, puis **l'activation** — que l'on peut faire ensemble.

1. **Créer le dépôt privé `contacts`** et y déposer le contenu du dossier
   [`connecteur/depot-contacts/`](connecteur/depot-contacts/) (workflow d'alerte + variable
   `MAINTENEUR_GITHUB`). → étape 1
2. **Créer un jeton GitHub** limité à ce dépôt privé (droit *Issues*). → étape 2
3. **Créer le connecteur** sur votre compte Cloudflare : coller
   [`connecteur/worker.js`](connecteur/worker.js), y ajouter le jeton comme secret, déployer,
   copier l'adresse. → étape 3
4. **Activer** : reporter cette adresse dans `js/contact.js` et passer le formulaire en actif.
   → étape 4 (je peux le faire pour vous : envoyez-moi l'adresse du Worker).

Comptez 20 à 30 minutes. Aucune compétence technique avancée : surtout du copier-coller.

---

## Pourquoi cette organisation ?

Un site GitHub Pages est **statique** : il ne peut pas recevoir de message tout seul. Un petit
programme gratuit (le « connecteur ») fait le pont entre le formulaire et GitHub. Le **jeton
d'accès** reste stocké côté connecteur : il n'apparaît **jamais** dans le site public.

Les demandes contiennent des données personnelles (nom, ville, coordonnées). Elles sont donc
enregistrées dans un **dépôt privé dédié** (`contacts`), et non dans le dépôt public du site.

```
Visiteur  ─►  Formulaire (site public)  ─►  Connecteur Cloudflare (garde le jeton)
                                                   │
                                                   ▼
                              Création d'une issue dans le dépôt PRIVÉ « contacts »
                                                   │
                                  ┌────────────────┴────────────────┐
                                  ▼                                 ▼
                        Suivi privé des demandes           Alerte par e-mail
```

> **Faut-il rendre le dépôt du *site* privé ?** Non. Il ne contient que le code public du site,
> **aucune donnée personnelle**. De plus, publier un site via GitHub Pages depuis un dépôt privé
> nécessite un abonnement payant. On garde donc le **site public** et les **données dans le dépôt
> privé** `contacts`.

---

## Étape 1 — Créer le dépôt privé `contacts`

1. Sur GitHub, cliquez **New repository**. Propriétaire : **gem-autisme-istres**. Nom :
   **`contacts`**. Visibilité : **Private**. Créez le dépôt.
2. Ajoutez-y le fichier `.github/workflows/alerte-contact.yml` : copiez le dossier `.github`
   présent dans [`connecteur/depot-contacts/`](connecteur/depot-contacts/) à la racine du dépôt
   privé (le fichier [README](connecteur/depot-contacts/README.md) de ce dossier le rappelle).
3. Toujours dans le dépôt `contacts` : **Settings → Secrets and variables → Actions → onglet
   Variables → New repository variable** :
   - Name : `MAINTENEUR_GITHUB`
   - Value : **votre identifiant GitHub personnel** (celui qui doit recevoir les alertes), sans
     le `@`.

---

## Étape 2 — Créer un jeton d'accès GitHub

1. GitHub → **Settings** (compte) → tout en bas **Developer settings** → **Personal access
   tokens** → **Fine-grained tokens** → **Generate new token**.
2. Renseignez :
   - **Token name** : `connecteur-formulaire-gem`
   - **Expiration** : 1 an (à renouveler ensuite).
   - **Resource owner** : **gem-autisme-istres**.
   - **Repository access** : *Only select repositories* → cochez **contacts** (le dépôt privé).
   - **Permissions** → *Repository permissions* → **Issues** : **Read and write**.
3. **Generate token**, puis **copiez le jeton** (`github_pat_…`). ⚠️ Il ne s'affiche qu'une
   fois ; gardez-le quelques minutes pour l'étape 3. Ne le collez jamais dans le site.

---

## Étape 3 — Déployer le connecteur sur Cloudflare (gratuit)

Votre compte Cloudflare est déjà créé. Connectez-vous sur <https://dash.cloudflare.com>.

1. **Workers & Pages** → **Create** → **Create Worker**.
2. Nommez-le, par ex. `gem-contact`, puis **Deploy** (un exemple est créé).
3. **Edit code** : effacez tout, **collez le contenu de** [`connecteur/worker.js`](connecteur/worker.js),
   puis **Deploy**.
4. Notez l'adresse publique affichée, du type `https://gem-contact.VOTRE-COMPTE.workers.dev`.

### Ajouter le jeton (une seule variable à définir)

Onglet **Settings** → **Variables and Secrets** → **Add** → type **Secret** :
- Nom : `GITHUB_TOKEN` — Valeur : le jeton copié à l'étape 2. Puis **Deploy** / **Save**.

> Les autres réglages (nom du dépôt privé, adresse du site autorisée) sont **déjà inscrits dans
> `worker.js`** : rien d'autre à configurer.

---

## Étape 4 — Activer le formulaire

Deux valeurs à changer en haut de [`js/contact.js`](js/contact.js) :

```js
var FORMULAIRE_ACTIF = true;                        // au lieu de false
var POINT_DE_TERMINAISON = "https://gem-contact.VOTRE-COMPTE.workers.dev"; // adresse de l'étape 3
```

Puis publier (commit + push sur `main`). GitHub Pages met le site à jour en 1 à 2 minutes.
Pensez aussi à retirer, dans `contact.html`, la mention « à partir de septembre 2026 » du
bandeau et du bouton une fois le formulaire ouvert.

> **Je peux faire cette étape 4 pour vous** : une fois l'adresse du Worker obtenue (étape 3),
> transmettez-la moi et je réalise la modification et la publication.

---

## Étape 5 — Tester

1. Ouvrez la page **« Nous écrire »** en ligne, remplissez-la avec vos coordonnées, envoyez.
2. Vérifiez qu'une **issue** « Demande de contact — … » apparaît dans le dépôt **privé**
   `contacts`, et que vous recevez l'**e-mail** d'alerte.

---

## Suivre et gérer les demandes

- Chaque demande = une **issue** dans le dépôt privé. Répondez à la personne (coordonnées dans
  l'issue), puis **fermez l'issue**. Utilisez les **étiquettes** pour votre suivi.
- Onglet **Issues → Closed** : historique de toutes les demandes.

## Confidentialité (RGPD) — déjà pris en charge par le site

- Les données de contact vont dans le **dépôt privé** `contacts` (jamais dans le dépôt public).
- Le site ne pose **aucun cookie ni traceur**.
- Le formulaire ne collecte que le **nécessaire pour répondre**, avec **consentement explicite**
  et lien vers la page **Confidentialité et mentions légales** (`confidentialite.html`).
- Pensez à compléter, sur cette page, l'**adresse e-mail de contact** et le **responsable de la
  publication** dès qu'ils existent (repérés par la pastille « à compléter »).

## En cas de souci

- **Aucune issue** : vérifiez le secret `GITHUB_TOKEN`, que le jeton a bien accès au dépôt
  `contacts`, et les **logs** du Worker (onglet *Logs* de Cloudflare).
- **Erreur à l'envoi sur le site** : vérifiez que `POINT_DE_TERMINAISON` correspond exactement à
  l'adresse du Worker.
- **Pas d'e-mail** : vérifiez la variable `MAINTENEUR_GITHUB` du dépôt `contacts` et vos
  préférences de notifications GitHub (catégorie *Participating* par e-mail).
