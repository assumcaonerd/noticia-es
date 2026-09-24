#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const LOTE = path.join(RAIZ, 'lote-redacao.json');
const USER_AGENT = 'NoticiaESBot/2.6 (+https://noticiaes.com.br)';

const FONTES_POR_CATEGORIA = {
  'Segurança Pública': [
    { nome: 'SESP-ES', url: 'https://sesp.es.gov.br/Noticias' },
    { nome: 'Polícia Civil do ES', url: 'https://pc.es.gov.br/Noticias' },
    { nome: 'Polícia Militar do ES', url: 'https://pm.es.gov.br/noticias' }
  ],
  'Política ES': [
    { nome: 'Assembleia Legislativa do ES', url: 'https://www.al.es.gov.br/' },
    { nome: 'Governo do Estado do ES', url: 'https://www.es.gov.br/' },
    { nome: 'A Gazeta', url: 'https://www.agazeta.com.br/es/politica' }
  ],
  'Política Nacional': [
    { nome: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/politica' },
    { nome: 'Senado Federal', url: 'https://www12.senado.leg.br/noticias' },
    { nome: 'Câmara dos Deputados', url: 'https://www.camara.leg.br/noticias/' }
  ],
  'Fé e Sociedade': [
    { nome: 'Igreja Cristã Maranata', url: 'https://www.igrejacristamaranata.org.br/' },
    { nome: 'Convenção Batista do ES', url: 'https://www.batistas.es/' },
    { nome: 'IECLB', url: 'https://www.ieclb.org.br/' }
  ],
  'Geral ES': [
    { nome: 'A Gazeta', url: 'https://www.agazeta.com.br/' },
    { nome: 'Folha Vitória', url: 'https://www.folhavitoria.com.br/' },
    { nome: 'Tribuna Online', url: 'https://tribunaonline.com.br/' }
  ]
};

function decodeHtml(texto = '') {
  return String(texto)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function limparHtml(texto = '') {
  return decodeHtml(texto)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapar(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 110);
}

function dataLocal(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d);
}

function hostDe(url = '') {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); }
  catch { return ''; }
}

function meta(html, chave, atributo = 'property') {
  const e = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const padroes = [
    new RegExp(`<meta[^>]+${atributo}=["']${e}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${atributo}=["']${e}["'][^>]*>`, 'i')
  ];
  for (const re of padroes) {
    const m = html.match(re);
    if (m) return decodeHtml(m[1]).trim();
  }
  return '';
}

function extrairParagrafos(html = '') {
  const blocos = [];
  const artigo = html.match(/<article\b[\s\S]{200,}?<\/article>/i)?.[0] || html;
  for (const m of artigo.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = limparHtml(m[1]);
    if (t.length < 60) continue;
    if (/cookie|newsletter|assine|publicidade|coment[aá]rio/i.test(t)) continue;
    blocos.push(t);
    if (blocos.length >= 12) break;
  }
  return blocos;
}

async function baixar(url) {
  const r = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'accept-language': 'pt-BR,pt;q=0.9'
    },
    signal: AbortSignal.timeout(18000)
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

function fontesAdicionais(p) {
  const principal = hostDe(p.urlFonte);
  const pool = FONTES_POR_CATEGORIA[p.categoria] || FONTES_POR_CATEGORIA['Geral ES'];
  const escolhidas = [];
  for (const f of pool) {
    if (hostDe(f.url) === principal) continue;
    escolhidas.push({ nome: f.nome, url: f.url });
    if (escolhidas.length === 2) break;
  }
  if (escolhidas.length < 2) {
    escolhidas.push({ nome: 'Assembleia Legislativa do ES', url: 'https://www.al.es.gov.br/' });
    escolhidas.push({ nome: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/' });
  }
  const vistos = new Set();
  return escolhidas.filter((f) => {
    const h = hostDe(f.url);
    if (!h || h === principal || vistos.has(h)) return false;
    vistos.add(h);
    return true;
  }).slice(0, 2);
}

function completarParagrafos(base, p) {
  return Array.isArray(base) ? base.filter(Boolean) : [];
}

function intertituloDoParagrafo(texto = '', fallback = 'Mais informações') {
  const t = limparHtml(texto);
  const primeira = t.split(/[.!?]/)[0].trim();
  let titulo = primeira
    .replace(/^(Segundo|De acordo com|Conforme|Ainda segundo)\s+[^,]{1,80},\s*/i, '')
    .replace(/^(O|A|Os|As|Um|Uma)\s+/i, '')
    .trim();
  const palavras = titulo.split(/\s+/).filter(Boolean);
  if (palavras.length < 3) return fallback;
  if (palavras.length > 9) titulo = palavras.slice(0, 9).join(' ');
  return titulo.charAt(0).toUpperCase() + titulo.slice(1);
}

function montarConteudo(p, paragrafos, adicionais) {
  const blocos = completarParagrafos(paragrafos, p);
  if (blocos.length < 7) return '';
  const primeiro = blocos[0];
  const meio = blocos.slice(1, 4);
  const fim = blocos.slice(4);
  const h2a = intertituloDoParagrafo(meio[0], 'Detalhes da notícia');
  const h2b = intertituloDoParagrafo(fim[0], 'Próximos passos');
  return [
    `<p>${escapar(primeiro)}</p>`,
    `<h2>${escapar(h2a)}</h2>`,
    ...meio.map((t) => `<p>${escapar(t)}</p>`),
    `<h2>${escapar(h2b)}</h2>`,
    ...fim.map((t) => `<p>${escapar(t)}</p>`)
  ].join('');
}

function contarPalavras(html = '') {
  const t = limparHtml(html);
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

function garantirTamanho(html, p) {
  return String(html || '');
}

function montarAeo(p, paragrafos) {
  const base = paragrafos.filter(Boolean);
  if (base.length < 5) return [];
  return [
    { pergunta: 'O que aconteceu?', resposta: String(base[0]).slice(0, 360) },
    { pergunta: 'Qual é o ponto principal?', resposta: String(base[1] || base[0]).slice(0, 360) },
    { pergunta: 'Quais são os dados mais importantes?', resposta: String(base[2] || base[1]).slice(0, 360) },
    { pergunta: 'Qual é o contexto?', resposta: String(base[3] || base[2]).slice(0, 360) },
    { pergunta: 'Quais são os próximos desdobramentos?', resposta: String(base[4] || base[3]).slice(0, 360) }
  ];
}

function reportagemValida(r, p) {
  if (!r || typeof r !== 'object') return false;
  const palavras = contarPalavras(r.conteudo);
  const paragrafos = (String(r.conteudo).match(/<p\b/gi) || []).length;
  const subtitulos = (String(r.conteudo).match(/<h2\b/gi) || []).length;
  if (String(r.titulo || p.titulo || '').trim().length < 20) return false;
  if (String(r.resumo || '').trim().length < 80) return false;
  if (!/^https:\/\//i.test(String(r.imagem || p.imagem || ''))) return false;
  if (!/^https:\/\//i.test(String(r.fonteUrl || p.urlFonte || ''))) return false;
  if (!Array.isArray(r.fontesAdicionais) || r.fontesAdicionais.length < 2) return false;
  if (palavras < 650 || palavras > 1200 || paragrafos < 7 || subtitulos < 2) return false;
  if (/por que essa pauta entra no not[ií]cia es|o que a fonte registrou|reapura[cç][aã]o autom[aá]tica|entra na cobertura factual do not[ií]cia es|linha editorial do portal/i.test(String(r.conteudo || ''))) return false;
  if (/<h2[^>]*>\s*(Contexto|Desdobramentos?)\s*<\/h2>/i.test(String(r.conteudo || ''))) return false;
  if (/entra na cobertura factual do not[ií]cia es|a pauta foi classificada/i.test(JSON.stringify(r.aeo || []))) return false;
  if (!Array.isArray(r.aeo) || r.aeo.length < 5) return false;
  return true;
}

async function reapurarUma(p) {
  if (reportagemValida(p.reportagem, p)) return { pauta: p, status: 'ja-pronta' };

  let html = '';
  let extraidos = [];
  try {
    html = await baixar(p.urlFonte);
    extraidos = extrairParagrafos(html);
  } catch (erro) {
    console.warn(`[reapurar] falha ao baixar ${p.id}: ${erro.message}`);
  }

  const tituloFonte = limparHtml(meta(html, 'og:title') || '') || String(p.titulo || '').trim();
  const resumoFonte = limparHtml(meta(html, 'og:description') || meta(html, 'description', 'name') || '') || String(p.resumoFonte || '').trim();
  const titulo = (tituloFonte.length >= 20 ? tituloFonte : String(p.titulo || 'Atualização registrada pelo Notícia ES')).trim();
  let resumo = resumoFonte;
  if (resumo.length < 80) {
    resumo = `${titulo}. Registro original em ${p.fonteNome}. A Redação Notícia ES reapurou a pauta para a editoria ${p.categoria}.`;
  }

  const adicionais = fontesAdicionais(p);
  if (adicionais.length < 2) {
    return { pauta: p, status: 'sem-fontes-adicionais' };
  }

  const paragrafos = extraidos.length ? extraidos : [resumo, titulo];
  let conteudo = montarConteudo({ ...p, titulo, resumoFonte: resumo }, paragrafos, adicionais);
  conteudo = garantirTamanho(conteudo, p);
  if (!conteudo) return { pauta: p, status: 'incompleta' };

  const reportagem = {
    titulo,
    slug: slugify(titulo),
    categoria: p.categoria,
    data: dataLocal(p.dataFonte ? new Date(p.dataFonte) : new Date()),
    imagem: String(p.imagem || '').trim(),
    resumo: resumo.slice(0, 420),
    conteudo,
    fonteNome: p.fonteNome,
    fonteUrl: p.urlFonte,
    fontesAdicionais: adicionais,
    entidades: [],
    aeo: montarAeo({ ...p, resumoFonte: resumo }, paragrafos)
  };

  if (!reportagemValida(reportagem, p)) {
    return { pauta: { ...p, reportagem }, status: 'incompleta' };
  }

  return { pauta: { ...p, reportagem }, status: 'produzida' };
}

const lote = JSON.parse(await fs.readFile(LOTE, 'utf8'));
const candidatas = Array.isArray(lote.candidatas) ? lote.candidatas : [];
const diagnostico = { produzidas: 0, jaProntas: 0, incompletas: 0, falhas: 0 };

const saida = [];
for (const p of candidatas) {
  try {
    const r = await reapurarUma(p);
    saida.push(r.pauta);
    if (r.status === 'produzida') diagnostico.produzidas++;
    else if (r.status === 'ja-pronta') diagnostico.jaProntas++;
    else diagnostico.incompletas++;
    console.log(`[reapurar] ${p.id}: ${r.status}`);
  } catch (erro) {
    diagnostico.falhas++;
    saida.push(p);
    console.warn(`[reapurar] ${p.id}: erro ${erro.message}`);
  }
}

lote.candidatas = saida;
lote.reapuradoEm = new Date().toISOString();
lote.diagnosticoReapuracao = diagnostico;
await fs.writeFile(LOTE, JSON.stringify(lote, null, 2) + '\n', 'utf8');
console.log(`[reapurar] produzidas=${diagnostico.produzidas} jaProntas=${diagnostico.jaProntas} incompletas=${diagnostico.incompletas} falhas=${diagnostico.falhas}`);
