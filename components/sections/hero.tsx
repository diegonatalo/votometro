import type { ReactNode } from "react";
import { fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { marginPp, voteMargin, abstentionPct, turnoutPct, validPct } from "@/lib/stats";
import type { Candidate, NationalFile } from "@/types";
import { displayName, NumberBoxes, PartyBadge, Photo } from "@/components/candidate";
import { CountUp } from "@/components/count-up";
import { SourceNote } from "@/components/source-note";
import { SplitBar } from "@/components/split-bar";

const Elected = ({ c }: { c: Candidate }) => {
  const elected = c.electionStatus.toLowerCase() === "eleito";
  return elected ? (
    <span className="inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-2 text-[0.8rem] font-bold text-on-cand" style={{ background: `var(--${c.id})` }}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
      {c.electionStatus}
    </span>
  ) : (
    <span className="rounded-full border border-line px-2.5 py-1 text-[0.8rem] font-semibold text-ink-2">{c.electionStatus}</span>
  );
};

const CandidateColumn = ({ c, votes, pct, first }: { c: Candidate; votes: number; pct: number; first: boolean }) => {
  return (
    <article
      aria-label={displayName(c)}
      className={`flex min-w-0 flex-col gap-5 py-7 sm:py-9 ${first ? "border-b border-line md:border-r md:border-b-0 md:pr-9" : "md:pl-9"}`}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <Photo person={{ photo: c.photo, ballotName: displayName(c) }} tone={c.id} size={84} />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{displayName(c)}</h2>
            <Elected c={c} />
          </div>
          <p className="flex flex-wrap items-center gap-2 text-sm text-ink-2">
            <PartyBadge sigla={c.party} title={c.partyName} />
            <NumberBoxes number={c.number} size="sm" />
            <span>Vice: {c.vice.ballotName} ({c.vice.party})</span>
          </p>
        </div>
      </div>
      <p className="font-display text-[5.5rem] leading-[0.85] tracking-[-0.045em] sm:text-9xl lg:text-[9rem]" style={{ color: `var(--${c.id})` }}>
        <CountUp value={pct} kind="pct" />
      </p>
      <p className="font-data text-lg">
        <CountUp value={votes} /> <span className="text-sm text-ink-2">votos</span>
      </p>
      <p className="text-[0.8rem] text-ink-3">{c.coalition !== c.party ? `Coligação: ${c.coalition}` : c.partyName}</p>
    </article>
  );
};

const Stat = ({ label, value, hint }: { label: string; value: ReactNode; hint: string }) => (
  <div>
    <dt className="text-sm text-ink-2">{label}</dt>
    <dd className="font-display mt-1.5 text-4xl tracking-[-0.02em] sm:text-[2.5rem]">{value}</dd>
    <dd className="font-data mt-1 text-xs text-ink-2">{hint}</dd>
  </div>
);

export const Hero = ({ data }: { data: NationalFile }) => {
  const t = data.national;
  const p = validPct(t);
  const m = voteMargin(t);
  const cands = data.candidates
    .map((c) => ({ c, votes: t[c.id], pct: p[c.id] }))
    .sort((a, b) => b.votes - a.votes);

  return (
    <section id="resultado" aria-labelledby="h-resultado" className="pt-8 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-ink pb-6">
        <div className="flex flex-col gap-3.5">
          <p className="font-data flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs uppercase tracking-[0.1em] text-ink-2 sm:text-[0.8rem]">
            <span className="inline-flex items-center gap-2.5">
              <span className="led h-2.5 w-2.5" aria-hidden="true" />
              {fmtPct((t.countedSections / t.sections) * 100, 0)} das seções totalizadas
            </span>
            <span aria-hidden="true">·</span>
            <span>25 de outubro de 2026</span>
          </p>
          <h1 id="h-resultado" className="font-display text-6xl leading-[0.95] tracking-[-0.04em] sm:text-8xl">
            Presidente, <em className="text-ink-3">2º turno</em>
          </h1>
        </div>
        <p className="font-data text-xs leading-relaxed text-ink-2 sm:text-right">
          Fonte: {data.meta.source}
          <br />
          Referência {data.meta.reference}
        </p>
      </div>

      <div className="grid md:grid-cols-2">
        {cands.map(({ c, votes, pct }, i) => (
          <CandidateColumn key={c.id} c={c} votes={votes} pct={pct} first={i === 0} />
        ))}
      </div>

      <div className="card p-5 sm:px-8 sm:py-7">
        <SplitBar lula={t.lula} flavio={t.flavio} height={22} chevron />
        <p className="font-data mt-1 flex flex-wrap justify-between gap-2 text-xs text-ink-2">
          <span>Percentual sobre os votos válidos (sem brancos e nulos)</span>
          <span>Traço central = 50%</span>
        </p>
        <dl className="mt-7 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
          <Stat label="Diferença em votos" value={<CountUp value={Math.abs(m)} />} hint={`${fmtPp(Math.abs(marginPp(t)))} dos votos válidos`} />
          <Stat label="Comparecimento" value={fmtPct(turnoutPct(t))} hint={`${fmtInt(t.turnout)} de ${fmtInt(t.eligible)} aptos · abstenção ${fmtPct(abstentionPct(t))}`} />
          <Stat label="Brancos e nulos" value={fmtInt(t.blank + t.nullVotes)} hint={`Brancos ${fmtInt(t.blank)} · Nulos ${fmtInt(t.nullVotes)}`} />
        </dl>
      </div>
      <SourceNote meta={data.meta} extra={`${fmtInt(t.countedSections)} de ${fmtInt(t.sections)} seções`} />
    </section>
  );
};
