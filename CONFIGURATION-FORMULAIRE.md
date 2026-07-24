# Mettre en service le formulaire de contact

Le formulaire de la page **« Nous écrire »** (`contact.html`) envoie chaque demande
**directement par e-mail**, grâce au service gratuit **FormSubmit**. Pas de compte à créer,
pas de mot de passe technique, pas de serveur : c'est la voie la plus simple.

> **Rappel.** Le formulaire est volontairement **inactif jusqu'à la première séance
> constitutive, en septembre 2026** (le site l'annonce clairement). Les étapes ci-dessous
> servent à l'ouvrir le moment venu.

---

## Tout se règle à un seul endroit : `js/contact.js`

Ouvrez le fichier [`js/contact.js`](js/contact.js). Tout en haut, deux lignes :

```js
var FORMULAIRE_ACTIF = false;                 // passer à true pour ouvrir le formulaire
var EMAIL_RECEPTION = "à-compléter@exemple.fr"; // l'adresse qui recevra les demandes
```

Pour activer le formulaire :

1. Remplacez `"à-compléter@exemple.fr"` par **l'adresse e-mail** qui doit recevoir les demandes.
2. Passez `FORMULAIRE_ACTIF` à **`true`**.
3. Enregistrez et publiez (commit + push sur `main`). Le site se met à jour en 1 à 2 minutes.

> **Je peux faire ces trois points pour vous** : indiquez-moi simplement l'adresse e-mail de
> réception, et je m'occupe de la modification et de la publication.

---

## La toute première demande : un clic de confirmation

La **première fois** qu'une demande est envoyée, FormSubmit vous adresse un e-mail intitulé
« Confirm your email ». Cliquez une fois sur le bouton de confirmation qu'il contient : c'est une
sécurité pour vérifier que l'adresse vous appartient. Ensuite, **toutes les demandes arrivent
automatiquement** dans votre boîte, sans plus rien à faire.

Astuce : faites vous-même ce premier envoi de test (remplissez le formulaire avec vos
coordonnées) pour recevoir et valider cet e-mail de confirmation avant l'ouverture au public.

---

## Suivre les demandes

Chaque demande arrive comme un **e-mail** contenant le nom, la ville, les coordonnées et le
message. Pour un suivi ordonné, créez dans votre messagerie un **dossier « GEM — contacts »** (ou
un filtre) : vous y retrouverez tout l'historique, et vous pourrez répondre directement à la
personne.

---

## Confidentialité (RGPD) — déjà pris en charge

- Le site ne pose **aucun cookie ni traceur**.
- Le formulaire ne collecte que le **nécessaire pour répondre** (nom, ville, e-mail/téléphone,
  message), avec **consentement explicite** et lien vers la page **Confidentialité et mentions
  légales** ([`confidentialite.html`](confidentialite.html)).
- Pensez à compléter, sur cette page, l'**adresse e-mail de contact** et le **responsable de la
  publication** dès qu'ils existent (repérés par la pastille « à compléter »).
- Pour éviter d'exposer votre adresse personnelle, vous pouvez plus tard utiliser un **alias**
  fourni par FormSubmit (un identifiant à la place de l'e-mail dans le code). Ce n'est pas
  indispensable pour démarrer.

## En cas de souci

- **Rien ne s'envoie** : vérifiez que `FORMULAIRE_ACTIF` vaut bien `true` et que `EMAIL_RECEPTION`
  contient une adresse valide.
- **Vous ne recevez pas les demandes** : vérifiez que vous avez bien cliqué sur l'e-mail de
  confirmation de FormSubmit (voir plus haut), et regardez le dossier « indésirables/spam ».
