import { fmtInt, fmtPct, fmtPp } from "@/lib/format";
import { marginPp, voteMargin, turnoutPct, validPct } from "@/lib/stats";
import type { Tally } from "@/types";

export interface TooltipInfo {
  name: string;
  detail?: string;
  tally: Tally;
  x: number;
  y: number;
}

interface Props {
  info: TooltipInfo | null;
  width: number;
  height: number;
}

export const Tooltip = ({ info, width, height }: Props) => {
  if (!info) return null;
  const { tally: t } = info;
  const p = validPct(t);
  const m = voteMargin(t);
  const lead = [
    { id: "lula", name: "Lula", pct: p.lula, votes: t.lula, cls: "bg-lula" },
    { id: "flavio", name: "Flávio Bolsonaro", pct: p.flavio, votes: t.flavio, cls: "bg-flavio" },
  ].sort((a, b) => b.votes - a.votes);
  const W = 244;
  const left = info.x + 16 + W > width ? Math.max(4, info.x - W - 12) : info.x + 16;
  const top = Math.min(Math.max(4, info.y - 12), Math.max(4, height - 150));
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 rounded-xl border border-line bg-surface p-3 text-sm shadow-[var(--shadow)]"
      style={{ left, top, width: W }}
    >
      <p className="font-display text-base font-semibold leading-tight">{info.name}</p>
      {info.detail ? <p className="text-xs text-ink-3">{info.detail}</p> : null}
      <ul className="mt-2 space-y-1">
        {lead.map((c) => (
          <li key={c.id} className="flex items-baseline justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className={`inline-block h-2.5 w-2.5 ${c.cls}`} aria-hidden="true" />
              {c.name}
            </span>
            <span className="font-data text-xs">
              <strong className="text-sm font-semibold">{fmtPct(c.pct)}</strong> · {fmtInt(c.votes)}
            </span>
          </li>
        ))}
      </ul>
      <p className="font-data mt-2 border-t border-line pt-2 text-[0.7rem] leading-relaxed text-ink-2">
        Margem: {fmtInt(Math.abs(m))} votos ({fmtPp(Math.abs(marginPp(t)))})
        <br />
        Participação: {fmtPct(turnoutPct(t))}
      </p>
    </div>
  );
};
