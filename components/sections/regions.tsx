import { fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { SectionTitle } from "@/components/section-title";
import { REGIONS } from "@/lib/meta";
import { marginPp, voteMargin, validPct, sumUp, winner } from "@/lib/stats";
import type { State, SourceMeta } from "@/types";
import { SourceNote } from "@/components/source-note";
import { SplitBar } from "@/components/split-bar";

export const Regions = ({ states, meta }: { states: State[]; meta: SourceMeta }) => {
  const wins = { lula: 0, flavio: 0 };
  for (const e of states) {
    const w = winner(e);
    if (w !== "tie") wins[w]++;
  }
  const dfWinner = winner(states.find((e) => e.uf === "DF") ?? states[0]!);

  return (
    <section id="regioes" aria-labelledby="h-regioes" className="pt-20 sm:pt-28">
      <SectionTitle id="h-regioes" n="02" em="em cada região">Quem ficou na frente</SectionTitle>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
        Entre as 27 unidades da federação (26 estados e o Distrito Federal), Lula ficou à frente em <strong className="text-lula">{wins.lula}</strong> e Flávio Bolsonaro em{" "}
        <strong className="text-flavio">{wins.flavio}</strong>
        {dfWinner === "flavio" ? ", incluindo o Distrito Federal" : dfWinner === "lula" ? ", sem contar o Distrito Federal" : ""}.
      </p>

      <ul className="mt-8 border-t border-line">
        {REGIONS.map((r) => {
          const es = states.filter((e) => e.region === r.id).sort((a, b) => a.uf.localeCompare(b.uf));
          const t = sumUp(es);
          const p = validPct(t);
          const m = voteMargin(t);
          const wl = es.filter((e) => winner(e) === "lula").length;
          const wf = es.filter((e) => winner(e) === "flavio").length;
          return (
            <li key={r.id} className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-line py-5 sm:py-6">
              <div className="min-w-40 flex-[0_1_12rem]">
                <h3 className="text-xl font-bold sm:text-[1.4rem]">{r.name}</h3>
                <p className="mt-1.5 flex flex-wrap gap-1" aria-label={`${es.length} UFs: Lula à frente em ${wl}, Flávio em ${wf}`}>
                  {es.map((e) => {
                    const w = winner(e);
                    return (
                      <span
                        key={e.uf}
                        title={e.name}
                        aria-hidden="true"
                        className="font-data rounded px-1 py-0.5 text-[0.65rem] font-semibold text-on-cand"
                        style={{ background: w === "lula" ? "var(--lula)" : w === "flavio" ? "var(--flavio)" : "var(--ink-3)" }}
                      >
                        {e.uf}
                      </span>
                    );
                  })}
                </p>
              </div>
              <div className="flex min-w-0 flex-[1_1_22rem] items-center gap-3.5">
                <span className="font-data w-16 text-right text-[0.95rem] font-semibold text-lula">{fmtPct(p.lula)}</span>
                <div className="flex-1"><SplitBar lula={t.lula} flavio={t.flavio} height={14} /></div>
                <span className="font-data w-16 text-[0.95rem] font-semibold text-flavio">{fmtPct(p.flavio)}</span>
              </div>
              <p className="font-data flex-[0_1_15rem] text-sm text-ink-2 sm:text-right">
                +{fmtInt(Math.abs(m))} {m > 0 ? "Lula" : "Flávio"} <span className="text-ink-3">({fmtPp(Math.abs(marginPp(t)), 2)})</span>
              </p>
            </li>
          );
        })}
      </ul>
      <SourceNote meta={meta} extra="Totais regionais somam as UFs; o exterior fica fora das regiões" />
    </section>
  );
};
