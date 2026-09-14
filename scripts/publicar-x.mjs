import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const X_ENDPOINT = 'https://api.x.com/2/tweets';
const MAX_POSTS_POR_EXECUCAO = 10;
const SITE = 'https://noticiaes.com.br';

const credenciais = {
  consumerKey: process.env.X_API_KEY || '',
  consumerSecret: process.env.X_API_SECRET || '',
  accessToken: process.env.X_ACCESS_TOKEN || '',
  accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || ''
};

function executarGit(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe']
  }).trim();
}

function percentEncode(valor) {
  return encodeURIComponent(String(valor))
    .replace(/[!'()*]/g, caractere => `%${caractere.charCodeAt(0).toString(16).toUpperCase()}`);
}

function oauthHeader(method, url) {
  const oauth = {
    oauth_consumer_key: credenciais.consumerKey,
    oauth_nonce: crypto.randomBytes(18).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: credenciais.accessToken,
    oauth_version: '1.0'
  };

  const parametros = Object.entries(oauth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chave, valor]) => `${percentEncode(chave)}=${percentEncode(valor)}`)
    .join('&');

  const base = [method.toUpperCase(), percentEncode(url), percentEncode(parametros)].join('&');
  const chave = `${percentEncode(credenciais.consumerSecret)}&${percentEncode(credenciais.accessTokenSecret)}`;
  oauth.oauth_signature = crypto.createHmac('sha1', chave).update(base).digest('base64');

  return 'OAuth ' + Object.entries(oauth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chaveOauth, valor]) => `${percentEncode(chaveOauth)}="${percentEncode(valor)}"`)
    .join(', ');
}

function decodeHtml(valor = '') {
  return String(valor)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function atributoMeta(html, atributo, valor) {
  const escaped = valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const padrao1 = new RegExp(`<meta[^>]+${atributo}=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  const padrao2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${atributo}=["']${escaped}["'][^>]*>`, 'i');
  const match = html.match(padrao1) || html.match(padrao2);
  return match ? decodeHtml(match[1].trim()) : '';
}

function extrairPagina(arquivo) {
  const html = fs.readFileSync(arquivo, 'utf8');
  const ogTitulo = atributoMeta(html, 'property', 'og:title') || atributoMeta(html, 'name', 'twitter:title');
  const tituloTag = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s*\|\s*Notícia ES\s*$/i, '') || '';
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1]
    || atributoMeta(html, 'property', 'og:url');
  const slug = path.basename(arquivo, '.html');

  return {
    slug,
    titulo: decodeHtml(ogTitulo || tituloTag).trim(),
    url: decodeHtml(canonical || `${SITE}/m/${encodeURIComponent(slug)}.html`).trim()
  };
}

function limitarTexto(texto, limite) {
  const chars = Array.from(texto);
  if (chars.length <= limite) return texto;
  return `${chars.slice(0, Math.max(0, limite - 1)).join('').trimEnd()}…`;
}

function montarPost(materia) {
  // O X encurta URLs; manter o título abaixo de 230 caracteres deixa folga no limite do post.
  return `${limitarTexto(materia.titulo, 230)}\n\n${materia.url}`;
}

function listarPaginasNovas() {
  const paginaManual = process.env.X_PAGINA_MANUAL?.trim();
  if (paginaManual) {
    if (!/^m\/[a-z0-9._-]+\.html$/i.test(paginaManual) || !fs.existsSync(paginaManual)) {
      throw new Error(`Página manual inválida ou inexistente: ${paginaManual}`);
    }
    return [paginaManual];
  }

  const sha = process.env.GITHUB_SHA_ATUAL || process.env.GITHUB_SHA || 'HEAD';
  const before = process.env.GITHUB_BEFORE || '';
  let saida = '';

  if (before && !/^0+$/.test(before)) {
    saida = executarGit(['diff', '--diff-filter=A', '--name-only', before, sha, '--', 'm/*.html']);
  } else {
    saida = executarGit(['show', '--pretty=', '--diff-filter=A', '--name-only', sha, '--', 'm/*.html']);
  }

  return [...new Set(saida.split(/\r?\n/).map(v => v.trim()).filter(v => /^m\/.+\.html$/i.test(v)))]
    .slice(0, MAX_POSTS_POR_EXECUCAO);
}

function nomeRecibo(slug) {
  const seguro = String(slug).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  return `publicacoes-x/${seguro}.json`;
}

function reciboJaExiste(relativo) {
  if (fs.existsSync(relativo)) return true;
  try {
    executarGit(['cat-file', '-e', `origin/main:${relativo}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function publicarNoX(texto) {
  const resposta = await fetch(X_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: oauthHeader('POST', X_ENDPOINT),
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'NoticiaES-SocialBot/1.0'
    },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(30000)
  });

  const corpoTexto = await resposta.text();
  let corpo;
  try {
    corpo = JSON.parse(corpoTexto);
  } catch {
    corpo = { raw: corpoTexto };
  }

  if (!resposta.ok || !corpo?.data?.id) {
    throw new Error(`X API ${resposta.status}: ${JSON.stringify(corpo).slice(0, 1200)}`);
  }

  return corpo.data;
}

async function main() {
  const faltando = Object.entries(credenciais).filter(([, valor]) => !valor).map(([chave]) => chave);
  if (faltando.length) {
    console.log('X ainda não conectado. Nenhuma postagem será enviada.');
    console.log('Configure X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN e X_ACCESS_TOKEN_SECRET nos Secrets do repositório.');
    return;
  }

  try {
    executarGit(['fetch', '-q', 'origin', 'main']);
  } catch (erro) {
    console.warn(`Aviso: não foi possível atualizar origin/main para deduplicação: ${erro.message}`);
  }

  const paginas = listarPaginasNovas();
  if (!paginas.length) {
    console.log('Nenhuma nova página de matéria para publicar no X.');
    return;
  }

  fs.mkdirSync('publicacoes-x', { recursive: true });
  const erros = [];
  let publicadas = 0;

  for (const arquivo of paginas) {
    try {
      const materia = extrairPagina(arquivo);
      if (!materia.titulo || !materia.url) {
        throw new Error(`Metadados insuficientes em ${arquivo}`);
      }

      const recibo = nomeRecibo(materia.slug);
      if (reciboJaExiste(recibo)) {
        console.log(`Já publicado no X: ${materia.slug}`);
        continue;
      }

      const texto = montarPost(materia);
      const resultado = await publicarNoX(texto);
      const postadoEm = new Date().toISOString();
      const registro = {
        slug: materia.slug,
        titulo: materia.titulo,
        materiaUrl: materia.url,
        xPostId: resultado.id,
        xUrl: `https://x.com/i/web/status/${resultado.id}`,
        postadoEm
      };

      fs.writeFileSync(recibo, `${JSON.stringify(registro, null, 2)}\n`, 'utf8');
      publicadas += 1;
      console.log(`Publicado no X: ${materia.titulo} -> ${registro.xUrl}`);
    } catch (erro) {
      erros.push(`${arquivo}: ${erro.message}`);
      console.error(`Falha ao publicar ${arquivo}:`, erro.message);
    }
  }

  console.log(`X: ${publicadas} nova(s) matéria(s) publicada(s).`);
  if (erros.length) {
    console.error(`X: ${erros.length} falha(s):\n- ${erros.join('\n- ')}`);
    process.exitCode = 1;
  }
}

await main();
