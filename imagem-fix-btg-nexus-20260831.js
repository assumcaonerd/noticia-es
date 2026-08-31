/* Correção específica de imagem da matéria BTG/Nexus de 31/08/2026. Sem fallback. */
(function () {
  const slug = 'btg-nexus-lula-flavio-empate-tecnico-segundo-turno-31-agosto-2026';
  const imagemEditorial = 'https://images.metroimg.com/2026/06/lula-flaviojpg.jpeg';

  function paginaAlvo() {
    return location.pathname.includes(slug) || new URLSearchParams(location.search).get('slug') === slug;
  }

  function aplicar() {
    if (typeof noticias !== 'undefined' && Array.isArray(noticias)) {
      const n = noticias.find(x => x.slug === slug);
      if (n) {
        n.imagem = imagemEditorial;
        n.imagemFallback = null;
      }
    }

    if (!paginaAlvo()) return;
    document.querySelectorAll('img').forEach(function (img) {
      const src = img.getAttribute('src') || img.src || '';
      if (/auto-politica-nacional\.svg|metroimg\.com/i.test(src)) {
        img.referrerPolicy = 'no-referrer';
        img.style.display = '';
        if (src !== imagemEditorial) img.src = imagemEditorial;
      }
    });
  }

  aplicar();
  document.addEventListener('DOMContentLoaded', aplicar);
  new MutationObserver(aplicar).observe(document.documentElement, { childList: true, subtree: true });
})();
