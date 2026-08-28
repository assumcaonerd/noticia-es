import fs from 'node:fs/promises';
import vm from 'node:vm';
import crypto from 'node:crypto';

const ARQUIVO_NOTICIAS = 'noticias.js';
const ARQUIVO_STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 96;
const MAX_NOVAS_POR_RODADA = 8;
const MAX_POR_FONTE = 2;
const USER_AGENT = 'NoticiaESBot/1.0 (+https://noticiaes.com.br)';

const CAPAS = {
  'Política ES': 'imagens/auto-politica-es.svg',
  'Segurança Pública': 'imagens/auto-seguranca-publica.svg',
  'Política Nacional': 'imagens/auto-politica-nacional.svg'
};

const fontesHtml = [
  {
    nome: 'A Gazeta - Política',
    url: 'https://www.agazeta.com.br/es/politica',
    categoria: 'Política ES',
    hosts: ['www.agazeta.com.br', 'agazeta.com.br']
  },
  {
    nome: 'Folha Vitória - Política',
    url: 'https://www.folhavitoria.com.br/politica/',
    categoria: 'Política ES',
    hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br']
  },
  {
    nome: 'A Gazeta - Polícia',
    url: 'https://www.agazeta.com.br/es/policia',
    categoria: 'Segurança Pública',
    hosts: ['www.agazeta.com.br', 'agazeta.com.br']
  },
  {
    nome: 'Folha Vitória - Polícia',
    url: 'https://www.folhavitoria.com.br/policia/',
    categoria: 'Segurança Pública',
    hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br']
  },
  {
    nome: 'Governo do Espírito Santo',
    url: 'https://www.es.gov.br/noticias',
    categoria: 'Política ES',
    hosts: ['www.es.gov.br', 'es.gov.br'],
    filtroTitulo: /(governo|governador|secretari|munic[ií]p|prefeit|investiment|elei[cç]|pol[ií]tica|lei|projeto|assembleia|seguran[cç]a|estado)/i
  },
  {
    nome: 'SESP-ES',
    url: 'https://sesp.es.gov.br/Noticias',
    categoria: 'Segurança Pública',
    hosts: ['sesp.es.gov.br']
  },
  {
    nome: 'Polícia Militar do ES',
    url: 'https://pm.es.gov.br/noticias',
    categoria: 'Segurança Pública',
    hosts: ['pm.es.gov.br']
  },
  {
    nome: 'Polícia Civil do ES',
    url: 'https://pc.es.gov.br/Noticias',
    categoria: 'Segurança Pública',
    hosts: ['pc.es.gov.br']
  },
  {
    nome: 'Corpo de Bombeiros do ES',
    url: 'https://cb.es.gov.br/Noticias',
    categoria: 'Segurança Pública',
    hosts: ['cb.es.gov.br']
  },
  {
    nome: 'Tribunal Superior Eleitoral',
    url: 'https://www.tse.jus.br/comunicacao/noticias',
    categoria: 'Política Nacional',
    hosts: ['www.tse.jus.br'],
    filtroTitulo: /(elei[cç]|candidat|tse|urna|vota[cç]|propaganda|partido|pesquisa|campanha|eleitor)/i
  }
];

const fontesRss = [
  {
    nome: 'Senado Notícias',
    url: 'https://www12.senado.leg.br/noticias/feed/todasnoticias',
    categoria: 'Política Nacional',
    filtroTitulo: /(elei[cç]|senado|c[aâ]mara|congresso|governo|presid|stf|seguran[cç]a|pec|projeto|comiss[aã]o|vota[cç]|pol[ií]tica|partido|constitui[cç]|medida provis[oó]ria|mp\b)/i
  },
  {
    nome: 'Agência Brasil - Política',
    url: 'https://agenciabrasil.ebc.com.br/rss/politica/feed.xml',
    categoria: 'Política Nacional'
  }
];

function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugificar(texto = '') {
  return normalizar(texto).replace(/\s+/g, '-').slice(0, 120) || 'noticia';
}

function hashCurto(texto) {
  return crypto.createHash('sha256').update(texto).digest('hex').slice(0, 8);
}

function idDaUrl(url) {
  const hex = crypto.createHash('sha256').update(url).digest('hex').slice(0, 12);
  const valor = BigInt(`0x${hex}`) % 800000000000n + 100000000000n;
  return Number(valor);
}

function decodeHtml(texto = '') {
  const mapa = {
    '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>',
    '&nbsp;': ' ', '&ordm;': 'º', '&ordf;': 'ª'
  };
  return texto
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(amp|quot|#39|apos|lt|gt|nbsp|ordm|ordf);/g, m => mapa[m] || m)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function limparHtml(texto = '') {
  return decodeHtml(texto)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escaparHtml(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resumir(texto = '', limite = 320) {
  const limpo = limparHtml(texto);
  if (limpo.length <= limite) return limpo;
  const cortado = limpo.slice(0, limite + 1);
  const ultimoEspaco = cortado.lastIndexOf(' ');
  return `${cortado.slice(0, ultimoEspaco > limite * 0.7 ? ultimoEspaco : limite).trim()}…`;
}

async function baixar(url) {
  const resposta = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8' },
    redirect: 'follow',
    signal: AbortSignal.timeout(18000)
  });
  if (!resposta.ok) throw new Error(`${resposta.status} ${resposta.statusText}`);
  return resposta.text();
}

function meta(html, chave, atributo = 'property') {
  const escapada = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const padroes = [
    new RegExp(`<meta[^>]+${atributo}=["']${escapada}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${atributo}=["']${escapada}["'][^>]*>`, 'i')
  ];
  for (const re of padroes) {
    const m = html.match(re);
    if (m) return decodeHtml(m[1]).trim();
  }
  return '';
}

function extrairData(html) {
  const candidatos = [
    meta(html, 'article:published_time'),
    meta(html, 'date', 'name'),
    meta(html, 'DC.date', 'name'),
    meta(html, 'datePublished', 'itemprop')
  ].filter(Boolean);

  const time = html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1];
  if (time) candidatos.push(time);

  for (const valor of candidatos) {
    const d = new Date(valor);
    if (!Number.isNaN(d.getTime())) return d;
  }

  const dataBr = html.match(/(?:Publicado(?:\s+em)?|Publica[cç][aã]o|Data)\s*:?[\s\S]{0,80}?(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})(?:[^0-9]{0,10}(\d{1,2})[:h](\d{2}))?/i);
  if (dataBr) {
    const [, dia, mes, ano, hora = '12', minuto = '00'] = dataBr;
    return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));
  }

  const meses = {
    janeiro: 0, fevereiro: 1, marco: 2, março: 2, abril: 3, maio: 4, junho: 5,
    julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
  };
  const extenso = limparHtml(html).match(/Publicado\s+em\s+(\d{1,2})\s+de\s+([a-zçã]+)\s+de\s+(\d{4})(?:\s+[àa]s\s+(\d{1,2}):(\d{2}))?/i);
  if (extenso) {
    const mes = meses[extenso[2].toLowerCase()];
    if (mes !== undefined) return new Date(Number(extenso[3]), mes, Number(extenso[1]), Number(extenso[4] || 12), Number(extenso[5] || 0));
  }

  return null;
}

function ehRecente(data) {
  if (!data || Number.isNaN(data.getTime())) return false;
  const idadeMs = AGORA.getTime() - data.getTime();
  return idadeMs >= -6 * 3600000 && idadeMs <= JANELA_HORAS * 3600000;
}

function dataISO(data) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(data);
}

function tagXml(bloco, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
  return decodeHtml(bloco.match(re)?.[1] || '').trim();
}

function parseRss(xml, fonte) {
  const itens = [];
  const blocos = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  for (const bloco of blocos.slice(0, 20)) {
    const titulo = limparHtml(tagXml(bloco, 'title'));
    let link = limparHtml(tagXml(bloco, 'link'));
    if (!link) link = decodeHtml(bloco.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || '');
    const descricao = tagXml(bloco, 'description') || tagXml(bloco, 'summary') || tagXml(bloco, 'content:encoded');
    const dataTxt = tagXml(bloco, 'pubDate') || tagXml(bloco, 'published') || tagXml(bloco, 'updated');
    const data = new Date(dataTxt);
    const sourceNome = limparHtml(tagXml(bloco, 'source')) || fonte.nome;

    if (!titulo || !link || Number.isNaN(data.getTime()) || !ehRecente(data)) continue;
    if (fonte.filtroTitulo && !fonte.filtroTitulo.test(titulo)) continue;

    itens.push({
      titulo,
      url: link,
      resumo: resumir(descricao, 300),
      data,
      fonteNome: sourceNome,
      categoria: fonte.categoria
    });
  }
  return itens;
}

function extrairLinksLista(html, fonte) {
  const lower = html.toLowerCase();
  const posNoticias = Math.max(lower.lastIndexOf('>notícias<'), lower.lastIndexOf('>noticias<'));
  const zona = posNoticias >= 0 ? html.slice(posNoticias) : html;
  const resultado = [];
  const vistos = new Set();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(zona)) && resultado.length < 18) {
    const texto = limparHtml(m[2]);
    if (texto.length < 25 || texto.length > 240 || texto.split(' ').length < 4) continue;
    if (/^(leia mais|mais not[ií]cias|p[aá]gina principal|in[ií]cio|anterior|pr[oó]xima)$/i.test(texto)) continue;
    if (fonte.filtroTitulo && !fonte.filtroTitulo.test(texto)) continue;

    let url;
    try { url = new URL(decodeHtml(m[1]), fonte.url); } catch { continue; }
    if (!fonte.hosts.includes(url.hostname)) continue;
    if (/\.(pdf|jpg|jpeg|png|gif|zip)$/i.test(url.pathname)) continue;
    if (/\/(noticias?|contato|institucional|legislacao|licitacoes?)\/?$/i.test(url.pathname)) continue;
    const chave = url.href.split('#')[0];
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    resultado.push({ tituloLista: texto, url: chave });
  }
  return resultado;
}

async function detalharHtml(candidato, fonte) {
  const html = await baixar(candidato.url);
  const titulo = limparHtml(meta(html, 'og:title') || meta(html, 'twitter:title', 'name') || candidato.tituloLista || '');
  const descricao = resumir(meta(html, 'og:description') || meta(html, 'description', 'name'), 300);
  const data = extrairData(html);

  if (!titulo || !descricao || !ehRecente(data)) return null;
  if (fonte.filtroTitulo && !fonte.filtroTitulo.test(titulo)) return null;

  return {
    titulo,
    url: candidato.url,
    resumo: descricao,
    data,
    fonteNome: fonte.nome,
    categoria: fonte.categoria
  };
}

async function coletarFonteHtml(fonte) {
  const html = await baixar(fonte.url);
  const links = extrairLinksLista(html, fonte);
  const itens = [];
  for (const link of links.slice(0, 8)) {
    try {
      const item = await detalharHtml(link, fonte);
      if (item) itens.push(item);
      if (itens.length >= 4) break;
    } catch (erro) {
      console.warn(`[${fonte.nome}] detalhe ignorado: ${erro.message}`);
    }
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
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
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
  const urlSegura = escaparHtml(item.url);
  const fonteSegura = escaparHtml(item.fonteNome);

  return {
    id: idDaUrl(item.url),
    slug,
    titulo: item.titulo,
    categoria: item.categoria,
    data: dataISO(item.data),
    imagem: CAPAS[item.categoria] || CAPAS['Política Nacional'],
    resumo,
    conteudo: `<p>${escaparHtml(resumo)}</p><p>O Notícia ES identificou esta atualização em uma fonte monitorada pelo motor automático do portal. Para preservar contexto, autoria e eventuais atualizações posteriores, o texto integral permanece na publicação original.</p><p><strong>Fonte:</strong> <a href="${urlSegura}" target="_blank" rel="noopener noreferrer">${fonteSegura}</a>.</p>`,
    autor: 'Redação Notícia ES',
    fonteNome: item.fonteNome,
    fonteUrl: item.url,
    automatico: true,
    coletadoEm: AGORA.toISOString()
  };
}

function escaparTemplate(texto = '') {
  return String(texto).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function serializarValor(valor, chave) {
  if (chave === 'conteudo') return `\`${escaparTemplate(valor)}\``;
  return JSON.stringify(valor, null, 2);
}

function serializarNoticias(noticias) {
  const cabecalho = `/*\n  NOTÍCIA ES - BANCO DE NOTÍCIAS EM ARQUIVO ESTÁTICO\n  ==================================================\n  Este arquivo recebe notícias manuais e automáticas.\n  O motor automático roda pelo GitHub Actions e insere novas matérias no topo.\n  Para publicação manual, use publicar.html e cole o objeto logo após "const noticias = [".\n*/\n\nconst noticias = [\n`;

  const objetos = noticias.map(n => {
    const chaves = ['id', 'slug', 'titulo', 'categoria', 'data', 'imagem', 'resumo', 'conteudo', 'autor', 'fonteNome', 'fonteUrl', 'automatico', 'coletadoEm']
      .filter(k => Object.prototype.hasOwnProperty.call(n, k));
    const linhas = chaves.map(k => `    ${k}: ${serializarValor(n[k], k)}`);
    return `  {\n${linhas.join(',\n')}\n  }`;
  });

  return `${cabecalho}${objetos.join(',\n')}${objetos.length ? '\n' : ''}];\n`;
}

async function principal() {
  const existentes = await lerNoticias();
  const coletados = [];
  const statusFontes = [];

  for (const fonte of fontesHtml) {
    try {
      const itens = await coletarFonteHtml(fonte);
      coletados.push(...itens.slice(0, MAX_POR_FONTE));
      statusFontes.push({ fonte: fonte.nome, ok: true, encontrados: itens.length });
      console.log(`[${fonte.nome}] ${itens.length} item(ns) recente(s)`);
    } catch (erro) {
      statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message });
      console.warn(`[${fonte.nome}] falhou: ${erro.message}`);
    }
  }

  for (const fonte of fontesRss) {
    try {
      const xml = await baixar(fonte.url);
      const itens = parseRss(xml, fonte);
      coletados.push(...itens.slice(0, MAX_POR_FONTE));
      statusFontes.push({ fonte: fonte.nome, ok: true, encontrados: itens.length });
      console.log(`[${fonte.nome}] ${itens.length} item(ns) recente(s)`);
    } catch (erro) {
      statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message });
      console.warn(`[${fonte.nome}] falhou: ${erro.message}`);
    }
  }

  coletados.sort((a, b) => b.data - a.data);
  const novas = [];
  const quotas = { 'Política ES': 0, 'Segurança Pública': 0, 'Política Nacional': 0 };
  const limiteCategoria = 4;

  for (const item of coletados) {
    if (novas.length >= MAX_NOVAS_POR_RODADA) break;
    if ((quotas[item.categoria] || 0) >= limiteCategoria) continue;
    if (jaExiste(item, [...existentes, ...novas])) continue;
    const noticia = criarNoticia(item, [...existentes, ...novas]);
    novas.push(noticia);
    quotas[item.categoria] = (quotas[item.categoria] || 0) + 1;
  }

  if (novas.length) {
    await fs.writeFile(ARQUIVO_NOTICIAS, serializarNoticias([...novas, ...existentes]), 'utf8');
  }

  const status = {
    atualizadoEm: AGORA.toISOString(),
    janelaHoras: JANELA_HORAS,
    novasPublicadas: novas.length,
    totalNoticias: existentes.length + novas.length,
    fontes: statusFontes
  };
  await fs.writeFile(ARQUIVO_STATUS, `${JSON.stringify(status, null, 2)}\n`, 'utf8');

  console.log(`Motor concluído: ${novas.length} nova(s) notícia(s).`);
}

principal().catch(erro => {
  console.error(erro);
  process.exitCode = 1;
});
