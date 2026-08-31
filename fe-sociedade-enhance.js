/* Especial Fé e Sociedade: imagens hospedadas pelo autor e servidas via Microlink para uso direto em <img>. */
(function () {
  'use strict';

  const slug = 'igreja-crista-maranata-comemora-50-anos-em-sao-mateus';
  const proxy = (url) => 'https://api.microlink.io?url=' + encodeURIComponent(url) + '&embed=image.url';

  /* Ordem correspondente aos links fornecidos para o especial. */
  const fotos = {
    pastores: proxy('https://ibb.co/PvfVQBTn'),
    capa: proxy('https://ibb.co/d4dD0KBd'),
    historia: proxy('https://ibb.co/cStrb5b8'),
    pastor: proxy('https://ibb.co/VY9cPWft'),
    comunicacao: proxy('https://ibb.co/0VhkL6T0'),
    jovens: proxy('https://ibb.co/TqTpQK2C'),
    louvor: proxy('https://ibb.co/tTHcdmBc'),
    panoramica: proxy('https://ibb.co/d4z9psjt'),
    extra: proxy('https://ibb.co/JR1KHY41')
  };

  const figura = (src, legenda, alt) =>
    `<figure class="fe-especial-foto" style="margin:2rem 0 2.2rem"><img src="${src}" alt="${alt || legenda}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:auto;max-height:none;object-fit:contain;border-radius:16px;background:#fff"><figcaption style="margin-top:.65rem;color:#68717d;font:italic .92rem/1.45 Georgia,serif">${legenda}</figcaption></figure>`;

  const blocos = {
    panoramica: figura(fotos.panoramica, 'Culto de Glorificação pelos 50 anos da Obra do Senhor em São Mateus reuniu cerca de 700 a 800 irmãos e convidados no Maanaim São Mateus.', 'Vista panorâmica do culto de glorificação pelos 50 anos da Igreja Cristã Maranata em São Mateus'),
    historia: figura(fotos.historia, 'Registros que preservam a memória dos primeiros anos da Obra do Senhor em São Mateus.', 'Montagem histórica dos 50 anos da Igreja Cristã Maranata em São Mateus'),
    jovens: figura(fotos.jovens, 'A história atravessou gerações: crianças e jovens diante de um dos registros históricos da Igreja Cristã Maranata em São Mateus.', 'Crianças e jovens em registro histórico da Igreja Cristã Maranata em São Mateus'),
    pastor: figura(fotos.pastor, 'Registro feito durante a celebração dos 50 anos da Obra do Senhor na Área de São Mateus.', 'Pastor durante a celebração dos 50 anos da Igreja Cristã Maranata em São Mateus'),
    pastores: figura(fotos.pastores, 'Pastores reunidos à frente durante o Culto de Glorificação no Maanaim São Mateus.', 'Pastores reunidos no culto dos 50 anos da Igreja Cristã Maranata em São Mateus'),
    comunicacao: figura(fotos.comunicacao, 'Equipe de comunicação e mídia do Maanaim São Mateus: Rodrigo, Vinícius, Hayanne, Junior Lyrio, Rodrigo, Guilherme, Alice e Elizeu.', 'Equipe de comunicação e mídia do Maanaim São Mateus'),
    louvor: figura(fotos.louvor, 'Grupo de Louvor do Polo Maanaim São Mateus durante a celebração histórica.', 'Grupo de Louvor do Polo Maanaim São Mateus'),
    extra: figura(fotos.extra, 'Mais um registro da noite de gratidão e comunhão que marcou os 50 anos da Obra do Senhor em São Mateus.', 'Registro da celebração dos 50 anos da Igreja Cristã Maranata em São Mateus')
  };

  function enriquecerConteudo(html) {
    if (!html || html.includes('class="fe-especial-foto"')) return html;
    let out = html;
    out = out.replace('<h2>Uma história que atravessou gerações</h2>', blocos.panoramica + '<h2>Uma história que atravessou gerações</h2>');
    out = out.replace('<p>Uma fotografia daquele tempo vale mais do que um retrato.', blocos.historia + blocos.jovens + '<p>Uma fotografia daquele tempo vale mais do que um retrato.');
    out = out.replace('<h2>A mensagem do Conselho Presbiteral</h2>', blocos.pastor + '<h2>A mensagem do Conselho Presbiteral</h2>');
    out = out.replace('<h2>Irmãos, pastores e visitantes</h2>', blocos.pastores + '<h2>Irmãos, pastores e visitantes</h2>');
    out = out.replace('<h2>Quem serviu para que a noite acontecesse</h2>', blocos.comunicacao + '<h2>Quem serviu para que a noite acontecesse</h2>');
    out = out.replace('<p>O grupo de louvor do Polo Maanaim São Mateus', blocos.louvor + '<p>O grupo de louvor do Polo Maanaim São Mateus');
    out = out.replace('<h2>O Senhor nos trouxe até aqui</h2>', blocos.extra + '<h2>O Senhor nos trouxe até aqui</h2>');
    return out;
  }

  /* Home e página dinâmica noticia.html */
  if (typeof noticias !== 'undefined' && Array.isArray(noticias)) {
    const materia = noticias.find(n => n && n.slug === slug);
    if (materia) {
      materia.imagem = fotos.capa;
      materia.conteudo = enriquecerConteudo(materia.conteudo);
    }
  }

  /* Página estática /m/ do especial */
  function melhorarPaginaEstatica() {
    if (!location.pathname.includes('/m/' + slug + '.html')) return;
    const artigo = document.querySelector('.materia-artigo');
    const corpo = document.querySelector('.materia-conteudo');
    if (!artigo || !corpo || artigo.dataset.feImagens === 'ok') return;
    artigo.dataset.feImagens = 'ok';

    const meta = artigo.querySelector('.meta');
    if (meta) meta.insertAdjacentHTML('afterend', `<img class="materia-imagem" src="${fotos.capa}" alt="50 anos da Igreja Cristã Maranata na Área de São Mateus - ES" referrerpolicy="no-referrer">`);
    corpo.innerHTML = enriquecerConteudo(corpo.innerHTML);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', melhorarPaginaEstatica);
  else melhorarPaginaEstatica();
})();
