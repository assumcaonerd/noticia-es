import fs from 'node:fs/promises';

const arquivo = new URL('../pautas.json', import.meta.url);
const dados = JSON.parse(await fs.readFile(arquivo, 'utf8'));
const agora = new Date().toISOString();
const publicadas = new Map([
  ['51970d7c56b30607', 'flavio-lidera-lula-no-es-quaest-34-a-29-empate-tecnico'],
  ['d553cd035abffead', 'ricardo-ferraco-lidera-e-venceria-segundo-turno-no-es-quaest'],
  ['2980f76f6b342905', 'golpe-audios-voz-amigas-serra-invade-celulares-pix'],
  ['f53bb40a057dbc99', 'tre-rj-rejeita-denuncia-crivella-qg-propina-senado-2026']
]);

for (const pauta of dados.pautas || []) {
  const slug = publicadas.get(pauta.id);
  if (!slug) continue;
  pauta.status = 'publicada';
  pauta.slugPublicado = slug;
  pauta.publicadaEm = agora;
}

dados.atualizadoEm = agora;
await fs.writeFile(arquivo, JSON.stringify(dados, null, 2) + '\n', 'utf8');
