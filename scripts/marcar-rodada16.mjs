import fs from 'node:fs/promises';

const arquivo = JSON.parse(await fs.readFile('pautas.json', 'utf8'));
const agora = new Date().toISOString();
const publicados = new Map([
  ['a1f1c2180e104089', 'ricardo-ferraco-plano-governo-escolas-integrais-hospital-veterinario-aeroporto-cargas'],
  ['239659709a62c335', 'pazolini-plano-governo-es-seguranca-ia-hospitais-consultorios-escolas']
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
  console.log('Rodada 16 marcada como publicada.');
} else {
  console.log('Rodada 16 já estava registrada ou pautas não foram encontradas.');
}
