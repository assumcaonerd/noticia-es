import fs from 'node:fs/promises';
const caminho = new URL('../pautas.json', import.meta.url);
const dados = JSON.parse(await fs.readFile(caminho, 'utf8'));
const publicados = new Map([
  ['c4b925f0406a4ba8', 'rose-contarato-lideram-rejeicao-senado-es-quaest'],
  ['b88c5c456f418a28', 'trafico-expulsao-moradores-prolar-cariacica-prisoes']
]);
const agora = new Date().toISOString();
for (const pauta of dados.pautas || []) {
  if (publicados.has(pauta.id)) {
    pauta.status = 'publicada';
    pauta.slugPublicado = publicados.get(pauta.id);
    pauta.publicadaEm = agora;
  }
}
dados.atualizadoEm = agora;
await fs.writeFile(caminho, JSON.stringify(dados, null, 2) + '\n');
