#!/usr/bin/env node
/**
 * Fiscal de imagens do Notícia ES.
 * Varre matérias publicadas e pautas novas. Se a foto falta, é SVG genérico
 * ou não é da pauta, busca og:image da fonte, irmã da mesma pauta ou retrato oficial.
 */
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { resolverImagem, ehImagemDeFonte } from './resolver-imagem.mjs';

const ARQUIVO_NOTICIAS = 'noticias.js';
const ARQUIVO_OVERLAY = 'imagens-fonte.js';
const ARQUIVO_PAUTAS = 'pautas.json';
const ARQUIVO_STATUS = 'fiscal-imagens-status.json';
const ARQUIVOS_MATERIA = [
  'noticias.js',
  'editorial.js', 'editorial-2.js', 'editorial-3.js', 'editorial-4.js',
  'editorial-5.js', 'editorial-6.js', 'editorial-7.js', 'editorial-8.js',
  'opiniao.js', 'manual-gilvan.js'
];

function ehRuim(url = '') {
  const u = String(url || '');
  if (!u) return true;
  if (/auto-(politica|seguranca)|imagens\/auto-|\.svg(\?|$)|placeholder|placehold|wikimedia\.org\/wiki\/Special/i.test(u)) return true;
  if (!/^https?:\/\//i.test(u) && /imagens\//i.test(u)) return true;
  return !ehImagemDeFonte(u);
}

function fonteDoConteudo(n) {
  if (n.fonteUrl) return n.fonteUrl;
  const m = String(n.conteudo || '').match(/href="(https?:\/\/[^"]+)"/i);
  return m ? m[1] : '';
}

async function carregarNoticias() {
  const contexto = { noticias: undefined };
  for (const arquivo of ARQUIVOS_MATERIA) {
    try {
      const codigo = await fs.readFile(arquivo, 'utf8');
      vm.runInNewContext(codigo, contexto, { timeout: 4000, filename: arquivo });
    } catch (erro) {
      if (erro.code !== 'ENOENT') console.warn(`[fiscal] não leu ${arquivo}: ${erro.message}`);
    }
  }
  return Array.isArray(contexto.noticias) ? contexto.noticias : [];
}

function lerOverlayAtual(texto) {
  const fotos = {};
  const re = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(texto))) {
    if (m[1] === 'undefined') continue;
    fotos[m[1]] = m[2];
  }
  return fotos;
}

function serializarOverlay(fotos) {
  const linhas = Object.entries(fotos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, url]) => `    ${JSON.stringify(slug)}:\n      ${JSON.stringify(url)}`);
  return `/* Fotos originais extraídas da fonte. Mantido pelo fiscal-imagens. */
(function () {
  if (typeof noticias === 'undefined' || !Array.isArray(noticias)) return;

  const fotos = {
${linhas.join(',\n')}
  };

  noticias.forEach(function (n) {
    if (fotos[n.slug]) n.imagem = fotos[n.slug];
  });
})();
`;
}

function patchImagemNoticiasJs(codigo, slug, url) {
  const re = new RegExp(
    `(slug:\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\s\S]*?imagem:\s*)("[^"]*"|'[^']*')`,
    'm'
  );
  if (!re.test(codigo)) return { codigo, ok: false };
  return { codigo: codigo.replace(re, `$1${JSON.stringify(url)}`), ok: true };
}

async function fiscalizarPublicadas() {
  const lista = await carregarNoticias();
  let overlay = {};
  try {
    overlay = lerOverlayAtual(await fs.readFile(ARQUIVO_OVERLAY, 'utf8'));
  } catch {
    overlay = {};
  }

  const pares = lista.map(n => ({
    titulo: n.titulo,
    url: fonteDoConteudo(n),
    imagem: overlay[n.slug] || n.imagem,
    resumo: n.resumo
  }));

  const correcos = [];
  const semFoto = [];
  let noticiasJs = await fs.readFile(ARQUIVO_NOTICIAS, 'utf8');
  let noticiasJsTocou = false;

  for (const n of lista) {
    const atual = overlay[n.slug] || n.imagem || '';
    if (!ehRuim(atual)) continue;

    const item = {
      titulo: n.titulo,
      resumo: n.resumo || '',
      url: fonteDoConteudo(n),
      imagem: atual
    };
    const resolvida = await resolverImagem(item, pares);
    if (!resolvida || !ehImagemDeFonte(resolvida)) {
      semFoto.push({ slug: n.slug, titulo: n.titulo, motivo: 'fonte sem og:image utilizável' });
      console.log(`[fiscal] SEM FOTO — ${n.slug}`);
      continue;
    }
    overlay[n.slug] = resolvida;
    const patch = patchImagemNoticiasJs(noticiasJs, n.slug, resolvida);
    if (patch.ok) {
      noticiasJs = patch.codigo;
      noticiasJsTocou = true;
    }
    correcos.push({ slug: n.slug, de: atual || '(vazia)', para: resolvida });
    console.log(`[fiscal] CORRIGIU ${n.slug} → ${resolvida}`);
  }

  if (correcos.length) {
    await fs.writeFile(ARQUIVO_OVERLAY, serializarOverlay(overlay), 'utf8');
    if (noticiasJsTocou) await fs.writeFile(ARQUIVO_NOTICIAS, noticiasJs, 'utf8');
  }
  return { correcos, semFoto, total: lista.length };
}

async function fiscalizarPautas() {
  let arquivo;
  try {
    arquivo = JSON.parse(await fs.readFile(ARQUIVO_PAUTAS, 'utf8'));
  } catch {
    return { alteradas: 0 };
  }
  const pautas = arquivo.pautas || [];
  let alteradas = 0;
  for (const p of pautas) {
    const atual = p.imagemFonte || p.imagem || '';
    if (!ehRuim(atual)) continue;
    const item = {
      titulo: p.titulo || p.manchete || '',
      resumo: p.resumo || p.linhaFina || '',
      url: p.urlFonte || p.url || '',
      imagem: atual
    };
    const resolvida = await resolverImagem(item, pautas.map(x => ({
      titulo: x.titulo || x.manchete,
      url: x.urlFonte || x.url,
      imagem: x.imagemFonte || x.imagem
    })));
    if (!resolvida) continue;
    p.imagemFonte = resolvida;
    p.imagemOrigem = 'fonte';
    alteradas++;
    console.log(`[fiscal] pauta ${p.id || p.titulo} → foto da fonte`);
  }
  if (alteradas) {
    arquivo.politicaImagem = 'Toda matéria nova usa imagem da fonte (og:image). O fiscal-imagens corrige ausência. Proibido SVG genérico e foto aleatória.';
    await fs.writeFile(ARQUIVO_PAUTAS, `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
  }
  return { alteradas };
}

const pub = await fiscalizarPublicadas();
const fil = await fiscalizarPautas();
const status = {
  atualizadoEm: new Date().toISOString(),
  materiasVarridas: pub.total,
  corrigidas: pub.correcos.length,
  aindaSemFoto: pub.semFoto.length,
  pautasCorrigidas: fil.alteradas,
  correcos: pub.correcos,
  semFoto: pub.semFoto
};
await fs.writeFile(ARQUIVO_STATUS, `${JSON.stringify(status, null, 2)}\n`, 'utf8');
console.log(`[fiscal] ${pub.correcos.length} matéria(s) corrigida(s); ${pub.semFoto.length} ainda sem foto; ${fil.alteradas} pauta(s) enriquecida(s).`);
