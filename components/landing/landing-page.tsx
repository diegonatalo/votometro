import Link from "next/link";
import { displayName } from "@/components/candidate";
import { SiteFooter } from "@/components/site-footer";
import { SplitBar } from "@/components/split-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { fmtInt, fmtPct } from "@/lib/format";
import { FAQ, HERO, HIGHLIGHTS, WHY } from "@/lib/landing";
import { SOURCE_URL } from "@/lib/site";
import { validPct } from "@/lib/stats";
import type { NationalFile } from "@/types";

const SECTION = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const H2 = "font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl";

/** Prévia do resultado nacional, com o mesmo tratamento visual para os dois candidatos. */
const ResultPreview = ({ data }: { data: NationalFile }) => {
  const t = data.national;
  const pct = validPct(t);
  const rows = data.candidates
    .map((c) => ({ c, votes: t[c.id], pct: pct[c.id] }))
    .sort((a, b) => b.votes - a.votes);
  return (
    <div className="card flex flex-col gap-4 p-5 sm:p-7">
      <p className="font-data text-xs uppercase tracking-[0.14em] text-ink-2">Votos válidos · Brasil</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(({ c, votes, pct: share }) => (
          <div key={c.id}>
            <p className="font-display text-lg font-bold">{displayName(c)}</p>
            <p className="font-display text-5xl font-extrabold leading-none" style={{ color: `var(--${c.id})` }}>
              {fmtPct(share)}
            </p>
            <p className="font-data mt-1 text-sm text-ink-2">{fmtInt(votes)} votos</p>
          </div>
        ))}
      </div>
      <SplitBar lula={t.lula} flavio={t.flavio} />
    </div>
  );
};

/** Página inicial: apresenta o Votômetro e leva ao resultado completo (`/app`). */
export const LandingPage = ({ data }: { data: NationalFile }) => (
  <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="font-display flex shrink-0 items-center gap-2 text-lg font-extrabold uppercase leading-none tracking-tight"
        >
          <span className="led h-2.5 w-2.5 bg-accent" aria-hidden="true" />
          Votômetro
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {/* No celular o hero já traz o mesmo link logo abaixo. */}
          <Link
            href="/app"
            className="whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg hover:opacity-90 max-sm:hidden"
          >
            Ver o resultado
          </Link>
        </div>
      </div>
    </header>

    <main id="conteudo" className="flex flex-1 flex-col gap-16 pb-20">
      <section className={`${SECTION} grid items-center gap-10 pt-12 sm:pt-16 lg:grid-cols-2`} aria-labelledby="titulo">
        <div className="flex flex-col gap-5">
          <p className="font-data text-xs uppercase tracking-[0.14em] text-ink-2">{HERO.kicker}</p>
          <h1 id="titulo" className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {HERO.title}
          </h1>
          <p className="text-lg text-pretty text-ink-2">{HERO.subtitle}</p>
          <div>
            <Link
              href="/app"
              className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-90"
            >
              Ver o resultado completo
            </Link>
          </div>
        </div>
        <ResultPreview data={data} />
      </section>

      <section className={SECTION} aria-labelledby="titulo-destaques">
        <h2 id="titulo-destaques" className={H2}>
          O que tem lá dentro
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title} className="card flex flex-col gap-2 p-5">
              <h3 className="font-display text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-ink-2">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={SECTION} aria-labelledby="titulo-por-que">
        <div className="card flex flex-col gap-3 p-6 sm:p-8">
          <h2 id="titulo-por-que" className={H2}>
            {WHY.title}
          </h2>
          <p className="max-w-3xl text-pretty text-ink-2">{WHY.text}</p>
        </div>
      </section>

      <section className={SECTION} aria-labelledby="titulo-faq">
        <h2 id="titulo-faq" className={H2}>
          Perguntas frequentes
        </h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          {FAQ.map((item) => (
            <div key={item.question} className="card p-5">
              <dt className="font-display font-bold">{item.question}</dt>
              <dd className="mt-2 text-sm text-ink-2">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
    <SiteFooter sourceUrl={SOURCE_URL} authorUrl="https://diegonatalo.dev" />
  </div>
);
