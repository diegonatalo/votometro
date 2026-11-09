import { fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { SectionTitle } from "@/components/section-title";
import { marginPp, voteMargin, validPct } from "@/lib/stats";
import type { MunicipalitiesFile, OvertimeFile, OvertimeGroup } from "@/types";
import { SourceNote } from "@/components/source-note";
import { SplitBar } from "@/components/split-bar";

const asTally = (g: OvertimeGroup) => ({ lula: g.lula, flavio: g.flavio });

function Method() {
  return (
    <details className="card mt-4 p-4 text-sm">
      <summary className="cursor-pointer font-medium">Como calculamos</summary>
      <div className="mt-3 space-y-3 text-ink-2">
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
}

export function Overtime({ data, munis }: { data: OvertimeFile; munis: MunicipalitiesFile }) {
  if (data.status === "unavailable" || !data.total) {
    return (
      <section id="17h" aria-labelledby="h-17h" className="pt-16">
        <SectionTitle id="h-17h" n="04">Votação além do horário regular</SectionTitle>
        <div className="card mt-4 p-4" role="status">
          <p className="font-medium">Dados ainda não disponíveis</p>
          <p className="mt-1 max-w-3xl text-sm text-ink-2">O TSE ainda não publicou os Boletins de Urna do 2º turno, único arquivo com a hora de encerramento das seções. Nenhum número foi estimado; a seção se preenche quando os arquivos saírem.</p>
        </div>
        <Method />
        <SourceNote meta={data.meta} />
      </section>
    );
  }

  const { after, upTo } = data.total;
  const pa = validPct(asTally(after));
  const pr = validPct(asTally(upTo));
  const nameOf = new Map(munis.rows.map((r) => [r[0], `${r[1]} (${r[2]})`]));
  const topMun = Object.entries(data.byMunicipality ?? {})
    .sort((a, b) => b[1][0] - a[1][0])
    .slice(0, 12);
  const ufs = Object.entries(data.byState ?? {})
    .filter(([, v]) => v.after.sections > 0)
    .sort((a, b) => b[1].after.sections - a[1].after.sections);
  const totalSections = after.sections + upTo.sections;

  return (
    <section id="17h" aria-labelledby="h-17h" className="pt-16">
      <SectionTitle id="h-17h" n="04">Votação além do horário regular</SectionTitle>
      <p className="mt-3 max-w-3xl text-ink-2" role="note">
        Medimos o resultado das <strong>seções</strong> cujo Boletim de Urna indica encerramento mais de 15 minutos depois das 17h (Brasília). Os dados não informam a hora de cada voto.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {[
          { title: "Seções que encerraram depois", g: after, p: pa },
          { title: "Demais seções", g: upTo, p: pr },
        ].map((b) => (
          <div key={b.title} className="card p-5">
            <h3 className="font-display text-xl font-semibold">{b.title}</h3>
            <p className="font-data text-xs text-ink-3">{fmtInt(b.g.sections)} seções · {fmtInt(b.g.turnout)} comparecimentos</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { n: "Lula", v: b.g.lula, pct: b.p.lula, tone: "lula" },
                { n: "Flávio", v: b.g.flavio, pct: b.p.flavio, tone: "flavio" },
              ]
                .sort((x, y) => y.v - x.v)
                .map((c) => (
                  <div key={c.n}>
                    <p className="flex items-center gap-1.5 text-sm text-ink-2"><span className="h-2.5 w-2.5" style={{ background: `var(--${c.tone})` }} aria-hidden="true" />{c.n}</p>
                    <p className="font-display text-3xl font-semibold">{fmtPct(c.pct)}</p>
                    <p className="font-data text-xs text-ink-2">{fmtInt(c.v)} votos</p>
                  </div>
                ))}
            </div>
            <div className="mt-3"><SplitBar lula={b.g.lula} flavio={b.g.flavio} height={10} /></div>
            <p className="font-data mt-2 text-xs text-ink-2">
              Diferença: {fmtInt(Math.abs(voteMargin(asTally(b.g))))} votos ({fmtPp(Math.abs(marginPp(asTally(b.g))))}, {voteMargin(asTally(b.g)) > 0 ? "Lula" : "Flávio"})
            </p>
          </div>
        ))}
      </div>
      <p className="font-data mt-3 text-xs text-ink-2">
        {fmtPct((after.sections / totalSections) * 100)} das seções com BU analisadas encerraram depois do corte. Seções sem horário utilizável: {fmtInt(data.total.noTime)}.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="section-eyebrow">Por estado</h3>
          <div className="scroll-thin mt-2 max-h-96 overflow-auto border border-line">
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
              <li key={l.minutes} className="border border-line px-2 py-1">&gt; {l.minutes} min: {fmtInt(l.sections)}</li>
            ))}
          </ul>
        </div>
      </div>
      <Method />
      <SourceNote meta={data.meta} />
    </section>
  );
}
