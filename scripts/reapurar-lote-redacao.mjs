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
  'Justiça': [
    { nome: 'STF Notícias', url: 'https://portal.stf.jus.br/noticias/' },
    { nome: 'MPF', url: 'https://www.mpf.mp.br/pgr/noticias-pgr' },
    { nome: 'STJ Notícias', url: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias.aspx' }
  ],
  'Tecnologia': [
    { nome: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/' },
    { nome: 'MCTI', url: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/noticias' },
    { nome: 'Governo Federal', url: 'https://www.gov.br/pt-br/noticias' }
  ],
  'Economia': [
    { nome: 'Agência Brasil Economia', url: 'https://agenciabrasil.ebc.com.br/economia' },
    { nome: 'Banco Central', url: 'https://www.bcb.gov.br/detalhenoticia' },
    { nome: 'Ministério da Fazenda', url: 'https://www.gov.br/fazenda/pt-br/assuntos/noticias' }
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
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/&#39;|'/g, "'")
    .replace(/</g, '<')
    .replace(/>/g, '>')
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
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
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

function limparTituloFonte(titulo = '') {
  return String(titulo)
    .replace(/\s*\|\s*(?:Blogs\s*\|\s*)?(?:CNN Brasil|Folha(?: de S\.?Paulo)?|O Globo|Estad[aã]o|Veja|Revista Oeste|Ag[eê]ncia Brasil).*$/i, '')
    .replace(/\s*[-–—]\s*(?:CNN(?: Brasil)?|Folha(?: de S\.?Paulo)?|O Globo|Estad[aã]o|Veja|Revista Oeste).*$/i, '')
    .trim();
}

function dataLocal(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d);
}

function hostDe(url = '') {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); }
  catch { return ''; }
}

function urlFonteLimpa(url = '') {
  const u = String(url || '').trim();
  const m = u.match(/\*https?:\/\/\S+/i);
  if (m) return m[0].replace(/^\*/, '');
  return u;
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

function paragrafoSujo(texto = '') {
  const t = limparHtml(texto);
  return /cookie|newsletter|assine|publicidade|coment[aá]rio|leia também|pic\.twitter\.com|você tem \d+ acessos por dia|assinantes podem liberar(?: \d+)? acessos por dia|jornalista(?:,)?\s+pós-graduad[oa]|graduad[oa] em jornalismo|formad[oa] em jornalismo|editor-assistente|colunista da|\bblogs\b|seu endereço de e-mail não será publicado/i.test(t);
}

function recorteArtigo(html = '') {
  const candidatos = [
    html.match(/<article\b[\s\S]{200,}?<\/article>/i)?.[0],
    html.match(/itemprop=["']articleBody["'][^>]*>([\s\S]{200,}?)<\/(?:div|section|article)>/i)?.[0],
    html.match(/class=["'][^"']*(?:article-body|article__content|news-text|content-text|materia-texto|mc-article-body)[^"']*["'][^>]*>([\s\S]{200,}?)<\/(?:div|section|article)>/i)?.[0]
  ].filter(Boolean);
  return candidatos.sort((a, b) => b.length - a.length)[0] || html;
}

function extrairJsonLd(html = '') {
  const blocos = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const dado = JSON.parse(m[1]);
      const lista = Array.isArray(dado) ? dado : [dado];
      for (const item of lista) {
        const corpo = item?.articleBody || item?.text || item?.description || '';
        const t = limparHtml(String(corpo));
        if (t.length >= 80 && !paragrafoSujo(t)) blocos.push(t);
      }
    } catch {}
  }
  return blocos;
}

function extrairParagrafos(html = '') {
  const blocos = [];
  const vistos = new Set();
  const artigo = recorteArtigo(html);
  const fontes = [
    ...artigo.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi),
    ...artigo.matchAll(/<(?:div|span)\b[^>]*(?:class|itemprop)=["'][^"']*(?:paragraph|text|body)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span)>/gi)
  ];
  for (const m of fontes) {
    const t = limparHtml(m[1]);
    if (t.length < 50) continue;
    if (paragrafoSujo(t)) continue;
    const chave = t.toLowerCase();
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    blocos.push(t);
    if (blocos.length >= 16) break;
  }
  if (blocos.length < 4) {
    for (const t of extrairJsonLd(html)) {
      const chave = t.toLowerCase();
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      blocos.push(t);
    }
  }
  return blocos;
}

async function baixar(url) {
  const r = await fetch(urlFonteLimpa(url), {
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
  const principal = hostDe(urlFonteLimpa(p.urlFonte));
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

function completarParagrafos(base) {
  const originais = Array.isArray(base) ? base.filter(Boolean) : [];
  const vistos = new Set();
  const saida = [];
  for (const t of originais) {
    const chave = limparHtml(t).toLowerCase();
    if (!chave || vistos.has(chave)) continue;
    vistos.add(chave);
    saida.push(t);
  }

  const divididos = [];
  for (const t of saida) {
    if (t.length < 280) { divididos.push(t); continue; }
    const frases = t.split(/(?<=[.!?])\s+/).filter(Boolean);
    let atual = '';
    for (const frase of frases) {
      const teste = (atual ? atual + ' ' : '') + frase;
      if (teste.length > 220 && atual.length >= 80) {
        divididos.push(atual.trim());
        atual = frase;
      } else {
        atual = teste;
      }
    }
    if (atual.trim()) divididos.push(atual.trim());
  }
  return divididos.filter(t => limparHtml(t).length >= 50);
}

const FIM_INCOMPLETO = /\b(?:de|da|do|das|dos|em|no|na|para|com|por|que|se|contra|sobre|entre|uma|um|o|a|estar|fazer|tem|ter|ser|vai|pode|deve|chegar|cheguei|publicar|analisar|avaliar|investigar|decidir|apurar|abrir|designar|encaminhar|filiado|ligado)$/i;

function fallbackIntertitulo(texto = '', categoria = '') {
  const t = limparHtml(texto).toLowerCase();
  const c = String(categoria || '').toLowerCase();
  if (/pesquisa|levantamento|percentual|índice|indice|datafolha|quaest|veritá|verita/.test(t)) return 'O que a pesquisa mostra';
  if (/tribunal|stf|stj|tse|tre|juiz|justiça|justica|processo|recurso/.test(t) || /justiça/.test(c)) return 'O que o tribunal vai decidir';
  if (/documento|mensagem|relatório|relatorio|conversa|registro|ofício|oficio/.test(t)) return 'O que os documentos mostram';
  if (/segurança|seguranca|polícia|policia|crime|prisão|prisao/.test(t) || /segurança/.test(c)) return 'O que muda na segurança';
  if (/economia|preço|preco|renda|imposto|tarifa|salário|salario|custo/.test(t) || /economia/.test(c)) return 'O que muda no bolso';
  if (/espírito santo|espirito santo|capixaba|vitória|vitoria|governo do es|assembleia/.test(t) || /es$/.test(c)) return 'O que está em jogo no ES';
  if (/debate|discussão|discussao|divergência|divergencia/.test(t)) return 'O que pesou no debate';
  return 'O que muda na prática';
}

function intertituloDoParagrafo(texto = '', categoria = '') {
  const t = limparHtml(texto);
  const primeira = t.split(/[.!?]/)[0].trim();
  let titulo = primeira
    .replace(/^(Segundo|De acordo com|Conforme|Ainda segundo)\s+[^,]{1,80},\s*/i, '')
    .replace(/^(O|A|Os|As|Um|Uma)\s+/i, '')
    .trim();

  let palavras = titulo.split(/\s+/).filter(Boolean);
  if (palavras.length < 4) return fallbackIntertitulo(texto, categoria);
  if (palavras.length <= 9) {
    const pronto = palavras.join(' ');
    if (!FIM_INCOMPLETO.test(pronto)) return pronto.charAt(0).toUpperCase() + pronto.slice(1);
    return fallbackIntertitulo(texto, categoria);
  }
  palavras = palavras.slice(0, 9);
  while (palavras.length > 4 && FIM_INCOMPLETO.test(palavras.join(' '))) palavras.pop();
  const candidato = palavras.join(' ').trim();
  if (palavras.length < 4 || FIM_INCOMPLETO.test(candidato)) return fallbackIntertitulo(texto, categoria);
  return candidato.charAt(0).toUpperCase() + candidato.slice(1);
}

function montarConteudo(p, paragrafos) {
  const blocos = completarParagrafos(paragrafos);
  if (blocos.length < 5) return '';
  const primeiro = blocos[0];
  const corte = Math.max(2, Math.min(4, Math.floor(blocos.length / 2)));
  const meio = blocos.slice(1, corte);
  const fim = blocos.slice(corte);
  if (!meio.length || !fim.length) return '';
  const h2a = intertituloDoParagrafo(meio[0], p.categoria);
  const h2b = intertituloDoParagrafo(fim[0], p.categoria);
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

function montarAeo(paragrafos) {
  const base = paragrafos.filter(Boolean);
  if (base.length < 3) return [];
  return [
    { pergunta: 'O que aconteceu?', resposta: String(base[0]).slice(0, 360) },
    { pergunta: 'Qual é o ponto principal?', resposta: String(base[1] || base[0]).slice(0, 360) },
    { pergunta: 'Quais são os dados mais importantes?', resposta: String(base[2] || base[1]).slice(0, 360) },
    { pergunta: 'Qual é o contexto?', resposta: String(base[3] || base[2] || base[0]).slice(0, 360) },
    { pergunta: 'Quais são os próximos desdobramentos?', resposta: String(base[4] || base[3] || base[1]).slice(0, 360) }
  ];
}

function reportagemValida(r, p) {
  if (!r || typeof r !== 'object') return false;
  const palavras = contarPalavras(r.conteudo);
  const paragrafos = (String(r.conteudo).match(/<p\b/gi) || []).length;
  const subtitulos = (String(r.conteudo).match(/<h2\b/gi) || []).length;
  if (String(r.titulo || p.titulo || '').trim().length < 20) return false;
  if (String(r.resumo || '').trim().length < 60) return false;
  if (!/^https:\/\//i.test(String(r.imagem || p.imagem || ''))) return false;
  if (!/^https:\/\//i.test(String(r.fonteUrl || p.urlFonte || ''))) return false;
  if (!Array.isArray(r.fontesAdicionais) || r.fontesAdicionais.length < 2) return false;
  if (palavras < 220 || palavras > 1400 || paragrafos < 5 || subtitulos < 2) return false;
  if (/por que essa pauta entra no not[ií]cia es|o que a fonte registrou|reapura[cç][ãa]o autom[áa]tica|entra na cobertura factual do not[ií]cia es|linha editorial do portal/i.test(String(r.conteudo || ''))) return false;
  if (/<h2[^>]*>\s*(Contexto|Desdobramentos?)\s*<\/h2>/i.test(String(r.conteudo || ''))) return false;
  const conteudo = String(r.conteudo || '');
  const h2s = [...conteudo.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => limparHtml(m[1]));
  if (h2s.some(h => h.split(/\s+/).filter(Boolean).length < 4 || FIM_INCOMPLETO.test(h))) return false;
  if (paragrafoSujo(conteudo)) return false;
  if (/entra na cobertura factual do not[ií]cia es|a pauta foi classificada/i.test(JSON.stringify(r.aeo || []))) return false;
  if (!Array.isArray(r.aeo) || r.aeo.length < 5) return false;
  return true;
}

async function reapurarUma(p) {
  if (reportagemValida(p.reportagem, p)) return { pauta: p, status: 'ja-pronta' };

  const url = urlFonteLimpa(p.urlFonte);
  let html = '';
  let extraidos = [];
  try {
    html = await baixar(url);
    extraidos = extrairParagrafos(html);
  } catch (erro) {
    console.warn(`[reapurar] falha ao baixar ${p.id}: ${erro.message}`);
  }

  const tituloFonte = limparTituloFonte(limparHtml(meta(html, 'og:title') || '') || String(p.titulo || '').trim());
  const resumoFonte = limparHtml(meta(html, 'og:description') || meta(html, 'description', 'name') || '') || String(p.resumoFonte || '').trim();
  const titulo = limparTituloFonte(tituloFonte.length >= 20 ? tituloFonte : String(p.titulo || '')).trim();
  if (titulo.length < 20) return { pauta: p, status: 'incompleta' };
  let resumo = resumoFonte;
  if (resumo.length < 60) {
    resumo = `${titulo}. Registro original em ${p.fonteNome}. A Redação Notícia ES reapurou a pauta para a editoria ${p.categoria}.`;
  }

  const adicionais = fontesAdicionais(p);
  if (adicionais.length < 2) {
    return { pauta: p, status: 'sem-fontes-adicionais' };
  }

  const paragrafos = extraidos.length ? extraidos : [resumo, titulo].filter(t => limparHtml(t).length >= 50);
  const conteudo = montarConteudo({ ...p, titulo, resumoFonte: resumo }, paragrafos);
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
    fonteUrl: url,
    fontesAdicionais: adicionais,
    entidades: [],
    aeo: montarAeo(paragrafos.length >= 3 ? paragrafos : completarParagrafos(paragrafos))
  };

  if (!reportagemValida(reportagem, p)) {
    const { reportagem: _descartada, ...pautaLimpa } = p;
    return { pauta: pautaLimpa, status: 'incompleta' };
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
