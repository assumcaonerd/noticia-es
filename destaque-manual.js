/* Ordenação global do portal: matérias mais recentes sempre aparecem primeiro. */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  function instante(n) {
    const valor = n.publicadoEm || n.publicadaEm || n.coletadoEm || (n.data ? `${n.data}T00:00:00-03:00` : '');
    const t = Date.parse(valor);
    return Number.isFinite(t) ? t : 0;
  }

  noticias.sort((a, b) => instante(b) - instante(a));
})();
