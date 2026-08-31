/* Especial Fé e Sociedade: imagens diretas fornecidas pelo autor. */
(function () {
  'use strict';

  const slug = 'igreja-crista-maranata-comemora-50-anos-em-sao-mateus';

  const fotos = {
    pastores: 'https://i.ibb.co/XxgBrfg1/Whats-App-Image-2026-08-31-at-10-59-10.jpg',
    capa: 'https://i.ibb.co/FbmRsG3M/Whats-App-Image-2026-08-31-at-12-02-25.jpg',
    historia: 'https://i.ibb.co/21ctMHPv/Whats-App-Image-2026-08-31-at-12-02-26.jpg',
    pastor: 'https://i.ibb.co/XZ22GL8F/Whats-App-Image-2026-08-31-at-12-04-00.jpg',
    extra1: 'https://i.ibb.co/QvjTz7Rs/Whats-App-Image-2026-08-31-at-12-03-59.jpg',
    extra2: 'https://i.ibb.co/MyqNs81M/Chat-GPT-Image-31-de-ago-de-2026-12-40-36.png',
    comunicacao: 'https://i.ibb.co/39LwW0m1/equipe-de-comunica-o.png',
    jovens: 'https://i.ibb.co/r1bsJpF/Chat-GPT-Image-31-de-ago-de-2026-11-59-57.png',
    louvor: 'https://i.ibb.co/F2XG96M/Chat-GPT-Image-31-de-ago-de-2026-12-01-26.png',
    panoramica: 'https://i.ibb.co/9m61GLMX/Chat-GPT-Image-31-de-ago-de-2026-13-16-16.png'
  };

  const figura = (src, legenda, alt, destaque) =>
    `<figure class="fe-especial-foto${destaque ? ' fe-especial-foto-destaque' : ''}" style="margin:2rem 0 2.2rem"><img src="${src}" alt="${alt || legenda}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:auto;max-height:none;object-fit:contain;border-radius:16px;background:#fff;display:block"><figcaption style="margin-top:.65rem;color:#68717d;font:italic .92rem/1.45 Georgia,serif">${legenda}</figcaption></figure>`;

  const blocos = {
    panoramica: figura(fotos.panoramica, 'Culto de Glorificação pelos 50 anos da Obra do Senhor em São Mateus reuniu cerca de 700 a 800 irmãos e convidados no Maanaim São Mateus.', 'Vista panorâmica do culto de glorificação pelos 50 anos da Igreja Cristã Maranata em São Mateus', true),
    historia: figura(fotos.historia, 'Registros históricos ajudam a contar a trajetória da Obra do Senhor em São Mateus ao longo de cinco décadas.', 'Montagem histórica dos 50 anos da Igreja Cristã Maranata em São Mateus'),
    jovens: figura(fotos.jovens, 'Novas gerações também fazem parte da história construída pelo Senhor na Área de São Mateus.', 'Crianças e jovens diante da Igreja Cristã Maranata em São Mateus'),
    pastor: figura(fotos.pastor, 'O pastor que trouxe a mensagem da noite durante a celebração dos 50 anos da Obra do Senhor na Área de São Mateus.', 'Pastor durante a celebração dos 50 anos da Igreja Cristã Maranata em São Mateus'),
    pastores: figura(fotos.pastores, 'Pastores e irmãos participaram da celebração dos 50 anos da Igreja Cristã Maranata em São Mateus.', 'Pastores reunidos no culto dos 50 anos da Igreja Cristã Maranata em São Mateus'),
    comunicacao: figura(fotos.comunicacao, 'Equipe de comunicação e mídia do Maanaim São Mateus: Rodrigo, Vinícius, Hayanne, Junior Lyrio, Rodrigo, Guilherme, Alice e Elizeu.', 'Equipe de comunicação e mídia do Maanaim São Mateus'),
    louvor: figura(fotos.louvor, 'Grupo de Louvor do Polo Maanaim São Mateus participou do Culto de Glorificação.', 'Grupo de Louvor do Polo Maanaim São Mateus'),
    extra1: figura(fotos.extra1, 'Mais um registro da noite de gratidão, comunhão e glorificação pelos 50 anos da Obra do Senhor em São Mateus.', 'Registro complementar da celebração dos 50 anos da Igreja Cristã Maranata em São Mateus'),
    extra2: figura(fotos.extra2, 'A celebração reuniu irmãos de São Mateus, Conceição da Barra, Jaguaré e Pedro Canário em uma só comunhão.', 'Registro complementar do culto dos 50 anos da Igreja Cristã Maranata em São Mateus')
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
    out = out.replace('<h2>O Senhor nos trouxe até aqui</h2>', blocos.extra1 + blocos.extra2 + '<h2>O Senhor nos trouxe até aqui</h2>');
    return out;
  }

  if (typeof noticias !== 'undefined' && Array.isArray(noticias)) {
    const materia = noticias.find(n => n && n.slug === slug);
    if (materia) {
      materia.imagem = fotos.capa;
      materia.conteudo = enriquecerConteudo(materia.conteudo);
    }
  }

  function melhorarPaginaEstatica() {
    if (!location.pathname.includes('/m/' + slug + '.html')) return;
    const artigo = document.querySelector('.materia-artigo');
    const corpo = document.querySelector('.materia-conteudo');
    if (!artigo || !corpo || artigo.dataset.feImagens === 'ok') return;
    artigo.dataset.feImagens = 'ok';

    const meta = artigo.querySelector('.meta');
    if (meta) meta.insertAdjacentHTML('afterend', `<img class="materia-imagem" src="${fotos.capa}" alt="50 anos da Igreja Cristã Maranata na Área de São Mateus - ES" referrerpolicy="no-referrer" style="width:100%;height:auto;object-fit:contain">`);
    corpo.innerHTML = enriquecerConteudo(corpo.innerHTML);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', melhorarPaginaEstatica);
  else melhorarPaginaEstatica();
})();
