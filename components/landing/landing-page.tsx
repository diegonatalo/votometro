import Image from "next/image";
import Link from "next/link";
import { displayName } from "@/components/candidate";
import { Wordmark } from "@/components/logo";
import { StaticMap } from "@/components/map/static-map";
import { SiteFooter } from "@/components/site-footer";
import { SplitBar } from "@/components/split-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { loadMunicipalities, loadStates } from "@/lib/data";
import { fmtInt, fmtPct } from "@/lib/format";
import { FAQ, FINAL_CTA, HERO, HIGHLIGHTS, HOW, PREVIEW, PRIVACY_NOTE } from "@/lib/landing";
import { SOURCE_URL } from "@/lib/site";
import { turnoutPct, validPct, voteMargin, winner } from "@/lib/stats";
import type { NationalFile } from "@/types";

const SECTION = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const H2 = "font-display text-4xl leading-none tracking-[-0.03em] text-balance sm:text-5xl";
const ICON = "h-6 w-6 fill-none stroke-ink stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]";

/** Ícones dos destaques, na mesma ordem de `HIGHLIGHTS`. */
const HIGHLIGHT_ICONS = [
  <svg key="mapa" viewBox="0 0 24 24" className={ICON} aria-hidden="true"><path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z" /><path d="M9 4v13.5M15 6.5V20" /></svg>,
  <svg key="regioes" viewBox="0 0 24 24" className={ICON} aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h13" /></svg>,
  <svg key="turnos" viewBox="0 0 24 24" className={ICON} aria-hidden="true"><path d="M4 17 10 11l4 4 6-8" /><path d="M15 7h5v5" /></svg>,
  <svg key="17h" viewBox="0 0 24 24" className={ICON} aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg>,
];

const OpenApp = ({ className }: { className: string }) => (
  <Link href="/app" className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-inv font-semibold text-inv-ink hover:opacity-90 ${className}`}>
    Abrir o app
    <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </Link>
);

/** Prévia do resultado nacional: mapa, percentuais e a barra com a marca do meio. */
const ResultPreview = ({ data }: { data: NationalFile }) => {
  const t = data.national;
  const pct = validPct(t);
  const rows = data.candidates
    .map((c) => ({ c, votes: t[c.id], pct: pct[c.id] }))
    .sort((a, b) => b.votes - a.votes);
  return (
    <figure className="card flex flex-col gap-5 p-5 shadow-[var(--shadow)] sm:p-7">
      <figcaption className="font-data flex flex-wrap items-baseline justify-between gap-2 text-xs uppercase tracking-[0.12em] text-ink-2">
        <span>Votos válidos · Brasil</span>
        <span className="normal-case tracking-normal text-ink-3">TSE · {data.meta.reference}</span>
      </figcaption>
      <StaticMap className="mx-auto aspect-square w-full max-w-[380px]" />
      <div className="grid grid-cols-2 gap-4">
        {rows.map(({ c, votes, pct: share }, i) => (
          <div key={c.id} className={i === 1 ? "text-right" : undefined}>
            <p className={`flex items-center gap-2 text-base font-bold ${i === 1 ? "justify-end" : ""}`}>
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: `var(--${c.id})` }} aria-hidden="true" />
              {displayName(c)}
            </p>
            <p className="font-display mt-1.5 text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl" style={{ color: `var(--${c.id})` }}>
              {fmtPct(share)}
            </p>
            <p className="font-data mt-1.5 text-xs text-ink-2 sm:text-sm">{fmtInt(votes)} votos</p>
          </div>
        ))}
      </div>
      <SplitBar lula={t.lula} flavio={t.flavio} chevron />
    </figure>
  );
};

/** Página inicial: apresenta o Votômetro e leva ao resultado completo (`/app`). */
export const LandingPage = ({ data }: { data: NationalFile }) => {
  const t = data.national;
  const wins = { lula: 0, flavio: 0 };
  for (const s of loadStates().states) {
    const w = winner(s);
    if (w !== "tie") wins[w]++;
  }
  const municipalities = loadMunicipalities().rows.length;
  const counted = t.sections ? (t.countedSections / t.sections) * 100 : 0;
  const facts = [
    { value: fmtInt(Math.abs(voteMargin(t))), label: "votos de diferença no Brasil" },
    { value: fmtPct(turnoutPct(t)), label: "de comparecimento" },
    { value: `${wins.lula} × ${wins.flavio}`, label: "UFs com Lula e com Flávio à frente" },
    { value: fmtInt(t.countedSections), label: "seções totalizadas" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex shrink-0">
            <Wordmark className="text-2xl sm:text-[1.75rem]" />
          </Link>
          <nav aria-label="Seções" className="hidden gap-1 text-[0.95rem] text-ink-2 md:flex">
            <a href="#como-funciona" className="rounded-full px-3 py-2 hover:bg-surface-2 hover:text-ink">Como funciona</a>
            <a href="#recursos" className="rounded-full px-3 py-2 hover:bg-surface-2 hover:text-ink">O que tem</a>
            <a href="#faq" className="rounded-full px-3 py-2 hover:bg-surface-2 hover:text-ink">Perguntas</a>
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            <ThemeToggle />
            {/* No celular o hero já traz o mesmo link logo abaixo. */}
            <OpenApp className="px-5 py-3 text-[0.95rem] max-sm:hidden" />
          </div>
        </div>
      </header>

      <main id="conteudo" className="flex flex-1 flex-col">
        <section className={`${SECTION} grid items-center gap-12 pt-10 pb-14 sm:pt-16 lg:grid-cols-2`} aria-labelledby="titulo">
          <div className="flex flex-col gap-6 sm:gap-7">
            <p className="font-data flex items-center gap-2.5 text-xs uppercase tracking-[0.12em] text-ink-2 sm:text-[0.8rem]">
              <span className="led h-2.5 w-2.5" aria-hidden="true" />
              {HERO.kicker} · {fmtPct(counted, 0)} apurado
            </p>
            <h1 id="titulo" className="font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance sm:text-7xl lg:text-[5.5rem]">
              {HERO.title} <em className="text-ink-2">{HERO.titleEm}</em>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-ink-2 sm:text-[1.2rem]">{HERO.subtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <OpenApp className="px-7 py-4 text-[1.05rem] max-sm:w-full" />
              <a href="#como-funciona" className="rounded-full border border-line bg-surface px-6 py-[0.95rem] text-[1.05rem] font-semibold hover:bg-surface-2 max-sm:hidden">
                Como funciona
              </a>
            </div>
          </div>
          <ResultPreview data={data} />
        </section>

        <section aria-label="Números do 2º turno" className="border-y border-line border-t-ink [border-top-width:2px]">
          <dl className={`${SECTION} grid grid-cols-2 lg:grid-cols-4`}>
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse gap-1 border-line py-5 pr-4 max-lg:[&:nth-child(-n+2)]:border-b sm:py-7">
                <dt className="text-sm text-ink-2">{f.label}</dt>
                <dd className="font-display text-3xl tracking-[-0.02em] sm:text-[2.5rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="como-funciona" className={`${SECTION} pt-20 sm:pt-28`} aria-labelledby="titulo-como">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="titulo-como" className={H2}>{HOW.title}</h2>
            <p className="max-w-md text-lg leading-relaxed text-ink-2">{HOW.intro}</p>
          </div>
          <ol className="mt-10 grid border-t border-line md:grid-cols-3">
            {HOW.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 border-b border-line py-7 md:pr-8">
                <span className="font-data text-sm font-semibold text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold tracking-tight sm:text-[1.4rem]">{s.title}</h3>
                <p className="leading-relaxed text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="recursos" className={`${SECTION} pt-20 sm:pt-28`} aria-labelledby="titulo-recursos">
          <h2 id="titulo-recursos" className={H2}>
            O que tem <em className="text-ink-2">lá dentro</em>
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item, i) => (
              <li key={item.title} className="card flex flex-col gap-3.5 p-6 sm:p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2">{HIGHLIGHT_ICONS[i]}</span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-ink-2">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${SECTION} pt-20 sm:pt-28`} aria-labelledby="titulo-previa">
          <h2 id="titulo-previa" className={H2}>
            {PREVIEW.title} <em className="text-ink-2">{PREVIEW.em}</em>
          </h2>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-line bg-surface-2 px-2 pt-2 sm:px-3.5 sm:pt-3.5">
            <div className="flex gap-1.5 px-1.5 pt-0.5 pb-2.5 sm:pb-3" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
            </div>
            <Link href="/app" className="block overflow-hidden rounded-t-2xl" aria-label="Abrir o app">
              <Image src="/landing/app-claro.webp" alt={PREVIEW.alt} width={PREVIEW.width} height={PREVIEW.height} sizes="(min-width: 1152px) 1100px, 100vw" className="h-auto w-full dark:hidden" />
              <Image src="/landing/app-escuro.webp" alt={PREVIEW.alt} width={PREVIEW.width} height={PREVIEW.height} sizes="(min-width: 1152px) 1100px, 100vw" className="hidden h-auto w-full dark:block" />
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2.5 text-[0.95rem] text-ink-2">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 fill-none stroke-ink stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true"><path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z" /></svg>
            {PRIVACY_NOTE}
          </p>
        </section>

        <section id="faq" className={`${SECTION} grid gap-10 pt-20 sm:pt-28 lg:grid-cols-[1fr_2fr]`} aria-labelledby="titulo-faq">
          <h2 id="titulo-faq" className={H2}>
            Perguntas <em className="text-ink-2">frequentes</em>
          </h2>
          <div className="border-t-2 border-ink">
            {FAQ.map((item, i) => (
              <details key={item.question} open={i === 0} className="group border-b border-line py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold sm:text-xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span aria-hidden="true" className="text-2xl font-normal text-ink-3 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={`${SECTION} py-20 sm:py-28`} aria-labelledby="titulo-cta">
          <div className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[2.25rem] bg-inv px-6 py-10 text-inv-ink sm:px-12 sm:py-16">
            <div className="relative flex max-w-2xl flex-col gap-4">
              <h2 id="titulo-cta" className="font-display text-4xl leading-none tracking-[-0.03em] text-balance sm:text-6xl">
                {FINAL_CTA.title} <em>{FINAL_CTA.em}</em>
              </h2>
              <p className="text-lg opacity-80">{fmtInt(municipalities)} municípios, 27 unidades da federação e o exterior.</p>
            </div>
            <Link href="/app" className="relative rounded-full bg-inv-ink px-8 py-4 text-lg font-bold whitespace-nowrap text-inv hover:opacity-90 max-sm:w-full max-sm:text-center">
              Abrir o app
            </Link>
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute -right-10 -bottom-16 w-72 opacity-10" aria-hidden="true">
              <path d="M27 42 L50 17 L73 42" fill="none" stroke="var(--inv-ink)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="66" r="19" fill="none" stroke="var(--inv-ink)" strokeWidth="13" />
            </svg>
          </div>
        </section>
      </main>
      <SiteFooter sourceUrl={SOURCE_URL} authorUrl="https://diegonatalo.dev">
        <Wordmark className="text-xl" />
        <p className="font-data text-xs text-ink-2">Dados: TSE · Geometrias: IBGE · Site independente, sem vínculo com o TSE.</p>
      </SiteFooter>
    </div>
  );
};

