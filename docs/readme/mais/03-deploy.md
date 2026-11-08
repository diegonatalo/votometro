### 🌐 Deploy

O site é exportado como HTML estático (`output: "export"` em `next.config.mjs`), então funciona em Vercel,
Netlify, GitHub Pages ou qualquer hospedagem de arquivos. Publique a pasta `out/`.

- O site está no ar em [votometrobr.vercel.app](https://votometrobr.vercel.app). Esse é o endereço padrão do Open Graph, do canonical e do sitemap; em outro domínio, defina `NEXT_PUBLIC_SITE_URL` no build.
- A imagem de compartilhamento (`opengraph-image`), o `twitter-image` e o `apple-icon` saem sem extensão. O `vercel.json` força
  `Content-Type: image/png` neles; em outra hospedagem, faça o equivalente.
- Se os dados mudarem, rode o build de novo: a imagem de compartilhamento usa os números do momento.
