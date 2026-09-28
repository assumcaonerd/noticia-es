const noticiasAutoRedacao20260928154409 = [
  {
    id: 28092815440901,
    pautaId: "4a4311ede08651d4",
    slug: "nvidia-software-hardware-vigiar-agentes-ia",
    titulo: "Nvidia combina software e hardware para vigiar agentes de IA",
    categoria: "Tecnologia",
    data: "2026-09-28",
    imagem: "https://noticiaes.com.br/imagens/lapis/20260928-nvidia-software-hardware-vigiar-agentes-ia.jpg",
    resumo: "Plataforma anunciada nesta segunda-feira reúne ambiente isolado, regras externas e uma camada independente de monitoramento.",
    conteudo: `<p>A Nvidia anunciou nesta segunda-feira (28) uma plataforma de segurança para agentes de inteligência artificial. A proposta combina software aberto, isolamento de execução e uma camada de hardware capaz de monitorar e interromper ações consideradas perigosas.</p>
<p>A CNN Brasil noticiou o lançamento das ferramentas OpenShell e Sentry. A página oficial da Nvidia e a documentação técnica do OpenShell confirmam que os componentes formam a Open Agent Safety Platform, criada para acompanhar agentes desde os testes até a implantação em empresas e órgãos públicos.</p>
<p>Agentes de IA diferem de um chatbot que apenas responde perguntas. Eles podem acessar arquivos, executar comandos, usar serviços externos e encadear tarefas sem supervisão humana a cada etapa. Essa autonomia aumenta a produtividade, mas também amplia o impacto de uma instrução maliciosa, de uma credencial exposta ou de uma decisão inesperada.</p>
<p>A arquitetura apresentada pela empresa tenta separar o agente dos controles que limitam sua atuação. Em vez de confiar apenas nas regras seguidas pelo próprio modelo, a plataforma aplica políticas fora do processo em que ele funciona. Assim, o sistema de proteção permanece ativo mesmo quando o agente interpreta uma ordem de maneira errada.</p>
<h2>OpenShell isola ações dos agentes</h2>
<p>O OpenShell executa os agentes em ambientes isolados e permite definir, por meio de políticas, quais arquivos, processos, redes e provedores podem ser acessados. A documentação descreve uma estrutura em que as credenciais reais não precisam ficar expostas ao programa autônomo, pois o acesso a serviços pode ser intermediado por um gateway.</p>
<p>Esse desenho cria uma fronteira técnica entre a tarefa solicitada e os recursos sensíveis da organização. Um agente autorizado a consultar um banco de dados, por exemplo, não recebe automaticamente permissão para abrir qualquer arquivo do servidor ou enviar informações a um endereço externo.</p>
<p>Os registros de execução também fazem parte da proposta. A observabilidade permite acompanhar decisões, comandos e tentativas de acesso, o que ajuda equipes de segurança a investigar incidentes e revisar as políticas aplicadas. A empresa apresenta o OpenShell como software de código aberto, permitindo análise e integração por outros fornecedores.</p>
<p>A Nvidia informou ainda que trabalha com fabricantes como Arm e Intel para ampliar o suporte em processadores centrais. A participação de empresas de diferentes partes da infraestrutura indica que a proteção de agentes não será resolvida apenas pelo modelo de IA, mas também pelo ambiente em que ele opera.</p>
<h2>Sentry adiciona vigilância independente</h2>
<p>O Sentry acrescenta uma camada externa ao agente e ao software do computador hospedeiro. O projeto usa o BlueField-4, da Nvidia, para observar solicitações, respostas e sinais de funcionamento sem depender exclusivamente do sistema que está sendo fiscalizado.</p>
<p>Na prática, essa separação busca impedir que um agente desative o próprio mecanismo de controle. Se houver tentativa de sair do ambiente isolado ou de usar um recurso não autorizado, a camada independente pode intervir e bloquear a ação. O objetivo é aplicar um princípio já comum em segurança: nenhuma aplicação deve controlar sozinha as barreiras que a limitam.</p>
<p>A plataforma não elimina riscos nem substitui revisão humana, testes e configuração correta. Políticas permissivas continuam abrindo espaço para abuso, e um registro de auditoria só é útil quando há equipe capaz de analisá-lo. O anúncio, porém, mostra que a indústria está levando a proteção para além das respostas do modelo e incorporando controles no sistema operacional e no hardware.</p>
<p>Para empresas interessadas em agentes autônomos, a novidade oferece um caminho para adotar a tecnologia com limites verificáveis. A segurança dependerá da qualidade das regras, da atualização dos componentes e da capacidade de reagir aos alertas, mas a separação entre agente, ambiente e vigilância reduz a confiança concentrada em um único ponto.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "CNN Brasil",
    fonteUrl: "https://www.cnnbrasil.com.br/economia/money/inteligencia-artificial/nvidia-lanca-ferramentas-de-seguranca-para-conter-agentes-de-ia/",
    fontesAdicionais: [
      {"nome":"Nvidia — Open Agent Safety Platform","url":"https://www.nvidia.com/en-us/solutions/ai/agent-safety/"},
      {"nome":"Nvidia — documentação do OpenShell","url":"https://docs.nvidia.com/openshell/home"}
    ],
    entidades: ["Nvidia","OpenShell","Sentry","BlueField-4","Arm","Intel"],
    aeo: [
      {"pergunta":"O que a Nvidia anunciou nesta segunda-feira?","resposta":"Uma plataforma de segurança para agentes de IA que combina o software OpenShell e o projeto de hardware Sentry."},
      {"pergunta":"Para que serve o OpenShell?","resposta":"Ele executa agentes em ambientes isolados e aplica regras de acesso a arquivos, processos, redes e serviços."},
      {"pergunta":"Qual é a função do Sentry?","resposta":"Adicionar uma camada independente de monitoramento capaz de intervir quando um agente tenta ultrapassar os limites definidos."},
      {"pergunta":"Por que os controles ficam fora do agente?","resposta":"Para evitar que o próprio programa autônomo altere ou desative as barreiras responsáveis por limitar sua atuação."},
      {"pergunta":"A plataforma elimina todos os riscos?","resposta":"Não. Ela depende de políticas bem configuradas, atualizações, testes, auditoria e supervisão humana."}
    ],
    redacaoPropria: true,
    origemTexto: "redacao-noticia-es",
    automatico: true,
    publicadoEm: "2026-09-28T18:44:09.000Z"
  },
  {
    id: 28092815440902,
    pautaId: "6cd33c7ed507a3b6",
    slug: "nova-lei-futebol-feminino-prioridade-nacional",
    titulo: "Nova lei torna futebol feminino prioridade nacional",
    categoria: "Esporte",
    data: "2026-09-28",
    imagem: "https://noticiaes.com.br/imagens/lapis/20260928-nova-lei-futebol-feminino-prioridade-nacional.jpg",
    resumo: "Texto sancionado por Lula nesta segunda-feira prevê profissionalização, equidade e plano de legado para a Copa de 2027.",
    conteudo: `<p>O presidente Luiz Inácio Lula da Silva sancionou nesta segunda-feira (28) as novas diretrizes para o desenvolvimento do futebol feminino no Brasil. A norma inclui a modalidade entre as prioridades da política esportiva nacional e vincula a Copa do Mundo de 2027 a um plano de legado duradouro.</p>
<p>O G1 informou a sanção do projeto a cerca de um ano do torneio. O conteúdo foi confirmado nas páginas oficiais da Câmara dos Deputados e do Senado, que registram como eixos da proposta a profissionalização, a equidade de oportunidades e a elaboração de um plano social, esportivo e financeiro.</p>
<p>A mudança transforma em obrigação pública um debate que há anos acompanha a modalidade. O futebol feminino cresceu em audiência, patrocínio e presença nas competições, mas atletas e clubes ainda convivem com estruturas desiguais, calendários instáveis e diferenças de investimento em relação às equipes masculinas.</p>
<p>Ao definir a modalidade como prioridade, a lei orienta a atuação do poder público e a articulação com confederações, federações e clubes. O texto não resolve imediatamente as diferenças de recursos, mas estabelece uma base para programas, incentivos e cobranças ligados à formação, ao trabalho profissional e à participação feminina.</p>
<h2>Plano mira legado duradouro</h2>
<p>Um dos pontos centrais é a exigência de um plano de legado social, esportivo e financeiro para a Copa do Mundo Feminina de 2027, que será realizada no Brasil. A intenção é evitar que investimentos e mobilização desapareçam depois da partida final.</p>
<p>O legado deverá considerar ações nacionais capazes de ampliar a prática do futebol feminino, fortalecer competições, melhorar instalações e criar oportunidades além das cidades-sede. O desafio será converter metas gerais em cronograma, orçamento, responsáveis e indicadores públicos de execução.</p>
<p>A nova regra também reforça a equidade de oportunidades. Esse princípio alcança desde o acesso de meninas à iniciação esportiva até a presença de mulheres em funções técnicas, administrativas e de arbitragem, áreas nas quais a participação feminina ainda encontra barreiras.</p>
<p>As medidas de combate à discriminação e à violência ganham peso nesse ambiente. Protocolos claros, canais de denúncia e respostas institucionais são necessários para que o crescimento da modalidade não se limite à realização de grandes eventos, mas produza condições seguras e permanentes para atletas e profissionais.</p>
<h2>Copa acelera profissionalização brasileira</h2>
<p>O Mundial está previsto para ocorrer entre 24 de junho e 25 de julho de 2027, com partidas em oito capitais brasileiras. O calendário oferece uma janela para organizar campeonatos, preparar estruturas e ampliar a formação de atletas, treinadoras, árbitras e equipes de apoio.</p>
<p>A profissionalização depende de contratos estáveis, competições regulares e capacidade financeira dos clubes. Por isso, a sanção representa um ponto de partida, e não uma garantia automática de equilíbrio. A implementação exigirá coordenação entre União, estados, municípios e entidades responsáveis pelo futebol.</p>
<p>Também será necessário acompanhar como os recursos associados à Copa serão distribuídos. Investimentos concentrados apenas nos estádios e na operação do torneio podem produzir impacto curto. Projetos de base, formação técnica e manutenção de centros esportivos têm maior potencial de alcançar novas gerações.</p>
<p>O Brasil chega ao ciclo de 2027 com tradição esportiva e crescente interesse do público, mas com uma estrutura feminina ainda irregular. A lei sancionada cria um compromisso nacional para reduzir essa distância e estabelece que a Copa deve deixar resultados mensuráveis depois do encerramento da competição.</p>
<p>A efetividade será conhecida na execução do plano e na continuidade das políticas após 2027. Se os objetivos forem acompanhados por orçamento, transparência e metas verificáveis, o evento poderá funcionar como impulso para uma transformação permanente, em vez de produzir apenas uma temporada de visibilidade.</p>`,
    autor: "Redação Notícia ES",
    fonteNome: "G1",
    fonteUrl: "https://g1.globo.com/politica/noticia/2026/09/28/a-um-ano-da-copa-lula-sanciona-novas-regras-para-o-futebol-feminino.ghtml",
    fontesAdicionais: [
      {"nome":"Câmara dos Deputados — diretrizes para o futebol feminino","url":"https://www.camara.leg.br/noticias/1297265-camara-aprova-diretrizes-para-o-desenvolvimento-do-futebol-feminino"},
      {"nome":"Senado Notícias — prioridade na política esportiva","url":"https://www12.senado.leg.br/noticias/materias/2026/09/02/senado-aprova-prioridade-para-futebol-feminino-na-politica-de-esporte"}
    ],
    entidades: ["Luiz Inácio Lula da Silva","Copa do Mundo Feminina de 2027","Câmara dos Deputados","Senado Federal","Ministério do Esporte"],
    aeo: [
      {"pergunta":"O que muda com a nova lei do futebol feminino?","resposta":"A modalidade passa a ser prioridade na política esportiva nacional, com foco em profissionalização e equidade de oportunidades."},
      {"pergunta":"O que é o plano de legado da Copa de 2027?","resposta":"É um conjunto de ações sociais, esportivas e financeiras destinado a produzir resultados permanentes depois do torneio."},
      {"pergunta":"Quando será a Copa do Mundo Feminina no Brasil?","resposta":"O torneio está previsto para ocorrer de 24 de junho a 25 de julho de 2027."},
      {"pergunta":"Quantas capitais devem receber partidas?","resposta":"A programação prevê jogos em oito capitais brasileiras."},
      {"pergunta":"A sanção garante igualdade imediata?","resposta":"Não. A lei cria diretrizes, mas a mudança depende de orçamento, metas, fiscalização e coordenação entre governos e entidades esportivas."}
    ],
    redacaoPropria: true,
    origemTexto: "redacao-noticia-es",
    automatico: true,
    publicadoEm: "2026-09-28T18:44:09.000Z"
  }
];

if (typeof window !== "undefined") window.noticiasAutoRedacao20260928154409 = noticiasAutoRedacao20260928154409;
if (typeof noticias !== "undefined" && Array.isArray(noticias)) noticias.unshift(...noticiasAutoRedacao20260928154409);
if (typeof window !== "undefined" && Array.isArray(window.noticias) && (typeof noticias === "undefined" || window.noticias !== noticias)) window.noticias.unshift(...noticiasAutoRedacao20260928154409);
