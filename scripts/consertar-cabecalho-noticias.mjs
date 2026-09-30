#!/usr/bin/env node
import fs from 'node:fs/promises';

const ARQUIVO = 'noticias.js';
const SLUG = 'fala-lula-toque-desde-pequenas-reacao-contexto';
const CABECALHO = `/*
  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO
  ==================================================
  Este arquivo recebe notícias manuais e automáticas.
  O motor automático roda pelo GitHub Actions e insere novas matérias no topo.
  Para publicação manual, use publicar.html e cole o objeto no início do array de notícias.
*/

`;

function extrairObjeto(texto, inicio) {
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
      if (nivel === 0) return texto.slice(inicio, i + 1);
    }
  }
  throw new Error('Não foi possível extrair o objeto preso no comentário.');
}

function completarAeo(obj) {
  if ((obj.match(/pergunta:/g) || []).length >= 5) return obj;
  const extra = `      { pergunta: "Como a opinião deve tratar a frase?", resposta: "É legítimo criticar a formulação. Acusações de crime exigem prova que a fala, por si só, não apresenta." }\n`;
  return obj.replace(/\n    \],\n    conteudo:/, `,\n${extra}    ],\n    conteudo:`);
}

let texto = await fs.readFile(ARQUIVO, 'utf8');
const fimComentario = texto.indexOf('*/');
if (fimComentario < 0) {
  console.log('[conserto] noticias.js sem comentário inicial; nada a fazer.');
  process.exit(0);
}

const comentario = texto.slice(0, fimComentario + 2);
const corpo = texto.slice(fimComentario + 2);

if (!comentario.includes(SLUG)) {
  if (comentario.includes('const noticias = [')) {
    const limpo = CABECALHO + corpo.replace(/^\s+/, '');
    await fs.writeFile(ARQUIVO, limpo, 'utf8');
    console.log('[conserto] comentário inicial deixou de conter o marcador falso.');
    process.exit(0);
  }
  console.log('[conserto] comentário inicial já está limpo.');
  process.exit(0);
}

const inicioObj = comentario.indexOf('{');
if (inicioObj < 0) throw new Error('Objeto da matéria de opinião não encontrado no comentário.');
const objeto = completarAeo(extrairObjeto(comentario, inicioObj));

if (corpo.includes(`slug: "${SLUG}"`)) {
  const limpo = CABECALHO + corpo.replace(/^\s+/, '');
  await fs.writeFile(ARQUIVO, limpo, 'utf8');
  console.log('[conserto] matéria já existia no array; comentário foi limpo.');
  process.exit(0);
}

const marcador = 'const noticias = [';
const pos = corpo.indexOf(marcador);
if (pos < 0) throw new Error('Array const noticias não encontrado no corpo do arquivo.');
const depois = pos + marcador.length;
const novo = CABECALHO + corpo.slice(0, depois).replace(/^\s+/, '') + '\n  ' + objeto.replace(/^\s+/, '') + ',' + corpo.slice(depois);
await fs.writeFile(ARQUIVO, novo, 'utf8');
console.log(`[conserto] ${SLUG} saiu do comentário e entrou no array real.`);
