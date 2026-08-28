import fs from 'node:fs/promises';

const PAUTAS = 'pautas.json';
const EDITORIAL = 'editorial-10.js';
const ID_PAUTA = '28b3d92654a998ec';
const SLUG = 'joanita-almeida-8-janeiro-hospital-custodia-barbacena-stf';
const IMAGEM_FONTE = 'https://medias.revistaoeste.com/wp-content/uploads/2026/08/joanita.jpg.webp';

const agora = new Date().toISOString();

const arquivo = JSON.parse(await fs.readFile(PAUTAS, 'utf8'));
const pauta = Array.isArray(arquivo.pautas) ? arquivo.pautas.find(p => p.id === ID_PAUTA) : null;

if (pauta && pauta.status !== 'publicada') {
  pauta.status = 'publicada';
  pauta.slugPublicado = SLUG;
  pauta.publicadaEm = agora;
  pauta.categoria = 'Política Nacional';
  arquivo.atualizadoEm = agora;
  await fs.writeFile(PAUTAS, `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
  console.log('Pauta Joanita marcada como publicada.');
} else {
  console.log('Pauta Joanita já estava publicada ou não foi encontrada.');
}

let editorial = await fs.readFile(EDITORIAL, 'utf8');
const anterior = 'imagem: "imagens/auto-politica-nacional.svg"';
const nova = `imagem: "${IMAGEM_FONTE}"`;
if (editorial.includes(anterior)) {
  editorial = editorial.replace(anterior, nova);
  await fs.writeFile(EDITORIAL, editorial, 'utf8');
  console.log('Imagem principal substituída pela imagem editorial da fonte.');
} else {
  console.log('Imagem da matéria já estava ajustada.');
}
