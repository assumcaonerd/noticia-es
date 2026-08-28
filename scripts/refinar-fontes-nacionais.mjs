import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ARQUIVO = 'pautas.json';
const AGORA = new Date();
const MAX_PENDENTES = 50;
const USER_AGENT = 'NoticiaESBot/2.3 (+https://noticiaes.com.br)';

const FONTES = [
  {
    nome: 'Revista Oeste - Política',
    url: 'https://revistaoeste.com/politica/',
    hosts: ['revistaoeste.com', 'www.revistaoeste.com'],
    categoria: 'Política Nacional'
  },
  {
    nome: 'Gazeta do Povo - Últimas Notícias',
    url: 'https://www.gazetadopovo.com.br/ultimas-noticias/',
    hosts: ['gazetadopovo.com.br', 'www.gazetadopovo.com.br'],
    categoria: 'Política Nacional'
  }
];

function normalizar(t = '') {
  return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function idDaUrl(url) { return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16); }
function limparHtml(t = '') { return String(t).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
function meta(html, chave, atributo='property') {
  const k = chave.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const regs = [new RegExp(`<meta[^>]+${atributo}=["']${k}["'][^>]+content=["']([^"']*)["'][^>]*>`,'i'),new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${atributo}=["']${k}["'][^>]*>`,'i')];
  for (const re of regs) { const m = html.match(re); if (m) return limparHtml(m[1]); }
  return '';
}
function dataPublicacao(html) {
  const vals = [meta(html,'article:published_time'), meta(html,'date','name'), html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1]].filter(Boolean);
  for (const v of vals) { const d = new Date(v); if (!Number.isNaN(d.getTime())) return d; }
  return null;
}
function recente(d) { if (!d) return false; const ms = AGORA - d; return ms >= -6*3600000 && ms <= 72*3600000; }
async function baixar(url) {
  const r = await fetch(url,{headers:{'user-agent':USER_AGENT,accept:'text/html,*/*;q=0.8'},redirect:'follow',signal:AbortSignal.timeout(18000)});
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.text();
}
function ehLixoOeste(titulo, url) {
  const p = new URL(url).pathname;
  return p.startsWith('/videos/') || p.startsWith('/page/') || /^arquivos?\b/i.test(titulo) || /assista ao (notici[aá]rio|programa)/i.test(titulo);
}
function ehConteudoEditorialGazeta(titulo, url) {
  const p = new URL(url).pathname;
  if (/\/(opiniao|artigo|colunistas?|blogs?)\//i.test(p)) return false;
  if (/^(artigo|podcast|cafe com a gazeta)$/i.test(titulo.trim())) return false;
  return /\/(politica|eleicoes|republica|brasil|economia|mundo)\//i.test(p) || /(stf|tse|congresso|senado|camara|elei[cç]|governo|lula|bolsonaro|ministro|deputad|senador|presid)/i.test(titulo);
}
function links(html, fonte) {
  const out=[]; const vistos=new Set(); const re=/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while ((m=re.exec(html)) && out.length<80) {
    const titulo=limparHtml(m[2]); if (titulo.length<20 || titulo.length>220 || titulo.split(' ').length<4) continue;
    let u; try { u=new URL(m[1],fonte.url); } catch { continue; }
    if (!fonte.hosts.includes(u.hostname)) continue;
    const limpa=u.href.split('#')[0]; if (vistos.has(limpa)) continue;
    if (fonte.nome.startsWith('Revista Oeste') && ehLixoOeste(titulo,limpa)) continue;
    if (fonte.nome.startsWith('Gazeta do Povo') && !ehConteudoEditorialGazeta(titulo,limpa)) continue;
    vistos.add(limpa); out.push({tituloLista:titulo,url:limpa});
  }
  return out;
}
function jaExiste(item,pautas){ const u=item.url.replace(/[?#].*$/,''); return pautas.some(p=>String(p.urlFonte||'').replace(/[?#].*$/,'')===u || normalizar(p.titulo)===normalizar(item.titulo)); }

const arquivo = JSON.parse(await fs.readFile(ARQUIVO,'utf8'));
let pautas = Array.isArray(arquivo.pautas) ? arquivo.pautas : [];

// Limpeza de ruído já coletado da Oeste e remoção residual do ES Hoje entre pendentes.
pautas = pautas.filter(p => {
  if (p.status === 'publicada') return true;
  if (/eshoje\.com\.br/i.test(p.urlFonte || '') || /ES Hoje/i.test(p.fonteNome || '')) return false;
  if (/Revista Oeste/i.test(p.fonteNome || '') && ehLixoOeste(p.titulo || '', p.urlFonte || 'https://revistaoeste.com/')) return false;
  return true;
});

const novas=[];
for (const fonte of FONTES) {
  try {
    const capa=await baixar(fonte.url);
    for (const link of links(capa,fonte).slice(0,30)) {
      if (novas.filter(n=>n.fonteNome===fonte.nome).length>=6) break;
      try {
        const html=await baixar(link.url);
        const titulo=meta(html,'og:title') || meta(html,'twitter:title','name') || link.tituloLista;
        if (fonte.nome.startsWith('Revista Oeste') && ehLixoOeste(titulo,link.url)) continue;
        if (fonte.nome.startsWith('Gazeta do Povo') && !ehConteudoEditorialGazeta(titulo,link.url)) continue;
        const d=dataPublicacao(html); if (!recente(d)) continue;
        const resumo=meta(html,'og:description') || meta(html,'description','name') || link.tituloLista;
        const imagem=meta(html,'og:image') || meta(html,'twitter:image','name') || '';
        const item={titulo,url:link.url}; if (jaExiste(item,[...pautas,...novas])) continue;
        novas.push({id:idDaUrl(link.url),titulo,categoria:fonte.categoria,dataFonte:d.toISOString(),fonteNome:fonte.nome,urlFonte:link.url,resumoFonte:resumo,imagem,imagemFonte:imagem,descobertaEm:AGORA.toISOString(),status:'pendente'});
      } catch(e){ console.warn(`[${fonte.nome}] detalhe ignorado: ${e.message}`); }
    }
  } catch(e){ console.warn(`[${fonte.nome}] lista ignorada: ${e.message}`); }
}

const publicadas=pautas.filter(p=>p.status==='publicada').slice(0,200);
const pendentes=[...novas,...pautas.filter(p=>p.status!=='publicada')].sort((a,b)=>new Date(b.dataFonte||b.descobertaEm)-new Date(a.dataFonte||a.descobertaEm)).slice(0,MAX_PENDENTES);
const portais=['agazeta.com.br','folhavitoria.com.br','tribunaonline.com.br','revistaoeste.com','gazetadopovo.com.br','oantagonista.com.br','correiodamanha.com.br'];
await fs.writeFile(ARQUIVO,JSON.stringify({...arquivo,atualizadoEm:AGORA.toISOString(),portaisPrioritarios:portais,pautas:[...pendentes,...publicadas]},null,2)+'\n','utf8');
console.log(`Refino nacional concluído: ${novas.length} nova(s) pauta(s).`);
