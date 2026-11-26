### 🧪 Testes

```bash
pnpm test
```

Usa [Vitest](https://vitest.dev). Os testes cobrem as estatísticas (votos válidos, margem, vencedor, comparecimento e abstenção), a validação dos totais, a formatação, as faixas de cor do mapa, a geometria por estado, o parser dos dados do TSE e componentes com comportamento (busca, tabela, abas e tela de erro).

Para reexecutar ao salvar: `pnpm test:watch`.

Os testes de ponta a ponta usam [Playwright](https://playwright.dev), só no Chromium e contra o build de produção:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Eles abrem cada página sem erros no console, seguem o botão da landing até o app, conferem o tema depois de recarregar e a 404. Os prints da landing (`public/landing/`) e deste README (`docs/screenshots/`) saem de `SCREENSHOTS=1 pnpm test:e2e e2e/screenshots.spec.ts`.
