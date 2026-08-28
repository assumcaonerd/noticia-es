import fs from 'node:fs/promises';

const caminho = new URL('../pautas.json', import.meta.url);
const raw = await fs.readFile(caminho, 'utf8');
const dados = JSON.parse(raw);
const publicadaEm = '2026-08-28T09:33:03.000Z';
const atualizacoes = new Map([
  ['3f574172d2595e7c', 'quaest-expoe-forcas-e-fragilidades-ricardo-pazolini-helder-es'],
  ['c78489d3800cb7d5', 'comerciante-foragido-adolescentes-agua-doce-norte-preso-uberlandia']
]);

for (const pauta of dados.pautas || []) {
  const slug = atualizacoes.get(pauta.id);
  if (!slug) continue;
  pauta.status = 'publicada';
  pauta.slugPublicado = slug;
  pauta.publicadaEm = publicadaEm;
}

dados.atualizadoEm = publicadaEm;
await fs.writeFile(caminho, `${JSON.stringify(dados, null, 2)}\n`, 'utf8');
