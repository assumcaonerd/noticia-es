# Notícia ES

Portal estático de notícias de política, segurança pública e opinião do Espírito Santo e do Brasil. Linha à direita. Em Política Nacional, Folha, Estadão, O Globo e Veja entram como atores a serem medidos pela mesma régua — não como árbitros da pauta.

Doutrina de redação: [`LINHA-EDITORIAL.md`](LINHA-EDITORIAL.md).

## Estrutura

- `index.html`: página inicial
- `noticia.html`: página individual da matéria
- `publicar.html`: gerador local do objeto de uma nova notícia
- `noticias.js`: banco estático de notícias automáticas e manuais
- `opiniao.js`: artigos de opinião editoriais
- `pesquisa.html`: arquivo de pesquisa com links das matérias e fontes
- `estilo.css`: estilos do portal
- `script.js`: busca, filtros, montagem da home e matérias
- `CNAME`: domínio personalizado `noticiaes.com.br`
- `LINHA-EDITORIAL.md`: regra para matérias de Política Nacional

## Publicação automática

O workflow em `.github/workflows/atualizar-noticias.yml` roda periodicamente e atualiza o banco de notícias. As matérias automáticas preservam a referência da fonte original e tentam usar a imagem da própria reportagem (`og:image`, `twitter:image` ou enclosure do RSS). Capa genérica de editoria só entra se a fonte não publicar foto do assunto.

Quando o GitHub Pages estiver habilitado para a branch `main`, cada commit passa a atualizar o site publicado.
