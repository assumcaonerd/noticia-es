#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { desenharLapis } from './lapis-filtro.mjs';

const RAIZ = process.cwd();
const DESTINO = path.join(RAIZ, 'imagens', 'lapis');
const TMP = path.join(RAIZ, '.tmp-capas-lapis-regen');
const MAPA = path.join(RAIZ, 'fontes-capas.json');

async function baixar(url, destino) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 NoticiaESBot/2.6 (+https://noticiaes.com.br)' },
    signal: AbortSignal.timeout(25000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const tipo = String(res.headers.get('content-type') || '');
  if (tipo && !/image\//i.test(tipo) && !/octet-stream/i.test(tipo)) {
    throw new Error(`tipo não é imagem: ${tipo}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error(`arquivo pequeno demais (${buf.length} bytes)`);
  await fs.writeFile(destino, buf);
}

await fs.mkdir(DESTINO, { recursive: true });
await fs.mkdir(TMP, { recursive: true });
const mapa = JSON.parse(await fs.readFile(MAPA, 'utf8'));
const nomes = Object.keys(mapa);
const diag = { geradas: 0, falhas: 0 };

for (const nome of nomes) {
  const url = String(mapa[nome] || '').trim();
  if (!/^https?:\/\//i.test(url)) {
    diag.falhas++;
    console.warn(`[regen] ${nome}: url inválida`);
    continue;
  }
  const entrada = path.join(TMP, nome + '.orig');
  const saida = path.join(DESTINO, nome);
  try {
    await baixar(url, entrada);
    await desenharLapis(entrada, saida);
    const st = await fs.stat(saida);
    if (st.size < 25000) throw new Error(`capa final pequena demais (${st.size} bytes)`);
    diag.geradas++;
    console.log(`[regen] ${nome}`);
  } catch (erro) {
    diag.falhas++;
    console.warn(`[regen] ${nome}: ${erro.message}`);
  }
}

await fs.rm(TMP, { recursive: true, force: true });
console.log(`[regen] geradas=${diag.geradas} falhas=${diag.falhas}`);
if (diag.geradas === 0) process.exit(1);
