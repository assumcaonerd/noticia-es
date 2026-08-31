/* Política de imagem: matéria automática usa somente imagem editorial válida; sem fallback genérico. */
(function () {
  const capas = {
    'Política ES': 'imagens/auto-politica-es.svg',
    'Segurança Pública': 'imagens/auto-seguranca-publica.svg',
    'Política Nacional': 'imagens/auto-politica-nacional.svg',
    'Opinião': 'imagens/auto-politica-nacional.svg',
    'Geral ES': 'imagens/auto-politica-es.svg'
  };

  function ehFonteExterna(src) {
    return /imgur\.com|i\.ibb|twimg|folhavitoria|netdeal|spayce|pleno\.news|uol\.com\.br|glbimg|eshoje|tribunaonline|ebc\.com\.br|metroimg\.com/i.test(src || '');
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
      if (n.automatico) {
        n.imagemFallback = null;
        return;
      }
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

    const card = img.closest('[data-card-link]');
    let n = null;
    if (card && typeof noticias !== 'undefined') {
      const href = card.dataset.cardLink || '';
      const slug = new URL(href, location.href).searchParams.get('slug');
      n = noticias.find(x => x.slug === slug);
    } else if (document.body.dataset.pagina === 'materia') {
      const slug = new URLSearchParams(location.search).get('slug');
      n = typeof noticias !== 'undefined' && noticias.find(x => x.slug === slug);
    }

    if (n && n.automatico) {
      img.style.display = 'none';
      return;
    }

    if (img.dataset.fallbackAplicado) return;
    const fallback = (n && n.imagemFallback) || capas['Política ES'];
    img.dataset.fallbackAplicado = '1';
    img.src = fallback;
  }, true);

  aplicarReferrer(document);
  new MutationObserver(function () { aplicarReferrer(document); })
    .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
})();
