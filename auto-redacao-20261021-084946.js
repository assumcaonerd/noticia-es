const noticiasAutoRedacao20261021084946 = [
  // As outras duas matérias desta rodada (pesquisa Flávio x Lula e MP x Campopiano)
  // foram retiradas em 20/11/2026: repetiam matérias de auto-redacao-20261021-075000.js,
  // que ficava escondido porque este arquivo reutilizava o nome da variável dele.
  {
    id: 26102107500002,
    pautaId: "29c3efdb77716573",
    slug: "pazolini-abre-13-pontos-nos-votos-validos",
    titulo: "Pazolini abre 13,6 pontos nos votos válidos",
    categoria: "Política ES",
    data: "2026-10-21",
    imagem: "https://noticiaes.com.br/imagens/lapis/20261021-pazolini-abre-13-pontos-nos-votos-validos.jpg",
    resumo: "Paraná Pesquisas aponta 56,8% para Lorenzo Pazolini e 43,2% para Ricardo Ferraço no segundo turno capixaba.",
    conteudo: `<p>Lorenzo Pazolini alcançou 56,8% dos votos válidos contra 43,2% de Ricardo Ferraço na pesquisa Paraná Pesquisas divulgada nesta quarta-feira (21). A diferença é de 13,6 pontos percentuais a quatro dias do segundo turno para o governo do Espírito Santo.</p><p>Os números foram publicados pelo Poder360 e confirmados em reportagem da Veja. O instituto entrevistou 1.300 eleitores capixabas entre 15 e 19 de outubro, com margem de erro de 2,7 pontos percentuais e nível de confiança de 95%.</p><p>Nos votos totais, que incluem indecisos, brancos e nulos, Pazolini aparece com 52,4% e Ferraço com 39,8%. Outros 3,4% não souberam ou não opinaram, e 4,4% disseram votar em branco, anular ou não escolher nenhum candidato.</p><h2>Diferença supera margem declarada</h2><p>A distância de 12,6 pontos nos votos totais é superior ao intervalo máximo produzido pela margem dos dois candidatos. Ainda assim, pesquisa eleitoral é uma fotografia do período de coleta e não substitui o resultado das urnas. Mudanças de última hora e diferença de comparecimento podem alterar o quadro.</p><p>O levantamento está registrado na Justiça Eleitoral sob o protocolo ES-01531/2026. A divulgação dos dados metodológicos é necessária para que os percentuais possam ser confrontados com outras pesquisas, que usam amostras e formas de entrevista diferentes.</p><p>Uma sondagem Quaest divulgada em 14 de outubro também colocou Pazolini à frente, com 47% dos votos totais, ante 38% de Ferraço. Nesse estudo, brancos e nulos somaram 10% e os indecisos, 5%. A margem era de três pontos percentuais.</p><h2>Primeiro turno explica vantagem</h2><p>Pazolini chegou ao segundo turno depois de receber 49,65% dos votos válidos em 4 de outubro, ficando perto de vencer na primeira rodada. Ferraço obteve 34,06%. Helder Salomão, do PT, terminou em terceiro lugar com 15,32%.</p><p>Na reta final, o candidato do Republicanos tenta conservar a votação do primeiro turno e incorporar parte dos eleitores das candidaturas eliminadas. O governador busca reduzir a diferença, ampliar alianças municipais e convencer eleitores que ainda não definiram o voto.</p><p>A pesquisa indica vantagem de Pazolini, mas a decisão cabe aos eleitores no domingo, 25 de outubro. Até lá, debates, atos de campanha e mobilização das bases podem influenciar o comparecimento. A apuração oficial do Tribunal Superior Eleitoral será a única medida definitiva da disputa.</p>`,
    autor: 'Redação Notícia ES',
    fonteNome: "Poder360",
    fonteUrl: "https://www.poder360.com.br/poder-eleicoes-2026/pazolini-tem-568-e-ferraco-432-no-2o-turno-no-es-diz-pesquisa/",
    fontesAdicionais: [{ nome: "Veja", url: "https://veja.abril.com.br/politica/pesquisa-mostra-como-esta-disputa-pelo-governo-do-espirito-santo-as-vesperas-da-eleicao/" }],
    entidades: ["Lorenzo Pazolini", "Ricardo Ferraço", "Paraná Pesquisas", "TSE"],
    aeo: [
      { pergunta: "Quanto Pazolini tem nos votos válidos?", resposta: "O candidato do Republicanos aparece com 56,8%." },
      { pergunta: "Quanto Ferraço tem nos votos válidos?", resposta: "O governador registra 43,2%." },
      { pergunta: "Qual é a margem de erro?", resposta: "A margem é de 2,7 pontos percentuais para mais ou para menos." },
      { pergunta: "Quantos eleitores foram ouvidos?", resposta: "O Paraná Pesquisas entrevistou 1.300 eleitores do Espírito Santo." },
      { pergunta: "Qual é o registro eleitoral?", resposta: "A pesquisa está registrada sob o protocolo ES-01531/2026." }
    ],
    redacaoPropria: true,
    origemTexto: 'redacao-noticia-es',
    automatico: true,
    publicadoEm: "2026-10-21T11:42:43.000Z"
  }
];
noticiasAutoRedacao20261021084946[0].conteudo = noticiasAutoRedacao20261021084946[0].conteudo.replace('<h2>Primeiro turno explica vantagem</h2>', '<p>Os levantamentos apontam Pazolini na dianteira, mas não formam uma única série. Paraná Pesquisas e Quaest empregam procedimentos próprios, e diferenças entre percentuais podem resultar tanto de mudança do eleitorado quanto de método, amostra e momento da entrevista.</p><h2>Primeiro turno explica vantagem</h2>');
if (typeof noticias !== 'undefined') noticias.unshift(...noticiasAutoRedacao20261021084946);
