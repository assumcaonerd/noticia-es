#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DESTINO = path.join(RAIZ, 'imagens', 'lapis');
const LOTE = path.join(RAIZ, 'lote-redacao.json');
const LARGURA = 1200;
const ALTURA = 630;

const CORES = {
  'Política ES': { fundo: '#1b2a4a', faixa: '#c9a227' },
  'Política Nacional': { fundo: '#1a2744', faixa: '#d4af37' },
  'Segurança Pública': { fundo: '#2a1c1c', faixa: '#c45c26' },
  'Justiça': { fundo: '#1c2433', faixa: '#8fa4c4' },
  'Economia': { fundo: '#1a2e24', faixa: '#3d9b6e' },
  'Fé e Sociedade': { fundo: '#2a2418', faixa: '#d4af37' },
  'Cidades': { fundo: '#243018', faixa: '#7aa35a' },
  'Tecnologia': { fundo: '#18202c', faixa: '#5aa0d4' },
  'Esporte': { fundo: '#1c2a18', faixa: '#6fbf4a' },
  'Cultura': { fundo: '#2a1824', faixa: '#c47aa0' },
  'Opinião': { fundo: '#2a2218', faixa: '#e0c080' },
  padrao: { fundo: '#1e2430', faixa: '#c9a227' }
};

function slugify(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function quebrarTitulo(titulo = '', max = 42) {
  const palavras = String(titulo).trim().split(/\s+/).filter(Boolean);
  const linhas = [];
  let atual = '';
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p;
    if (teste.length > max && atual) {
      linhas.push(atual);
      atual = p;
    } else {
      atual = teste;
    }
    if (linhas.length === 3) break;
  }
  if (atual && linhas.length < 4) linhas.push(atual);
  return linhas.slice(0, 4).join('\n');
}

function jaELapis(url = '') {
  return /^https:\/\/noticiaes\.com\.br\/imagens\/lapis\/[a-z0-9._-]+\.(?:jpg|jpeg|png)(?:\?.*)?$/i.test(String(url || '').trim());
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    child.stderr.on('data', (b) => { err += b.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} saiu ${code}: ${err.slice(0, 400)}`));
    });
  });
}

async function gerarUma(titulo, categoria, slug) {
  await fs.mkdir(DESTINO, { recursive: true });
  const arquivo = `${slug}.jpg`;
  const destino = path.join(DESTINO, arquivo);
  const paleta = CORES[categoria] || CORES.padrao;
  const texto = quebrarTitulo(titulo, 36);
  const editoria = String(categoria || 'Notícia ES').toUpperCase();

  await run('convert', [
    '-size', `${LARGURA}x${ALTURA}`,
    `xc:${paleta.fundo}`,
    '-fill', paleta.faixa,
    '-draw', 'rectangle 0,0 16,630',
    '-fill', paleta.faixa,
    '-draw', 'rectangle 0,596 1200,630',
    '-font', 'DejaVu-Sans-Bold',
    '-pointsize', '22',
    '-fill', paleta.faixa,
    '-annotate', '+48+64', editoria,
    '-font', 'DejaVu-Sans-Bold',
    '-pointsize', '42',
    '-fill', '#f4efe4',
    '-annotate', '+48+160', texto,
    '-font', 'DejaVu-Sans',
    '-pointsize', '20',
    '-fill', '#d7c9a3',
    '-annotate', '+48+560', 'NOTÍCIA ES  ·  redação própria',
    '-quality', '86',
    destino
  ]);

  const url = `https://noticiaes.com.br/imagens/lapis/${arquivo}`;
  return { arquivo, url, destino };
}

const lote = JSON.parse(await fs.readFile(LOTE, 'utf8'));
const candidatas = Array.isArray(lote.candidatas) ? lote.candidatas : [];
const diagnostico = { geradas: 0, reaproveitadas: 0, puladas: 0, falhas: 0 };

for (const p of candidatas) {
  const r = p.reportagem;
  if (!r || typeof r !== 'object') {
    diagnostico.puladas++;
    continue;
  }
  const titulo = String(r.titulo || p.titulo || '').trim();
  const slug = slugify(r.slug || titulo || p.id) || `pauta-${p.id}`;
  const categoria = String(r.categoria || p.categoria || '').trim();

  if (jaELapis(r.imagem)) {
    r.redacaoPropria = true;
    r.origemTexto = 'redacao-noticia-es';
    diagnostico.reaproveitadas++;
    continue;
  }

  try {
    const capa = await gerarUma(titulo, categoria, slug);
    r.imagem = capa.url;
    r.redacaoPropria = true;
    r.origemTexto = 'redacao-noticia-es';
    r.slug = slug;
    diagnostico.geradas++;
    console.log(`[lapis] ${p.id}: ${capa.arquivo}`);
  } catch (erro) {
    diagnostico.falhas++;
    console.warn(`[lapis] ${p.id}: ${erro.message}`);
  }
}

lote.diagnosticoLapis = diagnostico;
lote.lapisEm = new Date().toISOString();
await fs.writeFile(LOTE, JSON.stringify(lote, null, 2) + '\n', 'utf8');
console.log(`[lapis] geradas=${diagnostico.geradas} reaproveitadas=${diagnostico.reaproveitadas} puladas=${diagnostico.puladas} falhas=${diagnostico.falhas}`);
