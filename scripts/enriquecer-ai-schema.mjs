#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DIR = path.join(RAIZ, 'm');
const SITE = 'https://noticiaes.com.br';

function texto(html='') {
  return String(html)
    .replace(/<[^>]+>/g,' ')
    .replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&amp;/g,'&')
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/\s+/g,' ').trim();
}

function capturar(html,re,f=''){ const m=String(html).match(re); return m?texto(m[1]):f; }

function faqSchema(html, permitirCapitao=false) {
  const bloco = html.match(/<section class="aeo-resumo"[\s\S]*?<\/section>/i)?.[0] || '';
  if (!bloco) return null;
  const itens=[];
  const re=/<div class="aeo-item">\s*<strong>([\s\S]*?)<\/strong>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/gi;
  let m;
  while((m=re.exec(bloco))){
    const pergunta=texto(m[1]); const resposta=texto(m[2]);
    if(!pergunta||!resposta||(!permitirCapitao && /capit[aã]o\s+assum[cç][aã]o/i.test(`${pergunta} ${resposta}`))) continue;
    itens.push({ '@type':'Question', name:pergunta, acceptedAnswer:{ '@type':'Answer', text:resposta } });
  }
  return itens.length ? { '@context':'https://schema.org', '@type':'FAQPage', mainEntity:itens.slice(0,6) } : null;
}

function breadcrumbSchema(html,arquivo){
  const titulo=capturar(html,/<h1[^>]*>([\s\S]*?)<\/h1>/i,arquivo.replace(/\.html$/,''));
  const categoria=capturar(html,/<div class="materia-meta">([\s\S]*?)·/i,'Notícias');
  const url=`${SITE}/m/${arquivo}`;
  return {
    '@context':'https://schema.org','@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'Notícia ES',item:`${SITE}/`},
      {'@type':'ListItem',position:2,name:categoria,item:`${SITE}/`},
      {'@type':'ListItem',position:3,name:titulo,item:url}
    ]
  };
}

let alteradas=0;
const arquivos=(await fs.readdir(DIR)).filter(f=>f.endsWith('.html'));
for(const arquivo of arquivos){
  const caminho=path.join(DIR,arquivo);
  let html=await fs.readFile(caminho,'utf8');
  if(/<meta\s+http-equiv=["']refresh["']/i.test(html)) continue;

  html=html.replace(/\n?\s*<script id="aeo-faq-schema"[\s\S]*?<\/script>/i,'');
  html=html.replace(/\n?\s*<script id="breadcrumb-schema"[\s\S]*?<\/script>/i,'');
  if(!/rel="alternate"\s+type="application\/rss\+xml"/i.test(html)){
    html=html.replace('</head>',`  <link rel="alternate" type="application/rss+xml" title="Notícia ES RSS" href="${SITE}/rss.xml">\n</head>`);
  }
  const blocos=[];
  const permitirCapitao = arquivo === 'folha-moraes-evangelicos-capitao-assumcao-multa-ales.html';
  const faq=faqSchema(html, permitirCapitao);
  if(faq) blocos.push(`<script id="aeo-faq-schema" type="application/ld+json">${JSON.stringify(faq).replace(/</g,'\\u003c')}</script>`);
  const bc=breadcrumbSchema(html,arquivo);
  blocos.push(`<script id="breadcrumb-schema" type="application/ld+json">${JSON.stringify(bc).replace(/</g,'\\u003c')}</script>`);
  html=html.replace('</head>',`  ${blocos.join('\n  ')}\n</head>`);

  const anterior=await fs.readFile(caminho,'utf8');
  if(html!==anterior){ await fs.writeFile(caminho,html,'utf8'); alteradas++; }
}
console.log(`[ai-schema] ${alteradas} página(s) enriquecida(s) para descoberta e compreensão por buscadores/IA.`);
