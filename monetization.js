(function () {
  'use strict';

  function carregarConfiguracao() {
    return new Promise(function (resolve) {
      if (window.NOTICIAES_MONETIZATION) return resolve();
      const config = document.createElement('script');
      config.src = '/monetization-config.js?v=20261016-flaviometro';
      config.onload = resolve;
      config.onerror = resolve;
      document.head.appendChild(config);
    });
  }

  function ativarAdSense() {
    const cfg = window.NOTICIAES_MONETIZATION || {};
    const campanha = cfg.directCampaign || {};
    if (campanha.active && campanha.takeover) return;
    const client = String(cfg.adsenseClient || '').trim();
    if (!/^ca-pub-\d{16}$/.test(client) || document.querySelector('script[data-nes-adsense]')) return;
    const tag = document.createElement('script');
    tag.async = true;
    tag.dataset.nesAdsense = 'true';
    tag.crossOrigin = 'anonymous';
    tag.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
    document.head.appendChild(tag);
  }

  const paineisPolymarket = [];
  let consultaPolymarketEmCurso = false;
  let ultimoPolymarket = null;

  function blocoPolymarket(posicao) {
    if (!document.getElementById('nes-polymarket-style')) {
      const style = document.createElement('style');
      style.id = 'nes-polymarket-style';
      style.textContent = '.nes-poly{box-sizing:border-box;width:100%;max-width:750px;height:155px;min-height:155px;margin:26px auto;padding:10px 14px;border:1px solid #34465f;border-radius:12px;background:#121e30;color:#fff;text-align:left;font:12px/1.3 Arial,sans-serif;clear:both}.nes-poly *{box-sizing:border-box}.nes-poly h2{margin:0 0 4px!important;color:#ffd500!important;font:700 15px/1.2 Arial,sans-serif!important}.nes-poly-note{margin:0 0 7px!important;font:10px/1.25 Arial,sans-serif!important;color:#d9e6f5}.nes-poly-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nes-poly-card{padding:7px 10px;border-radius:8px;background:#1a2a3e;min-width:0}.nes-poly-person{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;min-height:25px}.nes-poly-person span{min-width:0}.nes-poly .nes-poly-person img{width:25px!important;height:25px!important;min-width:25px!important;max-width:25px!important;min-height:25px!important;max-height:25px!important;flex:0 0 25px!important;border-radius:50%;object-fit:cover!important;aspect-ratio:1!important;margin:0!important}.nes-poly-value{display:block;margin:2px 0;color:#ffd500;font-size:22px;line-height:1.05}.nes-poly-track{height:4px;border-radius:4px;background:#3c4b61;overflow:hidden}.nes-poly-fill{height:100%;width:0;background:#27c495;transition:width .3s}.nes-poly-footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:3px;margin-top:6px;font-size:9px;color:#d9e6f5}.nes-poly a{color:#a7ddff;text-decoration:underline}@media(max-width:480px){.nes-poly{padding:8px;margin:18px auto;height:155px;min-height:155px}.nes-poly-note{font-size:8px!important;margin-bottom:5px!important}.nes-poly-footer{font-size:8px;line-height:1.2;margin-top:4px}.nes-poly-person span{font-size:9px;line-height:1.1}.nes-poly h2{font-size:13px!important}.nes-poly-grid{gap:6px}.nes-poly-card{padding:7px}.nes-poly-person{font-size:10px;gap:4px}.nes-poly .nes-poly-person img{width:23px!important;height:23px!important;min-width:23px!important;max-width:23px!important;min-height:23px!important;max-height:23px!important;flex-basis:23px!important}.nes-poly-value{font-size:21px}}';
      document.head.appendChild(style);
    }
    const box = document.createElement('aside');
    box.className = 'nes-poly nes-poly-' + posicao;
    box.setAttribute('aria-label', 'Probabilidades da eleição presidencial na Polymarket');
    box.innerHTML = '<h2>PRESIDÊNCIA 2026 · POLYMARKET</h2><p class="nes-poly-note">Probabilidades de vitória no mercado de previsões. Não representam intenção de voto nem resultado oficial do TSE.</p><div class="nes-poly-grid"></div><div class="nes-poly-footer"><span class="nes-poly-status" role="status">Consultando Polymarket…</span><a href="https://polymarket.com/event/brazil-presidential-election" target="_blank" rel="noopener noreferrer">Fonte: Polymarket</a></div>';
    ['Flávio Bolsonaro', 'Luiz Inácio Lula da Silva'].forEach(function (nome) {
      const card = document.createElement('div');
      card.className = 'nes-poly-card';
      card.dataset.candidato = nome;
      card.innerHTML = '<div class="nes-poly-person"><img alt="" hidden><span></span></div><strong class="nes-poly-value">…</strong><div class="nes-poly-track"><div class="nes-poly-fill"></div></div>';
      card.querySelector('span').textContent = nome;
      box.querySelector('.nes-poly-grid').appendChild(card);
    });
    paineisPolymarket.push(box);
    if (ultimoPolymarket) renderizarPolymarket(ultimoPolymarket);
    if (paineisPolymarket.length === 1) {
      carregarCopiaPolymarket();
      atualizarPolymarket();
      setInterval(function () { if (!document.hidden) atualizarPolymarket(); }, 15000);
      document.addEventListener('visibilitychange', function () { if (!document.hidden) atualizarPolymarket(); });
    }
    return box;
  }

  function renderizarPolymarket(dados) {
    paineisPolymarket.forEach(function (box) {
      dados.candidatos.forEach(function (candidato) {
        const card = Array.from(box.querySelectorAll('.nes-poly-card')).find(function (el) { return el.dataset.candidato === candidato.nome; });
        if (!card) return;
        card.querySelector('.nes-poly-value').textContent = candidato.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
        card.querySelector('.nes-poly-fill').style.width = candidato.percentual + '%';
        if (candidato.foto) {
          const img = card.querySelector('img');
          img.src = candidato.foto;
          img.hidden = false;
          img.onerror = function () { this.hidden = true; };
        }
      });
      box.querySelector('.nes-poly-status').textContent = 'Atualização a cada 15 s. Consultado em ' + new Date(dados.consultado).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ' (Brasília).';
    });
  }

  async function carregarCopiaPolymarket() {
    const fontes = ['/polymarket-dados.json?v=' + Date.now(), 'https://raw.githubusercontent.com/assumcaonerd/noticia-es/main/polymarket-dados.json?v=' + Date.now()];
    const resultados = await Promise.allSettled(fontes.map(async function (url) {
      const resposta = await fetch(url, { credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(7000) });
      if (!resposta.ok) throw new Error('Cópia indisponível');
      const dados = await resposta.json();
      if (!Number.isFinite(dados.consultado) || !Array.isArray(dados.candidatos) || dados.candidatos.length !== 2 ||
          dados.candidatos.some(function (c) { return !['Flávio Bolsonaro', 'Luiz Inácio Lula da Silva'].includes(c.nome) || !Number.isFinite(c.percentual) || c.percentual < 0 || c.percentual > 100; })) throw new Error('Cópia inválida');
      return dados;
    }));
    const copias = resultados.filter(function (r) { return r.status === 'fulfilled'; }).map(function (r) { return r.value; });
    copias.sort(function (a, b) { return b.consultado - a.consultado; });
    if (!copias.length) return false;
    if (!ultimoPolymarket || copias[0].consultado > ultimoPolymarket.consultado) {
      ultimoPolymarket = copias[0];
      renderizarPolymarket(ultimoPolymarket);
    }
    return true;
  }

  async function atualizarPolymarket() {
    if (consultaPolymarketEmCurso) return;
    consultaPolymarketEmCurso = true;
    const controller = new AbortController();
    const timeout = setTimeout(function () { controller.abort(); }, 10000);
    try {
      const resposta = await fetch('https://gamma-api.polymarket.com/events/slug/brazil-presidential-election?_nes=' + Date.now(), { signal: controller.signal, credentials: 'omit', cache: 'no-store' });
      if (!resposta.ok) throw new Error('Polymarket indisponível');
      const evento = await resposta.json();
      const candidatos = ['Flávio Bolsonaro', 'Luiz Inácio Lula da Silva'].map(function (nome) {
        const mercado = (evento.markets || []).find(function (m) { return m.groupItemTitle === nome; });
        if (!mercado) throw new Error('Candidato ausente');
        const outcomes = typeof mercado.outcomes === 'string' ? JSON.parse(mercado.outcomes) : mercado.outcomes;
        const prices = typeof mercado.outcomePrices === 'string' ? JSON.parse(mercado.outcomePrices) : mercado.outcomePrices;
        const indice = outcomes.findIndex(function (o) { return /^(yes|sim)$/i.test(o); });
        const percentual = Number(prices[indice]) * 100;
        if (indice < 0 || !Number.isFinite(percentual) || percentual < 0 || percentual > 100) throw new Error('Preço inválido');
        const foto = /^https:\/\//.test(mercado.icon || '') ? mercado.icon : '';
        return { nome: nome, percentual: percentual, foto: foto };
      });
      ultimoPolymarket = { candidatos: candidatos, consultado: Date.now() };
      renderizarPolymarket(ultimoPolymarket);
    } catch (e) {
      await carregarCopiaPolymarket();
      paineisPolymarket.forEach(function (box) {
        box.querySelector('.nes-poly-status').textContent = ultimoPolymarket ? 'Últimos dados disponíveis, coletados em ' + new Date(ultimoPolymarket.consultado).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ' (Brasília).' : 'Dados temporariamente indisponíveis. Nova tentativa automática.';
      });
    } finally {
      clearTimeout(timeout);
      consultaPolymarketEmCurso = false;
    }
  }

  function blocoDireto(posicao) {
    if (posicao === 'meio-materia' || posicao === 'fim-materia') return blocoPolymarket(posicao);
    const box = document.createElement('aside');
    box.className = 'ad-space ad-space-' + posicao;
    box.setAttribute('aria-label', 'Publicidade');

    const cfg = window.NOTICIAES_MONETIZATION || {};
    const campanha = cfg.directCampaign || {};

    if (campanha.active && campanha.image) {
      const rotulo = document.createElement('span');
      rotulo.className = 'ad-label';
      rotulo.textContent = 'Publicidade';
      box.appendChild(rotulo);

      const temLink = /^https?:\/\//i.test(String(campanha.href || ''));
      const suporte = document.createElement(temLink ? 'a' : 'div');
      suporte.className = 'campaign-ad';
      if (temLink) {
        suporte.href = campanha.href;
        suporte.target = '_blank';
        suporte.rel = 'sponsored noopener noreferrer';
        suporte.setAttribute('aria-label', campanha.linkLabel || ('Abrir oferta ' + (campanha.name || 'do anunciante')));
      }

      const img = document.createElement('img');
      img.src = campanha.image;
      img.alt = campanha.alt || campanha.name || 'Publicidade';
      img.width = Number(campanha.width) || 750;
      img.height = Number(campanha.height) || 155;
      img.loading = posicao === 'home-topo' ? 'eager' : 'lazy';
      img.decoding = 'async';
      suporte.appendChild(img);
      box.appendChild(suporte);
      return box;
    }

    box.innerHTML = '<span class="ad-label">Publicidade</span>' +
      '<a class="direct-ad" href="/anuncie.html?posicao=' + encodeURIComponent(posicao) + '">' +
      '<span><strong>Anuncie no Notícia ES</strong><span>Divulgue sua marca para leitores do Espírito Santo</span></span></a>';
    return box;
  }

  function inserirEspacos() {
    if (document.body.dataset.noAds === 'true') return;

    const materia = document.querySelector('.conteudo-materia, .materia-conteudo');
    if (materia) {
      if (materia.dataset.adsInserted === 'true') return;
      materia.dataset.adsInserted = 'true';

      const paragrafos = Array.from(materia.querySelectorAll('p'));
      if (paragrafos.length >= 2) {
        const indiceMeio = Math.min(Math.max(2, Math.floor(paragrafos.length / 2)), paragrafos.length - 1);
        paragrafos[indiceMeio].after(blocoDireto('meio-materia'));
      } else if (materia.children.length) {
        materia.children[Math.floor(materia.children.length / 2)].after(blocoDireto('meio-materia'));
      } else {
        materia.appendChild(blocoDireto('meio-materia'));
      }
      materia.appendChild(blocoDireto('fim-materia'));
      return;
    }

    const hero = document.querySelector('.hero-area');
    if (hero) {
      document.querySelectorAll('.anuncio-topo, .ad-space-home-topo').forEach(function (el) { el.remove(); });
      hero.after(blocoDireto('home-topo'));
    }
  }

  function completarNavegacaoERodape() {
    document.querySelectorAll('.nav-principal ul').forEach(function (lista) {
      if (!document.body.matches('[data-no-ads="true"]') && !lista.querySelector('a[href*="categoria=economia"]')) {
        const itemEconomia = document.createElement('li');
        itemEconomia.innerHTML = '<a href="/index.html?categoria=economia" data-categoria="economia">Economia</a>';
        const opiniao = Array.from(lista.querySelectorAll('a')).find(function (link) {
          return link.getAttribute('href')?.includes('categoria=opiniao');
        });
        if (opiniao && opiniao.parentElement) lista.insertBefore(itemEconomia, opiniao.parentElement);
        else lista.appendChild(itemEconomia);
      }
      if (!lista.querySelector('a[href*="anuncie"]')) {
        const item = document.createElement('li');
        item.innerHTML = '<a href="/anuncie.html">Anuncie</a>';
        lista.appendChild(item);
      }
    });

    document.querySelectorAll('.site-footer .container').forEach(function (footer) {
      if (footer.querySelector('.footer-links')) return;
      const links = document.createElement('nav');
      links.className = 'footer-links';
      links.setAttribute('aria-label', 'Informações institucionais');
      links.innerHTML = '<a href="/sobre.html">Sobre</a><a href="/sobre.html#expediente">Expediente</a>' +
        '<a href="/contato.html">Contato</a><a href="/anuncie.html">Anuncie</a>' +
        '<a href="/politica-de-privacidade.html">Privacidade</a><a href="/termos-de-uso.html">Termos</a>';
      footer.appendChild(links);
    });
  }

  function aplicarConsentimento(analytics, ads) {
    const escolha = { analytics: !!analytics, ads: !!ads, updatedAt: new Date().toISOString() };
    try { localStorage.setItem('nes_privacy_consent', JSON.stringify(escolha)); } catch (e) {}
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: escolha.analytics ? 'granted' : 'denied',
        ad_storage: escolha.ads ? 'granted' : 'denied',
        ad_user_data: escolha.ads ? 'granted' : 'denied',
        ad_personalization: escolha.ads ? 'granted' : 'denied'
      });
    }
  }

  function mostrarConsentimento() {
    try { if (localStorage.getItem('nes_privacy_consent')) return; } catch (e) {}
    const banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de privacidade');
    banner.innerHTML = '<p><strong>Sua privacidade</strong><br>Usamos dados de navegação para medir audiência e, quando autorizado, exibir publicidade. Leia a <a href="/politica-de-privacidade.html">Política de Privacidade</a>.</p>' +
      '<div class="cookie-actions"><button type="button" data-cookie="essential">Somente essenciais</button>' +
      '<button type="button" class="cookie-accept" data-cookie="accept">Aceitar</button></div>';
    banner.addEventListener('click', function (event) {
      const escolha = event.target && event.target.dataset.cookie;
      if (!escolha) return;
      aplicarConsentimento(escolha === 'accept', escolha === 'accept');
      banner.remove();
    });
    document.body.appendChild(banner);
  }

  function iniciar() {
    completarNavegacaoERodape();
    mostrarConsentimento();
    carregarConfiguracao().then(function () {
      inserirEspacos();
      ativarAdSense();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  else iniciar();
})();
