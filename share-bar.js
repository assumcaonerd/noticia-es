/*
 * Notícia ES | Barra lateral de compartilhamento
 */
(function () {
  'use strict';

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
    style.textContent = `\n      .nes-share-rail {\n        position: fixed;\n        z-index: 999;\n        left: max(16px, calc(50% - 510px));\n        top: 50%;\n        transform: translateY(-50%);\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        gap: 10px;\n      }\n      .nes-share-btn {\n        width: 46px;\n        height: 46px;\n        border: 0;\n        border-radius: 999px;\n        display: grid;\n        place-items: center;\n        padding: 0;\n        cursor: pointer;\n        text-decoration: none;\n        color: #fff;\n        box-shadow: 0 2px 8px rgba(0,0,0,.16);\n        transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;\n        -webkit-tap-highlight-color: transparent;\n      }\n      .nes-share-btn:hover,\n      .nes-share-btn:focus-visible {\n        transform: scale(1.08);\n        box-shadow: 0 4px 14px rgba(0,0,0,.22);\n        filter: brightness(1.04);\n        outline: none;\n      }\n      .nes-share-btn svg {\n        width: 25px;\n        height: 25px;\n        display: block;\n        fill: currentColor;\n      }\n      .nes-share-home { background: #69afd4; }\n      .nes-share-facebook { background: #1877f2; }\n      .nes-share-whatsapp { background: #25d366; }\n      .nes-share-x { background: #000; }\n      .nes-share-instagram {\n        background: radial-gradient(circle at 30% 107%, #ffd600 0 5%, #ff7a00 30%, #ff0169 55%, #d300c5 75%, #7638fa 100%);\n      }\n      .nes-share-link { background: #000; }\n      .nes-share-status {\n        position: fixed;\n        z-index: 1000;\n        left: 50%;\n        bottom: 22px;\n        transform: translateX(-50%) translateY(12px);\n        background: #111;\n        color: #fff;\n        font: 600 14px/1.2 Arial, sans-serif;\n        padding: 9px 13px;\n        border-radius: 8px;\n        opacity: 0;\n        pointer-events: none;\n        transition: opacity .18s ease, transform .18s ease;\n      }\n      .nes-share-status.ativo {\n        opacity: 1;\n        transform: translateX(-50%) translateY(0);\n      }\n      .nes-share-rail-enabled .compartilhar { display: none !important; }\n      @media (max-width: 900px) {\n        .nes-share-rail {\n          left: 50%;\n          top: auto;\n          bottom: 10px;\n          transform: translateX(-50%);\n          flex-direction: row;\n          gap: 7px;\n          padding: 7px 9px;\n          border-radius: 999px;\n          background: rgba(255,255,255,.96);\n          box-shadow: 0 5px 22px rgba(0,0,0,.18);\n          backdrop-filter: blur(8px);\n        }\n        .nes-share-btn { width: 39px; height: 39px; }\n        .nes-share-btn svg { width: 22px; height: 22px; }\n        .nes-share-rail-enabled main.materia { padding-bottom: 72px; }\n        .nes-share-status { bottom: 68px; }\n      }\n      @media (max-width: 360px) {\n        .nes-share-rail { gap: 5px; padding: 6px 7px; }\n        .nes-share-btn { width: 36px; height: 36px; }\n        .nes-share-btn svg { width: 20px; height: 20px; }\n      }\n      @media print {\n        .nes-share-rail, .nes-share-status { display: none !important; }\n      }\n    `;
    document.head.appendChild(style);
  }

  function canonicalDaPagina() {
    const link = document.querySelector('link[rel="canonical"]');
    if (link && link.href) return link.href;
    return window.location.href.split('#')[0];
  }

  function tituloDaMateria() {
    const og = document.querySelector('meta[property="og:title"]');
    if (og && og.content) return og.content.trim();
    const h1 = document.querySelector('main.materia h1, article h1');
    return h1 ? h1.textContent.trim() : document.title.replace(/\s*\|\s*Notícia ES\s*$/i, '').trim();
  }

  function criarLink(classe, label, href, icone) {
    const a = document.createElement('a');
    a.className = 'nes-share-btn ' + classe;
    a.href = href;
    a.setAttribute('aria-label', label);
    a.title = label;
    a.innerHTML = icone;
    return a;
  }

  function criarBotao(classe, label, icone) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nes-share-btn ' + classe;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.innerHTML = icone;
    return button;
  }

  function abrirCompartilhamento(evento) {
    evento.currentTarget.setAttribute('target', '_blank');
    evento.currentTarget.setAttribute('rel', 'noopener noreferrer');
  }

  function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto);
    }
    return new Promise(function (resolve, reject) {
      const area = document.createElement('textarea');
      area.value = texto;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (erro) {
        reject(erro);
      } finally {
        area.remove();
      }
    });
  }

  let timerStatus = null;
  function mostrarStatus(texto) {
    let status = document.querySelector('.nes-share-status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'nes-share-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      document.body.appendChild(status);
    }
    status.textContent = texto;
    status.classList.add('ativo');
    clearTimeout(timerStatus);
    timerStatus = setTimeout(function () {
      status.classList.remove('ativo');
    }, 1800);
  }

  function rastrear(rede) {
    if (typeof window.noticiaesTrack !== 'function') return;
    window.noticiaesTrack('share', {
      method: rede,
      content_type: 'article',
      item_id: canonicalDaPagina()
    });
  }

  function urlParaX(urlCanonica) {
    if (urlCanonica === 'https://noticiaes.com.br/m/flavio-sob-suspeita-outro-lado-sob-eufemismo-estadao.html') {
      return 'https://noticiaes.com.br/x/flavio-sob-suspeita-estadao-card-2.html';
    }
    return urlCanonica;
  }

  function iniciar() {
    if (document.querySelector('.nes-share-rail')) return;
    const materia = document.querySelector('main.materia article, .materia-estatica, .materia-wrap');
    if (!materia) return;
    const ogType = document.querySelector('meta[property="og:type"]');
    const pareceMateria = document.body.dataset.pagina === 'materia' ||
      window.location.pathname.indexOf('/m/') === 0 ||
      (ogType && String(ogType.content).toLowerCase() === 'article');
    if (!pareceMateria) return;
    adicionarEstilos();
    const urlCanonica = canonicalDaPagina();
    const titulo = tituloDaMateria();
    const url = encodeURIComponent(urlCanonica);
    const urlX = encodeURIComponent(urlParaX(urlCanonica));
    const texto = encodeURIComponent(titulo);
    const textoWhatsApp = encodeURIComponent(titulo + ' ' + urlCanonica);
    const rail = document.createElement('aside');
    rail.className = 'nes-share-rail';
    rail.setAttribute('aria-label', 'Compartilhar notícia');
    const home = criarLink('nes-share-home', 'Ir para a página inicial do Notícia ES', 'https://noticiaes.com.br/', ICONES.home);
    const facebook = criarLink('nes-share-facebook', 'Compartilhar no Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + url, ICONES.facebook);
    const whatsapp = criarLink('nes-share-whatsapp', 'Compartilhar no WhatsApp', 'https://wa.me/?text=' + textoWhatsApp, ICONES.whatsapp);
    const x = criarLink('nes-share-x', 'Compartilhar no X', 'https://twitter.com/intent/tweet?text=' + texto + '&url=' + urlX, ICONES.x);
    const instagram = criarLink('nes-share-instagram', 'Compartilhar no Instagram', 'https://www.instagram.com/', ICONES.instagram);
    const copiar = criarBotao('nes-share-link', 'Copiar link da notícia', ICONES.link);
    [facebook, whatsapp, x].forEach(function (link) {
      link.addEventListener('click', abrirCompartilhamento);
    });
    facebook.addEventListener('click', function () { rastrear('facebook'); });
    whatsapp.addEventListener('click', function () { rastrear('whatsapp'); });
    x.addEventListener('click', function () { rastrear('x'); });
    instagram.addEventListener('click', function (evento) {
      evento.preventDefault();
      rastrear('instagram');
      const novaAba = window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      copiarTexto(urlCanonica).then(function () {
        mostrarStatus('Link copiado para compartilhar no Instagram');
      }).catch(function () {
        mostrarStatus('Abra o Instagram e compartilhe o link desta matéria');
      });
      if (novaAba) novaAba.opener = null;
    });
    copiar.addEventListener('click', function () {
      rastrear('copy_link');
      copiarTexto(urlCanonica).then(function () {
        mostrarStatus('Link da notícia copiado');
      }).catch(function () {
        mostrarStatus('Não foi possível copiar o link');
      });
    });
    rail.append(home, facebook, whatsapp, x, instagram, copiar);
    document.body.appendChild(rail);
    document.body.classList.add('nes-share-rail-enabled');
  }

  function sincronizarMenuEditorial() {
    var headerInner = document.querySelector('.site-header .header-inner');
    var nav = headerInner && headerInner.querySelector('.nav-principal');
    if (!headerInner || !nav) return;

    var inicio = location.pathname.indexOf('/m/') !== -1 ? '../index.html' : '/index.html';
    var itens = [
      ['Início', inicio],
      ['Política ES', inicio + '?categoria=politica-es'],
      ['Segurança Pública', inicio + '?categoria=seguranca-publica'],
      ['Justiça', inicio + '?categoria=justica'],
      ['Política Nacional', inicio + '?categoria=politica-nacional'],
      ['Economia', inicio + '?categoria=economia'],
      ['Opinião', inicio + '?categoria=opiniao'],
      ['Fé e Sociedade', inicio + '?categoria=fe-e-sociedade'],
      ['Cidades', inicio + '?categoria=cidades'],
      ['Cultura', inicio + '?categoria=cultura'],
      ['Tecnologia', inicio + '?categoria=tecnologia'],
      ['Esporte', inicio + '?categoria=esporte'],
      ['Pesquisa', '/pesquisa.html'],
      ['Anuncie', '/anuncie.html']
    ];

    nav.id = 'menu-principal';
    nav.setAttribute('data-nav', '');
    nav.setAttribute('aria-label', 'Navegação principal');
    nav.innerHTML = '<ul>' + itens.map(function (item) {
      return '<li><a href="' + item[1] + '">' + item[0] + '</a></li>';
    }).join('') + '</ul>';

    var logo = headerInner.querySelector('.logo');
    if (logo && !logo.closest('.marca-site')) {
      var marca = document.createElement('div');
      marca.className = 'marca-site';
      logo.parentNode.insertBefore(marca, logo);
      marca.appendChild(logo);
      var slogan = document.createElement('span');
      slogan.className = 'slogan-site';
      slogan.textContent = 'O maior portal de notícias capixaba';
      marca.appendChild(slogan);
    }

    var botao = headerInner.querySelector('[data-menu-toggle]');
    if (!botao) {
      botao = document.createElement('button');
      botao.className = 'menu-toggle';
      botao.type = 'button';
      botao.setAttribute('data-menu-toggle', '');
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-controls', 'menu-principal');
      botao.textContent = 'Menu';
      nav.parentNode.insertBefore(botao, nav);
    }

    if (botao.dataset.menuLigado !== 'true') {
      botao.dataset.menuLigado = 'true';
      botao.addEventListener('click', function () {
        var aberto = nav.classList.toggle('aberto');
        botao.setAttribute('aria-expanded', String(aberto));
      });
    }
  }

  quandoPronto(sincronizarMenuEditorial);
  quandoPronto(iniciar);
  quandoPronto(function () {
    if (!/pazolini-verita-pesquisa-mapa-espirito-santo/.test(location.pathname + location.search)) return;
    var url = "https://vitoria.es.gov.br/recursos/imagens/banco/2025/01/01/135425/normal@2x.jpg";
    document.querySelectorAll("img").forEach(function (img) {
      var src = img.getAttribute("src") || img.src || "";
      if (/metroimg|prefeito-18/.test(src)) img.src = url;
    });
  });
})();
