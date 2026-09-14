#!/usr/bin/env node
import fs from 'node:fs/promises';

const arquivo = 'noticias.js';
const preparador = await fs.readFile('scripts/publicar-chatgpt-horario.mjs', 'utf8');
const match = preparador.match(/Buffer\.from\('([^']+)', 'base64'\)/);
if (!match) throw new Error('Payload editorial não encontrado.');
const objeto = Buffer.from(match[1], 'base64').toString('utf8');
let texto = await fs.readFile(arquivo, 'utf8');

// Remove a inserção acidental feita dentro do comentário de cabeçalho, se existir.
texto = texto.replace(`const noticias = [\n${objeto}`, 'const noticias = [');

const slug = 'quilombolas-protesto-br-101-sao-mateus-anexo-3-rio-doce';
const inicioArray = '\nconst noticias = [';
const posArray = texto.indexOf(inicioArray);
if (posArray < 0) throw new Error('Array real de notícias não encontrado.');
const depoisArray = texto.slice(posArray);
if (!depoisArray.includes(`slug: "${slug}"`)) {
  texto = texto.slice(0, posArray) + inicioArray + '\n' + objeto + texto.slice(posArray + inicioArray.length);
}
await fs.writeFile(arquivo, texto, 'utf8');
console.log('Cabeçalho preservado e matéria inserida no array real de noticias.js.');
