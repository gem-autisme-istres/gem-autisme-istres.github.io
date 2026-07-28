# CLAUDE.md — Site internet du GEM Autisme Istres

Ce fichier sert de mémoire permanente à Claude Code pour concevoir, développer et maintenir le site internet du **GEM Autisme Istres**. Le lire en début de session avant toute modification.

---

## 0. État réel du projet (important, à relire avant toute modification de contenu)

Contrairement à ce que la structure du site (Statuts / Actualités / Programmation / Équipe) peut laisser penser, **le GEM n'est pas encore une association créée**. Au moment de la première version du site (juillet 2026), le projet est en **phase de préfiguration** :

- Aucun local, aucune adresse, aucun téléphone, aucun e-mail définitifs n'existent encore.
- Les statuts ne sont pas rédigés : ils seront co-construits avec les futurs adhérents (voir le document « Création d'un GEM — cadre et déroulé », dix séances prévues).
- Aucune équipe d'animation n'est recrutée (le recrutement n'intervient qu'après l'obtention du financement ARS).
- Le programme d'activités présenté est une **proposition de travail** issue du document de cadrage, pas un programme réel en cours.
- Partenaires pressentis (non encore formalisés) : Mairie d'Istres, ARS PACA, associations marraines potentielles (L'Avancée, Autisme 13 / Arco Iris, FEGEMA).

**Ne jamais remplacer un `[À COMPLÉTER]` par une information inventée.** Mettre à jour le site au fur et à mesure que ces éléments se confirment réellement (nom de l'association une fois choisi, adresse du local, statuts adoptés en AG constitutive, équipe recrutée, etc.).

---

## 1. Contexte du projet

Un **GEM (Groupe d'Entraide Mutuelle)** est un collectif d'entraide entre pairs, porté par et pour ses adhérents. Le **GEM Autisme Istres** s'adresse aux personnes autistes adultes du bassin istréen et de ses environs. C'est un lieu convivial d'accueil, d'échange, d'activités et de soutien mutuel, animé dans une logique de participation et d'autodétermination des membres.

Objectif du site : présenter le GEM au public (personnes autistes, familles, partenaires, financeurs, bénévoles), informer sur la vie du groupe et faciliter le premier contact.

Public visé : personnes autistes (dont certaines peuvent avoir une sensibilité sensorielle ou des besoins de clarté), familles et aidants, professionnels et partenaires, financeurs institutionnels (ARS, collectivités).

Ton éditorial : chaleureux, clair, respectueux, sans jargon. Toujours écrire « personnes autistes » (formulation privilégiée par la communauté). Éviter le vocabulaire misérabiliste ou médicalisant. Éviter aussi tout registre héroïque ou pathologisant (pas de « combat », de « guerriers »).

---

## 2. Choix techniques

- **Stack** : site **statique en HTML / CSS / JavaScript pur**, sans framework ni étape de build.
- **Aucune dépendance lourde** : pas de React, pas de bundler, pas de Node requis. JavaScript uniquement pour le menu mobile (`js/main.js`).
- **Polices** : `system-ui` avec repli sur Arial (voir `--police-base` dans `css/style.css`).
- **Hébergement cible** : GitHub Pages ou Netlify. Le site fonctionne en ouvrant directement `index.html`, sans serveur.
- **Compatibilité** : navigateurs récents desktop et mobile, responsive mobile-first.

---

## 3. Architecture du site

1. **index.html** — Accueil / Présentation : qu'est-ce qu'un GEM, où en est le projet, valeurs, comment rejoindre.
2. **premiere-rencontre.html** — Votre première rencontre : section chaleureuse à destination d'un débutant, déroulé minute par minute d'une première séance (infographie chronologique CSS), vue d'ensemble des dix séances de construction du GEM (tableau), rentrée du premier cycle de rencontres annoncée pour septembre 2026. Contenu basé sur `GEM_Istres_creation_seances_constitutives.docx`.
3. **statuts.html** — Statuts : cadre juridique, gouvernance, étapes de création. Statuts définitifs à ajouter (PDF) une fois adoptés en AG constitutive.
4. **actualites.html** — Actualités : vide pour l'instant (projet non lancé), prête à recevoir les premières nouvelles.
5. **programmation.html** — Programmation : programme hebdomadaire proposé à titre indicatif, clairement présenté comme non définitif.
6. **equipe.html** — Équipe d'animation : pas d'équipe recrutée, page explique le profil recherché et invite à s'impliquer en attendant.
7. **contact.html** — Nous écrire : formulaire de contact accessible (nom, ville d'habitation, e-mail et/ou téléphone, profil facultatif, message, consentement RGPD avec lien vers la page confidentialité). **Activé depuis juillet 2026** (`FORMULAIRE_ACTIF = true` dans `js/contact.js`, réception à `clairegazeau@yahoo.com`), une fois les dates et le lieu des premières rencontres fixés : le bandeau annonce que le formulaire est ouvert et le bouton d'envoi est actif. Fonctionnement et procédure décrits dans `CONFIGURATION-FORMULAIRE.md` (section 9).
8. **confidentialite.html** — Confidentialité et mentions légales : page RGPD (aucun cookie, données collectées, finalité, base légale = consentement, destinataires/sous-traitants, durée de conservation, droits, CNIL, mentions légales). Liée uniquement depuis le pied de page et le consentement du formulaire (pas dans le menu principal).

Le menu de navigation (7 entrées) est identique sur toutes les pages, avec `aria-current="page"` sur l'onglet actif. `confidentialite.html` n'y figure pas (accès par le pied de page).

---

## 4. Structure des fichiers

```
/
├── index.html
├── premiere-rencontre.html
├── statuts.html
├── actualites.html
├── programmation.html
├── equipe.html
├── contact.html           # Formulaire de contact (inactif jusqu'à septembre 2026)
├── confidentialite.html   # Politique de confidentialité + mentions légales (RGPD)
├── css/
│   └── style.css          # Feuille de styles unique et commune (variables, layout, composants, formulaire, responsive)
├── js/
│   ├── main.js            # Menu mobile
│   └── contact.js         # Validation + envoi du formulaire par e-mail (FormSubmit) : FORMULAIRE_ACTIF + EMAIL_RECEPTION
├── .github/workflows/
│   └── pages.yml          # Déploiement GitHub Pages
├── assets/
│   ├── img/               # Logo, photos (aucun asset réel pour l'instant)
│   └── docs/              # Statuts PDF, documents téléchargeables (à ajouter)
├── CONFIGURATION-FORMULAIRE.md  # Guide pas à pas de mise en service du formulaire
└── CLAUDE.md
```

**Décision prise sur le header/footer commun** : le `<header>` et le `<footer>` sont **dupliqués proprement dans chaque page HTML** (pas d'injection JavaScript). Raison : le site doit s'ouvrir directement via `file://index.html` sans serveur, et le `fetch()` d'un fragment HTML local échoue sous ce protocole (restrictions CORS). Si le header ou la navigation changent, répercuter la modification dans les 5 fichiers HTML.

---

## 5. Accessibilité — priorité absolue

- Base de police 18px (`--taille-base`), interligne 1.65, texte aligné à gauche.
- Un seul `<h1>` par page, hiérarchie de titres respectée.
- Palette dans `css/style.css` (`:root`) : reprise des couleurs de `Affiche_GEM_Istres_2` — bleu `#2273a0` en couleur primaire (bleu clair `#5fa8ca` en teinte décorative), orange brûlé `#9c4818` en accent, fond crème `#fbf2e5`. Certaines teintes de l'affiche ont été assombries pour respecter le contraste AA (le bleu clair et l'orange de l'affiche, trop clairs, ne passent pas en usage texte). Contrastes vérifiés AA.
- Lien d'évitement (`.lien-evitement`) vers `#contenu-principal` sur chaque page.
- `prefers-reduced-motion` respecté dans le CSS (section 9 de `style.css`).
- Pas d'animation, pas de carrousel, pas de son/vidéo autoplay.
- Classe utilitaire `.a-completer` pour signaler visuellement les informations manquantes (adresse, téléphone, dates, etc.) — à utiliser tant que l'information réelle n'est pas fournie par l'association.

---

## 6. Conventions de développement

- Langue du contenu : français. Commentaires de code en français.
- Indentation 2 espaces, classes CSS en kebab-case **en français** (ex. `.entete-barre`, `.navigation-liste`).
- CSS organisé en sections numérotées dans `style.css` (variables → base → layout → header/nav → footer → composants → pages → responsive → accessibilité).
- Responsive mobile-first, points de rupture à 600px et 900px.
- Zéro tracker, zéro dépendance externe.

---

## 7. Contenu encore à récupérer / confirmer auprès du GEM

À mettre à jour au fur et à mesure de l'avancement réel du projet (ne pas inventer) :

- Nom définitif de l'association (à co-construire avec les futurs adhérents) et logo.
- Adresse du futur local, téléphone, e-mail de contact.
- ~~Dates des prochaines rencontres de préfiguration.~~ Fixées (juillet 2026) : samedis **5 septembre, 3 octobre, 7 novembre et 5 décembre 2026, de 10 h à 12 h**, à la **Maison des associations Charles Ouret** (7 chemin de Tartugues, 13800 Istres). Ces informations sont reprises sur l'accueil, les actualités, « Élaboration du GEM » et la page contact : **toute modification est à répercuter sur ces 4 pages** (+ les pieds de page).
- Contact / responsable de publication : **Claire Gazeau**, porteuse du projet. Choix retenu : afficher son **nom et le formulaire seulement**, jamais son e-mail personnel en clair (anti-spam) — l'adresse ne vit que dans `js/contact.js`.
- Téléphone : le GEM n'a pas encore de ligne. Les pages annoncent explicitement qu'un numéro sera ajouté au fil du projet (`.a-completer` « téléphone à venir » en pied de page).
- Statuts adoptés (texte + PDF) une fois votés en AG constitutive.
- Association marraine confirmée.
- Composition du conseil d'administration et du bureau après l'AG constitutive.
- Équipe d'animation recrutée (noms, rôles, éventuelles photos avec accord).
- Programme d'activités réellement validé par les adhérents (la version actuelle est une proposition de travail).
- Comptes réseaux sociaux, le cas échéant.

---

## 8. Rappels pour Claude Code

- Toujours produire un HTML sémantique et accessible (section 5) — critère de qualité numéro un.
- Garder la navigation et le pied de page identiques sur les **6 pages** ; toute modification doit être répercutée partout (pas de composant partagé automatique, cf. section 4).
- Ne pas ajouter de bibliothèque, tracker ou dépendance externe sans nécessité justifiée.
- Ne jamais remplacer un `[À COMPLÉTER]` / `.a-completer` par un contenu inventé (noms, adresse, dates, statuts) : ne mettre à jour qu'avec des informations confirmées par l'association.
- Tester le rendu sur mobile et desktop, vérifier la navigation au clavier après chaque modification significative.
- Le site doit rester déployable tel quel sur GitHub Pages / Netlify (100 % statique, ouverture directe de `index.html` sans serveur).

---

## 9. Formulaire de contact (envoi par e-mail)

- Le formulaire (`contact.html` + `js/contact.js`) est **statique** : un site GitHub Pages ne peut pas recevoir d'envoi seul. Les demandes partent donc **par e-mail** via le service gratuit **FormSubmit** (`https://formsubmit.co/ajax/<email>`), sans compte, sans jeton, sans serveur. Choix retenu avec la porteuse du projet après qu'elle a jugé la voie GitHub + Cloudflare trop technique : priorité à la **simplicité** et à l'**alerte e-mail**.
- **Activation** = deux valeurs en haut de `js/contact.js` : `FORMULAIRE_ACTIF` et `EMAIL_RECEPTION` (adresse qui reçoit les demandes). **Fait en juillet 2026** : `FORMULAIRE_ACTIF = true` et réception à `clairegazeau@yahoo.com` ; le bandeau annonce désormais que le formulaire est ouvert. Procédure : `CONFIGURATION-FORMULAIRE.md`.
- **Première demande** : FormSubmit envoie un e-mail « Confirm your email » à valider une fois ; ensuite les demandes arrivent automatiquement.
- **RGPD** : page `confidentialite.html` (aucun cookie, données minimisées, consentement explicite avec lien, durée de conservation, droits, sous-traitant **FormSubmit** + messagerie de l'association, CNIL). Liée au pied de page de toutes les pages et au consentement du formulaire. Si le sous-traitant du formulaire change, **mettre à jour cette page**. Compléter l'e-mail de contact / responsable de publication (`.a-completer`) dès qu'ils existent.
- Anti-spam : champ appât (« honeypot ») `site-web` vérifié côté navigateur ; `_captcha:false` pour éviter toute page captcha (accessibilité).
- Ne pas exposer d'adresse personnelle sans nécessité : possibilité d'utiliser un **alias** FormSubmit plus tard (voir le guide).
