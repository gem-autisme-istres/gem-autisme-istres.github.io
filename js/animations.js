// GEM Autisme Istres — apparition douce au défilement
//
// Amélioration progressive, jamais une condition d'accès au contenu :
// - Sans JavaScript : ce script ne s'exécute pas, tout le contenu est visible
//   immédiatement (comportement par défaut du CSS).
// - Avec « réduire les animations » activé dans le système (prefers-reduced-
//   motion), ou si le navigateur ne connaît pas IntersectionObserver : le
//   script s'arrête tout de suite, sans ajouter aucune classe, sans aucune
//   apparition — le contenu reste visible immédiatement.
// - Sinon : les grands blocs de contenu (sections, bloc d'accroche) reçoivent
//   un léger fondu avec une petite montée (quelques millisecondes, une seule
//   fois) au moment où ils entrent dans l'écran, pour un rendu plus doux.
document.addEventListener("DOMContentLoaded", function () {
  var reduireAnimations =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduireAnimations || !("IntersectionObserver" in window)) {
    return;
  }

  var cibles = document.querySelectorAll("main section, .bloc-hero");

  if (!cibles.length) {
    return;
  }

  document.documentElement.classList.add("js-animations");

  var observateur = new IntersectionObserver(
    function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add("apparition-visible");
          observateur.unobserve(entree.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
  );

  cibles.forEach(function (element) {
    element.classList.add("apparition");
    observateur.observe(element);
  });
});
