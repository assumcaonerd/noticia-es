#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const TAG = '<script src="/analytics.js"></script>';
const IGNORAR = new Set(['publicar.html']);

function inserirTag(html) {
  if (/\bsrc=["']\/analytics\.js["']/i.test(html)) return { html, alterado: false };

  const viewport = /(<meta\s+name=["']viewport["'][^>]*>)/i;
  if (viewport.test(html)) {
    return {
      html: html.replace(viewport, `$1\n  ${TAG}`),
      alterado: true
    };
  }

  const head = /(<head(?:\s[^>]*)?>)/i;
  if (head.test(html)) {
    return {
      html: html.replace(head, `$1\n  ${TAG}`),
      alterado: true
    };
  }

  return { html, alterado: false };
}

async function arquivosHtmlDoDiretorio(diretorio) {
  try {
    const itens = await fs.readdir(diretorio, { withFileTypes: true });
    return itens
      .filter(item => item.isFile() && item.name.toLowerCase().endsWith('.html'))
      .map(item => path.join(diretorio, item.name));
  } catch {
    return [];
  }
}

const raizHtml = await arquivosHtmlDoDiretorio(RAIZ);
const materiasHtml = await arquivosHtmlDoDiretorio(path.join(RAIZ, 'm'));
const arquivos = [...raizHtml, ...materiasHtml];
let alterados = 0;

for (const arquivo of arquivos) {
  const relativo = path.relative(RAIZ, arquivo).replace(/\\/g, '/');
  if (IGNORAR.has(relativo)) continue;

  const original = await fs.readFile(arquivo, 'utf8');
  const resultado = inserirTag(original);
  if (!resultado.alterado) continue;

  await fs.writeFile(arquivo, resultado.html, 'utf8');
  alterados++;
  console.log(`[analytics] tag adicionada em ${relativo}`);
}

// Mantém o GA4 nas matérias que forem regeneradas pelas rotinas automáticas.
const gerador = path.join(RAIZ, 'scripts', 'gerar-paginas-og.mjs');
let codigoGerador = await fs.readFile(gerador, 'utf8');
if (!codigoGerador.includes(TAG)) {
  const marcador = '  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
  if (!codigoGerador.includes(marcador)) {
    throw new Error('Não foi possível localizar o ponto de inserção no gerador de páginas.');
  }
  codigoGerador = codigoGerador.replace(marcador, `${marcador}\n  ${TAG}`);
  await fs.writeFile(gerador, codigoGerador, 'utf8');
  console.log('[analytics] gerador de matérias preparado para manter a tag nas próximas publicações');
}

console.log(`[analytics] ${alterados} página(s) existente(s) preparada(s).`);
