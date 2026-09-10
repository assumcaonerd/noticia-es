/*
  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO
  ==================================================
  Este arquivo recebe notícias manuais e automáticas.
  O motor automático roda pelo GitHub Actions e insere novas matérias no topo.
  Para publicação manual, use publicar.html e cole o objeto logo após "const noticias = [".
*/

const noticias = [
  {
    id: 10092026073001,
    slug: "curva-virou-caneta-acelerou-pf-dark-horse-flavio-lula",
    titulo: "A curva virou, a caneta acelerou: operação da PF explode quando Flávio encosta em Lula",
    categoria: "Política Nacional",
    data: "2026-09-10",
    publicadoEm: "2026-09-10T07:30:00-03:00",
    imagem: "https://i.ibb.co/trjLsfx/lula-com-flavio-dino-foto-marcelo-camargo-agencia-brasil-1-960x540.jpg",
    legendaImagem: "Lula e Flávio Dino. Foto: Marcelo Camargo/Agência Brasil",
    resumo: "Recondução de Andrei Rodrigues e operação Dark Horse ocorrem em meio à subida de Flávio Bolsonaro nas pesquisas e ampliam a crise de confiança sobre STF e PF.",
    conteudo: `<p><strong>A Polícia Federal cumpriu, nesta quarta-feira, cerca de 50 mandados de busca em Brasília e São Paulo no âmbito do caso Dark Horse, que envolve a produção de uma cinebiografia de Jair Bolsonaro e emendas parlamentares destinadas a empresas relacionadas ao projeto. Entre os alvos citados estão a empresária Karina Gama e o deputado Mario Frias.</strong></p>
<p>A operação foi realizada um dia depois de o ministro Flávio Dino, do Supremo Tribunal Federal, reverter uma decisão do ministro André Mendonça e restabelecer Andrei Rodrigues no comando da Polícia Federal. A coincidência temporal ganhou imediatamente dimensão política porque ocorreu justamente quando pesquisas eleitorais passaram a indicar uma queda de Luiz Inácio Lula da Silva e um crescimento expressivo de Flávio Bolsonaro na disputa presidencial.</p>
<p>A sucessão dos acontecimentos lançou uma pergunta incômoda no centro de Brasília: a atuação das instituições está seguindo apenas o ritmo das investigações ou passou a acompanhar também o relógio eleitoral?</p>
<p>Flávio Bolsonaro já havia acusado Dino de agir como alguém que teria uma causa política a defender, em vez de apenas um processo para julgar. Também afirmou que o Brasil teria se transformado em uma “terra sem lei” e em uma “várzea”, onde autoridades agiriam sem qualquer preocupação com as aparências.</p>
<p>A operação realizada agora oferece combustível para que essa acusação ganhe força política.</p>
<h2>As pesquisas que acenderam o alerta</h2>
<p>O pano de fundo é uma mudança rápida e simultânea em diferentes levantamentos eleitorais apresentados no material que fundamenta esta reportagem.</p>
<p>Segundo os números atribuídos ao instituto Meio/Ideia, Lula caiu de 43% para 38,4% em uma simulação de primeiro turno. Flávio Bolsonaro, no mesmo intervalo, subiu de 35% para 37,3%. A vantagem que antes parecia confortável foi reduzida a pouco mais de um ponto percentual.</p>
<p>No segundo turno, a transformação seria ainda mais evidente. Um cenário que anteriormente registrava Lula com 48,5% e Flávio com 43% passou a mostrar empate numérico: 46% para cada candidato.</p>
<p>Outros levantamentos mencionados no material caminham na mesma direção. A pesquisa Gerp colocaria Flávio Bolsonaro à frente de Lula no segundo turno, por 47% a 40%. O levantamento BTG/Nexus apontaria, pela primeira vez em sua série, vantagem numérica de Flávio, com 46%, contra 45% de Lula. A Palver também registraria empate no primeiro turno e liderança de Flávio no segundo.</p>
<p>Ao mesmo tempo, a rejeição de Lula teria se aproximado de 49%.</p>
<p>Considerados em conjunto, esses números formam um cenário politicamente explosivo. O presidente, que antes aparecia em posição mais confortável, passa a enfrentar um adversário em ascensão. Flávio Bolsonaro deixa de ser tratado apenas como uma candidatura competitiva e começa a aparecer como uma possibilidade concreta de vitória.</p>
<p>É nesse exato momento que a Polícia Federal avança sobre o caso Dark Horse.</p>
<p>A proximidade entre a mudança das pesquisas, a decisão de Flávio Dino e a operação policial não prova, isoladamente, uma articulação eleitoral. Mas a sequência dos acontecimentos impõe uma cobrança legítima por transparência. Quando uma ação policial alcança pessoas associadas ao círculo político de um candidato presidencial em crescimento, o dever de fundamentação precisa ser ainda mais rigoroso.</p>
<h2>A queda e o retorno de Andrei Rodrigues</h2>
<p>Antes da operação, o ministro André Mendonça havia determinado o afastamento de Andrei Rodrigues do comando da Polícia Federal e também do chefe da área de Inteligência da corporação.</p>
<p>A medida foi provocada por um pedido do Partido Novo, que apontava suposto monitoramento irregular e a utilização de relatórios de inteligência contra o próprio ministro e outras autoridades.</p>
<p>O afastamento, entretanto, durou pouco. Em aproximadamente 24 horas, Flávio Dino reverteu a decisão. O ministro sustentou que um partido político não teria legitimidade para pedir medida cautelar em matéria criminal. Também afirmou que a paralisação da cúpula da Polícia Federal beneficiaria pessoas investigadas.</p>
<p>No mesmo despacho, Dino mencionou elementos relacionados ao filme Dark Horse e emendas destinadas a empresas que também participaram da produção da cinebiografia de Jair Bolsonaro.</p>
<p>Além de reconduzir Andrei Rodrigues ao cargo, o ministro proibiu a adoção de novas medidas contra ele e advertiu que eventual resistência ao cumprimento da decisão poderia caracterizar ilícito.</p>
<p>O efeito foi imediato. Andrei retornou ao comando da corporação. No dia seguinte, a Polícia Federal saiu às ruas para cumprir dezenas de mandados em uma investigação relatada pelo próprio Flávio Dino.</p>
<p>A rapidez da sequência transformou um debate jurídico em uma tempestade política.</p>
<h2>O caso Dark Horse e a acusação de “pesca probatória”</h2>
<p>O argumento central dos críticos da operação é que, até o momento descrito pelo material, não teria sido demonstrado o uso de dinheiro público na produção do filme Dark Horse.</p>
<p>Uma perícia independente, conforme as informações fornecidas, teria concluído que não houve utilização direta ou indireta de recursos públicos no projeto cinematográfico.</p>
<p>Essa conclusão não encerra automaticamente qualquer possibilidade de investigação. Emendas parlamentares e contratos envolvendo empresas relacionadas ao filme podem ser apurados sempre que existirem indícios concretos de irregularidade. A questão está justamente na existência e na qualidade desses indícios.</p>
<p>Sem a apresentação pública de um fato determinado que sustente as buscas, a operação passa a ser acusada por seus críticos de funcionar como uma “pesca probatória”. A expressão é utilizada no meio jurídico para descrever uma investigação ampla, lançada sem delimitação suficientemente clara, na expectativa de que alguma irregularidade seja encontrada durante o caminho.</p>
<p>Nesse cenário, o risco não se limita à apreensão de documentos ou equipamentos. Uma operação dessa dimensão produz imagens, manchetes e repercussão imediata. Portas abertas por agentes, endereços vasculhados e nomes associados a buscas policiais formam uma narrativa pública antes mesmo de qualquer denúncia, julgamento ou condenação.</p>
<p>Na política, a imagem frequentemente chega ao eleitor muito antes dos autos.</p>
<p>Por isso, a preocupação com possíveis vazamentos seletivos ganha relevância. Informações fragmentadas, retiradas de contexto e divulgadas durante a campanha podem provocar um estrago eleitoral impossível de reparar, ainda que posteriormente nenhuma acusação seja confirmada.</p>
<h2>Uma disputa anterior pela relatoria</h2>
<p>Outro elemento que aumenta a desconfiança é a alegação de que já existia uma apuração sobre o mesmo objeto sob responsabilidade de André Mendonça.</p>
<p>Segundo a narrativa apresentada, teria ocorrido uma movimentação destinada a deslocar o tema para Flávio Dino. Caso essa sobreposição seja confirmada, será necessário esclarecer por que duas frentes de apuração alcançaram matérias semelhantes e qual foi o critério utilizado para definir a relatoria.</p>
<p>A competência do relator não é uma formalidade sem importância. Ela determina quem autoriza buscas, analisa pedidos, controla o sigilo e decide o alcance das medidas investigativas.</p>
<p>Em um caso com repercussão eleitoral direta, qualquer dúvida sobre a distribuição do processo enfraquece a confiança pública. A aparência de imparcialidade também integra a legitimidade da Justiça.</p>
<h2>As conexões políticas que aumentam a pressão</h2>
<p>Andrei Rodrigues foi responsável pela segurança de Lula durante a campanha presidencial de 2022. Flávio Dino ocupou o Ministério da Justiça no governo Lula e foi indicado pelo presidente para uma cadeira no Supremo Tribunal Federal.</p>
<p>Esses vínculos anteriores não demonstram, por si mesmos, que exista interferência política na Polícia Federal ou nas decisões de Dino. Autoridades não perdem automaticamente a capacidade de agir com independência por terem ocupado cargos em determinado governo.</p>
<p>Ainda assim, essas relações tornam indispensável um grau superior de cautela.</p>
<p>Quando um ex-ministro indicado por Lula ao Supremo restabelece no cargo um diretor da PF que trabalhou na segurança do próprio Lula, e a corporação realiza no dia seguinte uma operação contra pessoas ligadas ao campo político do adversário que cresce nas pesquisas, a população inevitavelmente exige explicações.</p>
<p>A resposta não pode se resumir a apelos genéricos à autonomia institucional. É preciso apresentar fundamentos concretos, demonstrar a origem das provas e esclarecer por que as medidas foram consideradas urgentes justamente agora.</p>
<h2>A acusação de seletividade</h2>
<p>Os críticos da atuação da Polícia Federal também apontam uma diferença de velocidade entre investigações.</p>
<p>De acordo com o material fornecido, a PF comandada por Andrei Rodrigues avançou sobre o empresário Daniel Vorcaro e sobre o esquema relacionado ao INSS. Ao mesmo tempo, apurações que poderiam alcançar Lulinha, emendas associadas ao Centrão governista ou encontros constrangedores envolvendo ministros seguiriam em outro ritmo.</p>
<p>Flávio Dino também é acusado de ter invalidado, no contexto da CPI do INSS, uma quebra de sigilo considerada politicamente incômoda para o Palácio do Planalto. Agora, o caso Dark Horse avança com dezenas de mandados.</p>
<p>A simples diferença de velocidade entre investigações não comprova favorecimento. Cada procedimento tem provas, dificuldades e necessidades próprias. Porém, quando essa diferença coincide repetidamente com interesses políticos, a suspeita pública deixa de ser uma reação irracional.</p>
<p>Justiça seletiva é aquela que escolhe quem será alcançado, em que momento e com qual intensidade. Uma democracia saudável precisa impedir até mesmo a aparência desse tipo de escolha.</p>
<h2>O alerta feito por Flávio Bolsonaro</h2>
<p>Antes da operação, Flávio Bolsonaro afirmou que Alexandre de Moraes, Davi Alcolumbre e Flávio Dino estariam articulando uma reação contra André Mendonça e uma tentativa de desgaste eleitoral.</p>
<p>O senador acusou autoridades de armarem uma farsa contra adversários políticos e de agirem como se jamais fossem responsabilizadas.</p>
<p>A sequência posterior foi interpretada por seus aliados como confirmação desse alerta: primeiro, Andrei Rodrigues foi reconduzido; depois, a Polícia Federal realizou as buscas; agora, cresce a expectativa sobre quais informações poderão ser divulgadas nos próximos dias.</p>
<p>Essa leitura continua sendo uma acusação política e precisa ser apresentada como tal. Até aqui, o material fornecido não apresenta prova documental de uma ordem expressa para utilizar a operação com finalidade eleitoral.</p>
<p>Mas a ausência dessa prova não elimina o problema institucional provocado pelo calendário. A sucessão dos fatos é objetiva. A interpretação sobre suas motivações permanece em disputa.</p>
<h2>Investigação legítima exige prova, limite e transparência</h2>
<p>O filme Dark Horse pode ser investigado se houver indício de desvio. Empresas que receberam emendas parlamentares também podem e devem prestar contas sobre a aplicação dos recursos. Ninguém envolvido na política está acima da lei.</p>
<p>O mesmo princípio, porém, precisa alcançar quem investiga e quem julga. Mandados de busca não podem servir como ferramenta genérica de pressão. Inquéritos não podem ser utilizados para gerar material eleitoral. Autoridades judiciais precisam evitar decisões que permitam a percepção de alinhamento com qualquer campanha.</p>
<p>Se existem provas de que dinheiro público financiou irregularmente o filme, elas devem ser apresentadas e confrontadas com a perícia independente mencionada no material. Se as emendas foram desviadas, os responsáveis devem responder. Se não houve desvio, a reputação dos atingidos não pode ser destruída por insinuações.</p>
<p>A credibilidade da Polícia Federal e do Supremo depende dessa distinção.</p>
<h2>O voto ainda pertence ao eleitor</h2>
<p>A eleição será decidida em outubro. As pesquisas citadas mostram uma disputa que teria mudado rapidamente, com Lula em queda e Flávio Bolsonaro avançando até o empate ou a liderança numérica em diferentes levantamentos.</p>
<p>Nesse ambiente, qualquer operação contra pessoas próximas a um dos principais candidatos terá impacto político, independentemente da intenção declarada de seus responsáveis.</p>
<p>É por isso que a atuação das instituições precisa ser clara, tecnicamente fundamentada e resistente a qualquer suspeita de manipulação. A toga não pode produzir o desgaste que uma campanha adversária não conseguiu provocar. A Polícia Federal não pode ser percebida como instrumento de correção do placar eleitoral.</p>
<p>Flávio Bolsonaro afirmou que as autoridades “perderam o pudor”. Seus adversários dirão que as instituições estão apenas funcionando. Entre essas duas versões, existem fatos que não podem ser ignorados: Andrei Rodrigues foi afastado, Flávio Dino o reconduziu, a operação ocorreu no dia seguinte e o alvo político indireto é o campo de um candidato que cresce nas pesquisas contra Lula.</p>
<p>Agora, cabe às autoridades revelar as provas, explicar a urgência e demonstrar que o calendário foi apenas uma coincidência.</p>
<p><strong>Até lá, a pergunta permanecerá aberta sobre Brasília: quando a curva eleitoral virou, quem decidiu acelerar a caneta?</strong></p>`,
    autor: "Redação Notícia ES",
    entidades: [
      { tipo: "Person", nome: "Flávio Bolsonaro" },
      { tipo: "Person", nome: "Luiz Inácio Lula da Silva" },
      { tipo: "Person", nome: "Flávio Dino" },
      { tipo: "Person", nome: "Andrei Rodrigues" },
      { tipo: "Person", nome: "André Mendonça" },
      { tipo: "GovernmentOrganization", nome: "Polícia Federal" },
      { tipo: "Organization", nome: "Supremo Tribunal Federal" }
    ],
    aeo: [
      { pergunta: "O que é o caso Dark Horse?", resposta: "É a investigação mencionada na operação da Polícia Federal que envolve a produção de uma cinebiografia de Jair Bolsonaro e emendas parlamentares destinadas a empresas relacionadas ao projeto." },
      { pergunta: "Quantos mandados foram cumpridos?", resposta: "Segundo as informações que fundamentam a reportagem, a Polícia Federal cumpriu cerca de 50 mandados de busca em Brasília e São Paulo." },
      { pergunta: "Por que o momento da operação provocou controvérsia?", resposta: "A operação ocorreu um dia depois da recondução de Andrei Rodrigues ao comando da PF e em meio a pesquisas que indicam crescimento de Flávio Bolsonaro contra Lula." },
      { pergunta: "A coincidência de datas prova interferência eleitoral?", resposta: "Não. A sequência temporal sustenta questionamentos políticos e cobrança por transparência, mas não comprova isoladamente uma articulação eleitoral." }
    ],
    automatico: false
  },
  {
    id: 9092026183001,
    slug: "fachin-tira-moraes-inquerito-fake-news-sete-anos",
    titulo: "Finalmente: Fachin tira de Moraes o Inquérito das Fake News após sete anos",
    categoria: "Política Nacional",
    data: "2026-09-09",
    publicadoEm: "2026-09-09T18:30:00-03:00",
    imagem: "https://i.ibb.co/SDMMs1vQ/fachin-moraes-inquerito-das-fake-news-660x372-jpg.webp",
    legendaImagem: "Edson Fachin revogou a designação de Alexandre de Moraes para a condução do Inquérito 4.781",
    resumo: "Portaria 189 revoga a designação de Alexandre de Moraes no Inquérito 4.781, preserva atos já praticados e devolve procedimentos conexos à Presidência do STF.",
    conteudo: `<p><strong>Depois de sete anos, dois meses e alguns dias, o Inquérito 4.781 deixa de permanecer sob a condução permanente de Alexandre de Moraes. O presidente do Supremo Tribunal Federal, Edson Fachin, assinou a Portaria 189 e revogou a designação do ministro para o chamado Inquérito das Fake News, com efeitos a partir de 9 de setembro de 2026.</strong></p>
<p>A medida altera o comando de um dos procedimentos mais longos, controversos e poderosos da história recente do Supremo. Aberto em março de 2019 por portaria do então presidente da Corte, Dias Toffoli, o inquérito nasceu sem sorteio e teve Moraes escolhido diretamente para apurar “notícias fraudulentas, ameaças e ataques” contra o tribunal.</p>
<p>O plenário do STF posteriormente validou a abertura do procedimento no julgamento da ADPF 572. A partir daí, o inquérito atravessou anos, governos, eleições e crises institucionais. Dele saíram investigações, denúncias, prisões, multas, bloqueios de perfis e outras medidas que atingiram críticos da Corte e personagens da vida política nacional.</p>
<p>A decisão de Fachin não apaga os atos já praticados. Eles permanecem válidos, salvo se forem posteriormente desconstituídos pelos instrumentos jurídicos próprios. Também não retira de Moraes as ações penais nas quais a denúncia já tenha sido recebida.</p>
<p>A mudança alcança o restante da estrutura que se acumulou ao redor do inquérito. Investigações preliminares, petições e procedimentos conexos distribuídos por prevenção retornam à Presidência do Supremo. Caberá a Fachin analisá-los e encaminhá-los à Polícia Federal e, depois, à Procuradoria-Geral da República, que poderá oferecer denúncia ou pedir arquivamento.</p>
<p>É uma correção de rota que chega depois de uma semana em que o conflito interno do STF deixou de ser uma divergência discreta entre gabinetes. A guerra de decisões envolvendo Alexandre de Moraes, André Mendonça, Flávio Dino, a direção da Polícia Federal e o caso Banco Master transformou o problema em uma crise exposta diante do país.</p>
<h2>Um inquérito criado sem sorteio e conduzido por sete anos</h2>
<p>O Inquérito 4.781 foi instaurado em março de 2019 por uma portaria assinada por Dias Toffoli. Não houve sorteio para definir o relator. Alexandre de Moraes foi designado diretamente para conduzir a apuração de ataques, ameaças e informações fraudulentas dirigidas contra integrantes do Supremo e seus familiares.</p>
<p>Essa origem excepcional acompanhou o procedimento durante toda a sua existência. Em vez de uma investigação com prazo delimitado e objeto progressivamente encerrado, o inquérito tornou-se uma estrutura permanente, capaz de receber novos fatos, novos alvos e procedimentos ligados por prevenção.</p>
<p>A validação pelo plenário na ADPF 572 garantiu sustentação institucional ao modelo. Ainda assim, a duração e a concentração de funções permaneceram no centro das críticas. Ao longo dos anos, Moraes esteve à frente de decisões de investigação, busca, bloqueio, prisão, aplicação de multa e restrição de contas em redes sociais.</p>
<p>Para os atingidos, o debate nunca foi apenas teórico. Críticas publicadas na internet passaram a integrar investigações criminais. Postagens foram tratadas como elementos de prova. Salários foram retidos, contas bloqueadas, multas foram impostas e pessoas permaneceram por longos períodos submetidas a tornozeleira eletrônica.</p>
<p>O questionamento central sempre esteve na concentração de poderes. O mesmo gabinete conduzia o inquérito, determinava diligências e julgava pedidos relacionados aos fatos investigados. O procedimento, apresentado como resposta cautelar a uma ameaça excepcional, atravessou mais de sete anos sem um encerramento claramente definido.</p>
<h2>O que muda com a Portaria 189</h2>
<p>A Portaria 189 revoga a designação que mantinha Alexandre de Moraes no comando do Inquérito 4.781. A mudança vale a partir de 9 de setembro de 2026 e encerra a permanência automática do ministro na relatoria de tudo o que continuava chegando ao núcleo do procedimento.</p>
<p>Os efeitos, porém, têm limites precisos. Os atos anteriormente praticados permanecem de pé. Quem pretender anulá-los terá de buscar essa revisão pelas vias processuais adequadas. A portaria também preserva com Moraes as ações penais em que o Supremo já recebeu denúncia.</p>
<p>Nos demais casos, o caminho muda. Inquéritos conexos, petições e investigações preliminares que haviam sido encaminhados ao mesmo relator pelo critério de prevenção voltam para a Presidência da Corte.</p>
<p>Fachin fará a análise inicial e encaminhará o material à Polícia Federal. Após as diligências cabíveis, os autos seguem para a Procuradoria-Geral da República. A PGR deverá então assumir a posição prevista no processo penal: apresentar denúncia quando entender que há prova suficiente ou pedir o arquivamento quando não houver base para acusação.</p>
<p>A alteração devolve ao fluxo institucional funções que, durante anos, ficaram concentradas no inquérito. O presidente do STF deixa de tratar a designação original como uma autorização sem limite de tempo e impõe uma divisão mais clara entre investigação policial, manifestação do Ministério Público e julgamento.</p>
<h2>Fachin já havia anunciado que o fim era urgente</h2>
<p>A portaria não surgiu de maneira isolada. Na sexta-feira, 4 de setembro, Fachin afirmou publicamente que acontecimentos recentes tornavam urgente o encerramento do procedimento. Na mesma manifestação, defendeu a criação de um código de ética e a modernização do Supremo.</p>
<p>As palavras foram pronunciadas no momento em que o Inquérito 4.781 voltava a ocupar o centro de uma disputa entre ministros. Alexandre de Moraes havia utilizado o procedimento para pedir uma investigação contra André Mendonça.</p>
<p>Fachin retirou o pedido daquele inquérito e assumiu sua análise. O gesto já indicava que a Presidência pretendia impedir que a estrutura criada em 2019 continuasse absorvendo qualquer novo conflito relacionado à Corte.</p>
<p>Nos dias seguintes, a crise aumentou. Mendonça determinou o afastamento de Andrei Rodrigues da Direção-Geral da Polícia Federal. Flávio Dino, no dia seguinte, ordenou a reintegração. As duas decisões passaram a produzir comandos opostos sobre a mesma autoridade e sobre o funcionamento da inteligência da corporação.</p>
<p>Fachin então suspendeu as duas decisões, sobrestou o processo sob a condução de Mendonça e convocou sessão presencial do plenário para 15 de setembro, às 10h. A Presidência tentou recolocar no colegiado uma controvérsia que havia se transformado em uma sequência de liminares cruzadas.</p>
<p>A Portaria 189 completa esse movimento de recentralização institucional. Depois de intervir na disputa sobre o comando da PF, Fachin corta a designação que mantinha Moraes como relator permanente do Inquérito das Fake News.</p>
<h2>A decisão chega depois de uma guerra aberta no STF</h2>
<p>A sucessão dos acontecimentos revelou uma Corte dividida. Moraes pediu a investigação de Mendonça dentro do inquérito que conduzia. Mendonça afastou a cúpula da Polícia Federal. Dino anulou, na prática, o afastamento. Fachin suspendeu os dois lados e chamou o plenário.</p>
<p>O conflito ultrapassou o campo das interpretações jurídicas. Decisões individuais começaram a neutralizar decisões individuais, enquanto ministros faziam acusações diretas sobre a conduta de colegas e sobre a atuação da PF.</p>
<p>O modelo do Inquérito 4.781, sustentado por mais de sete anos, passou a ser observado dentro de uma crise na qual o próprio instrumento era usado para alcançar um integrante do Supremo. O que antes atingia principalmente personagens externos chegou ao interior do tribunal.</p>
<p>Ao revogar a designação de Moraes, Fachin estabelece um limite objetivo. Novos desdobramentos já não poderão continuar sendo enviados automaticamente ao mesmo gabinete apenas porque foram ligados ao inquérito original.</p>
<p>A mudança não resolve todas as divergências. O plenário ainda terá de enfrentar os conflitos recentes e estabelecer os limites das decisões proferidas nos diferentes processos. Mas a Presidência retoma o controle de um acervo investigativo que havia permanecido por anos sob uma única relatoria.</p>
<h2>Para os atingidos, o passado continua valendo</h2>
<p>A revogação da designação tem grande peso institucional, mas não repara automaticamente as consequências produzidas desde 2019. Prisões já cumpridas não desaparecem. Valores bloqueados não são liberados apenas pela publicação da portaria. Multas, restrições e danos à reputação não são revertidos em bloco.</p>
<p>Cada ato terá de ser questionado no processo correspondente. A preservação das decisões anteriores significa que a mudança olha prioritariamente para a condução futura do acervo, sem declarar inválido tudo o que foi feito sob a relatoria de Moraes.</p>
<p>Também não há encerramento instantâneo de todas as investigações. A Presidência receberá os procedimentos remanescentes, fará a triagem e os encaminhará para análise da Polícia Federal e da PGR. Casos com prova poderão se transformar em denúncia. Casos sem base poderão terminar em pedido de arquivamento.</p>
<p>Para quem criticou o inquérito desde o início, o passo é tardio diante do tamanho do impacto. Foram mais de sete anos sob um desenho excepcional, com relator fixo, ausência de sorteio na origem e sucessiva incorporação de novos fatos.</p>
<p>Ao mesmo tempo, a portaria rompe uma continuidade que parecia não ter data para acabar. Pela primeira vez, a própria Presidência do Supremo estabelece formalmente que aquela designação não seguirá funcionando como fundamento permanente para concentrar novos procedimentos.</p>
<h2>A exceção finalmente encontra um limite</h2>
<p>Durante anos, o Brasil assistiu à normalização de um inquérito que nasceu de uma decisão administrativa do próprio tribunal, escolheu diretamente seu relator e continuou aberto enquanto acumulava investigações e medidas cautelares.</p>
<p>A justificativa inicial era proteger a Corte contra ameaças, notícias fraudulentas e ataques. Com o tempo, a abrangência do procedimento cresceu e passou a alcançar manifestações políticas, publicações em redes sociais e conflitos que se conectavam ao Supremo por diferentes caminhos.</p>
<p>A Portaria 189 não reescreve essa história. Ela marca o primeiro corte institucional claro na permanência da relatoria. Ao retirar Moraes do comando do inquérito e devolver os procedimentos remanescentes à Presidência, Fachin reconhece, na prática, que a excepcionalidade precisava de um ponto final administrativo.</p>
<p>O próximo teste será o destino concreto do acervo. A credibilidade da mudança dependerá da separação entre casos sustentados por provas e investigações que permaneceram abertas sem fundamento suficiente. A Polícia Federal e a PGR terão papel decisivo nessa filtragem.</p>
<p>Também caberá ao plenário demonstrar se a reorganização vai além de uma resposta momentânea à crise entre ministros. O código de ética mencionado por Fachin, a modernização da Corte e a definição dos limites de decisões individuais permanecem como temas pendentes.</p>
<p>Depois de sete anos, a designação acabou. O estrago alegado por quem foi atingido continua em discussão, os atos permanecem válidos e as ações penais já abertas seguem com Moraes. Ainda assim, uma porta que parecia permanentemente fechada foi finalmente aberta: o inquérito volta a ter caminho institucional para denúncia ou arquivamento.</p>
<p><strong>Fachin colocou a conta sobre a mesa do próprio Supremo. Agora a Corte terá de escolher entre reconduzir cada investigação ao rito legal ou preservar, sob outro nome, a exceção que permitiu durante sete anos.</strong></p>`,
    autor: "Redação Notícia ES",
    entidades: [
      { tipo: "Person", nome: "Edson Fachin" },
      { tipo: "Person", nome: "Alexandre de Moraes" },
      { tipo: "Person", nome: "André Mendonça" },
      { tipo: "Person", nome: "Flávio Dino" },
      { tipo: "Organization", nome: "Supremo Tribunal Federal" },
      { tipo: "GovernmentOrganization", nome: "Polícia Federal" },
      { tipo: "GovernmentOrganization", nome: "Procuradoria-Geral da República" }
    ],
    aeo: [
      { pergunta: "O que Fachin decidiu sobre o Inquérito das Fake News?", resposta: "A Portaria 189 revogou a designação de Alexandre de Moraes para a condução do Inquérito 4.781 a partir de 9 de setembro de 2026." },
      { pergunta: "Os atos já praticados foram anulados?", resposta: "Não. Os atos permanecem válidos, salvo se forem posteriormente desconstituídos pelas vias jurídicas próprias." },
      { pergunta: "Moraes perde todas as ações relacionadas ao inquérito?", resposta: "Não. As ações penais em que a denúncia já foi recebida continuam sob sua relatoria." },
      { pergunta: "O que acontece com os procedimentos restantes?", resposta: "Inquéritos conexos, petições e investigações preliminares retornam à Presidência do STF para análise e encaminhamento à Polícia Federal e à PGR." },
      { pergunta: "Quando o Inquérito 4.781 foi aberto?", resposta: "O procedimento foi aberto em março de 2019 por portaria do então presidente do STF, Dias Toffoli." },
      { pergunta: "O inquérito foi encerrado imediatamente?", resposta: "Não. A portaria encerra a designação permanente do relator e reorganiza o destino dos procedimentos remanescentes." }
    ],
    automatico: false
  },
  {
    id: 9092026174501,
    slug: "tre-es-indefere-candidatura-armandinho-falsidade-ideologica",
    titulo: "TRE-ES barra candidatura de Armandinho após condenação por falsidade ideológica",
    categoria: "Política Estadual",
    data: "2026-09-09",
    publicadoEm: "2026-09-09T17:45:00-03:00",
    imagem: "https://i.ibb.co/SXG39JXF/Chat-GPT-Image-9-de-set-de-2026-17-39-50.png",
    legendaImagem: "O TRE do Espírito Santo indeferiu por unanimidade o registro de candidatura de Armandinho Fontoura a deputado estadual",
    resumo: "Decisão unânime aplica a Lei da Ficha Limpa após condenação colegiada no caso do perfil ‘Dra. Laura’; defesa ainda pode recorrer ao TSE.",
    conteudo: `<p><strong>O Tribunal Regional Eleitoral do Espírito Santo indeferiu, por unanimidade, nesta quarta-feira, 9 de setembro de 2026, o registro da candidatura do vereador Armandinho Fontoura, do PL, a deputado estadual. A decisão retira, por ora, o candidato da disputa pela Assembleia Legislativa a menos de um mês do primeiro turno, marcado para 4 de outubro.</strong></p>
<p>O fundamento que derrubou o registro é uma condenação criminal imposta por órgão colegiado. Em 18 de agosto, a 1ª Câmara Criminal do Tribunal de Justiça do Espírito Santo condenou Armandinho por falsidade ideológica, delito previsto no artigo 299 do Código Penal e classificado como crime contra a fé pública.</p>
<p>A consequência chegou imediatamente à Justiça Eleitoral. A Lei Complementar nº 64/1990, conhecida como Lei da Ficha Limpa, estabelece a inelegibilidade de quem é condenado por órgão colegiado por crimes dessa natureza. A regra não exige o trânsito em julgado, isto é, não obriga a Justiça Eleitoral a esperar que se esgotem todos os recursos na esfera criminal.</p>
<p>Foi esse enquadramento que sustentou a Ação de Impugnação de Registro de Candidatura nº 0600588-19.2026.6.08.0000, apresentada pelo Ministério Público Eleitoral e acolhida pelo TRE-ES. A jornalista Fabiana Tostes esteve entre as primeiras a noticiar o resultado do julgamento.</p>
<p>A decisão é um golpe direto no projeto político de Armandinho. Vereador reeleito de Vitória, ele tentava levar para a disputa estadual o número 22456 e uma votação municipal que quase triplicou entre 2020 e 2024. Agora, seu nome depende de uma reversão no Tribunal Superior Eleitoral para chegar à urna.</p>
<h2>Ficha Limpa alcança a candidatura imediatamente</h2>
<p>O centro jurídico do caso é objetivo. A alínea “e”, item 1, do inciso I do artigo 1º da Lei Complementar nº 64/1990 inclui entre as causas de inelegibilidade a condenação proferida por órgão judicial colegiado em crimes contra a fé pública. Falsidade ideológica pertence exatamente a essa categoria.</p>
<p>Ao analisar o registro, o tribunal eleitoral não refaz o julgamento criminal. A Súmula 41 do TSE impede que a Justiça Eleitoral reexamine o acerto ou o erro da decisão proferida pela Justiça comum. O trabalho do TRE, nesse estágio, consiste em verificar se existe condenação colegiada e se o crime reconhecido está entre aqueles previstos pela Ficha Limpa.</p>
<p>No caso de Armandinho, os dois elementos foram identificados: a decisão partiu da 1ª Câmara Criminal do TJES, um colegiado, e a condenação foi por falsidade ideológica, crime contra a fé pública. A partir dessa combinação, o Ministério Público Eleitoral pediu a impugnação e o TRE acolheu o pedido sem divergência.</p>
<p>A unanimidade dá peso político ao resultado, mas não encerra o caminho processual. Cabe recurso ao TSE. Até que o tribunal superior se manifeste, a situação da candidatura permanece submetida ao relógio apertado da eleição.</p>
<h2>O caso “Dra. Laura” começou em 2018</h2>
<p>A origem da condenação está em fatos atribuídos a Armandinho quando ele ainda atuava como secretário parlamentar, em 2018. Segundo o histórico do processo, Armando Fontoura Borges Filho, seu nome de registro, teria usado dados do ex-vereador Max da Mata para cadastrar uma linha de celular.</p>
<p>Essa linha teria sido utilizada para criar no WhatsApp um perfil chamado “Dra. Laura”. Por meio da conta, foram divulgadas mensagens e montagens que associavam o advogado Luciano Ceotto a um esquema da Operação Lava Jato.</p>
<p>A Polícia Civil concluiu o inquérito em 2020. A apuração deu origem a duas ações judiciais distintas. Uma delas, de natureza pública, foi proposta pelo Ministério Público Estadual e tratou das acusações de falsidade ideológica e denunciação caluniosa. A outra, privada, foi movida por Luciano Ceotto e abordou crimes contra a honra.</p>
<p>Esses processos tiveram trajetórias diferentes. A distinção é decisiva para compreender por que o registro foi indeferido agora e por que outros episódios judiciais não foram usados como fundamento para a decisão eleitoral desta quarta-feira.</p>
<h2>Absolvição em primeiro grau foi reformada pelo TJES</h2>
<p>Na ação pública, Armandinho havia sido absolvido em fevereiro de 2025 pelo juiz Luiz Guilherme Risso, da 2ª Vara Criminal de Vitória. O magistrado entendeu que uma montagem gráfica publicada na internet não configuraria “documento penalmente relevante” para caracterizar falsidade ideológica. Com essa interpretação, considerou a conduta atípica.</p>
<p>O desfecho mudou no julgamento da apelação. A 1ª Câmara Criminal do TJES reformou a absolvição e condenou Armandinho por falsidade ideológica. Ao mesmo tempo, manteve a absolvição quanto à acusação de denunciação caluniosa.</p>
<p>A pena foi fixada em 2 anos e 3 meses de reclusão, em regime aberto, além de 23 dias-multa. A prisão foi substituída por prestação de serviços à comunidade e pelo pagamento de prestação pecuniária de R$ 50 mil.</p>
<p>Para o processo eleitoral, o ponto determinante não foi o regime da pena nem sua substituição. O elemento decisivo foi a existência de uma condenação colegiada por crime contra a fé pública. A partir da publicação desse julgamento, a barreira prevista na Ficha Limpa passou a incidir sobre a candidatura.</p>
<h2>A outra ação foi anulada e voltou à instrução</h2>
<p>Na ação privada apresentada por Luciano Ceotto, o juiz Luiz Guilherme Risso havia condenado Armandinho por injúria e difamação. A pena foi convertida no pagamento de 15 salários mínimos, acompanhado de R$ 10 mil a título de reparação.</p>
<p>Essa condenação, porém, foi anulada em maio de 2026 pela 2ª Câmara Criminal do TJES. O colegiado reconheceu cerceamento de defesa porque testemunhas indicadas pelo réu não haviam sido ouvidas. Com a anulação, o processo retornou à fase de instrução.</p>
<p>Portanto, não foi essa ação privada que tornou Armandinho inelegível. O indeferimento decidido pelo TRE-ES está vinculado especificamente à condenação proferida pela 1ª Câmara Criminal na ação pública, por falsidade ideológica.</p>
<h2>Bloqueio pode alcançar 2034</h2>
<p>Pela regra da Ficha Limpa, o prazo de oito anos de inelegibilidade começa a ser contado depois do cumprimento da pena. Na projeção apresentada pelo Ministério Público Eleitoral e reproduzida pela cobertura local, o impedimento pode alcançar 2034.</p>
<p>A data final ainda poderá ser discutida em recurso. A contagem exata depende do momento em que a pena alternativa será considerada cumprida e da forma como o TSE aplicará a legislação após as mudanças ocorridas em 2025.</p>
<p>Essa controvérsia sobre o término da inelegibilidade não altera o efeito imediato do julgamento. Sem o registro deferido, o nome do candidato não entra na urna, a menos que o TSE reverta a decisão ou conceda uma medida que assegure sua participação a tempo.</p>
<p>Armandinho pode continuar praticando atos de campanha enquanto o pedido estiver sub judice. Essa possibilidade, contudo, não equivale à garantia de presença na urna. Se houver recurso e o TSE não conceder uma liminar ou não reformar o indeferimento antes da preparação final do pleito, a candidatura ficará fora da votação.</p>
<h2>Uma ascensão política interrompida</h2>
<p>Armandinho nasceu em Vitória em 25 de julho de 1991. Empresário, com ensino superior completo e atualmente filiado ao PL, construiu sua trajetória eleitoral na Câmara Municipal da capital.</p>
<p>Foi eleito vereador pelo DEM em 2016, pelo Podemos em 2020 e pelo PL em 2024. Na eleição municipal mais recente, recebeu 3.076 votos, quase três vezes o resultado obtido quatro anos antes. O crescimento nas urnas servia como plataforma para a tentativa de chegar à Assembleia Legislativa.</p>
<p>Em 2025, destacou-se como o vereador de maior produção na Câmara de Vitória. Sua atuação reuniu dezenas de projetos, milhares de indicações, gabinete itinerante, a chamada Lei Anti-Oruam e uma comissão voltada ao combate ao crime organizado.</p>
<p>Esse volume político tornava a candidatura estadual uma etapa natural de expansão. A decisão unânime do TRE interrompe esse movimento no ponto mais sensível da campanha: faltando poucas semanas para o primeiro turno e quando cada dia disponível para recurso passa a ter peso decisivo.</p>
<h2>Outras condenações estão na esteira, mas não decidiram o registro</h2>
<p>O vereador também responde a outras decisões judiciais. Em junho de 2025, a 2ª Vara Criminal o condenou em primeiro grau por coação contra a juíza Gisele Souza de Oliveira e o promotor Rafael Calhau Bastos.</p>
<p>Nesse processo, a pena foi fixada em 3 anos e 3 meses, em regime aberto, e convertida em medidas restritivas de direitos. Também foi determinada reparação de R$ 5 mil para cada vítima. A defesa alegou contradições e recorreu.</p>
<p>Em julho de 2026, a 10ª Vara Criminal condenou Armandinho por injúria e difamação contra a jornalista Fabiana Tostes, em razão de declarações feitas na tribuna da Câmara em maio de 2025. A pena foi convertida em prestação de serviços, com reparação de R$ 15 mil. Ele foi absolvido da acusação de calúnia nesse processo.</p>
<p>Nenhuma dessas duas decisões, isoladamente, explica o indeferimento anunciado nesta quarta-feira. A Justiça Eleitoral utilizou a condenação colegiada por falsidade ideológica no caso “Dra. Laura”. Separar os processos evita transformar o histórico judicial em uma acusação genérica e permite identificar com precisão qual decisão produziu a inelegibilidade.</p>
<h2>Campanha entra em contagem regressiva</h2>
<p>Em agosto, enquanto a ação de impugnação ainda tramitava, Armandinho afirmou que manteria sua campanha e que estava convicto de vencer a disputa judicial. Com o indeferimento unânime, essa estratégia passa a depender diretamente da velocidade e do resultado do recurso ao TSE.</p>
<p>O calendário é implacável. O primeiro turno será realizado em 4 de outubro. Entre a decisão do TRE e a votação, há menos de um mês para que a defesa provoque o tribunal superior e tente obter uma resposta capaz de recolocar o candidato na disputa.</p>
<p>O julgamento desta quarta-feira não atinge automaticamente o atual mandato de vereador em Vitória. O processo analisado trata do registro da candidatura a deputado estadual. Eventuais efeitos sobre o cargo municipal pertencem a outra discussão jurídica e não foram definidos por essa decisão eleitoral.</p>
<p>O quadro imediato pode ser resumido sem atalhos: o registro foi indeferido por unanimidade; a causa é a condenação colegiada por falsidade ideológica no caso “Dra. Laura”; a inelegibilidade, se mantida, atravessa a eleição de 2026 e pode se prolongar até 2034; e ainda cabe recurso ao Tribunal Superior Eleitoral.</p>
<p><strong>Armandinho ainda pode recorrer, mas agora corre contra dois adversários que nenhuma campanha controla: a Ficha Limpa e o calendário. Sem uma virada no TSE, o número 22456 não chegará à urna.</strong></p>`,
    autor: "Redação Notícia ES",
    entidades: [
      { tipo: "Person", nome: "Armandinho Fontoura" },
      { tipo: "Organization", nome: "Tribunal Regional Eleitoral do Espírito Santo" },
      { tipo: "Organization", nome: "Tribunal de Justiça do Espírito Santo" },
      { tipo: "Organization", nome: "Tribunal Superior Eleitoral" },
      { tipo: "PoliticalParty", nome: "PL" }
    ],
    aeo: [
      { pergunta: "Por que o TRE-ES indeferiu a candidatura de Armandinho?", resposta: "Porque ele foi condenado por órgão colegiado por falsidade ideológica, crime contra a fé pública alcançado pela Lei da Ficha Limpa." },
      { pergunta: "A decisão foi unânime?", resposta: "Sim. O Tribunal Regional Eleitoral do Espírito Santo indeferiu o registro por unanimidade em 9 de setembro de 2026." },
      { pergunta: "Armandinho ainda pode recorrer?", resposta: "Sim. A defesa pode recorrer ao Tribunal Superior Eleitoral e tentar reverter a decisão a tempo da eleição." },
      { pergunta: "Qual processo provocou a inelegibilidade?", resposta: "A condenação colegiada por falsidade ideológica no caso do perfil de WhatsApp chamado ‘Dra. Laura’." },
      { pergunta: "O nome pode entrar na urna?", resposta: "Sem reforma da decisão ou medida favorável do TSE em tempo hábil, o nome fica fora da urna." },
      { pergunta: "O mandato de vereador foi afetado?", resposta: "Não por esta decisão. O julgamento trata do registro da candidatura a deputado estadual." }
    ],
    automatico: false
  },
  {
    id: 9092026102501,
    slug: "guerra-stf-dino-reintegra-cupula-pf-desafia-mendonca",
    titulo: "Guerra aberta no STF: Dino reintegra cúpula da PF e desafia decisão de Mendonça",
    categoria: "Política Nacional",
    data: "2026-09-09",
    publicadoEm: "2026-09-09T10:25:00-03:00",
    imagem: "https://i.ibb.co/VYLf5cPw/Chat-GPT-Image-9-de-set-de-2026-10-20-10.png",
    legendaImagem: "Flávio Dino determinou a reintegração de Andrei Rodrigues e Leandro Almada menos de 24 horas após os afastamentos ordenados por André Mendonça",
    resumo: "Em menos de 24 horas, ministro manda reintegrar Andrei Rodrigues e Leandro Almada, reativa a inteligência da PF e impede nova cautelar baseada no cumprimento de ordens judiciais.",
    conteudo: `<p><strong>A crise que começou com mensagens extraídas do celular do banqueiro Daniel Vorcaro, atravessou as investigações do Banco Master e do INSS e alcançou a cúpula da Polícia Federal explodiu, nesta quarta-feira, 9 de setembro, no centro do Supremo Tribunal Federal.</strong></p>
<p>Em menos de 24 horas, o ministro Flávio Dino anulou, na prática, os principais efeitos da decisão do ministro André Mendonça que havia afastado preventivamente Andrei Augusto Passos Rodrigues da Direção-Geral da Polícia Federal e Leandro Almada da Costa da Diretoria de Inteligência da corporação.</p>
<p>Dino determinou ao presidente da República a reintegração imediata dos dois servidores, restabeleceu integralmente suas funções, ordenou a retomada das atividades de inteligência e impôs uma barreira contra novas medidas cautelares fundamentadas apenas em atos praticados no exercício regular dos cargos ou no cumprimento de ordens judiciais.</p>
<p>A decisão foi tomada em um processo diferente daquele em que ocorreu o afastamento. Dino utilizou a investigação sobre emendas destinadas ao filme <em>Dark Horse</em>, uma cinebiografia de Jair Bolsonaro, para devolver os dois dirigentes aos postos dos quais Mendonça os havia retirado.</p>
<p>O confronto institucional está exposto. Na terça-feira, 8 de setembro, Mendonça afastou os dirigentes. Luiz Fux e Nunes Marques acompanharam o relator, formando maioria na Segunda Turma do Supremo. Gilmar Mendes pediu vista e suspendeu o julgamento, mas a liminar permanecia válida.</p>
<p>Na quarta-feira, antes da devolução da vista, antes de uma manifestação definitiva do colegiado e antes da conclusão da apuração determinada à Corregedoria da Polícia Federal, Dino ordenou a reintegração.</p>
<p>O resultado é uma situação raríssima: uma decisão individual neutralizando os efeitos de outra decisão individual que já contava com maioria formada em uma das turmas do próprio Supremo.</p>
<h2>A ordem que afastou a cúpula da PF</h2>
<p>A decisão de André Mendonça não se limitou ao afastamento de Andrei Rodrigues e Leandro Almada.</p>
<p>O ministro também determinou a interrupção da produção e do compartilhamento de relatórios de inteligência que analisassem atos praticados por magistrados, integrantes da advocacia pública ou autoridades da polícia judiciária. Mandou, ainda, que a Corregedoria da Polícia Federal instaurasse apuração penal e disciplinar para identificar responsabilidades.</p>
<p>No centro da decisão estavam pelo menos seis documentos encaminhados por Andrei Rodrigues ao ministro Alexandre de Moraes, no âmbito do inquérito das fake news.</p>
<p>Os relatórios teriam sido produzidos entre 3 e 31 de agosto. Segundo os elementos descritos por Mendonça, os papéis não apresentavam timbre, brasão, assinatura ou numeração oficial. Internamente, teriam sido classificados pela própria corporação como materiais de “confiança agregada baixa” e “sem valor probatório”.</p>
<p>Apesar dessas limitações, os documentos chegaram ao Supremo e foram usados no ambiente de uma investigação judicial.</p>
<p>Na avaliação de Mendonça, os relatórios serviram para monitorar, por mais de 30 dias, o próprio ministro responsável pelos casos envolvendo o Banco Master e o INSS, além do advogado-geral da União, Jorge Messias.</p>
<p>Os papéis empregavam expressões como “monitoramento e coleta dirigida”. Também avaliavam a conduta de integrante do Supremo, a meritocracia dentro da Advocacia-Geral da União e o trabalho de outros delegados da Polícia Federal.</p>
<p>Um dos trechos continha informações sobre investigação em andamento contra Antonio Rueda e ACM Neto. Para Mendonça, a exposição desses dados poderia comprometer a eficácia de medidas cautelares.</p>
<p>O ministro classificou o conjunto como monitoramento ilícito de integrante da Corte. Citou precedentes que autorizam o afastamento de autoridades com poder para interferir em investigações e determinou que fossem identificados os responsáveis pelas ordens, pela redação e pelo encaminhamento dos documentos.</p>
<p>Mendonça também exigiu que se apurasse a existência de outros relatórios semelhantes.</p>
<h2>O celular de Vorcaro e o início da escalada</h2>
<p>O estopim público da crise surgiu em outra investigação.</p>
<p>Em 1º de setembro, André Mendonça retirou o sigilo de um relatório com mais de 200 páginas produzido a partir do conteúdo extraído do celular de Daniel Vorcaro, do Banco Master. Entre as mensagens analisadas, aparecia o nome “Andrei”.</p>
<p>No dia seguinte, 2 de setembro, o Partido Novo pediu providências para preservar as investigações. Em 3 de setembro, a legenda apresentou novo pedido, desta vez requerendo a prisão preventiva de Andrei Rodrigues e apontando a possível existência de uma rede de influência.</p>
<p>Também no dia 3, Alexandre de Moraes publicou trechos dos relatórios produzidos pela Polícia Federal e pediu que André Mendonça passasse a integrar o inquérito das fake news.</p>
<p>A partir desse momento, a controvérsia deixou de envolver apenas os casos Banco Master e INSS. O embate alcançou diferentes gabinetes do Supremo, expôs divergências sobre a atuação da Polícia Federal e colocou o comando da corporação no centro de uma disputa entre ministros.</p>
<p>Foi nesse ambiente que Mendonça determinou os afastamentos.</p>
<p>A Segunda Turma começou a analisar a liminar. Luiz Fux e Nunes Marques acompanharam o relator. Com três votos, estava formada a maioria pela manutenção da medida. Gilmar Mendes pediu vista, suspendendo a conclusão formal do julgamento.</p>
<p>Até que o processo retornasse à pauta, a decisão de Mendonça continuava produzindo efeitos. Continuava, ao menos, até a intervenção de Flávio Dino.</p>
<h2>Dino usa o caso <em>Dark Horse</em> para reintegrar os dirigentes</h2>
<p>O recurso analisado por Dino foi apresentado pelo próprio Andrei Rodrigues no processo relacionado às emendas destinadas ao filme <em>Dark Horse</em>.</p>
<p>Andrei sustentou que seu afastamento havia desorganizado a equipe responsável pela investigação, atrasado o acesso a materiais em poder da Polícia Civil de São Paulo e comprometido a velocidade de uma apuração considerada urgente.</p>
<p>Dino acolheu o argumento.</p>
<p>Em sua decisão, determinou ao presidente da República a reintegração imediata de Andrei Rodrigues e Leandro Almada, com o restabelecimento integral das respectivas atribuições. Também mandou que as atividades da Diretoria de Inteligência voltassem a funcionar.</p>
<p>O ministro proibiu a imposição de nova medida cautelar pessoal baseada exclusivamente em ato praticado no exercício regular do cargo ou no cumprimento de ordem judicial. Nesse contexto, a proteção alcança atos relacionados ao atendimento de determinações expedidas por Alexandre de Moraes.</p>
<p>Dino ainda estabeleceu que sua decisão somente poderá ser revista pelo plenário do Supremo.</p>
<p>A medida foi tomada sem esperar o julgamento definitivo da Segunda Turma, sem aguardar a devolução da vista de Gilmar Mendes e sem esperar o resultado da investigação determinada à Corregedoria da Polícia Federal.</p>
<p>Na prática, a liminar de um ministro avançou sobre os efeitos da liminar de outro, embora esta já tivesse recebido o apoio da maioria do colegiado competente.</p>
<h2>Ataques diretos à decisão de Mendonça</h2>
<p>Dino não se limitou a apresentar uma interpretação jurídica diferente. O texto da decisão contém críticas diretas e severas à atuação do colega.</p>
<p>O ministro classificou a interrupção dos relatórios de inteligência como “medida inédita na história da corporação”.</p>
<p>Afirmou que Mendonça poderia ter “divergências funcionais ou pessoais com a Polícia Federal” e defender seus direitos “na instância própria”, mas declarou que tais divergências não poderiam resultar em uma “decisão em causa própria” capaz de paralisar investigações.</p>
<p>Dino também escreveu que não seria admissível interromper uma apuração urgente “como se houvesse um único inquérito e um único julgador a envergar a toga do STF”.</p>
<p>A linguagem revela a profundidade do conflito. Um ministro do Supremo atribuiu publicamente a outro a possibilidade de ter agido em causa própria e sugeriu a existência de divergências pessoais ou funcionais com a Polícia Federal.</p>
<p>Para justificar a necessidade de manutenção das atividades de inteligência, Dino mencionou investigações relacionadas ao assassinato de Marielle Franco, à venda de decisões judiciais e a fraudes financeiras. Segundo sua linha de raciocínio, a paralisação da estrutura atingiria diversos casos relevantes, e não apenas a investigação que provocou o afastamento.</p>
<p>Dino também considerou o Partido Novo parte ilegítima para formular pedidos de cautelares pessoais no processo penal. Ao lembrar que a legenda possui candidato à Presidência da República, afirmou que partido político não tem legitimidade para requerer esse tipo de medida com base no Código de Processo Penal.</p>
<p>O ministro recorreu ainda ao procedimento aberto pelo presidente do STF, Edson Fachin, para levar o conflito ao plenário. Usou essa iniciativa como fundamento para sustentar que Mendonça não deveria ter decidido sozinho.</p>
<p>A crítica, contudo, foi registrada quando a Segunda Turma já havia formado maioria pela manutenção do afastamento.</p>
<h2>A reunião de Mendonça com Daniel Vorcaro</h2>
<p>Outro ponto explosivo surgiu quando Dino incluiu em sua decisão uma referência à reunião mantida por André Mendonça com Daniel Vorcaro em março de 2025.</p>
<p>O encontro ocorreu em uma empresa privada e teria sido intermediado por pessoas mencionadas em investigação. Dino declarou que não estava fazendo juízo de valor sobre o episódio, mas classificou a situação como “complexa”, especialmente em ano eleitoral.</p>
<p>Mendonça já havia confirmado a reunião. Segundo sua versão, encontrou Vorcaro uma única vez para tratar de precatórios ligados à STP 976. O encontro teria ocorrido antes de o ministro se tornar relator do caso Banco Master, o que aconteceu em fevereiro de 2026.</p>
<p>Mendonça também afirmou que sua decisão no processo dos precatórios foi contrária ao interesse do banco.</p>
<p>Mesmo com essas explicações, Dino inseriu o episódio no mesmo documento em que determinou a volta de Andrei Rodrigues e Leandro Almada aos respectivos cargos.</p>
<p>O efeito político e institucional é inevitável. A reunião passou a integrar formalmente a disputa entre os dois ministros justamente no momento em que Mendonça investiga documentos que, em sua avaliação, foram produzidos para monitorá-lo.</p>
<h2>AGU entrou no conflito antes da decisão</h2>
<p>Na véspera da decisão de Dino, a Advocacia-Geral da União já havia procurado o presidente do STF, Edson Fachin.</p>
<p>A AGU sustentou que somente o presidente da República possui competência para nomear e exonerar o diretor-geral da Polícia Federal. O argumento questionava, portanto, a possibilidade de afastamento judicial de Andrei Rodrigues.</p>
<p>Dino incorporou essa controvérsia ao determinar que o presidente da República realizasse a reintegração imediata.</p>
<p>O Planalto, assim, recebeu uma ordem direta para restabelecer no comando da PF o homem escolhido por Luiz Inácio Lula da Silva para dirigir a corporação.</p>
<p>Andrei Rodrigues não ocupa um posto técnico isolado. Ele comanda toda a Polícia Federal. Os relatórios encaminhados a Alexandre de Moraes saíram da estrutura sob sua direção. Leandro Almada, por sua vez, comandava a área de inteligência responsável pelos documentos cuja produção Mendonça mandou investigar.</p>
<p>Dino considerou que o afastamento produzia um “caos administrativo imposto externamente”. O elemento “externo”, no caso, era uma ordem expedida por outro ministro do Supremo e apoiada pela maioria já formada na Segunda Turma.</p>
<h2>Duas decisões e uma pergunta: quem manda?</h2>
<p>A sequência dos acontecimentos desenha um cenário institucional sem disfarces.</p>
<p>André Mendonça afastou os dois principais dirigentes envolvidos na cadeia de produção e encaminhamento de relatórios que considerou apócrifos. Determinou investigação penal e disciplinar, bloqueou a continuidade desse tipo de monitoramento e obteve maioria na Segunda Turma.</p>
<p>No dia seguinte, Flávio Dino utilizou outro processo, sob sua própria relatoria, para reintegrar os dirigentes, reativar a inteligência da PF e impedir novas cautelares fundamentadas apenas no cumprimento de ordens judiciais.</p>
<p>Tudo ocorreu sem decisão do plenário, sem conclusão do julgamento na turma e sem resposta da Corregedoria.</p>
<p>No mesmo tabuleiro estão o Banco Master, as fraudes do INSS, Daniel Vorcaro, Alexandre de Moraes, André Mendonça, Flávio Dino, a Advocacia-Geral da União, a direção da Polícia Federal e uma investigação sobre recursos destinados a um filme de Jair Bolsonaro.</p>
<p>A disputa acontece em pleno ano eleitoral.</p>
<p>O Supremo agora enfrenta uma questão que ultrapassa os nomes de Mendonça, Dino, Andrei ou Almada. A Corte precisará definir se um ministro pode, por meio de processo diferente, neutralizar uma decisão de outro integrante do tribunal que já recebeu o apoio da maioria de uma turma.</p>
<p>Até que o plenário responda, a ordem que prevalece é a de Flávio Dino.</p>
<p>Andrei Rodrigues volta ao comando da Polícia Federal. Leandro Almada retorna à Diretoria de Inteligência. A estrutura que produziu os documentos questionados por Mendonça é reativada. E o ministro que ordenou os afastamentos recebe, por escrito, a acusação de ter proferido uma decisão em causa própria.</p>
<p>Em menos de 24 horas, a crise deixou de ser apenas da Polícia Federal. Passou a ser uma crise do próprio Supremo, diante de um país que assiste a ministros anularem, na prática, as decisões uns dos outros.</p>
<p><strong>Quando duas canetas da mais alta Corte apontam em direções opostas, a dúvida deixa de estar restrita aos autos: quem, afinal, tem a última palavra no Supremo Tribunal Federal?</strong></p>`,
    autor: "Redação Notícia ES",
    entidades: [
      { tipo: "Person", nome: "Flávio Dino" },
      { tipo: "Person", nome: "André Mendonça" },
      { tipo: "Person", nome: "Andrei Rodrigues" },
      { tipo: "Person", nome: "Leandro Almada" },
      { tipo: "Organization", nome: "Supremo Tribunal Federal" },
      { tipo: "GovernmentOrganization", nome: "Polícia Federal" }
    ],
    aeo: [
      { pergunta: "O que Flávio Dino decidiu?", resposta: "Determinou a reintegração imediata de Andrei Rodrigues e Leandro Almada, restabeleceu suas funções e mandou retomar as atividades de inteligência da Polícia Federal." },
      { pergunta: "Quem havia afastado os dirigentes da PF?", resposta: "O ministro André Mendonça havia determinado preventivamente o afastamento de Andrei Rodrigues e Leandro Almada." },
      { pergunta: "A Segunda Turma apoiou o afastamento?", resposta: "Luiz Fux e Nunes Marques acompanharam Mendonça, formando maioria, antes de Gilmar Mendes pedir vista e suspender a conclusão formal do julgamento." },
      { pergunta: "Em qual processo Dino determinou a reintegração?", resposta: "No processo relacionado às emendas destinadas ao filme Dark Horse, cinebiografia de Jair Bolsonaro." },
      { pergunta: "Por que os relatórios da PF foram questionados?", resposta: "Segundo os elementos descritos por Mendonça, os documentos não tinham timbre, brasão, assinatura ou numeração e teriam sido usados para monitoramento dirigido." },
      { pergunta: "Quem poderá rever a decisão de Dino?", resposta: "Dino estabeleceu que sua decisão somente poderá ser revista pelo plenário do Supremo Tribunal Federal." }
    ],
    automatico: false
  },
  {
    id: 8092026023901,
    slug: "espirito-santo-credito-barragens-rurais-bandes-seguranca-hidrica",
    titulo: "ES financia pequenas barragens com crédito de até R$ 150 mil e mira 1.362 reservatórios",
    categoria: "Política Estadual",
    data: "2026-09-08",
    imagem: "imagens/auto-politica-es.svg",
    resumo: "Linha operada pelo Bandes usa recursos do Fortec, oferece até R$ 150 mil por propriedade e já financiou oito operações em sete municípios capixabas.",
    conteudo: `<p>Produtores rurais do Espírito Santo podem financiar a construção de pequenas barragens com crédito de até R$ 150 mil por propriedade em uma linha operada pelo Banco de Desenvolvimento do Espírito Santo, o Bandes, com recursos do Fundo de Fortalecimento da Economia Capixaba, o Fortec. O programa estadual tem como objetivo ampliar a segurança hídrica no campo, especialmente em propriedades sujeitas a períodos de escassez de água, e estabelece condições diferenciadas para agricultores familiares e demais produtores.</p>
<p>Segundo informações atualizadas pelo Bandes, oito operações já foram realizadas, beneficiando propriedades nos municípios de Brejetuba, Montanha, Ecoporanga, Nova Venécia, Santa Maria de Jetibá, Barra de São Francisco e Divino de São Lourenço. O banco informa que o valor liberado nessas operações chegou a R$ 1.002.827 e possibilitou capacidade de armazenamento de 112.851.000 litros de água. O edital foi lançado em 16 de maio de 2025 e permanece aberto por 24 meses ou até o esgotamento dos recursos disponíveis, com análise das propostas pela ordem de protocolo.</p>
<p>A política foi estruturada pelo Governo do Estado por meio da Secretaria da Agricultura, Abastecimento, Aquicultura e Pesca, a Seag, e conta com participação técnica de órgãos ligados à gestão de recursos hídricos, extensão rural e regularização ambiental. Além do Bandes, participam da estrutura a Agência Estadual de Recursos Hídricos, o Incaper e o Instituto de Defesa Agropecuária e Florestal do Espírito Santo.</p>
<h2>Crédito pode chegar a R$ 150 mil por propriedade</h2>
<p>As regras divulgadas pela Seag estabelecem limite de R$ 150 mil de financiamento por propriedade. A taxa nominal é de 7% ao ano, mas o programa prevê bônus de adimplência. Para agricultores familiares que mantiverem os pagamentos nas condições previstas, a taxa pode cair para 4% ao ano. Para os demais produtores, o bônus pode reduzir a taxa para 6% ao ano.</p>
<p>O prazo total é de oito anos. Os três primeiros correspondem ao período de carência, durante o qual o produtor paga apenas os juros. Depois, há cinco anos para amortização do investimento. O financiamento pode cobrir etapas que vão desde a elaboração do projeto técnico até a conclusão da obra, respeitando os limites e exigências do edital.</p>
<p>O programa admite projeto cujo custo total seja superior a R$ 150 mil, desde que o valor solicitado ao Bandes não ultrapasse esse teto. Nesse caso, o proprietário precisa informar a utilização de recursos próprios para complementar o investimento. A aplicação dos valores financiados e da contrapartida deve ser comprovada durante o acompanhamento da execução.</p>
<h2>Barragens têm limite de área e capacidade</h2>
<p>As estruturas financiadas devem observar limite de até cinco hectares de lâmina d'água ou capacidade de armazenamento de até 50 mil metros cúbicos. A proposta estadual é financiar novas barragens. Reformas, ampliações ou recuperação de estruturas já existentes não são contempladas pelo edital, assim como obras que já estejam em fase avançada de execução.</p>
<p>A Seag informa que, em situações específicas, uma barragem que necessite de licenciamento ambiental poderá receber o financiamento, desde que permaneça dentro dos limites máximos definidos pelo programa. Casos que envolvam, por exemplo, supressão de vegetação nativa podem exigir procedimento ambiental próprio. Após a conclusão da obra, o Cadastro Estadual de Segurança de Barragens é obrigatório, conforme as regras estaduais, e deve ser feito junto à Agerh.</p>
<p>O proprietário do imóvel rural é quem pode solicitar o financiamento e deve comprovar a titularidade da área na análise da proposta. Técnicos e consultores podem auxiliar na preparação e no envio da documentação, mas a contratação desses profissionais é responsabilidade do interessado. O programa permite incluir no financiamento despesas relacionadas à elaboração do projeto técnico, dentro das condições estabelecidas.</p>
<h2>Meta estadual chega a 1.362 barragens em 12 anos</h2>
<p>Quando o programa foi lançado, o Governo do Espírito Santo apresentou uma meta de viabilizar até 1.362 pequenas barragens ao longo de 12 anos. Caso todas fossem construídas na capacidade máxima prevista, o potencial adicional de reservação chegaria a aproximadamente 68,1 milhões de metros cúbicos de água. A projeção mostra a escala pretendida para uma política voltada à retenção descentralizada de água dentro das propriedades.</p>
<p>A justificativa do Estado está ligada à necessidade de dar maior previsibilidade à produção agropecuária. Culturas importantes para a economia capixaba, como café, frutas e olerícolas, dependem de disponibilidade hídrica e de sistemas de irrigação. A existência de reservação na propriedade pode reduzir a exposição do produtor aos efeitos de períodos prolongados de estiagem, desde que a captação, o armazenamento e o uso da água respeitem as regras ambientais e de recursos hídricos.</p>
<p>A linha foi criada após alteração das regras do Fortec para permitir que recursos do fundo fossem usados no financiamento das barragens. A medida passou pela estruturação legal e, posteriormente, pela abertura do edital e operacionalização pelo Bandes. O desenho combina crédito subsidiado, exigências técnicas e acompanhamento da execução das obras.</p>
<h2>Oito operações já passaram de R$ 1 milhão</h2>
<p>O balanço disponibilizado pelo Bandes mostra que a política saiu da fase de lançamento e já possui contratos executados. As oito operações somam pouco mais de R$ 1 milhão em recursos liberados. Embora o número ainda seja pequeno diante da meta de longo prazo de 1.362 estruturas, os contratos oferecem uma primeira medida concreta da adesão ao programa.</p>
<p>O banco informa que, nas operações sem garantia real, é cobrada tarifa de análise equivalente a 0,5% do montante financiado. Nas operações com garantia real, a tarifa de análise não é aplicada, mas há cobrança de avaliação do imóvel, atualmente informada em R$ 1.885. As operações realizadas com recursos dos fundos estaduais geridos pelo Bandes, como o Fortec, são apresentadas pelo programa como isentas de IOF.</p>
<p>Para o produtor interessado, a análise envolve não apenas a capacidade de pagamento, mas também a documentação da propriedade e os requisitos técnicos da barragem. A Seag orienta que os documentos exigidos sejam enviados de forma completa. Depois da contratação, notas fiscais dos serviços e despesas previstas no orçamento precisam ser apresentadas, juntamente com documentação de acompanhamento da execução.</p>
<h2>Quem pode pedir e o que acontece agora</h2>
<p>O público do programa inclui agricultores familiares, tratados como prioridade, e demais produtores rurais capixabas que atendam às condições do edital. É permitido apenas um projeto por proprietário rural. Como o edital tem prazo de 24 meses contado do lançamento em maio de 2025, produtores interessados ainda podem apresentar propostas enquanto a chamada estiver vigente e houver recursos disponíveis.</p>
<p>As informações oficiais concentram funções diferentes em cada órgão. O Bandes cuida do financiamento. O Idaf responde pelas questões de licenciamento ambiental aplicáveis. A Agerh atua nas exigências relacionadas à outorga e ao cadastro de segurança de barragens. O Incaper integra o apoio técnico ao programa. Essa divisão exige que o projeto esteja financeiramente enquadrado e também regular do ponto de vista técnico e ambiental.</p>
<p>Com oito operações contratadas e mais de 112 milhões de litros de capacidade de armazenamento associados aos projetos já financiados, o programa entra em uma fase em que o resultado pode ser acompanhado pelo número de novas adesões, pela execução física das barragens e pelo volume efetivamente reservado nas propriedades. Para o setor rural capixaba, a política cria uma alternativa de financiamento específica para infraestrutura hídrica, com prazo longo e juros reduzidos para quem cumprir as condições de adimplência.</p>
<h2>Perguntas e respostas</h2>
<p><strong>Quanto pode ser financiado?</strong> Até R$ 150 mil por propriedade rural, observadas as condições do edital e a análise do Bandes.</p>
<p><strong>Qual é o prazo?</strong> O financiamento tem prazo total de oito anos, com três anos de carência e cinco anos para amortização.</p>
<p><strong>Qual o tamanho máximo da barragem?</strong> O programa trabalha com estruturas de até cinco hectares de lâmina d'água ou até 50 mil metros cúbicos de capacidade.</p>
<p><strong>Quantas operações já foram realizadas?</strong> O Bandes informa oito operações em sete municípios, com R$ 1.002.827 liberados e capacidade de armazenamento associada de 112.851.000 litros.</p>
<p><strong>Fontes consultadas:</strong> Secretaria da Agricultura, Abastecimento, Aquicultura e Pesca do Espírito Santo; Banco de Desenvolvimento do Espírito Santo; Governo do Estado do Espírito Santo. Os valores, limites e condições citados correspondem às informações oficiais disponíveis nas páginas do programa consultadas em 8 de setembro de 2026.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "Secretaria da Agricultura do Espírito Santo (Seag)",
    fonteUrl: "https://seag.es.gov.br/programa-de-financiamento-para-construcao-de-pequenas-barragens",
    fontesAdicionais: ["https://www.bandes.com.br/barragem/","https://www.es.gov.br/Noticia/governo-lanca-programa-para-financiar-construcao-de-pequenas-barragens-e-ampliar-seguranca-hidrica","https://planejamento.es.gov.br/Noticia/governo-lanca-programa-para-financiar-construcao-de-pequenas-barragens-e-ampliar-seguranca-hidrica"],
    automatico: true,
    coletadoEm: "2026-09-08T05:39:51.000Z"
  },
  {
    id: 8092026013601,
    slug: "guriri-reforca-seguranca-38-cameras-reconhecimento-facial-verao-2026",
    titulo: "Guriri reforça segurança com 38 câmeras, reconhecimento facial e mais policiamento no Verão 2026",
    categoria: "Segurança Pública",
    data: "2026-09-08",
    imagem: "imagens/auto-seguranca.svg",
    resumo: "Plano para a temporada em Guriri prevê 38 novas câmeras, sete pontos com reconhecimento facial, reforço da Polícia Militar, Cavalaria, BPTran e 100 agentes privados.",
    conteudo: `<p>O balneário de Guriri, em São Mateus, vai operar no Verão 2026 com um esquema de segurança ampliado que combina videomonitoramento, reconhecimento facial, reforço do efetivo policial e contratação de segurança privada. Segundo informações divulgadas pela Prefeitura de São Mateus, foram instaladas 38 novas câmeras em pontos estratégicos do balneário, das quais sete contam com tecnologia de reconhecimento facial. O planejamento também prevê apoio do Batalhão de Trânsito da Polícia Militar, emprego da Cavalaria e reforço de equipes policiais vindas de outras regiões do Espírito Santo.</p>
<p>O pacote foi apresentado pelo município como parte de uma estratégia integrada para atender ao aumento da circulação de moradores e turistas durante a temporada. Além das forças públicas, a administração municipal informou ter autorizado a contratação de 100 agentes de segurança privada para atuação complementar em eventos e na orientação do público. O reforço ocorre em uma região que concentra grande movimento na orla, nos acessos e nas áreas de shows durante o verão.</p>
<p>As medidas dão sequência a um planejamento discutido pelo Gabinete de Gestão Integrada Municipal, o GGIM. Em reunião dedicada à temporada, representantes da Prefeitura, Polícia Militar, Polícia Civil, Guarda Municipal, Ministério Público e outros órgãos trataram da ampliação da presença de agentes na orla e nos principais pontos de fluxo. A Polícia Militar confirmou, segundo a Prefeitura, o envio de novos efetivos para São Mateus, com atenção especial a Guriri.</p>
<h2>Reconhecimento facial entra no esquema de monitoramento</h2>
<p>Das 38 novas câmeras anunciadas para o balneário, sete possuem reconhecimento facial. A Prefeitura informou que a tecnologia poderá auxiliar na identificação de pessoas com mandados de prisão em aberto ou registros de desaparecimento, com acompanhamento pelas centrais de comando. O recurso acrescenta uma camada tecnológica ao patrulhamento presencial e ao sistema de videomonitoramento já utilizado no município.</p>
<p>São Mateus possui histórico de uso de câmeras como ferramenta de apoio às forças policiais. A Central de Videomonitoramento municipal funciona em articulação com a segurança pública e já foi utilizada para auxiliar o acompanhamento de ocorrências e investigações. Na temporada de 2026, a ampliação anunciada em Guriri coloca o monitoramento eletrônico entre os principais componentes do planejamento preventivo.</p>
<p>O uso de reconhecimento facial exige operação vinculada às finalidades de segurança informadas pelo poder público. Na divulgação municipal, a aplicação foi relacionada especificamente à localização de pessoas procuradas pela Justiça e de desaparecidos. A Prefeitura não detalhou, nas publicações consultadas, indicadores de precisão do sistema, prazo de armazenamento das imagens ou protocolo completo de tratamento dos dados captados pelas novas câmeras.</p>
<h2>PM, Guarda, BPTran e Cavalaria terão atuação integrada</h2>
<p>O reforço operacional não ficará restrito à tecnologia. A Polícia Militar terá efetivo adicional no município e o esquema divulgado inclui participação do BPTran e da Cavalaria, além de equipes deslocadas de outras regiões do Estado. O objetivo é aumentar a presença policial nos locais de maior concentração de pessoas, nos acessos ao balneário e nos pontos em que ocorrerão eventos.</p>
<p>A Guarda Municipal também integra o planejamento. Na reunião do GGIM, a Prefeitura informou que Guarda e Polícia Militar deverão atuar de maneira coordenada em rondas, operações e ações preventivas. Essa integração pretende reduzir o tempo de resposta a ocorrências e organizar o emprego das equipes conforme o fluxo de pessoas ao longo da temporada.</p>
<p>A estrutura pública será complementada por 100 agentes de segurança privada contratados para apoio aos eventos e orientação do público. Esses profissionais não substituem as atribuições legais das forças policiais. A função anunciada pelo município é complementar, especialmente na organização dos espaços de grande circulação durante a programação de verão.</p>
<h2>Arena, shows e transporte aumentam a demanda por planejamento</h2>
<p>O lançamento oficial do Verão Guriri 2026 confirmou uma programação de grande porte, com shows nacionais e uma Arena de Verão estruturada para receber milhares de pessoas. Entre as atrações anunciadas estão Tatau, Tony Salles, Léo Santana, Durval Lelys, Countrybeat, Cheiro de Amor, Paulo Ricardo e Tomate, em datas distribuídas entre o réveillon e o fim de janeiro. A Prefeitura também anunciou trio elétrico em dias específicos.</p>
<p>A concentração de público em shows, praias e áreas de alimentação aumenta a necessidade de planejamento de trânsito, atendimento médico e segurança. Por isso, a estrutura divulgada pelo município inclui reforço no transporte coletivo, ambulâncias, equipes de saúde, postos de atendimento e presença de guarda-vidas, além do policiamento e monitoramento.</p>
<p>O planejamento de segurança foi antecipado em reuniões do GGIM e de órgãos municipais com as forças policiais. A proposta é distribuir recursos conforme os pontos de maior fluxo, evitando que toda a operação fique concentrada apenas na arena de shows. Guriri recebe movimentação também na orla, em vias comerciais, acessos rodoviários e áreas residenciais, o que exige patrulhamento em diferentes horários.</p>
<h2>Temporada será teste para a nova estrutura</h2>
<p>O resultado do esquema poderá ser medido durante a temporada pelo volume de ocorrências, capacidade de resposta das equipes, funcionamento do videomonitoramento e organização dos grandes eventos. A instalação das câmeras e o anúncio de novos efetivos representam aumento dos recursos disponíveis, mas a efetividade dependerá do emprego operacional e da integração entre os órgãos.</p>
<p>Para moradores e comerciantes de Guriri, a temporada de verão tem impacto direto na rotina. O aumento do número de visitantes movimenta hospedagem, alimentação, comércio e serviços, ao mesmo tempo em que pressiona trânsito, limpeza urbana, atendimento de saúde e segurança pública. O planejamento anunciado tenta preparar o balneário para essa mudança temporária de escala.</p>
<p>A Prefeitura afirma que a segurança é um dos pilares da programação e que o modelo combina presença ostensiva, tecnologia e atuação coordenada. A confirmação de 38 novas câmeras, sete delas com reconhecimento facial, somada ao reforço da Polícia Militar, BPTran, Cavalaria, Guarda Municipal e segurança privada, forma a principal estrutura apresentada até agora para o Verão Guriri 2026.</p>
<p><strong>Fontes consultadas:</strong> Prefeitura de São Mateus, informações oficiais sobre o reforço tecnológico e operacional em Guriri, planejamento do GGIM e lançamento do Verão Guriri 2026. As atribuições e números citados nesta reportagem correspondem ao que foi oficialmente divulgado pelo município.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "Prefeitura de São Mateus",
    fonteUrl: "https://www.saomateus.es.gov.br/noticia/guriri-recebe-reforco-tecnologico-e-operacional-para-o-verao-2026-2025-12-31",
    fontesAdicionais: ["https://saomateus.es.gov.br/noticia/reuniao-do-ggim-define-acoes-de-seguranca-para-o-verao-2026-em-sao-mateus","https://www.saomateus.es.gov.br/noticia/prefeitura-de-sao-mateus-lanca-oficialmente-o-verao-guriri-2026-com-grande-programacao-e-estrutura-reforcada","https://saomateus.es.gov.br/noticia/central-de-monitoramento-24-horas-por-dia-auxiliando-na-seguranca-do-municipio"],
    automatico: true,
    coletadoEm: "2026-09-08T04:36:49.000Z"
  },
  {
    id: 8092026003901,
    slug: "sao-mateus-1-bilhao-investimentos-20-empresas-polo-industrial",
    titulo: "São Mateus anuncia mais de R$ 1,1 bilhão em investimentos e chegada de 20 empresas",
    categoria: "Política Estadual",
    data: "2026-09-08",
    imagem: "imagens/auto-politica-es.svg",
    resumo: "Pacote privado reúne expansão industrial, novos empreendimentos e infraestrutura no Norte do ES; previsão divulgada pelo município é de mais de mil empregos diretos.",
    conteudo: `<p>São Mateus, no Norte do Espírito Santo, anunciou um conjunto de investimentos privados superior a R$ 1,1 bilhão, associado à chegada de mais de 20 empresas, expansões industriais e projetos de infraestrutura. Segundo a Prefeitura, o movimento deve gerar mais de mil empregos diretos e ampliar o peso do município como polo industrial da região Norte capixaba.</p>
<p>O anúncio reúne projetos em diferentes estágios, desde ampliações de fábricas já instaladas até novos centros de distribuição, empreendimentos de energia, indústrias e obras de infraestrutura. A lista divulgada pelo município inclui empresas dos setores automotivo, cerâmico, alimentício, petróleo e gás, energia, logística, construção e reciclagem.</p>
<p>Os valores são projeções de investimentos privados divulgadas pela administração municipal e pelas empresas envolvidas. Por isso, a concretização integral do montante depende da execução de cada projeto, de seus cronogramas, licenciamentos e decisões empresariais. Ainda assim, a soma anunciada mostra uma mudança relevante de escala na atividade econômica planejada para São Mateus.</p>
<h2>Marcopolo concentra uma das maiores expansões</h2>
<p>Entre os projetos relacionados pela Prefeitura está a expansão da Marcopolo, com investimento informado de R$ 260 milhões. A empresa já possui operação no município e integra um setor que vem estimulando ações locais de qualificação de mão de obra.</p>
<p>Na semana passada, a Prefeitura também informou a contratação de 102 vagas gratuitas de capacitação profissional em parceria com Sesi, Senai, Findes e Marcopolo. Os cursos presenciais são voltados às áreas de solda, montagem e manutenção. O programa municipal tem custo próximo de R$ 100 mil e busca preparar trabalhadores para vagas ligadas ao setor automobilístico.</p>
<p>Outras expansões listadas são as da Oxford, com R$ 6 milhões, e da Café Duarte, com R$ 10 milhões. Na frente de inaugurações, a relação divulgada inclui Technobrass, com R$ 100 milhões; Carnes Nobres, com R$ 60 milhões; Enpex, com R$ 30 milhões; NBS Petróleo, com R$ 18 milhões; e CBF, com R$ 8 milhões.</p>
<h2>Energia e logística aparecem entre os maiores projetos</h2>
<p>A carteira anunciada também contém empreendimentos que, individualmente, representam parcelas expressivas do total. A Termelétrica Urca aparece com previsão de R$ 350 milhões, o maior valor unitário da lista divulgada. A Hidrelétrica Santa Maria é relacionada com R$ 60 milhões.</p>
<p>Na logística, a Prefeitura informou projetos de centros de distribuição da Shopee e do Mercado Livre, com valores indicados de R$ 10 milhões e R$ 32 milhões, respectivamente. A presença desses projetos, caso sejam executados conforme anunciado, acrescenta ao polo industrial uma frente ligada à distribuição de mercadorias e à cadeia do comércio eletrônico.</p>
<p>A lista de novos empreendimentos inclui ainda Biopetro, com R$ 15 milhões; Biomarca, com R$ 2 milhões; Recicla, com R$ 6 milhões; Pedreira São Vicente, com R$ 20 milhões; Consigaz, com R$ 10 milhões; Pneuvix, com R$ 8 milhões; e GTK Pré-Moldados, com R$ 5 milhões. Os valores foram apresentados pela Prefeitura de São Mateus e reproduzidos em cobertura local publicada no fim de semana.</p>
<h2>Infraestrutura acompanha expansão do polo</h2>
<p>O pacote econômico não se limita às plantas industriais. A administração municipal relaciona R$ 10 milhões em investimentos da ES Gás e R$ 50 milhões da Ecovias. A infraestrutura é um ponto central para a expansão industrial porque São Mateus é cortado pela BR-101, corredor usado para o transporte de cargas entre o Espírito Santo e outros estados.</p>
<p>A Prefeitura informou anteriormente que acompanha com a Ecovias Capixaba a previsão de faixas adicionais na BR-101 entre Pedro Canário e Sooretama, trecho que inclui São Mateus, Jaguaré e Sooretama. O cronograma contratual mencionado pelo município prevê execução até 2034, enquanto a administração local busca antecipar 21 quilômetros de faixas adicionais.</p>
<p>Esse componente ajuda a explicar por que a discussão sobre crescimento industrial está ligada à mobilidade. Novas fábricas e centros de distribuição aumentam a circulação de trabalhadores, fornecedores e cargas. A capacidade da rodovia e dos acessos ao polo passa, portanto, a fazer parte da viabilidade operacional do crescimento anunciado.</p>
<h2>Qualificação profissional entra na conta</h2>
<p>Além dos aportes empresariais, São Mateus vem articulando projetos de formação profissional. Um deles é o novo Centro de Treinamento do Serviço Nacional de Aprendizagem Rural no Espírito Santo, o Senar-ES. A Prefeitura encaminhou à Câmara Municipal projeto para doação do terreno e informou investimento previsto superior a R$ 20 milhões na estrutura educacional e tecnológica.</p>
<p>Segundo o município, a unidade deverá oferecer formação profissional rural, promoção social, ensino técnico de nível médio e assistência técnica e gerencial. Paralelamente, convênios com o Senai mantêm turmas de formação técnica, incluindo capacitação em soldagem.</p>
<p>A qualificação é um dos pontos que determinarão quanto do emprego criado pelos novos investimentos poderá ser ocupado por moradores da própria região. A previsão oficial de mais de mil empregos diretos representa uma estimativa associada ao conjunto de projetos e não significa que todas as vagas estarão disponíveis imediatamente. Cada empreendimento terá seu próprio calendário de implantação e contratação.</p>
<h2>O que muda para a economia do Norte do ES</h2>
<p>São Mateus já exerce papel regional em comércio, serviços, agricultura, petróleo e gás e atividade industrial. A nova carteira amplia a diversidade dos setores presentes no município. O efeito econômico potencial não fica restrito aos empregos dentro das fábricas: empreendimentos desse porte demandam transporte, alimentação, manutenção, construção, serviços técnicos, hospedagem e fornecedores.</p>
<p>Ao mesmo tempo, o volume anunciado exige acompanhamento da execução. A referência de R$ 1,1 bilhão é uma soma de projetos distintos, e o resultado efetivo dependerá de quanto cada empresa desembolsar, do ritmo das obras e do início das operações. Para a população, os indicadores mais concretos serão a abertura real das vagas, a conclusão dos empreendimentos e a entrada das novas unidades em funcionamento.</p>
<p>O anúncio coloca São Mateus em uma posição de destaque no mapa de investimentos privados do Norte capixaba. A próxima etapa será transformar a carteira divulgada em obras, unidades produtivas e empregos efetivamente entregues. Com projetos industriais, energéticos, logísticos e de infraestrutura na mesma agenda, o município tenta consolidar uma base econômica mais diversificada e ampliar sua capacidade de atrair novos negócios.</p>
<p><strong>Fontes consultadas:</strong> Prefeitura de São Mateus, divulgação oficial dos investimentos e programas de capacitação; Corrivus, detalhamento dos valores e empresas incluídas no pacote anunciado; Prefeitura de São Mateus, informações sobre o novo Centro de Treinamento do Senar-ES e acompanhamento das intervenções da Ecovias na BR-101.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "Prefeitura de São Mateus",
    fonteUrl: "https://saomateus.es.gov.br/noticia/sao-mateus-recebe-mais-de-r%24-11-bilhao-em-investimentos-privados-e-consolida-polo-industrial-no-norte-do-espirito-santo-2026-09-05",
    fontesAdicionais: ["https://corrivus.com.br/espirito-santo/sao-mateus/sao-mateus-investimentos-industriais-2026", "https://saomateus.es.gov.br/noticia/prefeitura-de-sao-mateus-lanca-programa-de-capacitacao-em-parceria-com-sesi-senai-findes-e-marcopolo", "https://www.saomateus.es.gov.br/noticia/sao-mateus-avanca-no-fortalecimento-do-agronegocio-com-novo-centro-de-capacitacao-do-senar-es-2026-07-03", "https://www.saomateus.es.gov.br/noticia/prefeitura-de-sao-mateus-acompanha-investimentos-e-melhorias-da-ecovias-capixaba-no-municipio-2026-05-08"],
    automatico: true,
    coletadoEm: "2026-09-08T03:39:00.000Z"
  },
  {
    id: 8092026234101,
    slug: "quilombolas-protesto-br-101-sao-mateus-anexo-3-rio-doce",
    titulo: "Quilombolas bloqueiam BR-101 em São Mateus e cobram inclusão na reparação do Rio Doce",
    categoria: "Política Estadual",
    data: "2026-09-07",
    imagem: "imagens/auto-politica-es.svg",
    resumo: "Manifestação interrompeu a BR-101 no Norte do ES e cobrou acesso de comunidades às medidas do Anexo 3 do Novo Acordo do Rio Doce; tráfego foi liberado às 10h30.",
    conteudo: `<p>Uma manifestação de comunidades quilombolas e povos tradicionais interrompeu o trânsito na BR-101, em São Mateus, no Norte do Espírito Santo, na manhã desta segunda-feira (7). O ato ocorreu nas proximidades do campus da Universidade Federal do Espírito Santo (Ufes) e teve como principal reivindicação a inclusão de comunidades nas medidas previstas pelo Anexo 3 do Novo Acordo do Rio Doce, firmado para reparar os danos provocados pelo rompimento da barragem de Fundão, em Mariana, em 2015.</p>
<p>A interdição começou nas primeiras horas da manhã. Segundo informações divulgadas pela Ecovias Capixaba e pela Polícia Rodoviária Federal, a rodovia chegou a ficar totalmente bloqueada. Por volta das 9h, o tráfego passou a ser liberado de forma alternada, com passagem de veículos em cada sentido a intervalos de aproximadamente 20 minutos. Às 10h30, a PRF informou que o fluxo havia sido totalmente restabelecido.</p>
<p>A mobilização levou para uma das principais rodovias do Estado uma discussão que se arrasta no processo de reparação do desastre do Rio Doce: quais comunidades tradicionais são reconhecidas como atingidas e de que forma terão acesso às medidas específicas previstas no acordo.</p>
<h2>O que prevê o Anexo 3</h2>
<p>O Portal Único da Reparação do Rio Doce, mantido pelo poder público, informa que o Anexo 3 é dedicado aos povos indígenas, comunidades quilombolas, povos e comunidades tradicionais. O documento prevê medidas de reparação e compensação por danos coletivos, além de auxílios de subsistência e financeiros às famílias pertencentes aos grupos indicados no próprio anexo.</p>
<p>A gestão temática é atribuída à União, com participação do Ministério dos Povos Indígenas, do Ministério da Igualdade Racial e do Ministério do Desenvolvimento Agrário e Agricultura Familiar. Isso significa que a execução dessa parte da repactuação envolve decisões administrativas e processos de consulta que não ficam exclusivamente sob responsabilidade da Samarco.</p>
<p>O Governo Federal já informou que o Anexo 3 reservou R$ 8 bilhões para ações destinadas a indígenas, quilombolas e povos e comunidades tradicionais. Os recursos são voltados a diferentes frentes, entre elas assistência às famílias, assessorias técnicas independentes e medidas estruturantes coletivas definidas conforme os processos de consulta e as características de cada território.</p>
<p>A reivindicação apresentada em São Mateus, portanto, toca diretamente no critério de abrangência do acordo. Os manifestantes querem que as comunidades que representam sejam alcançadas pelo regime específico de reparação e pelos mecanismos financeiros e coletivos vinculados ao anexo.</p>
<h2>Sapê do Norte está no centro da reparação quilombola</h2>
<p>São Mateus tem relação direta com a pauta quilombola do Novo Acordo. Em agosto de 2025, o Ministério da Educação recebeu representantes de comunidades da região de Sapê do Norte afetadas pelo rompimento da barragem de Fundão. Na ocasião, participaram lideranças de comunidades como Coxi, Córrego do Alexandre, Barreiras, Angelim Disa, Beira Rio, Córrego Seco, Córrego do Chiado e Nova Vista.</p>
<p>O próprio governo federal registrou naquele encontro que o Anexo 3 reconhece impactos diferenciados sobre povos indígenas, comunidades quilombolas e comunidades tradicionais, o que exige reparação com dimensões culturais, territoriais e sociais específicas.</p>
<p>A presença quilombola em São Mateus também aparece em processos fundiários recentes. O Incra registra, em 2026, editais relacionados ao território quilombola Serraria e São Cristóvão, no município. Esse procedimento fundiário é distinto da reparação do Rio Doce, mas demonstra a existência de territórios quilombolas formalmente tratados por políticas públicas federais na região.</p>
<h2>Recursos já foram aprovados para comunidades capixabas</h2>
<p>A discussão sobre o Anexo 3 avançou ao longo de 2026. Em fevereiro, o subcomitê responsável aprovou um projeto de R$ 14,5 milhões para viabilizar estudos de impactos ambientais e consultas a povos indígenas atingidos. O Ministério dos Povos Indígenas informou que o projeto seria executado tecnicamente pelo Instituto Federal do Espírito Santo e alcançaria aproximadamente 7 mil indígenas dos povos Tupiniquim, Guarani e Puri.</p>
<p>Em outras comunidades tradicionais, os processos de consulta também produziram decisões concretas. Em abril, mais de 3 mil faiscadores e faiscadoras tradicionais da Bacia do Rio Doce aprovaram a adesão ao Novo Acordo após nove meses de consulta, segundo o Ministério do Desenvolvimento Agrário.</p>
<p>No Espírito Santo, medidas específicas para comunidades quilombolas também começaram a receber recursos. Informações divulgadas no fim de agosto apontam a aprovação de aproximadamente R$ 100,9 milhões para projetos de apoio familiar destinados a Sapê do Norte, Degredo, em Linhares, e Santa Efigênia, em Minas Gerais. A maior parcela, cerca de R$ 92,7 milhões, foi destinada a Sapê do Norte.</p>
<h2>Samarco diz cumprir o acordo</h2>
<p>Após a manifestação desta segunda-feira, a Samarco informou, em nota divulgada por A Gazeta, que cumpre integralmente as obrigações estabelecidas no Novo Acordo do Rio Doce. Sobre as comunidades quilombolas, a mineradora afirmou que a reparação segue os critérios definidos no documento.</p>
<p>A resposta não encerra a controvérsia levantada pelos manifestantes. O ponto apresentado no protesto é justamente a reivindicação de inclusão de comunidades no alcance das medidas do Anexo 3. A definição de elegibilidade, os processos de consulta e a execução dos programas envolvem diferentes órgãos federais e os mecanismos de governança criados pela repactuação.</p>
<p>O protesto terminou sem registro de manutenção do bloqueio ao longo do dia. Depois da liberação integral às 10h30, o trânsito voltou a fluir nos dois sentidos da BR-101. A reivindicação, porém, permanece ligada à execução do Novo Acordo do Rio Doce e às decisões sobre quais comunidades terão acesso às reparações específicas previstas para povos tradicionais.</p>
<h2>O que acontece agora</h2>
<p>A liberação da rodovia resolveu o impacto imediato sobre o trânsito, mas não representa uma decisão sobre o pedido feito pelas comunidades. A reivindicação terá de ser tratada dentro das instâncias responsáveis pela execução do Anexo 3 e pelos processos de consulta e reconhecimento previstos no Novo Acordo.</p>
<p>O caso também mostra que, quase onze anos após o rompimento da barragem de Fundão, a reparação continua produzindo disputas sobre alcance, critérios e execução. Em São Mateus, essas discussões ganharam visibilidade ao chegar à BR-101. O acompanhamento das próximas decisões do poder público será determinante para saber se as comunidades que participaram da mobilização serão formalmente incluídas nas medidas que reivindicam.</p>
<p><strong>Fontes consultadas:</strong> A Gazeta, cobertura do protesto e posicionamento da Samarco; Portal Único Reparação Rio Doce, descrição oficial do Anexo 3; Ministério dos Povos Indígenas, informações sobre recursos e consultas; Ministério da Educação, registro de comunidades quilombolas de Sapê do Norte; Incra, registros fundiários quilombolas de São Mateus.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "A Gazeta",
    fonteUrl: "https://www.agazeta.com.br/agora/protesto-interdita-a-br-101-em-sao-mateus-no-es-0926",
    fontesAdicionais: ["https://portalunicoriodoce.es.gov.br/pt-br/medidas-reparacao-e-compensacao/anexo-3", "https://www.gov.br/povosindigenas/pt-br/assuntos/noticias/2026/02/comite-do-rio-doce-aprova-projeto-voltado-a-consulta-de-comunidades-indigenas-impactadas-pelo-rompimento-da-barragem-de-mariana", "https://agenciagov.ebc.com.br/noticias/202508/mec-se-reune-com-representantes-quilombolas-no-es", "https://www.gov.br/incra/pt-br/centrais-de-conteudos/publicacoes/quilombolas/aquisicao-de-imoveis-rurais"],
    automatico: true,
    coletadoEm: "2026-09-08T02:41:00.000Z"
  },
  {
    id: 8302026143401,
    slug: "flavio-bolsonaro-ministro-bukele-seguranca-faccoes-presidios",
    titulo: "Flávio se reúne com ministro de Bukele e reforça plano de endurecimento contra facções",
    categoria: "Política Nacional",
    data: "2026-08-30",
    imagem: "https://medias.revistaoeste.com/wp-content/uploads/2026/08/ch_06734.jpg-910x568.jpeg.webp",
    resumo: "Candidato do PL recebeu Gustavo Villatoro em São Paulo e voltou a defender 500 mil novas vagas prisionais, integração entre forças de segurança e um ministério exclusivo para a área.",
    conteudo: `<p>O candidato do PL à Presidência, Flávio Bolsonaro, reuniu-se neste domingo (30), em São Paulo, com Gustavo Villatoro, ministro da Justiça e Segurança Pública de El Salvador. O encontro colocou novamente no centro da campanha presidencial a proposta de Flávio de endurecer a resposta do Estado às facções criminosas e aproveitar elementos da experiência salvadorenha no desenho de sua política de segurança.</p><p>Após a conversa, Flávio afirmou que pretende criar cerca de 500 mil vagas no sistema prisional brasileiro e estruturar um Ministério da Segurança Pública separado da Justiça. A proposta, segundo o candidato, teria como foco a coordenação das forças estaduais e municipais, compartilhamento de inteligência e apoio financeiro e operacional aos entes federados.</p><h2>Segurança ganha espaço central na campanha</h2><p>A reunião não inaugura a agenda de segurança de Flávio. Em junho, o então pré-candidato apresentou o programa Brasil sem Medo, um conjunto de propostas que inclui novos presídios federais de segurança máxima, ampliação do sistema carcerário e mudanças na legislação penal. A aproximação com autoridades de El Salvador acrescenta uma referência internacional a um eixo que já vinha sendo tratado como prioridade pela campanha.</p><p>O encontro deste domingo também teve uma dimensão política. Segundo relatos publicados por diferentes veículos, Villatoro teria destacado a importância de apoio parlamentar para mudanças legislativas. Flávio, por sua vez, voltou a defender a eleição de uma bancada alinhada no Congresso, especialmente no Senado, para viabilizar alterações na legislação criminal.</p><p>O tema aparece em um momento em que segurança pública ocupa posição relevante no debate eleitoral. A discussão nacional envolve a expansão das facções, integração de bancos de dados, capacidade do sistema prisional, atuação das forças policiais e divisão de competências entre União, estados e municípios.</p><h2>O que Flávio pretende aproveitar de El Salvador</h2><p>El Salvador tornou-se referência frequente entre candidatos brasileiros de direita após a forte queda dos homicídios registrada durante o governo de Nayib Bukele. O país ampliou prisões, construiu uma megapenitenciária e adotou um regime de exceção no enfrentamento às gangues.</p><p>Flávio descreveu a experiência salvadorenha como inspiradora e disse que o Brasil precisa recuperar a capacidade do Estado de enfrentar organizações criminosas. A aplicação de medidas semelhantes, porém, teria de respeitar a Constituição brasileira, a estrutura federativa e decisões do Congresso e do Judiciário.</p><p>O modelo salvadorenho também é alvo de críticas de organizações de direitos humanos e de reportagens internacionais por prisões sem ordem judicial, detenções de inocentes e denúncias de maus-tratos. Esse contraponto faz parte do debate sobre até que ponto medidas adotadas em um país de pouco mais de 6 milhões de habitantes poderiam ser reproduzidas em uma federação de dimensões continentais como o Brasil.</p><h2>Meio milhão de vagas</h2><p>A promessa de ampliar em aproximadamente 500 mil o número de vagas penitenciárias já havia sido apresentada por Flávio em junho. Na ocasião, ele também defendeu a construção de cinco novos presídios federais de segurança máxima e o isolamento de lideranças de organizações criminosas.</p><p>O tamanho, o custo e o cronograma de uma expansão dessa magnitude deverão ser pontos centrais de escrutínio caso a proposta avance. Além da construção das unidades, uma política dessa escala envolve despesas permanentes com pessoal, saúde, alimentação, segurança, inteligência e manutenção.</p><p>Flávio sustenta que a ampliação precisa vir acompanhada de endurecimento penal e integração entre as forças. Neste domingo, voltou a dizer que a prioridade de um eventual governo seria a proteção das vítimas e dos cidadãos.</p><h2>Ministério exclusivo</h2><p>Outro ponto reafirmado foi a criação de um Ministério da Segurança Pública. A ideia é concentrar a coordenação federal da área em uma pasta própria, mantendo a Justiça em estrutura separada. Flávio disse que pretende trabalhar em parceria com estados e municípios, sem substituir as atribuições locais das polícias.</p><p>A integração é um dos problemas reconhecidos por diferentes atores do sistema de Justiça. Em audiência recente no Supremo Tribunal Federal sobre a legislação de combate às facções, o ministro Alexandre de Moraes criticou a dificuldade de compartilhamento de informações entre órgãos públicos.</p><p>Com a reunião deste domingo, Flávio procura transformar segurança pública em uma das marcas mais claras de sua candidatura. A proposta já está apresentada. A etapa seguinte do debate será medir viabilidade jurídica, custo, fontes de financiamento e quais partes da experiência salvadorenha poderiam, de fato, ser adaptadas à realidade brasileira.</p><p><strong>Fontes consultadas:</strong> Revista Oeste, publicação que originou a pauta; UOL/Estadão, cobertura do encontro de 30 de agosto; Folha de S.Paulo, cobertura da reunião e do modelo salvadorenho; R7 e UOL/Estadão, registros do lançamento do programa Brasil sem Medo em junho.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "Revista Oeste - Política",
    fonteUrl: "https://revistaoeste.com/politica/flavio-depois-de-encontro-com-ministro-de-bukele-basta-coragem-para-enfrentar-faccoes/",
    fontesAdicionais: ["https://noticias.uol.com.br/eleicoes/2026/08/30/flavio-bolsonaro-encontro-gustavo-villatoro-bukele.ghtm", "https://www1.folha.uol.com.br/poder/2026/08/flavio-bolsonaro-encontra-ministro-de-bukele-ignora-violacoes-e-diz-que-ha-poucos-presos-no-brasil.shtml", "https://noticias.r7.com/eleicoes/2026/flavio-lanca-plano-de-seguranca-e-propoe-maioridade-penal-de-14-anos-para-crimes-hediondos-18062026/"],
    automatico: true,
    coletadoEm: "2026-08-30T17:34:09.000Z"
  },
  {
    id: 8302026143402,
    slug: "campanha-lula-tse-cassacao-chapa-flavio-barretos-abuso-poder",
    titulo: "Campanha de Lula pede ao TSE cassação da chapa de Flávio por ato em Barretos",
    categoria: "Política Nacional",
    data: "2026-08-30",
    imagem: "https://medias.revistaoeste.com/wp-content/uploads/2026/08/image-2026-08-29-105851-910x568.jpg.webp",
    resumo: "Federação que apoia o presidente acusa a candidatura do PL de abuso de poder econômico na Festa do Peão; pedido ainda depende de análise da Justiça Eleitoral.",
    conteudo: `<p>A campanha do presidente Luiz Inácio Lula da Silva apresentou ao Tribunal Superior Eleitoral uma ação que pede a investigação e a cassação do registro da chapa presidencial de Flávio Bolsonaro (PL) por suposto abuso de poder econômico durante a Festa do Peão de Barretos. O questionamento foi apresentado neste sábado (29) e tem como foco a participação de Flávio e do governador de São Paulo, Tarcísio de Freitas, no evento realizado em 22 de agosto.</p><p>A existência da ação foi confirmada neste domingo por diferentes veículos. A acusação, neste momento, representa a tese jurídica da Federação Brasil da Esperança e não uma conclusão do TSE. Caberá à Justiça Eleitoral examinar provas, ouvir as partes e decidir se os fatos configuram ilícito eleitoral e, em caso positivo, qual consequência jurídica seria aplicável.</p><h2>O que a campanha de Lula alega</h2><p>Segundo os relatos sobre a petição, os partidos que apoiam Lula sustentam que Flávio e Tarcísio teriam utilizado a estrutura privada da Festa do Peão para favorecer eleitoralmente a candidatura presidencial do PL. A federação classifica o episódio como uma espécie de showmício disfarçado e pede que a Justiça investigue eventual abuso de poder econômico.</p><p>A legislação eleitoral impõe limites ao uso de eventos e estruturas com finalidade de promoção de candidaturas. A caracterização de abuso, contudo, exige análise do caso concreto, da gravidade das circunstâncias e das provas apresentadas. O simples protocolo de uma ação não significa que a acusação tenha sido acolhida.</p><p>A ofensiva jurídica ocorre já durante o período oficial de campanha. A propaganda eleitoral está autorizada desde 16 de agosto, e o horário gratuito no rádio e na televisão começou no dia 28. O TSE é responsável pelo processamento e julgamento das questões relacionadas às candidaturas presidenciais.</p><h2>Disputa eleitoral também migra para o TSE</h2><p>A ação sobre Barretos faz parte de uma sequência de disputas judiciais entre as principais campanhas. A Federação Brasil da Esperança já havia acionado o tribunal contra Flávio em episódios envolvendo propaganda e conteúdo publicado nas redes sociais. Do outro lado, a campanha do candidato do PL também apresentou questionamentos contra Lula, incluindo o uso de estruturas públicas em atos com potencial repercussão eleitoral.</p><p>Reportagem da Folha de S.Paulo publicada neste domingo registra que a campanha de Flávio havia questionado perante o TSE o uso do Palácio da Alvorada pelo presidente para fins eleitorais. Isso mostra que a judicialização não está restrita a um único campo político e deve acompanhar a campanha até outubro.</p><h2>Barretos entrou no centro da eleição</h2><p>Flávio participou da Festa do Peão acompanhado de Tarcísio e outros aliados. Durante a passagem pelo evento, falou sobre o agronegócio e apresentou mensagens políticas a apoiadores. A organização da festa estima público próximo de um milhão de pessoas ao longo de sua programação, o que amplia a visibilidade eleitoral de qualquer candidato presente.</p><p>É justamente a relação entre essa exposição, a estrutura do evento e a campanha que será discutida juridicamente. A acusação terá de demonstrar que houve uso indevido de poder econômico com gravidade suficiente para afetar a normalidade e a legitimidade da eleição. A defesa, por sua vez, poderá contestar a interpretação dos fatos e sustentar a legalidade da participação do candidato.</p><h2>Cassação é pedido, não decisão</h2><p>O ponto mais importante para a leitura correta do episódio é a diferença entre o pedido apresentado pela campanha adversária e uma decisão da Justiça. Até a publicação desta reportagem, as fontes consultadas noticiavam o ajuizamento da ação, sem julgamento de mérito pelo TSE sobre a acusação relacionada a Barretos.</p><p>Em processos eleitorais dessa natureza, o tribunal pode rejeitar a pretensão, determinar produção de provas, ouvir as partes e o Ministério Público Eleitoral ou, ao final, reconhecer irregularidades. A consequência depende do enquadramento jurídico e da gravidade comprovada.</p><p>O calendário eleitoral torna o caso politicamente relevante. O primeiro turno está marcado para 4 de outubro, e as campanhas entram agora na fase de maior exposição em rádio, televisão, redes sociais e atos públicos. O TSE também começa nesta segunda-feira (31) o julgamento virtual dos registros das candidaturas à Presidência, procedimento distinto da nova ação apresentada pela federação de Lula.</p><p>O Notícia ES acompanhará o processo para registrar a manifestação da defesa da chapa de Flávio e as decisões do tribunal assim que forem formalizadas. Até lá, a acusação deve ser tratada pelo que juridicamente é: uma alegação apresentada por adversários e submetida à apreciação da Justiça Eleitoral.</p><p><strong>Fontes consultadas:</strong> Revista Oeste, publicação que originou a pauta; UOL, cobertura do pedido de cassação em 30 de agosto; Folha de S.Paulo, levantamento das ações apresentadas ao TSE; Tribunal Superior Eleitoral, calendário, regras e informações oficiais das Eleições 2026.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "Revista Oeste - Política",
    fonteUrl: "https://revistaoeste.com/politica/campanha-de-lula-pede-ao-tse-cassacao-da-chapa-de-flavio/",
    fontesAdicionais: ["https://noticias.uol.com.br/eleicoes/2026/08/30/lula-pede-cassacao-de-chapa-de-flavio-por-ato-em-barretos.ghtm", "https://www1.folha.uol.com.br/poder/2026/08/campanha-de-lula-faz-ofensiva-no-tse-contra-flavio-bolsonaro-caiado-e-zema-por-postagens-e-discursos.shtml", "https://www.tse.jus.br/eleicoes/eleicoes-2026"],
    automatico: true,
    coletadoEm: "2026-08-30T17:34:09.000Z"
  },
  {
    id: 170452035257,
    slug: "homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es",
    titulo: "Homem é preso 10 anos após ocorrência por desacato e desobediência no ES",
    categoria: "Segurança Pública",
    data: "2026-08-27",
    imagem: "imagens/auto-seguranca-publica.svg",
    resumo: "Caso ocorreu em 2016, quando condenado foi a uma unidade da PM reclamar de uma abordagem e acabou detido",
    conteudo: `<p>Caso ocorreu em 2016, quando condenado foi a uma unidade da PM reclamar de uma abordagem e acabou detido</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. Para preservar contexto, autoria e eventuais atualizações posteriores, o texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href="https://www.agazeta.com.br/agora/homem-e-preso-10-anos-apos-ocorrencia-por-desacato-e-desobediencia-no-es-0826" target="_blank" rel="noopener noreferrer">A Gazeta - Polícia</a>.</p>`,
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
    conteudo: `<p>Considerando a margem de erro do levantamento, que é de 3 pontos para mais ou para menos, os candidatos estão tecnicamente empatados</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. Para preservar contexto, autoria e eventuais atualizações posteriores, o texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href="https://www.agazeta.com.br/es/politica/flavio-tem-34-e-lula-29-entre-eleitores-do-es-no-1-turno-mostra-quaest-0826" target="_blank" rel="noopener noreferrer">A Gazeta - Política</a>.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "A Gazeta - Política",
    fonteUrl: "https://www.agazeta.com.br/es/politica/flavio-tem-34-e-lula-29-entre-eleitores-do-es-no-1-turno-mostra-quaest-0826",
    automatico: true,
    coletadoEm: "2026-08-28T00:53:48.958Z"
  },
  {
    id: 559715546640,
    slug: "ricardo-ferracco-preve-escolas-integrais-e-aeroporto",
    titulo: "Ricardo Ferraço prevê escolas integrais e aeroporto",
    categoria: "Política ES",
    data: "2026-08-27",
    imagem: "https://uploads.folhavitoria.com.br/imagens/2026/08/Convencao-do-Partido-MDB-10-2048x1369.jpg",
    resumo: "O plano de governo inclui propostas para 19 áreas, como segurança pública, educação, saúde, meio ambiente, gestão, entre outras",
    conteudo: `<p>O plano de governo inclui propostas para 19 áreas, como segurança pública, educação, saúde, meio ambiente, gestão, entre outras</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. Para preservar contexto, autoria e eventuais atualizações posteriores, o texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href="https://www.folhavitoria.com.br/eleicoes/plano-de-ricardo-ferraco-preve-escolas-integrais-hospital-veterinario-e-aeroporto-de-cargas/" target="_blank" rel="noopener noreferrer">Folha Vitória - Política</a>.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "Folha Vitória - Política",
    fonteUrl: "https://www.folhavitoria.com.br/eleicoes/plano-de-ricardo-ferracco-preve-escolas-integrais-hospital-veterinario-e-aeroporto-de-cargas/",
    automatico: true,
    coletadoEm: "2026-08-28T00:53:48.958Z"
  }
];
if (typeof materiasEditoriais35 !== "undefined") noticias.unshift(...materiasEditoriais35);
