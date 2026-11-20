// Gera indice-noticias.json: a lista final de matérias que a capa mostra,
// só com os campos dos cards (sem o texto completo).
//
// A capa carregava ~1.700 arquivos JS (33 MB) para montar essa lista. Aqui
// reproduzimos a mesma ordem de carga do index.html, inclusive os scripts
// injetados com document.write (auto-manifest.js, skin/loader.js) e os
// scripts de correção que trocam imagem, reordenam ou inserem matérias.
// O resultado é a mesma lista `noticias` que o navegador teria.
//
// Uso: node scripts/gerar-indice-noticias.mjs [--verificar]
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const raiz = process.cwd();
const ORIGEM = "https://noticiaes.com.br/";
const SAIDA = "indice-noticias.json";
const SAIDA_CAPA = "indice-capa.json";
const CAPA = 60;

// Scripts que só mexem na página (ou que a capa leve continua carregando);
// não entram na geração do índice.
// imagem-policy.js FICA na geração: ele define imagem padrão/reserva nos dados.
const SO_PAGINA = new Set(["analytics.js", "monetization.js", "script.js", "share-bar.js"]);
const CAMPOS = ["id", "slug", "titulo", "categoria", "data", "publicadoEm", "autor", "resumo", "imagem", "urlCanonica", "automatico", "ocultarResumoVisivel", "imagemFallback"];

// A lista de scripts vem da capa completa (a capa leve, index.html, não carrega os dados).
const html = fs.readFileSync(path.join(raiz, "capa-completa.html"), "utf8");
const scriptsDaCapa = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)]
  .map((m) => m[1].split("?")[0].replace(/^\//, ""))
  .filter((f) => !SO_PAGINA.has(f));

const timers = [];
let atual = "";
const escritos = [];
const noop = () => {};
const elemento = () => ({ style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, setAttribute: noop, appendChild: noop, insertAdjacentHTML: noop, addEventListener: noop, querySelector: () => null, querySelectorAll: () => [] });
const documento = {
  write: (s) => { for (const m of String(s).matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) escritos.push(m[1]); },
  querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
  addEventListener: noop, removeEventListener: noop, createElement: elemento,
  get currentScript() { return { src: new URL(atual, ORIGEM).href }; },
  body: { ...elemento(), dataset: { pagina: "home" } }, head: elemento(), documentElement: elemento(),
  readyState: "loading", hidden: false, cookie: "",
};
const contexto = vm.createContext({
  console: { log: noop, info: noop, warn: noop, error: noop },
  document: documento,
  location: new URL(ORIGEM),
  navigator: { userAgent: "gerar-indice", language: "pt-BR" },
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  sessionStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  setTimeout: (fn) => { if (typeof fn === "function") timers.push(fn); return timers.length; },
  clearTimeout: noop, setInterval: () => 0, clearInterval: noop,
  requestAnimationFrame: (fn) => { timers.push(fn); return 0; },
  MutationObserver: class { observe() {} disconnect() {} },
  IntersectionObserver: class { observe() {} disconnect() {} },
  fetch: () => Promise.reject(new Error("sem rede na geração")),
  URL, URLSearchParams, Intl, Date, Math, JSON,
});
contexto.window = contexto;
contexto.self = contexto;

const erros = [];
function executar(arquivo) {
  const caminho = new URL(arquivo, new URL(atual || "", ORIGEM)).pathname.replace(/^\//, "");
  const local = path.join(raiz, decodeURIComponent(caminho));
  if (!fs.existsSync(local)) { erros.push(`${caminho}: arquivo não existe`); return; }
  const anterior = atual;
  atual = caminho;
  const inicio = escritos.length;
  try {
    vm.runInContext(fs.readFileSync(local, "utf8"), contexto, { filename: caminho, timeout: 5000 });
  } catch (e) {
    // O navegador também segue em frente quando um script falha.
    erros.push(`${caminho}: ${e.message}`);
  }
  // Scripts escritos com document.write rodam logo depois do script que os escreveu.
  const novos = escritos.splice(inicio);
  for (const src of novos) executar(src.split("?")[0]);
  atual = anterior;
}

for (const f of scriptsDaCapa) executar(f);
for (let i = 0; i < timers.length && i < 10000; i++) {
  try { timers[i](); } catch (e) { erros.push(`timer: ${e.message}`); }
}

const lista = vm.runInContext("typeof noticias !== 'undefined' && Array.isArray(noticias) ? noticias : []", contexto);
if (!lista.length) {
  console.error("Nenhuma matéria encontrada; índice não gerado.", erros);
  process.exit(1);
}
const indice = lista.filter((n) => n && n.slug && n.titulo).map((n) => {
  const o = {};
  for (const c of CAMPOS) if (n[c] !== undefined && n[c] !== null && n[c] !== "") o[c] = n[c];
  return o;
});

const geradoEm = new Date().toISOString();
const json = JSON.stringify({ geradoEm, total: indice.length, parcial: false, noticias: indice });
// A capa abre só com as mais recentes; o resto vem de SAIDA quando o leitor pede.
const capa = JSON.stringify({ geradoEm, total: indice.length, parcial: true, noticias: indice.slice(0, CAPA) });
if (process.argv.includes("--verificar")) {
  console.log(JSON.stringify({ scripts: scriptsDaCapa.length, materias: indice.length, erros }, null, 1));
} else {
  fs.writeFileSync(path.join(raiz, SAIDA), json + "\n");
  fs.writeFileSync(path.join(raiz, SAIDA_CAPA), capa + "\n");
  console.log(`${SAIDA}: ${indice.length} matérias, ${(json.length / 1e6).toFixed(2)} MB; ${SAIDA_CAPA}: ${Math.min(CAPA, indice.length)} matérias, ${(capa.length / 1e3).toFixed(0)} KB. Avisos: ${erros.length}.`);
  for (const e of erros) console.log("  aviso:", e);
}
