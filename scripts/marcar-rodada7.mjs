import fs from 'node:fs/promises';

const arquivo = JSON.parse(await fs.readFile('pautas.json', 'utf8'));
const agora = new Date().toISOString();

const publicados = new Map([
  ['2385bcbd8c3f3ba3', 'quaest-aprovacao-ricardo-ferraco-56-13-governo-es'],
  ['125ad9e9421177d0', 'populacao-situacao-rua-es-supera-5-mil-desafio-politicas-publicas']
]);

let alteradas = 0;
for (const pauta of arquivo.pautas || []) {
  const slug = publicados.get(pauta.id);
  if (!slug) continue;
  if (pauta.status !== 'publicada' || pauta.slugPublicado !== slug) {
    pauta.status = 'publicada';
    pauta.slugPublicado = slug;
    pauta.publicadaEm = pauta.publicadaEm || agora;
    alteradas++;
  }
}

if (alteradas > 0) {
  arquivo.atualizadoEm = agora;
  await fs.writeFile('pautas.json', `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
  console.log(`Rodada 7: ${alteradas} pauta(s) marcada(s) como publicada(s).`);
} else {
  console.log('Rodada 7: nenhuma marcação pendente.');
}
