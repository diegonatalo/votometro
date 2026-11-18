<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Padrão dos projetos

Regras que valem sempre, e regras marcadas com "Se..." que valem só quando o projeto tem aquela característica. Não crie uma funcionalidade só para cumprir uma regra condicional.

## Stack
- Next.js (App Router), TypeScript e Tailwind. Sem `src/`; alias `@/*` para a raiz. Imports entre pastas sempre com `@/`, nunca `../`.
- Gerenciador de pacotes: pnpm. Não altere as configs (`next.config.ts`, `eslint.config.mjs`, `tsconfig`) sem necessidade.

## Versões
- Projeto novo: crie com `pnpm create next-app@latest` e mantenha as versões que ele gerar. Não fixe versões de memória nem rebaixe.
- Dependência nova: `pnpm add <pacote>`; não escreva versões à mão no `package.json`.
- Projeto existente: só atualize quando pedido. As atualizações de rotina chegam como PRs do Dependabot (`.github/dependabot.yml`, toda segunda); mescle aos poucos por causa do limite de deploys.
- Intervalos no formato que o modelo usa: se lá está `^6`, fica `^6`, não `^6.0.3`. O `pnpm update` expande os intervalos curtos; volte-os ao formato do modelo antes de commitar.
- Versão major vai primeiro para o my-app e depois para os projetos. O aviso "my-app atrás em ..." do standard-kit indica uma versão que já chegou a um projeto e falta no modelo.
- `@types/node` acompanha o Node do CI e da Vercel (24), não a última versão.
- Mudou a versão de Next.js, React, TypeScript ou Tailwind: rode o `build` do readme-kit, porque o selo de stack do README mostra essas versões.

## Arquitetura
- `lib/` lógica pura (sem React, sem acesso a `window`). `hooks/` estado e efeitos. `components/` UI. `types/` tipos compartilhados. `app/` só arquivos de rota (`page`, `layout`, `not-found`, `error`, `global-error`, `route`, `robots`, `sitemap`, `opengraph-image`); o corpo de cada tela fica em `components/`.
- Tipo derivado de um schema fica ao lado do schema.
- Se guardar dados no navegador: `localStorage` lido com `useSyncExternalStore`, nunca no render do servidor. Chaves no formato `<projeto>:<nome>:v1`, em que `<projeto>` é o nome da pasta do projeto e `<nome>` diz o que é guardado, em inglês (ex.: no `fitlog`, `fitlog:workouts:v1` e `fitlog:theme:v1`). Nunca use um prefixo genérico como `app:`: em `localhost` todos os projetos dividem o mesmo `localStorage`. Todas as chaves num único arquivo. Sem mapas de migração de dados antigos.

## Código
- Componentes com arrow function e export nomeado: `export const Nome = (props: Props) => { ... };`. Só `page`, `layout` e arquivos de rota usam `export default function`.
- Tipagem com `type`, nunca `interface`.
- Código em inglês (variáveis, funções, tipos, dados). Português só em conteúdo exibido e em URLs.
- Arquivos em kebab-case; hooks em `hooks/use-*.ts`.
- Classes condicionais com o helper `cn`, definido só em `lib/cn.ts`.
- Fontes com `next/font/google`, nunca `<link>` do Google Fonts.

## Testes
- Toda feature nova com lógica vem com testes no mesmo commit. Vitest + Testing Library; script `pnpm test`.
- Lógica em `lib/` sempre testada (`nome.test.ts` ao lado do arquivo). Se um componente tem comportamento (formulário, interação, estados), teste-o também. Não teste só aparência.
- Componentes de servidor `async` não se testam com Vitest: cubra com E2E.
- **E2E (Playwright):** obrigatório se o projeto guarda dados da pessoa no navegador (`localStorage` além do tema, ou IndexedDB); opcional nos demais. Teste fluxos que juntam telas e dados, não o que o Vitest já cobre. No mínimo:
  - criar dados pela interface e conferir que continuam depois de recarregar a página;
  - se houver backup: exportar, ficar sem os dados (de preferência um navegador limpo com `browser.newContext()`; também vale apagar pela própria interface ou limpar o storage), importar e conferir os dados, e recusar um arquivo inválido;
  - `e2e/navigation.spec.ts`: cada página abre sem erro no console, e a 404 leva de volta ao início.
- Estrutura do E2E: `playwright.config.ts` na raiz, igual ao modelo do standard-kit (`standard-kit/templates/`); testes em `e2e/*.spec.ts` (o Vitest fica com `*.test.ts`) e passos repetidos em `e2e/fixtures.ts`; script `test:e2e`. Só Chromium, contra o build de produção; o CI roda o E2E sempre que o `playwright.config.ts` existe.
- Nada de rede de verdade no E2E: APIs externas são simuladas com `page.route`, senão o CI quebra quando a API sai do ar. Seletores por papel e nome (`getByRole`, `getByLabel`), como a pessoa enxerga a tela.

## Interface
- **Responsivo:** mobile-first com os breakpoints do Tailwind, sem rolagem horizontal em telas pequenas.
- **Teclado:** tudo navegável e operável só com o teclado. Elementos nativos (`button`, `a`, `input`) em vez de `div` clicável; foco sempre visível; botão só com ícone leva `aria-label`.
- **404:** `app/not-found.tsx` customizada, no visual do app, com link para a página inicial.
- **Erros:** `app/error.tsx` (`"use client"`) renderiza `components/error-screen.tsx`, no visual do app, com botão "Tentar de novo" (chama `retry`) e link para a página inicial, e registra o erro com `console.error`. A tela de erro é simples: nada de dados do `localStorage` nem componentes pesados, que podem ser a causa do erro. `app/global-error.tsx` é igual ao do modelo.
- Se tiver tema claro e escuro: classe `dark` no `<html>` e `@custom-variant dark (&:where(.dark, .dark *));` no CSS global. Escolha salva em `<projeto>:theme:v1`, aplicada antes da primeira pintura (sem flash); sem escolha, segue o sistema.
- Se tiver 2 a 5 seções principais de navegação: Bottom Tab Bar abaixo do breakpoint `md`.
- Se tiver modais: prendem o foco e fecham com Esc.
- Se tiver várias páginas de conteúdo: link "Pular para o conteúdo" no início.

## SEO
- `lib/site.ts` exporta `SITE_URL` (sem barra final, de `NEXT_PUBLIC_SITE_URL`), `SITE_NAME` e `SITE_DESCRIPTION`.
- Layout com `lang="pt-BR"`, `metadataBase`, título, descrição, `openGraph` e `twitter` (`summary_large_image`).
- Se o site for público: imagem OG em `app/opengraph-image.tsx`, `robots.ts`, `sitemap.ts`, `canonical` em cada página (**nunca** no layout) e um `<h1>` por página.

## Next 16 com cacheComponents
- Sem `new Date()` nem `Math.random()` durante a renderização; valores que dependem da data são calculados após a hidratação (`useSyncExternalStore` com snapshot de servidor vazio).
- `searchParams`, `params` e dados de runtime pedem `<Suspense>` ou `export const instant = false`. `dynamicParams` não é permitido.

## Documentação e git
- `README.md` é gerado pelo readme-kit: edite `docs/readme/` e rode `build` e `check`, nunca o README à mão.
- Commits em inglês, no formato Conventional Commits: `feat(scope): add ...`, `fix: ...`, `refactor: ...`, `test: ...`, `docs: ...`, `chore: ...`.
- Nunca commite nem faça push direto na `main`. Antes de alterar qualquer coisa, crie uma branch a partir da `main` atualizada, com o mesmo prefixo dos commits: `feat/...`, `fix/...`, `refactor/...`, `docs/...`, `chore/...`. Ela volta para a `main` por pull request.
- Antes do push, rode `pnpm lint`, `pnpm test` e `pnpm build`. O CI repete os três, mas o erro achado localmente não vira PR vermelho.
- A Vercel só faz deploy da `main` (`vercel.json`); branches e PRs não geram preview. O CI (`.github/workflows/ci.yml`) roda lint, testes e build em cada PR. A conta gratuita da Vercel tem limite de 100 deploys por dia somando todos os projetos, então evite mesclar muitos PRs de uma vez.
