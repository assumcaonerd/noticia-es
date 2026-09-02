// Publicação aprovada em 02/09/2026. Carrega exclusivamente a rodada validada e converte os objetos para o formato público.
document.write('<script src="redacao-pronta/rodada-20260902-001500.js"><' + '/script>');
(function publicarRodadaAprovada(){
  const publicadoEm = '2026-09-02T00:25:00-03:00';
  const rodada = (window.redacaoPronta || []).filter(n => n.preparadoEm === '2026-09-02T00:15:00-03:00');
  const publicados = rodada.map((n, i) => ({
    id: 'auto-redacao-20260902-002500-' + String(i + 1).padStart(2, '0'),
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