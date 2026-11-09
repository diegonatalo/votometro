Requer [Node.js](https://nodejs.org) e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm build-data   # baixa TSE + IBGE, gera public/data e valida os totais (leva alguns minutos)
pnpm dev          # http://localhost:3000
```

Os arquivos de `public/data` já estão no projeto, então você pode pular o `build-data` se só quiser ver o site.

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento em `localhost:3000` |
| `pnpm build` | Valida os totais e gera o build de produção (falha se os números não baterem) |
| `pnpm build-data` | Baixa os dados do TSE e do IBGE e regenera `public/data` |
| `pnpm validate` | Roda só a validação sobre os JSON já gerados |
| `pnpm overtime` | Procura os Boletins de Urna do 2º turno e regenera o painel das 17h |
| `pnpm typecheck` | Checa os tipos com o TypeScript |

> [!NOTE]
> Não rode `pnpm build` com o servidor de desenvolvimento ligado. Os dois usam a pasta `.next` e o
> servidor quebra. Se acontecer, pare o servidor, apague `.next` e inicie de novo.

O TSE responde `429` quando recebe pedidos demais. O script espaça as requisições, pausa sozinho e guarda
cada resposta em `.cache/tse`. Apague essa pasta (`rm -rf .cache`) para forçar um novo download.

### 🔑 Variáveis de ambiente

| Variável | Para que serve | Se não definir |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site. Alimenta o canonical, o Open Graph, o `robots.txt` e o `sitemap.xml`. | Usa `https://votometrobr.vercel.app`. |

Só precisa definir se publicar em outro domínio:

```bash
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br pnpm build
```
