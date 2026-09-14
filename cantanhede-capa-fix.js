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
        n.legendaImagem = "Dos aplausos ao cadafalso: a militante de redação troca o xerife quando o xerife vira estorvo";
      }
    });
  }
  function apply() {
    document.querySelectorAll("img").forEach(function (img) {
      var s = img.getAttribute("src") || "";
      if (
        s.indexOf("HSGOnUp") !== -1 ||
        s.indexOf("elianecantan") !== -1 ||
        (img.className || "").indexOf("materia-capa") !== -1
      ) {
        if (img.src !== capa) img.src = capa;
      }
    });
  }
  apply();
  document.addEventListener("DOMContentLoaded", apply);
  setTimeout(apply, 150);
  setTimeout(apply, 700);
})();
