// GEM Autisme Istres — animation « Le chemin parcouru » (page chemin.html)
//
// Amélioration progressive : sans JavaScript, la scène reste masquée (hidden)
// et la frise « Toutes les étapes », écrite en HTML, donne tout le contenu.
// L'animation ne démarre jamais seule : la personne la lance avec le bouton
// « Lancer », la met en pause quand elle veut, et peut choisir un rythme lent.
// Avec « réduire les animations », les étapes changent sans fondu ni tracé.
// Exception : le fichier autonome ouvert avec #video (enregistrement vidéo)
// démarre seul et masque les commandes.
document.addEventListener("DOMContentLoaded", function () {
  var boite = document.getElementById("chemin-animation");
  if (!boite) { return; }
  var video = location.hash === "#video";
  if (video) { document.documentElement.classList.add("mode-video"); }
  boite.hidden = false;

  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scenes = boite.querySelectorAll(".chemin-scene");
  var points = boite.querySelectorAll(".chemin-point");
  var etapes = document.querySelectorAll(".chemin-etape");
  var rect = boite.querySelector(".chemin-parcours-rect");
  var barre = boite.querySelector(".chemin-barre i");
  var compteur = boite.querySelector(".chemin-compteur");
  var bLecture = boite.querySelector('[data-action="lecture"]');
  var bRythme = boite.querySelector('[data-action="rythme"]');
  var zoneScenes = boite.querySelector(".chemin-scenes");
  var N = scenes.length;
  var xs = [];
  points.forEach(function (p) { xs.push(parseFloat(p.style.left) * 10); });

  var i = 0, lecture = false, lent = false, t0 = 0, ecoule = 0, largeur = 0, anim = null;

  function duree(k) {
    var mots = scenes[k].querySelector(".chemin-copie").textContent.trim().split(/\s+/).length;
    var base = (k === 0 || k === N - 1) ? 7000 : 2600 + mots * 260;
    return base * (lent ? 1.5 : 1);
  }
  function tracer(w) {
    if (anim) { cancelAnimationFrame(anim); }
    if (reduit) { largeur = w; rect.setAttribute("width", w); return; }
    var depart = largeur, debut = performance.now();
    function pas(t) {
      var k = Math.min(1, (t - debut) / 1100), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      largeur = depart + (w - depart) * e; rect.setAttribute("width", largeur);
      if (k < 1) { anim = requestAnimationFrame(pas); }
    }
    anim = requestAnimationFrame(pas);
  }
  var ICO = {
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    lire: '<path d="M7 4.5v15l12-7.5z"/>',
    revoir: '<path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4"/>'
  };
  function majBouton() {
    var svg = bLecture.querySelector("svg"), txt = bLecture.querySelector(".chemin-txt");
    svg.classList.remove("contour");
    if (lecture) { svg.innerHTML = ICO.pause; txt.textContent = "Pause"; bLecture.setAttribute("aria-label", "Mettre en pause"); }
    else if (i === N - 1) { svg.innerHTML = ICO.revoir; svg.classList.add("contour"); txt.textContent = "Revoir"; bLecture.setAttribute("aria-label", "Revoir depuis le début"); }
    else { svg.innerHTML = ICO.lire; txt.textContent = (i === 0 && ecoule === 0) ? "Lancer" : "Reprendre"; bLecture.setAttribute("aria-label", "Lancer l’animation"); }
    zoneScenes.setAttribute("aria-live", lecture ? "off" : "polite");
  }
  function aller(k) {
    i = Math.max(0, Math.min(N - 1, k));
    scenes.forEach(function (s, j) { s.classList.toggle("active", j === i); if (j === i) { s.removeAttribute("aria-hidden"); } else { s.setAttribute("aria-hidden", "true"); } });
    points.forEach(function (p, j) {
      p.classList.toggle("passe", j < i); p.classList.toggle("courant", j === i);
      if (j === i) { p.setAttribute("aria-current", "step"); } else { p.removeAttribute("aria-current"); }
    });
    etapes.forEach(function (b) { b.classList.toggle("courant", +b.getAttribute("data-aller") === i); });
    tracer(xs[i]);
    compteur.textContent = String(i + 1).padStart(2, "0") + " / " + String(N).padStart(2, "0");
    ecoule = 0; t0 = performance.now(); barre.style.transform = "scaleX(0)";
    majBouton();
  }
  function boucle(t) {
    if (lecture) {
      var tot = ecoule + (t - t0), d = duree(i);
      barre.style.transform = "scaleX(" + Math.min(1, tot / d) + ")";
      if (tot >= d) {
        if (i < N - 1) { aller(i + 1); }
        else { lecture = false; majBouton(); if (video) { document.documentElement.setAttribute("data-fin", "1"); } }
      }
    }
    requestAnimationFrame(boucle);
  }
  function basculer() {
    if (lecture) { ecoule += performance.now() - t0; lecture = false; }
    else { if (i === N - 1) { aller(0); } lecture = true; t0 = performance.now(); }
    majBouton();
  }
  bLecture.addEventListener("click", basculer);
  boite.querySelector('[data-action="prec"]').addEventListener("click", function () { aller(i - 1); });
  boite.querySelector('[data-action="suiv"]').addEventListener("click", function () { aller(i + 1); });
  bRythme.addEventListener("click", function () {
    lent = !lent; bRythme.setAttribute("aria-pressed", lent ? "true" : "false");
    bRythme.firstElementChild.textContent = "Rythme : " + (lent ? "lent" : "normal");
  });
  points.forEach(function (p) { p.addEventListener("click", function () { aller(+p.getAttribute("data-aller")); }); });
  etapes.forEach(function (b) {
    b.addEventListener("click", function () {
      aller(+b.getAttribute("data-aller"));
      boite.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    });
  });
  boite.addEventListener("keydown", function (e) {
    if (e.target.closest("button") && (e.key === " " || e.key === "Enter")) { return; }
    if (e.key === "ArrowRight") { aller(i + 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { aller(i - 1); e.preventDefault(); }
    else if (e.key === " ") { basculer(); e.preventDefault(); }
  });
  aller(0);
  requestAnimationFrame(boucle);
  if (video) { setTimeout(function () { lecture = true; t0 = performance.now(); majBouton(); }, 1200); }
});
