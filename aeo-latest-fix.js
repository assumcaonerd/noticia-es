/*
 * Notícia ES | Correções de AEO e imagem das matérias mais recentes
 */
(function () {
  'use strict';

  const CONFIG = {
    '/m/sao-mateus-1-bilhao-investimentos-20-empresas-polo-industrial.html': {
      imagem: 'https://saomateus.es.gov.br/uploads/noticias/4ifc1uedlkvg32qzr67nj5soym0wtxpah8b9.PNG?802027669=',
      alt: 'Anúncio de investimentos privados e expansão industrial em São Mateus',
      credito: 'Prefeitura de São Mateus',
      tituloAeo: 'Em resumo',
      itens: [
        ['O que foi anunciado?', 'São Mateus divulgou uma carteira superior a R$ 1,1 bilhão em investimentos privados, com mais de 20 empresas, ampliações industriais e projetos de infraestrutura.'],
        ['Quantos empregos estão previstos?', 'A estimativa divulgada pelo município é de mais de mil empregos diretos, distribuídos conforme o cronograma de implantação de cada empreendimento.'],
        ['Quais setores aparecem no pacote?', 'Os projetos envolvem indústria automotiva, cerâmica, alimentos, petróleo e gás, energia, logística, construção, reciclagem e capacitação profissional.'],
        ['Qual é o maior investimento individual informado?', 'A Termelétrica Urca aparece na relação divulgada com previsão de R$ 350 milhões. A expansão da Marcopolo é indicada com R$ 260 milhões.'],
        ['O valor já está integralmente aplicado?', 'Não. O montante corresponde à soma de projetos anunciados em diferentes fases. A execução depende de cronogramas, licenciamentos e decisões empresariais.']
      ]
    },
    '/m/quilombolas-protesto-br-101-sao-mateus-anexo-3-rio-doce.html': {
      tituloAeo: 'Em resumo',
      itens: [
        ['O que aconteceu?', 'Comunidades quilombolas e povos tradicionais realizaram uma manifestação na BR-101, em São Mateus, cobrando inclusão nas medidas do Anexo 3 do Novo Acordo do Rio Doce.'],
        ['Onde foi o protesto?', 'A mobilização ocorreu na BR-101, nas proximidades do campus da Ufes em São Mateus, no Norte do Espírito Santo.'],
        ['O trânsito ficou bloqueado?', 'Sim. A rodovia chegou a ficar totalmente interditada, depois passou a operar com liberações alternadas e teve o fluxo restabelecido às 10h30.'],
        ['O que é o Anexo 3?', 'É a parte do Novo Acordo do Rio Doce voltada a povos indígenas, comunidades quilombolas e outros povos e comunidades tradicionais, com medidas específicas de reparação e compensação.'],
        ['Qual é a principal reivindicação?', 'Os manifestantes pedem que as comunidades que representam sejam reconhecidas e incluídas no regime específico de reparação previsto pelo Anexo 3.']
      ]
    }
  };

  const cfg = CONFIG[window.location.pathname];

  function aplicarNaHome() {
    const slug = 'sao-mateus-1-bilhao-investimentos-20-empresas-polo-industrial';
    const link = document.querySelector('a[href*="' + slug + '"]');
    if (!link) return;
    const card = link.closest('article') || link.parentElement;
    if (!card) return;
    let img = card.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = CONFIG['/m/' + slug + '.html'].alt;
      img.loading = 'eager';
      link.prepend(img);
    }
    img.src = CONFIG['/m/' + slug + '.html'].imagem;
    img.referrerPolicy = 'no-referrer';
  }

  function aplicarNaMateria() {
    if (!cfg) return;
    const artigo = document.querySelector('.materia-estatica, .materia-wrap');
    if (!artigo) return;

    if (cfg.imagem && !artigo.querySelector('img.materia-capa, img.materia-imagem')) {
      const resumo = artigo.querySelector('.materia-resumo');
      if (resumo) {
        const figure = document.createElement('figure');
        figure.className = 'materia-capa-wrap';
        figure.innerHTML = '<img class="materia-capa" src="' + cfg.imagem + '" alt="' + cfg.alt + '" loading="eager" referrerpolicy="no-referrer"><figcaption>Foto: ' + cfg.credito + '</figcaption>';
        resumo.insertAdjacentElement('afterend', figure);
      }

      let og = document.querySelector('meta[property="og:image"]');
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', 'og:image');
        document.head.appendChild(og);
      }
      og.content = cfg.imagem;

      let tw = document.querySelector('meta[name="twitter:image"]');
      if (!tw) {
        tw = document.createElement('meta');
        tw.setAttribute('name', 'twitter:image');
        document.head.appendChild(tw);
      }
      tw.content = cfg.imagem;
    }

    if (!artigo.querySelector('.aeo-resumo')) {
      const sec = document.createElement('section');
      sec.className = 'aeo-resumo';
      sec.setAttribute('aria-label', 'Resumo da matéria');
      sec.innerHTML = '<h2>' + cfg.tituloAeo + '</h2>' + cfg.itens.map(function (item) {
        return '<div class="aeo-item"><h3>' + item[0] + '</h3><p>' + item[1] + '</p></div>';
      }).join('');
      const conteudo = artigo.querySelector('.conteudo-materia, .materia-conteudo');
      if (conteudo) conteudo.insertAdjacentElement('afterend', sec);
      else artigo.appendChild(sec);
    }

    if (!document.getElementById('aeo-faq-schema')) {
      const schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.id = 'aeo-faq-schema';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: cfg.itens.map(function (item) {
          return {
            '@type': 'Question',
            name: item[0],
            acceptedAnswer: { '@type': 'Answer', text: item[1] }
          };
        })
      });
      document.head.appendChild(schema);
    }
  }

  function executar() {
    if (document.body && document.body.dataset.pagina === 'home') aplicarNaHome();
    aplicarNaMateria();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executar, { once: true });
  } else {
    executar();
  }
})();
