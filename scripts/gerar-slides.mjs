#!/usr/bin/env node
/**
 * Gera cards editoriais 1080x1350 para as matérias do Notícia ES.
 * Uso:
 *   node scripts/gerar-slides.mjs m/slug.html [...]
 * Sem argumentos, gera o card da matéria mais recente.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = process.cwd();
const DIR_MATERIAS = path.join(RAIZ, 'm');
const DIR_SLIDES = path.join(RAIZ, 'slides');
const LARGURA = 1080;
const ALTURA = 1350;

function desescaparHtml(texto = '') {
  return String(texto)
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function escaparXml(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extrair(html, regex, fallback = '') {
  const achado = String(html).match(regex);
  return desescaparHtml(achado?.[1] || fallback).replace(/\s+/g, ' ').trim();
}

function quebrarLinhas(texto, limite, maximo) {
  const palavras = texto.trim().split(/\s+/);
  const linhas = [];
  let linha = '';
  for (const palavra of palavras) {
    const candidata = linha ? `${linha} ${palavra}` : palavra;
    if (candidata.length <= limite || !linha) {
      linha = candidata;
      continue;
    }
    linhas.push(linha);
    linha = palavra;
    if (linhas.length === maximo - 1) break;
  }
  if (linha && linhas.length < maximo) linhas.push(linha);

  const usadas = linhas.join(' ').split(/\s+/).length;
  if (usadas < palavras.length && linhas.length) {
    linhas[linhas.length - 1] = `${linhas[linhas.length - 1].replace(/[.,;:!?]?$/, '')}…`;
  }
  return linhas;
}

function blocoTexto(linhas, x, y, tamanho, alturaLinha, peso = 700, cor = '#071b3c') {
  return `<text x="${x}" y="${y}" fill="${cor}" font-family="Arial, Helvetica, sans-serif" font-size="${tamanho}" font-weight="${peso}">${linhas.map((linha, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : alturaLinha}">${escaparXml(linha)}</tspan>`).join('')}</text>`;
}

async function carregarImagem(url) {
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) {
    const local = path.resolve(RAIZ, url.replace(/^\//, ''));
    return await fs.readFile(local);
  }
  let ultimoErro;
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      const resposta = await fetch(url, {
        signal: AbortSignal.timeout(45000),
        headers: {
          'user-agent': 'Mozilla/5.0 NoticiaES/1.0',
          accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return Buffer.from(await resposta.arrayBuffer());
    } catch (erro) {
      ultimoErro = erro;
      console.warn(`[slide] tentativa ${tentativa} falhou: ${url} (${erro.message})`);
    }
  }
  console.warn(`[slide] imagem indisponível após nova tentativa: ${url} (${ultimoErro?.message || 'erro desconhecido'})`);
  return null;
}

async function imagemCapaDataUri(buffer) {
  if (!buffer) return '';
  const jpg = await sharp(buffer)
    .rotate()
    .resize(984, 540, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
    .toBuffer();
  return `data:image/jpeg;base64,${jpg.toString('base64')}`;
}

function lerMateria(html, arquivo) {
  const slug = path.basename(arquivo, '.html');
  return {
    slug,
    titulo: extrair(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i, extrair(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i, slug)),
    resumo: extrair(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    imagem: extrair(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i),
    categoria: extrair(html, /<div\s+class="materia-meta">\s*([^·<]+)/i, 'Notícia ES'),
    publicadoEm: extrair(html, /"datePublished":"([^"]+)"/i)
  };
}

function montarSvg(materia, imagemData) {
  const tituloMaiusculo = materia.titulo.toLocaleUpperCase('pt-BR');
  let tamanhoTitulo = 56;
  let limiteTitulo = 24;
  if (tituloMaiusculo.length > 85) { tamanhoTitulo = 51; limiteTitulo = 28; }
  if (tituloMaiusculo.length > 125) { tamanhoTitulo = 45; limiteTitulo = 32; }
  const linhasTitulo = quebrarLinhas(tituloMaiusculo, limiteTitulo, 4);
  const alturaLinhaTitulo = Math.round(tamanhoTitulo * 1.06);
  const tituloY = 290;
  const tituloFim = tituloY + (linhasTitulo.length - 1) * alturaLinhaTitulo;

  const linhasResumo = quebrarLinhas(materia.resumo, 62, 3);
  const resumoY = tituloFim + 66;
  const resumoFim = resumoY + (linhasResumo.length - 1) * 42;
  const imagemY = Math.max(650, resumoFim + 56);
  const imagemH = 1210 - imagemY;
  const categoria = materia.categoria.toLocaleUpperCase('pt-BR');
  const imagem = imagemData
    ? `<image x="48" y="${imagemY}" width="984" height="${imagemH}" href="${imagemData}" preserveAspectRatio="xMidYMid slice" clip-path="url(#foto)"/>`
    : `<rect x="48" y="${imagemY}" width="984" height="${imagemH}" rx="8" fill="#e9eef7"/><path d="M48 ${imagemY + imagemH} L420 ${imagemY + 120} L650 ${imagemY + 350} L820 ${imagemY + 210} L1032 ${imagemY + imagemH} Z" fill="#d9e3f2"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${ALTURA}" viewBox="0 0 ${LARGURA} ${ALTURA}">
  <defs><clipPath id="foto"><rect x="48" y="${imagemY}" width="984" height="${imagemH}" rx="8"/></clipPath></defs>
  <rect width="1080" height="1350" fill="#ffffff"/>
  <path d="M760 0 H1080 V220 Z" fill="#f2f6fc"/>
  <g transform="translate(48 42)">
    <path d="M0 0 H44 L111 75 V0 H151 V112 H111 L43 39 V112 H0 Z" fill="#1766d8"/>
    <path d="M160 0 H238 V31 H160 Z M160 41 H228 V72 H160 Z M160 82 H218 V112 H160 Z" fill="#1766d8"/>
    <text x="262" y="83" fill="#071b3c" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700">Notícia <tspan fill="#1766d8">ES</tspan></text>
  </g>
  <rect x="48" y="174" width="984" height="4" fill="#1766d8"/>
  <rect x="48" y="213" width="58" height="4" fill="#1766d8"/>
  <text x="128" y="224" fill="#1766d8" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" letter-spacing="2">${escaparXml(categoria)}</text>
  ${blocoTexto(linhasTitulo, 48, tituloY, tamanhoTitulo, alturaLinhaTitulo, 800)}
  ${blocoTexto(linhasResumo, 48, resumoY, 35, 42, 400, '#4e5969')}
  ${imagem}
  <rect x="48" y="1240" width="984" height="4" fill="#1766d8"/>
  <text x="48" y="1305" fill="#4e5969" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="400">noticiaes.com.br</text>
  </svg>`;
}

async function listarMaterias(argumentos) {
  if (argumentos.length) {
    return argumentos
      .filter(nome => nome.endsWith('.html'))
      .map(nome => path.resolve(RAIZ, nome));
  }
  const arquivos = (await fs.readdir(DIR_MATERIAS))
    .filter(nome => nome.endsWith('.html'))
    .map(nome => path.join(DIR_MATERIAS, nome));
  const materias = [];
  for (const arquivo of arquivos) {
    const html = await fs.readFile(arquivo, 'utf8');
    const materia = lerMateria(html, arquivo);
    if (!/<meta\s+http-equiv=["']refresh["']/i.test(html)) materias.push({ arquivo, materia });
  }
  materias.sort((a, b) => String(b.materia.publicadoEm).localeCompare(String(a.materia.publicadoEm)));
  return materias.slice(0, 1).map(item => item.arquivo);
}

await fs.mkdir(DIR_SLIDES, { recursive: true });
const arquivos = await listarMaterias(process.argv.slice(2));
let gerados = 0;
for (const arquivo of arquivos) {
  try {
    const html = await fs.readFile(arquivo, 'utf8');
    if (/<meta\s+http-equiv=["']refresh["']/i.test(html)) continue;
    const materia = lerMateria(html, arquivo);
    const capa = await carregarImagem(materia.imagem);
    const imagemData = await imagemCapaDataUri(capa);
    const svg = montarSvg(materia, imagemData);
    const destino = path.join(DIR_SLIDES, `${materia.slug}.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: false }).toFile(destino);
    console.log(`[slide] ${path.relative(RAIZ, destino)} (${LARGURA}x${ALTURA})`);
    gerados++;
  } catch (erro) {
    console.error(`[slide] falha em ${path.relative(RAIZ, arquivo)}: ${erro.message}`);
    process.exitCode = 1;
  }
}
console.log(`[slide] ${gerados} arte(s) gerada(s).`);
