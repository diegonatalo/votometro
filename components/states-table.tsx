"use client";

import { useMemo, useState } from "react";
import { REGIONS } from "@/lib/meta";
import { fmtInt, fmtPct, fmtPp, normalize } from "@/lib/format";
import { marginPp, voteMargin, abstentionPct, turnoutPct, validPct, winner } from "@/lib/stats";
import type { State, Region } from "@/types";

type SortKey = "name" | "lula" | "flavio" | "pl" | "pf" | "margin" | "turnout" | "abstention";

type Props = {
  states: State[];
};

export const StatesTable = ({ states }: Props) => {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });

  const rows = useMemo(() => {
    const nq = normalize(q);
    const filtered = states.filter((e) => (region === "all" || e.region === region) && (!nq || normalize(e.name).includes(nq) || e.uf.toLowerCase() === nq));
    const val = (e: State): number | string => {
      const p = validPct(e);
      switch (sort.key) {
        case "name": return e.name;
        case "lula": return e.lula;
        case "flavio": return e.flavio;
        case "pl": return p.lula;
        case "pf": return p.flavio;
        case "margin": return marginPp(e);
        case "turnout": return turnoutPct(e);
        case "abstention": return abstentionPct(e);
      }
    };
    return filtered.sort((a, b) => {
      const x = val(a), y = val(b);
      return (typeof x === "string" ? x.localeCompare(y as string, "pt-BR") : x - (y as number)) * sort.dir;
    });
  }, [states, q, region, sort]);

  const th = (key: SortKey, label: string, align: "left" | "right" = "right") => (
    <th scope="col" aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={`border-b border-ink px-3 py-2 font-medium ${align === "right" ? "text-right" : "text-left"}`}>
      <button type="button" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : key === "name" ? 1 : -1 }))} className="inline-flex items-center gap-1 whitespace-nowrap hover:underline">
        {label}
        <span aria-hidden="true" className="w-3 text-[0.65rem]">{sort.key === key ? (sort.dir === 1 ? "▲" : "▼") : ""}</span>
      </button>
    </th>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="tbl-busca">Buscar estado</label>
        <input id="tbl-busca" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar estado…" className="w-44 rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm placeholder:text-ink-3" />
        <div role="group" aria-label="Filtrar por região" className="flex flex-wrap gap-1">
          {([{ id: "all", name: "Todas" }, ...REGIONS] as { id: Region | "all"; name: string }[]).map((r) => (
            <button key={r.id} type="button" aria-pressed={region === r.id} onClick={() => setRegion(r.id)} className={`rounded-full border px-3 py-1 text-xs font-medium ${region === r.id ? "border-ink bg-ink text-bg" : "border-line hover:bg-surface-2"}`}>
              {r.name}
            </button>
          ))}
        </div>
        <p className="font-data ml-auto text-xs text-ink-3" aria-live="polite">{rows.length} de {states.length}</p>
      </div>
      <div className="scroll-thin max-w-full overflow-x-auto rounded-2xl border border-line bg-surface" tabIndex={0} role="region" aria-label="Tabela de estados, role para os lados em telas pequenas">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <caption className="sr-only">Resultado do 2º turno por estado</caption>
          <thead className="bg-surface-2 text-xs">
            <tr>
              {th("name", "Estado", "left")}
              {th("lula", "Lula")}
              {th("pl", "Lula %")}
              {th("flavio", "Flávio")}
              {th("pf", "Flávio %")}
              {th("margin", "Margem")}
              {th("turnout", "Compar.")}
              {th("abstention", "Abst.")}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const p = validPct(e);
              const w = winner(e);
              return (
                <tr key={e.uf} className="border-b border-line hover:bg-surface-2/60">
                  <th scope="row" className="px-3 py-2 text-left font-medium">
                    <span className="inline-block h-2.5 w-2.5 align-middle" style={{ background: w === "lula" ? "var(--lula)" : "var(--flavio)" }} aria-hidden="true" />{" "}
                    {e.name} <span className="font-data text-xs text-ink-3">{e.uf}</span>
                  </th>
                  <td className="font-data px-3 py-2 text-right">{fmtInt(e.lula)}</td>
                  <td className="font-data px-3 py-2 text-right">{fmtPct(p.lula)}</td>
                  <td className="font-data px-3 py-2 text-right">{fmtInt(e.flavio)}</td>
                  <td className="font-data px-3 py-2 text-right">{fmtPct(p.flavio)}</td>
                  <td className="font-data px-3 py-2 text-right whitespace-nowrap">
                    {fmtInt(Math.abs(voteMargin(e)))} <span className="text-ink-3">({fmtPp(Math.abs(marginPp(e)), 1)}, {w === "lula" ? "Lula" : "Flávio"})</span>
                  </td>
                  <td className="font-data px-3 py-2 text-right">{fmtPct(turnoutPct(e), 1)}</td>
                  <td className="font-data px-3 py-2 text-right">{fmtPct(abstentionPct(e), 1)}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-ink-3">Nenhum estado encontrado.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
