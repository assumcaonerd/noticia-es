/* NOTÍCIA ES - MANIFESTO DE MATÉRIAS AUTOMÁTICAS
   Arquivo pequeno e seguro para carregar shards gerados pela redação automática.
   Cada shard é um JS independente e imutável. */
const noticiasAutoArquivos = [];
for (const arquivo of noticiasAutoArquivos) {
  document.write(`<script src="${arquivo}"><\/script>`);
}
