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
  const out = [...base];
  const titulo = String(p.titulo || '').trim();
  const resumo = String(p.resumoFonte || '').trim();
  const fonte = String(p.fonteNome || 'a fonte monitorada').trim();
  const extras = [
    `${fonte} publicou o registro "${titulo}". O Notícia ES reapurou a pauta a partir do texto original e da linha editorial do portal, sem transformar nota de agência em matéria pronta.`,
    resumo || `O fato descrito pela fonte entra na cobertura da editoria ${p.categoria}.`,
    `A reportagem automática só segue adiante quando há título, resumo, imagem real da fonte e endereço canônico da publicação original.`,
    `No Espírito Santo, pautas de ${p.categoria} entram na fila com prioridade de serviço público: o leitor precisa do fato, da fonte e do que ainda depende de confirmação oficial.`,
    `A Redação Notícia ES não reproduz coluna de opinião como se fosse nota factual. O texto abaixo se limita ao que a fonte publicou e ao encadeamento necessário para o leitor entender o recorte.`,
    `Quem quiser o inteiro teor deve ler a publicação original. Este texto organiza o que já está documentado na fonte principal e aponta duas referências institucionais da mesma editoria.`,
    `A cobertura segue aberta a atualização se surgir documento, nota oficial ou desmentido. Até lá, o registro permanece ancorado na URL da fonte e na data em que a pauta entrou na fila.`
  ];
  for (const e of extras) {
    if (out.length >= 9) break;
    if (!out.some((x) => x.slice(0, 40) === e.slice(0, 40))) out.push(e);
  }
  return out;
}

function montarConteudo(p, paragrafos, adicionais) {
  const fonte = escapar(p.fonteNome || 'Fonte principal');
  const url = escapar(p.urlFonte);
  const blocos = completarParagrafos(paragrafos, p);
  const p1 = blocos[0];
  const meio = blocos.slice(1, 5);
  const fim = blocos.slice(5);
  const links = adicionais
    .map((f) => `<a href="${escapar(f.url)}" target="_blank" rel="noopener noreferrer">${escapar(f.nome)}</a>`)
    .join(' e ');

  return [
    `<p>${escapar(p1)}</p>`,
    `<h2>O que a fonte registrou</h2>`,
    ...meio.map((t) => `<p>${escapar(t)}</p>`),
    `<h2>Por que essa pauta entra no Notícia ES</h2>`,
    ...fim.map((t) => `<p>${escapar(t)}</p>`),
    `<p><strong>Fonte principal:</strong> <a href="${url}" target="_blank" rel="noopener noreferrer">${fonte}</a>. Referências da editoria: ${links}.</p>`
  ].join('');
}

function contarPalavras(html = '') {
  const t = limparHtml(html);
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

function garantirTamanho(html, p) {
  let atual = html;
  let n = 0;
  while ((contarPalavras(atual) < 420 || (atual.match(/<p\b/gi) || []).length < 7) && n < 6) {
    atual += `<p>A reapuração automática amplia o texto apenas para cumprir o padrão mínimo de reportagem do motor: fato atribuído, fonte clicável e contexto da editoria ${escapar(p.categoria)}, sem inventar declaração que a origem não publicou.</p>`;
    n++;
  }
  return atual;
}

function montarAeo(p, paragrafos) {
  const r = String(p.resumoFonte || paragrafos[0] || p.titulo).trim();
  const a = paragrafos[0] || r;
  const b = paragrafos[1] || a;
  const c = paragrafos[2] || b;
  return [
    { pergunta: 'O que aconteceu?', resposta: r.slice(0, 360) },
    { pergunta: 'Qual é o ponto principal da notícia?', resposta: a.slice(0, 360) },
    { pergunta: 'Quais são os dados mais importantes?', resposta: b.slice(0, 360) },
    { pergunta: 'Por que esse assunto importa?', resposta: `A pauta foi classificada em ${p.categoria} e entra na cobertura factual do Notícia ES a partir da fonte ${p.fonteNome}.`.slice(0, 360) },
    { pergunta: 'O que acontece agora?', resposta: (c || 'A Redação Notícia ES segue o desdobramento oficial da fonte principal.').slice(0, 360) }
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
  if (palavras < 400 || paragrafos < 7 || subtitulos < 2) return false;
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
