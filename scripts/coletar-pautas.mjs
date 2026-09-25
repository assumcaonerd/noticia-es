import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { resolverImagem } from './resolver-imagem.mjs';

const ARQUIVO_PAUTAS = 'pautas.json';
const ARQUIVO_STATUS = 'motor-status.json';
const AGORA = new Date();
const JANELA_HORAS = 72;
const MAX_POR_FONTE = 6;
const MAX_PAUTAS_PENDENTES = 80;
const USER_AGENT = 'NoticiaESBot/2.5 (+https://noticiaes.com.br)';

const PADRAO_POLITICA = /(elei[cç]|governo|governador|prefeit|prefeito|senado|senador|c[âa]mara|deputad|assembleia|ales|congresso|presid|stf|tse|ministro|partido|pol[ií]tica|mandato|candidato|vota[cç]|pec|projeto de lei|constitui[cç]|lula|bolsonaro)/i;
const PADRAO_SEGURANCA = /(pol[ií]cia|pm\b|pmes|pc\b|pces|sesp|bombeir|pris[ãa]o|preso|crime|homic[ií]dio|assassin|tr[áa]fico|drogas|opera[cç][ãa]o policial|roubo|furto|tiroteio|seguran[cç]a p[ú]blica|delegacia|foragid|mandado|socioeducativ|prisional)/i;
const FILTRO_NACIONAL = /(elei[cç]|senado|c[âa]mara|congresso|governo|presid|stf|tse|seguran[cç]a|pec|projeto|comiss[ãa]o|vota[cç]|pol[ií]tica|partido|constitui[cç]|medida provis[óo]ria|mp\b|lula|bolsonaro|ministro|deputad|brasil|brazil)/i;
const PADRAO_JUSTICA = /(stf|stj|tj-?es|tribunal|justi[cç]a|juiz|ju[ií]za|desembarg|minist[eé]rio p[uú]blico|mpf|mpe|pgr|procurador|decis[aã]o judicial|senten[cç]a|liminar|a[cç][aã]o judicial)/i;
const PADRAO_ECONOMIA = /(economia|mercado|banco|juros|selic|infla[cç][aã]o|pib|emprego|desemprego|investimento|empresa|neg[oó]cio|d[oó]lar|real|bolsa|ibovespa|finan[cç]|imposto|receita federal)/i;
const PADRAO_TECNOLOGIA = /(tecnologia|intelig[eê]ncia artificial|\bia\b|software|aplicativo|app\b|startup|rob[oô]|chatgpt|llm|openai|google|microsoft|apple|nvidia|chip|semicondutor|celular|internet|ciber)/i;
const PADRAO_ESPORTE = /(futebol|brasileir[aã]o|campeonato|copa|jogo|partida|gol\b|time\b|clube|atleta|esporte|vit[oó]ria-?es|rio branco|desportiva|estrela do norte)/i;
const PADRAO_CULTURA = /(cultura|cinema|filme|m[uú]sica|cantor|cantora|show|teatro|livro|literatura|festival|exposi[cç][aã]o|arte\b)/i;
const PADRAO_FE = /(igreja|evang[eé]lic|crist[aã]o|pastor|pastora|culto|b[ií]blia|f[eé]\b|relig|maranata|presbiter|batista|assembleia de deus|ieclb)/i;
const PADRAO_CIDADES = /(vit[oó]ria|vila velha|serra|cariacica|guarapari|linhares|colatina|cachoeiro|santa teresa|domingos martins|esp[ií]rito santo|\bes\b)/i;
const PADRAO_OPINIAO = /^(opini[aã]o|editorial|artigo|coluna)\b|\b(colunista|artigo de opini[aã]o)\b/i;

const fontesHtml = [
  { nome: 'A Gazeta - Capa', url: 'https://www.agazeta.com.br/', categoria: 'Geral ES', homepage: true, hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Capa', url: 'https://www.folhavitoria.com.br/', fallbackUrls: ['https://www.folhavitoria.com.br/sitemap/'], categoria: 'Geral ES', homepage: true, hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'Tribuna Online - Capa', url: 'https://tribunaonline.com.br/', categoria: 'Geral ES', homepage: true, hosts: ['tribunaonline.com.br', 'www.tribunaonline.com.br'] },
  { nome: 'Revista Oeste - Capa', url: 'https://revistaoeste.com/', fallbackUrls: ['https://www.revistaoeste.com/home/'], categoria: 'Política Nacional', homepage: true, hosts: ['revistaoeste.com', 'www.revistaoeste.com'] },
  { nome: 'Gazeta do Povo - Capa', url: 'https://www.gazetadopovo.com.br/', categoria: 'Política Nacional', homepage: true, hosts: ['www.gazetadopovo.com.br', 'gazetadopovo.com.br'] },
  { nome: 'A Gazeta - Política', url: 'https://www.agazeta.com.br/es/politica', categoria: 'Política ES', hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Política', url: 'https://www.folhavitoria.com.br/politica/', fallbackUrls: ['https://www.folhavitoria.com.br/sitemap/'], categoria: 'Política ES', hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'A Gazeta - Polícia', url: 'https://www.agazeta.com.br/es/policia', categoria: 'Segurança Pública', hosts: ['www.agazeta.com.br', 'agazeta.com.br'] },
  { nome: 'Folha Vitória - Polícia', url: 'https://www.folhavitoria.com.br/policia/', fallbackUrls: ['https://www.folhavitoria.com.br/sitemap/'], categoria: 'Segurança Pública', hosts: ['www.folhavitoria.com.br', 'folhavitoria.com.br'] },
  { nome: 'SESP-ES', url: 'https://sesp.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['sesp.es.gov.br'] },
  { nome: 'Polícia Civil do ES', url: 'https://pc.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['pc.es.gov.br'] },
  { nome: 'Corpo de Bombeiros do ES', url: 'https://cb.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['cb.es.gov.br'] },
  { nome: 'Polícia Militar do ES', url: 'https://pm.es.gov.br/Noticias', fallbackUrls: ['https://pm.es.gov.br/noticias'], categoria: 'Segurança Pública', hosts: ['pm.es.gov.br'] },
  { nome: 'Polícia Penal do ES', url: 'https://sejus.es.gov.br/noticias', categoria: 'Segurança Pública', hosts: ['sejus.es.gov.br'] },
  { nome: 'Agentes Socioeducativos do ES', url: 'https://iases.es.gov.br/Noticias', categoria: 'Segurança Pública', hosts: ['iases.es.gov.br'] },

  // Fé e Sociedade — prioridade editorial para fontes evangélicas capixabas oficiais.
  { nome: 'Igreja Cristã Maranata - Oficial', url: 'https://www.igrejacristamaranata.org.br/', categoria: 'Fé e Sociedade', homepage: true, hosts: ['www.igrejacristamaranata.org.br', 'igrejacristamaranata.org.br'] },
  { nome: 'Assembleia de Deus Fonte de Vida - Oficial', url: 'https://www.adfontedevida.org.br/', categoria: 'Fé e Sociedade', homepage: true, hosts: ['www.adfontedevida.org.br', 'adfontedevida.org.br'] },
  { nome: 'Primeira Igreja Presbiteriana de Vitória - Oficial', url: 'https://ipbvit.org.br/', categoria: 'Fé e Sociedade', homepage: true, hosts: ['ipbvit.org.br', 'www.ipbvit.org.br'] },
  { nome: 'Convenção Batista do Estado do Espírito Santo - Oficial', url: 'https://www.batistas.es/', categoria: 'Fé e Sociedade', homepage: true, hosts: ['www.batistas.es', 'batistas.es'] },
  { nome: 'IECLB - Sínodo Espiritossantense', url: 'https://www.ieclb.org.br/', categoria: 'Fé e Sociedade', homepage: true, hosts: ['www.ieclb.org.br', 'ieclb.org.br'], filtroTitulo: /(esp[ií]rito santo|espiritossantense|vit[oó]ria|vila velha|cariacica|serra|domingos martins|marechal floriano|santa teresa|santa maria de jetib[aá]|colatina|linhares)/i },

  // Fallbacks HTML para feeds que deixaram de existir.
  { nome: 'Estadão - Política', url: 'https://www.estadao.com.br/politica/', categoria: 'Política Nacional', hosts: ['www.estadao.com.br', 'estadao.com.br'] },
  { nome: 'Correio Braziliense - Política', url: 'https://www.correiobraziliense.com.br/politica/', categoria: 'Política Nacional', hosts: ['www.correiobraziliense.com.br', 'correiobraziliense.com.br'] },
  { nome: 'Band - Política', url: 'https://www.band.com.br/politica/', categoria: 'Política Nacional', hosts: ['www.band.com.br', 'band.com.br'] },
  { nome: 'CBN - Política', url: 'https://cbn.globo.com/politica/', categoria: 'Política Nacional', hosts: ['cbn.globo.com'] }
];

const fontesRss = [
  { nome: 'Senado Notícias', url: 'https://www12.senado.leg.br/noticias/feed/todasnoticias', categoria: 'Política Nacional', filtroTitulo: FILTRO_NACIONAL },
  { nome: 'Câmara dos Deputados', url: 'https://www.camara.leg.br/noticias/rss/ultimas', categoria: 'Política Nacional', filtroTitulo: FILTRO_NACIONAL },
  { nome: 'Agência Brasil - Política', url: 'https://agenciabrasil.ebc.com.br/rss/politica/feed.xml', categoria: 'Política Nacional' },
  { nome: 'Folha de S.Paulo - Poder', url: 'https://feeds.folha.uol.com.br/poder/rss091.xml', categoria: 'Política Nacional' },
  { nome: 'O Globo - Política', url: 'https://oglobo.globo.com/rss.xml?secao=politica', categoria: 'Política Nacional' },
  { nome: 'Veja', url: 'https://veja.abril.com.br/feed/', categoria: 'Política Nacional', filtroTitulo: FILTRO_NACIONAL },
  { nome: 'Revista Oeste - Feed', url: 'https://revistaoeste.com/feed/', fallbackUrls: ['https://revistaoeste.com/atom'], categoria: 'Política Nacional', filtroTitulo: FILTRO_NACIONAL },
  { nome: 'Correio Braziliense - Feed', url: 'https://www.correiobraziliense.com.br/rss/politica', categoria: 'Política Nacional', filtroTitulo: FILTRO_NACIONAL },
  { nome: 'g1 - Política', url: 'https://g1.globo.com/rss/g1/politica/', categoria: 'Política Nacional' },
  { nome: 'UOL Notícias', url: 'https://rss.uol.com.br/feed/noticias.xml', categoria: 'Política Nacional', filtroTitulo: FILTRO_NACIONAL },
  { nome: 'CNN Brasil', url: 'https://www.cnnbrasil.com.br/feed/', fallbackUrls: ['https://admin.cnnbrasil.com.br/feed/'], categoria: 'Política Nacional', filtroTitulo: FILTRO_NACIONAL },
];

const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

function normalizar(texto = '') {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function idDaUrl(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
}
function decodeHtml(texto = '') {
  const entidades = {
    amp: '&', quot: '"', '#39': "'", apos: "'", lt: '<', gt: '>',
    nbsp: ' ', ordm: 'º', ordf: 'ª'
  };
  return String(texto)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&([a-z]+|#39);/gi, (m, entidade) => entidades[entidade.toLowerCase()] ?? m)
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
function resumir(texto = '', limite = 350) {
  const limpo = limparHtml(texto);
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite + 1);
  const i = corte.lastIndexOf(' ');
  return `${corte.slice(0, i > limite * 0.7 ? i : limite).trim()}…`;
}
function classificarCategoria(titulo, url, fonte) {
  const alvo = `${titulo} ${url}`;
  if (PADRAO_OPINIAO.test(titulo)) return 'Opinião';
  if (PADRAO_SEGURANCA.test(alvo)) return 'Segurança Pública';
  if (PADRAO_JUSTICA.test(alvo)) return 'Justiça';
  if (PADRAO_TECNOLOGIA.test(alvo)) return 'Tecnologia';
  if (PADRAO_ESPORTE.test(alvo)) return 'Esporte';
  if (PADRAO_FE.test(alvo)) return 'Fé';
  if (PADRAO_CULTURA.test(alvo)) return 'Cultura';
  if (PADRAO_ECONOMIA.test(alvo)) return 'Economia';
  if (PADRAO_POLITICA.test(alvo)) return PADRAO_CIDADES.test(alvo) && !/presid|senado|congresso|stf|stj|tse|lula|bolsonaro/i.test(alvo) ? 'Política ES' : 'Política Nacional';
  if (PADRAO_CIDADES.test(alvo)) return 'Cidades';
  return fonte.categoria === 'Geral ES' ? 'Cidades' : fonte.categoria;
}
function retryAfterMs(resposta, tentativa) {
  const cabecalho = resposta.headers.get('retry-after');
  if (cabecalho) {
    const segundos = Number(cabecalho);
    if (Number.isFinite(segundos)) return Math.min(segundos * 1000, 15000);
    const data = new Date(cabecalho).getTime();
    if (Number.isFinite(data)) return Math.min(Math.max(data - Date.now(), 1000), 15000);
  }
  return Math.min(1500 * (2 ** (tentativa - 1)), 8000);
}
async function baixar(url, { tentativas = 3 } = {}) {
  let ultimoErro;
  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      const resposta = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8',
          'accept-language': 'pt-BR,pt;q=0.9,en;q=0.7'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(20000)
      });

      if (resposta.ok) {
        const bytes = await resposta.arrayBuffer();
        const tipo = resposta.headers.get('content-type') || '';
        const declarado = tipo.match(/charset=([^;\s]+)/i)?.[1]?.replace(/["']/g, '') || '';
        let charset = declarado;
        if (!charset) {
          const amostra = new TextDecoder('ascii').decode(bytes.slice(0, 300));
          charset = amostra.match(/encoding=["']([^"']+)/i)?.[1] || 'utf-8';
        }
        try { return new TextDecoder(charset).decode(bytes); }
        catch { return new TextDecoder('utf-8').decode(bytes); }
      }

      const erro = new Error(`${resposta.status} ${resposta.statusText}`);
      erro.status = resposta.status;

      // 403/404/410 são falhas da rota, não da conexão. O fallback deve assumir.
      if ([403, 404, 410].includes(resposta.status)) throw erro;

      if (resposta.status === 429 && tentativa < tentativas) {
        await esperar(retryAfterMs(resposta, tentativa));
        ultimoErro = erro;
        continue;
      }

      if (resposta.status >= 500 && tentativa < tentativas) {
        await esperar(retryAfterMs(resposta, tentativa));
        ultimoErro = erro;
        continue;
      }

      throw erro;
    } catch (erro) {
      ultimoErro = erro;
      if ([403, 404, 410].includes(erro?.status)) break;
      if (tentativa < tentativas) {
        await esperar(Math.min(1500 * (2 ** (tentativa - 1)), 8000));
        continue;
      }
    }
  }
  throw ultimoErro || new Error('falha desconhecida de rede');
}
function rotasDaFonte(fonte) {
  return [fonte.url, ...(fonte.fallbackUrls || [])].filter(Boolean);
}
async function baixarComFallback(fonte) {
  const erros = [];
  for (const rota of rotasDaFonte(fonte)) {
    try {
      const conteudo = await baixar(rota);
      return { conteudo, rota, fallback: rota !== fonte.url };
    } catch (erro) {
      erros.push(`${rota} -> ${erro.message}`);
    }
  }
  throw new Error(erros.join(' | '));
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
    meta(html, 'DC.date', 'name')
  ].filter(Boolean);
  const time = html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1];
  if (time) candidatos.push(time);
  for (const valor of candidatos) {
    const d = new Date(valor);
    if (!Number.isNaN(d.getTime())) return d;
  }
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
    itens.push({ titulo, url, resumoFonte: resumir(descricao), data, fonteNome: fonte.nome, categoria: classificarCategoria(titulo, url, fonte) });
  }
  return itens;
}
function extrairLinksLista(html, fonte, baseUrl = fonte.url) {
  const resultado = [];
  const vistos = new Set();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && resultado.length < 80) {
    const texto = limparHtml(m[2]);
    if (texto.length < 25 || texto.length > 240 || texto.split(' ').length < 4) continue;
    let url;
    try { url = new URL(decodeHtml(m[1]), baseUrl); } catch { continue; }
    if (!fonte.hosts.includes(url.hostname)) continue;
    if (/\.(pdf|jpg|jpeg|png|gif|zip)$/i.test(url.pathname)) continue;
    if (/\/(autor|tag|categoria|category|busca|search|newsletter|assine|login)(\/|$)/i.test(url.pathname)) continue;
    const chave = url.href.split('#')[0];
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    resultado.push({ tituloLista: texto, url: chave });
  }
  return resultado;
}
async function coletarFonteHtml(fonte) {
  const erros = [];
  for (const rota of rotasDaFonte(fonte)) {
    try {
      const html = await baixar(rota);
      const links = extrairLinksLista(html, fonte, rota);
      const itens = [];
      const limiteDetalhes = fonte.homepage ? 20 : 16;

      for (const link of links.slice(0, limiteDetalhes)) {
        try {
          const pagina = await baixar(link.url);
          const titulo = limparHtml(meta(pagina, 'og:title') || meta(pagina, 'twitter:title', 'name') || link.tituloLista);
          const resumoFonte = resumir(meta(pagina, 'og:description') || meta(pagina, 'description', 'name') || link.tituloLista);
          const data = extrairData(pagina);
          if (!titulo || !resumoFonte || !ehRecente(data)) continue;
          if (fonte.filtroTitulo && !fonte.filtroTitulo.test(`${titulo} ${resumoFonte}`)) continue;
          const categoria = classificarCategoria(titulo, link.url, fonte);
          itens.push({ titulo, url: link.url, resumoFonte, data, fonteNome: fonte.nome, categoria });
          if (itens.length >= MAX_POR_FONTE) break;
        } catch (erro) {
          console.warn(`[${fonte.nome}] detalhe ignorado: ${erro.message}`);
        }
      }

      // Uma rota respondeu, mesmo que não tenha notícia recente. Isso é operacional.
      return { itens, rota, fallback: rota !== fonte.url };
    } catch (erro) {
      erros.push(`${rota} -> ${erro.message}`);
    }
  }
  throw new Error(erros.join(' | '));
}
async function lerJson(caminho, fallback) {
  try { return JSON.parse(await fs.readFile(caminho, 'utf8')); }
  catch { return fallback; }
}
function similaridadeTitulos(a, b) {
  const sa = new Set(normalizar(a).split(' ').filter(x => x.length > 2));
  const sb = new Set(normalizar(b).split(' ').filter(x => x.length > 2));
  if (!sa.size || !sb.size) return 0;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
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
  const coletados = [];
  const statusFontes = [];

  for (const fonte of fontesHtml) {
    try {
      const resultado = await coletarFonteHtml(fonte);
      coletados.push(...resultado.itens.slice(0, MAX_POR_FONTE));
      statusFontes.push({
        fonte: fonte.nome,
        ok: true,
        encontrados: resultado.itens.length,
        capa: Boolean(fonte.homepage),
        rota: resultado.rota,
        fallback: resultado.fallback
      });
    } catch (erro) {
      statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message, capa: Boolean(fonte.homepage) });
    }
  }

  for (const fonte of fontesRss) {
    try {
      const resultado = await baixarComFallback(fonte);
      const itens = parseRss(resultado.conteudo, fonte);
      coletados.push(...itens.slice(0, MAX_POR_FONTE));
      statusFontes.push({
        fonte: fonte.nome,
        ok: true,
        encontrados: itens.length,
        rota: resultado.rota,
        fallback: resultado.fallback
      });
    } catch (erro) {
      statusFontes.push({ fonte: fonte.nome, ok: false, erro: erro.message });
    }
  }

  for (const item of coletados) {
    item.imagem = await resolverImagem(
      { titulo: item.titulo, url: item.url, resumo: item.resumoFonte, imagem: item.imagem },
      coletados
    );
  }

  coletados.sort((a, b) => b.data - a.data);
  const novas = [];
  for (const item of coletados) {
    if (jaExiste(item, [...existentes, ...novas])) continue;
    novas.push({
      id: idDaUrl(item.url),
      titulo: item.titulo,
      categoria: item.categoria,
      dataFonte: item.data.toISOString(),
      fonteNome: item.fonteNome,
      urlFonte: item.url,
      resumoFonte: item.resumoFonte,
      imagem: item.imagem || '',
      descobertaEm: AGORA.toISOString(),
      status: 'pendente'
    });
  }

  const publicadas = existentes.filter(p => p.status === 'publicada').slice(0, 200);
  const pendentes = [...novas, ...existentes.filter(p => p.status !== 'publicada')]
    .sort((a, b) => new Date(b.dataFonte || b.descobertaEm) - new Date(a.dataFonte || a.descobertaEm))
    .slice(0, MAX_PAUTAS_PENDENTES);

  const saida = {
    atualizadoEm: AGORA.toISOString(),
    observacao: 'Pautas coletadas automaticamente. Folha, Estadão, O Globo e Veja entram como pauta bruta; a reescrita de Política Nacional aplica a régua editorial. Não publicar sem pesquisa multifonte e redação própria.',
    portaisPrioritarios: [
      'agazeta.com.br', 'folhavitoria.com.br', 'tribunaonline.com.br', 'revistaoeste.com', 'gazetadopovo.com.br',
      'pm.es.gov.br', 'sejus.es.gov.br', 'iases.es.gov.br', 'camara.leg.br',
      'folha.uol.com.br', 'estadao.com.br', 'oglobo.globo.com', 'veja.abril.com.br',
      'correiobraziliense.com.br', 'g1.globo.com', 'uol.com.br', 'cnnbrasil.com.br', 'band.com.br', 'cbn.globo.com'
    ],
    pautas: [...pendentes, ...publicadas]
  };

  await fs.writeFile(ARQUIVO_PAUTAS, `${JSON.stringify(saida, null, 2)}\n`, 'utf8');
  await fs.writeFile(
    ARQUIVO_STATUS,
    `${JSON.stringify({
      atualizadoEm: AGORA.toISOString(),
      modo: 'coleta-de-pautas-e-manchetes-de-capa',
      novasPautas: novas.length,
      pautasPendentes: pendentes.length,
      fontes: statusFontes
    }, null, 2)}\n`,
    'utf8'
  );
  console.log(`Coleta concluída: ${novas.length} nova(s) pauta(s); ${pendentes.length} pendente(s).`);
}

principal().catch(erro => {
  console.error(erro);
  process.exitCode = 1;
});
