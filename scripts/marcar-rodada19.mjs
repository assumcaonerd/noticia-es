import fs from 'node:fs';

const path = 'pautas.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const alvo = data.pautas.find((p) => p.id === 'a82bb8f01214766d');

if (!alvo) {
  console.log('Pauta da rodada 19 não encontrada.');
  process.exit(0);
}

alvo.status = 'publicada';
alvo.slugPublicado = 'lula-lulinha-ministerio-seguranca-publica-correios-divida';
alvo.publicadaEm = new Date().toISOString();
data.atualizadoEm = new Date().toISOString();

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Rodada 19 marcada como publicada.');
