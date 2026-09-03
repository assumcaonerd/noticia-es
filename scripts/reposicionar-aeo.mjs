#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DIR = path.join(RAIZ, 'm');

function reposicionar(html) {
  const aeoRe = /\s*(<section class="aeo-resumo"[\s\S]*?<\/section>)\s*/i;
  const aeoMatch = html.match(aeoRe);
  if (!aeoMatch) return html;

  const aeo = aeoMatch[1];
  let semAeo = html.replace(aeoRe, '\n');

  const conteudoIni = semAeo.indexOf('<div class="conteudo-materia">');
  if (conteudoIni < 0) return html;

  const depoisInicio = semAeo.slice(conteudoIni);
  const h2Match = depoisInicio.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/i);
  if (h2Match) {
    const pos = conteudoIni + h2Match.index + h2Match[0].length;
    return semAeo.slice(0, pos) + '\n  ' + aeo + semAeo.slice(pos);
  }

  let posBusca = conteudoIni;
  let posTerceiroP = -1;
  for (let i = 0; i < 3; i++) {
    const p = semAeo.indexOf('</p>', posBusca);
    if (p < 0) break;
    posTerceiroP = p + 4;
    posBusca = posTerceiroP;
  }
  if (posTerceiroP > 0) {
    return semAeo.slice(0, posTerceiroP) + '\n  ' + aeo + semAeo.slice(posTerceiroP);
  }

  const fontes = semAeo.indexOf('<section class="fontes-materia"');
  if (fontes > 0) return semAeo.slice(0, fontes) + aeo + '\n  ' + semAeo.slice(fontes);

  return semAeo.replace('</article>', `${aeo}\n</article>`);
}

let arquivos = [];
try {
  arquivos = (await fs.readdir(DIR)).filter(f => f.endsWith('.html'));
} catch {
  console.log('[aeo-posicao] diretório m inexistente.');
  process.exit(0);
}

let alteradas = 0;
for (const arquivo of arquivos) {
  const caminho = path.join(DIR, arquivo);
  const html = await fs.readFile(caminho, 'utf8');
  if (!/<section class="aeo-resumo"/i.test(html)) continue;
  const novo = reposicionar(html);
  if (novo !== html) {
    await fs.writeFile(caminho, novo, 'utf8');
    alteradas++;
  }
}

console.log(`[aeo-posicao] ${alteradas} página(s) com AEO reposicionado após a abertura editorial.`);
