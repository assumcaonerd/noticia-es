import fs from 'node:fs/promises';

const blocoCorreto = `  const mapa = {
    '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>',
    '&nbsp;': ' ', '&ordm;': 'º', '&ordf;': 'ª'
  };`;

function localizarDecodeHtml(texto, caminho) {
  const assinatura = /(?:export\s+)?function\s+decodeHtml\(texto\s*=\s*''\)\s*\{/;
  const encontrado = assinatura.exec(texto);
  if (!encontrado) throw new Error(`Função decodeHtml não encontrada em ${caminho}.`);
  return encontrado.index;
}

function repararMapaHtml(texto, caminho) {
  const inicio = localizarDecodeHtml(texto, caminho);
  const trecho = texto.slice(inicio);
  const mapa = /(^|\n)([ \t]*)const\s+mapa\s*=\s*\{[\s\S]*?\};/.exec(trecho);

  if (!mapa) return { texto, alterado: false, encontrouMapa: false };

  const inicioMapa = inicio + mapa.index + mapa[1].length;
  const fimMapa = inicio + mapa.index + mapa[0].length;
  const atual = texto.slice(inicioMapa, fimMapa);

  if (atual === blocoCorreto) return { texto, alterado: false, encontrouMapa: true };

  return {
    texto: texto.slice(0, inicioMapa) + blocoCorreto + texto.slice(fimMapa),
    alterado: true,
    encontrouMapa: true
  };
}

function repararDecodeEncadeado(texto) {
  const substituicoes = [
    [".replace(/&/g, '&')", ".replace(/&amp;/g, '&')"],
    [".replace(/\"/g, '\"')", ".replace(/&quot;/g, '\"')"],
    [".replace(/&#39;|'/g, \"'\")", ".replace(/&#39;|&apos;/g, \"'\")"],
    [".replace(/</g, '<')", ".replace(/&lt;/g, '<')"],
    [".replace(/>/g, '>')", ".replace(/&gt;/g, '>')"]
  ];

  let alterado = false;
  for (const [errado, correto] of substituicoes) {
    if (texto.includes(errado)) {
      texto = texto.replaceAll(errado, correto);
      alterado = true;
    }
  }
  return { texto, alterado };
}

function removerEsHoje(texto) {
  const antes = texto;
  texto = texto
    .split('\n')
    .filter(linha => !linha.includes("nome: 'ES Hoje - Capa'") && !linha.includes("'eshoje.com.br'"))
    .join('\n');
  texto = texto
    .replace(/,\s*'eshoje\.com\.br'/g, '')
    .replace(/'eshoje\.com\.br'\s*,\s*/g, '');
  return { texto, alterado: texto !== antes };
}

async function reparar(caminho) {
  let texto = await fs.readFile(caminho, 'utf8');
  localizarDecodeHtml(texto, caminho);
  let alterado = false;

  const mapa = repararMapaHtml(texto, caminho);
  texto = mapa.texto;
  alterado ||= mapa.alterado;

  if (!mapa.encontrouMapa) {
    const encadeado = repararDecodeEncadeado(texto);
    texto = encadeado.texto;
    alterado ||= encadeado.alterado;
  }

  if (caminho === 'scripts/coletar-pautas.mjs') {
    const semEsHoje = removerEsHoje(texto);
    texto = semEsHoje.texto;
    if (semEsHoje.alterado) {
      alterado = true;
      console.log(`${caminho}: ES Hoje removido permanentemente da coleta.`);
    }
  }

  if (!alterado) {
    console.log(`${caminho}: já está correto.`);
    return false;
  }

  await fs.writeFile(caminho, texto, 'utf8');
  console.log(`${caminho}: reparado.`);
  return true;
}

await reparar('scripts/coletar-pautas.mjs');
await reparar('scripts/resolver-imagem.mjs');
