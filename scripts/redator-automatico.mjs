#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const raiz = process.cwd();
const lotePath = path.join(raiz, 'lote-redacao.json');
const manifestPath = path.join(raiz, 'auto-manifest.js');
const pendentesDir = path.join(raiz, 'publicacoes-pendentes');

function slugify(s = '') {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 110);
}
function esc(s = '') { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function js(s = '') { return JSON.stringify(String(s)); }
function stamp(d = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(d).reduce((a,x)=>(a[x.type]=x.value,a),{});
  return `${p.year}${p.month}${p.day}-${p.hour}${p.minute}${p.second}`;
}
function dataLocal(d = new Date()) { return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(d); }

const lote = JSON.parse(await fs.readFile(lotePath,'utf8'));
const candidatas = Array.isArray(lote.candidatas) ? lote.candidatas.slice(0,10) : [];
if (!candidatas.length) { console.log('Nenhuma candidata no lote.'); process.exit(0); }

await fs.mkdir(pendentesDir,{recursive:true});
const agora = new Date();
const carimbo = stamp(agora);
const nomeArquivo = `auto-redacao-${carimbo}.js`;
const varName = `noticiasAutoRedacao${carimbo.replace(/-/g,'')}`;
const iso = agora.toISOString();
const dia = dataLocal(agora);

const artigos = candidatas.map((p,i) => {
  const slug = slugify(p.titulo) || `noticia-${p.id}`;
  const resumo = String(p.resumoFonte || p.titulo || '').trim();
  const fonte = String(p.fonteNome || 'Fonte original');
  const conteudo = `<p>${esc(resumo)}</p><p>A informação foi publicada por <strong>${esc(fonte)}</strong> e entrou na fila automática do Notícia ES. A redação automática preserva os fatos disponíveis na fonte original e evita acrescentar informações que não estejam confirmadas no material coletado.</p><h2>O que se sabe até agora</h2><p>${esc(resumo)}</p><p>O assunto permanece sujeito a atualização conforme novos dados oficiais, manifestações das partes envolvidas ou informações adicionais sejam divulgadas.</p><h2>Fonte e acompanhamento</h2><p>O Notícia ES mantém o link da publicação de origem para conferência e seguirá atualizando a cobertura quando houver novidade relevante.</p>`;
  return `  {\n    id: ${Number(`${carimbo.replace(/\D/g,'').slice(2)}${String(i+1).padStart(2,'0')}`)},\n    pautaId: ${js(p.id)},\n    slug: ${js(slug)},\n    titulo: ${js(p.titulo)},\n    categoria: ${js(p.categoria)},\n    data: ${js(dia)},\n    imagem: ${js(p.imagem || '')},\n    resumo: ${js(resumo)},\n    conteudo: ${js(conteudo)},\n    autor: 'Redação Notícia ES',\n    fonteNome: ${js(fonte)},\n    fonteUrl: ${js(p.urlFonte || '')},\n    fontesAdicionais: [],\n    automatico: true,\n    publicadoEm: ${js(iso)}\n  }`;
});

const shard = `const ${varName} = [\n${artigos.join(',\n')}\n];\nif (typeof noticias !== 'undefined') noticias.unshift(...${varName});\n`;
await fs.writeFile(path.join(raiz,nomeArquivo), shard, 'utf8');

let manifest = await fs.readFile(manifestPath,'utf8');
const marcador = 'const noticiasAutoArquivos = [';
if (!manifest.includes(nomeArquivo)) manifest = manifest.replace(marcador, `${marcador}\n  ${JSON.stringify(nomeArquivo)},`);
await fs.writeFile(manifestPath, manifest, 'utf8');

for (const p of candidatas) {
  const slugPublicado = slugify(p.titulo) || `noticia-${p.id}`;
  const recibo = { pautaId:p.id, slugPublicado, publicadaEm:iso };
  await fs.writeFile(path.join(pendentesDir, `${p.id}-${carimbo}.json`), JSON.stringify(recibo,null,2)+'\n','utf8');
}
console.log(`Redator automático publicou ${candidatas.length} matéria(s) em ${nomeArquivo}.`);
