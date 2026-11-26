import { cssVarForPctLula } from "@/lib/colors";
import { loadStates, loadStatesTopo } from "@/lib/data";
import { BASE, buildStateShapes, featuresOf, makeProjection } from "@/lib/map-geo";
import { validPct, winner } from "@/lib/stats";

/**
 * Mapa dos estados sem interação, desenhado no servidor. As cores vêm das variáveis CSS
 * do tema, então trocam de claro para escuro sem JavaScript. Para a landing.
 */
export const StaticMap = ({ className }: { className?: string }) => {
  const topo = loadStatesTopo();
  const states = new Map(loadStates().states.map((s) => [s.uf, s]));
  const shapes = buildStateShapes(topo, makeProjection(featuresOf(topo, "estados")));
  const wins = { lula: 0, flavio: 0 };
  for (const s of states.values()) {
    const w = winner(s);
    if (w !== "tie") wins[w]++;
  }
  return (
    <svg
      viewBox={`0 0 ${BASE} ${BASE}`}
      className={className}
      role="img"
      aria-label={`Mapa do Brasil por estado: Lula à frente em ${wins.lula} unidades da federação e Flávio Bolsonaro em ${wins.flavio}`}
    >
      {shapes.map((sh) => {
        const s = states.get(sh.uf);
        return (
          <path
            key={sh.uf}
            d={sh.d}
            fill={s ? cssVarForPctLula(validPct(s).lula) : "var(--line)"}
            stroke="var(--surface)"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
};
