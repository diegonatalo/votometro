import { MidChevron } from "@/components/logo";
import { fmtPct } from "@/lib/format";

type Props = {
  lula: number;
  flavio: number;
  height?: number;
  label?: string;
  /** Mostra o circunflexo do logo abaixo do traço dos 50%. */
  chevron?: boolean;
};

/**
 * Barra proporcional dos votos válidos, com o traço dos 50% (a "marca do meio").
 * Os dois lados têm tratamento visual idêntico.
 */
export const SplitBar = ({ lula, flavio, height = 14, label, chevron }: Props) => {
  const total = lula + flavio;
  const pl = total ? (lula / total) * 100 : 50;
  const gap = height >= 14 ? 3 : 2;
  const tick = height + Math.max(8, Math.round(height * 0.6)) * 2;
  return (
    <div
      role="img"
      aria-label={label ?? `Lula ${fmtPct(pl)}, Flávio Bolsonaro ${fmtPct(100 - pl)} dos votos válidos`}
      className="relative w-full"
      style={{ paddingBlock: (tick - height) / 2, paddingBottom: chevron ? (tick - height) / 2 + 16 : undefined }}
    >
      <div className="flex w-full overflow-hidden rounded-full bg-surface-2" style={{ height, gap }}>
        <div className="shrink-0" style={{ width: `calc(${pl}% - ${gap / 2}px)`, background: "var(--lula)" }} />
        <div className="flex-1" style={{ background: "var(--flavio)" }} />
      </div>
      <div className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 bg-ink" style={{ height: tick }} aria-hidden="true" />
      {chevron ? <MidChevron className="absolute left-1/2 w-3.5 -translate-x-1/2" style={{ top: tick + 2 }} /> : null}
    </div>
  );
};
