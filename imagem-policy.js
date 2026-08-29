/* Política de imagem: fonte primeiro; capa da categoria em falha/ausência; nunca gerar retrato. */
(function () {
  const capas = {
    'Política ES': 'imagens/auto-politica-es.svg',
    'Segurança Pública': 'imagens/auto-seguranca-publica.svg',
    'Política Nacional': 'imagens/auto-politica-nacional.svg',
    'Opinião': 'imagens/auto-politica-nacional.svg',
    'Geral ES': 'imagens/auto-politica-es.svg'
  };

  function ehFonteExterna(src) {
    return /imgur\.com|i\.ibb|twimg|folhavitoria|netdeal|spayce|pleno\.news|uol\.com\.br|glbimg|eshoje|tribunaonline|ebc\.com\.br/i.test(src || '');
  }

  function aplicarReferrer(root) {
    (root || document).querySelectorAll('img').forEach(function (img) {
      if (ehFonteExterna(img.getAttribute('src') || img.src || '')) {
        img.referrerPolicy = 'no-referrer';
      }
    });
  }

  if (typeof noticias !== 'undefined' && Array.isArray(noticias)) {
    noticias.forEach(n => {
      if (!n.imagem) n.imagem = capas[n.categoria] || capas['Política ES'];
      n.imagemFallback = capas[n.categoria] || capas['Política ES'];
    });
  }

  document.addEventListener('error', function (e) {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    const src = img.getAttribute('src') || img.src || '';
    if (ehFonteExterna(src) && img.referrerPolicy !== 'no-referrer') {
      img.referrerPolicy = 'no-referrer';
      img.src = src;
      return;
    }
    if (img.dataset.fallbackAplicado) return;
    const card = img.closest('[data-card-link]');
    let fallback = capas['Política ES'];
    if (card && typeof noticias !== 'undefined') {
      const href = card.dataset.cardLink || '';
      const slug = new URL(href, location.href).searchParams.get('slug');
      const n = noticias.find(x => x.slug === slug);
      if (n) fallback = n.imagemFallback || fallback;
    } else if (document.body.dataset.pagina === 'materia') {
      const slug = new URLSearchParams(location.search).get('slug');
      const n = typeof noticias !== 'undefined' && noticias.find(x => x.slug === slug);
      if (n) fallback = n.imagemFallback || fallback;
    }
    img.dataset.fallbackAplicado = '1';
    img.src = fallback;
  }, true);

  aplicarReferrer(document);
  new MutationObserver(function () { aplicarReferrer(document); })
    .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
})();
