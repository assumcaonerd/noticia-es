import fs from 'node:fs/promises';

const linhaCorreta = `  const mapa = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ', '&ordm;': 'º', '&ordf;': 'ª' };`;

async function reparar(caminho) {
  let texto = await fs.readFile(caminho, 'utf8');
  const inicio = texto.indexOf("function decodeHtml(texto = '') {");
  if (inicio < 0) throw new Error(`Função decodeHtml não encontrada em ${caminho}.`);
  const mapaInicio = texto.indexOf('  const mapa = ', inicio);
  const mapaFim = texto.indexOf('\n', mapaInicio);
  if (mapaInicio < 0 || mapaFim < 0) throw new Error(`Linha do mapa HTML não encontrada em ${caminho}.`);
  const atual = texto.slice(mapaInicio, mapaFim);
  if (atual === linhaCorreta) {
    console.log(`${caminho}: mapa HTML já está correto.`);
    return false;
  }
  texto = texto.slice(0, mapaInicio) + linhaCorreta + texto.slice(mapaFim);
  await fs.writeFile(caminho, texto, 'utf8');
  console.log(`${caminho}: mapa de entidades HTML reparado.`);
  return true;
}

await reparar('scripts/coletar-pautas.mjs');
await reparar('scripts/resolver-imagem.mjs');
