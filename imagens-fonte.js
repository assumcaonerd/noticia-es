/* Fotos originais extraídas da fonte. Mantido pelo fiscal-imagens. */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  const fotos = {
    "antonio-gobbi-morte-vitoria-contas-bancarias-investigacao":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787857850064_copia_de_template_radar_a_gazeta_2.jpg",
    "casagrande-lidera-senado-es-segunda-vaga-embolada-quaest":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787867800224_casagrande_tem_28_contarato_e_rose_9_na_corrida_pelo_senado_no_es_leticia_orlandi_pegoretti.jpg",
    "comerciante-foragido-adolescentes-agua-doce-norte-preso-uberlandia":
      "https://www.folhavitoria.com.br/wp-content/uploads/2025/07/sirene-giroflex-carro-de-policia-viatura.jpg",
    "dark-horse-banco-master-e-a-regua-que-precisa-valer-para-todos":
      "https://tvtnews.com.br/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2026/08/flavio_jorna_nacional-A-1024x576.jpg.webp",
    "flavio-bolsonaro-faria-lima-mercado-financeiro-sabatina-jornal-nacional":
      "https://f.i.uol.com.br/fotografia/2026/08/26/17877529916a8ef21f7fa23_1787752991_3x2_rt.jpg",
    "flavio-lidera-lula-no-es-quaest-34-a-29-empate-tecnico":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787870681684_flavio_tem_34_entre_eleitores_do_es_no_1_turno_mostra_quaest_leticia_pegoretti.jpg",
    "flavio-tem-34-e-lula-29-entre-eleitores-do-es-no-1-turno-mostra-quaest":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787870681684_flavio_tem_34_entre_eleitores_do_es_no_1_turno_mostra_quaest_leticia_pegoretti.jpg",
    "homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1774902331248_2021_05_11_delegacia_de_castelo_491699_article.jpg",
    "horario-eleitoral-comeca-es-governo-senado-assembleia-2026":
      "https://cdn2.tribunaonline.com.br/img/Artigo-Destaque/320000/615x300/Candidatos-ao-governo-e-Senado-estreiam-hoje-na-TV0032944900202608271916/scaleDownProportionalFillBackground-1.jpg?fallback=https%3A%2F%2Fcdn2.tribunaonline.com.br%2Fimg%2FArtigo-Destaque%2F320000%2FCandidatos-ao-governo-e-Senado-estreiam-hoje-na-TV0032944900202608271916.jpg%3Fxid%3D1512658&xid=1512658",
    "horario-eleitoral-governo-es-ferraco-pazolini-helder":
      "https://f.i.uol.com.br/fotografia/2026/08/27/17878433866a90533ae90ca_1787843386_3x2_xl.jpg",
    "onde-estava-augusto-cury":
      "https://s2-oglobo.glbimg.com/EB1Qw1eFocGeGNM3_uq99LhBsYI=/642x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/F/B/7IIcADSRiF3mXVrj5HOw/whatsapp-image-2026-08-14-at-10.29.06.jpeg",
    "pl-messias-donato-denuncia-maus-tratos-embalagens-racao":
      "https://eshoje.com.br/wp-content/uploads/2026/08/PET-E-RACAO.jpg",
    "presidenciaveis-quinta-sabatinas-lula-flavio-globo-campanha-2026":
      "https://imagens.ebc.com.br/mHxHjf7pDxiKyHWFE1hh6tGdJMg=/1600x800/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/2026/08/18/banner_agenda_-_1170x700.png?itok=t-rMkLxv",
    "preso-suspeito-explosao-incendio-viatura-pm-linhares":
      "https://uploads.folhavitoria.com.br/imagens/2026/08/Viatura-da-PM-pega-fogo-apos-motociclista-deixar-mochila-sobre-veiculo-e-objeto-explodir-em-Linhares.jpg",
    "prisao-castelo-dez-anos-desacato-desobediencia-pm":
      "https://netdeal.com.br/api/images/proxy?quality=100&width=1200&src=https://www.netdeal.com.br/api/images/producao.spayce.com.br/1774902331248_2021_05_11_delegacia_de_castelo_491699_article.jpg",
    "quaest-expoe-forcas-e-fragilidades-ricardo-pazolini-helder-es":
      "https://f.i.uol.com.br/fotografia/2026/08/27/17878433866a90533ae90ca_1787843386_3x2_xl.jpg",
    "ricardo-ferraco-lidera-e-venceria-segundo-turno-no-es-quaest":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787869381150_ricardo_venceria_2_turno_no_es_em_todos_os_cenarios_aponta_quaest_tiago_weber.jpg",
    "ricardo-ferraco-preve-escolas-integrais-e-aeroporto":
      "https://uploads.folhavitoria.com.br/imagens/2026/08/Convencao-do-Partido-MDB-10-2048x1369.jpg",
    "rose-contarato-lideram-rejeicao-senado-es-quaest":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787869220054_rose_e_contarato_sao_os_mais_rejeitados_na_disputa_pelo_senado_no_es_julia_pegoretti.jpg",
    "trafico-expulsao-moradores-prolar-cariacica-prisoes":
      "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787857994604_template_radar_a_gazeta_2026_08_27t160550.jpg"
  };

  noticias.forEach(function (n) {
    if (fotos[n.slug]) n.imagem = fotos[n.slug];
  });
})();
