import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/logo";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/app#mapa", label: "Mapa" },
  { href: "/app#turnos", label: "Entre os turnos" },
  { href: "/app#tabela", label: "Estados" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6">
        <Link href="/" className="inline-flex"><Wordmark className="text-[1.6rem]" /></Link>
      </header>
      <main id="conteudo" className="mx-auto flex w-full max-w-6xl flex-1 flex-wrap items-center gap-12 px-4 pb-16 sm:px-6">
        <div className="flex min-w-0 flex-[1_1_26rem] flex-col gap-6">
          <p className="section-eyebrow font-semibold">Erro 404</p>
          <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance sm:text-7xl">
            Essa página <em className="text-ink-3">não foi apurada.</em>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-ink-2">
            O endereço pode ter sido digitado errado ou a página não existe mais. O resultado do 2º turno continua no app.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/app" className="rounded-full bg-inv px-6 py-4 font-bold text-inv-ink hover:opacity-90">
              Voltar ao resultado
            </Link>
            <nav aria-label="Atalhos" className="flex flex-wrap gap-1 text-[0.95rem] text-ink-2">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-3 hover:bg-surface-2 hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex flex-[1_1_20rem] justify-center">
          <div className="relative flex aspect-square w-full max-w-sm items-center justify-center rounded-[3rem] border border-line bg-surface">
            <svg viewBox="0 0 100 100" className="w-3/5" role="img" aria-label="Logo sem leitura: os traços não se encontram">
              <path d="M27 42 L46 21" fill="none" stroke="var(--line)" strokeWidth="12" strokeLinecap="round" />
              <path d="M54 21 L73 42" fill="none" stroke="var(--line)" strokeWidth="12" strokeLinecap="round" />
              <circle cx="50" cy="66" r="19" fill="none" stroke="var(--ink)" strokeWidth="13" strokeDasharray="8 9" />
            </svg>
            <span className="font-data absolute bottom-6 text-xs text-ink-3">0 de 1 página encontrada</span>
          </div>
        </div>
      </main>
    </div>
  );
}
