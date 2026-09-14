#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const SITE = 'https://noticiaes.com.br';
const LIMITE_X = 5 * 1024 * 1024;
const JANELA_RECENTE = 48 * 60 * 60 * 1000;

function meta(html, chave, atributo = 'property') {
  const a = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<meta[^>]+${atributo}=["']${a}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1]
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${atributo}=["']${a}["']`, 'i'))?.[1]
    || '';
}

function mimePelaUrl(url) {
  const ext = new URL(url).pathname.toLowerCase();
  if (ext.endsWith('.png')) return 'image/png';
  if (ext.endsWith('.webp')) return 'image/webp';
  if (ext.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

const dir = path.join(RAIZ, 'm');
const arquivos = (await fs.readdir(dir)).filter(x => x.endsWith('.html'));
let erros = 0;

for (const arquivo of arquivos) {
  const html = await fs.readFile(path.join(dir, arquivo), 'utf8');
  if (/<meta\s+http-equiv=["']refresh["']/i.test(html)) continue;
  const publicada = Date.parse(html.match(/"datePublished":"([^"]+)"/i)?.[1] || '');
  if (!Number.isFinite(publicada) || publicada < Date.now() - JANELA_RECENTE) continue;
  const card = meta(html, 'twitter:card', 'name');
  const og = meta(html, 'og:image');
  const tw = meta(html, 'twitter:image', 'name');
  const tipo = meta(html, 'og:image:type');
  const largura = Number(meta(html, 'og:image:width'));
  const altura = Number(meta(html, 'og:image:height'));
  const falhas = [];

  if (card !== 'summary_large_image') falhas.push('twitter:card ausente ou incorreto');
  if (!/^https:\/\//i.test(og)) falhas.push('og:image não é HTTPS absoluto');
  if (!/^https:\/\//i.test(tw)) falhas.push('twitter:image não é HTTPS absoluto');
  if (og && tipo !== mimePelaUrl(og)) falhas.push(`MIME ${tipo || 'ausente'} diverge de ${mimePelaUrl(og)}`);
  if ((largura && !altura) || (!largura && altura)) falhas.push('dimensões OG incompletas');

  for (const url of new Set([og, tw].filter(Boolean))) {
    const u = new URL(url);
    if (u.hostname !== 'noticiaes.com.br') continue;
    const local = path.join(RAIZ, decodeURIComponent(u.pathname).replace(/^\//, ''));
    try {
      const stat = await fs.stat(local);
      if (!stat.isFile() || stat.size === 0) falhas.push(`imagem local vazia: ${u.pathname}`);
      if (stat.size > LIMITE_X) falhas.push(`imagem acima de 5 MB: ${u.pathname}`);
    } catch { falhas.push(`imagem local inexistente: ${u.pathname}`); }
  }

  if (falhas.length) {
    erros += falhas.length;
    console.error(`[cards] FALHA ${arquivo}: ${falhas.join('; ')}`);
  }
}

if (erros) {
  console.error(`[cards] publicação bloqueada: ${erros} erro(s) de miniatura.`);
  process.exit(7);
}
console.log('[cards] OK: matérias das últimas 48 horas verificadas para X e WhatsApp.');
