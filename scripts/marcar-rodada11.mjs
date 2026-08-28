import fs from 'node:fs/promises';
const caminho = 'pautas.json';
const arquivo = JSON.parse(await fs.readFile(caminho, 'utf8'));
const agora = new Date().toISOString();
const alvo = arquivo.pautas.find(p => p.id === '37d3fd897cdada51' || String(p.urlFonte || '').includes('/em-menos-de-1-minuto-suspeito-invade-clinica-e-furta-tv-em-vila-velha/'));
if (alvo && alvo.status !== 'publicada') {
  alvo.status = 'publicada';
  alvo.slugPublicado = 'furto-clinica-praia-da-costa-vila-velha-investigacao';
  alvo.publicadaEm = agora;
}
arquivo.atualizadoEm = agora;
await fs.writeFile(caminho, `${JSON.stringify(arquivo, null, 2)}\n`, 'utf8');
console.log(alvo ? 'Rodada 11 registrada em pautas.json.' : 'Pauta da rodada 11 não encontrada.');
