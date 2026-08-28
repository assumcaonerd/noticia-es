/* Fotos originais extraidas do og:image das materias-fonte */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  const fotos = {
    'homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1774902331248_2021_05_11_delegacia_de_castelo_491699_article.jpg',
    'flavio-tem-34-e-lula-29-entre-eleitores-do-es-no-1-turno-mostra-quaest':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787870681684_flavio_tem_34_entre_eleitores_do_es_no_1_turno_mostra_quaest_leticia_pegoretti.jpg',
    'flavio-lidera-lula-no-es-quaest-34-a-29-empate-tecnico':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787870681684_flavio_tem_34_entre_eleitores_do_es_no_1_turno_mostra_quaest_leticia_pegoretti.jpg',
    'ricardo-ferraco-preve-escolas-integrais-e-aeroporto':
      'https://uploads.folhavitoria.com.br/imagens/2026/08/Convencao-do-Partido-MDB-10-2048x1369.jpg',
    'ricardo-ferraco-lidera-e-venceria-segundo-turno-no-es-quaest':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787869381150_ricardo_venceria_2_turno_no_es_em_todos_os_cenarios_aponta_quaest_tiago_weber.jpg',
    'casagrande-lidera-senado-es-segunda-vaga-embolada-quaest':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787867800224_casagrande_tem_28_contarato_e_rose_9_na_corrida_pelo_senado_no_es_leticia_orlandi_pegoretti.jpg',
    'antonio-gobbi-morte-vitoria-contas-bancarias-investigacao':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787857850064_copia_de_template_radar_a_gazeta_2.jpg',
    'rose-contarato-lideram-rejeicao-senado-es-quaest':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787869220054_rose_e_contarato_sao_os_mais_rejeitados_na_disputa_pelo_senado_no_es_julia_pegoretti.jpg',
    'trafico-expulsao-moradores-prolar-cariacica-prisoes':
      'https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787857994604_template_radar_a_gazeta_2026_08_27t160550.jpg',
    'quaest-expoe-forcas-e-fragilidades-ricardo-pazolini-helder-es':
      'https://f.i.uol.com.br/fotografia/2026/08/27/17878433866a90533ae90ca_1787843386_3x2_xl.jpg',
    'comerciante-foragido-adolescentes-agua-doce-norte-preso-uberlandia':
      'https://www.folhavitoria.com.br/wp-content/uploads/2025/07/sirene-giroflex-carro-de-policia-viatura.jpg',
    'onde-estava-augusto-cury':
      'https://s2-oglobo.glbimg.com/EB1Qw1eFocGeGNM3_uq99LhBsYI=/642x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/F/B/7IIcADSRiF3mXVrj5HOw/whatsapp-image-2026-08-14-at-10.29.06.jpeg'
  };

  noticias.forEach(function (n) {
    if (fotos[n.slug]) n.imagem = fotos[n.slug];
  });
})();
