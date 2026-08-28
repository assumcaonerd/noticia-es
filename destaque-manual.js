/* Destaque editorial temporário com expiração automática. */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  const agora = Date.now();

  function instante(n) {
    const valor = n.publicadoEm || n.publicadaEm || n.coletadoEm || (n.data ? `${n.data}T00:00:00-03:00` : '');
    const t = Date.parse(valor);
    return Number.isFinite(t) ? t : 0;
  }

  noticias.sort((a, b) => instante(b) - instante(a));

  const indiceAtivo = noticias.findIndex(n => n.destaqueAte && Date.parse(n.destaqueAte) > agora);
  if (indiceAtivo > 0) {
    const [destaque] = noticias.splice(indiceAtivo, 1);
    noticias.unshift(destaque);
  }

  const indiceExpirado = noticias.findIndex(n => n.destaqueAte && Date.parse(n.destaqueAte) <= agora);
  if (indiceExpirado === 0 && noticias.length > 1) {
    const [expirado] = noticias.splice(0, 1);
    noticias.splice(1, 0, expirado);
  }
})();
