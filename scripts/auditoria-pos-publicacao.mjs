#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const MANIFEST = path.join(RAIZ, 'auto-manifest.js');
const LOTE = path.join(RAIZ, 'lote-redacao.json');

function textoPuro(html = '') {
  return String(html).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const lote = JSON.parse(await fs.readFile(LOTE, 'utf8').catch(() => '{}'));
const produzidas = Number(lote?.diagnosticoReapuracao?.produzidas || 0);
if (produzidas === 0) {
  console.log('[auditoria] rodada sem nova reportagem produzida; nada novo a auditar.');
  process.exit(0);
}

const manifest = await fs.readFile(MANIFEST, 'utf8');
const m = manifest.match(/"(auto-redacao-\d{8}-\d{6}\.js)"/);
if (!m) {
  console.error('[auditoria] houve produção, mas nenhum shard automático foi encontrado no manifesto.');
  process.exit(5);
}

const shardNome = m[1];
const shardPath = path.join(RAIZ, shardNome);
const shard = await fs.readFile(shardPath, 'utf8');
const slugs = [...shard.matchAll(/slug:\s*"([^"]+)"/g)].map(x => x[1]);
if (!slugs.length) {
  console.error(`[auditoria] shard ${shardNome} não contém slugs.`);
  process.exit(5);
}
if (slugs.length !== Math.min(produzidas, 10)) {
  console.error(`[auditoria] divergência: reapuração produziu ${produzidas}, mas o shard contém ${slugs.length}.`);
  process.exit(5);
}

const sitemap = await fs.readFile(path.join(RAIZ, 'sitemap.xml'), 'utf8').catch(() => '');
let erros = 0;

for (const slug of slugs) {
  const paginaPath = path.join(RAIZ, 'm', `${slug}.html`);
  let html = '';
  try {
    html = await fs.readFile(paginaPath, 'utf8');
  } catch {
    console.error(`[auditoria] FALHA ${slug}: página estática inexistente.`);
    erros++;
    continue;
  }

  const checks = [
    ['canonical', new RegExp(`<link\\s+rel="canonical"\\s+href="https://noticiaes\\.com\\.br/m/${slug}\\.html"`, 'i').test(html)],
    ['NewsArticle', /"@type":"NewsArticle"/.test(html)],
    ['AEO', /<section class="aeo-resumo"/i.test(html)],
    ['og:image', /<meta\s+property="og:image"\s+content="https:\/\//i.test(html)],
    ['twitter:image', /<meta\s+name="twitter:image"\s+content="https:\/\//i.test(html)],
    ['article', /<article\b/i.test(html)],
    ['sitemap', sitemap.includes(`https://noticiaes.com.br/m/${slug}.html`)]
  ];

  const corpo = html.match(/<div class="conteudo-materia">([\s\S]*?)<\/div>\s*(?:<section class="fontes-materia"|<\/article>)/i)?.[1] || '';
  const palavras = textoPuro(corpo).split(/\s+/).filter(Boolean).length;
  if (palavras < 650) checks.push([`conteúdo ${palavras} palavras`, false]);
  if (/capit[aã]o\s+assum[cç][aã]o/i.test(html.match(/<section class="aeo-resumo"[\s\S]*?<\/section>/i)?.[0] || '')) {
    checks.push(['Capitão Assumção apareceu no AEO', false]);
  }

  for (const [nome, ok] of checks) {
    if (!ok) {
      console.error(`[auditoria] FALHA ${slug}: ${nome}`);
      erros++;
    }
  }
  if (checks.every(x => x[1])) console.log(`[auditoria] OK ${slug}: ${palavras} palavras, AEO/OG/Schema/sitemap presentes.`);
}

if (erros) {
  console.error(`[auditoria] ${erros} falha(s) na auditoria pós-publicação.`);
  process.exit(6);
}
console.log(`[auditoria] ${slugs.length} matéria(s) do shard ${shardNome} aprovadas.`);
