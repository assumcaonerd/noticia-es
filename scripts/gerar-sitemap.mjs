#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DIR = path.join(RAIZ, 'm');
const SITE = 'https://noticiaes.com.br';

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extrair(html, re, fallback = '') {
  const m = String(html).match(re);
  return m ? m[1] : fallback;
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

  const html = await fs.readFile(path.join(DIR, arquivo), 'utf8');
  // Páginas de redirecionamento/compatibilidade não devem entrar no sitemap.
  if (/<meta\s+http-equiv=["']refresh["']/i.test(html)) continue;

  const esperado = `${SITE}/m/${arquivo}`;
  const canonical = extrair(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i, esperado);
  // Só indexar a URL dona do canonical, evitando duplicatas e aliases.
  if (canonical !== esperado) continue;

  const titulo = extrair(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i, arquivo.replace(/\.html$/, ''));
  const pub = extrair(html, /"datePublished":"([^"]+)"/i, '');
  const mod = extrair(html, /"dateModified":"([^"]+)"/i, pub || new Date().toISOString());
  const item = { canonical, titulo, pub, mod };
  const anterior = itensPorCanonical.get(canonical);
  if (!anterior || String(item.mod).localeCompare(String(anterior.mod)) > 0) itensPorCanonical.set(canonical, item);
}

const itens = [...itensPorCanonical.values()];
itens.sort((a, b) => String(b.mod).localeCompare(String(a.mod)));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${itens.map(i => `  <url><loc>${esc(i.canonical)}</loc><lastmod>${esc(i.mod)}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(path.join(RAIZ, 'sitemap.xml'), sitemap, 'utf8');

const limite = Date.now() - 2 * 24 * 60 * 60 * 1000;
const recentes = itens.filter(i => {
  const t = Date.parse(i.pub || '');
  return Number.isFinite(t) && t >= limite;
}).slice(0, 1000);

const news = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${recentes.map(i => `  <url><loc>${esc(i.canonical)}</loc><news:news><news:publication><news:name>Notícia ES</news:name><news:language>pt</news:language></news:publication><news:publication_date>${esc(i.pub)}</news:publication_date><news:title>${esc(i.titulo)}</news:title></news:news></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(path.join(RAIZ, 'sitemap-news.xml'), news, 'utf8');

console.log(`[sitemap] ${itens.length} URL(s) canônica(s) no sitemap.xml; ${recentes.length} notícia(s) recentes no sitemap-news.xml; ${removidos.size} slug(s) removido(s) ignorado(s).`);
