import fs from 'node:fs/promises';

const caminho = 'pautas.json';
const alvo = '2804dec6f8c8d592';
const slugPublicado = 'callegari-senado-aborto-seguranca-stf-reforma-tributaria';
const publicadaEm = new Date().toISOString();

const arquivo = JSON.parse(await fs.readFile(caminho, 'utf8'));
let alterou = false;
for (const pauta of arquivo.pautas || []) {
  if (pauta.id === alvo && pauta.status !== 'publicada') {
    pauta.status = 'publicada';
    pauta.slugPublicado = slugPublicado;
    pauta.publicadaEm = publicadaEm;
    alterou = true;
  }
}
if (alterou) {
  arquivo.atualizadoEm = publicadaEm;
  await fs.writeFile(caminho, `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
  console.log('Rodada 12 marcada como publicada.');
} else {
  console.log('Rodada 12 já estava marcada ou pauta não encontrada.');
}
