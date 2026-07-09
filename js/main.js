// GEM Autisme Istres — interactions légères (menu mobile)
document.addEventListener("DOMContentLoaded", function () {
  var bouton = document.querySelector(".bouton-menu");
  var liste = document.querySelector(".navigation-liste");

  if (!bouton || !liste) {
    return;
  }

  bouton.addEventListener("click", function () {
    var estOuvert = liste.classList.toggle("ouverte");
    bouton.setAttribute("aria-expanded", estOuvert ? "true" : "false");
  });
});
