/* NOTÍCIA ES - MANIFESTO DE MATÉRIAS AUTOMÁTICAS
   Arquivo pequeno e seguro para carregar shards gerados pela redação automática.
   Cada shard é um JS independente e imutável. */
const noticiasAutoArquivos = [
  "auto-redacao-20260831-034700.js",
  "auto-redacao-20260830-233800.js",
  "auto-redacao-20260830-224800.js",
  "auto-redacao-20260830-214800.js",
  "auto-redacao-20260830-204500.js",
  "auto-redacao-20260830-183348.js",
  "auto-redacao-20260830-173849.js",
  "auto-redacao-20260830-173025.js",
  "auto-redacao-20260830-164745.js",
  "auto-redacao-20260830-154200.js"
];
for (const arquivo of noticiasAutoArquivos) {
  document.write(`<script src="${arquivo}"><\/script>`);
}
