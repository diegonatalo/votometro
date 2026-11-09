<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Padrão dos projetos

## Stack
- Next.js (App Router), TypeScript e Tailwind. Sem `src/`; alias `@/*` para a raiz. Imports entre pastas sempre com `@/`, nunca `../`.
- Gerenciador de pacotes: pnpm. Não altere as configs (`next.config.ts`, `eslint.config.mjs`, `tsconfig`) sem necessidade.

## Versões
- Projeto novo: crie com `pnpm create next-app@latest` e mantenha exatamente as versões que ele gerar (Next, React, Tailwind, TypeScript, ESLint, pnpm). Não fixe versões de memória nem rebaixe.
- Dependência nova: instale com `pnpm add <pacote>` (a versão estável mais recente). Não escreva versões à mão no `package.json`.
- Projeto existente: só atualize quando pedido. Para alinhar com o template atual, compare o `package.json` com o de um projeto recém-criado por `create-next-app@latest`.

## Arquitetura
- `lib/` lógica pura (sem React, sem acesso a `window`). `hooks/` estado e efeitos. `components/` UI. `types/` tipos compartilhados. `app/` só arquivos de rota (`page`, `layout`, `not-found`, `route`, `robots`, `sitemap`, `opengraph-image`); o corpo de cada tela fica em `components/`.
- Tipo inferido de um schema (zod) fica ao lado do schema.
- Dados do usuário ficam no navegador: `localStorage` lido com `useSyncExternalStore`, nunca no render do servidor. Chaves no formato `app:nome:v1`, em inglês, todas num único arquivo. Sem mapas de migração de dados antigos.

## Código
- Componentes com arrow function e export nomeado: `export const Nome = (props: Props) => { ... };`. Só `page`, `layout` e arquivos de rota usam `export default function`.
- Tipagem com `type`, nunca `interface`.
- Código em inglês (variáveis, funções, tipos, dados). Português só em conteúdo exibido e em URLs.
- Arquivos em kebab-case; hooks em `hooks/use-*.ts`.
- Classes condicionais com o helper `cn`, definido só em `lib/cn.ts`.

## Testes
- Toda feature nova vem com testes no mesmo commit. Vitest + Testing Library; script `pnpm test`.
- Lógica em `lib/` sempre testada (`nome.test.ts` ao lado do arquivo). Componentes com comportamento (formulário, interação, estados) também. Não teste só aparência.
- Componentes de servidor `async` não se testam com Vitest: cubra com E2E (Playwright), só se o projeto tiver fluxo que justifique.

## Interface
- **Tema:** sempre claro e escuro. Classe `dark` no `<html>` e `@custom-variant dark (&:where(.dark, .dark *));` no CSS global. Escolha salva em `app:theme:v1` e aplicada antes da primeira pintura (sem flash); sem escolha, segue o sistema.
- **Responsivo:** mobile-first com os breakpoints do Tailwind. Sem rolagem horizontal a partir de 360 px; alvos de toque com no mínimo 44 px.
- **Mobile:** com 2 a 5 seções principais, a navegação vira Bottom Tab Bar abaixo do breakpoint `md`; no desktop, barra lateral ou cabeçalho.
- **Teclado:** tudo navegável e operável só com o teclado. Elementos nativos (`button`, `a`, `input`) em vez de `div` clicável; foco sempre visível; ordem de foco lógica; link "Pular para o conteúdo" no início; modais prendem o foco e fecham com Esc; botão só com ícone leva `aria-label`.
- **404:** `app/not-found.tsx` customizada, no tema do app, com link para a página inicial.

## SEO
- `lib/site.ts` exporta `SITE_URL` (sem barra final, de `NEXT_PUBLIC_SITE_URL`), `SITE_NAME` e `SITE_DESCRIPTION`.
- Layout: `lang="pt-BR"`, `metadataBase`, título, descrição, `openGraph` e `twitter` (`summary_large_image`). Imagem OG em `app/opengraph-image.tsx`.
- `canonical` em cada página, **nunca** no layout; sem `openGraph.url` relativo no layout.
- `robots.ts` com `allow: "/"` e o `sitemap`; `sitemap.ts` com `url` e `lastModified`. Um `<h1>` por página.

## Next 16 com cacheComponents
- Sem `new Date()` nem `Math.random()` durante a renderização; valores que dependem da data são calculados após a hidratação (`useSyncExternalStore` com snapshot de servidor vazio).
- `searchParams`, `params` e dados de runtime pedem `<Suspense>` ou `export const instant = false`. `dynamicParams` não é permitido.

## Fontes
`next/font/google` com variável `--nf-*`; nunca `<link>` do Google Fonts.

## Documentação e git
- `README.md` é gerado pelo readme-kit: edite `docs/readme/` e rode `build` e `check`, nunca o README à mão.
- Commits em inglês, no formato Conventional Commits: `feat(scope): add ...`, `fix: ...`, `refactor: ...`, `test: ...`, `docs: ...`, `chore: ...`.
