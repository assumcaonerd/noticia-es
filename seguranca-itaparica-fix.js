/* Garantia de carregamento da matéria de Itaparica na listagem de Segurança Pública. */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  const slug = 'mulher-presa-injuria-racial-desacato-pm-itaparica-vila-velha';
  if (noticias.some(function (n) { return n && n.slug === slug; })) return;

  noticias.unshift({
    id: 2026090701,
    slug: slug,
    titulo: 'Mulher é presa em Itaparica após dizer que não temia o PM porque ele era preto',
    categoria: 'Segurança Pública',
    data: '2026-09-07',
    imagem: 'https://s2-g1.glbimg.com/0BX1oOHXCZX5PYnjwed0bDHQf98=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/F/B/AfDMKKQACmqnsYB3VWYw/img-mulher-presa-gmd-07-09.mov-snapshot-00.11.156.jpg',
    resumo: 'Karla Rodrigues da Silva foi autuada em flagrante por injúria racial e desacato depois de hostilizar soldados da PM na Praia de Itaparica. O boletim registra que ela afirmou não temer o policial por ele ser preto.',
    autor: 'Redação Notícia ES',
    publicadoEm: '2026-09-07T18:20:00-03:00',
    editorial: true
  });
})();
