(function () {
  var capaAnexo = "https://noticiaes.com.br/assets/og/elianecantanhede.png";
  var capaSvg = "https://noticiaes.com.br/assets/og/elianecantanhede.svg";
  var capaColuna = "https://pbs.twimg.com/media/HSGOnUpWwAMIi3w.jpg";
  var slug = "dos-aplausos-ao-cadafalso-a-militante-de-redacao-troca-o-xerife-quando-o-xerife-vira-estorvo";
  var capa = capaColuna;
  if (typeof noticias !== "undefined" && Array.isArray(noticias)) {
    noticias.forEach(function (n) {
      if (n.slug === slug) {
        n.imagem = capa;
        n.imagemX = capa;
      }
    });
  }
})();
