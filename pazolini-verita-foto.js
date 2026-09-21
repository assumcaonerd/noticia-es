/* Capa: posse de Lorenzo Pazolini na Prefeitura de Vitória. */
(function () {
  var url = "https://vitoria.es.gov.br/recursos/imagens/banco/2025/01/01/135425/normal@2x.jpg";
  if (typeof noticias !== "undefined" && Array.isArray(noticias)) {
    noticias.forEach(function (n) {
      if (n.slug === "pazolini-verita-pesquisa-mapa-espirito-santo") {
        n.imagem = url;
        n.imagemX = url;
        n.imagemLargura = 700;
        n.imagemAltura = 467;
        n.legendaImagem = "Lorenzo Pazolini na posse para o segundo mandato em Vitória. Foto: Marcos Salles / Prefeitura de Vitória";
      }
    });
  }
  function aplicar() {
    if (!/pazolini-verita-pesquisa-mapa-espirito-santo/.test(location.pathname + location.search)) return;
    document.querySelectorAll("img").forEach(function (img) {
      var src = img.getAttribute("src") || img.src || "";
      if (/metroimg|prefeito-18/.test(src)) img.src = url;
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", aplicar);
  else aplicar();
})();
