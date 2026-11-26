import { fmtCompact, fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { RoundTabs } from "@/components/round-tabs";
import { SectionTitle } from "@/components/section-title";
import { CANDIDATES } from "@/lib/meta";
import { slopeScale } from "@/lib/slope";
import { turnoutPct } from "@/lib/stats";
import type { NationalFile, Tally, Round1Row } from "@/types";
import { SourceNote } from "@/components/source-note";

const TD = "font-data px-3 py-3.5 text-right";
const TH = "px-3 py-3.5 text-right font-semibold";
const sign = (n: number) => (n >= 0 ? "+" : "−");

const CompareTable = ({ a, b, caption }: { a: Round1Row; b: Tally; caption: string }) => {
  const valid1 = a.lula + a.flavio + a.others;
  const valid2 = b.lula + b.flavio;
  const rows = [
    { id: "lula", name: CANDIDATES.lula.name, v1: a.lula, v2: b.lula },
    { id: "flavio", name: CANDIDATES.flavio.name, v1: a.flavio, v2: b.flavio },
  ].sort((x, y) => y.v2 - x.v2);
  const bn1 = a.blank + a.nullVotes;
  const bn2 = b.blank + b.nullVotes;
  const dash = <td className="px-3 py-3.5 text-right text-ink-3">—</td>;
  return (
    <div className="scroll-thin overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-[0.95rem]">
        <caption className="sr-only">{caption}: 1º e 2º turno</caption>
        <thead className="text-[0.8rem] text-ink-2">
          <tr>
            <th scope="col" className="px-5 py-3.5 text-left font-semibold">Candidato</th>
            <th scope="col" className={TH}>1º turno</th>
            <th scope="col" className={TH}>% válidos</th>
            <th scope="col" className={TH}>2º turno</th>
            <th scope="col" className={TH}>% válidos</th>
            <th scope="col" className={TH}>Variação</th>
            <th scope="col" className={`${TH} pr-5`}>Variação (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-line">
              <th scope="row" className="px-5 py-3.5 text-left font-semibold">
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-[3px] align-middle" style={{ background: `var(--${r.id})` }} aria-hidden="true" />
                {r.name}
              </th>
              <td className={TD}>{fmtInt(r.v1)}</td>
              <td className={TD}>{fmtPct((r.v1 / valid1) * 100)}</td>
              <td className={TD}>{fmtInt(r.v2)}</td>
              <td className={TD}>{fmtPct((r.v2 / valid2) * 100)}</td>
              <td className={`${TD} font-semibold`}>{sign(r.v2 - r.v1)}{fmtInt(Math.abs(r.v2 - r.v1))}</td>
              <td className={`${TD} pr-5`}>{sign(r.v2 - r.v1)}{fmtPct((Math.abs(r.v2 - r.v1) / r.v1) * 100, 1)}</td>
            </tr>
          ))}
          <tr className="border-t border-line text-ink-2">
            <th scope="row" className="px-5 py-3.5 text-left font-medium">Outros candidatos</th>
            <td className={TD}>{fmtInt(a.others)}</td>
            <td className={TD}>{fmtPct((a.others / valid1) * 100)}</td>
            {dash}{dash}{dash}{dash}
          </tr>
          <tr className="border-t border-line text-ink-2">
            <th scope="row" className="px-5 py-3.5 text-left font-medium">Brancos + nulos</th>
            <td className={TD}>{fmtInt(bn1)}</td>
            {dash}
            <td className={TD}>{fmtInt(bn2)}</td>
            {dash}
            <td className={`${TD} font-semibold`}>{sign(bn2 - bn1)}{fmtInt(Math.abs(bn2 - bn1))}</td>
            <td className={`${TD} pr-5`}>{sign(bn2 - bn1)}{fmtPct((Math.abs(bn2 - bn1) / bn1) * 100, 1)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

/** Gráfico de inclinação: votos de cada candidato no 1º e no 2º turno. */
const Slope = ({ a, b }: { a: Round1Row; b: Tally }) => {
  const y = slopeScale([a.lula, a.flavio, b.lula, b.flavio], 30, 280);
  const lines = (["lula", "flavio"] as const).map((id) => ({ id, name: CANDIDATES[id].name, y1: y(a[id]), y2: y(b[id]), v1: a[id], v2: b[id] }));
  const lead1 = a.lula >= a.flavio ? "Lula" : "Flávio Bolsonaro";
  const lead2 = b.lula >= b.flavio ? "Lula" : "Flávio Bolsonaro";
  return (
    <svg
      viewBox="0 0 560 330"
      className="block h-auto w-full"
      role="img"
      aria-label={`Votos no 1º e no 2º turno. ${lead1} teve mais votos no 1º turno; ${lead2}, no 2º. ${lines.map((l) => `${l.name}: ${fmtCompact(l.v1)} para ${fmtCompact(l.v2)}`).join("; ")}.`}
    >
      <line x1="120" y1="18" x2="120" y2="292" stroke="var(--line)" />
      <line x1="390" y1="18" x2="390" y2="292" stroke="var(--line)" />
      <text x="120" y="320" textAnchor="middle" fill="var(--ink-2)" className="font-data" fontSize="13">1º turno</text>
      <text x="390" y="320" textAnchor="middle" fill="var(--ink-2)" className="font-data" fontSize="13">2º turno</text>
      {lines.map((l) => (
        <g key={l.id}>
          <line x1="120" y1={l.y1} x2="390" y2={l.y2} stroke={`var(--${l.id})`} strokeWidth="5" strokeLinecap="round" />
          <circle cx="120" cy={l.y1} r="8" fill={`var(--${l.id})`} />
          <circle cx="390" cy={l.y2} r="8" fill={`var(--${l.id})`} />
          <text x="104" y={l.y1 + 5} textAnchor="end" fill="var(--ink)" className="font-data" fontSize="14">{fmtCompact(l.v1)}</text>
          <text x="406" y={l.y2 + 5} fill={`var(--${l.id})`} fontWeight="700" fontSize="15">{l.id === "lula" ? "Lula" : "Flávio"} {fmtCompact(l.v2)}</text>
        </g>
      ))}
    </svg>
  );
};

const Gain = ({ id, name, a, b, valid1, valid2 }: { id: "lula" | "flavio"; name: string; a: number; b: number; valid1: number; valid2: number }) => (
  <div className="rounded-3xl px-6 py-5 sm:px-7 sm:py-6" style={{ background: `var(--${id}-soft)` }}>
    <p className="font-bold">{name}</p>
    <p className="font-display mt-1.5 text-4xl leading-none tracking-[-0.02em] sm:text-5xl" style={{ color: `var(--${id})` }}>
      {sign(b - a)}{fmtInt(Math.abs(b - a))}
    </p>
    <p className="font-data mt-2 text-xs text-ink-2 sm:text-[0.8rem]">
      {sign(b - a)}{fmtPct((Math.abs(b - a) / a) * 100, 1)} · de {fmtPct((a / valid1) * 100)} para {fmtPct((b / valid2) * 100)} dos válidos
    </p>
  </div>
);

export const RoundCompare = ({ data }: { data: NationalFile }) => {
  const r1 = data.round1.national;
  const r2 = data.national;
  const valid1 = r1.lula + r1.flavio + r1.others;
  const valid2 = r2.lula + r2.flavio;
  const comp = (a: Round1Row, b: Tally) => {
    const t1 = (a.turnout / a.eligible) * 100;
    const d = turnoutPct(b) - t1;
    return `Comparecimento ${fmtPct(t1)} → ${fmtPct(turnoutPct(b))} (${sign(d)}${fmtPp(Math.abs(d))})`;
  };
  const gains = (["lula", "flavio"] as const)
    .map((id) => ({ id, name: CANDIDATES[id].name, a: r1[id], b: r2[id] }))
    .sort((x, y) => y.b - x.b);

  return (
    <section id="turnos" aria-labelledby="h-turnos" className="pt-20 sm:pt-28">
      <SectionTitle id="h-turnos" n="03" em="no Brasil e no exterior">Do 1º para o 2º turno,</SectionTitle>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
        No 1º turno (4 de outubro), os percentuais consideram os votos válidos de todos os candidatos ({fmtInt(valid1)} no Brasil); no 2º turno, apenas os dois.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <figure className="card m-0 p-5 sm:p-7">
          <Slope a={r1} b={r2} />
        </figure>
        <div className="flex flex-col gap-4">
          {gains.map((g) => (
            <Gain key={g.id} id={g.id} name={g.name} a={g.a} b={g.b} valid1={valid1} valid2={valid2} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <RoundTabs
          label="Recorte da comparação"
          tabs={[
            { id: "brasil", label: "Brasil", content: <><CompareTable caption="Brasil (total, com exterior)" a={r1} b={r2} /><p className="font-data border-t border-line px-5 py-3 text-xs text-ink-2">{comp(r1, r2)}</p></> },
            { id: "exterior", label: "Exterior", content: <><CompareTable caption="Exterior" a={data.round1.abroad} b={data.abroad} /><p className="font-data border-t border-line px-5 py-3 text-xs text-ink-2">{comp(data.round1.abroad, data.abroad)}</p></> },
          ]}
        />
      </div>
      <SourceNote meta={data.round1.meta} extra={`2º turno: ${data.meta.reference}`} />
    </section>
  );
};
