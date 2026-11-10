import { describe, expect, it } from "vitest";
import { CANDIDATES, EXPECTED, REGIONS, UFS } from "@/lib/meta";

describe("UFS", () => {
  it("tem as 27 unidades da federação sem repetir sigla nem código", () => {
    expect(UFS).toHaveLength(27);
    expect(new Set(UFS.map((u) => u.uf)).size).toBe(27);
    expect(new Set(UFS.map((u) => u.code)).size).toBe(27);
  });

  it("siglas têm duas letras maiúsculas e códigos IBGE têm dois dígitos", () => {
    for (const u of UFS) {
      expect(u.uf).toMatch(/^[A-Z]{2}$/);
      expect(u.code).toMatch(/^\d{2}$/);
    }
  });

  it("toda UF pertence a uma região listada", () => {
    const regions = new Set(REGIONS.map((r) => r.id));
    for (const u of UFS) expect(regions.has(u.region), u.uf).toBe(true);
  });

  it("a distribuição por região bate com a do IBGE", () => {
    const count = (id: string) => UFS.filter((u) => u.region === id).length;
    expect({ N: count("N"), NE: count("NE"), CO: count("CO"), SE: count("SE"), S: count("S") }).toEqual({
      N: 7,
      NE: 9,
      CO: 4,
      SE: 4,
      S: 3,
    });
  });
});

describe("candidatos e totais esperados", () => {
  it("os números de urna são 13 e 22", () => {
    expect(CANDIDATES.lula.number).toBe("13");
    expect(CANDIDATES.flavio.number).toBe("22");
  });

  it("a diferença esperada do 2º turno bate com os votos", () => {
    expect(EXPECTED.turno2.lula - EXPECTED.turno2.flavio).toBe(EXPECTED.turno2.difference);
  });
});
