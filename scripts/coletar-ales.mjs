import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ARQUIVO = 'pautas.json';
const STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 72;
const MAX = 8;
const MAX_PENDENTES = 80;
const USER_AGENT = 'NoticiaESBot/2.6 (+https://noticiaes.com.br)';
const LISTA = 'https://www.al.es.gov.br/Comunicacao/Noticias';
const HOSTS = ['www.al.es.gov.br', 'al.es.gov.br'];

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
function linksLista(html) {
  const out = []; const vistos = new Set();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < 40) {
    const titulo = limpar(m[2]);
    if (titulo.length < 20 || titulo.length > 220 || titulo.split(' ').length < 4) continue;
    let u; try { u = new URL(decodeHtml(m[1]), LISTA); } catch { continue; }
    if (!HOSTS.includes(u.hostname)) continue;
    if (!/\/(Noticia|Comunicacao\/Noticias|Noticias)\//i.test(u.pathname) && !/\/Noticia\//i.test(u.pathname)) continue;
    const limpa = u.href.split('#')[0];
    if (vistos.has(limpa)) continue;
    vistos.add(limpa);
    out.push({ tituloLista: titulo, url: limpa });
  }
  return out;
}
function dataDaPagina(html) {
  const vals = [meta(html, 'article:published_time'), meta(html, 'date', 'name'), html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1]].filter(Boolean);
  const br = html.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) vals.push(`${br[3]}-${br[2]}-${br[1]}T12:00:00-03:00`);
  for (const v of vals) { const d = new Date(v); if (!Number.isNaN(d.getTime())) return d; }
  return null;
}
function jaExiste(item, pautas) {
  const u = item.url.replace(/[?#].*$/, '');
  const n = item.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return pautas.some(p => String(p.urlFonte || '').replace(/[?#].*$/, '') === u || String(p.titulo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === n);
}

const arquivo = JSON.parse(await fs.readFile(ARQUIVO, 'utf8'));
const existentes = Array.isArray(arquivo.pautas) ? arquivo.pautas : [];
const novas = [];
let erro = null;
let encontrados = 0;

try {
  const lista = await baixar(LISTA);
  for (const link of linksLista(lista).slice(0, 20)) {
    if (novas.length >= MAX) break;
    try {
      const html = await baixar(link.url);
      const titulo = limpar(meta(html, 'og:title') || meta(html, 'twitter:title', 'name') || link.tituloLista);
      const resumo = limpar(meta(html, 'og:description') || meta(html, 'description', 'name') || link.tituloLista);
      const data = dataDaPagina(html);
      const imagem = meta(html, 'og:image') || '';
      if (!titulo || !resumo || !recente(data)) continue;
      const item = { titulo, url: link.url };
      if (jaExiste(item, [...existentes, ...novas])) continue;
      encontradas++;
      novas.push({
        id: idDaUrl(link.url),
        titulo,
        categoria: 'Política ES',
        dataFonte: data.toISOString(),
        fonteNome: 'ALES - Notícias',
        urlFonte: link.url,
        resumoFonte: resumo.slice(0, 350),
        imagem,
        descobertaEm: AGORA.toISOString(),
        status: 'pendente',
        origem: 'ales-oficial'
      });
    } catch (e) {
      console.warn(`[ALES] detalhe ignorado: ${e.message}`);
    }
  }
  encontrados = novas.length;
} catch (e) {
  erro = e.message;
}

const publicadas = existentes.filter(p => p.status === 'publicada').slice(0, 200);
const pendentes = [...novas, ...existentes.filter(p => p.status !== 'publicada')]
  .sort((a, b) => new Date(b.dataFonte || b.descobertaEm) - new Date(a.dataFonte || a.descobertaEm))
  .slice(0, MAX_PENDENTES);
const portais = [...new Set([...(arquivo.portaisPrioritarios || []), 'al.es.gov.br'])];
await fs.writeFile(ARQUIVO, `${JSON.stringify({ ...arquivo, atualizadoEm: AGORA.toISOString(), portaisPrioritarios: portais, pautas: [...pendentes, ...publicadas] }, null, 2)}\n`, 'utf8');

try {
  const motor = JSON.parse(await fs.readFile(STATUS, 'utf8'));
  motor.ales = { atualizadoEm: AGORA.toISOString(), ok: !erro, erro, novas: novas.length, encontrados };
  await fs.writeFile(STATUS, `${JSON.stringify(motor, null, 2)}\n`, 'utf8');
} catch { /* status opcional */ }

console.log(erro ? `ALES: falhou (${erro})` : `ALES: ${novas.length} nova(s) pauta(s).`);
