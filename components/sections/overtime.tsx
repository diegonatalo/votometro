import { fmtInt, fmtPct } from "@/lib/format";
import { CANDIDATES } from "@/lib/meta";
import { overtimeSummary } from "@/lib/overtime";
import { SectionTitle } from "@/components/section-title";
import { validPct } from "@/lib/stats";
import type { MunicipalitiesFile, OvertimeFile, OvertimeGroup } from "@/types";
import { SourceNote } from "@/components/source-note";
import { SplitBar } from "@/components/split-bar";

const asTally = (g: OvertimeGroup) => ({ lula: g.lula, flavio: g.flavio });

const Method = () => {
  return (
    <details className="card mt-4 px-6 py-5 text-[0.95rem] sm:px-7">
      <summary className="cursor-pointer font-bold">Como calculamos</summary>
      <div className="mt-4 grid gap-6 leading-relaxed text-ink-2 md:grid-cols-3">
        <p>
          <strong className="text-ink">O que é medido.</strong> O Boletim de Urna (BU) de cada seção registra a hora de abertura e a de encerramento da urna, em horário local da urna, e os votos da seção. A votação regular vai das 8h às 17h de Brasília; quem está na fila às 17h ainda vota.
        </p>
        <p>
          <strong className="text-ink">Como separamos.</strong> Para cada município, o horário regular de encerramento é a hora mais comum de abertura das seções mais nove horas. Assim o corte equivale a 17h de Brasília em qualquer fuso. Consideramos “encerrou depois do horário” a seção cujo BU registra encerramento mais de 15 minutos após esse corte, porque o fechamento da urna costuma ocorrer minutos depois das 17h mesmo sem fila. A tabela de limiares mostra quantas seções passam por cada tolerância.
        </p>
        <p>
          <strong className="text-ink">O que não é medido.</strong> Os arquivos públicos não registram a hora de cada voto. Por isso os números abaixo são o resultado <em>das seções</em> que encerraram depois do horário, e não dos votos dados depois das 17h. Nada é estimado ou projetado.
        </p>
      </div>
    </details>
  );
};

export const Overtime = ({ data, munis }: { data: OvertimeFile; munis: MunicipalitiesFile }) => {
  if (data.status === "unavailable" || !data.total) {
    return (
      <section id="17h" aria-labelledby="h-17h" className="pt-20 sm:pt-28">
        <SectionTitle id="h-17h" n="04" em="do horário regular">Votação além</SectionTitle>
        <div className="mt-8 flex flex-wrap items-center gap-8 rounded-[1.75rem] border-[1.5px] border-dashed border-line p-6 sm:p-10" role="status">
          <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" aria-hidden="true">
            <circle cx="60" cy="60" r="50" fill="var(--surface-2)" />
            <circle cx="60" cy="60" r="38" fill="none" stroke="var(--ink)" strokeWidth="6" />
            <path d="M60 38v22l14 9" fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0 flex-[1_1_24rem]">
            <p className="section-eyebrow">Aguardando o TSE</p>
            <p className="font-display mt-2 text-3xl tracking-[-0.02em]">Dados ainda não disponíveis</p>
            <p className="mt-2.5 max-w-2xl leading-relaxed text-ink-2">O TSE ainda não publicou os Boletins de Urna do 2º turno, único arquivo com a hora de encerramento das seções. Nenhum número foi estimado; a seção se preenche quando os arquivos saírem.</p>
          </div>
        </div>
        <Method />
        <SourceNote meta={data.meta} />
      </section>
    );
  }

  const { after, upTo } = data.total;
  const pr = validPct(asTally(upTo));
  const sum = overtimeSummary(after, upTo);
  const nameOf = new Map(munis.rows.map((r) => [r[0], `${r[1]} (${r[2]})`]));
  const topMun = Object.entries(data.byMunicipality ?? {})
    .sort((a, b) => b[1][0] - a[1][0])
    .slice(0, 12);
  const ufs = Object.entries(data.byState ?? {})
    .filter(([, v]) => v.after.sections > 0)
    .sort((a, b) => b[1].after.sections - a[1].after.sections);

  return (
    <section id="17h" aria-labelledby="h-17h" className="pt-20 sm:pt-28">
      <SectionTitle id="h-17h" n="04" em="do horário regular">Votação além</SectionTitle>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-2">
        Quantos votos vieram das seções que fecharam depois do horário regular, para quem foram e quanto pesam no resultado.
      </p>

      <div className="card mt-8 overflow-hidden">
        <div className="p-6 sm:p-8">
          <p className="section-eyebrow">Seções que fecharam depois das 17h15 (Brasília)</p>
          <p className="font-display mt-3 text-5xl leading-none tracking-[-0.03em] sm:text-7xl">
            {fmtInt(sum.votes)} <span className="text-2xl text-ink-2 sm:text-3xl">votos</span>
          </p>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-2">
            <strong className="text-ink">{fmtPct(sum.ofAllVotes)} de todos os votos</strong> do 2º turno no Brasil, em {fmtInt(sum.sections)} seções ({fmtPct(sum.ofAllSections)} das seções).
          </p>
        </div>
        <div className="grid border-t border-line md:grid-cols-2">
          {sum.candidates.map((c, i) => (
            <div key={c.id} className={`flex flex-col gap-2 p-6 sm:p-8 ${i === 0 ? "border-b border-line md:border-r md:border-b-0" : ""}`}>
              <p className="flex items-center gap-2 font-bold">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: `var(--${c.id})` }} aria-hidden="true" />
                {CANDIDATES[c.id].name}
              </p>
              <p className="font-display text-5xl leading-none tracking-[-0.03em]" style={{ color: `var(--${c.id})` }}>
                {fmtInt(c.votes)} <span className="text-xl text-ink-2">votos</span>
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-ink-2">Dos votos válidos dessas seções</dt>
                  <dd className="font-display mt-1 text-3xl tracking-[-0.02em]">{fmtPct(c.validShare)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-2">De todos os votos do candidato</dt>
                  <dd className="font-display mt-1 text-3xl tracking-[-0.02em]">{fmtPct(c.ofCandidateTotal)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <div className="border-t border-line px-6 py-5 sm:px-8">
          <SplitBar lula={after.lula} flavio={after.flavio} height={12} />
          <p className="font-data mt-1 flex flex-wrap justify-between gap-2 text-xs text-ink-2">
            <span>Brancos e nulos nessas seções: {fmtInt(sum.blankNull)}</span>
            <span>Nas demais seções: Lula {fmtPct(pr.lula)} · Flávio {fmtPct(pr.flavio)}</span>
          </p>
        </div>
      </div>

      <div role="note" className="mt-4 flex gap-3 rounded-3xl bg-surface-2 p-5 text-[0.95rem] leading-relaxed sm:px-7">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 fill-none stroke-ink stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></svg>
        <p>
          <strong>São todos os votos dessas seções, inclusive os dados antes das 17h.</strong> O Boletim de Urna registra só a hora em que cada seção fechou, não a hora de cada voto. Por isso não dá para saber quantos votos foram dados depois das 17h. Consideramos fora do horário a seção que fechou mais de 15 minutos depois das 17h, porque a urna costuma ser encerrada alguns minutos depois mesmo sem fila. O recorte não inclui o exterior.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="section-eyebrow">Por estado</h3>
          <div className="scroll-thin mt-2 max-h-96 overflow-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[420px] text-sm">
              <caption className="sr-only">Seções que encerraram depois do horário, por estado</caption>
              <thead className="sticky top-0 bg-surface-2 text-xs">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-medium">UF</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Seções</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Lula %</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Flávio %</th>
                </tr>
              </thead>
              <tbody>
                {ufs.map(([uf, v]) => {
                  const p = validPct(asTally(v.after));
                  return (
                    <tr key={uf} className="border-t border-line">
                      <th scope="row" className="px-3 py-1.5 text-left font-medium">{uf}</th>
                      <td className="font-data px-3 py-1.5 text-right">{fmtInt(v.after.sections)}</td>
                      <td className="font-data px-3 py-1.5 text-right">{fmtPct(p.lula)}</td>
                      <td className="font-data px-3 py-1.5 text-right">{fmtPct(p.flavio)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="section-eyebrow">Municípios com mais seções</h3>
          <ol className="mt-2 border-t border-line text-sm">
            {topMun.map(([ibge, v]) => {
              const p = validPct({ lula: v[1], flavio: v[2] });
              return (
                <li key={ibge} className="flex items-baseline justify-between gap-3 border-b border-line py-1.5">
                  <span>{nameOf.get(ibge) ?? ibge}</span>
                  <span className="font-data text-xs text-ink-2">{fmtInt(v[0])} seções · L {fmtPct(p.lula, 1)} · F {fmtPct(p.flavio, 1)}</span>
                </li>
              );
            })}
          </ol>
          <h3 className="section-eyebrow mt-6">Quantas seções passam por cada tolerância</h3>
          <ul className="font-data mt-2 flex flex-wrap gap-2 text-xs">
            {data.thresholds?.map((l) => (
              <li key={l.minutes} className="rounded-full border border-line px-3 py-1.5">&gt; {l.minutes} min: {fmtInt(l.sections)}</li>
            ))}
          </ul>
        </div>
      </div>
      <Method />
      <SourceNote meta={data.meta} />
    </section>
  );
};
