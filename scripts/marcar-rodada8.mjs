import fs from 'node:fs/promises';

const arquivo = 'pautas.json';
const agora = new Date().toISOString();
const publicadas = new Map([
  ['9ca37adda0d89276', 'rose-de-freitas-aposta-legado-senado-es-2026'],
  ['6932be8560e2f247', 'preso-suspeito-explosao-incendio-viatura-pm-linhares']
]);

const dados = JSON.parse(await fs.readFile(arquivo, 'utf8'));
let alterou = false;
for (const pauta of dados.pautas || []) {
  const slug = publicadas.get(pauta.id);
  if (!slug) continue;
  if (pauta.status !== 'publicada' || pauta.slugPublicado !== slug) {
    pauta.status = 'publicada';
    pauta.slugPublicado = slug;
    pauta.publicadaEm = pauta.publicadaEm || agora;
    alterou = true;
  }
}
if (alterou) {
  dados.atualizadoEm = agora;
  await fs.writeFile(arquivo, JSON.stringify(dados, null, 2) + '\n');
  console.log('Rodada 8 marcada como publicada.');
} else {
  console.log('Rodada 8 já estava registrada.');
}
