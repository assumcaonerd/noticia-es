import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { resolverImagem } from './resolver-imagem.mjs';

const ARQUIVO_PAUTAS = 'pautas.json';
const ARQUIVO_STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 72;
const MAX_POR_FONTE = 6;
const MAX_PAUTAS_PENDENTES = 50;
const USER_AGENT = 'NoticiaESBot/2.1 (+https://noticiaes.com.br)';

const PADRAO_POLITICA = /(elei[cç]|governo|governador|prefeit|prefeito|senado|senador|c[âa]mara|deputad|assembleia|ales|congresso|presid|stf|tse|ministro|partido|pol[ií]tica|mandato|candidato|vota[cç]|pec|projeto de lei|constitui[cç]|lula|bolsonaro)/i;
const PADRAO_SEGURANCA = /(pol[ií]cia|pm\b|pmes|pc\b|pces|sesp|bombeir|pris[ãa]o|preso|crime|homic[ií]dio|assassin|tr[áa]fico|drogas|opera[cç][ãa]o policial|roubo|furto|tiroteio|seguran[cç]a p[ú]blica|delegacia|foragid|mandado)/i;

const fontesHtml = [
  { nome: 'A Gazeta - Capa', url: 'https://www.agazeta.com.br/', categoria: 'Geral ES', homepage: true, hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Capa', url: 'https://www.folhavitoria.com.br/', categoria: 'Geral ES', homepage: true, hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'Tribuna Online - Capa', url: 'https://tribunaonline.com.br/', categoria: 'Geral ES', homepage: true, hosts: ['tribunaonline.com.br', 'www.tribunaonline.com.br'] },
  { nome: 'Revista Oeste - Capa', url: 'https://revistaoeste.com/', categoria: 'Política Nacional', homepage: true, hosts: ['revistaoeste.com', 'www.revistaoeste.com'] },
  { nome: 'Gazeta do Povo - Capa', url: 'https://www.gazetadopovo.com.br/', categoria: 'Política Nacional', homepage: true, hosts: ['www.gazetadopovo.com.br', 'gazetadopovo.com.br'] },
  { nome: 'A Gazeta - Política', url: 'https://www.agazeta.com.br/es/politica', categoria: 'Política ES', hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Política', url: 'https://www.folhavitoria.com.br/politica/', categoria: 'Política ES', hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'A Gazeta - Polícia', url: 'https://www.agazeta.com.br/es/policia', categoria: 'Segurança Pública', hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Polícia', url: 'https://www.folhavitoria.com.br/policia/', categoria: 'Segurança Pública', hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'SESP-ES', url: 'https://sesp.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['sesp.es.gov.br'] },
  { nome: 'Polícia Civil do ES', url: 'https://pc.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['pc.es.gov.br'] },
  { nome: 'Corpo de Bombeiros do ES', url: 'https://cb.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['cb.es.gov.br'] }
];

const fontesRss = [
  {
    nome: 'Senado Notícias',
    url: 'https://www12.senado.leg.br/noticias/feed/todasnoticias',
    categoria: 'Política Nacional',
    filtroTitulo: /(elei[cç]|senado|c[âa]mara|congresso|governo|presid|stf|seguran[cç]a|pec|projeto|comiss[ãa]o|vota[cç]|pol[ií]tica|partido|constitui[cç]|medida provis[óo]ria|mp\b)/i
  },
  { nome: 'Agência Brasil - Política', url: 'https://agenciabrasil.ebc.com.br/rss/politica/feed.xml', categoria: 'Política Nacional' }
];

function normalizar(texto = '') {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function idDaUrl(url) { return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16); }
function decodeHtml(texto = '') {
  const mapa = {
    '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>',
    '&nbsp;': ' ', '&ordm;': 'º', '&ordf;': 'ª'
  };
  return String(texto).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&(amp|quot|#39|apos|lt|gt|nbsp|ordm|ordf);/g, m => mapa[m] || m).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function limparHtml(texto = '') {
  return decodeHtml(texto).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function resumir(texto = '', limite = 350) {
  const limpo = limparHtml(texto);
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite + 1);
  const i = corte.lastIndexOf(' ');
  return `${corte.slice(0, i > limite * 0.7 ? i : limite).trim()}…`;
}
function classificarCategoria(titulo, url, fonte) {
  if (!fonte.homepage) return fonte.categoria;
  const alvo = `${titulo} ${url}`;
  if (PADRAO_SEGURANCA.test(alvo)) return 'Segurança Pública';
  if (PADRAO_POLITICA.test(alvo)) return fonte.categoria === 'Política Nacional' ? 'Política Nacional' : 'Política ES';
  return fonte.categoria;
}
async function baixar(url) {
  const resposta = await fetch(url, { headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8' }, redirect: 'follow', signal: AbortSignal.timeout(18000) });
  if (!resposta.ok) throw new Error(`${resposta.status} ${resposta.statusText}`);
  return resposta.text();
}
function meta(html, chave, atributo = 'property') {
  const escapada = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const padroes = [new RegExp(`<meta[^>]+${atributo}=["']${escapada}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'), new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${atributo}=["']${escapada}["'][^>]*>`, 'i')];
  for (const re of padroes) { const m = html.match(re); if (m) return decodeHtml(m[1]).trim(); }
  return '';
}
function extrairData(html) {
  const candidatos = [meta(html, 'article:published_time'), meta(html, 'date', 'name'), meta(html, 'DC.date', 'name')].filter(Boolean);
  const time = html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1];
  if (time) candidatos.push(time);
  for (const valor of candidatos) { const d = new Date(valor); if (!Number.isNaN(d.getTime())) return d; }
  return null;
}
function ehRecente(data) {
  if (!data || Number.isNaN(data.getTime())) return false;
  const idade = AGORA.getTime() - data.getTime();
  return idade >= -6 * 3600000 && idade <= JANELA_HORAS * 3600000;
}
function tagXml(bloco, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
  return decodeHtml(bloco.match(re)?.[1] || '').trim();
}
function parseRss(xml, fonte) {
  const blocos = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  const itens = [];
  for (const bloco of blocos.slice(0, 30)) {
    const titulo = limparHtml(tagXml(bloco, 'title'));
    let url = limparHtml(tagXml(bloco, 'link'));
    if (!url) url = decodeHtml(bloco.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || '');
    const descricao = tagXml(bloco, 'description') || tagXml(bloco, 'summary') || tagXml(bloco, 'content:encoded');
    const dataTxt = tagXml(bloco, 'pubDate') || tagXml(bloco, 'published') || tagXml(bloco, 'updated');
    const data = new Date(dataTxt);
    if (!titulo || !url || Number.isNaN(data.getTime()) || !ehRecente(data)) continue;
    if (fonte.filtroTitulo && !fonte.filtroTitulo.test(titulo)) continue;
    itens.push({ titulo, url, resumoFonte: resumir(descricao), data, fonteNome: fonte.nome, categoria: fonte.categoria });
  }
  return itens;
}
function extrairLinksLista(html, fonte) {
  const resultado = []; const vistos = new Set();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while ((m = re.exec(html)) && resultado.length < 60) {
    const texto = limparHtml(m[2]);
    if (texto.length < 25 || texto.length > 240 || texto.split(' ').length < 4) continue;
    let url; try { url = new URL(decodeHtml(m[1]), fonte.url); } catch { continue; }
    if (!fonte.hosts.includes(url.hostname)) continue;
    if (/\.(pdf|jpg|jpeg|png|gif|zip)$/i.test(url.pathname)) continue;
    if (/\/(autor|tag|categoria|category|busca|search|newsletter|assine|login)(\/|$)/i.test(url.pathname)) continue;
    const chave = url.href.split('#')[0];
    if (vistos.has(chave)) continue; vistos.add(chave);
    resultado.push({ tituloLista: texto, url: chave });
  }
  return resultado;
}
async function coletarFonteHtml(fonte) {
  const html = await baixar(fonte.url);
  const links = extrairLinksLista(html, fonte);
  const itens = [];
  const limiteDetalhes = fonte.homepage ? 20 : 12;
  for (const link of links.slice(0, limiteDetalhes)) {
    try {
      const pagina = await baixar(link.url);
      const titulo = limparHtml(meta(pagina, 'og:title') || meta(pagina, 'twitter:title', 'name') || link.tituloLista);
      const resumoFonte = resumir(meta(pagina, 'og:description') || meta(pagina, 'description', 'name') || link.tituloLista);
      const data = extrairData(pagina);
      if (!titulo || !resumoFonte || !ehRecente(data)) continue;
      const categoria = classificarCategoria(titulo, link.url, fonte);
      itens.push({ titulo, url: link.url, resumoFonte, data, fonteNome: fonte.nome, categoria });
      if (itens.length >= MAX_POR_FONTE) break;
    } catch (erro) { console.warn(`[${fonte.nome}] detalhe ignorado: ${erro.message}`); }
  }
  return itens;
}
async function lerJson(caminho, fallback) { try { return JSON.parse(await fs.readFile(caminho, 'utf8')); } catch { return fallback; } }
function similaridadeTitulos(a, b) {
  const sa = new Set(normalizar(a).split(' ').filter(x => x.length > 2));
  const sb = new Set(normalizar(b).split(' ').filter(x => x.length > 2));
  if (!sa.size || !sb.size) return 0;
  let inter = 0; for (const x of sa) if (sb.has(x)) inter++;
  return inter / Math.max(sa.size, sb.size);
}
function jaExiste(item, pautas) {
  const urlLimpa = item.url.replace(/[?#].*$/, '');
  return pautas.some(p => {
    if (String(p.urlFonte || '').replace(/[?#].*$/, '') === urlLimpa) return true;
    if (normalizar(p.titulo) === normalizar(item.titulo)) return true;
    return similaridadeTitulos(p.titulo, item.titulo) >= 0.78;
  });
}
async function principal() {
  const arquivo = await lerJson(ARQUIVO_PAUTAS, { atualizadoEm: null, pautas: [] });
  const existentes = Array.isArray(arquivo.pautas) ? arquivo.pautas : [];
  const coletados = []; const statusFontes = [];
  for (const fonte of fontesHtml) {
    try { const itens = await coletarFonteHtml(fonte); coletados.push(...itens.slice(0, MAX_POR_FONTE)); statusFontes.push({ fonte: fonte.nome, ok: true, encontrados: itens.length, capa: Boolean(fonte.homepage) }); }
    catch (erro) { statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message, capa: Boolean(fonte.homepage) }); }
  }
  for (const fonte of fontesRss) {
    try { const xml = await baixar(fonte.url); const itens = parseRss(xml, fonte); coletados.push(...itens.slice(0, MAX_POR_FONTE)); statusFontes.push({ fonte: fonte.nome, ok: true, encontrados: itens.length }); }
    catch (erro) { statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message }); }
  }
  for (const item of coletados) {
    item.imagem = await resolverImagem({ titulo: item.titulo, url: item.url, resumo: item.resumoFonte, imagem: item.imagem }, coletados);
  }
  coletados.sort((a, b) => b.data - a.data);
  const novas = [];
  for (const item of coletados) {
    if (jaExiste(item, [...existentes, ...novas])) continue;
    novas.push({ id: idDaUrl(item.url), titulo: item.titulo, categoria: item.categoria, dataFonte: item.data.toISOString(), fonteNome: item.fonteNome, urlFonte: item.url, resumoFonte: item.resumoFonte, imagem: item.imagem || '', descobertaEm: AGORA.toISOString(), status: 'pendente' });
  }
  const publicadas = existentes.filter(p => p.status === 'publicada').slice(0, 200);
  const pendentes = [...novas, ...existentes.filter(p => p.status !== 'publicada')].sort((a, b) => new Date(b.dataFonte || b.descobertaEm) - new Date(a.dataFonte || a.descobertaEm)).slice(0, MAX_PAUTAS_PENDENTES);
  const saida = { atualizadoEm: AGORA.toISOString(), observacao: 'Pautas coletadas automaticamente, inclusive manchetes de capa. Não publicar sem pesquisa multifuente, checagem de fonte primária e redação editorial própria.', portaisPrioritarios: ['agazeta.com.br', 'folhavitoria.com.br', 'tribunaonline.com.br', 'revistaoeste.com', 'gazetadopovo.com.br'], pautas: [...pendentes, ...publicadas] };
  await fs.writeFile(ARQUIVO_PAUTAS, `${JSON.stringify(saida, null, 2)}\n`, 'utf8');
  await fs.writeFile(ARQUIVO_STATUS, `${JSON.stringify({ atualizadoEm: AGORA.toISOString(), modo: 'coleta-de-pautas-e-manchetes-de-capa', novasPautas: novas.length, pautasPendentes: pendentes.length, fontes: statusFontes }, null, 2)}\n`, 'utf8');
  console.log(`Coleta concluída: ${novas.length} nova(s) pauta(s); ${pendentes.length} pendente(s).`);
}
principal().catch(erro => { console.error(erro); process.exitCode = 1; });
