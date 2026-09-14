import fs from 'node:fs/promises';

const caminho = 'pautas.json';
const alvo = '7c695e5eeb25cb6b';
const slug = 'flavio-bolsonaro-tcu-contratos-produtora-socio-sidonio-palmeira';
const publicadaEm = new Date().toISOString();

const arquivo = JSON.parse(await fs.readFile(caminho, 'utf8'));
let alterou = false;
for (const pauta of arquivo.pautas || []) {
  if (pauta.id !== alvo) continue;
  if (pauta.status !== 'publicada' || pauta.slugPublicado !== slug) {
    pauta.status = 'publicada';
    pauta.slugPublicado = slug;
    pauta.publicadaEm = publicadaEm;
    pauta.categoria = 'Política Nacional';
    alterou = true;
  }
}
if (alterou) {
  arquivo.atualizadoEm = publicadaEm;
  await fs.writeFile(caminho, `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
  console.log('Rodada 13 registrada em pautas.json.');
} else {
  console.log('Rodada 13 já registrada.');
}
