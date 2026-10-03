#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { desenharLapis } from './lapis-filtro.mjs';

const RAIZ = process.cwd();
const DESTINO = path.join(RAIZ, 'imagens', 'lapis');
const TMP = path.join(RAIZ, '.tmp-capas-lapis');
const LOTE = path.join(RAIZ, 'lote-redacao.json');
const LARGURA = 1200;
const ALTURA = 630;
const INVALIDA = /(auto-(politica|seguranca)|placeholder|fallback|default[-_]?image|og[-_]?default|\/logo[._/-]|logo\.(svg|png|jpg|jpeg|webp)(\?|$)|imagens\/auto-.*\.svg)/i;

function slugify(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function ehLapis(url = '') {
  return /^https:\/\/noticiaes\.com\.br\/imagens\/lapis\//i.test(String(url || '').trim());
}

function fotoValida(url = '') {
  const u = String(url || '').trim();
  if (!/^https:\/\//i.test(u)) return false;
  if (/\.svg(\?|$)/i.test(u)) return false;
  if (INVALIDA.test(u)) return false;
  if (ehLapis(u)) return false;
  return true;
}

function fotoFonte(pauta, reportagem) {
  const candidatos = [
    reportagem?.imagemOriginal,
    reportagem?.imagemFonte,
    pauta?.imagemOriginal,
    pauta?.imagem,
    reportagem?.imagem
  ];
  return candidatos.map(x => String(x || '').trim()).find(fotoValida) || '';
}

async function baixarFoto(url, destino) {
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

// Capa: grafite fiel à foto da pauta, sem título, logo ou cartão.
// O desenho sai de scripts/lapis-filtro.mjs para manter um único padrão.
await fs.mkdir(DESTINO, { recursive: true });
await fs.mkdir(TMP, { recursive: true });

const lote = JSON.parse(await fs.readFile(LOTE, 'utf8'));
const candidatas = Array.isArray(lote.candidatas) ? lote.candidatas : [];
const diagnostico = { geradas: 0, reaproveitadas: 0, puladas: 0, semFoto: 0, falhas: 0 };

for (const p of candidatas) {
  const r = p.reportagem;
  if (!r || typeof r !== 'object') {
    diagnostico.puladas++;
    continue;
  }
  const titulo = String(r.titulo || p.titulo || '').trim();
  const slug = slugify(r.slug || titulo || p.id) || `pauta-${p.id}`;
  const fonte = fotoFonte(p, r);
  const arquivo = `${slug}.jpg`;
  const saida = path.join(DESTINO, arquivo);
  const urlFinal = `https://noticiaes.com.br/imagens/lapis/${arquivo}`;

  if (!fonte) {
    diagnostico.semFoto++;
    console.warn(`[lapis] ${p.id}: sem foto da fonte; capa não gerada`);
    continue;
  }

  try {
    const entrada = path.join(TMP, `${slug}.orig`);
    await baixarFoto(fonte, entrada);
    await desenharLapis(entrada, saida);
    r.imagemOriginal = fonte;
    r.imagem = urlFinal;
    r.imagemX = urlFinal;
    r.redacaoPropria = true;
    r.origemTexto = 'redacao-noticia-es';
    r.slug = slug;
    diagnostico.geradas++;
    console.log(`[lapis] ${p.id}: grafite de ${fonte} -> ${arquivo}`);
  } catch (erro) {
    diagnostico.falhas++;
    console.warn(`[lapis] ${p.id}: ${erro.message}`);
  }
}

await fs.rm(TMP, { recursive: true, force: true });
lote.diagnosticoLapis = diagnostico;
lote.lapisEm = new Date().toISOString();
await fs.writeFile(LOTE, JSON.stringify(lote, null, 2) + '\n', 'utf8');
console.log(`[lapis] geradas=${diagnostico.geradas} reaproveitadas=${diagnostico.reaproveitadas} puladas=${diagnostico.puladas} semFoto=${diagnostico.semFoto} falhas=${diagnostico.falhas}`);
