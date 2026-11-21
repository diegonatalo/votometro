import type { NextConfig } from "next";

export type HeaderRule = Awaited<ReturnType<NonNullable<NextConfig["headers"]>>>[number];

/**
 * Política de conteúdo só com o que não depende dos scripts do Next: uma CSP
 * completa pediria nonce em cada script inline (o do tema e os do próprio Next).
 * `frame-ancestors 'none'` impede que outro site abra o app num iframe para
 * induzir cliques (num botão "Excluir conta", por exemplo).
 */
const CSP = ["frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'"].join("; ");

/** Cabeçalhos de segurança de todas as respostas, lidos pelo `next.config.ts`. */
export const SECURITY_HEADERS: HeaderRule[] = [
  {
    source: "/:path*",
    headers: [
      { key: "Content-Security-Policy", value: CSP },
      // o mesmo que frame-ancestors, para navegadores antigos
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // nenhum projeto usa câmera, microfone nem localização
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  },
];
