#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DIR = path.join(RAIZ, 'm');
const SITE = 'https://noticiaes.com.br';
const JANELA_NEWS_MS = 48 * 60 * 60 * 1000;
const LIMITE_NEWS = 1000;
const SUFIXO_VEICULO = /\s*\|\s*(?:CNN Brasil|CNN|G1|Folha|Estadão|O Globo|Veja|BBC)\s*$/i;
const PAGINAS_INSTITUCIONAIS = ['/', '/sobre.html', '/expediente.html', '/contato.html', '/anuncie.html', '/politica-de-privacidade.html', '/termos-de-uso.html'];

function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function extrair(html, re, fallback = '') {
  const m = String(html).match(re);
  return m ? m[1] : fallback;
}

function textoPlano(s = '') {
  return String(s).replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function limparTitulo(titulo = '') {
  return String(titulo).trim().replace(SUFIXO_VEICULO, '').trim();
}

function formatarBrasilia(valor = '') {
  const data = new Date(valor);
  if (!Number.isFinite(data.getTime())) return '';
  const deslocada = new Date(data.getTime() - 3 * 60 * 60 * 1000);
  return `${deslocada.toISOString().slice(0, 19)}-03:00`;
}

function extrairJsonLdNewsArticle(html = '') {
  for (const bloco of String(html).matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const valor = JSON.parse(bloco[1]);
      const candidatos = Array.isArray(valor) ? valor : valor?.['@graph'] || [valor];
      const artigo = candidatos.find(item => {
        const tipo = item?.['@type'];
        return tipo === 'NewsArticle' || (Array.isArray(tipo) && tipo.includes('NewsArticle'));
      });
      if (artigo) return artigo;
    } catch {
      // Um JSON-LD inválido não impede a leitura das demais matérias.
    }
  }
  return null;
}

function extrairKeywords(html, artigo) {
  const bruto = extrair(html, /<meta\s+name=["']keywords["']\s+content=["']([^"']*)["']/i, '') || artigo?.keywords || '';
  const termos = (Array.isArray(bruto) ? bruto : String(bruto).split(',')).map(item => textoPlano(item)).filter(Boolean).slice(0, 8);
  return termos.length >= 3 ? termos.join(', ') : '';
}

function temCorpoJornalisticoProprio(html = '') {
  if (/<meta\s+name=["']noticiaes:original_reporting["']\s+content=["']false["']/i.test(html)) return false;
  const corpo = extrair(html, /<div\s+class=["'][^"']*conteudo-materia[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?:<section|<\/article>)/i, '');
  const paragrafos = [...corpo.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m => textoPlano(m[1])).filter(p => p.length >= 40);
  return paragrafos.length >= 2 && paragrafos.join(' ').length >= 400;
}

function sincronizarPublishedTime(html, publicadoEm) {
  const meta = `<meta property="article:published_time" content="${publicadoEm}">`;
  if (/<meta\s+property=["']article:published_time["'][^>]*>/i.test(html)) return html.replace(/<meta\s+property=["']article:published_time["'][^>]*>/i, meta);
  return html.replace(/(<meta\s+property=["']og:type["'][^>]*>)/i, `$1${meta}`);
}

function sincronizarJsonLd(html, publicadoEm) {
  return html.replace(/(<script[^>]+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (bloco, abre, json, fecha) => {
    try {
      const valor = JSON.parse(json);
      const candidatos = Array.isArray(valor) ? valor : valor?.['@graph'] || [valor];
      const artigo = candidatos.find(x => x?.['@type'] === 'NewsArticle' || (Array.isArray(x?.['@type']) && x['@type'].includes('NewsArticle')));
      if (!artigo) return bloco;
      artigo.datePublished = publicadoEm;
      return `${abre}${JSON.stringify(valor)}${fecha}`;
    } catch {
      return bloco;
    }
  });
}

async function carregarSlugsRemovidos() {
  try {
    const texto = await fs.readFile(path.join(RAIZ, 'remover-materias-20260831.js'), 'utf8');
    const trecho = texto.match(/const\s+removidos\s*=\s*new\s+Set\s*\(\s*\[([\s\S]*?)\]\s*\)/)?.[1] || '';
    const removidos = new Set();
    for (const m of trecho.matchAll(/["']([^"']+)["']/g)) removidos.add(m[1]);
    return removidos;
  } catch {
    return new Set();
  }
}

let arquivos = [];
try {
  arquivos = (await fs.readdir(DIR)).filter(f => f.endsWith('.html'));
} catch {
  console.log('[sitemap] diretório m inexistente.');
  process.exit(0);
}

const removidos = await carregarSlugsRemovidos();
const itensPorCanonical = new Map();
for (const arquivo of arquivos) {
  const slug = arquivo.replace(/\.html$/, '');
  if (removidos.has(slug)) continue;
  const caminho = path.join(DIR, arquivo);
  const html = await fs.readFile(caminho, 'utf8');
  if (/<meta\s+http-equiv=["']refresh["']/i.test(html)) continue;

  const esperado = `${SITE}/m/${arquivo}`;
  const canonical = extrair(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i, esperado);
  if (canonical !== esperado || canonical.includes('?') || !canonical.startsWith(`${SITE}/m/`)) continue;

  const artigo = extrairJsonLdNewsArticle(html);
  const tituloOriginal = textoPlano(extrair(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i, extrair(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i, slug)));
  const pubOriginal = artigo?.datePublished || extrair(html, /<meta\s+property=["']article:published_time["']\s+content=["']([^"']+)["']/i, '');
  const pub = formatarBrasilia(pubOriginal);
  const item = {
    caminho, html, canonical, artigo,
    titulo: limparTitulo(tituloOriginal),
    tituloTinhaSufixo: SUFIXO_VEICULO.test(tituloOriginal),
    pub,
    pubMs: Date.parse(pub),
    mod: formatarBrasilia(artigo?.dateModified || pubOriginal) || pub,
    keywords: extrairKeywords(html, artigo),
    temCorpoProprio: temCorpoJornalisticoProprio(html)
  };
  const anterior = itensPorCanonical.get(canonical);
  if (!anterior || String(item.mod).localeCompare(String(anterior.mod)) > 0) itensPorCanonical.set(canonical, item);
}

const itens = [...itensPorCanonical.values()].sort((a, b) => String(b.mod).localeCompare(String(a.mod)));
const paginasFixas = PAGINAS_INSTITUCIONAIS.map(pagina => `  <url><loc>${esc(SITE + pagina)}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paginasFixas}\n${itens.map(i => `  <url><loc>${esc(i.canonical)}</loc><lastmod>${esc(i.mod)}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(path.join(RAIZ, 'sitemap.xml'), sitemap, 'utf8');

const agora = Date.now();
const corte = agora - JANELA_NEWS_MS;
const recentes = itens
  .filter(i => Number.isFinite(i.pubMs) && i.pubMs >= corte && i.pubMs <= agora + 5 * 60 * 1000)
  .filter(i => i.titulo && !i.tituloTinhaSufixo && i.temCorpoProprio && i.artigo)
  .sort((a, b) => b.pubMs - a.pubMs)
  .slice(0, LIMITE_NEWS);

for (const item of recentes) {
  const htmlAtualizado = sincronizarJsonLd(sincronizarPublishedTime(item.html, item.pub), item.pub);
  if (htmlAtualizado !== item.html) await fs.writeFile(item.caminho, htmlAtualizado, 'utf8');
}

const blocosNews = recentes.map(i => {
  const keywords = i.keywords ? `\n      <news:keywords>${esc(i.keywords)}</news:keywords>` : '';
  return `  <url>\n    <loc>${esc(i.canonical)}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>Notícia ES</news:name>\n        <news:language>pt-br</news:language>\n      </news:publication>\n      <news:publication_date>${esc(i.pub)}</news:publication_date>\n      <news:title>${esc(i.titulo)}</news:title>${keywords}\n    </news:news>\n  </url>`;
}).join('\n');

const news = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${blocosNews}${blocosNews ? '\n' : ''}</urlset>\n`;
await fs.writeFile(path.join(RAIZ, 'sitemap-news.xml'), news, 'utf8');

console.log(`[sitemap] ${itens.length} URL(s) canônica(s) no sitemap.xml; ${recentes.length} notícia(s) originais das últimas 48h no sitemap-news.xml; ${removidos.size} slug(s) removido(s) ignorado(s).`);
