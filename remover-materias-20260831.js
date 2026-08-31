/* NOTÍCIA ES - remoções editoriais 31/08/2026 */
(function () {
  if (typeof noticias === "undefined" || !Array.isArray(noticias)) return;
  const removidos = new Set([
    "kremlin-russia-avanco-frente-ucrania-peskov-alegacao",
    "russia-seguranca-europa-peskov-arquitetura-negociacoes"
  ]);
  for (let i = noticias.length - 1; i >= 0; i--) {
    if (removidos.has(noticias[i] && noticias[i].slug)) noticias.splice(i, 1);
  }
})();
