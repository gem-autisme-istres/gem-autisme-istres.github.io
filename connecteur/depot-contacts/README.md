# Dépôt privé « contacts » — mode d'emploi

Ce dossier contient ce qu'il faut mettre dans le **dépôt privé** qui recevra les
demandes de contact du site. On sépare volontairement ces données personnelles du
dépôt public du site (respect du RGPD).

## Ce que contient ce dossier

- `.github/workflows/alerte-contact.yml` — le workflow qui vous alerte par e-mail
  à chaque nouvelle demande.

## Mise en place (une seule fois)

1. Sur GitHub, créez un dépôt **privé** nommé **`contacts`** dans l'organisation
   **gem-autisme-istres** (bouton *New repository* → Visibility : **Private**).
2. Ajoutez-y le fichier `.github/workflows/alerte-contact.yml` (copiez le dossier
   `.github` de ce dossier-ci à la racine du dépôt privé).
3. Dans ce dépôt privé : **Settings → Secrets and variables → Actions → Variables
   → New repository variable** :
   - Name : `MAINTENEUR_GITHUB`
   - Value : votre identifiant GitHub personnel (celui qui doit recevoir les
     alertes), sans le `@`.

C'est tout pour ce dépôt. Le reste (jeton, connecteur, activation) est décrit dans
`CONFIGURATION-FORMULAIRE.md`, à la racine du dépôt du site.
