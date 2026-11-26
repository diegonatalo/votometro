"use client";

import { useMemo, useState } from "react";
import { REGIONS } from "@/lib/meta";
import { fmtInt, fmtPct, fmtPp, normalize } from "@/lib/format";
import { marginPp, voteMargin, abstentionPct, turnoutPct, validPct, winner } from "@/lib/stats";
import type { State, Region } from "@/types";
import { SplitBar } from "@/components/split-bar";

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
    <th scope="col" aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={`px-3 py-3 font-semibold ${align === "right" ? "text-right" : "text-left"}`}>
      <button type="button" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : key === "name" ? 1 : -1 }))} className={`inline-flex cursor-pointer items-center gap-1 py-1.5 whitespace-nowrap hover:text-ink ${sort.key === key ? "text-ink" : ""}`}>
        {label}
        <span aria-hidden="true" className="w-3 text-[0.65rem]">{sort.key === key ? (sort.dir === 1 ? "▲" : "▼") : ""}</span>
      </button>
    </th>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <label className="sr-only" htmlFor="states-search">Buscar estado</label>
        <div className="relative">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 fill-none stroke-ink-3 stroke-2 [stroke-linecap:round]" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
          <input id="states-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar estado…" className="h-11 w-60 rounded-full border border-line bg-surface pr-4 pl-11 text-[0.95rem] placeholder:text-ink-3" />
        </div>
        <div role="group" aria-label="Filtrar por região" className="flex flex-wrap gap-1">
          {([{ id: "all", name: "Todas" }, ...REGIONS] as { id: Region | "all"; name: string }[]).map((r) => (
            <button key={r.id} type="button" aria-pressed={region === r.id} onClick={() => setRegion(r.id)} className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-semibold ${region === r.id ? "border-inv bg-inv text-inv-ink" : "border-line text-ink-2 hover:bg-surface-2"}`}>
              {r.name}
            </button>
          ))}
        </div>
        <p className="font-data ml-auto text-xs text-ink-3" aria-live="polite">{rows.length} de {states.length}</p>
      </div>
      <div className="card scroll-thin max-w-full overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela de estados, role para os lados em telas pequenas">
        <table className="w-full min-w-[900px] border-collapse text-[0.95rem]">
          <caption className="sr-only">Resultado do 2º turno por estado</caption>
          <thead className="text-[0.8rem] text-ink-2">
            <tr>
              {th("name", "Estado", "left")}
              {th("lula", "Lula")}
              {th("pl", "Lula %")}
              <th scope="col" className="w-[18%] px-3 py-3"><span className="sr-only">Divisão dos votos válidos</span></th>
              {th("pf", "Flávio %", "left")}
              {th("flavio", "Flávio")}
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
                <tr key={e.uf} className="border-t border-line hover:bg-surface-2/60">
                  <th scope="row" className="px-3 py-2.5 pl-5 text-left font-semibold whitespace-nowrap">
                    <span className="font-data inline-block w-9 text-xs text-ink-3">{e.uf}</span>
                    {e.name}
                  </th>
                  <td className="font-data px-3 py-2.5 text-right">{fmtInt(e.lula)}</td>
                  <td className="font-data px-3 py-2.5 text-right font-semibold text-lula">{fmtPct(p.lula)}</td>
                  <td className="px-3 py-2.5"><SplitBar lula={e.lula} flavio={e.flavio} height={8} /></td>
                  <td className="font-data px-3 py-2.5 font-semibold text-flavio">{fmtPct(p.flavio)}</td>
                  <td className="font-data px-3 py-2.5 text-right">{fmtInt(e.flavio)}</td>
                  <td className="font-data px-3 py-2.5 text-right whitespace-nowrap">
                    {fmtInt(Math.abs(voteMargin(e)))} <span className="text-ink-3">({fmtPp(Math.abs(marginPp(e)), 1)}, {w === "lula" ? "Lula" : "Flávio"})</span>
                  </td>
                  <td className="font-data px-3 py-2.5 text-right text-ink-2">{fmtPct(turnoutPct(e), 1)}</td>
                  <td className="font-data px-3 py-2.5 pr-5 text-right text-ink-2">{fmtPct(abstentionPct(e), 1)}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-ink-3">Nenhum estado encontrado.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
