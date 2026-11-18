"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorScreenProps = {
  error: unknown;
  retry: () => void;
};

export const ErrorScreen = ({ error, retry }: ErrorScreenProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="conteudo" className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16 sm:px-6">
      <p className="font-display flex items-center gap-2 text-lg font-extrabold uppercase leading-none tracking-tight">
        <span className="led h-2.5 w-2.5 bg-accent" aria-hidden="true" />
        Votômetro
      </p>

      <div className="card mt-8 overflow-hidden p-6 sm:p-10">
        <p className="font-data text-sm font-semibold text-ink-3">Erro</p>
        <h1 className="font-display mt-1 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          A apuração <span className="text-ink-3">travou</span>
        </h1>
        <p className="mt-4 max-w-xl text-ink-2">
          Esta página encontrou um erro inesperado. Tente de novo ou volte para o resultado.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="cursor-pointer rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-90"
          >
            Tentar de novo
          </button>
          <Link href="/" className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink">
            Voltar ao resultado
          </Link>
        </div>
      </div>
    </main>
  );
};
