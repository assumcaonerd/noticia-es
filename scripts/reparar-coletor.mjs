import fs from 'node:fs/promises';

const caminho = 'scripts/coletar-pautas.mjs';
let texto = await fs.readFile(caminho, 'utf8');

const linhaCorreta = `  const mapa = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ', '&ordm;': 'º', '&ordf;': 'ª' };`;
const inicio = texto.indexOf("function decodeHtml(texto = '') {");
if (inicio < 0) throw new Error('Função decodeHtml não encontrada.');

const mapaInicio = texto.indexOf('  const mapa = ', inicio);
const mapaFim = texto.indexOf('\n', mapaInicio);
if (mapaInicio < 0 || mapaFim < 0) throw new Error('Linha do mapa HTML não encontrada.');

const atual = texto.slice(mapaInicio, mapaFim);
if (atual !== linhaCorreta) {
  texto = texto.slice(0, mapaInicio) + linhaCorreta + texto.slice(mapaFim);
  await fs.writeFile(caminho, texto, 'utf8');
  console.log('Mapa de entidades HTML do coletor reparado.');
} else {
  console.log('Mapa de entidades HTML já está correto.');
}
