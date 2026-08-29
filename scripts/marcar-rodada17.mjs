import fs from 'node:fs/promises';

const arquivo = JSON.parse(await fs.readFile('pautas.json', 'utf8'));
const agora = new Date().toISOString();
const publicados = new Map([
  ['f7e86b04c221f172', 'rose-de-freitas-senado-stf-bets-emendas-seguranca-es']
]);
let alterou = false;
for (const pauta of arquivo.pautas || []) {
  const slug = publicados.get(pauta.id);
  if (!slug || pauta.status === 'publicada') continue;
  pauta.status = 'publicada';
  pauta.slugPublicado = slug;
  pauta.publicadaEm = agora;
  alterou = true;
}
if (alterou) {
  arquivo.atualizadoEm = agora;
  await fs.writeFile('pautas.json', `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
  console.log('Rodada 17 marcada como publicada.');
} else {
  console.log('Rodada 17 já estava registrada ou pauta não foi encontrada.');
}
