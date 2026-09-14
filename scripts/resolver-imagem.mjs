const USER_AGENT = 'NoticiaESBot/2.2 (+https://noticiaes.com.br)';

const RETRATOS_OFICIAIS = [
  { re: /\bfl[aá]vio bolsonaro\b|\bfl[aá]vio\b(?=.*bolsonaro)/i, img: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5894.jpg', nome: 'Flávio Bolsonaro' },
  { re: /\bricardo ferra[cç]o\b|\bferra[cç]o\b/i, img: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador1023.jpg', nome: 'Ricardo Ferraço' },
  { re: /\brenato casagrande\b|\bcasagrande\b/i, img: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador12.jpg', nome: 'Renato Casagrande' },
  { re: /\blula\b|\bluiz in[aá]cio\b/i, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Lula_-_foto_oficial_2023.jpg/800px-Lula_-_foto_oficial_2023.jpg', nome: 'Lula' },
  { re: /\bjair bolsonaro\b|\bbolsonaro\b(?!.*fl[aá]vio)/i, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jair_Bolsonaro_2022.jpg/800px-Jair_Bolsonaro_2022.jpg', nome: 'Jair Bolsonaro' },
  { re: /\bhelder salom[aã]o\b|\bhelder\b/i, img: 'https://www.camara.leg.br/internet/deputado/bandep/204394.jpg', nome: 'Helder Salomão' },
  { re: /\blorenzo pazolini\b|\bpazolini\b/i, img: 'https://www.camara.leg.br/internet/deputado/bandep/204378.jpg', nome: 'Lorenzo Pazolini' },
  { re: /\brose de freitas\b|\brose\b(?=.*senado|rejei)/i, img: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador739.jpg', nome: 'Rose de Freitas' },
  { re: /\bfabiano contarato\b|\bcontarato\b/i, img: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5953.jpg', nome: 'Fabiano Contarato' }
];

const BUSCAS_MESMA_PAUTA = [
  q => `https://www.agazeta.com.br/busca/?q=${encodeURIComponent(q)}`,
  q => `https://www.folhavitoria.com.br/?s=${encodeURIComponent(q)}`
];

export function decodeHtml(texto = '') {
  return String(texto)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ordm;/g, 'º')
    .replace(/&ordf;/g, 'ª')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

export function ehImagemDeFonte(url = '') {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  const u = url.toLowerCase();
  if (/(logo|favicon|sprite|placeholder|placehold\.co|default[-_]?image|avatar-default|tracking|1x1|pixel\.gif|\/icons?\/|icon[-_.]|auto-politica|auto-seguranca|\.svg(\?|$))/i.test(u)) return false;
  return true;
}

export function absolutizar(url, base) {
  try { return new URL(url, base).href; } catch { return ''; }
}

export function meta(html, chave, atributo = 'property') {
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

export async function baixar(url) {
  const resposta = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8' },
    redirect: 'follow',
    signal: AbortSignal.timeout(18000)
  });
  if (!resposta.ok) throw new Error(`${resposta.status} ${resposta.statusText}`);
  return resposta.text();
}

export function extrairImagemFonte(html, paginaUrl) {
  const candidatos = [
    meta(html, 'og:image'),
    meta(html, 'og:image:secure_url'),
    meta(html, 'og:image:url'),
    meta(html, 'twitter:image', 'name'),
    meta(html, 'twitter:image:src', 'name'),
    decodeHtml(html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i)?.[1] || ''),
    decodeHtml(html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']image_src["']/i)?.[1] || '')
  ].filter(Boolean);

  for (const raw of candidatos) {
    const abs = absolutizar(raw, paginaUrl);
    if (ehImagemDeFonte(abs)) return abs;
  }

  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  for (const m of imgs) {
    const abs = absolutizar(decodeHtml(m[1]), paginaUrl);
    if (!ehImagemDeFonte(abs)) continue;
    if (/(logo|header|footer|banner-ads|publicidade|avatar|icon)/i.test(abs)) continue;
    return abs;
  }
  return '';
}

export function retratoOficial(titulo = '') {
  for (const item of RETRATOS_OFICIAIS) {
    if (item.re.test(titulo)) return item.img;
  }
  return '';
}

function termosBusca(titulo = '') {
  return String(titulo)
    .replace(/[-\u2013\u2014|:].*$/, '')
    .replace(/\b(diz|aponta|mostra|segundo|para o|no es|em vit[oó]ria)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(p => p.length > 3)
    .slice(0, 8)
    .join(' ');
}

async function imagemMesmaPautaNaWeb(titulo) {
  const q = termosBusca(titulo);
  if (q.split(' ').length < 3) return '';
  for (const montar of BUSCAS_MESMA_PAUTA) {
    try {
      const html = await baixar(montar(q));
      const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)]
        .map(m => m[1])
        .filter(u => /agazeta\.com\.br\/.+|folhavitoria\.com\.br\/.+/.test(u))
        .filter(u => !/\/(busca|search|tag|categoria|autor)\b/i.test(u))
        .slice(0, 4);
      for (const href of links) {
        const url = href.startsWith('http') ? href : `https:${href}`;
        try {
          const pagina = await baixar(url);
          const img = extrairImagemFonte(pagina, url);
          if (img) {
            console.log(`[imagem] mesma pauta em outro veículo: ${url}`);
            return img;
          }
        } catch {
          /* próximo */
        }
      }
    } catch (erro) {
      console.warn(`[imagem] busca irmã falhou: ${erro.message}`);
    }
  }
  return '';
}

export function imagemEntrePares(item, pares = []) {
  const alvo = item.titulo || '';
  let melhor = { score: 0, img: '' };
  for (const outro of pares) {
    if (!outro?.imagem || outro.url === item.url) continue;
    const sa = new Set(alvo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(x => x.length > 2));
    const sb = new Set(String(outro.titulo || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(x => x.length > 2));
    if (!sa.size || !sb.size) continue;
    let inter = 0;
    for (const x of sa) if (sb.has(x)) inter++;
    const score = inter / Math.max(sa.size, sb.size);
    if (score > melhor.score) melhor = { score, img: outro.imagem };
  }
  return melhor.score >= 0.45 ? melhor.img : '';
}

export async function resolverImagem(item, pares = []) {
  if (ehImagemDeFonte(item.imagem)) return item.imagem;

  if (item.url) {
    try {
      const html = await baixar(item.url);
      const daFonte = extrairImagemFonte(html, item.url);
      if (daFonte) return daFonte;
    } catch (erro) {
      console.warn(`[imagem] fonte original sem foto: ${item.url} (${erro.message})`);
    }
  }

  const irmao = imagemEntrePares(item, pares);
  if (irmao) return irmao;

  const web = await imagemMesmaPautaNaWeb(item.titulo || '');
  if (web) return web;

  const oficial = retratoOficial(`${item.titulo || ''} ${item.resumo || ''}`);
  if (oficial) {
    console.log(`[imagem] retrato oficial para: ${item.titulo}`);
    return oficial;
  }

  return '';
}
