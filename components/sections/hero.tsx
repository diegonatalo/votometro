import { fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { marginPp, voteMargin, abstentionPct, turnoutPct, validPct } from "@/lib/stats";
import type { Candidate, NationalFile } from "@/types";
import { displayName, NumberBoxes, PartyBadge, Photo } from "@/components/candidate";
import { CountUp } from "@/components/count-up";
import { SourceNote } from "@/components/source-note";
import { SplitBar } from "@/components/split-bar";
import { StatTile } from "@/components/stat-tile";

const CandidateCard = ({ c, votes, pct }: { c: Candidate; votes: number; pct: number }) => {
  return (
    <article
      className="card relative overflow-hidden p-5 sm:p-7"
      style={{ backgroundImage: `radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--${c.id}) 18%, transparent), transparent 62%)` }}
      aria-label={displayName(c)}
    >
      <div className="flex gap-4 sm:gap-5">
        <Photo person={{ photo: c.photo, ballotName: displayName(c) }} tone={c.id} width={128} />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{displayName(c)}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PartyBadge sigla={c.party} title={c.partyName} />
            <NumberBoxes number={c.number} size="sm" />
          </div>
          <p className="mt-2 text-xs leading-snug text-ink-2">
            {c.coalition !== c.party ? `Coligação: ${c.coalition}` : c.partyName}
          </p>
          <p className="mt-1 text-xs text-ink-2">Vice: {c.vice.ballotName} ({c.vice.party})</p>
        </div>
      </div>
      <p className="font-display mt-5 text-6xl font-extrabold leading-none tracking-tight sm:text-8xl" style={{ color: `var(--${c.id})` }}>
        <CountUp value={pct} kind="pct" />
      </p>
      <p className="font-data mt-3 flex items-baseline justify-between gap-3 text-lg">
        <span>
          <CountUp value={votes} /> <span className="text-sm text-ink-2">votos</span>
        </span>
        <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.7rem] text-ink-2">TSE: {c.electionStatus}</span>
      </p>
    </article>
  );
};

export const Hero = ({ data }: { data: NationalFile }) => {
  const t = data.national;
  const p = validPct(t);
  const m = voteMargin(t);
  const cands = data.candidates
    .map((c) => ({ c, votes: t[c.id], pct: p[c.id] }))
    .sort((a, b) => b.votes - a.votes);

  return (
    <section id="resultado" aria-labelledby="h-resultado" className="pt-8 sm:pt-12">
      <p className="font-data flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-ink-2">
        <span className="inline-flex items-center gap-2">
          <span className="led h-2.5 w-2.5 bg-accent" aria-hidden="true" />
          {fmtPct((t.countedSections / t.sections) * 100, 0)} das seções totalizadas
        </span>
        <span aria-hidden="true">/</span>
        <span>25 de outubro de 2026</span>
      </p>
      <h1 id="h-resultado" className="font-display mt-3 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
        Presidente, <span className="text-ink-3">2º turno</span>
      </h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cands.map(({ c, votes, pct }) => (
          <CandidateCard key={c.id} c={c} votes={votes} pct={pct} />
        ))}
      </div>
      <div className="card mt-4 p-5 sm:p-6">
        <SplitBar lula={t.lula} flavio={t.flavio} height={16} />
        <p className="font-data mt-2 flex justify-between gap-3 text-xs text-ink-2">
          <span>Percentuais sobre votos válidos (exclui brancos e nulos)</span>
          <span>Ordem: mais votados primeiro</span>
        </p>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-line pt-5 sm:grid-cols-3">
        <StatTile label="Diferença em votos" value={<CountUp value={Math.abs(m)} />} hint={`${fmtPp(Math.abs(marginPp(t)))} sobre os votos válidos`} />
        <StatTile label="Comparecimento" value={fmtPct(turnoutPct(t))} hint={`${fmtInt(t.turnout)} de ${fmtInt(t.eligible)} aptos · abstenção ${fmtPct(abstentionPct(t))}`} />
        <StatTile label="Brancos e nulos" value={fmtInt(t.blank + t.nullVotes)} hint={`Brancos ${fmtInt(t.blank)} · Nulos ${fmtInt(t.nullVotes)}`} />
        </div>
      </div>
      <SourceNote meta={data.meta} extra={`${fmtInt(t.countedSections)} de ${fmtInt(t.sections)} seções`} />
    </section>
  );
};
