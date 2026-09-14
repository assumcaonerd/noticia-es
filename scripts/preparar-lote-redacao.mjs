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
const STOP = new Set('a o as os um uma uns umas de da do das dos em no na nos nas por para com sem e ou que se ao aos à às entre sobre após apos antes durante contra como mais menos já ja tem teve têm sua seu suas seus esta este isso isto esse essa esses essas novo nova novos novas 2026 2027 brasil brasileiro brasileira'.split(' '));

function normalizar(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokensTitulo(s = '') {
  return new Set(normalizar(s).split(/\s+/).filter((t) => t.length >= 3 && !STOP.has(t)));
}

function similaridadeTitulos(a, b) {
  const A = tokensTitulo(a);
  const B = tokensTitulo(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const uniao = A.size + B.size - inter;
  return uniao ? inter / uniao : 0;
}

function mesmaPautaPorTitulo(a, b) {
  const na = normalizar(a);
  const nb = normalizar(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const A = tokensTitulo(a), B = tokensTitulo(b);
  const menor = Math.min(A.size, B.size);
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const coberturaMenor = menor ? inter / menor : 0;
  return similaridadeTitulos(a, b) >= 0.58 || (menor >= 4 && coberturaMenor >= 0.75);
}

function urlCanonica(u = '') {
  try {
    const x = new URL(String(u));
    x.hash = '';
    for (const p of [...x.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|output|ref|source)/i.test(p)) x.searchParams.delete(p);
    }
    return (x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/$/, '')).toLowerCase();
  } catch {
    return normalizar(u);
  }
}

function hostOuTexto(pauta) {
  return [pauta.urlFonte, pauta.fonteNome, pauta.origem].filter(Boolean).join(' ').toLowerCase();
}

function fonteBloqueada(pauta) {
  const texto = hostOuTexto(pauta);
  return FONTES_BLOQUEADAS.some((x) => texto.includes(x));
}

function pautaEditorialmenteBloqueada(pauta) {
  const titulo = normalizar(pauta?.titulo || '');
  const resumo = normalizar(pauta?.resumoFonte || '');
  const fonte = normalizar(pauta?.fonteNome || '');
  const url = String(pauta?.urlFonte || '').toLowerCase();

  // Opinião, coluna e editorial não entram no redator factual automático.
  if (/^(opiniao|editorial|artigo)\b/.test(titulo)) return true;
  if (/\b(opiniao|colunista|artigo de opiniao)\b/.test(fonte) && !/\bpesquisa\b/.test(titulo)) return true;

  // Diário Oficial genérico só pode virar pauta quando houver ato específico já identificado.
  if ((fonte.includes('dio es edicao') || titulo.startsWith('diario oficial do es edicao') || url === 'https://dio.es.gov.br/diario-oficial') &&
      /\b(conferir|consulta|edicao|diario oficial)\b/.test(`${titulo} ${resumo}`) &&
      !/\b(decreto|lei|nomeacao|exoneracao|portaria|licitacao|contrato|ato especifico)\b/.test(titulo)) return true;

  // Homepages e páginas de listagem sem fato específico não são matéria.
  try {
    const u = new URL(String(pauta?.urlFonte || ''));
    const caminho = u.pathname.replace(/\/+$/, '');
    if ((!caminho || caminho === '') && titulo.split(' ').length < 5) return true;
  } catch {}

  return false;
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
  if (c === 'seguranca publica') return 0;
  if (c === 'politica es') return 1;
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

async function publicadosIndex() {
  const nomes = await fs.readdir(RAIZ);
  const arquivos = nomes.filter((n) =>
    n === 'noticias.js' ||
    /^editorial.*\.js$/.test(n) ||
    /^auto-redacao-\d{8}-\d{6}\.js$/.test(n) ||
    n === 'opiniao.js' ||
    n === 'fe-sociedade.js' ||
    n === 'manual-gilvan.js'
  );

  const slugs = new Set();
  const titulosNorm = new Set();
  const titulosBrutos = [];
  const urls = new Set();
  for (const arquivo of arquivos) {
    let texto = '';
    try { texto = await fs.readFile(path.join(RAIZ, arquivo), 'utf8'); } catch { continue; }
    for (const m of texto.matchAll(/\bslug\s*:\s*["'`]([^"'`]+)["'`]/g)) slugs.add(normalizar(m[1]));
    for (const m of texto.matchAll(/\btitulo\s*:\s*["'`]([^"'`]+)["'`]/g)) {
      titulosNorm.add(normalizar(m[1]));
      titulosBrutos.push(m[1]);
    }
    for (const m of texto.matchAll(/\bfonteUrl\s*:\s*["'`]([^"'`]+)["'`]/g)) urls.add(urlCanonica(m[1]));
  }
  return { slugs, titulosNorm, titulosBrutos, urls };
}

const bruto = JSON.parse(await fs.readFile(PAUTAS, 'utf8'));
const pautas = Array.isArray(bruto) ? bruto : (Array.isArray(bruto.pautas) ? bruto.pautas : []);
const publicados = await publicadosIndex();

const elegiveis = [];
const diagnostico = { totalPendentes: 0, bloqueadas: 0, bloqueadasEditoriais: 0, semImagem: 0, duplicadasBasicas: 0, duplicadasSemanticas: 0, foraCategorias: 0 };

for (const p of pautas) {
  if (p?.status !== 'pendente') continue;
  diagnostico.totalPendentes++;
  if (fonteBloqueada(p)) { diagnostico.bloqueadas++; continue; }
  if (pautaEditorialmenteBloqueada(p)) { diagnostico.bloqueadasEditoriais++; continue; }
  if (categoriaRank(p.categoria) >= 9) { diagnostico.foraCategorias++; continue; }
  if (!imagemValida(p)) { diagnostico.semImagem++; continue; }

  const slugConhecido = normalizar(p.slugPublicado || p.slug || '');
  const titulo = String(p.titulo || '');
  const tituloNorm = normalizar(titulo);
  const url = urlCanonica(p.urlFonte || '');

  if ((slugConhecido && publicados.slugs.has(slugConhecido)) ||
      (tituloNorm && publicados.titulosNorm.has(tituloNorm)) ||
      (url && publicados.urls.has(url))) {
    diagnostico.duplicadasBasicas++;
    continue;
  }

  if (titulo && publicados.titulosBrutos.some((t) => mesmaPautaPorTitulo(titulo, t))) {
    diagnostico.duplicadasSemanticas++;
    continue;
  }

  if (elegiveis.some((q) => {
    const mesmaUrl = url && url === urlCanonica(q.urlFonte || '');
    return mesmaUrl || mesmaPautaPorTitulo(titulo, q.titulo || '');
  })) {
    diagnostico.duplicadasSemanticas++;
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
console.log(`[lote-redacao] ${candidatas.length} candidata(s). Pendentes=${diagnostico.totalPendentes}; semImagem=${diagnostico.semImagem}; bloqueadas=${diagnostico.bloqueadas}; bloqueadasEditoriais=${diagnostico.bloqueadasEditoriais}; duplicadasBasicas=${diagnostico.duplicadasBasicas}; duplicadasSemanticas=${diagnostico.duplicadasSemanticas}`);
