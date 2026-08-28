/*
  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO
  ==================================================
  Este arquivo recebe notícias manuais e automáticas.
  O motor automático roda pelo GitHub Actions e insere novas matérias no topo.
  Para publicação manual, use publicar.html e cole o objeto logo após "const noticias = [".
*/

const noticias = [
  {
    id: 170452035257,
    slug: "homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es",
    titulo: "Homem é preso 10 anos após ocorrência por desacato e desobediência no ES",
    categoria: "Segurança Pública",
    data: "2026-08-27",
    imagem: "imagens/auto-seguranca-publica.svg",
    resumo: "Caso ocorreu em 2016, quando condenado foi a uma unidade da PM reclamar de uma abordagem e acabou detido",
    conteudo: `<p>Caso ocorreu em 2016, quando condenado foi a uma unidade da PM reclamar de uma abordagem e acabou detido</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. Para preservar contexto, autoria e eventuais atualizações posteriores, o texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href=\"https://www.agazeta.com.br/agora/homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es-0826\" target=\"_blank\" rel=\"noopener noreferrer\">A Gazeta - Polícia</a>.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "A Gazeta - Polícia",
    fonteUrl: "https://www.agazeta.com.br/agora/homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es-0826",
    automatico: true,
    coletadoEm: "2026-08-28T00:56:05.273Z"
  },
  {
    id: 209208164019,
    slug: "flavio-tem-34-e-lula-29-entre-eleitores-do-es-no-1-turno-mostra-quaest",
    titulo: "Flávio tem 34% e Lula 29% entre eleitores do ES no 1º turno, mostra Quaest",
    categoria: "Política ES",
    data: "2026-08-27",
    imagem: "https://www.netdeal.com.br/api/images/producao.spayce.com.br/1787870681684_flavio_tem_34_entre_eleitores_do_es_no_1_turno_mostra_quaest_leticia_pegoretti.jpg",
    resumo: "Considerando a margem de erro do levantamento, que é de 3 pontos para mais ou para menos, os candidatos estão tecnicamente empatados",
    conteudo: `<p>Considerando a margem de erro do levantamento, que é de 3 pontos para mais ou para menos, os candidatos estão tecnicamente empatados</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. Para preservar contexto, autoria e eventuais atualizações posteriores, o texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href=\"https://www.agazeta.com.br/es/politica/flavio-tem-34-e-lula-29-entre-eleitores-do-es-no-1-turno-mostra-quaest-0826\" target=\"_blank\" rel=\"noopener noreferrer\">A Gazeta - Política</a>.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "A Gazeta - Política",
    fonteUrl: "https://www.agazeta.com.br/es/politica/flavio-tem-34-e-lula-29-entre-eleitores-do-es-no-1-turno-mostra-quaest-0826",
    automatico: true,
    coletadoEm: "2026-08-28T00:53:48.958Z"
  },
  {
    id: 559715546640,
    slug: "ricardo-ferraco-preve-escolas-integrais-e-aeroporto",
    titulo: "Ricardo Ferraço prevê escolas integrais e aeroporto",
    categoria: "Política ES",
    data: "2026-08-27",
    imagem: "https://uploads.folhavitoria.com.br/imagens/2026/08/Convencao-do-Partido-MDB-10-2048x1369.jpg",
    resumo: "O plano de governo inclui propostas para 19 áreas, como segurança pública, educação, saúde, meio ambiente, gestão, entre outras",
    conteudo: `<p>O plano de governo inclui propostas para 19 áreas, como segurança pública, educação, saúde, meio ambiente, gestão, entre outras</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. Para preservar contexto, autoria e eventuais atualizações posteriores, o texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href=\"https://www.folhavitoria.com.br/eleicoes/plano-de-ricardo-ferraco-preve-escolas-integrais-hospital-veterinario-e-aeroporto-de-cargas/\" target=\"_blank\" rel=\"noopener noreferrer\">Folha Vitória - Política</a>.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "Folha Vitória - Política",
    fonteUrl: "https://www.folhavitoria.com.br/eleicoes/plano-de-ricardo-ferraco-preve-escolas-integrais-hospital-veterinario-e-aeroporto-de-cargas/",
    automatico: true,
    coletadoEm: "2026-08-28T00:53:48.958Z"
  }
];
