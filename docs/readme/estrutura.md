```text
├── app/            landing (/), o resultado em /app, layout, favicon, imagem Open Graph, robots e sitemap
├── components/     logo, landing, Hero, seções, tabela de estados, abas, tema
│   └── map/        BrazilMap (SVG + Canvas), mapa estático da landing, legenda, tooltip, painel e busca
├── lib/            formatação, estatísticas, cores, geometria, validação, site
├── types/          tipos do domínio e declarações de CSS
└── e2e/            testes Playwright e geração dos prints
scripts/            build-data · build-geo · build-overtime · validate · lib/tse
public/
├── data/           JSON gerados (nacional, estados, municípios, 17h) e geo/ com os TopoJSON
├── img/            fotos dos candidatos
└── landing/        prints do app usados na landing
docs/               banner e capturas de tela deste README
```
