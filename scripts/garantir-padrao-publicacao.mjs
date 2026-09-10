#!/usr/bin/env node
import fs from 'node:fs/promises';

const ARQUIVO = 'noticias.js';
const PADRAO_IMAGEM_INVALIDA = /(auto-(politica|seguranca)|placeholder|fallback|default[-_]?image|og[-_]?default|\/logo[._/-]|logo\.(svg|png|jpg|jpeg|webp)(\?|$)|imagens\/auto-.*\.svg)/i;

function imagemValida(url = '') {
  const u = String(url || '').trim();
  return /^https:\/\//i.test(u) && !/\.svg(\?|$)/i.test(u) && !PADRAO_IMAGEM_INVALIDA.test(u);
}

function limparHtml(s = '') {
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function limitar(s = '', n = 320) {
  const t = limparHtml(s);
  if (t.length <= n) return t;
  const corte = t.slice(0, n);
  const fim = corte.lastIndexOf(' ');
  return `${corte.slice(0, fim > 180 ? fim : n).trim()}…`;
}

function campoString(bloco, nome) {
  const re = new RegExp(`\\b${nome}\\s*:\\s*(["'])([\\s\\S]*?)\\1\\s*,`);
  return bloco.match(re)?.[2] || '';
}

function campoTemplate(bloco, nome) {
  const re = new RegExp('\\b' + nome + '\\s*:\\s*`([\\s\\S]*?)`\\s*,');
  return bloco.match(re)?.[1] || '';
}

function acharPrimeiroObjeto(texto) {
  const marcador = 'const noticias = [';
  const base = texto.indexOf(marcador);
  if (base < 0) throw new Error('Array const noticias não encontrado.');
  const inicio = texto.indexOf('{', base + marcador.length);
  if (inicio < 0) throw new Error('Primeira matéria não encontrada.');

  let nivel = 0;
  let aspas = null;
  let template = false;
  let escape = false;
  for (let i = inicio; i < texto.length; i++) {
    const c = texto[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (template) {
      if (c === '`') template = false;
      continue;
    }
    if (aspas) {
      if (c === aspas) aspas = null;
      continue;
    }
    if (c === '`') { template = true; continue; }
    if (c === '"' || c === "'") { aspas = c; continue; }
    if (c === '{') nivel++;
    if (c === '}') {
      nivel--;
      if (nivel === 0) return { inicio, fim: i + 1, bloco: texto.slice(inicio, i + 1) };
    }
  }
  throw new Error('Não foi possível delimitar a primeira matéria.');
}

async function buscarOgImage(url) {
  if (!/^https:\/\//i.test(String(url || ''))) return '';
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 NoticiaESBot/1.0' },
    signal: AbortSignal.timeout(12000)
  });
  if (!res.ok) throw new Error(`Fonte respondeu HTTP ${res.status}`);
  const html = await res.text();
  const candidatos = [];
  for (const re of [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/ig,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/ig,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/ig,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/ig
  ]) {
    let m;
    while ((m = re.exec(html))) candidatos.push(m[1].replace(/&amp;/g, '&'));
  }
  for (const c of candidatos) {
    try {
      const absoluta = new URL(c, url).href;
      if (imagemValida(absoluta)) return absoluta;
    } catch {}
  }
  return '';
}

function extrairParagrafos(conteudo) {
  const pars = [...String(conteudo).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m => limitar(m[1], 360))
    .filter(x => x.length >= 40);
  return pars;
}

function montarAeo(titulo, resumo, conteudo) {
  const pars = extrairParagrafos(conteudo);
  const respostas = [
    limitar(resumo, 360),
    pars[0] || limitar(conteudo, 360),
    pars[1] || pars[0] || limitar(resumo, 360),
    pars[2] || pars[1] || pars[0] || limitar(resumo, 360),
    pars.at(-1) || pars[2] || pars[0] || limitar(resumo, 360)
  ];
  return [
    { pergunta: 'O que aconteceu?', resposta: respostas[0] },
    { pergunta: 'Qual é o ponto principal da notícia?', resposta: respostas[1] },
    { pergunta: 'Quais são os dados mais importantes?', resposta: respostas[2] },
    { pergunta: 'Por que esse assunto importa?', resposta: respostas[3] },
    { pergunta: 'O que acontece agora?', resposta: respostas[4] }
  ];
}

function aeoValido(bloco) {
  const m = bloco.match(/\baeo\s*:\s*(\[[\s\S]*?\])\s*,/);
  if (!m) return false;
  try {
    const arr = Function(`"use strict"; return (${m[1]});`)();
    return Array.isArray(arr) && arr.length >= 5 && arr.every(x => String(x?.pergunta || '').trim() && String(x?.resposta || '').trim());
  } catch {
    return false;
  }
}

let texto = await fs.readFile(ARQUIVO, 'utf8');
const info = acharPrimeiroObjeto(texto);
let bloco = info.bloco;

const slug = campoString(bloco, 'slug');
const titulo = campoString(bloco, 'titulo');
const resumo = campoString(bloco, 'resumo');
const fonteUrl = campoString(bloco, 'fonteUrl');
const conteudo = campoTemplate(bloco, 'conteudo');
let imagem = campoString(bloco, 'imagem');

if (!slug || !titulo || !resumo || !conteudo) {
  throw new Error('Matéria mais recente incompleta: slug, título, resumo e conteúdo são obrigatórios.');
}

if (!imagemValida(imagem)) {
  const encontrada = await buscarOgImage(fonteUrl).catch(err => {
    console.warn(`[padrão] falha ao buscar imagem na fonte: ${err.message}`);
    return '';
  });
  if (!imagemValida(encontrada)) {
    throw new Error(`Publicação bloqueada: a matéria ${slug} não possui imagem editorial real válida.`);
  }
  bloco = bloco.replace(/\bimagem\s*:\s*(["'])[^"']*\1\s*,/, `imagem: ${JSON.stringify(encontrada)},`);
  imagem = encontrada;
  console.log(`[padrão] imagem real aplicada em ${slug}`);
}

if (!aeoValido(bloco)) {
  const aeo = montarAeo(titulo, resumo, conteudo);
  const linha = `    aeo: ${JSON.stringify(aeo)},\n`;
  if (/\n\s*autor\s*:/.test(bloco)) {
    bloco = bloco.replace(/(\n\s*autor\s*:)/, `\n${linha}$1`);
  } else {
    bloco = bloco.replace(/\n\s*automatico\s*:/, `\n${linha}    automatico:`);
  }
  console.log(`[padrão] AEO obrigatório aplicado em ${slug}`);
}

if (!aeoValido(bloco) || !imagemValida(campoString(bloco, 'imagem'))) {
  throw new Error(`Publicação bloqueada: ${slug} falhou na validação final de imagem/AEO.`);
}

texto = texto.slice(0, info.inicio) + bloco + texto.slice(info.fim);
await fs.writeFile(ARQUIVO, texto, 'utf8');
console.log(`[padrão] ${slug} aprovado: imagem real + AEO com no mínimo 5 respostas.`);
