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
- **E2E (Playwright):** obrigatório se o projeto guarda dados da pessoa no navegador (`localStorage` além do tema, ou IndexedDB) ou tem contas (ver "Contas"); opcional nos demais. Teste fluxos que juntam telas e dados, não o que o Vitest já cobre. No mínimo:
  - criar dados pela interface e conferir que continuam depois de recarregar a página;
  - se houver backup: exportar, ficar sem os dados (de preferência um navegador limpo com `browser.newContext()`; também vale apagar pela própria interface ou limpar o storage), importar e conferir os dados, e recusar um arquivo inválido;
  - `e2e/navigation.spec.ts`: cada página abre sem erro no console, e a 404 leva de volta ao início.
- Estrutura do E2E: `playwright.config.ts` na raiz, igual ao modelo do standard-kit (`standard-kit/templates/playwright.config.ts`; com contas, `templates/db/playwright.config.ts`); testes em `e2e/*.spec.ts` (o Vitest fica com `*.test.ts`) e passos repetidos em `e2e/fixtures.ts`; script `test:e2e`. Só Chromium, contra o build de produção; o CI roda o E2E sempre que o `playwright.config.ts` existe.
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

## Landing
- Se tiver landing: `/` é a landing, um Server Component estático (só botões que leem o navegador viram ilhas cliente). O app fica todo sob `/app/...`, e as rotas que já existiam redirecionam com 308 (lista `REDIRECTS` em `lib/redirects.ts`, lida pelo `next.config.ts`, com `permanent: true`). Links internos, 404 e tela de erro apontam para `/app`.
- Estrutura: hero com `<h1>` e CTA "Abrir o app", como funciona, recursos, prints, privacidade em uma frase (se guarda dados), FAQ, CTA final e rodapé. Textos em `lib/landing.ts`, seções em `components/landing/`. O visual é de cada projeto.
- Prints em `public/landing/*.webp`, gerados por `e2e/screenshots.spec.ts` com dados de exemplo, nunca à mão. Botão de dados de exemplo só aparece com o navegador vazio e nunca sobrescreve dados.

## Privacidade
- Se guarda dados da pessoa (mesmo critério do E2E) ou envia dados a terceiros (API externa, formulário, analytics, banco): `app/privacidade/page.tsx` com `components/legal-page.tsx`, link no rodapé (`components/site-footer.tsx`), no sitemap e no `navigation.spec.ts`. A política diz o que é guardado e onde, quem recebe (incluindo a Vercel como hospedagem), o que vai no backup, como apagar e o contato (`PRIVACY_EMAIL` de `lib/site.ts`).
- Se guarda dados ou tem conta: `app/termos/page.tsx`, com o mesmo layout.
- Mudou o que se coleta ou com quem se compartilha: atualize a política e a data (`updatedAt`) no mesmo PR.
- Se tiver dado sensível (saúde, por exemplo): aviso confirmado antes de exportar backup; nunca em URL, log ou analytics.
- Sem cookie que não seja necessário (analytics com cookie, pixel, propaganda) sem discutir antes: ele obriga a ter aviso de cookies.
- Os modelos de texto ficam em `standard-kit/templates/legal/`. Eles são ponto de partida e não substituem orientação jurídica.

## Segurança
- Cabeçalhos de segurança em `lib/security-headers.ts` (igual ao do modelo, com o teste), lido pelo `next.config.ts` como o `lib/redirects.ts`.

## Banco de dados
- Se tiver banco: Postgres no Neon pela integração da Vercel, com Drizzle. Schema em `lib/db/schema.ts`; conexão em `lib/db/index.ts`, com `import "server-only"`. Modelos em `standard-kit/templates/db/`.
- Migrações em `drizzle/`, geradas por `pnpm db:generate` e aplicadas pelo script `vercel-build` (`drizzle-kit migrate && next build`), que só roda na `main`. As migrações usam `DATABASE_URL_UNPOOLED`. Migração destrutiva (apagar ou renomear coluna) só em duas etapas: primeiro o código para de usar a coluna, depois outro PR a remove.
- Em desenvolvimento, o `.env.local` aponta para uma branch `dev` do Neon, nunca para a de produção. E2E e CI usam um Postgres descartável (service do GitHub Actions).
- Variáveis no `.env.example`. Segredo nunca com `NEXT_PUBLIC_`. Um segredo diferente por ambiente. O que dá para derivar do `SITE_URL` não vira variável.
- Leitura em `lib/data/queries.ts` (`server-only`) e escrita em `lib/data/actions.ts` (`"use server"`). Toda ação confere a sessão, valida a entrada como `unknown` com limites de tamanho (`LIMITS`) e filtra pelo `user_id` da sessão. Tabelas do app com chave `(user_id, id)`.
- Escrita em mais de uma tabela é feita numa transação, inclusive criar os dados iniciais na primeira visita (duas abas abertas ao mesmo tempo criam os dados duas vezes).
- Salvamento em segundo plano mostra o erro e avisa antes de fechar a aba (`beforeunload`) enquanto houver algo pendente. O service worker nunca guarda rotas logadas nem respostas RSC (`?_rsc`).
- Dependência nova com script de instalação vai para o `allowBuilds` do `pnpm-workspace.yaml`, senão o `pnpm install` do CI falha.

## Contas
- Se tiver contas: Better Auth com e-mail e senha e o adaptador do Drizzle. `proxy.ts` faz a checagem otimista do cookie; o layout logado e cada Server Action fazem a checagem de verdade. O `robots.ts` bloqueia as rotas logadas e a API (`disallow`).
- Com `cacheComponents`: a sessão é lida dentro de `<Suspense>` no layout logado, e `export const instant = false` vai em **cada** página logada (só no layout não basta).
- Navegação completa (`window.location.assign`) ao entrar e ao sair. O parâmetro `?de=` aceita só caminhos internos.
- Limite de tentativas guardado no banco (`rateLimit.storage = "database"`): na memória, cada instância da Vercel conta separado. "Excluir conta" apaga tudo em cascata.
- Antes de lançar: serviço de e-mail para recuperação de senha e confirmação de e-mail, e `PRIVACY_EMAIL` definitivo. A política de privacidade cita o banco (Neon), a hospedagem (Vercel) e o cookie de sessão.
- E2E obrigatório. Uma conta por teste, criada pela API (`signUpByApi` em `e2e/fixtures.ts`); `AUTH_RATE_LIMIT=off` só no `webServer.env` do Playwright (`standard-kit/templates/db/playwright.config.ts`). `e2e/auth.spec.ts` cobre cadastro, entrar, sair, senha errada, e-mail repetido, isolamento entre contas e excluir a conta.
- Seletores: `getByLabel("Senha", { exact: true })` (senão pega também o botão "Mostrar senha") e avisos buscados dentro do `<main>`, porque o anunciador de rotas do Next também tem `role="alert"`.

## Next 16 com cacheComponents
- Sem `new Date()` nem `Math.random()` durante a renderização; valores que dependem da data são calculados após a hidratação (`useSyncExternalStore` com snapshot de servidor vazio).
- `searchParams`, `params` e dados de runtime pedem `<Suspense>` ou `export const instant = false`. `dynamicParams` não é permitido.

## Documentação e git
- `README.md` é gerado pelo readme-kit: edite `docs/readme/` e rode `build` e `check`, nunca o README à mão.
- Commits em inglês, no formato Conventional Commits: `feat(scope): add ...`, `fix: ...`, `refactor: ...`, `test: ...`, `docs: ...`, `chore: ...`.
- Nunca commite nem faça push direto na `main`. Antes de alterar qualquer coisa, crie uma branch a partir da `main` atualizada, com o mesmo prefixo dos commits: `feat/...`, `fix/...`, `refactor/...`, `docs/...`, `chore/...`. Ela volta para a `main` por pull request.
- Antes do push, rode `pnpm lint`, `pnpm test` e `pnpm build`. O CI repete os três, mas o erro achado localmente não vira PR vermelho.
- A Vercel só faz deploy da `main` (`vercel.json`); branches e PRs não geram preview. O CI (`.github/workflows/ci.yml`) roda lint, testes e build em cada PR. A conta gratuita da Vercel tem limite de 100 deploys por dia somando todos os projetos, então evite mesclar muitos PRs de uma vez.
