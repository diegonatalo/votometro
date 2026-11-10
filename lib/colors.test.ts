import { describe, expect, it } from "vitest";
import { NEUTRAL_FILL, SATURA_PP, colorForPctLula, legendStops, type ThemeName } from "@/lib/colors";

const themes: ThemeName[] = ["light", "dark"];

/** d3 devolve "rgb(r, g, b)"; a cor neutra está declarada em hexadecimal. */
const toHex = (color: string) => {
  if (color.startsWith("#")) return color.toLowerCase();
  const [r, g, b] = color.match(/\d+/g)!.map(Number);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

describe("colorForPctLula", () => {
  it.each(themes)("50%% é a cor neutra no tema %s", (theme) => {
    expect(toHex(colorForPctLula(50, theme))).toBe(NEUTRAL_FILL[theme]);
  });

  it.each(themes)("a escala satura a partir de SATURA_PP pontos (tema %s)", (theme) => {
    expect(colorForPctLula(50 + SATURA_PP, theme)).toBe(colorForPctLula(100, theme));
    expect(colorForPctLula(50 - SATURA_PP, theme)).toBe(colorForPctLula(0, theme));
  });

  it.each(themes)("Lula e Flávio têm cores diferentes (tema %s)", (theme) => {
    expect(colorForPctLula(70, theme)).not.toBe(colorForPctLula(30, theme));
  });

  it("Lula é vermelho e Flávio é azul no tema claro", () => {
    const channels = (hex: string) => hex.match(/\d+/g)!.map(Number);
    const [lr, , lb] = channels(colorForPctLula(80, "light"));
    const [fr, , fb] = channels(colorForPctLula(20, "light"));
    expect(lr).toBeGreaterThan(lb);
    expect(fb).toBeGreaterThan(fr);
  });
});

describe("legendStops", () => {
  it("gera n amostras com offsets de 0 a 1", () => {
    const stops = legendStops("light", 5);
    expect(stops.map((s) => s.offset)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it("começa no lado do Flávio, termina no de Lula e o meio é neutro", () => {
    const stops = legendStops("dark", 33);
    expect(stops).toHaveLength(33);
    expect(stops[0].color).toBe(colorForPctLula(50 - SATURA_PP, "dark"));
    expect(stops[32].color).toBe(colorForPctLula(50 + SATURA_PP, "dark"));
    expect(toHex(stops[16].color)).toBe(NEUTRAL_FILL.dark);
  });
});
