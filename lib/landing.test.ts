import { describe, expect, it } from "vitest";
import { FAQ, HERO, HIGHLIGHTS, WHY } from "@/lib/landing";

describe("landing", () => {
  it("tem os textos principais preenchidos", () => {
    expect(HERO.title.length).toBeGreaterThan(0);
    expect(HERO.subtitle.length).toBeGreaterThan(0);
    expect(WHY.text.length).toBeGreaterThan(0);
  });

  it("tem de 3 a 4 destaques e de 3 a 5 perguntas, sem títulos repetidos", () => {
    expect(HIGHLIGHTS.length).toBeGreaterThanOrEqual(3);
    expect(HIGHLIGHTS.length).toBeLessThanOrEqual(4);
    expect(FAQ.length).toBeGreaterThanOrEqual(3);
    expect(FAQ.length).toBeLessThanOrEqual(5);
    for (const titles of [HIGHLIGHTS.map((h) => h.title), FAQ.map((f) => f.question)]) {
      expect(new Set(titles).size).toBe(titles.length);
    }
  });
});
