import fs from 'node:fs/promises';

const ARQUIVO = 'pautas.json';
const UA = 'NoticiaESBot/2.3 (+https://noticiaes.com.br)';

function decode(s='') { return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))); }
function meta(html,key,attr='property') {
  const k=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  for (const re of [new RegExp(`<meta[^>]+${attr}=["']${k}["'][^>]+content=["']([^"']*)["']`,'i'),new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${k}["']`,'i')]) { const m=html.match(re); if(m) return decode(m[1]).trim(); }
  return '';
}
function valida(url='') { return /^https?:\/\//i.test(url) && !/(logo|favicon|sprite|placeholder|placehold\.co|default[-_]?image|avatar|tracking|1x1|pixel\.gif|\/icons?\/)/i.test(url); }
function imagem(html,base) {
  const c=[meta(html,'og:image'),meta(html,'og:image:secure_url'),meta(html,'og:image:url'),meta(html,'twitter:image','name'),meta(html,'twitter:image:src','name')].filter(Boolean);
  for(const raw of c){ try { const u=new URL(raw,base).href; if(valida(u)) return u; } catch {} }
  return '';
}
async function baixar(url){ const r=await fetch(url,{headers:{'user-agent':UA,accept:'text/html,*/*;q=0.8'},redirect:'follow',signal:AbortSignal.timeout(15000)}); if(!r.ok) throw new Error(String(r.status)); return r.text(); }

const arquivo=JSON.parse(await fs.readFile(ARQUIVO,'utf8'));
let alteradas=0;
for(const p of arquivo.pautas || []){
  if(!p.urlFonte || p.imagemFonte) continue;
  try { const html=await baixar(p.urlFonte); const img=imagem(html,p.urlFonte); if(img){ p.imagemFonte=img; p.imagemOrigem='fonte'; alteradas++; } else { p.imagemFonte=null; p.imagemOrigem='capa-categoria'; } }
  catch { if(!('imagemFonte' in p)){ p.imagemFonte=null; p.imagemOrigem='capa-categoria'; } }
}
arquivo.politicaImagem='Toda matéria nova do motor usa imagemFonte extraída da publicação original. Na ausência de foto válida, usar exclusivamente a capa da categoria. É proibido inventar, gerar ou substituir por retrato de pessoa.';
await fs.writeFile(ARQUIVO,JSON.stringify(arquivo,null,2)+'\n','utf8');
console.log(`Imagens de fonte enriquecidas: ${alteradas}`);
