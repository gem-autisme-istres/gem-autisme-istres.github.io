// GEM Autisme Istres — connecteur du formulaire de contact
// ---------------------------------------------------------------------------
// Petit « Cloudflare Worker » qui reçoit les envois du formulaire (contact.html)
// et crée une « issue » sur le dépôt GitHub du GEM. Chaque demande de contact
// devient ainsi une fiche que l'on suit, étiquette et clôture sur GitHub, et
// GitHub envoie une alerte par e-mail (voir CONFIGURATION-FORMULAIRE.md).
//
// Le jeton GitHub n'est JAMAIS écrit dans ce fichier ni dans le site : il est
// stocké comme « secret » du Worker (variable GITHUB_TOKEN).
//
// Variables à définir dans le tableau de bord Cloudflare :
//   - GITHUB_TOKEN      (secret)   jeton fine-grained avec droit Issues (lecture/écriture)
//   - DEPOT             (variable) ex. "gem-autisme-istres/gem-autisme-istres.github.io"
//   - ORIGINE_AUTORISEE (variable) ex. "https://gem-autisme-istres.github.io"

export default {
  async fetch(request, env) {
    const origine = env.ORIGINE_AUTORISEE || "*";

    // Réponse à la requête préparatoire CORS envoyée par le navigateur.
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: enTetesCors(origine) });
    }

    if (request.method !== "POST") {
      return json({ erreur: "Méthode non autorisée" }, 405, origine);
    }

    let donnees;
    try {
      donnees = await request.json();
    } catch (e) {
      return json({ erreur: "Requête invalide" }, 400, origine);
    }

    // Anti-spam : le champ appât « site-web » doit rester vide.
    if (donnees["site-web"]) {
      // On répond « ok » sans rien créer, pour ne pas renseigner les robots.
      return json({ ok: true }, 200, origine);
    }

    const nom = nettoyer(donnees.nom);
    const ville = nettoyer(donnees.ville);
    const email = nettoyer(donnees.email);
    const telephone = nettoyer(donnees.telephone);
    const profil = nettoyer(donnees.profil);
    const message = nettoyer(donnees.message);

    // Contrôles minimaux côté serveur (le formulaire vérifie déjà côté navigateur).
    if (!nom || !ville || !message || (!email && !telephone)) {
      return json({ erreur: "Champs obligatoires manquants" }, 422, origine);
    }

    const titre = `Demande de contact — ${nom} (${ville})`;
    const corps = [
      `**Nom / prénom :** ${nom}`,
      `**Ville d'habitation :** ${ville}`,
      email ? `**E-mail :** ${email}` : null,
      telephone ? `**Téléphone :** ${telephone}` : null,
      profil ? `**Profil :** ${profil}` : null,
      "",
      "**Message :**",
      "",
      message,
      "",
      "---",
      "_Envoyé automatiquement depuis le formulaire de contact du site._"
    ]
      .filter((ligne) => ligne !== null)
      .join("\n");

    const reponseGitHub = await fetch(`https://api.github.com/repos/${env.DEPOT}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "gem-autisme-istres-contact"
      },
      body: JSON.stringify({
        title: titre,
        body: corps,
        labels: ["demande-contact"]
      })
    });

    if (!reponseGitHub.ok) {
      const details = await reponseGitHub.text();
      console.log("Erreur GitHub :", reponseGitHub.status, details);
      return json({ erreur: "Envoi impossible pour le moment" }, 502, origine);
    }

    return json({ ok: true }, 200, origine);
  }
};

// Nettoie et borne une valeur texte reçue du formulaire.
function nettoyer(valeur) {
  if (typeof valeur !== "string") {
    return "";
  }
  return valeur.trim().slice(0, 5000);
}

function enTetesCors(origine) {
  return {
    "Access-Control-Allow-Origin": origine,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(objet, statut, origine) {
  return new Response(JSON.stringify(objet), {
    status: statut,
    headers: Object.assign({ "Content-Type": "application/json" }, enTetesCors(origine))
  });
}
