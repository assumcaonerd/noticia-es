/*
 * Notícia ES | Google Analytics 4
 */
(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-03KKXJHR1K';
  const id = String(MEASUREMENT_ID || '').trim().toUpperCase();
  const configurado = /^G-[A-Z0-9]+$/.test(id);

  window.NOTICIAES_ANALYTICS = {
    ready: false,
    measurementId: configurado ? id : null
  };

  if (!configurado) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  // Consentimento negado por padrão até a escolha do visitante.
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  try {
    const escolha = JSON.parse(localStorage.getItem('nes_privacy_consent') || 'null');
    if (escolha && escolha.analytics) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    if (escolha && escolha.ads) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }
  } catch (e) {
    // O site permanece funcional mesmo se o armazenamento local estiver bloqueado.
  }

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(tag);

  window.gtag('js', new Date());
  window.gtag('config', id, {
    send_page_view: true
  });

  window.NOTICIAES_ANALYTICS.ready = true;

  window.noticiaesTrack = function (eventName, params) {
    if (!eventName || !window.NOTICIAES_ANALYTICS.ready) return;
    window.gtag('event', String(eventName), params || {});
  };
})();

/*
 * Camada única de monetização, publicidade direta e privacidade.
 * Carregada em todas as páginas que já usam o Analytics.
 */
(function () {
  'use strict';
  if (window.NOTICIAES_MONETIZATION_LOADED) return;
  window.NOTICIAES_MONETIZATION_LOADED = true;
  const script = document.createElement('script');
  script.src = '/monetization.js?v=20260911-1';
  script.defer = true;
  document.head.appendChild(script);
})();

/*
 * Compartilhamento das matérias.
 */
(function () {
  'use strict';

  if (!window.NOTICIAES_SHARE_BAR_LOADED) {
    window.NOTICIAES_SHARE_BAR_LOADED = true;
    const script = document.createElement('script');
    script.src = '/share-bar.js?v=20260907-1';
    script.async = true;
    document.head.appendChild(script);
  }

  if (!window.NOTICIAES_AEO_LATEST_FIX_LOADED) {
    window.NOTICIAES_AEO_LATEST_FIX_LOADED = true;
    const aeo = document.createElement('script');
    aeo.src = '/aeo-latest-fix.js?v=20260908-1';
    aeo.async = true;
    document.head.appendChild(aeo);
  }
})();

/*
 * Correção de capa para matéria estática dos quilombolas.
 */
(function () {
  'use strict';

  const slug = '/m/quilombolas-protesto-br-101-sao-mateus-anexo-3-rio-doce.html';
  if (window.location.pathname !== slug) return;

  const imagem = 'https://files.ndeal.app/api/images/proxy?quality=100&src=https%3A%2F%2Fwww.netdeal.com.br%2Fapi%2Fimages%2Fproducao.spayce.com.br%2F1788794901676_whatsapp_image_2026_09_07_at_10.jpeg';

  function inserirImagem() {
    const artigo = document.querySelector('.materia-estatica');
    if (!artigo || artigo.querySelector('img.materia-capa')) return;

    const resumo = artigo.querySelector('.materia-resumo');
    if (!resumo) return;

    const figure = document.createElement('figure');
    figure.className = 'materia-capa-wrap';
    figure.innerHTML = '<img class="materia-capa" src="' + imagem + '" alt="Manifestação de comunidades quilombolas e povos tradicionais na BR-101, em São Mateus" loading="eager" referrerpolicy="no-referrer"><figcaption>Manifestação na BR-101, em São Mateus. Foto: Oziel Gabriel</figcaption>';
    resumo.insertAdjacentElement('afterend', figure);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inserirImagem, { once: true });
  } else {
    inserirImagem();
  }
})();
