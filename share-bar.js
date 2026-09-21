/*
 * Notícia ES | Barra lateral de compartilhamento
 */
(function () {
  'use strict';

  var CAPA_PAZOLINI_VERITA = 'https://vitoria.es.gov.br/recursos/imagens/banco/2025/01/01/135425/normal@2x.jpg';
  function corrigirCapaPazoliniVerita() {
    if (!/pazolini-verita-pesquisa-mapa-espirito-santo/.test(location.pathname + location.search)) return;
    document.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || img.src || '';
      if (/metroimg|prefeito-18/.test(src)) img.src = CAPA_PAZOLINI_VERITA;
    });
  }

  function quandoPronto(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function svg(conteudo) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + conteudo + '</svg>';
  }

  const ICONES = {
    home: svg('<path d="M3 10.8 12 3l9 7.8v9.1a1.1 1.1 0 0 1-1.1 1.1h-5.2v-6.5H9.3V21H4.1A1.1 1.1 0 0 1 3 19.9z"/>'),
    facebook: svg('<path d="M14.2 8H17V4.2c-.5-.1-2.1-.2-3.6-.2-3.6 0-6 2.2-6 6.2V13H4v4.2h3.4V24h4.2v-6.8h3.6l.6-4.2h-4.2v-2.4c0-1.2.3-2.6 2.6-2.6z"/>'),
    whatsapp: svg('<path fill-rule="evenodd" d="M12 2a9.7 9.7 0 0 0-8.4 14.5L2.2 22l5.7-1.5A9.8 9.8 0 1 0 12 2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3.4.9.9-3.3-.2-.3A8 8 0 1 1 12 19.7zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2a7.5 7.5 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.7.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .2-1.1-.1-.1-.3-.2-.6-.3z"/>'),
    x: svg('<path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.5l7.1-8.1L3.1 2h6.3l4.3 5.7L18.9 2zm-1.1 17.9h1.7L8.5 4H6.7z"/>'),
    instagram: svg('<path fill-rule="evenodd" d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2zm0 1.8a3.4 3.4 0 0 0-3.4 3.4v9.6a3.4 3.4 0 0 0 3.4 3.4h9.6a3.4 3.4 0 0 0 3.4-3.4V7.2a3.4 3.4 0 0 0-3.4-3.4H7.2zm9.9 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z"/>'),
    link: svg('<path d="M9.6 15.8 8.2 17.2a3.4 3.4 0 0 1-4.8-4.8l3.2-3.2a3.4 3.4 0 0 1 4.8 0l.5.5 1.5-1.5-.5-.5a5.5 5.5 0 0 0-7.8 0l-3.2 3.2a5.5 5.5 0 1 0 7.8 7.8l1.4-1.4-1.5-1.5zm4.7-10.5-1.4 1.4 1.5 1.5 1.4-1.4a3.4 3.4 0 0 1 4.8 4.8l-3.2 3.2a3.4 3.4 0 0 1-4.8 0l-.5-.5-1.5 1.5.5.5a5.5 5.5 0 0 0 7.8 0l3.2-3.2a5.5 5.5 0 0 0-7.8-7.8z"/><path d="m8.5 14 5.5-5.5 1.5 1.5-5.5 5.5z"/>')
  };

  function adicionarEstilos() {
    if (document.getElementById('nes-share-bar-styles')) return;
    const style = document.createElement('style');
    style.id = 'nes-share-bar-styles';
    style.textContent = document.getElementById('nes-share-bar-styles') ? '' : (document.querySelector('#nes-share-bar-styles') && '') || '';
  }
