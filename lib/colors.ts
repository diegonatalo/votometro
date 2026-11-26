export type ThemeName = "light" | "dark";
export type Leader = "lula" | "flavio";

/**
 * Escala do mapa em faixas: cor pelo candidato à frente, intensidade pelo percentual
 * dos votos válidos do mais votado. Limites inferiores de cada faixa, em %.
 */
export const BIN_EDGES = [50, 55, 60, 70] as const;

/** Rótulos das faixas, da mais fraca à mais forte. */
export const BIN_LABELS = ["50–55%", "55–60%", "60–70%", "70% ou mais"] as const;

const BINS: Record<ThemeName, Record<Leader, readonly [string, string, string, string]>> = {
  light: {
    lula: ["#f4d4cc", "#e9998a", "#d45a42", "#a82a17"],
    flavio: ["#d5def4", "#9db3e6", "#5577c9", "#1d3c91"],
  },
  dark: {
    lula: ["#4a2620", "#7a3627", "#c24e36", "#ff8a70"],
    flavio: ["#1d2846", "#2c4382", "#4a6dd2", "#8fb0ff"],
  },
};

/** Cor de área sem votos válidos. */
export const NEUTRAL_FILL: Record<ThemeName, string> = { light: "#dcd9d1", dark: "#2a2e37" };

/** Índice da faixa (0–3) para o percentual do mais votado (50–100). */
export function binIndex(leaderPct: number): 0 | 1 | 2 | 3 {
  if (leaderPct >= BIN_EDGES[3]) return 3;
  if (leaderPct >= BIN_EDGES[2]) return 2;
  if (leaderPct >= BIN_EDGES[1]) return 1;
  return 0;
}

/** Cor para o percentual de Lula (0–100) entre os votos válidos. Empate fica com a faixa mais fraca de Lula. */
export function colorForPctLula(pctLula: number, theme: ThemeName): string {
  const leader: Leader = pctLula >= 50 ? "lula" : "flavio";
  return BINS[theme][leader][binIndex(Math.max(pctLula, 100 - pctLula))];
}

/** Faixas da legenda: de Lula forte (esquerda) a Flávio forte (direita). */
export function legendBins(theme: ThemeName): { leader: Leader; label: string; color: string }[] {
  const lula = [3, 2, 1, 0].map((i) => ({ leader: "lula" as const, label: BIN_LABELS[i], color: BINS[theme].lula[i] }));
  const flavio = [0, 1, 2, 3].map((i) => ({ leader: "flavio" as const, label: BIN_LABELS[i], color: BINS[theme].flavio[i] }));
  return [...lula, ...flavio];
}

/** Mesma faixa de `colorForPctLula`, como variável CSS (`var(--l3)`), para desenhos que seguem o tema sem JavaScript. */
export function cssVarForPctLula(pctLula: number): string {
  const leader = pctLula >= 50 ? "l" : "f";
  return `var(--${leader}${binIndex(Math.max(pctLula, 100 - pctLula)) + 1})`;
}
