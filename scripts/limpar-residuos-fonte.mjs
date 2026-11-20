// Remove do acervo publicado os parágrafos que são resíduo de outros sites
// (ver scripts/residuos-fonte.mjs) e os trechos grudados em parágrafos.
//
// Uso:
//   node scripts/limpar-residuos-fonte.mjs            simula e lista o que sairia
//   node scripts/limpar-residuos-fonte.mjs --aplicar  grava as alterações
import fs from "node:fs";
import path from "node:path";
import { residuoDaFonte, cortarTrechos } from "./residuos-fonte.mjs";

const aplicar = process.argv.includes("--aplicar");
const raiz = process.cwd();
const dados = fs.readdirSync(raiz).filter((f) => /^(?:auto-redacao-.*|noticias|editorial.*|opiniao|fe-sociedade.*|manual-.*)\.js$/.test(f));
const paginas = fs.existsSync(path.join(raiz, "m")) ? fs.readdirSync(path.join(raiz, "m")).filter((f) => f.endsWith(".html")).map((f) => "m/" + f) : [];

// Em arquivos .js o HTML está dentro de strings: desfazemos os escapes só para ler o texto.
const ler = (bruto, js) => js ? bruto.replace(/\\(["'\\/])/g, "$1").replace(/\\n/g, " ") : bruto;

const removidos = new Map();
const resumo = { arquivosAlterados: 0, paragrafos: 0, trechos: 0 };
for (const arquivo of [...dados, ...paginas]) {
  const js = arquivo.endsWith(".js");
  const caminho = path.join(raiz, arquivo);
  const original = fs.readFileSync(caminho, "utf8");
  let n = 0;
  let texto = original.replace(/<p\b[^>]*>((?:(?!<\/p>)[\s\S])*?)<\/p>/gi, (inteiro, dentro) => {
    if (!residuoDaFonte(ler(dentro, js))) return inteiro;
    n++;
    const chave = ler(dentro, js).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    removidos.set(chave, (removidos.get(chave) || 0) + 1);
    return "";
  });
  const antesTrechos = texto;
  texto = cortarTrechos(texto);
  if (texto !== antesTrechos) resumo.trechos++;
  if (texto !== original) {
    resumo.arquivosAlterados++;
    resumo.paragrafos += n;
    if (aplicar) fs.writeFileSync(caminho, texto);
  }
}

if (!aplicar) {
  for (const [t, c] of [...removidos.entries()].sort((a, b) => b[1] - a[1])) console.log(String(c).padStart(4), t);
}
console.log(JSON.stringify({ modo: aplicar ? "aplicado" : "simulação", arquivosDeDados: dados.length, paginas: paginas.length, ...resumo, frasesDistintas: removidos.size }));
