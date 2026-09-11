#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DIR_MATERIAS = path.join(RAIZ, 'm');

function mimeDaImagem(url = '') {
  const limpa = String(url).split('?')[0].split('#')[0].toLowerCase();
  if (limpa.endsWith('.png')) return 'image/png';
  if (limpa.endsWith('.webp')) return 'image/webp';
  if (limpa.endsWith('.gif')) return 'image/gif';
  if (limpa.endsWith('.avif')) return 'image/avif';
  return 'image/jpeg';
}

let alteradas = 0;
for (const nome of await fs.readdir(DIR_MATERIAS)) {
  if (!nome.endsWith('.html')) continue;
  const arquivo = path.join(DIR_MATERIAS, nome);
  let html = await fs.readFile(arquivo, 'utf8');
  const original = html;

  const og = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']\s*\/?>/i);
  if (og) {
    const mime = mimeDaImagem(og[1]);
    if (/<meta\s+property=["']og:image:type["'][^>]*>/i.test(html)) {
      html = html.replace(/<meta\s+property=["']og:image:type["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:image:type" content="${mime}">`);
    } else {
      html = html.replace(og[0], `${og[0]}\n  <meta property="og:image:type" content="${mime}">`);
    }
  }

  if (/data-pagina=["']materia["']/i.test(html) && !/share-bar\.js/i.test(html)) {
    html = html.replace(/<\/body>/i, '  <script src="../share-bar.js"></script>\n</body>');
  }

  if (html !== original) {
    await fs.writeFile(arquivo, html, 'utf8');
    alteradas++;
  }
}

console.log(`[estatico] ${alteradas} página(s) normalizada(s): MIME de imagem e barra de compartilhamento.`);
