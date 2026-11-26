/**
 * Escala vertical do gráfico de inclinação (1º → 2º turno): leva os valores ao intervalo
 * [top, bottom] da área do gráfico, com folga de `pad` (fração da amplitude) acima e abaixo.
 * O maior valor fica em cima (y menor).
 */
export function slopeScale(values: number[], top: number, bottom: number, pad = 0.12): (v: number) => number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || Math.abs(max) || 1;
  const lo = min - span * pad;
  const hi = max + span * pad;
  return (v) => bottom - ((v - lo) / (hi - lo)) * (bottom - top);
}
