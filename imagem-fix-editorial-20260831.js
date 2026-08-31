/* NOTÍCIA ES - saneamento editorial de imagens automáticas - 31/08/2026 */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  const correcoes = {
    'orcamento-2027-superavit-divida-publica-meta-fiscal': 'https://f.i.uol.com.br/fotografia/2026/08/27/17878637956a90a2f3aa148_1787863795_3x2_md.jpg'
  };

  const ehFallbackLocal = src => /^imagens\/auto-(politica-es|seguranca-publica|politica-nacional)\.svg(?:\?.*)?$/i.test(src || '');
  const ehImagemGenerica = src => /(?:fb_marca\.png|marca[_-]?valor|logo[^/]*valor|valor[^/]*logo)/i.test(src || '');

  noticias.forEach(n => {
    if (!n || !n.automatico) return;

    if (correcoes[n.slug]) {
      n.imagem = correcoes[n.slug];
      n.imagemFallback = null;
      return;
    }

    if (ehFallbackLocal(n.imagem) || ehImagemGenerica(n.imagem)) {
      n.imagem = '';
      n.imagemFallback = null;
      n.imagemInvalida = true;
    }
  });
})();
