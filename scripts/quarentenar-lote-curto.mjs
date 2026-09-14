#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const raiz = process.cwd();
const alvo = 'auto-redacao-20260902-191808.js';
const alvoPath = path.join(raiz, alvo);
const manifestPath = path.join(raiz, 'auto-manifest.js');
const pautasPath = path.join(raiz, 'pautas.json');
const mDir = path.join(raiz, 'm');
const quarentenaDir = path.join(raiz, 'quarentena');

async function existe(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

if (!(await existe(alvoPath))) {
  console.log(`[quarentena] ${alvo} não existe; nada a fazer.`);
  process.exit(0);
}

const shard = await fs.readFile(alvoPath, 'utf8');
const pautaIds = [...shard.matchAll(/\bpautaId\s*:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const slugs = [...shard.matchAll(/\bslug\s*:\s*["']([^"']+)["']/g)].map((m) => m[1]);

let manifest = await fs.readFile(manifestPath, 'utf8');
const linha = new RegExp(`\\s*["']${alvo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'],?\\n?`, 'g');
manifest = manifest.replace(linha, '\n');
manifest = manifest.replace(/\[\n\s*\n/, '[\n');
await fs.writeFile(manifestPath, manifest, 'utf8');

const banco = JSON.parse(await fs.readFile(pautasPath, 'utf8'));
const pautas = Array.isArray(banco) ? banco : (Array.isArray(banco.pautas) ? banco.pautas : []);
let reabertas = 0;
for (const p of pautas) {
  if (!pautaIds.includes(String(p.id))) continue;
  p.status = 'pendente';
  delete p.slugPublicado;
  delete p.publicadaEm;
  reabertas++;
}
if (!Array.isArray(banco)) banco.atualizadoEm = new Date().toISOString();
await fs.writeFile(pautasPath, JSON.stringify(banco, null, 2) + '\n', 'utf8');

let removidas = 0;
for (const slug of slugs) {
  const pagina = path.join(mDir, `${slug}.html`);
  if (await existe(pagina)) {
    await fs.unlink(pagina);
    removidas++;
  }
}

await fs.mkdir(quarentenaDir, { recursive: true });
const registro = {
  arquivo: alvo,
  motivo: 'Lote gerado como notas curtas, sem reapuração suficiente e fora do padrão editorial de reportagem completa.',
  pautaIds,
  slugs,
  reabertas,
  paginasOgRemovidas: removidas,
  quarantinedAt: new Date().toISOString()
};
await fs.writeFile(
  path.join(quarentenaDir, 'auto-redacao-20260902-191808.json'),
  JSON.stringify(registro, null, 2) + '\n',
  'utf8'
);

console.log(`[quarentena] ${alvo} retirado do manifesto; ${reabertas} pauta(s) reaberta(s); ${removidas} página(s) OG removida(s).`);
