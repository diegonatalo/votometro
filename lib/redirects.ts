import type { NextConfig } from "next";

export type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

/**
 * Redirecionamentos do projeto, lidos pelo `next.config.ts` (que é igual em todos os projetos).
 * Se tiver landing, cada rota antiga aponta para `/app/...` com `permanent: true` (308).
 */
export const REDIRECTS: Redirect[] = [];
