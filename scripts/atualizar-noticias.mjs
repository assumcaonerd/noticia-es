import fs from 'node:fs/promises';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { resolverImagem, ehImagemDeFonte, extrairImagemFonte } from './resolver-imagem.mjs';

const ARQUIVO_NOTICIAS = 'noticias.js';
const ARQUIVO_STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 96;
const MAX_NOVAS_POR_RODADA = 8;
const MAX_POR_FONTE = 2;
const USER_AGENT = 'NoticiaESBot/2.2 (+https://noticiaes.com.br)';

const fontesHtml = [
  { nome: 'A Gazeta - Política', url: 'https://www.agazeta.com.br/es/politica', categoria: 'Política ES', hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Política', url: 'https://www.folhavitoria.com.br/politica/', categoria: 'Política ES', hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'A Gazeta - Polícia', url: 'https://www.agazeta.com.br/es/policia', categoria: 'Segurança Pública', hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Polícia', url: 'https://www.folhavitoria.com.br/policia/', categoria: 'Segurança Pública', hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'SESP-ES', url: 'https://sesp.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['sesp.es.gov.br'] },
  { nome: 'Polícia Civil do ES', url: 'https://pc.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['pc.es.gov.br'] }
];

const fontesRss = [
  { nome: 'Senado Notícias', url: 'https://www12.senado.leg.br/noticias/feed/todasnoticias', categoria: 'Política Nacional', filtroTitulo: /(elei[cç]|senado|c[âa]mara|congresso|governo|presid|stf|seguran[cç]a|pec|projeto|pol[ií]tica)/i },
  { nome: 'Agência Brasil - Política', url: 'https://agenciabrasil.ebc.com.br/rss/politica/feed.xml', categoria: 'Política Nacional' }
];

function normalizar(t = '') { return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function slugificar(t = '') { return normalizar(t).replace(/\s+/g, '-').slice(0, 120) || 'noticia'; }
function hashCurto(t) { return crypto.createHash('sha256').update(t).digest('hex').slice(0, 8); }
function idDaUrl(url) {
  const hex = crypto.createHash('sha256').update(url).digest('hex').slice(0, 12);
  return Number(BigInt(`0x${hex}`) % 800000000000n + 100000000000n);
}
function decodeHtml(texto = '') {
  const mapa = { '&': '&', '"': '"', '&#39;': "'", ''': "'", '<': '<', '>': '>', '&nbsp;': ' ' };
  return String(texto).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&(amp|quot|#39|apos|lt|gt|nbsp);/g, m => mapa[m] || m).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}
function limparHtml(texto = '') { return decodeHtml(texto).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function escaparHtml(texto = '') { return String(texto).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"'); }
function resumir(texto = '', limite = 320) {
  const limpo = limparHtml(texto);
  if (limpo.length <= limite) return limpo;
  const cortado = limpo.slice(0, limite + 1);
  const i = cortado.lastIndexOf(' ');
  return `${cortado.slice(0, i > limite * 0.7 ? i : limite).trim()}…`;
}
async function baixar(url) {
  const r = await fetch(url, { headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8' }, redirect: 'follow', signal: AbortSignal.timeout(18000) });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.text();
}
function meta(html, chave, atributo = 'property') {
  const e = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const padroes = [new RegExp(`<meta[^>]+${atributo}=["']${e}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'), new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${atributo}=["']${e}["'][^>]*>`, 'i')];
  for (const re of padroes) { const m = html.match(re); if (m) return decodeHtml(m[1]).trim(); }
  return '';
}
function extrairData(html) {
  const cands = [meta(html, 'article:published_time'), meta(html, 'date', 'name'), html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1]].filter(Boolean);
  for (const v of cands) { const d = new Date(v); if (!Number.isNaN(d.getTime())) return d; }
  return null;
}
function ehRecente(data) {
  if (!data || Number.isNaN(data.getTime())) return false;
  const idade = AGORA.getTime() - data.getTime();
  return idade >= -6 * 3600000 && idade <= JANELA_HORAS * 3600000;
}
function dataISO(data) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(data); }
function tagXml(bloco, tag) { return decodeHtml(bloco.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1] || '').trim(); }
function imagemDoRss(bloco) {
  const enc = bloco.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  const media = bloco.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i);
  const img = bloco.match(/<img[^>]+src=["']([^"']+)["']/i);
  const bruto = (enc && enc[1]) || (media && media[1]) || (img && img[1]) || '';
  return ehImagemDeFonte(bruto) ? bruto : '';
}
function parseRss(xml, fonte) {
  const blocos = xml.match(/<item\\b[\\s\\S]*?<\\/item>/gi) || [];
  const itens = [];
  for (const bloco of blocos.slice(0, 20)) {
    const titulo = limparHtml(tagXml(bloco, 'title'));
    let link = limparHtml(tagXml(bloco, 'link')) || decodeHtml(bloco.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || '');
    const descricao = tagXml(bloco, 'description') || tagXml(bloco, 'content:encoded');
    const data = new Date(tagXml(bloco, 'pubDate') || tagXml(bloco, 'published'));
    if (!titulo || !link || Number.isNaN(data.getTime()) || !ehRecente(data)) continue;
    if (fonte.filtroTitulo && !fonte.filtroTitulo.test(titulo)) continue;
    itens.push({ titulo, url: link, resumo: resumir(descricao, 300), data, fonteNome: fonte.nome, categoria: fonte.categoria, imagem: imagemDoRss(bloco) });
  }
  return itens;
}
function extrairLinksLista(html, fonte) {
  const resultado = []; const vistos = new Set();
  const re = /<a\\b[^>]*href=["']([^"'#]+)["'][^>]*>([\\s\\S]*?)<\\/a>/gi; let m;
  while ((m = re.exec(html)) && resultado.length < 18) {
    const texto = limparHtml(m[2]);
    if (texto.length < 25 || texto.length > 240 || texto.split(' ').length < 4) continue;
    let url; try { url = new URL(decodeHtml(m[1]), fonte.url); } catch { continue; }
    if (!fonte.hosts.includes(url.hostname)) continue;
    const chave = url.href.split('#')[0];
    if (vistos.has(chave)) continue; vistos.add(chave);
    resultado.push({ tituloLista: texto, url: chave });
  }
  return resultado;
}
async function detalharHtml(candidato, fonte) {
  const html = await baixar(candidato.url);
  const titulo = limparHtml(meta(html, 'og:title') || candidato.tituloLista || '');
  const descricao = resumir(meta(html, 'og:description') || meta(html, 'description', 'name'), 300);
  const data = extrairData(html);
  if (!titulo || !descricao || !ehRecente(data)) return null;
  if (fonte.filtroTitulo && !fonte.filtroTitulo.test(titulo)) return null;
  return { titulo, url: candidato.url, resumo: descricao, data, fonteNome: fonte.nome, categoria: fonte.categoria, imagem: extrairImagemFonte(html, candidato.url) };
}
async function coletarFonteHtml(fonte) {
  const html = await baixar(fonte.url);
  const links = extrairLinksLista(html, fonte);
  const itens = [];
  for (const link of links.slice(0, 8)) {
    try { const item = await detalharHtml(link, fonte); if (item) itens.push(item); if (itens.length >= 4) break; }
    catch (erro) { console.warn(`[${fonte.nome}] detalhe ignorado: ${erro.message}`); }
  }
  return itens;
}
async function lerNoticias() {
  const codigo = await fs.readFile(ARQUIVO_NOTICIAS, 'utf8');
  const contexto = { globalThis: {} };
  vm.runInNewContext(`${codigo}\nglobalThis.__noticias = noticias;`, contexto, { timeout: 1500 });
  return contexto.globalThis.__noticias || [];
}
function similaridadeTitulos(a, b) {
  const sa = new Set(normalizar(a).split(' ').filter(x => x.length > 2));
  const sb = new Set(normalizar(b).split(' ').filter(x => x.length > 2));
  if (!sa.size || !sb.size) return 0;
  let inter = 0; for (const x of sa) if (sb.has(x)) inter++;
  return inter / Math.max(sa.size, sb.size);
}
function jaExiste(item, existentes) {
  const urlLimpa = item.url.replace(/[?#].*$/, '');
  return existentes.some(n => {
    if (n.fonteUrl && String(n.fonteUrl).replace(/[?#].*$/, '') === urlLimpa) return true;
    if (normalizar(n.titulo) === normalizar(item.titulo)) return true;
    return similaridadeTitulos(n.titulo, item.titulo) >= 0.78;
  });
}
function criarNoticia(item, existentes) {
  let slug = slugificar(item.titulo);
  if (existentes.some(n => n.slug === slug)) slug = `${slug}-${hashCurto(item.url).slice(0, 5)}`;
  const resumo = resumir(item.resumo, 300);
  return {
    id: idDaUrl(item.url), slug, titulo: item.titulo, categoria: item.categoria, data: dataISO(item.data),
    imagem: ehImagemDeFonte(item.imagem) ? item.imagem : '',
    resumo,
    conteudo: `<p>${escaparHtml(resumo)}</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. O texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href="${escaparHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escaparHtml(item.fonteNome)}</a>.</p>`,
    autor: 'Redação Notícia ES', fonteNome: item.fonteNome, fonteUrl: item.url, automatico: true, coletadoEm: AGORA.toISOString()
  };
}
function escaparTemplate(texto = '') { return String(texto).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\\$\\{/g, '\\\\${'); }
function serializarNoticias(noticias) {
  const cabecalho = `/*\n  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO\n*/\n\nconst noticias = [\n`;
  const objetos = noticias.map(n => {
    const chaves = ['id', 'slug', 'titulo', 'categoria', 'data', 'imagem', 'resumo', 'conteudo', 'autor', 'fonteNome', 'fonteUrl', 'automatico', 'coletadoEm'].filter(k => Object.prototype.hasOwnProperty.call(n, k));
    return `  {\n${chaves.map(k => `    ${k}: ${k === 'conteudo' ? '`' + escaparTemplate(n[k]) + '`' : JSON.stringify(n[k])}`).join(',\n')}\n  }`;
  });
  return `${cabecalho}${objetos.join(',\n')}${objetos.length ? '\n' : ''}];\n`;
}
async function principal() {
  const existentes = await lerNoticias();
  const coletados = [];
  const statusFontes = [];
  for (const fonte of fontesHtml) {
    try { const itens = await coletarFonteHtml(fonte); coletados.push(...itens.slice(0, MAX_POR_FONTE)); statusFontes.push({ fonte: fonte.nome, ok: true, encontrados: itens.length }); }
    catch (erro) { statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message }); }
  }
  for (const fonte of fontesRss) {
    try { const xml = await baixar(fonte.url); const itens = parseRss(xml, fonte); coletados.push(...itens.slice(0, MAX_POR_FONTE)); statusFontes.push({ fonte: fonte.nome, ok: true, encontrados: itens.length }); }
    catch (erro) { statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message }); }
  }
  for (const item of coletados) {
    item.imagem = await resolverImagem(item, coletados);
    console.log(`[imagem] ${item.imagem ? 'ok' : 'SEM FOTO'} — ${item.titulo}`);
  }
  coletados.sort((a, b) => b.data - a.data);
  const novas = [];
  const quotas = {};
  for (const item of coletados) {
    if (novas.length >= MAX_NOVAS_POR_RODADA) break;
    if ((quotas[item.categoria] || 0) >= 4) continue;
    if (jaExiste(item, [...existentes, ...novas])) continue;
    novas.push(criarNoticia(item, [...existentes, ...novas]));
    quotas[item.categoria] = (quotas[item.categoria] || 0) + 1;
  }
  if (novas.length) await fs.writeFile(ARQUIVO_NOTICIAS, serializarNoticias([...novas, ...existentes]), 'utf8');
  await fs.writeFile(ARQUIVO_STATUS, `${JSON.stringify({ atualizadoEm: AGORA.toISOString(), janelaHoras: JANELA_HORAS, novasPublicadas: novas.length, totalNoticias: existentes.length + novas.length, fontes: statusFontes }, null, 2)}\n`, 'utf8');
  console.log(`Motor concluído: ${novas.length} nova(s) notícia(s).`);
}
principal().catch(erro => { console.error(erro); process.exitCode = 1; });
