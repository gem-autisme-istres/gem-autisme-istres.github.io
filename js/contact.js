// GEM Autisme Istres — formulaire de contact
// ---------------------------------------------------------------------------
// Ce script gère la validation et l'envoi du formulaire de la page contact.html.
// Aucune dépendance à installer, aucun compte, aucun jeton : les messages sont
// envoyés par e-mail via le service gratuit FormSubmit. Voir
// CONFIGURATION-FORMULAIRE.md.

// === CONFIGURATION — les deux seules valeurs à connaître pour la mise en service ===

// Passer à true en septembre 2026 pour ouvrir le formulaire au public.
var FORMULAIRE_ACTIF = true;

// Adresse e-mail qui recevra les demandes de contact (boîte Gmail du GEM,
// transférée automatiquement vers la messagerie de la porteuse du projet).
var EMAIL_RECEPTION = "gemtsaistres@gmail.com";

// ===========================================================================

// Adresse du service d'envoi, construite à partir de l'e-mail ci-dessus.
var POINT_DE_TERMINAISON = "https://formsubmit.co/ajax/" + EMAIL_RECEPTION;

document.addEventListener("DOMContentLoaded", function () {
  var formulaire = document.getElementById("formulaire-contact");
  if (!formulaire) {
    return;
  }

  var bouton = formulaire.querySelector('button[type="submit"]');
  var etat = document.getElementById("etat-formulaire");
  var zoneSucces = document.getElementById("message-succes");
  var zoneErreur = document.getElementById("message-erreur");

  var estConfigure = FORMULAIRE_ACTIF && EMAIL_RECEPTION.indexOf("à-compléter") === -1;

  // Tant que le formulaire n'est pas activé, le bouton reste désactivé
  // et le message explicatif est conservé (« actif à partir de septembre 2026 »).
  if (!estConfigure) {
    if (bouton) {
      bouton.disabled = true;
    }
    return;
  }

  // Formulaire actif : on active le bouton et on met à jour le message d'état.
  bouton.disabled = false;
  if (etat) {
    etat.textContent = "Vos champs seront vérifiés avant l'envoi.";
  }

  formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    masquer(zoneSucces);
    masquer(zoneErreur);
    effacerErreurs(formulaire);

    // Anti-spam : si le champ appât est rempli, c'est un robot. On fait semblant
    // de réussir sans rien envoyer.
    var appat = formulaire.querySelector('[name="site-web"]');
    if (appat && appat.value.trim() !== "") {
      afficher(zoneSucces);
      formulaire.reset();
      return;
    }

    var erreurs = valider(formulaire);
    if (erreurs.length > 0) {
      erreurs.forEach(function (e) {
        marquerErreur(e.champ, e.message);
      });
      // On place le focus sur le premier champ en erreur.
      var premier = document.getElementById(erreurs[0].champ);
      if (premier) {
        premier.focus();
      }
      return;
    }

    envoyer(formulaire, bouton, zoneSucces, zoneErreur);
  });
});

// === Validation ===
// Retourne un tableau d'erreurs { champ, message }.
function valider(formulaire) {
  var erreurs = [];
  var valeur = function (id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };

  if (valeur("nom") === "") {
    erreurs.push({ champ: "nom", message: "Merci d'indiquer votre nom ou prénom." });
  }
  if (valeur("ville") === "") {
    erreurs.push({ champ: "ville", message: "Merci d'indiquer votre ville d'habitation." });
  }

  var email = valeur("email");
  var telephone = valeur("telephone");
  if (email === "" && telephone === "") {
    // On rattache l'erreur au champ e-mail (premier des deux moyens de contact).
    erreurs.push({
      champ: "email",
      message: "Indiquez au moins un moyen de vous répondre : un e-mail ou un téléphone."
    });
  } else if (email !== "" && !estEmailValide(email)) {
    erreurs.push({ champ: "email", message: "Cette adresse e-mail ne semble pas valide." });
  }

  if (valeur("message") === "") {
    erreurs.push({ champ: "message", message: "Merci d'écrire votre message." });
  }

  var consentement = document.getElementById("consentement");
  if (consentement && !consentement.checked) {
    erreurs.push({ champ: "consentement", message: "Merci de cocher cette case pour que l'on puisse vous répondre." });
  }

  return erreurs;
}

function estEmailValide(valeur) {
  // Contrôle volontairement souple : présence d'un « @ » et d'un point après.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);
}

// === Envoi par e-mail (FormSubmit) ===
function envoyer(formulaire, bouton, zoneSucces, zoneErreur) {
  var texteBouton = bouton.textContent;
  bouton.disabled = true;
  bouton.textContent = "Envoi en cours…";

  var donnees = {
    Nom: champ("nom"),
    Ville: champ("ville"),
    "E-mail": champ("email"),
    "Téléphone": champ("telephone"),
    "Vous êtes": profilChoisi(formulaire),
    Message: champ("message"),
    // Options FormSubmit : objet de l'e-mail, mise en forme, pas de captcha.
    _subject: "Nouvelle demande de contact — site du GEM",
    _template: "table",
    _captcha: "false"
  };

  fetch(POINT_DE_TERMINAISON, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(donnees)
  })
    .then(function (reponse) {
      if (!reponse.ok) {
        throw new Error("Réponse " + reponse.status);
      }
      afficher(zoneSucces);
      formulaire.reset();
      zoneSucces.focus && zoneSucces.focus();
    })
    .catch(function () {
      afficher(zoneErreur);
    })
    .then(function () {
      bouton.disabled = false;
      bouton.textContent = texteBouton;
    });
}

// === Petites fonctions utilitaires ===
function champ(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function profilChoisi(formulaire) {
  var coche = formulaire.querySelector('input[name="profil"]:checked');
  return coche ? coche.value : "";
}

function marquerErreur(idChamp, message) {
  var el = document.getElementById(idChamp);
  if (!el) {
    return;
  }
  el.setAttribute("aria-invalid", "true");

  var idErreur = "erreur-" + idChamp;
  var span = document.getElementById(idErreur);
  if (!span) {
    span = document.createElement("span");
    span.className = "erreur-champ";
    span.id = idErreur;
    // On insère le message juste après le champ concerné.
    el.parentNode.appendChild(span);
    // On relie le message au champ pour les lecteurs d'écran.
    var decrit = el.getAttribute("aria-describedby");
    el.setAttribute("aria-describedby", decrit ? decrit + " " + idErreur : idErreur);
  }
  span.textContent = message;
}

function effacerErreurs(formulaire) {
  var messages = formulaire.querySelectorAll(".erreur-champ");
  messages.forEach(function (m) {
    m.parentNode.removeChild(m);
  });
  var invalides = formulaire.querySelectorAll('[aria-invalid="true"]');
  invalides.forEach(function (el) {
    el.removeAttribute("aria-invalid");
  });
}

function afficher(zone) {
  if (zone) {
    zone.hidden = false;
  }
}

function masquer(zone) {
  if (zone) {
    zone.hidden = true;
  }
}
