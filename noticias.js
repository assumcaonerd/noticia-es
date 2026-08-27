/*
  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO
  ==================================================
  PARA PUBLICAR UMA NOVA NOTÍCIA:
  1. Abra publicar.html no navegador.
  2. Preencha o formulário e clique em "Gerar notícia".
  3. Copie o objeto gerado.
  4. Cole o objeto LOGO ABAIXO DE "const noticias = [", antes das notícias existentes.
  5. Salve este arquivo e envie novamente para o servidor.
*/

const noticias = [
  // COLE A NOVA NOTÍCIA AQUI, NO TOPO DO ARRAY.
  {
    id: 4,
    slug: "assembleia-es-debate-novas-prioridades-para-seguranca-publica",
    titulo: "Assembleia do ES debate novas prioridades para a segurança pública",
    categoria: "Política ES",
    data: "2026-08-27",
    imagem: "https://placehold.co/1200x675/17324d/ffffff?text=Pol%C3%ADtica+ES",
    resumo: "Parlamentares capixabas discutem propostas de reforço à segurança pública e novos investimentos para os municípios.",
    conteudo: `<p>A Assembleia Legislativa do Espírito Santo abriu uma nova rodada de debates sobre políticas de segurança pública, com foco em investimentos, estrutura operacional e integração entre os municípios.</p><p>Entre os temas discutidos estão a modernização de equipamentos, a valorização dos profissionais da área e o aperfeiçoamento de ações preventivas. A expectativa é que parte das propostas avance para análise das comissões temáticas da Casa.</p><p>O debate deve continuar nas próximas sessões, com participação de representantes do poder público e de entidades ligadas ao setor.</p>`,
    autor: "Redação Notícia ES"
  },
  {
    id: 3,
    slug: "governo-do-es-anuncia-novo-pacote-de-investimentos-regionais",
    titulo: "Governo do ES anuncia novo pacote de investimentos regionais",
    categoria: "Política ES",
    data: "2026-08-26",
    imagem: "https://placehold.co/1200x675/7a1830/ffffff?text=Esp%C3%ADrito+Santo",
    resumo: "Medidas incluem obras de infraestrutura e repasses para municípios em diferentes regiões capixabas.",
    conteudo: `<p>O Governo do Espírito Santo anunciou um novo conjunto de investimentos voltados a obras de infraestrutura e melhoria de serviços públicos em diversas regiões do Estado.</p><p>Segundo as informações divulgadas, os recursos serão distribuídos entre projetos de mobilidade, urbanização e modernização de equipamentos públicos.</p><p>O cronograma de execução deverá variar conforme a etapa de cada projeto e a formalização dos convênios com os municípios beneficiados.</p>`,
    autor: "Redação Notícia ES"
  },
  {
    id: 2,
    slug: "congresso-retoma-debate-sobre-reforma-politica-em-brasilia",
    titulo: "Congresso retoma debate sobre reforma política em Brasília",
    categoria: "Política Nacional",
    data: "2026-08-25",
    imagem: "https://placehold.co/1200x675/202734/ffffff?text=Pol%C3%ADtica+Nacional",
    resumo: "Líderes partidários voltam a discutir mudanças nas regras eleitorais e possíveis ajustes no sistema político brasileiro.",
    conteudo: `<p>O Congresso Nacional retomou as discussões sobre mudanças nas regras eleitorais e no funcionamento do sistema político brasileiro.</p><p>Os debates incluem propostas relacionadas a partidos, campanhas, representação parlamentar e mecanismos de transparência.</p><p>Ainda não há consenso sobre um texto final, e as negociações devem continuar entre as bancadas antes de qualquer votação em plenário.</p>`,
    autor: "Redação Notícia ES"
  },
  {
    id: 1,
    slug: "opiniao-politica-capixaba-entra-em-fase-de-definicoes",
    titulo: "Opinião: política capixaba entra em fase de definições",
    categoria: "Opinião",
    data: "2026-08-24",
    imagem: "https://placehold.co/1200x675/e8e4dd/1c2733?text=Opini%C3%A3o",
    resumo: "Com o calendário eleitoral avançando, alianças e estratégias ganham peso nas principais disputas do Espírito Santo.",
    conteudo: `<p>O cenário político capixaba entra em uma etapa decisiva. À medida que o calendário avança, partidos, lideranças e grupos regionais precisam transformar articulação em estratégia concreta.</p><p>Mais do que observar pesquisas isoladas, será importante acompanhar tendências, alianças, rejeição, presença territorial e capacidade de comunicação com o eleitor.</p><p>O Espírito Santo tem um eleitorado atento a temas locais, especialmente segurança pública, infraestrutura, geração de emprego e qualidade dos serviços públicos.</p>`,
    autor: "Coluna Notícia ES"
  }
];
