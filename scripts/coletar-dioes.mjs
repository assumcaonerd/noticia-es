import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ARQUIVO = 'pautas.json';
const STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 72;
const MAX = 6;
const MAX_PENDENTES = 80;
const USER_AGENT = 'NoticiaESBot/2.7 (+https://noticiaes.com.br)';
const LISTA = 'https://dio.es.gov.br/Noticias';
const EDICAO = 'https://dio.es.gov.br/diario-oficial';
const HOSTS = ['dio.es.gov.br', 'www.dio.es.gov.br'];
const FILTRO = /(decreto|lei\b|nomea|exonera|concurso|pol[ií]cia|assembleia|governador| interven|licita[cç]|preg[aã]o|refis|or[cç]amento|transpar[eê]ncia|di[aá]rio oficial|imprensa oficial|dio\/es)/i;

function idDaUrl(url) { return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16); }
function decodeHtml(t = '') {
  return String(t).replace(/&/g, '&').replace(/"/g, '"').replace(/&#39;|'/g, "'")
    .replace(/</g, '<').replace(/>/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}
function limpar(t = '') {
  return decodeHtml(t).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
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
function recente(d) {
  if (!d || Number.isNaN(d.getTime())) return false;
  const ms = AGORA - d;
  return ms >= -6 * 3600000 && ms <= JANELA_HORAS * 3600000;
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
function dataDaPagina(html) {
  const vals = [meta(html, 'article:published_time'), meta(html, 'date', 'name'), html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1]].filter(Boolean);
  const br = html.match(/Publicado em:\s*(\d{2})\/(\d{2})\/(\d{4})/) || html.match(/(\d{2})\/(\d{2})\/(\d{4})\s+\d{1,2}h/);
  if (br) vals.push(`${br[3]}-${br[2]}-${br[1]}T12:00:00-03:00`);
  for (const v of vals) { const d = new Date(v); if (!Number.isNaN(d.getTime())) return d; }
  return null;
}
function linksLista(html) {
  const out = []; const vistos = new Set();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < 40) {
    const titulo = limpar(m[2]);
    if (titulo.length < 18 || titulo.length > 220 || titulo.split(' ').length < 4) continue;
    let u; try { u = new URL(decodeHtml(m[1]), LISTA); } catch { continue; }
    if (!HOSTS.includes(u.hostname)) continue;
    if (!/\/Not(?:icia|ícia)\//i.test(u.pathname)) continue;
    const limpa = u.href.split('#')[0];
    if (vistos.has(limpa)) continue;
    vistos.add(limpa);
    out.push({ tituloLista: titulo, url: limpa });
  }
  return out;
}
function jaExiste(item, pautas) {
  const u = item.url.replace(/[?#].*$/, '');
  const n = item.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return pautas.some(p => String(p.urlFonte || '').replace(/[?#].*$/, '') === u || String(p.titulo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === n);
}
function ymd(d = AGORA) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

const arquivo = JSON.parse(await fs.readFile(ARQUIVO, 'utf8'));
const existentes = Array.isArray(arquivo.pautas) ? arquivo.pautas : [];
const novas = [];
const status = [];

try {
  const lista = await baixar(LISTA);
  let achados = 0;
  for (const link of linksLista(lista).slice(0, 20)) {
    if (novas.length >= MAX) break;
    try {
      const html = await baixar(link.url);
      const titulo = limpar(meta(html, 'og:title') || meta(html, 'twitter:title', 'name') || link.tituloLista);
      const resumo = limpar(meta(html, 'og:description') || meta(html, 'description', 'name') || link.tituloLista);
      const data = dataDaPagina(html);
      if (!titulo || !resumo || !recente(data)) continue;
      if (!FILTRO.test(`${titulo} ${resumo}`)) continue;
      if (jaExiste({ titulo, url: link.url }, [...existentes, ...novas])) continue;
      achados++;
      novas.push({
        id: idDaUrl(link.url),
        titulo,
        categoria: 'Política ES',
        dataFonte: data.toISOString(),
        fonteNome: 'DIO/ES - Notícias',
        urlFonte: link.url,
        resumoFonte: resumo.slice(0, 350),
        imagem: meta(html, 'og:image') || '',
        descobertaEm: AGORA.toISOString(),
        status: 'pendente',
        origem: 'diario-oficial-es'
      });
    } catch (e) {
      console.warn(`[DIO/ES] detalhe ignorado: ${e.message}`);
    }
  }
  status.push({ fonte: 'DIO/ES Notícias', ok: true, encontrados: achados });
} catch (e) {
  status.push({ fonte: 'DIO/ES Notícias', ok: false, erro: e.message });
}

try {
  const html = await baixar(EDICAO);
  const titulo = `Diário Oficial do ES — edição de ${ymd()}`;
  const item = { titulo, url: EDICAO };
  if (!jaExiste(item, [...existentes, ...novas])) {
    novas.push({
      id: idDaUrl(`${EDICAO}#${ymd()}`),
      titulo,
      categoria: 'Política ES',
      dataFonte: AGORA.toISOString(),
      fonteNome: 'DIO/ES - Edição',
      urlFonte: EDICAO,
      resumoFonte: limpar(meta(html, 'og:description') || meta(html, 'description', 'name') || 'Consulta à edição do Dia do Diário Oficial do Espírito Santo. Conferir decretos, nomeações, leis e atos do Executivo, Legislativo e Judiciário.').slice(0, 350),
      descobertaEm: AGORA.toISOString(),
      status: 'pendente',
      origem: 'diario-oficial-es-edicao'
    });
  }
  status.push({ fonte: 'DIO/ES Edição', ok: true, encontrados: 1 });
} catch (e) {
  status.push({ fonte: 'DIO/ES Edição', ok: false, erro: e.message });
}

const publicadas = existentes.filter(p => p.status === 'publicada').slice(0, 200);
const pendentes = [...novas, ...existentes.filter(p => p.status !== 'publicada')]
  .sort((a, b) => new Date(b.dataFonte || b.descobertaEm) - new Date(a.dataFonte || a.descobertaEm))
  .slice(0, MAX_PENDENTES);
const portais = [...new Set([...(arquivo.portaisPrioritarios || []), 'dio.es.gov.br'])];
await fs.writeFile(ARQUIVO, `${JSON.stringify({ ...arquivo, atualizadoEm: AGORA.toISOString(), portaisPrioritarios: portais, pautas: [...pendentes, ...publicadas] }, null, 2)}\n`, 'utf8');

try {
  const motor = JSON.parse(await fs.readFile(STATUS, 'utf8'));
  motor.dioes = { atualizadoEm: AGORA.toISOString(), novas: novas.length, fontes: status };
  await fs.writeFile(STATUS, `${JSON.stringify(motor, null, 2)}\n`, 'utf8');
} catch { /* status opcional */ }

console.log(`DIO/ES: ${novas.length} nova(s) pauta(s); ${status.filter(s => s.ok).length} fonte(s) ok.`);
