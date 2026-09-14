import fs from 'node:fs/promises';

const arquivo = JSON.parse(await fs.readFile('pautas.json', 'utf8'));
const agora = new Date().toISOString();

const publicados = new Map([
  ['68da8ac870ab9f4d', 'decisao-toffoli-pode-alterar-camara-guarapari-cota-genero'],
  ['c789f5da23a108f6', 'rua-da-lama-vilson-ballan-condenado-29-anos-breno']
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
  console.log(`Rodada 6: ${alteradas} pauta(s) marcada(s) como publicada(s).`);
} else {
  console.log('Rodada 6: nenhuma marcação pendente.');
}
