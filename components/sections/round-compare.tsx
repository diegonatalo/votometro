import { fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { SectionTitle } from "@/components/section-title";
import { CANDIDATES } from "@/lib/meta";
import { turnoutPct } from "@/lib/stats";
import type { NationalFile, Tally, Round1Row } from "@/types";
import { SourceNote } from "@/components/source-note";

const TH = "border-b border-ink px-3 py-2 text-right font-medium";

const CompareTable = ({ a, b, caption, id }: { a: Round1Row; b: Tally; caption: string; id: string }) => {
  const valid1 = a.lula + a.flavio + a.others;
  const valid2 = b.lula + b.flavio;
  const rows = [
    { id: "lula", name: CANDIDATES.lula.name, v1: a.lula, v2: b.lula, tone: "lula" },
    { id: "flavio", name: CANDIDATES.flavio.name, v1: a.flavio, v2: b.flavio, tone: "flavio" },
  ].sort((x, y) => y.v2 - x.v2);
  const bn1 = a.blank + a.nullVotes;
  const bn2 = b.blank + b.nullVotes;
  const dComp = turnoutPct(b) - (a.turnout / a.eligible) * 100;
  const dash = <td className="px-3 py-2.5 text-right text-ink-3">—</td>;
  return (
    <div id={id} className="scroll-thin card overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-2 text-xs">
          <tr>
            <th scope="col" className="border-b border-ink px-3 py-2 text-left font-medium">{caption}</th>
            <th scope="col" className={TH}>1º turno</th>
            <th scope="col" className={TH}>% válidos</th>
            <th scope="col" className={TH}>2º turno</th>
            <th scope="col" className={TH}>% válidos</th>
            <th scope="col" className={TH}>Variação em votos</th>
            <th scope="col" className={TH}>Variação (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-line">
              <th scope="row" className="px-3 py-2.5 text-left font-medium">
                <span className="mr-1.5 inline-block h-2.5 w-2.5 align-middle" style={{ background: `var(--${r.tone})` }} aria-hidden="true" />
                {r.name}
              </th>
              <td className="font-data px-3 py-2.5 text-right">{fmtInt(r.v1)}</td>
              <td className="font-data px-3 py-2.5 text-right">{fmtPct((r.v1 / valid1) * 100)}</td>
              <td className="font-data px-3 py-2.5 text-right">{fmtInt(r.v2)}</td>
              <td className="font-data px-3 py-2.5 text-right">{fmtPct((r.v2 / valid2) * 100)}</td>
              <td className="font-data px-3 py-2.5 text-right font-semibold">{r.v2 >= r.v1 ? "+" : "−"}{fmtInt(Math.abs(r.v2 - r.v1))}</td>
              <td className="font-data px-3 py-2.5 text-right">{r.v2 >= r.v1 ? "+" : "−"}{fmtPct((Math.abs(r.v2 - r.v1) / r.v1) * 100, 1)}</td>
            </tr>
          ))}
          <tr className="border-b border-line">
            <th scope="row" className="px-3 py-2.5 text-left font-medium text-ink-2">Outros candidatos</th>
            <td className="font-data px-3 py-2.5 text-right">{fmtInt(a.others)}</td>
            <td className="font-data px-3 py-2.5 text-right">{fmtPct((a.others / valid1) * 100)}</td>
            {dash}{dash}{dash}{dash}
          </tr>
          <tr>
            <th scope="row" className="px-3 py-2.5 text-left font-medium text-ink-2">Brancos + nulos</th>
            <td className="font-data px-3 py-2.5 text-right">{fmtInt(bn1)}</td>
            {dash}
            <td className="font-data px-3 py-2.5 text-right">{fmtInt(bn2)}</td>
            {dash}
            <td className="font-data px-3 py-2.5 text-right font-semibold">{bn2 >= bn1 ? "+" : "−"}{fmtInt(Math.abs(bn2 - bn1))}</td>
            <td className="font-data px-3 py-2.5 text-right">{bn2 >= bn1 ? "+" : "−"}{fmtPct((Math.abs(bn2 - bn1) / bn1) * 100, 1)}</td>
          </tr>
        </tbody>
      </table>
      <p className="font-data border-t border-line px-3 py-2 text-xs text-ink-2">
        Comparecimento: {fmtPct((a.turnout / a.eligible) * 100)} no 1º turno e {fmtPct(turnoutPct(b))} no 2º ({dComp >= 0 ? "+" : "−"}{fmtPp(Math.abs(dComp))} de variação).
      </p>
    </div>
  );
};

export const RoundCompare = ({ data }: { data: NationalFile }) => {
  const valid1 = data.round1.national.lula + data.round1.national.flavio + data.round1.national.others;
  return (
    <section id="turnos" aria-labelledby="h-turnos" className="pt-16">
      <SectionTitle id="h-turnos" n="03">Entre os turnos, no Brasil e no exterior</SectionTitle>
      <p className="mt-3 max-w-2xl text-ink-2">
        No 1º turno (4 de outubro), os percentuais consideram os votos válidos de todos os candidatos ({fmtInt(valid1)} no Brasil); no 2º turno, apenas os dois.
      </p>
      <div className="mt-5 space-y-4">
        <CompareTable id="turnos-brasil" caption="Brasil (total, com exterior)" a={data.round1.national} b={data.national} />
        <CompareTable id="exterior" caption="Exterior" a={data.round1.abroad} b={data.abroad} />
      </div>
      <SourceNote meta={data.round1.meta} extra={`2º turno: ${data.meta.reference}`} />
    </section>
  );
};
