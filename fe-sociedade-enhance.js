/* Especial Fé e Sociedade: imagens diretas fornecidas pelo autor. */
(function () {
  'use strict';

  const slug = 'igreja-crista-maranata-comemora-50-anos-em-sao-mateus';

  const fotos = {
    capa: 'https://i.ibb.co/XZ22GL8F/Whats-App-Image-2026-08-31-at-12-04-00.jpg',
    panoramica: 'https://i.ibb.co/9m61GLMX/Chat-GPT-Image-31-de-ago-de-2026-13-16-16.png',
    historia: 'https://i.ibb.co/QvjTz7Rs/Whats-App-Image-2026-08-31-at-12-03-59.jpg',
    edmar: 'https://noticiaes.com.br/imagens/fe-sociedade/icm-50-edmar.svg',
    jovens: 'https://i.ibb.co/r1bsJpF/Chat-GPT-Image-31-de-ago-de-2026-11-59-57.png',
    pastores: 'https://i.ibb.co/FbmRsG3M/Whats-App-Image-2026-08-31-at-12-02-25.jpg',
    comunicacao: 'https://i.ibb.co/39LwW0m1/equipe-de-comunica-o.png',
    louvor: 'https://i.ibb.co/F2XG96M/Chat-GPT-Image-31-de-ago-de-2026-12-01-26.png'
  };

  const figura = (src, legenda, alt, destaque, papel) =>
    `<figure class="fe-especial-foto${destaque ? ' fe-especial-foto-destaque' : ''}"${papel ? ` data-fe-foto="${papel}"` : ''} style="margin:2rem 0 2.2rem"><img src="${src}" alt="${alt || legenda}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:auto;max-height:none;object-fit:contain;border-radius:16px;background:#fff;display:block"><figcaption style="margin-top:.65rem;color:#68717d;font:italic .92rem/1.45 Georgia,serif;text-align:center">${legenda}</figcaption></figure>`;

  const blocos = {
    panoramica: figura(fotos.panoramica, 'Culto de Glorificação pelos 50 anos da Obra do Senhor em São Mateus reuniu cerca de 700 a 800 irmãos e convidados no Maanaim São Mateus.', 'Vista panorâmica do Culto de Glorificação pelos 50 anos da Igreja Cristã Maranata em São Mateus', true, 'panoramica'),
    historia: figura(fotos.historia, 'Nossa história. Os primeiros jovens da Obra em São Mateus e o templo que o Senhor edificou na cidade.', 'Nossa história: primeiros jovens da Obra e templo da Igreja Cristã Maranata em São Mateus', false, 'historia'),
    edmar: figura(fotos.edmar, 'Pastor Edmar Maia, responsável pela Coordenação da Área de São Mateus.', 'Pastor Edmar Maia, responsável pela Coordenação da Área de São Mateus', false, 'edmar'),
    jovens: figura(fotos.jovens, 'Uma fotografia dos primeiros anos. Jovens que fizeram parte dos primeiros momentos da Obra na cidade, diante do antigo salão da Igreja Cristã Maranata.', 'Jovens diante do antigo salão da Igreja Cristã Maranata em São Mateus', false, 'jovens'),
    pastores: figura(fotos.pastores, 'Pastores da Área de São Mateus no púlpito do Maanaim, durante o Culto de Glorificação.', 'Pastores da Área de São Mateus no púlpito do Maanaim durante o Culto de Glorificação', false, 'pastores'),
    comunicacao: figura(fotos.comunicacao, 'Equipe de comunicação e mídia do Maanaim São Mateus. Da esquerda para a direita: Rodrigo, Vinícius, Hayanne, Junior Lyrio, Rodrigo, Guilherme, Alice e Elizeu. O irmão Junior Lyrio é o responsável pela equipe.', 'Equipe de comunicação e mídia do Maanaim São Mateus', false, 'comunicacao'),
    louvor: figura(fotos.louvor, 'Grupo de Louvor do Polo Maanaim São Mateus, que conduziu a congregação no culto de glorificação.', 'Grupo de Louvor do Polo Maanaim São Mateus', false, 'louvor')
  };

  function enriquecerConteudo(html) {
    if (!html) return html;
    let out = html;

    if (!out.includes(fotos.panoramica) && !out.includes('data-fe-foto="panoramica"')) {
      out = out.replace('<h2>Uma história que atravessou gerações</h2>', blocos.panoramica + blocos.historia + '<h2>Uma história que atravessou gerações</h2>');
    }

    if (!out.includes(fotos.edmar) && !out.includes('data-fe-foto="edmar"')) {
      out = out.replace('A memória daqueles irmãos permanece viva na congregação.</p>', 'A memória daqueles irmãos permanece viva na congregação.</p>' + blocos.edmar);
    }

    if (!out.includes(fotos.jovens) && !out.includes('data-fe-foto="jovens"')) {
      out = out.replace('<p>Uma fotografia daquele tempo vale mais do que um retrato.', blocos.jovens + '<p>Uma fotografia daquele tempo vale mais do que um retrato.');
    }

    if (!out.includes(fotos.pastores) && !out.includes('data-fe-foto="pastores"')) {
      out = out.replace('<p>Estiveram à frente da obra, entre outros, os pastores', blocos.pastores + '<p>Estiveram à frente da obra, entre outros, os pastores');
    }

    if (!out.includes(fotos.comunicacao) && !out.includes('data-fe-foto="comunicacao"')) {
      out = out.replace('<p>A transmissão, as imagens e o registro desta história ficaram a cargo da equipe de comunicação do Maanaim.', blocos.comunicacao + '<p>A transmissão, as imagens e o registro desta história ficaram a cargo da equipe de comunicação do Maanaim.');
    }

    if (!out.includes(fotos.louvor) && !out.includes('data-fe-foto="louvor"')) {
      out = out.replace('<p>O grupo de louvor do Polo Maanaim São Mateus', blocos.louvor + '<p>O grupo de louvor do Polo Maanaim São Mateus');
    }

    return out;
  }

  function garantirEdmarNoDom(corpo) {
    if (!corpo || corpo.querySelector('[data-fe-foto="edmar"]') || corpo.querySelector(`img[src="${fotos.edmar}"]`)) return;
    const paragrafos = [...corpo.querySelectorAll('p')];
    const alvo = paragrafos.find(p => p.textContent.includes('A memória daqueles irmãos permanece viva na congregação.')) ||
                 paragrafos.find(p => p.textContent.includes('O pastor Edmar Maia'));
    if (alvo) alvo.insertAdjacentHTML('afterend', blocos.edmar);
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
    if (!artigo || !corpo) return;

    const meta = artigo.querySelector('.meta');
    if (meta && !artigo.querySelector(`img.materia-imagem[src="${fotos.capa}"]`)) {
      meta.insertAdjacentHTML('afterend', `<img class="materia-imagem" src="${fotos.capa}" alt="50 anos da Igreja Cristã Maranata na Área de São Mateus - ES" referrerpolicy="no-referrer" style="width:100%;height:auto;object-fit:contain">`);
    }

    corpo.innerHTML = enriquecerConteudo(corpo.innerHTML);
    garantirEdmarNoDom(corpo);
    artigo.dataset.feImagens = 'ok';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', melhorarPaginaEstatica);
  else melhorarPaginaEstatica();
})();
