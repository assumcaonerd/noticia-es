# Notícia ES

Portal estático de notícias de política do Espírito Santo e do Brasil.

## Estrutura

- `index.html`: página inicial
- `noticia.html`: página individual da matéria
- `publicar.html`: gerador local do objeto de uma nova notícia
- `noticias.js`: banco estático de notícias
- `estilo.css`: estilos do portal
- `script.js`: busca, filtros, montagem da home e matérias
- `CNAME`: domínio personalizado `noticiaes.com.br`

## Como publicar uma nova notícia

1. Abra `publicar.html` no navegador.
2. Preencha os campos e clique em **Gerar notícia**.
3. Copie o objeto JavaScript gerado.
4. Abra `noticias.js` e cole o objeto no topo do array `noticias`.
5. Faça o commit da alteração na branch `main`.

Quando o GitHub Pages estiver habilitado para a branch `main`, cada commit passa a atualizar o site publicado.
