/* NOTÍCIA ES - remoções editoriais e deduplicação */
(function () {
  if (typeof noticias === "undefined" || !Array.isArray(noticias)) return;
  const removidos = new Set([
    "kremlin-russia-avanco-frente-ucrania-peskov-alegacao",
    "russia-seguranca-europa-peskov-arquitetura-negociacoes",

    /* 29 candidatos com Bolsonaro no nome: manter 29-candidatos-usam-bolsonaro-nome-urna-eleicoes-2026 */
    "29-candidatos-bolsonaro-nome-urna-eleicoes-2026",
    "29-candidatos-usam-bolsonaro-nome-de-urna-eleicoes-2026",

    /* Antonio Gobbi: manter antonio-gobbi-morte-vitoria-contas-bancarias-investigacao */
    "antonio-gobbi-morte-canal-vitoria-investigacao-tentativas-bancarias",

    /* Bebê de dois meses na Serra: manter bebe-dois-meses-estado-grave-briga-pais-serra-investigacao-versoes */
    "bebe-dois-meses-segue-grave-apos-briga-familiar-na-serra",

    /* Pesquisa genética do café: manter cafe-capixaba-pesquisa-genetica-resiliencia-mudancas-climaticas */
    "cafe-mudancas-climaticas-resiliencia-genetica-incaper-es",

    /* Crédito para motoristas: manter camara-aprova-credito-30-bilhoes-motoristas-aplicativo-taxistas-veiculos */
    "camara-aprova-move-brasil-30-bilhoes-credito-motoristas-aplicativo",

    /* MP das blusinhas: manter comissao-adia-analise-mp-blusinhas-1-setembro-2026 */
    "comissao-adia-votacao-mp-blusinhas-1-setembro",
    "comissao-adia-votacao-mp-blusinhas-setembro-2026",

    /* Concursos no ES: manter concursos-selecoes-espirito-santo-irupi-transpetro-oportunidades */
    "concursos-selecoes-26-mil-vagas-crf-es-irupi-transpetro",

    /* Congresso de segurança com ministro de El Salvador: manter congresso-fiesp-ministro-bukele-villatoro-candidatos-2026 */
    "candidatos-congresso-seguranca-fiesp-ministro-bukele",
    "congresso-fiesp-ministro-bukele-seguranca-candidatos-2026",

    /* Enfermeira e produtos estéticos: manter enfermeira-presa-produtos-esteticos-sem-registro-cariacica-2026 */
    "enfermeira-presa-cariacica-produtos-esteticos-sem-registro",

    /* 226 denúncias no Pardal: manter espirito-santo-226-denuncias-irregularidades-campanha-pardal-2026 */
    "espirito-santo-226-denuncias-irregularidades-campanha-pardal",

    /* Ministro de Bukele e Flávio: manter flá... */
    "flavio-bolsonaro-ministro-bukele-seguranca-faccoes-presidios",

    /* Jornada flexível de Flávio: manter flavio-bolsonaro-jornada-flexivel-hora-trabalhada-alternativa-escala-6x1 */
    "flavio-bolsonaro-propoe-jornada-flexivel-por-hora-no-debate-sobre-escala-6x1",

    /* Vendaval no ES: manter inmet-alerta-vendaval-62-cidades-espirito-santo-inicio-setembro */
    "inmet-alerta-vendaval-62-cidades-espirito-santo-setembro",

    /* Jantar de Lula com empresários: manter lula-jantar-empresarios-banqueiros-alvorada-disputa-mercado-eleicoes-2026 */
    "lula-empresarios-jantar-alvorada-fiscal-juros-trump",

    /* Espaço de Lula na propaganda estadual: manter lula-mais-espaco-tv-aliados-flavio-horario-eleitoral-2026 */
    "lula-mais-espaco-propaganda-estadual-aliados-que-flavio",

    /* Motociclista morto em São Mateus: manter motociclista-morre-colisao-carreta-sao-mateus-rodovia-miguel-curry-carneiro */
    "motociclista-morre-carreta-ultrapassagem-sao-mateus",

    /* Motorista de aplicativo baleado na Serra: manter motorista-aplicativo-baleado-tentativa-latrocinio-serra-central-carapina */
    "motorista-aplicativo-baleado-tentativa-latrocinio-central-carapina-serra",
    "motorista-aplicativo-baleado-tentativa-latrocinio-serra-carapina",

    /* Mulher morta em Piúma: manter mulher-encontrada-morta-queimaduras-cabeca-piuma-homicidio */
    "mulher-encontrada-morta-queimaduras-cabeca-piuma-policia-investiga-homicidio",

    /* Fim da escala 6x1: manter pec-fim-escala-6x1-relatorio-favoravel-ccj-senado */
    "pec-fim-escala-6x1-senado-ccj-40-horas-dois-dias-folga",

    /* Prisão em Castelo após dez anos: manter prisao-castelo-dez-anos-desacato-desobediencia-pm */
    "condenado-desacato-desobediencia-preso-dez-anos-depois-castelo",
    "homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es",

    /* Rua da Lama: manter dono-bar-condenado-29-anos-morte-breno-rua-da-lama-vitoria */
    "rua-da-lama-vilson-ballan-condenado-29-anos-breno",

    /* Plano de governo de Ricardo Ferraço: manter ricardo-ferraco-plano-governo-escolas-integrais-hospital-veterinario-aeroporto-cargas */
    "ricardo-ferracco-preve-escolas-integrais-e-aeroporto",
    "ricardo-ferraco-preve-escolas-integrais-e-aeroporto",

    /* Gerência do tráfico no Forte São João: manter gerente-trafico-forte-sao-joao-detido-vitoria-2026 */
    "pm-detem-suspeito-gerencia-trafico-forte-sao-joao-vitoria",

    /* Crise da Apex: manter investidores-apex-organizam-associacao-crise-passivo-quase-1-bilhao */
    "apex-partners-investidores-credores-associacao-vitoria-negociacao-crise",

    /* Confusão em ato contra 6x1: manter confusao-em-ato-contra-escala-6x1-na-paulista-termina-na-delegacia */
    "ato-paulista-escala-6x1-confusao-delegacia-sao-paulo"
  ]);
  for (let i = noticias.length - 1; i >= 0; i--) {
    if (removidos.has(noticias[i] && noticias[i].slug)) noticias.splice(i, 1);
  }
})();
