/* Garante que a matéria de Itaparica apareça também na grade "Últimas notícias". */
(function () {
  function inserir() {
    const grade = document.querySelector('[data-grade]');
    if (!grade) return;

    const slug = 'mulher-presa-injuria-racial-desacato-pm-itaparica-vila-velha';
    const href = `m/${slug}.html`;
    if (grade.querySelector(`a[href="${href}"]`)) return;

    const artigo = document.createElement('article');
    artigo.className = 'card-noticia';
    artigo.setAttribute('data-card-link', href);
    artigo.setAttribute('tabindex', '0');
    artigo.setAttribute('role', 'link');
    artigo.setAttribute('aria-label', 'Abrir: Mulher é presa em Itaparica após dizer que não temia o PM porque ele era preto');
    artigo.innerHTML = `
      <a href="${href}" aria-label="Abrir: Mulher é presa em Itaparica após dizer que não temia o PM porque ele era preto">
        <img src="https://s2-g1.glbimg.com/0BX1oOHXCZX5PYnjwed0bDHQf98=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2026/F/B/AfDMKKQACmqnsYB3VWYw/img-mulher-presa-gmd-07-09.mov-snapshot-00.11.156.jpg" alt="Mulher é presa em Itaparica após dizer que não temia o PM porque ele era preto" loading="lazy" referrerpolicy="no-referrer">
      </a>
      <div class="card-body">
        <span class="chapeu">Segurança Pública</span>
        <h3><a href="${href}">Mulher é presa em Itaparica após dizer que não temia o PM porque ele era preto</a></h3>
        <div class="meta"><span>07 de setembro de 2026</span><span>Redação Notícia ES</span></div>
        <p>Karla Rodrigues da Silva foi autuada em flagrante por injúria racial e desacato depois de hostilizar soldados da PM na Praia de Itaparica.</p>
      </div>`;

    artigo.addEventListener('click', function (event) {
      if (event.target.closest('a')) return;
      window.location.href = href;
    });
    artigo.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = href;
      }
    });

    grade.prepend(artigo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inserir, { once: true });
  } else {
    inserir();
  }
})();
