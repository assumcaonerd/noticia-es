/* Capa manual: foto da posse de Lorenzo Pazolini na Prefeitura de Vitória. */
(function () {
  if (typeof noticias === "undefined" || !Array.isArray(noticias)) return;
  const url = "https://vitoria.es.gov.br/recursos/imagens/banco/2025/01/01/135425/normal@2x.jpg";
  noticias.forEach(function (n) {
    if (n.slug === "pazolini-verita-pesquisa-mapa-espirito-santo") {
      n.imagem = url;
      n.imagemX = url;
      n.imagemLargura = 700;
      n.imagemAltura = 467;
      n.legendaImagem = "Lorenzo Pazolini na posse para o segundo mandato em Vitória. Foto: Marcos Salles / Prefeitura de Vitória";
    }
  });
})();
