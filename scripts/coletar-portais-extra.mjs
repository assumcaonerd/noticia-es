import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ARQUIVO_PAUTAS = 'pautas.json';
const AGORA = new Date();
const JANELA_HORAS = 72;
const MAX_POR_FONTE = 6;
const MAX_PAUTAS_PENDENTES = 50;
const USER_AGENT = 'NoticiaESBot/2.2 (+https://noticiaes.com.br)';

const PADRAO_POLITICA = /(elei[cç]|governo|governador|prefeit|prefeito|senado|senador|c[aâ]mara|deputad|assembleia|congresso|presid|stf|tse|ministro|partido|pol[ií]tica|mandato|candidato|vota[cç]|pec|projeto de lei|constitui[cç]|lula|bolsonaro)/i;
const PADRAO_SEGURANCA = /(pol[ií]cia|pm\b|pc\b|bombeir|pris[aã]o|preso|crime|homic[ií]dio|assassin|tr[aá]fico|drogas|opera[cç][aã]o policial|roubo|furto|tiroteio|seguran[cç]a p[uú]blica|delegacia|foragid|mandado)/i;

const fontes = [
  {
    nome: 'O Antagonista - Capa',
    url: 'https://oantagonista.com.br/',
    categoria: 'Política Nacional',
    hosts: ['oantagonista.com.br', 'www.oantagonista.com.br']
  },
  {
    nome: 'Correio da Manhã - Capa',
    url: 'https://www.correiodamanha.com.br/',
    categoria: 'Política Nacional',
    hosts: ['www.correiodamanha.com.br', 'correiodamanha.com.br']
  }
];

function normalizar(texto = '') {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function idDaUrl(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
}

function decodeHtml(texto = '') {
  return String(texto)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function limparHtml(texto = '') {
  return decodeHtml(texto).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function resumir(texto = '', limite = 350) {
  const limpo = limparHtml(texto);
  return limpo.length <= limite ? limpo : `${limpo.slice(0, limite).replace(/\s+\S*$/, '')}…`;
}

function classificar(titulo, url, padrao) {
  const alvo = `${titulo} ${url}`;
  if (PADRAO_SEGURANCA.test(alvo)) return 'Segurança Pública';
  if (PADRAO_POLITICA.test(alvo)) return 'Política Nacional';
  return padrao;
}

async function baixar(url) {
  const r = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,*/*;q=0.8' },
    redirect: 'follow',
    signal: AbortSignal.timeout(18000)
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.text();
}

function meta(html, chave, atributo = 'property') {
  const k = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const re of [
    new RegExp(`<meta[^>]+${atributo}=["']${k}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${atributo}=["']${k}["'][^>]*>`, 'i')
  ]) {
    const m = html.match(re);
    if (m) return decodeHtml(m[1]).trim();
  }
  return '';
}

function extrairData(html) {
  const candidatos = [meta(html, 'article:published_time'), meta(html, 'date', 'name'), meta(html, 'DC.date', 'name')].filter(Boolean);
  const time = html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1];
  if (time) candidatos.push(time);
  for (const valor of candidatos) {
    const d = new Date(valor);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function ehRecente(data) {
  if (!data) return false;
  const idade = AGORA.getTime() - data.getTime();
  return idade >= -6 * 3600000 && idade <= JANELA_HORAS * 3600000;
}

function linksDaCapa(html, fonte) {
  const itens = [];
  const vistos = new Set();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && itens.length < 60) {
    const texto = limparHtml(m[2]);
    if (texto.length < 25 || texto.length > 240 || texto.split(' ').length < 4) continue;
    let url;
    try { url = new URL(decodeHtml(m[1]), fonte.url); } catch { continue; }
    if (!fonte.hosts.includes(url.hostname)) continue;
    if (/\.(pdf|jpg|jpeg|png|gif|zip)$/i.test(url.pathname)) continue;
    if (/\/(autor|tag|categoria|category|busca|search|newsletter|assine|login)(\/|$)/i.test(url.pathname)) continue;
    const limpa = url.href.split('#')[0];
    if (vistos.has(limpa)) continue;
    vistos.add(limpa);
    itens.push({ tituloLista: texto, url: limpa });
  }
  return itens;
}

function similaridade(a, b) {
  const sa = new Set(normalizar(a).split(' ').filter(x => x.length > 2));
  const sb = new Set(normalizar(b).split(' ').filter(x => x.length > 2));
  if (!sa.size || !sb.size) return 0;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  return inter / Math.max(sa.size, sb.size);
}

function jaExiste(item, pautas) {
  const u = item.url.replace(/[?#].*$/, '');
  return pautas.some(p => String(p.urlFonte || '').replace(/[?#].*$/, '') === u || normalizar(p.titulo) === normalizar(item.titulo) || similaridade(p.titulo, item.titulo) >= 0.78);
}

async function lerJson() {
  try { return JSON.parse(await fs.readFile(ARQUIVO_PAUTAS, 'utf8')); }
  catch { return { atualizadoEm: null, pautas: [] }; }
}

async function principal() {
  const arquivo = await lerJson();
  const existentes = Array.isArray(arquivo.pautas) ? arquivo.pautas : [];
  const novas = [];

  for (const fonte of fontes) {
    try {
      const capa = await baixar(fonte.url);
      const links = linksDaCapa(capa, fonte);
      let adicionadas = 0;
      for (const link of links.slice(0, 20)) {
        if (adicionadas >= MAX_POR_FONTE) break;
        try {
          const pagina = await baixar(link.url);
          const titulo = limparHtml(meta(pagina, 'og:title') || meta(pagina, 'twitter:title', 'name') || link.tituloLista);
          const resumoFonte = resumir(meta(pagina, 'og:description') || meta(pagina, 'description', 'name') || link.tituloLista);
          const data = extrairData(pagina);
          if (!titulo || !resumoFonte || !ehRecente(data)) continue;
          const item = { titulo, url: link.url, resumoFonte, data, fonteNome: fonte.nome, categoria: classificar(titulo, link.url, fonte.categoria) };
          if (jaExiste(item, [...existentes, ...novas])) continue;
          novas.push({
            id: idDaUrl(item.url), titulo: item.titulo, categoria: item.categoria,
            dataFonte: item.data.toISOString(), fonteNome: item.fonteNome, urlFonte: item.url,
            resumoFonte: item.resumoFonte, descobertaEm: AGORA.toISOString(), status: 'pendente'
          });
          adicionadas++;
        } catch (e) { console.warn(`[${fonte.nome}] detalhe ignorado: ${e.message}`); }
      }
    } catch (e) { console.warn(`[${fonte.nome}] capa ignorada: ${e.message}`); }
  }

  if (!novas.length) {
    console.log('Portais extras: nenhuma pauta nova.');
    return;
  }

  const publicadas = existentes.filter(p => p.status === 'publicada').slice(0, 200);
  const pendentes = [...novas, ...existentes.filter(p => p.status !== 'publicada')]
    .sort((a, b) => new Date(b.dataFonte || b.descobertaEm) - new Date(a.dataFonte || a.descobertaEm))
    .slice(0, MAX_PAUTAS_PENDENTES);

  const portais = new Set([...(arquivo.portaisPrioritarios || []), 'oantagonista.com.br', 'correiodamanha.com.br']);
  const saida = {
    ...arquivo,
    atualizadoEm: AGORA.toISOString(),
    portaisPrioritarios: [...portais],
    pautas: [...pendentes, ...publicadas]
  };
  await fs.writeFile(ARQUIVO_PAUTAS, `${JSON.stringify(saida, null, 2)}\n`, 'utf8');
  console.log(`Portais extras: ${novas.length} nova(s) pauta(s).`);
}

principal().catch(e => { console.error(e); process.exitCode = 1; });
