(function publicarRodadaAprovada(){
  const publicadoEm = '2026-09-02T07:46:00-03:00';
  const rodada = (window.redacaoPronta || []).filter(n => n.preparadoEm === '2026-09-02T07:45:00-03:00');
  const publicados = rodada.map((n, i) => ({
    id: 'auto-redacao-20260902-074600-' + String(i + 1).padStart(2, '0'),
    slug: n.slug,
    titulo: n.titulo,
    categoria: n.categoria,
    data: n.data,
    imagem: n.imagem,
    resumo: n.resumo,
    conteudo: n.conteudo,
    autor: 'Redação Notícia ES',
    fonteNome: n.fonteNome,
    fonteUrl: n.fonteUrl,
    fontesAdicionais: n.fontesAdicionais,
    automatico: true,
    publicadoEm
  }));
  window.noticias = window.noticias || [];
  window.noticias.unshift(...publicados);
})();