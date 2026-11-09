<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Convenções do projeto

Padrão comum aos projetos desta pasta, conferido por `python standard-kit/check.py` (ver `standard-kit/README.md`). Siga ao escrever código novo.

- **Componentes:** arrow function com export nomeado (`export const Nome = ({ a }: Props) => { ... };`). Só `page`, `layout` e demais arquivos de rota usam `export default function`.
- **Tipos:** `type`, nunca `interface`. Props em `type Props`. Tipos compartilhados em `types/`; tipo inferido de um schema fica ao lado do schema.
- **`app/`:** só arquivos de rota. O corpo das telas fica em `components/`.
- **Imports:** alias `@/` entre pastas, nunca `../`.
- **Nomes:** código em inglês e arquivos em kebab-case; português só em conteúdo e URLs. Hooks em `hooks/use-*.ts`.
- **`lib/site.ts`:** exporta `SITE_URL`, `SITE_NAME` e `SITE_DESCRIPTION` (e `ROUTES` se a lista for estática).
- **SEO:** `metadataBase`, Open Graph e Twitter no layout; `canonical` só nas páginas, nunca no layout; `robots.ts` e `sitemap.ts` no formato do `my-app`.
- **Armazenamento:** chaves de `localStorage` no formato `app:nome:v1`, em inglês. Sem mapas de migração de dados antigos.
- **Tema:** classe `dark` no `<html>` e `@custom-variant dark` no `globals.css`.
- **Fontes:** `next/font/google` com variável `--nf-*`; nada de `<link>` do Google Fonts.
- **Classes condicionais:** helper `cn` só em `lib/cn.ts`.
- **Quebras de linha:** LF. **Pacotes:** pnpm.
- **README:** nunca editar à mão; usar o `readme-kit` (editar `docs/readme/`, rodar `build` e `check`).
