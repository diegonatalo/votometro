### 🌐 Deploy

O site é publicado na Vercel. Todas as páginas são geradas no build, a partir dos JSON de `public/data`.

- O site está no ar em [votometrobr.vercel.app](https://votometrobr.vercel.app). Esse é o endereço padrão do Open Graph, do canonical e do sitemap; em outro domínio, defina `NEXT_PUBLIC_SITE_URL` no build.
- Se os dados mudarem, rode o build de novo: a imagem de compartilhamento usa os números do momento.
