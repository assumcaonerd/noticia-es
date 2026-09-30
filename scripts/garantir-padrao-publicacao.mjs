#!/usr/bin/env node
import fs from 'node:fs/promises';

const ARQUIVO = 'noticias.js';
const PADRAO_IMAGEM_INVALIDA = /(auto-(politica|seguranca)|placeholder|fallback|default[-_]?image|og[-_]?default|\/logo[._/-]|logo\.(svg|png|jpg|jpeg|webp)(\?|$)|imagens\/auto-.*\.svg)/i;

function imagemValida(url = '') {
  const u = String(url || '').trim();
  return /^https:\/\//i.test(u) && !/\.svg(\?|$)/i.test(u) && !PADRAO_IMAGEM_INVALIDA.test(u);
}

function decodificarEntidades(s = '') {
  const mapa = { aacute:'á', Aacute:'Á', atilde:'ã', Atilde:'Ã', acirc:'â', Acirc:'Â', agrave:'à', ccedil:'ç', Ccedil:'Ç', eacute:'é', Eacute:'É', ecirc:'ê', Ecirc:'Ê', iacute:'í', Iacute:'Í', oacute:'ó', Oacute:'Ó', ocirc:'ô', Ocirc:'Ô', otilde:'õ', Otilde:'Õ', uacute:'ú', Uacute:'Ú', uuml:'ü', ldquo:'“', rdquo:'”', lsquo:'‘', rsquo:'’', mdash:'—', ndash:'–', quot:'"', amp:'&', nbsp:' ' };
  let t = String(s);
  for (let i = 0; i < 3; i++) t = t.replace(/&amp;/gi, '&').replace(/&([A-Za-z]+);/g, (m,n) => mapa[n] ?? m).replace(/&#(\d+);/g, (m,n) => String.fromCodePoint(Number(n)));
  return t;
}

function limparHtml(s = '') {
  return decodificarEntidades(String(s))
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

function conteudoEditorialValido(conteudo = '') {
  const texto = limparHtml(conteudo);
  const proibidos = [
    /Jornalista, pós-graduad[oa]/i,
    /Graduad[oa] em jornalismo/i,
    /É repórter (?:da|de) Revista Oeste/i,
    /Você tem \d+ acessos por dia/i,
    /Assinantes podem liberar \d+ acessos por dia/i,
    /pic\.twitter\.com\//i,
    /Leia também:/i
  ];
  if (proibidos.some(re => re.test(texto))) return false;
  if (/<h2[^>]*>\s*(Contexto|Desdobramentos)\s*<\/h2>/i.test(conteudo)) return false;
  if (/&(?:amp;)?(?:ccedil|atilde|aacute|eacute|iacute|oacute|uacute|ecirc|ocirc);/i.test(conteudo)) return false;
  return true;
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

function acharMarcadorNoticias(texto) {
  const marcador = 'const noticias = [';
  let pos = 0;
  while (true) {
    const base = texto.indexOf(marcador, pos);
    if (base < 0) throw new Error('Array const noticias não encontrado.');
    const antes = texto.slice(0, base);
    const aberto = antes.lastIndexOf('/*');
    const fechado = antes.lastIndexOf('*/');
    const dentroComentario = aberto > fechado;
    const inicioLinha = antes.lastIndexOf('\n') + 1;
    const prefixo = texto.slice(inicioLinha, base);
    if (!dentroComentario && /^\s*$/.test(prefixo)) return base;
    pos = base + marcador.length;
  }
}

function acharPrimeiroObjeto(texto) {
  const marcador = 'const noticias = [';
  const base = acharMarcadorNoticias(texto);
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
