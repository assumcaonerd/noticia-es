#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DIR = path.join(RAIZ, 'm');
const SITE = 'https://noticiaes.com.br';

function esc(s='') { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }
function extrair(html,re,f=''){ const m=String(html).match(re); return m?m[1]:f; }
function limpar(s=''){ return String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }

const arquivos = (await fs.readdir(DIR)).filter(f=>f.endsWith('.html'));
const itens=[];
for(const arquivo of arquivos){
  const html=await fs.readFile(path.join(DIR,arquivo),'utf8');
  if(/<meta\s+http-equiv=["']refresh["']/i.test(html)) continue;
  const canonical=extrair(html,/<link\s+rel="canonical"\s+href="([^"]+)"/i,`${SITE}/m/${arquivo}`);
  if(canonical!==`${SITE}/m/${arquivo}`) continue;
  const titulo=extrair(html,/<meta\s+property="og:title"\s+content="([^"]*)"/i,arquivo.replace(/\.html$/,''));
  const desc=extrair(html,/<meta\s+name="description"\s+content="([^"]*)"/i,'');
  const pub=extrair(html,/"datePublished":"([^"]+)"/i,'');
  itens.push({canonical,titulo,desc,pub});
}
itens.sort((a,b)=>String(b.pub).localeCompare(String(a.pub)));
const recentes=itens.slice(0,50);
const rss=`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Notícia ES</title><link>${SITE}/</link><description>Política, eleições e segurança pública do Espírito Santo e do Brasil.</description><language>pt-BR</language>${recentes.map(i=>`<item><title>${esc(i.titulo)}</title><link>${esc(i.canonical)}</link><guid isPermaLink="true">${esc(i.canonical)}</guid>${i.pub?`<pubDate>${esc(new Date(i.pub).toUTCString())}</pubDate>`:''}<description>${esc(limpar(i.desc))}</description></item>`).join('')}</channel></rss>\n`;
await fs.writeFile(path.join(RAIZ,'rss.xml'),rss,'utf8');

const llms=`# Notícia ES\n\nPortal jornalístico brasileiro com foco em política, eleições e segurança pública do Espírito Santo e do Brasil.\n\n## Fontes de descoberta\n- Site: ${SITE}/\n- Sitemap: ${SITE}/sitemap.xml\n- Google News sitemap: ${SITE}/sitemap-news.xml\n- RSS: ${SITE}/rss.xml\n\n## Matérias recentes\n${recentes.map(i=>`- [${i.titulo}](${i.canonical})${i.desc?`: ${limpar(i.desc)}`:''}`).join('\n')}\n\n## Política editorial técnica\nAs páginas canônicas incluem título, resumo, data, autoria, imagem, corpo completo, dados estruturados NewsArticle e, quando disponível, bloco AEO de perguntas e respostas.\n`;
await fs.writeFile(path.join(RAIZ,'llms.txt'),llms,'utf8');
console.log(`[discovery] rss.xml e llms.txt gerados com ${recentes.length} matéria(s).`);
