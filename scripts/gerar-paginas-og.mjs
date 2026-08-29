#!/usr/bin/env node
/**
 * Gera páginas estáticas m/{slug}.html com og:image no HTML.
 * Crawlers (WhatsApp, X, Facebook) não executam JS; por isso
 * noticia.html?slug= nunca leva foto na prévia.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const RAIZ = process.cwd();
const DESTINO = path.join(RAIZ, 'm');
const SITE = 'https://noticiaes.com.br';

function escapar(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function imagemAbsoluta(url = '') {
  const u = String(url || '').trim();
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return `${SITE}${u}`;
  return `${SITE}/${u.replace(/^\.\//, '')}`;
}

function ehBoaParaWhatsapp(url = '') {
  const u = String(url || '');
  if (!/^https:\/\//i.test(u)) return false;
  if (/\.svg(\?|$)/i.test(u)) return false;
  if (/auto-(politica|seguranca)|placeholder/i.test(u)) return false;
  return true;
}

async function listarArquivosMateria() {
  const nomes = await fs.readdir(RAIZ);
  const editoriais = nomes.filter((n) => /^editorial(-\d+)?\.js$/.test(n));
  return ['noticias.js', ...editoriais, 'opiniao.js', 'manual-gilvan.js'];
}

async function carregarOverlay() {
  const fotos = {};
  try {
    const texto = await fs.readFile(path.join(RAIZ, 'imagens-fonte.js'), 'utf8');
    const re = /["']([^"']+)["']\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(texto))) fotos[m[1]] = m[2];
  } catch {
    /* overlay opcional */
  }
  return fotos;
}

async function carregarNoticias() {
  const contexto = { noticias: [] };
  for (const arquivo of await listarArquivosMateria()) {
    try {
      const codigo = await fs.readFile(path.join(RAIZ, arquivo), 'utf8');
      vm.runInNewContext(
        `${codigo}\nif (typeof noticias !== 'undefined' && Array.isArray(noticias)) { this.noticias = noticias; }`,
        contexto,
        { timeout: 12000, filename: arquivo }
      );
    } catch (erro) {
      if (erro.code !== 'ENOENT') console.warn(`[og] não leu ${arquivo}: ${erro.message}`);
    }
  }
  return Array.isArray(contexto.noticias) ? contexto.noticias : [];
}

function paginaHTML(n, imagem) {
  const titulo = n.titulo || 'Notícia ES';
  const resumo = n.resumo || 'Política e segurança pública do Espírito Santo.';
  const url = `${SITE}/m/${n.slug}.html`;
  const destino = `${SITE}/noticia.html?slug=${encodeURIComponent(n.slug)}`;
  const img = ehBoaParaWhatsapp(imagem) ? imagem : `${SITE}/imagens/auto-politica-es.svg`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapar(titulo)} | Notícia ES</title>
  <meta name="description" content="${escapar(resumo)}">
  <link rel="canonical" href="${escapar(url)}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Notícia ES">
  <meta property="og:title" content="${escapar(titulo)}">
  <meta property="og:description" content="${escapar(resumo)}">
  <meta property="og:url" content="${escapar(url)}">
  <meta property="og:image" content="${escapar(img)}">
  <meta property="og:image:secure_url" content="${escapar(img)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapar(titulo)}">
  <meta name="twitter:description" content="${escapar(resumo)}">
  <meta name="twitter:image" content="${escapar(img)}">
  <meta http-equiv="refresh" content="0;url=${escapar(destino)}">
</head>
<body>
  <p><a href="${escapar(destino)}">${escapar(titulo)}</a></p>
</body>
</html>
`;
}

const overlay = await carregarOverlay();
const lista = await carregarNoticias();
await fs.mkdir(DESTINO, { recursive: true });

const vistos = new Set();
let geradas = 0;
for (const n of lista) {
  if (!n?.slug || vistos.has(n.slug)) continue;
  vistos.add(n.slug);
  const imagem = imagemAbsoluta(overlay[n.slug] || n.imagem || '');
  await fs.writeFile(path.join(DESTINO, `${n.slug}.html`), paginaHTML(n, imagem), 'utf8');
  geradas++;
}

console.log(`[og] ${geradas} página(s) em m/{slug}.html`);
