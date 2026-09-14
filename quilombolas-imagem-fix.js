(function () {
  'use strict';
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  const slug = 'quilombolas-protesto-br-101-sao-mateus-anexo-3-rio-doce';
  const imagem = 'https://files.ndeal.app/api/images/proxy?quality=100&src=https%3A%2F%2Fwww.netdeal.com.br%2Fapi%2Fimages%2Fproducao.spayce.com.br%2F1788794901676_whatsapp_image_2026_09_07_at_10.jpeg';
  const noticia = noticias.find(function (item) { return item.slug === slug; });
  if (noticia) noticia.imagem = imagem;
})();
