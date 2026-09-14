(function () {
  'use strict';

  function carregarConfiguracao() {
    return new Promise(function (resolve) {
      if (window.NOTICIAES_MONETIZATION) return resolve();
      const config = document.createElement('script');
      config.src = '/monetization-config.js?v=20260911-1';
      config.onload = resolve;
      config.onerror = resolve;
      document.head.appendChild(config);
    });
  }

  function ativarAdSense() {
    const cfg = window.NOTICIAES_MONETIZATION || {};
    const client = String(cfg.adsenseClient || '').trim();
    if (!/^ca-pub-\d{16}$/.test(client) || document.querySelector('script[data-nes-adsense]')) return;
    const tag = document.createElement('script');
    tag.async = true;
    tag.dataset.nesAdsense = 'true';
    tag.crossOrigin = 'anonymous';
    tag.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
    document.head.appendChild(tag);
  }

  function blocoDireto(posicao) {
    const box = document.createElement('aside');
    box.className = 'ad-space ad-space-' + posicao;
    box.setAttribute('aria-label', 'Publicidade');
    box.innerHTML = '<span class="ad-label">Publicidade</span>' +
      '<a class="direct-ad" href="/anuncie.html?posicao=' + encodeURIComponent(posicao) + '">' +
      '<span><strong>Anuncie no Notícia ES</strong><span>Divulgue sua marca para leitores do Espírito Santo</span></span></a>';
    return box;
  }

  function inserirEspacos() {
    if (document.body.dataset.noAds === 'true') return;

    const materia = document.querySelector('.conteudo-materia, .materia-conteudo');
    if (materia) {
      const paragrafos = materia.querySelectorAll(':scope > p');
      if (paragrafos.length >= 3) paragrafos[Math.min(3, paragrafos.length - 1)].after(blocoDireto('meio-materia'));
      materia.appendChild(blocoDireto('fim-materia'));
      return;
    }

    const hero = document.querySelector('.hero-area');
    if (hero) hero.after(blocoDireto('home-topo'));
  }

  function completarNavegacaoERodape() {
    document.querySelectorAll('.nav-principal ul').forEach(function (lista) {
      if (!lista.querySelector('a[href*="categoria=economia"]')) {
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
      links.innerHTML = '<a href="/sobre.html">Sobre</a><a href="/expediente.html">Expediente</a>' +
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
    inserirEspacos();
    mostrarConsentimento();
    carregarConfiguracao().then(ativarAdSense);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  else iniciar();
})();
