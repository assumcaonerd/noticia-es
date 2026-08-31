#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const PAUTAS = path.join(RAIZ, 'pautas.json');
const DESTINO = path.join(RAIZ, 'lote-redacao.json');

const FONTES_PRIORITARIAS = [
  'agazeta.com.br',
  'folhavitoria.com.br',
  'tribunaonline.com.br',
  'revistaoeste.com',
  'gazetadopovo.com.br',
  'oantagonista.com.br',
  'correiodamanha.com.br'
];

const FONTES_BLOQUEADAS = [
  'eshoje.com.br',
  'valor.globo.com',
  'valor economico',
  'valor econômico',
  'reuters.com',
  'reuters',
  'apnews.com',
  'associated press',
  'afp',
  'efe.com',
  'agencia efe',
  'agência efe',
  'news.cn',
  'xinhua',
  'tass.com',
  'tass'
];

const PADROES_IMAGEM_INVALIDA = /(auto-(politica|seguranca)|placeholder|fb_marca\.png|marca[_-]?valor|logo[^/]*valor|valor[^/]*logo|default[-_]?image|og[-_]?default|\/logo[._/-]|logo\.(svg|png|jpg|jpeg|webp)(\?|$))/i;

function normalizar(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function hostOuTexto(pauta) {
  return [pauta.urlFonte, pauta.fonteNome, pauta.origem].filter(Boolean).join(' ').toLowerCase();
}

function fonteBloqueada(pauta) {
  const texto = hostOuTexto(pauta);
  return FONTES_BLOQUEADAS.some((x) => texto.includes(x));
}

function imagemValida(pauta) {
  const img = String(pauta.imagemFonte || pauta.imagem || '').trim();
  if (!/^https:\/\//i.test(img)) return false;
  if (/\.svg(\?|$)/i.test(img)) return false;
  if (PADROES_IMAGEM_INVALIDA.test(img)) return false;
  return true;
}

function categoriaRank(categoria = '') {
  const c = normalizar(categoria);
  if (c === 'politica es') return 0;
  if (c === 'seguranca publica') return 1;
  if (c === 'politica nacional') return 2;
  return 9;
}

function radarFlavio(pauta) {
  const texto = normalizar([pauta.radar, pauta.titulo, pauta.resumoFonte].filter(Boolean).join(' '));
  return texto.includes('flavio bolsonaro') ? 0 : 1;
}

function fonteRank(pauta) {
  const texto = hostOuTexto(pauta);
  const i = FONTES_PRIORITARIAS.findIndex((x) => texto.includes(x));
  return i === -1 ? 99 : i;
}

function dataRank(pauta) {
  const d = Date.parse(pauta.dataFonte || pauta.descobertaEm || 0);
  return Number.isFinite(d) ? -d : 0;
}

async function slugsETitulosPublicados() {
  const nomes = await fs.readdir(RAIZ);
  const arquivos = nomes.filter((n) =>
    n === 'noticias.js' ||
    /^editorial.*\.js$/.test(n) ||
    /^auto-redacao-\d{8}-\d{6}\.js$/.test(n) ||
    n === 'opiniao.js' ||
    n === 'fe-sociedade.js'
  );

  const slugs = new Set();
  const titulos = new Set();
  for (const arquivo of arquivos) {
    let texto = '';
    try { texto = await fs.readFile(path.join(RAIZ, arquivo), 'utf8'); } catch { continue; }
    for (const m of texto.matchAll(/\bslug\s*:\s*["'`]([^"'`]+)["'`]/g)) slugs.add(normalizar(m[1]));
    for (const m of texto.matchAll(/\btitulo\s*:\s*["'`]([^"'`]+)["'`]/g)) titulos.add(normalizar(m[1]));
  }
  return { slugs, titulos };
}

const bruto = JSON.parse(await fs.readFile(PAUTAS, 'utf8'));
const pautas = Array.isArray(bruto) ? bruto : (Array.isArray(bruto.pautas) ? bruto.pautas : []);
const publicados = await slugsETitulosPublicados();

const elegiveis = [];
const diagnostico = { totalPendentes: 0, bloqueadas: 0, semImagem: 0, duplicadasBasicas: 0, foraCategorias: 0 };

for (const p of pautas) {
  if (p?.status !== 'pendente') continue;
  diagnostico.totalPendentes++;
  if (fonteBloqueada(p)) { diagnostico.bloqueadas++; continue; }
  if (categoriaRank(p.categoria) >= 9) { diagnostico.foraCategorias++; continue; }
  if (!imagemValida(p)) { diagnostico.semImagem++; continue; }

  const slugConhecido = normalizar(p.slugPublicado || p.slug || '');
  const titulo = normalizar(p.titulo || '');
  if ((slugConhecido && publicados.slugs.has(slugConhecido)) || (titulo && publicados.titulos.has(titulo))) {
    diagnostico.duplicadasBasicas++;
    continue;
  }
  elegiveis.push(p);
}

elegiveis.sort((a, b) => {
  return categoriaRank(a.categoria) - categoriaRank(b.categoria)
    || radarFlavio(a) - radarFlavio(b)
    || fonteRank(a) - fonteRank(b)
    || dataRank(a) - dataRank(b);
});

/* Mantemos até 20 candidatas para a redação conseguir substituir alguma que falhe na reapuração e ainda fechar 10. */
const candidatas = elegiveis.slice(0, 20).map((p) => ({
  id: p.id,
  titulo: p.titulo,
  categoria: p.categoria,
  radar: p.radar || null,
  fonteNome: p.fonteNome,
  urlFonte: p.urlFonte,
  dataFonte: p.dataFonte || null,
  resumoFonte: p.resumoFonte || '',
  imagem: p.imagemFonte || p.imagem,
  descobertaEm: p.descobertaEm || null
}));

const saida = {
  geradoEm: new Date().toISOString(),
  objetivo: 'Fornecer uma fila curta para a redação automática reapurar e publicar até 10 matérias.',
  diagnostico,
  quantidadeCandidatas: candidatas.length,
  candidatas
};

await fs.writeFile(DESTINO, JSON.stringify(saida, null, 2) + '\n', 'utf8');
console.log(`[lote-redacao] ${candidatas.length} candidata(s). Pendentes=${diagnostico.totalPendentes}; semImagem=${diagnostico.semImagem}; bloqueadas=${diagnostico.bloqueadas}; duplicadas=${diagnostico.duplicadasBasicas}`);
