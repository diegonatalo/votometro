"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: unknown;
  retry: () => void;
};

// Substitui o layout raiz quando ele quebra. Sem o CSS nem as fontes do app (que podem
// ser a causa do erro), então tudo vai inline e o tema segue o sistema.
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR" style={{ colorScheme: "light dark" }}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          background: "Canvas",
          color: "CanvasText",
          textAlign: "center",
        }}
      >
        <title>Algo deu errado</title>
        <main style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem" }}>Algo deu errado</h1>
          <p style={{ margin: "0 0 1.5rem", opacity: 0.75, lineHeight: 1.5 }}>
            O app não conseguiu abrir. Tente de novo; se continuar, recarregue a página.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              font: "inherit",
              fontWeight: 600,
              padding: "0.7rem 1.4rem",
              borderRadius: "999px",
              border: "1px solid currentColor",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
}
