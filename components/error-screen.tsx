"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/logo";

type ErrorScreenProps = {
  error: unknown;
  retry: () => void;
};

export const ErrorScreen = ({ error, retry }: ErrorScreenProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6">
        <Link href="/" className="inline-flex"><Wordmark className="text-[1.6rem]" /></Link>
      </header>
      <main id="conteudo" className="mx-auto flex w-full max-w-6xl flex-1 flex-wrap items-center gap-12 px-4 pb-16 sm:px-6">
        <div className="flex min-w-0 flex-[1_1_26rem] flex-col gap-6">
          <p className="section-eyebrow font-semibold">Erro inesperado</p>
          <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance sm:text-7xl">
            A apuração <em className="text-ink-3">travou.</em>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-ink-2">
            Esta página encontrou um erro inesperado. Tente de novo ou volte para o resultado.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-inv px-6 py-4 font-bold text-inv-ink hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 4v5h-5" /></svg>
              Tentar de novo
            </button>
            <Link href="/app" className="rounded-full border border-line bg-surface px-6 py-[0.95rem] font-semibold hover:bg-surface-2">
              Voltar ao resultado
            </Link>
          </div>
        </div>
        <div className="flex flex-[1_1_20rem] justify-center">
          <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-[3rem] border border-line bg-surface">
            <svg viewBox="0 0 100 100" className="w-3/5" aria-hidden="true">
              <path d="M27 42 L50 17" fill="none" stroke="var(--ink-3)" strokeWidth="12" strokeLinecap="round" />
              <path d="M58 22 L78 36" fill="none" stroke="var(--ink-3)" strokeWidth="12" strokeLinecap="round" />
              <path d="M66 75 A19 19 0 1 1 64 54" fill="none" stroke="var(--ink)" strokeWidth="13" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
};
