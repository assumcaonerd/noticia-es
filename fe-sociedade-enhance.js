/* Especial Fé e Sociedade: imagens diretas fornecidas pelo autor. */
(function () {
  'use strict';

  const slug = 'igreja-crista-maranata-comemora-50-anos-em-sao-mateus';

  /* Mapeamento confirmado pelos arquivos originais enviados pelo autor. */
  const fotos = {
    capa: 'https://i.ibb.co/XZ22GL8F/Whats-App-Image-2026-08-31-at-12-04-00.jpg',
    panoramica: 'https://i.ibb.co/9m61GLMX/Chat-GPT-Image-31-de-ago-de-2026-13-16-16.png',
    historia: 'https://i.ibb.co/QvjTz7Rs/Whats-App-Image-2026-08-31-at-12-03-59.jpg',
    edmar: 'https://i.ibb.co/MyqNs81M/Chat-GPT-Image-31-de-ago-de-2026-12-40-36.png',
    jovens: 'https://i.ibb.co/r1bsJpF/Chat-GPT-Image-31-de-ago-de-2026-11-59-57.png',
    pastores: 'https://i.ibb.co/FbmRsG3M/Whats-App-Image-2026-08-31-at-12-02-25.jpg',
    comunicacao: 'https://i.ibb.co/39LwW0m1/equipe-de-comunica-o.png',
    louvor: 'https://i.ibb.co/F2XG96M/Chat-GPT-Image-31-de-ago-de-2026-12-01-26.png'
  };

  const figura = (src, legenda, alt, destaque) =>
    `<figure class="fe-especial-foto${destaque ? ' fe-especial-foto-destaque' : ''}" style="margin:2rem 0 2.2rem"><img src="${src}" alt="${alt || legenda}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:auto;max-height:none;object-fit:contain;border-radius:16px;background:#fff;display:block"><figcaption style="margin-top:.65rem;color:#68717d;font:italic .92rem/1.45 Georgia,serif;text-align:center">${legenda}</figcaption></figure>`;

  const blocos = {
    panoramica: figura(
      fotos.panoramica,
      'Culto de Glorificação pelos 50 anos da Obra do Senhor em São Mateus reuniu cerca de 700 a 800 irmãos e convidados no Maanaim São Mateus.',
      'Vista panorâmica do Culto de Glorificação pelos 50 anos da Igreja Cristã Maranata em São Mateus',
      true
    ),
    historia: figura(
      fotos.historia,
      'Nossa história. Os primeiros jovens da Obra em São Mateus e o templo que o Senhor edificou na cidade.',
      'Nossa história: primeiros jovens da Obra e templo da Igreja Cristã Maranata em São Mateus'
    ),
    edmar: figura(
      fotos.edmar,
      'Pastor Edmar Maia, responsável pela Coordenação da Área de São Mateus.',
      'Pastor Edmar Maia, responsável pela Coordenação da Área de São Mateus'
    ),
    jovens: figura(
      fotos.jovens,
      'Uma fotografia dos primeiros anos. Jovens que fizeram parte dos primeiros momentos da Obra na cidade, diante do antigo salão da Igreja Cristã Maranata.',
      'Jovens diante do antigo salão da Igreja Cristã Maranata em São Mateus'
    ),
    pastores: figura(
      fotos.pastores,
      'Pastores da Área de São Mateus no púlpito do Maanaim, durante o Culto de Glorificação.',
      'Pastores da Área de São Mateus no púlpito do Maanaim durante o Culto de Glorificação'
    ),
    comunicacao: figura(
      fotos.comunicacao,
      'Equipe de comunicação e mídia do Maanaim São Mateus. Da esquerda para a direita: Rodrigo, Vinícius, Hayanne, Junior Lyrio, Rodrigo, Guilherme, Alice e Elizeu. O irmão Junior Lyrio é o responsável pela equipe.',
      'Equipe de comunicação e mídia do Maanaim São Mateus'
    ),
    louvor: figura(
      fotos.louvor,
      'Grupo de Louvor do Polo Maanaim São Mateus, que conduziu a congregação no culto de glorificação.',
      'Grupo de Louvor do Polo Maanaim São Mateus'
    )
  };

  function enriquecerConteudo(html) {
    if (!html || html.includes('class="fe-especial-foto"')) return html;
    let out = html;

    out = out.replace(
      '<h2>Uma história que atravessou gerações</h2>',
      blocos.panoramica + blocos.historia + '<h2>Uma história que atravessou gerações</h2>'
    );

    out = out.replace(
      'A memória daqueles irmãos permanece viva na congregação.</p>',
      'A memória daqueles irmãos permanece viva na congregação.</p>' + blocos.edmar
    );

    out = out.replace(
      '<p>Uma fotografia daquele tempo vale mais do que um retrato.',
      blocos.jovens + '<p>Uma fotografia daquele tempo vale mais do que um retrato.'
    );

    out = out.replace(
      '<p>Estiveram à frente da obra, entre outros, os pastores',
      blocos.pastores + '<p>Estiveram à frente da obra, entre outros, os pastores'
    );

    out = out.replace(
      '<p>A transmissão, as imagens e o registro desta história ficaram a cargo da equipe de comunicação do Maanaim.',
      blocos.comunicacao + '<p>A transmissão, as imagens e o registro desta história ficaram a cargo da equipe de comunicação do Maanaim.'
    );

    out = out.replace(
      '<p>O grupo de louvor do Polo Maanaim São Mateus',
      blocos.louvor + '<p>O grupo de louvor do Polo Maanaim São Mateus'
    );

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
    if (meta) meta.insertAdjacentHTML(
      'afterend',
      `<img class="materia-imagem" src="${fotos.capa}" alt="50 anos da Igreja Cristã Maranata na Área de São Mateus - ES" referrerpolicy="no-referrer" style="width:100%;height:auto;object-fit:contain">`
    );
    corpo.innerHTML = enriquecerConteudo(corpo.innerHTML);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', melhorarPaginaEstatica);
  else melhorarPaginaEstatica();
})();
