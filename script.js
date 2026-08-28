(function () {
  'use strict';

  const pagina = document.body.dataset.pagina || '';
  const buscaForm = document.querySelector('[data-busca-form]');
  const buscaInput = document.querySelector('[data-busca-input]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const aberto = nav.classList.toggle('aberto');
      menuToggle.setAttribute('aria-expanded', String(aberto));
    });
  }

  function normalizar(texto = '') {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function formatarData(dataISO) {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    }).format(data);
  }

  function linkMateria(noticia) {
    return `noticia.html?slug=${encodeURIComponent(noticia.slug)}`;
  }

  function slugCategoria(categoria) {
    return normalizar(categoria).replace(/\s+/g, '-');
  }

  function obterParametro(nome) {
    return new URLSearchParams(window.location.search).get(nome);
  }

  function filtrarNoticias(lista, termo, categoria) {
    let resultado = [...lista];

    if (categoria) {
      const categoriaNormalizada = normalizar(categoria).replace(/-/g, ' ');
      resultado = resultado.filter(n => normalizar(n.categoria) === categoriaNormalizada);
    }

    if (termo) {
      const q = normalizar(termo);
      resultado = resultado.filter(n =>
        normalizar(n.titulo).includes(q) || normalizar(n.resumo).includes(q)
      );
    }

    return resultado;
  }

  function capaHTML(n, cls) {
    if (!n.imagem) return '';
    const klass = cls ? ` class="${cls}"` : '';
    return `<img${klass} src="${n.imagem}" alt="${n.titulo}" loading="lazy" referrerpolicy="no-referrer">`;
  }

  function mesmoSrc(a, b) {
    if (!a || !b) return false;
    const na = String(a).split('?')[0].replace(/\/$/, '');
    const nb = String(b).split('?')[0].replace(/\/$/, '');
    if (na === nb) return true;
    try {
      const ua = new URL(na, location.href).pathname.split('/').pop();
      const ub = new URL(nb, location.href).pathname.split('/').pop();
      return ua && ub && ua === ub;
    } catch (e) {
      return false;
    }
  }

  function removerCapaDuplicadaNoCorpo(root, capaSrc) {
    if (!root || !capaSrc) return;
    root.querySelectorAll('img').forEach(function (img) {
      const src = img.getAttribute('src') || img.src || '';
      if (!mesmoSrc(src, capaSrc)) return;
      const bloco = img.closest('figure, .materia-figura') || img;
      bloco.remove();
    });
  }

  function cardHTML(n) {
    const link = linkMateria(n);
    return `
      <article class="card-noticia" data-card-link="${link}" tabindex="0" role="link" aria-label="Abrir: ${n.titulo}">
        <a href="${link}" aria-label="Abrir: ${n.titulo}">
          ${capaHTML(n)}
        </a>
        <div class="card-body">
          <span class="chapeu">${n.categoria}</span>
          <h3><a href="${link}">${n.titulo}</a></h3>
          <div class="meta"><span>${formatarData(n.data)}</span><span>${n.autor}</span></div>
          <p>${n.resumo}</p>
        </div>
      </article>`;
  }

  function configurarCards() {
    document.querySelectorAll('[data-card-link]').forEach(card => {
      const abrir = () => {
        window.location.href = card.dataset.cardLink;
      };

      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        abrir();
      });

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          abrir();
        }
      });
    });
  }

  function renderHome() {
    const hero = document.querySelector('[data-destaque]');
    const grade = document.querySelector('[data-grade]');
    const tituloSecao = document.querySelector('[data-titulo-secao]');
    if (!hero || !grade) return;

    const termo = obterParametro('q') || '';
    const categoria = obterParametro('categoria') || '';
    if (buscaInput) buscaInput.value = termo;

    const lista = filtrarNoticias(noticias, termo, categoria);

    if (categoria || termo) {
      hero.style.display = 'none';
      if (tituloSecao) {
        const partes = [];
        if (categoria) partes.push(categoria.replace(/-/g, ' '));
        if (termo) partes.push(`busca: “${termo}”`);
        tituloSecao.textContent = `Resultados para ${partes.join(' · ')}`;
      }
      grade.innerHTML = lista.length
        ? lista.map(cardHTML).join('')
        : '<div class="vazio">Nenhuma notícia encontrada com esses critérios.</div>';
      configurarCards();
      return;
    }

    if (!lista.length) {
      hero.innerHTML = '<div class="vazio">Nenhuma notícia publicada ainda.</div>';
      grade.innerHTML = '';
      return;
    }

    const destaque = lista[0];
    hero.innerHTML = `
      <article class="hero-card">
        <a href="${linkMateria(destaque)}">
          ${capaHTML(destaque)}
        </a>
        <div class="hero-conteudo">
          <span class="chapeu">${destaque.categoria}</span>
          <h1><a href="${linkMateria(destaque)}">${destaque.titulo}</a></h1>
          <div class="meta"><span>${formatarData(destaque.data)}</span><span>${destaque.autor}</span></div>
          <p>${destaque.resumo}</p>
        </div>
      </article>`;

    grade.innerHTML = lista.slice(1).map(cardHTML).join('');
    configurarCards();
  }

  function atualizarSEO(n) {
    document.title = `${n.titulo} | Notícia ES`;

    const descricao = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');

    if (descricao) descricao.content = n.resumo;
    if (ogTitle) ogTitle.content = n.titulo;
    if (ogDesc) ogDesc.content = n.resumo;
    if (ogImage) ogImage.content = n.imagem;
    if (ogUrl) ogUrl.content = window.location.href;
    if (twitterTitle) twitterTitle.content = n.titulo;
    if (twitterDesc) twitterDesc.content = n.resumo;
    if (twitterImage) twitterImage.content = n.imagem;
  }

  function renderMateria() {
    const container = document.querySelector('[data-materia]');
    const relacionados = document.querySelector('[data-relacionados]');
    if (!container) return;

    const slug = obterParametro('slug');
    const noticia = noticias.find(n => n.slug === slug);

    if (!noticia) {
      document.title = 'Notícia não encontrada | Notícia ES';
      container.innerHTML = `
        <div class="vazio">
          <h1>Notícia não encontrada</h1>
          <p>O endereço pode estar incorreto ou a matéria pode ter sido removida.</p>
          <p><a class="btn-primario" href="index.html">Voltar para a página inicial</a></p>
        </div>`;
      if (relacionados) relacionados.style.display = 'none';
      return;
    }

    atualizarSEO(noticia);

    container.innerHTML = `
      <article class="materia-wrap">
        <header class="materia-header">
          <span class="chapeu">${noticia.categoria}</span>
          <h1>${noticia.titulo}</h1>
          <p class="materia-resumo">${noticia.resumo}</p>
          <div class="meta">
            <span>${formatarData(noticia.data)}</span>
            <span>Por ${noticia.autor}</span>
          </div>
        </header>
        ${capaHTML(noticia, "materia-imagem")}
        <div class="materia-conteudo">${noticia.conteudo}</div>
        <div class="compartilhar" aria-label="Compartilhar notícia">
          <button class="btn-share" data-share="whatsapp">WhatsApp</button>
          <button class="btn-share" data-share="x">X</button>
          <button class="btn-share" data-share="facebook">Facebook</button>
        </div>
      </article>`;

    removerCapaDuplicadaNoCorpo(container.querySelector('.materia-conteudo'), noticia.imagem);

    const outras = noticias
      .filter(n => n.slug !== noticia.slug)
      .sort((a, b) => (a.categoria === noticia.categoria ? -1 : 1))
      .slice(0, 3);

    if (relacionados) {
      relacionados.innerHTML = `
        <div class="materia-wrap leia-tambem">
          <h2>Leia também</h2>
          <div class="leia-lista">
            ${outras.map(n => `<a class="leia-item" href="${linkMateria(n)}">${n.titulo}</a>`).join('')}
          </div>
        </div>`;
    }

    document.querySelectorAll('[data-share]').forEach(btn => {
      btn.addEventListener('click', () => compartilhar(btn.dataset.share, noticia));
    });
  }

  function compartilhar(rede, noticia) {
    const url = encodeURIComponent(window.location.href);
    const texto = encodeURIComponent(noticia.titulo);
    let destino = '';

    if (rede === 'whatsapp') destino = `https://wa.me/?text=${texto}%20${url}`;
    if (rede === 'x') destino = `https://twitter.com/intent/tweet?text=${texto}&url=${url}`;
    if (rede === 'facebook') destino = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

    if (destino) window.open(destino, '_blank', 'noopener,noreferrer');
  }

  function configurarBusca() {
    if (!buscaForm || !buscaInput) return;

    buscaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const termo = buscaInput.value.trim();
      const destino = termo ? `index.html?q=${encodeURIComponent(termo)}` : 'index.html';
      window.location.href = destino;
    });
  }

  function configurarLinksCategoria() {
    document.querySelectorAll('[data-categoria]').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelectorAll('[data-categoria]').forEach(a => a.classList.remove('ativo'));
        link.classList.add('ativo');
      });
    });
  }

  function configurarAno() {
    document.querySelectorAll('[data-ano]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  configurarBusca();
  configurarLinksCategoria();
  configurarAno();

  if (pagina === 'home') renderHome();
  if (pagina === 'materia') renderMateria();
})();
