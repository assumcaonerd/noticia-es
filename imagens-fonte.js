/* Fotos originais das fontes usadas na formulacao da materia */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;
  const fotos = {
    'quaest-expoe-forcas-e-fragilidades-ricardo-pazolini-helder-es':
      'https://f.i.uol.com.br/fotografia/2026/08/27/17878433866a90533ae90ca_1787843386_3x2_xl.jpg'
  };
  noticias.forEach((n) => {
    if (fotos[n.slug]) n.imagem = fotos[n.slug];
  });
})();
