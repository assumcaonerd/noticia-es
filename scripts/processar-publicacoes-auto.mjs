import fs from 'node:fs';
import path from 'node:path';

const pautasPath = path.resolve('pautas.json');
const recibosDir = path.resolve('publicacoes-pendentes');

if (!fs.existsSync(recibosDir)) {
  console.log('Nenhum recibo de publicação para processar.');
  process.exit(0);
}

const arquivos = fs.readdirSync(recibosDir).filter((n) => n.endsWith('.json')).sort();
if (!arquivos.length) {
  console.log('Nenhum recibo de publicação para processar.');
  process.exit(0);
}

const banco = JSON.parse(fs.readFileSync(pautasPath, 'utf8'));
let alteradas = 0;

for (const nome of arquivos) {
  const arquivo = path.join(recibosDir, nome);
  const recibo = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  const pauta = banco.pautas?.find((p) => p.id === recibo.pautaId);

  if (!pauta) {
    console.warn(`Pauta não encontrada para recibo ${nome}: ${recibo.pautaId}`);
    continue;
  }

  pauta.status = 'publicada';
  pauta.slugPublicado = recibo.slugPublicado;
  pauta.publicadaEm = recibo.publicadaEm;
  alteradas += 1;
  fs.unlinkSync(arquivo);
}

if (alteradas) {
  banco.atualizadoEm = new Date().toISOString();
  fs.writeFileSync(pautasPath, `${JSON.stringify(banco, null, 2)}\n`);
  console.log(`${alteradas} pauta(s) marcada(s) como publicada(s).`);
} else {
  console.log('Nenhuma pauta foi alterada.');
}
