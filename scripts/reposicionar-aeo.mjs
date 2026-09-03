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
  const semAeo = html.replace(aeoRe, '\n');

  const fontes = semAeo.indexOf('<section class="fontes-materia"');
  if (fontes >= 0) {
    return semAeo.slice(0, fontes) + `  ${aeo}\n  ` + semAeo.slice(fontes);
  }

  const articleFim = semAeo.indexOf('</article>');
  if (articleFim >= 0) {
    return semAeo.slice(0, articleFim) + `  ${aeo}\n` + semAeo.slice(articleFim);
  }

  return html;
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

console.log(`[aeo-posicao] ${alteradas} página(s) com AEO imediatamente antes de Fontes.`);
