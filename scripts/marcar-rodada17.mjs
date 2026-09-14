import fs from 'node:fs/promises';

const arquivo = JSON.parse(await fs.readFile('pautas.json', 'utf8'));
const agora = new Date().toISOString();
let alterou = false;

for (const pauta of arquivo.pautas || []) {
  if (pauta.id === 'f7e86b04c221f172' && pauta.slugPublicado === 'rose-de-freitas-senado-stf-bets-emendas-seguranca-es') {
    pauta.status = 'pendente';
    delete pauta.slugPublicado;
    delete pauta.publicadaEm;
    alterou = true;
  }

  if (pauta.id === '1d7c987b725f3bed' && pauta.status !== 'publicada') {
    pauta.status = 'publicada';
    pauta.slugPublicado = 'rose-de-freitas-senado-stf-bets-emendas-seguranca-es';
    pauta.publicadaEm = agora;
    alterou = true;
  }
}

if (alterou) {
  arquivo.atualizadoEm = agora;
  await fs.writeFile('pautas.json', `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
  console.log('Rodada 17 corrigida e registrada.');
} else {
  console.log('Rodada 17 já estava corretamente registrada.');
}
