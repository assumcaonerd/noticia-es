import fs from 'node:fs/promises';

const blocoCorreto = `  const mapa = {
    '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>',
    '&nbsp;': ' ', '&ordm;': 'º', '&ordf;': 'ª'
  };`;

async function reparar(caminho) {
  let texto = await fs.readFile(caminho, 'utf8');
  const inicioFuncao = texto.indexOf("function decodeHtml(texto = '') {");
  if (inicioFuncao < 0) {
    const inicioExport = texto.indexOf("export function decodeHtml(texto = '') {");
    if (inicioExport < 0) throw new Error(`Função decodeHtml não encontrada em ${caminho}.`);
  }

  const inicio = Math.max(inicioFuncao, texto.indexOf("export function decodeHtml(texto = '') {"));
  const mapaInicio = texto.indexOf('  const mapa = {', inicio);
  if (mapaInicio < 0) throw new Error(`Mapa HTML não encontrado em ${caminho}.`);
  const mapaFim = texto.indexOf('  };', mapaInicio);
  if (mapaFim < 0) throw new Error(`Fim do mapa HTML não encontrado em ${caminho}.`);
  const fimInclusivo = mapaFim + '  };'.length;
  const atual = texto.slice(mapaInicio, fimInclusivo);

  let alterado = false;
  if (atual !== blocoCorreto) {
    texto = texto.slice(0, mapaInicio) + blocoCorreto + texto.slice(fimInclusivo);
    alterado = true;
  }

  if (caminho === 'scripts/coletar-pautas.mjs') {
    const antes = texto;
    texto = texto
      .split('\n')
      .filter(linha => !linha.includes("nome: 'ES Hoje - Capa'") && !linha.includes("'eshoje.com.br'"))
      .join('\n');
    texto = texto.replace(/,\s*'eshoje\.com\.br'/g, '').replace(/'eshoje\.com\.br'\s*,\s*/g, '');
    if (texto !== antes) {
      alterado = true;
      console.log(`${caminho}: ES Hoje removido permanentemente da lista de coleta e de portais prioritários.`);
    }
  }

  if (!alterado) {
    console.log(`${caminho}: já está correto.`);
    return false;
  }

  await fs.writeFile(caminho, texto, 'utf8');
  console.log(`${caminho}: reparado.`);
  return true;
}

await reparar('scripts/coletar-pautas.mjs');
await reparar('scripts/resolver-imagem.mjs');
