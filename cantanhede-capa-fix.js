(function () {
  var capa = "https://noticiaes.com.br/assets/og/elianecantanhede.png";
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
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img").forEach(function (img) {
      var s = img.getAttribute("src") || "";
      if (s.indexOf("HSGOnUpWwAMIi3w") !== -1 || s.indexOf("elianecantanh") !== -1 || s.indexOf("cantanhede-xerife") !== -1) {
        img.src = capa;
      }
    });
  });
})();
