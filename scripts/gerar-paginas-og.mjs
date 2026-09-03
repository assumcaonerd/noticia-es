#!/usr/bin/env node
/**
 * Gera páginas estáticas canônicas em m/{slug}.html.
 * Cada página contém a reportagem completa, OG/Twitter e JSON-LD NewsArticle.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const RAIZ = process.cwd();
const DESTINO = path.join(RAIZ, 'm');
const SITE = 'https://noticiaes.com.br';
const PAGINAS_ESPECIAIS = new Set([
  'igreja-crista-maranata-comemora-50-anos-em-sao-mateus'
]);

function escapar(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizarHtml(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<(iframe|object|embed|form)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/javascript:/gi, '');
}

function imagemAbsoluta(url = '') {
  const u = String(url || '').trim();
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return `${SITE}${u}`;
  return `${SITE}/${u.replace(/^\.\//, '')}`;
}

function ehBoaParaWhatsapp(url = '') {
  const u = String(url || '');
  if (!/^https:\/\//i.test(u)) return false;
  if (/\.svg(\?|$)/i.test(u)) return false;
  if (/(?:auto-(politica|seguranca)|placeholder|fb_marca\.png|marca[_-]?valor|logo[^/]*valor|valor[^/]*logo|default[-_]?image|og[-_]?default)/i.test(u)) return false;
  return true;
}

async function listarArquivosMateria() {
  const nomes = await fs.readdir(RAIZ);
  const editoriais = nomes.filter((n) => /^editorial(-\d+)?\.js$/.test(n));
  const automaticos = nomes.filter((n) => /^auto-redacao-\d{8}-\d{6}\.js$/.test(n));
  return ['noticias.js', ...editoriais, ...automaticos, 'opiniao.js', 'manual-gilvan.js'];
}

async function carregarOverlay() {
  const fotos = {};
  try {
    const texto = await fs.readFile(path.join(RAIZ, 'imagens-fonte.js'), 'utf8');
    const re = /["']([^"']+)["']\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(texto))) fotos[m[1]] = m[2];
  } catch {}
  return fotos;
}

async function carregarNoticias() {
  const contexto = {
    noticias: [],
    window: { noticiasAuto: [] },
    document: {
      write() {}, querySelector() { return null; }, querySelectorAll() { return []; }, getElementById() { return null; }
    }
  };
  contexto.window.window = contexto.window;
  contexto.window.document = contexto.document;

  for (const arquivo of await listarArquivosMateria()) {
    try {
      const codigo = await fs.readFile(path.join(RAIZ, arquivo), 'utf8');
      const inicioAuto = contexto.window.noticiasAuto.length;
      vm.runInNewContext(
        `${codigo}\nif (typeof noticias !== 'undefined' && Array.isArray(noticias)) { this.noticias = noticias; }`,
        contexto,
        { timeout: 12000, filename: arquivo }
      );
      const novasViaWindow = contexto.window.noticiasAuto.slice(inicioAuto);
      if (novasViaWindow.length) contexto.noticias.unshift(...novasViaWindow);
    } catch (erro) {
      if (erro.code !== 'ENOENT') console.warn(`[estatico] não leu ${arquivo}: ${erro.message}`);
    }
  }
  return Array.isArray(contexto.noticias) ? contexto.noticias : [];
}

function tipoSchema(tipo = '') {
  const permitidos = new Set(['Person', 'Organization', 'Place', 'Event', 'PoliticalParty', 'GovernmentOrganization']);
  return permitidos.has(tipo) ? tipo : 'Thing';
}

function montarNewsArticle(n, url, imagem) {
  const publicado = n.publicadoEm || (n.data ? `${n.data}T12:00:00-03:00` : new Date().toISOString());
  const entidades = Array.isArray(n.entidades) ? n.entidades
    .filter(e => e && e.nome && !/capit[aã]o\s+assum[cç][aã]o/i.test(String(e.nome)))
    .slice(0, 20)
    .map(e => ({ '@type': tipoSchema(e.tipo), name: String(e.nome) })) : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: n.titulo || 'Notícia ES',
    description: n.resumo || '',
    image: imagem ? [imagem] : undefined,
    datePublished: publicado,
    dateModified: n.publicadoEm || publicado,
    author: { '@type': 'Organization', name: n.autor || 'Redação Notícia ES' },
    publisher: { '@type': 'Organization', name: 'Notícia ES', url: SITE },
    articleSection: n.categoria || undefined,
    about: entidades.length ? entidades : undefined,
    mentions: entidades.length ? entidades : undefined
  };
}

function blocoAeo(n) {
  const itens = Array.isArray(n.aeo) ? n.aeo.filter(x => x?.pergunta && x?.resposta).filter(x => !/capit[aã]o\s+assum[cç][aã]o/i.test(`${x.pergunta} ${x.resposta}`)).slice(0, 6) : [];
  if (!itens.length) return '';
  return `<section class="aeo-resumo" aria-labelledby="aeo-titulo"><h2 id="aeo-titulo">Em resumo</h2>${itens.map(x => `<div class="aeo-item"><strong>${escapar(x.pergunta)}</strong><p>${escapar(x.resposta)}</p></div>`).join('')}</section>`;
}

function fontesHtml(n) {
  const fontes = [];
  if (/^https:\/\//i.test(String(n.fonteUrl || ''))) fontes.push({ nome: n.fonteNome || 'Fonte principal', url: n.fonteUrl });
  for (const f of Array.isArray(n.fontesAdicionais) ? n.fontesAdicionais : []) {
    const url = typeof f === 'string' ? f : f?.url;
    const nome = typeof f === 'string' ? 'Fonte adicional' : (f?.nome || 'Fonte adicional');
    if (/^https:\/\//i.test(String(url || '')) && !fontes.some(x => x.url === url)) fontes.push({ nome, url });
  }
  if (!fontes.length) return '';
  return `<section class="fontes-materia"><h2>Fontes</h2><ul>${fontes.map(f => `<li><a href="${escapar(f.url)}" rel="nofollow noopener" target="_blank">${escapar(f.nome)}</a></li>`).join('')}</ul></section>`;
}

function paginaHTML(n, imagem) {
  const titulo = n.titulo || 'Notícia ES';
  const resumo = n.resumo || 'Política e segurança pública do Espírito Santo e do Brasil.';
  const url = `${SITE}/m/${n.slug}.html`;
  const img = ehBoaParaWhatsapp(imagem) ? imagem : '';
  const schema = montarNewsArticle(n, url, img);
  const conteudo = sanitizarHtml(n.conteudo || '');
  const data = n.data || '';
  const categoria = n.categoria || 'Notícia';
  const metaImagem = img ? `\n  <meta property="og:image" content="${escapar(img)}">\n  <meta property="og:image:secure_url" content="${escapar(img)}">\n  <meta name="twitter:image" content="${escapar(img)}">` : '';

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapar(titulo)} | Notícia ES</title>
  <meta name="description" content="${escapar(resumo)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${escapar(url)}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Notícia ES">
  <meta property="og:title" content="${escapar(titulo)}">
  <meta property="og:description" content="${escapar(resumo)}">
  <meta property="og:url" content="${escapar(url)}">${metaImagem}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapar(titulo)}">
  <meta name="twitter:description" content="${escapar(resumo)}">
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  <link rel="stylesheet" href="../estilo.css">
  <link rel="stylesheet" href="../imagem-policy.css">
  <style>.materia-estatica{max-width:860px;margin:0 auto;padding:28px 16px}.materia-estatica h1{line-height:1.08}.materia-resumo{font-size:1.15rem}.materia-meta{opacity:.75;margin:10px 0 22px}.materia-capa{width:100%;height:auto;border-radius:8px}.conteudo-materia p{line-height:1.72;font-size:1.08rem}.conteudo-materia h2{margin-top:30px}.aeo-resumo{margin:28px 0;padding:18px;border:1px solid #ddd;border-radius:8px}.aeo-item p{margin-top:5px}.fontes-materia{margin-top:34px}</style>
</head>
<body data-pagina="materia">
<header class="site-header"><div class="container header-inner"><a class="logo" href="../index.html">Notícia <span>ES</span></a><nav class="nav-principal" aria-label="Navegação principal"><ul><li><a href="../index.html">Início</a></li><li><a href="../index.html?categoria=politica-es">Política ES</a></li><li><a href="../index.html?categoria=seguranca-publica">Segurança Pública</a></li><li><a href="../index.html?categoria=politica-nacional">Política Nacional</a></li><li><a href="../index.html?categoria=opiniao">Opinião</a></li><li><a href="../index.html?categoria=fe-e-sociedade">Fé e Sociedade</a></li></ul></nav></div></header>
<main class="materia"><article class="materia-estatica">
  <div class="materia-meta">${escapar(categoria)}${data ? ` · ${escapar(data)}` : ''} · ${escapar(n.autor || 'Redação Notícia ES')}</div>
  <h1>${escapar(titulo)}</h1>
  <p class="materia-resumo"><strong>${escapar(resumo)}</strong></p>
  ${img ? `<figure><img class="materia-capa" src="${escapar(img)}" alt="${escapar(titulo)}" loading="eager"><figcaption>${escapar(titulo)}</figcaption></figure>` : ''}
  ${blocoAeo(n)}
  <div class="conteudo-materia">${conteudo}</div>
  ${fontesHtml(n)}
</article></main>
<footer class="site-footer"><div class="container"><strong>Notícia ES</strong> | política e segurança pública do Espírito Santo</div></footer>
</body>
</html>\n`;
}

const overlay = await carregarOverlay();
const lista = await carregarNoticias();
await fs.mkdir(DESTINO, { recursive: true });

const vistos = new Set();
let geradas = 0;
for (const n of lista) {
  if (!n?.slug || vistos.has(n.slug)) continue;
  vistos.add(n.slug);
  if (PAGINAS_ESPECIAIS.has(n.slug)) {
    console.log(`[estatico] preserva página especial: ${n.slug}`);
    continue;
  }
  const imagem = imagemAbsoluta(overlay[n.slug] || n.imagem || '');
  await fs.writeFile(path.join(DESTINO, `${n.slug}.html`), paginaHTML(n, imagem), 'utf8');
  geradas++;
}

console.log(`[estatico] ${geradas} página(s) canônica(s) completa(s) em m/{slug}.html`);
