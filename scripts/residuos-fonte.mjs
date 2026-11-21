// Resíduos de outros sites que não podem aparecer no texto de uma matéria do
// Notícia ES: chamadas de assinatura, newsletters, canais de WhatsApp/Telegram,
// formulários de comentário, biografias de jornalistas de outros veículos etc.
//
// Usado em três lugares, para que nunca divirjam:
// - scripts/reapurar-lote-redacao.mjs: descarta o parágrafo ao montar o texto;
// - scripts/redator-automatico.mjs: barra a matéria se algum resíduo escapar;
// - scripts/limpar-residuos-fonte.mjs: limpa o acervo já publicado.
//
// Regra: cada padrão descreve um parágrafo INTEIRO que é resíduo. Na dúvida,
// não incluir: um padrão amplo demais apagaria texto jornalístico.

export const PADROES_RESIDUO = [
  // BBC News Brasil
  /\bBBC World Service\b/i,
  /^(?:Veja|Acompanhe|Confira)\b[^.]{0,140}(?:mapa interativo|Agregador de Pesquisas) da BBC News Brasil\s*\.?\s*$/i,
  /^(?:Siga|Assista|Inscreva-se|Acompanhe) (?:a|o|no|na) BBC\b/i,
  // Formulários de comentário de blogs
  /Salvar meus dados neste navegador/i,
  /endere[cç]o de e-?mail n[aã]o ser[aá] publicado/i,
  /Campos obrigat[oó]rios s[aã]o marcados/i,
  // Folha de S.Paulo
  /\bLINK PRESENTE\b/i,
  /\bAssinantes? (?:pode|podem) liberar\b/i,
  /reportagens e an[aá]lises publicadas a cada dia/i,
  /jornalismo profissional que fiscaliza o poder p[uú]blico/i,
  /^Editado por [^.]{0,60}, espa[cç]o traz not[ií]cias/i,
  // Newsletters, alertas e canais
  /^Receba (?:no seu e-?mail|not[ií]cias|as not[ií]cias|alertas|gr[aá]tis)\b/i,
  /\breceba [^.]{0,80} no seu (?:WhatsApp|Telegram)\b/i,
  /\bQuer morar fora(?: do Brasil)?\?/i,
  /^(?:>>|&gt;&gt;|\+)?\s*Siga (?:o|a|nosso|nossa) (?:canal|perfil|coluna|p[aá]gina|conta)\b/i,
  /^Entre no canal\b/i,
  /^Formul[aá]rio de cadastro\b/i,
  /^Bastidores, v[ií]deos e an[aá]lises de economia e pol[ií]tica/i,
  /^Informa[cç][oõ]es, an[aá]lises e recomenda[cç][oõ]es que valem dinheiro/i,
  /Voc[eê] quer ficar por dentro das not[ií]cias mais importantes e receber notifica[cç][oõ]es/i,
  /^J[aá] leu todas as notas e reportagens da coluna/i,
  // Chamadas internas de outros veículos
  /^\+?\s*(?:Leia|Veja) (?:mais|tamb[eé]m)\s*:/i,
  /\bguia de Oeste\b/i,
  /^\+?\s*Leia mais: Entenda .{0,80} em Oeste\s*$/i,
  /\bIM Trader\b/i,
  /^D[oó]lar: Confira a cota[cç][aã]o/i,
  /^An[aá]lises de [^.]{0,80} do GLOBO\s*$/i,
  /^Clique aqui\b/i,
  // Perfis de autores de outros veículos
  /^Esse perfil [eé] dedicado ao grupo de redatores/i,
  /^Jornalista,? (?:formad[oa]|p[oó]s-graduad[oa])\b/i,
  /^Graduad[oa] em jornalismo\b/i,
  /\bnasceu em [^.]{0,40} e se formou em jornalismo\b/i,
  /^Tamb[eé]m teve passagens por\b/i,
  /^[ÉE] autor dos livros\b/i,
  // Avisos de apuração de OUTRA redação (Poder360/Metrópoles): no Notícia ES
  // dariam a entender que o portal procurou essas pessoas. Só parágrafos que
  // são apenas o aviso; frases com conteúdo ("A este jornal digital, X disse…")
  // ficam para revisão editorial.
  // (Sem \b no fim: em JavaScript \b não trata "á" como letra, e "seguirá" nunca casava.)
  /^(?:O Poder360 (?:procurou|tamb[eé]m contatou)|Este jornal digital seguir[aá]|N[aã]o houve resposta at[eé] a publica[cç][aã]o|O texto ser[aá] atualizado caso)(?=[\s,.;:]|$)/i,
];

// Trechos que aparecem GRUDADOS em parágrafos de notícia: cortamos só o trecho.
export const TRECHOS_RESIDUO = [
  /\s*Formul[aá]rio de cadastro alertas gr[aá]tis do Poder360\s+concordo com os termos da LGPD\s*\.?\s*(?:Inscreva-se\s*)*/gi,
  /\s*Leia a linha do tempo do caso aqui\s*\.?/gi,
];

/** Remove de um texto/HTML os resíduos grudados (TRECHOS_RESIDUO). */
export function cortarTrechos(texto) {
  let t = String(texto);
  for (const p of TRECHOS_RESIDUO) t = t.replace(p, "");
  return t;
}

function decodificar(texto) {
  return String(texto)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&quot;/gi, '"').replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Texto (ou HTML) de UM parágrafo: é resíduo de outro site? Devolve o padrão que casou, ou null. */
export function residuoDaFonte(paragrafo) {
  const t = decodificar(paragrafo);
  if (!t) return null;
  for (const p of PADROES_RESIDUO) if (p.test(t)) return p;
  return null;
}

/** Parágrafos <p> de um HTML que são resíduo. */
export function paragrafosResiduo(html) {
  return [...String(html || "").matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => m[1])
    .filter((t) => residuoDaFonte(t));
}
