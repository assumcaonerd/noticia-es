import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ARQUIVO = 'pautas.json';
const STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 72;
const MAX_POR_FONTE = 4;
const MAX_PENDENTES = 80;
const USER_AGENT = 'NoticiaESBot/2.5 (+https://noticiaes.com.br)';

const FILTRO = /(elei[cç]|governo|governador|prefeit|senado|senador|c[aâ]mara|deputad|assembleia|ales|congresso|presid|stf|tse|ministro|partido|pol[ií]tica|candidato|vota[cç]|pol[ií]cia|pm\b|pc\b|bombeir|pris[aã]o|preso|crime|homic[ií]dio|tr[aá]fico|opera[cç][aã]o|seguran[cç]a|delegacia|lula|bolsonaro|ferraco|ferraço|pazolini|helder|casagrande|vit[oó]ria|capixaba|esp[ií]rito santo|\bes\b)/i;
const LIXO = /(ao vivo|live:|comiss[aã]o de finanças|comiss[aã]o de justiça|tbt\b|vinheta|shorts?$|#shorts)/i;

const youtube = [
  { nome: 'YouTube A Gazeta', id: 'UCNVrdbEJ_n7EPoBKkNVKvfg', categoria: 'Política ES' },
  { nome: 'YouTube Folha Vitória', id: 'UCFLcgrpr6U1fbOaIL7uu92Q', categoria: 'Política ES' },
  { nome: 'YouTube ALES', id: 'UCWooZZntqkVthzzjdHq0VRg', categoria: 'Política ES' },
  { nome: 'YouTube Polícia Civil ES', id: 'UC-Zf4EPph3mBKC1nx8CTfWg', categoria: 'Segurança Pública' },
  { nome: 'YouTube PM Ambiental ES', id: 'UCDNHspOOLjls6kYE2wnk1Kg', categoria: 'Segurança Pública' }
];

const youtubeUser = [
  { nome: 'YouTube Bombeiros ES', user: 'bombeiromilitares', categoria: 'Segurança Pública' },
  { nome: 'YouTube ALES (legado)', user: 'alescomunicacao', categoria: 'Política ES' }
];

const twitter = [
  { nome: 'X Governo ES', handle: 'GovernoES', categoria: 'Política ES' },
  { nome: 'X A Gazeta', handle: 'agazetaes', categoria: 'Política ES' },
  { nome: 'X Folha Vitória', handle: 'folhavitoria', categoria: 'Política ES' },
  { nome: 'X ALES', handle: 'ALES_ES', categoria: 'Política ES' }
];

function idDaUrl(url) { return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16); }
function decodeHtml(t = '') {
  return String(t).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&/g, '&').replace(/"/g, '"').replace(/&#39;|'/g, "'")
    .replace(/</g, '<').replace(/>/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}
function limpar(t = '') { return decodeHtml(t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function recente(d) {
  if (!d || Number.isNaN(d.getTime())) return false;
  const ms = AGORA - d;
  return ms >= -6 * 3600000 && ms <= JANELA_HORAS * 3600000;
}
function tag(bloco, nome) {
  const m = bloco.match(new RegExp(`<${nome}(?:\\s[^>]*)?>([\\s\\S]*?)</${nome}>`, 'i'));
  return decodeHtml(m?.[1] || '').trim();
}
async function baixar(url) {
  const r = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'application/atom+xml,application/rss+xml,application/xml,text/xml,*/*;q=0.8' },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000)
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.text();
}
function parseFeed(xml, fonte) {
  const blocos = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const itens = [];
  for (const bloco of blocos.slice(0, 15)) {
    const titulo = limpar(tag(bloco, 'title'));
    let url = limpar(tag(bloco, 'link'));
    if (!url) url = decodeHtml(bloco.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || '');
    const desc = tag(bloco, 'summary') || tag(bloco, 'description') || tag(bloco, 'media:description') || titulo;
    const dataTxt = tag(bloco, 'published') || tag(bloco, 'updated') || tag(bloco, 'pubDate');
    const data = new Date(dataTxt);
    if (!titulo || !url || !recente(data)) continue;
    if (LIXO.test(titulo)) continue;
    if (!FILTRO.test(`${titulo} ${desc}`)) continue;
    itens.push({
      titulo,
      url,
      resumoFonte: limpar(desc).slice(0, 350),
      data,
      fonteNome: fonte.nome,
      categoria: fonte.categoria
    });
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

async function coletar(fonte, url) {
  try {
    const xml = await baixar(url);
    const itens = parseFeed(xml, fonte).slice(0, MAX_POR_FONTE);
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
        origem: 'rede-social-local'
      });
    }
    status.push({ fonte: fonte.nome, ok: true, encontrados: itens.length });
  } catch (e) {
    status.push({ fonte: fonte.nome, ok: false, erro: e.message });
  }
}

for (const fonte of youtube) {
  await coletar(fonte, `https://www.youtube.com/feeds/videos.xml?channel_id=${fonte.id}`);
}
for (const fonte of youtubeUser) {
  await coletar(fonte, `https://www.youtube.com/feeds/videos.xml?user=${fonte.user}`);
}
for (const fonte of twitter) {
  await coletar(fonte, `https://rsshub.app/twitter/user/${fonte.handle}`);
}

const publicadas = existentes.filter(p => p.status === 'publicada').slice(0, 200);
const pendentes = [...novas, ...existentes.filter(p => p.status !== 'publicada')]
  .sort((a, b) => new Date(b.dataFonte || b.descobertaEm) - new Date(a.dataFonte || a.descobertaEm))
  .slice(0, MAX_PENDENTES);

const portais = [...new Set([...(arquivo.portaisPrioritarios || []), 'youtube.com', 'x.com', 'twitter.com'])];
await fs.writeFile(ARQUIVO, `${JSON.stringify({ ...arquivo, atualizadoEm: AGORA.toISOString(), portaisPrioritarios: portais, pautas: [...pendentes, ...publicadas] }, null, 2)}\n`, 'utf8');

try {
  const motor = JSON.parse(await fs.readFile(STATUS, 'utf8'));
  motor.redesLocais = { atualizadoEm: AGORA.toISOString(), novas: novas.length, fontes: status };
  await fs.writeFile(STATUS, `${JSON.stringify(motor, null, 2)}\n`, 'utf8');
} catch { /* status opcional */ }

console.log(`Redes locais: ${novas.length} nova(s) pauta(s); ${status.filter(s => s.ok).length} fonte(s) ok.`);
