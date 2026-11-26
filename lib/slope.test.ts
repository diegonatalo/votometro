import { describe, expect, it } from "vitest";
import { slopeScale } from "@/lib/slope";

describe("slopeScale", () => {
  it("põe o maior valor em cima e o menor embaixo, dentro da área", () => {
    const y = slopeScale([10, 20], 0, 100, 0);
    expect(y(20)).toBe(0);
    expect(y(10)).toBe(100);
    expect(y(15)).toBe(50);
  });

  it("deixa folga acima e abaixo", () => {
    const y = slopeScale([10, 20], 0, 100, 0.25);
    expect(y(20)).toBeGreaterThan(0);
    expect(y(10)).toBeLessThan(100);
  });

  it("não divide por zero quando todos os valores são iguais", () => {
    const y = slopeScale([5, 5], 0, 100);
    expect(Number.isFinite(y(5))).toBe(true);
    expect(y(5)).toBe(50);
  });
});
