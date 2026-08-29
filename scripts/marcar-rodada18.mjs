import fs from 'node:fs/promises';

const arquivo = 'pautas.json';
const agora = new Date().toISOString();
const publicadas = new Map([
  ['7143fafb4b8213d6', 'catador-morto-tiros-carroca-vila-velha-dhpp-investiga'],
  ['38f8ae4e9611fead', 'catador-morto-tiros-carroca-vila-velha-dhpp-investiga']
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
  console.log('Rodada 18 marcada como publicada.');
} else {
  console.log('Rodada 18 já estava registrada.');
}
