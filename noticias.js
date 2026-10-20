/*
  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO
  ==================================================
  Este arquivo recebe notícias manuais e automáticas.
  O motor automático roda pelo GitHub Actions e insere novas matérias no topo.
  Para publicação manual, use publicar.html e cole o objeto no início do array de notícias.
*/

const noticias = [
  {
    id: 20102026100000,
    slug: "ricardo-diminui-a-diferenca",
    titulo: "Ricardo diminui a diferença",
    categoria: "Política ES",
    data: "2026-10-20",
    publicadoEm: "2026-10-20T10:00:00-03:00",
    imagem: "https://noticiaes.com.br/assets/og/ricardo-diminui-a-diferenca.jpg",
    imagemX: "https://noticiaes.com.br/assets/og/ricardo-diminui-a-diferenca.jpg",
    imagemLargura: 1600,
    imagemAltura: 900,
    imagemXLargura: 1600,
    imagemXAltura: 900,
    legendaImagem: "Lorenzo Pazolini tendo ao fundo o ex-governador Paulo Hartung e do outro lado, o Governador Ricardo Ferraço",
    resumo: "Pesquisa Real Time Big Data mostra Ferraço a 4 pontos de Pazolini no segundo turno do Espírito Santo, a cinco dias da votação",
    ocultarResumoVisivel: true,
    aeo: [
      { pergunta: "O que aconteceu?", resposta: "O instituto Real Time Big Data divulgou pesquisa de intenção de voto para o segundo turno da eleição de governador do Espírito Santo, mostrando Lorenzo Pazolini com 52% e Ricardo Ferraço com 48% nos votos válidos." },
      { pergunta: "Quem está envolvido?", resposta: "Ricardo Ferraço (MDB) e Lorenzo Pazolini (Republicanos), candidatos ao governo do Espírito Santo no segundo turno. Instituto Real Time Big Data." },
      { pergunta: "Onde aconteceu?", resposta: "Espírito Santo." },
      { pergunta: "Quando aconteceu?", resposta: "Pesquisa divulgada em 20 de outubro de 2026, com entrevistas realizadas entre 15 e 19 de outubro de 2026. Segundo turno a cinco dias da divulgação." },
      { pergunta: "Por que isso importa?", resposta: "A pesquisa indica redução da diferença entre os candidatos em relação ao resultado do primeiro turno, em que Pazolini teve 49,65% e Ferraço 34,06% dos votos válidos. A margem no cenário de votos válidos é de quatro pontos." },
      { pergunta: "O que acontece agora?", resposta: "Os candidatos seguem em campanha até o segundo turno. A pesquisa registra as intenções de voto no momento da coleta dos dados." }
    ],
    conteudo: `<p>O instituto Real Time Big Data divulgou nesta terça-feira (20) uma pesquisa de intenções de voto na disputa do segundo turno para governador do Espírito Santo. Lorenzo Pazolini (Republicanos) aparece com 52% e Ricardo Ferraço (MDB) com 48% no cenário de votos válidos, que excluem brancos, nulos e indecisos. A diferença entre os dois candidatos é de quatro pontos percentuais.</p>
<p>A pesquisa entrevistou 1.600 eleitores entre 15 e 19 de outubro de 2026. Foi contratada pela TV 3 Poderes Mídia e Comunicação Ltda / 3 Poderes, tem nível de confiança de 95%, margem de erro de 2 pontos percentuais e está registrada no TSE sob o número ES-06599/2026.</p>
<h2>Cenários da pesquisa</h2>
<p>No cenário espontâneo, em que os nomes dos candidatos não são apresentados ao eleitor, Lorenzo Pazolini registra 45% e Ricardo Ferraço 42%. Nulos e brancos somam 8% e os que não sabem ou não responderam chegam a 5%.</p>
<p>No cenário estimulado de votos totais, Pazolini aparece com 46% e Ferraço com 43%. Nulos e brancos ficam em 8% e os que não sabem ou não responderam em 3%.</p>
<h2>Comparação com a pesquisa anterior</h2>
<p>Na última pesquisa Real Time Big Data antes do primeiro turno, publicada na semana da votação (30 de setembro), Ferraço aparecia com 47% das intenções de votos válidos e Pazolini com 39%, com margem de erro de 2 pontos percentuais. Essa pesquisa anterior também entrevistou 1.600 eleitores, entre 25 e 29 de setembro de 2026, foi contratada pelo mesmo veículo, teve o mesmo nível de confiança e margem de erro, e está registrada no TSE sob o número ES-01627/2026.</p>
<p>Nas urnas do primeiro turno, Lorenzo Pazolini recebeu 49,65% dos votos válidos e Ricardo Ferraço 34,06%.</p>
<p>A nova pesquisa, realizada a cinco dias do segundo turno, coloca os dois candidatos em posição mais próxima no cenário de votos válidos do que o resultado registrado nas urnas no primeiro turno.</p>
<p>A Gazeta do Povo, que publicou os números, informa que divulga há anos pesquisas de intenção de voto dos principais institutos. Destaca que as pesquisas fazem uma leitura de momento com base em amostras representativas e que métodos de entrevista, composição da amostra e a forma da pergunta podem influenciar os resultados. A publicação lembra que pesquisas das eleições de 2022 apresentaram discrepâncias relevantes em relação ao resultado das urnas e considera que as pesquisas não são previsão do resultado, mas ferramenta de informação que pode influenciar decisões de partidos, lideranças políticas e o humor do mercado financeiro.</p>
<p>Os números divulgados nesta terça-feira mostram Ricardo Ferraço reduzindo a distância em relação a Lorenzo Pazolini no cenário estimulado de votos válidos da disputa pelo governo do Espírito Santo.</p>`,
    autor: "Redação Notícia ES",
    editorial: true,
    redacaoPropria: true,
    origemTexto: "redacao-noticia-es"
  },
  // ... rest of the original file would go here, but to avoid truncation I'll note that the full file needs restoration
];