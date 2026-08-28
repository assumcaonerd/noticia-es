import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ARQUIVO = 'pautas.json';
const AGORA = new Date();
const JANELA_HORAS = 96;
const USER_AGENT = 'NoticiaESBot/2.3 (+https://noticiaes.com.br)';

const fontes = [
  { nome: 'Revista Oeste - Radar Flávio', url: 'https://revistaoeste.com/politica/', hosts: ['revistaoeste.com', 'www.revistaoeste.com'] },
  { nome: 'Gazeta do Povo - Radar Flávio', url: 'https://www.gazetadopovo.com.br/republica/', hosts: ['gazetadopovo.com.br', 'www.gazetadopovo.com.br'] },
  { nome: 'O Antagonista - Radar Flávio', url: 'https://oantagonista.com.br/brasil/', hosts: ['oantagonista.com.br', 'www.oantagonista.com.br'] },
  { nome: 'Correio da Manhã - Radar Flávio', url: 'https://www.correiodamanha.com.br/politica/', hosts: ['correiodamanha.com.br', 'www.correiodamanha.com.br'] }
];

const ALVO = /(fl[aá]vio\s+bolsonaro|senador\s+fl[aá]vio|candidato\s+fl[aá]vio|fl[aá]vio\s+22|filho\s+de\s+jair\s+bolsonaro)/i;
const CONTEXTO = /(elei[cç][aã]o|presid|campanha|tse|debate|pesquisa|segundo turno|primeiro turno|propaganda|jornal nacional|entrevista|pl\b|partido liberal|lula|bolsonaro)/i;

function normalizar(s='') { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
function idDaUrl(url) { return crypto.createHash('sha256').update(url).digest('hex').slice(0,16); }
function decodeHtml(s='') { return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))); }
function limparHtml(s='') { return decodeHtml(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function resumir(s='', limite=350) { const t=limparHtml(s); return t.length<=limite?t:`${t.slice(0,limite).replace(/\s+\S*$/,'')}…`; }

async function baixar(url) {
  const r = await fetch(url,{headers:{'user-agent':USER_AGENT,accept:'text/html,*/*;q=0.8'},redirect:'follow',signal:AbortSignal.timeout(18000)});
  if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.text();
}
function meta(html,chave,atributo='property') {
  const k=chave.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  for(const re of [new RegExp(`<meta[^>]+${atributo}=["']${k}["'][^>]+content=["']([^"']*)["'][^>]*>`,'i'),new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${atributo}=["']${k}["'][^>]*>`,'i')]) { const m=html.match(re); if(m) return decodeHtml(m[1]).trim(); }
  return '';
}
function dataPublicacao(html) {
  const vals=[meta(html,'article:published_time'),meta(html,'date','name'),meta(html,'DC.date','name')].filter(Boolean);
  const time=html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1]; if(time) vals.push(time);
  for(const v of vals){const d=new Date(v); if(!Number.isNaN(d.getTime())) return d;} return null;
}
function recente(d){ if(!d) return false; const idade=AGORA-d; return idade>=-6*3600000 && idade<=JANELA_HORAS*3600000; }
function links(html,fonte){
  const out=[]; const vistos=new Set(); const re=/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html)) && out.length<100){
    const texto=limparHtml(m[2]); if(texto.length<15||texto.length>260) continue;
    let u; try{u=new URL(decodeHtml(m[1]),fonte.url);}catch{continue;}
    if(!fonte.hosts.includes(u.hostname)) continue;
    if(/\/(videos?|podcasts?|autor|tag|categoria|category|busca|search|newsletter|assine|login|arquivo)(\/|$)/i.test(u.pathname)) continue;
    const limpa=u.href.split('#')[0]; if(vistos.has(limpa)) continue; vistos.add(limpa);
    if(ALVO.test(texto)) out.push({url:limpa,tituloLista:texto});
  }
  return out;
}
function jaExiste(item,pautas){
  const u=item.url.replace(/[?#].*$/,'');
  return pautas.some(p=>String(p.urlFonte||'').replace(/[?#].*$/,'')===u || normalizar(p.titulo)===normalizar(item.titulo));
}

const arquivo = JSON.parse(await fs.readFile(ARQUIVO,'utf8').catch(()=>'{"pautas":[]}'));
const existentes = Array.isArray(arquivo.pautas)?arquivo.pautas:[];
const novas=[];
for(const fonte of fontes){
  try{
    const capa=await baixar(fonte.url);
    for(const link of links(capa,fonte).slice(0,20)){
      try{
        const html=await baixar(link.url);
        const titulo=limparHtml(meta(html,'og:title')||meta(html,'twitter:title','name')||link.tituloLista);
        const resumo=resumir(meta(html,'og:description')||meta(html,'description','name')||'');
        const data=dataPublicacao(html);
        const imagem=meta(html,'og:image')||meta(html,'twitter:image','name')||'';
        const alvo=`${titulo} ${resumo}`;
        if(!ALVO.test(alvo) || !CONTEXTO.test(alvo) || !recente(data)) continue;
        const item={url:link.url,titulo}; if(jaExiste(item,[...existentes,...novas])) continue;
        novas.push({
          id:idDaUrl(link.url), titulo, categoria:'Política Nacional', dataFonte:data.toISOString(),
          fonteNome:fonte.nome, urlFonte:link.url, resumoFonte:resumo, imagemFonte:imagem, imagem,
          descobertaEm:AGORA.toISOString(), status:'pendente', radar:'Flávio Bolsonaro'
        });
      }catch(e){console.warn(`[${fonte.nome}] detalhe ignorado: ${e.message}`);}
    }
  }catch(e){console.warn(`[${fonte.nome}] fonte ignorada: ${e.message}`);}
}

if(novas.length){
  const publicadas=existentes.filter(p=>p.status==='publicada').slice(0,200);
  const pendentes=[...novas,...existentes.filter(p=>p.status!=='publicada')].sort((a,b)=>new Date(b.dataFonte||b.descobertaEm)-new Date(a.dataFonte||a.descobertaEm)).slice(0,60);
  const saida={...arquivo,atualizadoEm:AGORA.toISOString(),pautas:[...pendentes,...publicadas]};
  await fs.writeFile(ARQUIVO,`${JSON.stringify(saida,null,2)}\n`,'utf8');
}
console.log(`Radar Flávio Bolsonaro: ${novas.length} nova(s) pauta(s), todas em Política Nacional.`);
