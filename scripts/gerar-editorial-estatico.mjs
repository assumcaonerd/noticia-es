#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const arquivo = process.argv[2];
if (!arquivo) throw new Error('Informe o arquivo editorial.');
const raiz = process.cwd();
const fonte = await fs.readFile(path.join(raiz, arquivo), 'utf8');
const nome = fonte.match(/const\s+(materiasEditoriais\d+)\s*=/)?.[1];
if (!nome) throw new Error('Coleção editorial não encontrada.');
const contexto = { noticias: [] };
vm.createContext(contexto);
vm.runInContext(fonte.replace(`const ${nome} =`, `globalThis.${nome} =`), contexto);
const n = contexto[nome][0];
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = `https://noticiaes.com.br/m/${n.slug}.html`;
const about = (n.entidades || []).map(e => ({ '@type': e.tipo, name: e.nome }));
const faq = (n.aeo || []).map(i => ({ '@type': 'Question', name: i.pergunta, acceptedAnswer: { '@type': 'Answer', text: i.resposta } }));
const html = `<!doctype html>
<html lang="pt-BR"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script src="/analytics.js"></script>
  <title>${esc(n.titulo)} | Notícia ES</title><meta name="description" content="${esc(n.resumo)}"><meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="theme-color" content="#0b1320"><link rel="canonical" href="${url}">
  <meta property="og:type" content="article"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Notícia ES"><meta property="og:title" content="${esc(n.titulo)}"><meta property="og:description" content="${esc(n.resumo)}"><meta property="og:url" content="${url}">
  <meta property="og:image" content="${n.imagemX || n.imagem}"><meta property="og:image:secure_url" content="${n.imagemX || n.imagem}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="${n.imagemXLargura || n.imagemLargura}"><meta property="og:image:height" content="${n.imagemXAltura || n.imagemAltura}"><meta property="og:image:alt" content="${esc(n.titulo)}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(n.titulo)}"><meta name="twitter:description" content="${esc(n.resumo)}"><meta name="twitter:image" content="${n.imagemX || n.imagem}"><meta name="twitter:image:alt" content="${esc(n.titulo)}">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', mainEntityOfPage: { '@type': 'WebPage', '@id': url }, headline: n.titulo, description: n.resumo, image: [n.imagemX || n.imagem], datePublished: n.publicadoEm, dateModified: n.publicadoEm, author: { '@type': 'Organization', name: n.autor }, publisher: { '@type': 'Organization', name: 'Notícia ES', url: 'https://noticiaes.com.br' }, articleSection: n.categoria, about, mentions: about })}</script>
  <script id="aeo-faq-schema" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq })}</script>
  <script id="breadcrumb-schema" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Notícia ES', item: 'https://noticiaes.com.br/' }, { '@type': 'ListItem', position: 2, name: n.categoria, item: 'https://noticiaes.com.br/' }, { '@type': 'ListItem', position: 3, name: n.titulo, item: url }] })}</script>
  <link rel="stylesheet" href="../estilo.css"><link rel="stylesheet" href="../imagem-policy.css"><link rel="alternate" type="application/rss+xml" title="Notícia ES RSS" href="https://noticiaes.com.br/rss.xml">
  <style>.materia-estatica{max-width:860px;margin:0 auto;padding:28px 16px}.materia-estatica h1{line-height:1.08}.materia-resumo{font-size:1.15rem}.materia-meta{opacity:.75;margin:10px 0 22px}.materia-capa{width:100%;height:auto;border-radius:8px}.materia-estatica figcaption{font-size:.82rem;font-style:italic;opacity:.75;margin-top:6px}.conteudo-materia p,.conteudo-materia li{line-height:1.72;font-size:1.08rem}.conteudo-materia h2{margin-top:30px}.aeo-resumo{margin:28px 0;padding:18px;border:1px solid #ddd;border-radius:8px}.aeo-item p{margin-top:5px}</style>
</head><body data-pagina="materia">
<header class="site-header"><div class="container header-inner"><a class="logo" href="../index.html">Notícia <span>ES</span></a><nav class="nav-principal" aria-label="Navegação principal"><ul><li><a href="../index.html">Início</a></li><li><a href="../index.html?categoria=politica-es">Política ES</a></li><li><a href="../index.html?categoria=seguranca-publica">Segurança Pública</a></li><li><a href="../index.html?categoria=politica-nacional">Política Nacional</a></li><li><a href="../index.html?categoria=economia">Economia</a></li><li><a href="../index.html?categoria=opiniao">Opinião</a></li><li><a href="../index.html?categoria=fe-e-sociedade">Fé e Sociedade</a></li></ul></nav></div></header>
<main class="materia"><article class="materia-estatica"><div class="materia-meta">${esc(n.categoria)} · ${n.data} · ${esc(n.autor)}</div><h1>${esc(n.titulo)}</h1><p class="materia-resumo"><strong>${esc(n.resumo)}</strong></p><figure><img class="materia-capa" src="${n.imagem}" alt="${esc(n.titulo)}" loading="eager" referrerpolicy="no-referrer"><figcaption>${esc(n.legendaImagem)}</figcaption></figure><div class="conteudo-materia">${n.conteudo}</div><section class="aeo-resumo" aria-labelledby="aeo-titulo"><h2 id="aeo-titulo">Em resumo</h2>${(n.aeo || []).map(i => `<div class="aeo-item"><strong>${esc(i.pergunta)}</strong><p>${esc(i.resposta)}</p></div>`).join('')}</section></article></main>
<footer class="site-footer"><div class="container"><strong>Notícia ES</strong> | política e segurança pública do Espírito Santo</div></footer></body></html>`;
await fs.writeFile(path.join(raiz, 'm', `${n.slug}.html`), html, 'utf8');
console.log(`[editorial] ${n.slug}.html gerado.`);
