/* Destaque manual: prisão por injúria racial em Itaparica (07/09/2026). */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;
  const slug = 'mulher-presa-injuria-racial-desacato-pm-itaparica-vila-velha';
  const n = noticias.find(function (item) { return item.slug === slug; });
  if (!n) return;
  n.destaque = true;
  n.destaqueAte = '2026-09-09T23:59:59-03:00';
})();
