#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const raiz = process.cwd();
const lotePath = path.join(raiz, 'lote-redacao.json');
const manifestPath = path.join(raiz, 'auto-manifest.js');
const pendentesDir = path.join(raiz, 'publicacoes-pendentes');

const PADRAO_IMAGEM_INVALIDA = /(auto-(politica|seguranca)|placeholder|fallback|fb_marca\.png|default[-_]?image|og[-_]?default|\/logo[._/-]|logo\.(svg|png|jpg|jpeg|webp)(\?|$)|imagens\/auto-.*\.svg)/i;

function slugify(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 110);
}
function js(s = '') { return JSON.stringify(String(s)); }
function stamp(d = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).formatToParts(d).reduce((a, x) => (a[x.type] = x.value, a), {});
  return `${p.year}${p.month}${p.day}-${p.hour}${p.minute}${p.second}`;
}
function dataLocal(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d);
}
function textoPuro(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
function contarPalavras(html = '') {
  const t = textoPuro(html);
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}
function imagemValida(url = '') {
  const u = String(url || '').trim();
  return /^https:\/\/noticiaes\.com\.br\/imagens\/lapis\/[a-z0-9._-]+\.(?:jpg|jpeg|png)(?:\?.*)?$/i.test(u);
}
function fontesValidas(fontes = []) {
  if (!Array.isArray(fontes)) return [];
  return fontes.filter((f) => {
    if (typeof f === 'string') return /^https:\/\//i.test(f);
    return f && /^https:\/\//i.test(String(f.url || ''));
  });
}
function aeoValido(aeo = []) {
  return Array.isArray(aeo) && aeo.length >= 5 && aeo.every(x => String(x?.pergunta || '').trim() && String(x?.resposta || '').trim());
}
function validarReportagem(p) {
  const r = p?.reportagem;
  if (!r || typeof r !== 'object') return 'sem reportagem reapurada';

  const conteudo = String(r.conteudo || '').trim();
  const resumo = String(r.resumo || '').trim();
  const titulo = String(r.titulo || p.titulo || '').trim();
  const imagem = String(r.imagem || '').trim();
  const fonteUrl = String(r.fonteUrl || p.urlFonte || '').trim();
  const adicionais = fontesValidas(r.fontesAdicionais || []);
  const palavras = contarPalavras(conteudo);
  const paragrafos = (conteudo.match(/<p\b/gi) || []).length;
  const subtitulos = (conteudo.match(/<h2\b/gi) || []).length;

  if (!titulo || titulo.length < 20) return 'título insuficiente';
  if (/\|?\s*(cnn brasil|blogs\s*\||folha de s\.?paulo|o globo|estad[aã]o|veja)/i.test(titulo)) return 'título ainda contém marca da fonte';
  if (/blogs-cnn-brasil|cnn-brasil$/i.test(String(r.slug || ''))) return 'slug ainda contém marca da fonte';
  if (!resumo || resumo.length < 80) return 'resumo/subtítulo insuficiente';
  if (!imagemValida(imagem)) return 'imagem inválida: exige arte própria em noticiaes.com.br/imagens/lapis/';
  if (r.redacaoPropria !== true) return 'redacaoPropria precisa ser true';
  if (String(r.origemTexto || '') !== 'redacao-noticia-es') return 'origemTexto inválida';
  if (!/^https:\/\//i.test(fonteUrl)) return 'fonte principal inválida';
  if (adicionais.length < 2) return 'menos de duas fontes adicionais';
  if (palavras < 400) return `texto curto: ${palavras} palavras`;
  if (paragrafos < 7) return `estrutura curta: ${paragrafos} parágrafos`;
  if (subtitulos < 2) return `estrutura sem subtítulos suficientes: ${subtitulos}`;
  const h2s = [...conteudo.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => textoPuro(m[1]));
  if (h2s.some(h => /\b(de|da|do|das|dos|em|no|na|para|com|por|que|se|contra|sobre|entre|uma|um|o|a)$/i.test(h))) return 'intertítulo truncado';
  if (h2s.some(h => /^(Contexto|Desdobramentos?|Mais informações|Detalhes da notícia|Próximos passos)$/i.test(h))) return 'intertítulo genérico proibido';
  if (!aeoValido(r.aeo)) return 'AEO incompleto';
  if (/capit[aã]o\s+assum[cç][aã]o/i.test(JSON.stringify(r.aeo || []))) return 'Capitão Assumção não pode aparecer no AEO nesta fase';
  if (/entrou na fila automática|o que se sabe até agora|seguirá atualizando a cobertura/i.test(conteudo)) return 'modelo de nota curta detectado';
  const primeiroParagrafo = textoPuro(conteudo.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '');
  if (/formado em jornalismo|editor-assistente|colunista da|\bblogs\b/i.test(primeiroParagrafo)) return 'lead contaminado por biografia da fonte';
  if (String(r.categoria || p.categoria) === 'Política Nacional' && /\b(lua|fotografar|celular|zoom [óo]ptico|nvidia|chip|semiconductor|semicondutor)\b/i.test(textoPuro(conteudo))) return 'classificação incompatível com Política Nacional';
  if (/<h2[^>]*>\s*(Contexto|Desdobramentos?)\s*<\/h2>/i.test(conteudo)) return 'intertítulo genérico proibido';
  if (/Leia também:|pic\.twitter\.com\/|Você tem \d+ acessos por dia|Assinantes podem liberar \d+ acessos por dia|Jornalista, pós-graduad[oa]|Graduad[oa] em jornalismo/i.test(textoPuro(conteudo))) return 'resíduo da fonte detectado';
  if (/&(?:amp;)?(?:ccedil|atilde|aacute|eacute|iacute|oacute|uacute|ecirc|ocirc);/i.test(conteudo)) return 'entidade HTML quebrada';
  return null;
}

const lote = JSON.parse(await fs.readFile(lotePath, 'utf8'));
const candidatas = Array.isArray(lote.candidatas) ? lote.candidatas : [];
if (!candidatas.length) {
  console.log('Nenhuma candidata no lote.');
  process.exit(0);
}

const publicaveis = [];
const contagemPorCategoria = new Map();
for (const p of candidatas) {
  const motivo = validarReportagem(p);
  if (motivo) {
    console.log(`[redator] pula ${p.id || 'sem-id'}: ${motivo}`);
    continue;
  }
  const categoria = String(p?.reportagem?.categoria || p?.categoria || '').trim();
  const usados = contagemPorCategoria.get(categoria) || 0;
  if (usados >= 3) {
    console.log(`[redator] pula ${p.id || 'sem-id'}: teto de 3 matérias em ${categoria}`);
    continue;
  }
  publicaveis.push(p);
  contagemPorCategoria.set(categoria, usados + 1);
  if (publicaveis.length === 11) break;
}

if (!publicaveis.length) {
  console.error('[redator] Nenhuma reportagem completa e reapurada disponível. Rodada inválida.');
  console.error('[redator] diagnosticoReapuracao=', JSON.stringify(lote?.diagnosticoReapuracao || {}));
  process.exit(candidatas.length ? 4 : 0);
}

if (publicaveis.length >= 2) {
  const categoriasRodada = new Set(publicaveis.map(p => String(p?.reportagem?.categoria || p?.categoria || '').trim()).filter(Boolean));
  if (categoriasRodada.size < 2) {
    console.error('[redator] Rodada bloqueada: mais de uma matéria válida, mas apenas uma editoria representada.');
    process.exit(5);
  }
}


await fs.mkdir(pendentesDir, { recursive: true });
const agora = new Date();
const carimbo = stamp(agora);
const nomeArquivo = `auto-redacao-${carimbo}.js`;
const varName = `noticiasAutoRedacao${carimbo.replace(/-/g, '')}`;
const iso = agora.toISOString();
const dia = dataLocal(agora);

const artigos = publicaveis.map((p, i) => {
  const r = p.reportagem;
  const titulo = String(r.titulo || p.titulo).trim();
  const slug = slugify(r.slug || titulo) || `noticia-${p.id}`;
  const imagem = String(r.imagem || '').trim();
  const fonteNome = String(r.fonteNome || p.fonteNome || 'Fonte principal').trim();
  const fonteUrl = String(r.fonteUrl || p.urlFonte || '').trim();
  const adicionais = fontesValidas(r.fontesAdicionais || []);
  const entidades = Array.isArray(r.entidades) ? r.entidades.slice(0, 20) : [];
  const aeo = Array.isArray(r.aeo) ? r.aeo.slice(0, 8) : [];
  const id = Number(`${carimbo.replace(/\D/g, '').slice(2)}${String(i + 1).padStart(2, '0')}`);

  return `  {\n    id: ${id},\n    pautaId: ${js(p.id)},\n    slug: ${js(slug)},\n    titulo: ${js(titulo)},\n    categoria: ${js(r.categoria || p.categoria)},\n    data: ${js(r.data || dia)},\n    imagem: ${js(imagem)},\n    resumo: ${js(r.resumo)},\n    conteudo: ${js(r.conteudo)},\n    autor: 'Redação Notícia ES',\n    fonteNome: ${js(fonteNome)},\n    fonteUrl: ${js(fonteUrl)},\n    fontesAdicionais: ${JSON.stringify(adicionais)},\n    entidades: ${JSON.stringify(entidades)},\n    aeo: ${JSON.stringify(aeo)},\n    redacaoPropria: true,\n    origemTexto: 'redacao-noticia-es',\n    automatico: true,\n    publicadoEm: ${js(iso)}\n  }`;
});

const shard = `const ${varName} = [\n${artigos.join(',\n')}\n];\nif (typeof noticias !== 'undefined') noticias.unshift(...${varName});\n`;
await fs.writeFile(path.join(raiz, nomeArquivo), shard, 'utf8');

let manifest = await fs.readFile(manifestPath, 'utf8');
const marcador = 'const noticiasAutoArquivos = [';
if (!manifest.includes(nomeArquivo)) {
  manifest = manifest.replace(marcador, `${marcador}\n  ${JSON.stringify(nomeArquivo)},`);
}
await fs.writeFile(manifestPath, manifest, 'utf8');

for (const p of publicaveis) {
  const r = p.reportagem;
  const slugPublicado = slugify(r.slug || r.titulo || p.titulo) || `noticia-${p.id}`;
  const recibo = {
    pautaId: p.id,
    slugPublicado,
    fonteUrl: String(r.fonteUrl || p.urlFonte || ''),
    publicadaEm: iso
  };
  await fs.writeFile(
    path.join(pendentesDir, `${p.id}-${carimbo}.json`),
    JSON.stringify(recibo, null, 2) + '\n',
    'utf8'
  );
}

console.log(`[redator] publicou ${publicaveis.length} reportagem(ns) completa(s) em ${nomeArquivo}.`);
