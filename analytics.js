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
