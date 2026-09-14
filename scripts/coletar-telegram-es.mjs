import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ARQUIVO = 'pautas.json';
const STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 72;
const MAX_POR_CANAL = 5;
const MAX_PENDENTES = 80;
const USER_AGENT = 'NoticiaESBot/2.6 (+https://noticiaes.com.br)';

const CANAIS = [
  { nome: 'Telegram Folha Vitória', handle: 'folhavitoriaoficial', categoria: 'Política ES' },
  { nome: 'Telegram Tribuna Online', handle: 'tribunaonlinees', categoria: 'Política ES' }
];

const FILTRO = /(elei[cç]|governo|governador|prefeit|deputad|assembleia|ales|senado|c[aâ]mara|pol[ií]tica|candidato|partido|stf|tse|pol[ií]cia|pm\b|pc\b|bombeir|pris[aã]o|preso|crime|homic[ií]dio|tr[aá]fico|opera[cç][aã]o|seguran[cç]a|delegacia|lula|bolsonaro|ferraco|ferraço|pazolini|helder|casagrande|vit[oó]ria|serra|vila velha|cariacica|capixaba|esp[ií]rito santo)/i;
const LIXO = /(ao vivo\|assista agora|cupom|concorra|assine|whatsapp.com\/channel|siga o canal)/i;

function idDaUrl(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
}
function decodeHtml(t = '') {
  return String(t)
    .replace(/&/g, '&').replace(/"/g, '"').replace(/&#39;|'/g, "'")
    .replace(/</g, '<').replace(/>/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}
function limpar(t = '') {
  return decodeHtml(t).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function recente(d) {
  if (!d || Number.isNaN(d.getTime())) return false;
  const ms = AGORA - d;
  return ms >= -6 * 3600000 && ms <= JANELA_HORAS * 3600000;
}
async function baixar(url) {
  const r = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8' },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000)
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.text();
}
function postsDoHtml(html, canal) {
  const blocos = html.split(/class="tgme_widget_message[_\s]/).slice(1);
  const itens = [];
  for (const bloco of blocos) {
    const dataTxt = bloco.match(/datetime="([^"]+)"/)?.[1];
    const data = dataTxt ? new Date(dataTxt) : null;
    if (!recente(data)) continue;
    const permalink = bloco.match(/href="(https:\/\/t\.me\/[^"]+)"/)?.[1]
      || `https://t.me/${canal.handle}`;
    const textoHtml = bloco.match(/class="tgme_widget_message_text[^" ]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
    const texto = limpar(textoHtml);
    if (texto.length < 40 || LIXO.test(texto)) continue;
    if (!FILTRO.test(texto)) continue;
    const linkMateria = decodeHtml(textoHtml.match(/href="(https?:\/\/[^"]+)"/)?.[1] || '');
    const titulo = texto.split(/\s+/).slice(0, 22).join(' ');
    itens.push({
      titulo: titulo.length > 140 ? `${titulo.slice(0, 137)}\u2026` : titulo,
      url: linkMateria || permalink,
      resumoFonte: texto.slice(0, 350),
      data,
      fonteNome: canal.nome,
      categoria: /pol[ií]cia|pris[aã]o|crime|homic|tr[aá]fico|bombeir|opera[cç][aã]o/i.test(texto) ? 'Segurança Pública' : canal.categoria
    });
  }
  return itens;
}
function parseRss(xml, canal) {
  const blocos = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  const itens = [];
  for (const bloco of blocos) {
    const titulo = limpar(bloco.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
    let url = limpar(bloco.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '');
    if (!url) url = bloco.match(/<link[^>]+href="([^"]+)"/i)?.[1] || '';
    const desc = limpar(bloco.match(/<(?:description|summary)[^>]*>([\s\S]*?)<\/(?:description|summary)>/i)?.[1] || titulo);
    const data = new Date(bloco.match(/<(?:pubDate|published|updated)[^>]*>([\s\S]*?)<\//i)?.[1] || '');
    if (!titulo || !url || !recente(data) || LIXO.test(titulo) || !FILTRO.test(`${titulo} ${desc}`)) continue;
    itens.push({ titulo, url, resumoFonte: desc.slice(0, 350), data, fonteNome: canal.nome, categoria: canal.categoria });
  }
  return itens;
}
function jaExiste(item, pautas) {
  const u = item.url.replace(/[?#].*$/, '');
  const n = item.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return pautas.some(p => String(p.urlFonte || '').replace(/[?#].*$/, '') === u || String(p.titulo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === n);
}

const arquivo = JSON.parse(await fs.readFile(ARQUIVO, 'utf8'));
const existentes = Array.isArray(arquivo.pautas) ? arquivo.pautas : [];
const novas = [];
const status = [];

for (const canal of CANAIS) {
  let itens = [];
  try {
    const html = await baixar(`https://t.me/s/${canal.handle}`);
    itens = postsDoHtml(html, canal);
  } catch (e) {
    try {
      const xml = await baixar(`https://rsshub.app/telegram/channel/${canal.handle}`);
      itens = parseRss(xml, canal);
    } catch (e2) {
      status.push({ fonte: canal.nome, ok: false, erro: `${e.message} | ${e2.message}` });
      continue;
    }
  }
  itens = itens.slice(0, MAX_POR_CANAL);
  for (const item of itens) {
    if (jaExiste(item, [...existentes, ...novas])) continue;
    novas.push({
      id: idDaUrl(item.url),
      titulo: item.titulo,
      categoria: item.categoria,
      dataFonte: item.data.toISOString(),
      fonteNome: item.fonteNome,
      urlFonte: item.url,
      resumoFonte: item.resumoFonte,
      descobertaEm: AGORA.toISOString(),
      status: 'pendente',
      origem: 'telegram-es'
    });
  }
  status.push({ fonte: canal.nome, ok: true, encontrados: itens.length });
}

const publicadas = existentes.filter(p => p.status === 'publicada').slice(0, 200);
const pendentes = [...novas, ...existentes.filter(p => p.status !== 'publicada')]
  .sort((a, b) => new Date(b.dataFonte || b.descobertaEm) - new Date(a.dataFonte || a.descobertaEm))
  .slice(0, MAX_PENDENTES);
const portais = [...new Set([...(arquivo.portaisPrioritarios || []), 't.me'])];
await fs.writeFile(ARQUIVO, `${JSON.stringify({ ...arquivo, atualizadoEm: AGORA.toISOString(), portaisPrioritarios: portais, pautas: [...pendentes, ...publicadas] }, null, 2)}\n`, 'utf8');

try {
  const motor = JSON.parse(await fs.readFile(STATUS, 'utf8'));
  motor.telegramEs = { atualizadoEm: AGORA.toISOString(), novas: novas.length, fontes: status };
  await fs.writeFile(STATUS, `${JSON.stringify(motor, null, 2)}\n`, 'utf8');
} catch { /* status opcional */ }

console.log(`Telegram ES: ${novas.length} nova(s) pauta(s); ${status.filter(s => s.ok).length} canal(is) ok.`);
