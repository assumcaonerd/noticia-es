/*
  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO
  ==================================================
  Este arquivo recebe notícias manuais e automáticas.
  O motor automático roda pelo GitHub Actions e insere novas matérias no topo.
  Para publicação manual, use publicar.html e cole o objeto logo após "const noticias = [".
*/

const noticias = [
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
    fonteUrl: "https://www.folhavitoria.com.br/eleicoes/plano-de-ricardo-ferraco-preve-escolas-integrais-hospital-veterinario-e-aeroporto-de-cargas/",
    automatico: true,
    coletadoEm: "2026-08-28T00:53:48.958Z"
  }
];
