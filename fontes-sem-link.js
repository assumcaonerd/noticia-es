/* Regra editorial: citar fonte, não publicar o URL. */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  function semAnchor(html) {
    return String(html).replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
  }

  function limpar(html) {
    if (!html) return html;
    let out = String(html);
    const idx = out.search(/<h2[^>]*>\s*Fontes da apura[cç][aã]o/i);
    if (idx >= 0) out = out.slice(0, idx) + semAnchor(out.slice(idx));
    out = out.replace(
      /(<p>\s*<strong>\s*Fonte:\s*<\/strong>\s*)<a\b[^>]*>([\s\S]*?)<\/a>/gi,
      '$1$2'
    );
    return out;
  }

  noticias.forEach(function (n) {
    if (n.conteudo) n.conteudo = limpar(n.conteudo);
  });
})();
