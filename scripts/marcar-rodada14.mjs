import fs from 'node:fs/promises';

const ARQUIVO = 'pautas.json';
const ALVO = 'cdc4b0006e5cf9a0';
const SLUG = 'quaest-ricardo-ferraco-35-pazolini-28-helder-10-governo-es';

const dados = JSON.parse(await fs.readFile(ARQUIVO, 'utf8'));
let alterou = false;
for (const pauta of dados.pautas || []) {
  if (pauta.id !== ALVO) continue;
  if (pauta.status !== 'publicada' || pauta.slugPublicado !== SLUG) {
    pauta.status = 'publicada';
    pauta.slugPublicado = SLUG;
    pauta.publicadaEm = new Date().toISOString();
    alterou = true;
  }
}
if (alterou) {
  dados.atualizadoEm = new Date().toISOString();
  await fs.writeFile(ARQUIVO, `${JSON.stringify(dados, null, 2)}\n`, 'utf8');
  console.log('Rodada 14 marcada como publicada.');
} else {
  console.log('Rodada 14 já estava marcada ou pauta não encontrada.');
}
