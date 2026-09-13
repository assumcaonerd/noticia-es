(function () {
  var capa = "https://noticiaes.com.br/assets/og/elianecantanhede.svg";
  var slug = "dos-aplausos-ao-cadafalso-a-militante-de-redacao-troca-o-xerife-quando-o-xerife-vira-estorvo";
  if (typeof noticias !== "undefined" && Array.isArray(noticias)) {
    noticias.forEach(function (n) {
      if (n.slug === slug) {
        n.imagem = capa;
        n.imagemX = capa;
        n.imagemLargura = 1672;
        n.imagemAltura = 941;
      }
    });
  }
  function apply() {
    document.querySelectorAll("img").forEach(function (img) {
      var s = img.getAttribute("src") || "";
      if (
        s.indexOf("HSGOnUp") !== -1 ||
        s.indexOf("elianecantan") !== -1 ||
        s.indexOf("cantanhede-xerife") !== -1 ||
        (img.className || "").indexOf("materia-capa") !== -1
      ) {
        if (s !== capa) img.src = capa;
      }
    });
  }
  apply();
  document.addEventListener("DOMContentLoaded", apply);
  setTimeout(apply, 200);
  setTimeout(apply, 800);
})();
