import { describe, expect, it } from "vitest";
import { fmtCompact, fmtInt, fmtPct, fmtPp, normalize } from "@/lib/format";

describe("fmtInt", () => {
  it("usa separador de milhar brasileiro e arredonda", () => {
    expect(fmtInt(64_256_232)).toBe("64.256.232");
    expect(fmtInt(1234.6)).toBe("1.235");
  });
});

describe("fmtPct e fmtPp", () => {
  it("usam vírgula e duas casas por padrão", () => {
    expect(fmtPct(51.7)).toBe("51,70%");
    expect(fmtPp(2.345)).toMatch(/^2,3[45]%$/);
  });

  it("aceitam outro número de casas", () => {
    expect(fmtPct(12.3456, 1)).toBe("12,3%");
    expect(fmtPct(5, 0)).toBe("5%");
  });
});

describe("fmtCompact", () => {
  it.each([
    [999, "999"],
    [1_500, "1,5 mil"],
    [64_256_232, "64,3 mi"],
    [1_000_000, "1 mi"],
  ])("%s vira %s", (value, text) => {
    expect(fmtCompact(value)).toBe(text);
  });
});

describe("normalize", () => {
  it("tira acentos, caixa alta e espaços nas pontas", () => {
    expect(normalize("  São Paulo ")).toBe("sao paulo");
    expect(normalize("MARANHÃO")).toBe("maranhao");
    expect(normalize("Ceará")).toBe("ceara");
  });
});
