import { describe, expect, it } from "vitest";
import { binIndex, colorForPctLula, cssVarForPctLula, legendBins, NEUTRAL_FILL, type ThemeName } from "@/lib/colors";

const themes: ThemeName[] = ["light", "dark"];

describe("binIndex", () => {
  it("separa as faixas em 55, 60 e 70%", () => {
    expect(binIndex(50)).toBe(0);
    expect(binIndex(54.99)).toBe(0);
    expect(binIndex(55)).toBe(1);
    expect(binIndex(60)).toBe(2);
    expect(binIndex(69.9)).toBe(2);
    expect(binIndex(70)).toBe(3);
    expect(binIndex(100)).toBe(3);
  });
});

describe("colorForPctLula", () => {
  it.each(themes)("a mesma margem dá a mesma faixa para os dois lados, em cores diferentes (tema %s)", (theme) => {
    const lula = colorForPctLula(65, theme);
    const flavio = colorForPctLula(35, theme);
    expect(lula).not.toBe(flavio);
    expect(legendBins(theme).find((b) => b.color === lula)?.label).toBe("60–70%");
    expect(legendBins(theme).find((b) => b.color === flavio)?.label).toBe("60–70%");
  });

  it.each(themes)("a cor fica igual dentro de uma faixa (tema %s)", (theme) => {
    expect(colorForPctLula(72, theme)).toBe(colorForPctLula(99, theme));
    expect(colorForPctLula(28, theme)).toBe(colorForPctLula(1, theme));
  });

  it("Lula é vermelho e Flávio é azul no tema claro", () => {
    const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const [lr, , lb] = rgb(colorForPctLula(80, "light"));
    const [fr, , fb] = rgb(colorForPctLula(20, "light"));
    expect(lr).toBeGreaterThan(lb);
    expect(fb).toBeGreaterThan(fr);
  });

  it.each(themes)("nenhuma faixa usa a cor neutra (tema %s)", (theme) => {
    expect(legendBins(theme).map((b) => b.color)).not.toContain(NEUTRAL_FILL[theme]);
  });
});

describe("legendBins", () => {
  it("vai de Lula forte a Flávio forte, com 4 faixas de cada lado", () => {
    const bins = legendBins("light");
    expect(bins).toHaveLength(8);
    expect(bins[0]).toMatchObject({ leader: "lula", label: "70% ou mais" });
    expect(bins[3]).toMatchObject({ leader: "lula", label: "50–55%" });
    expect(bins[4]).toMatchObject({ leader: "flavio", label: "50–55%" });
    expect(bins[7]).toMatchObject({ leader: "flavio", label: "70% ou mais" });
  });
});

describe("cssVarForPctLula", () => {
  it("aponta para a variável da faixa e do candidato à frente", () => {
    expect(cssVarForPctLula(52)).toBe("var(--l1)");
    expect(cssVarForPctLula(75.9)).toBe("var(--l4)");
    expect(cssVarForPctLula(46.15)).toBe("var(--f1)");
    expect(cssVarForPctLula(30.4)).toBe("var(--f3)");
  });
});
