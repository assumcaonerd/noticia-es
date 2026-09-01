/* NOTÍCIA ES - remoções editoriais e deduplicação */
(function () {
  if (typeof noticias === "undefined" || !Array.isArray(noticias)) return;
  const removidos = new Set([
    "kremlin-russia-avanco-frente-ucrania-peskov-alegacao",
    "russia-seguranca-europa-peskov-arquitetura-negociacoes",

    /* Duplicatas: manter 29-candidatos-usam-bolsonaro-nome-urna-eleicoes-2026 */
    "29-candidatos-bolsonaro-nome-urna-eleicoes-2026",
    "29-candidatos-usam-bolsonaro-nome-de-urna-eleicoes-2026",

    /* Duplicata: manter antonio-gobbi-morte-vitoria-contas-bancarias-investigacao */
    "antonio-gobbi-morte-canal-vitoria-investigacao-tentativas-bancarias"
  ]);
  for (let i = noticias.length - 1; i >= 0; i--) {
    if (removidos.has(noticias[i] && noticias[i].slug)) noticias.splice(i, 1);
  }
})();
