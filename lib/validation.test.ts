import { describe, expect, it } from "vitest";
import { loadNational, loadStates } from "@/lib/data";
import { EXPECTED, UFS } from "@/lib/meta";
import { validateAll } from "@/lib/validation";
import type { MunicipalitiesFile, MunicipalityTuple, NationalFile, State, StatesFile, Tally } from "@/types";
import { readFileSync } from "node:fs";
import path from "node:path";

const meta = { source: "teste", url: "https://exemplo.test", reference: "01/01/2026 10:00:00", generatedAt: "2026-01-01" };

const zero = (): Tally => ({
  lula: 0, flavio: 0, blank: 0, nullVotes: 0, eligible: 0, turnout: 0, abstentions: 0, notInstalled: 0, sections: 0, countedSections: 0,
});

/** Completa as colunas derivadas: comparecimento e aptos fecham a identidade de contagem. */
const close = (t: Partial<Tally>): Tally => {
  const base = { ...zero(), ...t };
  const turnout = base.lula + base.flavio + base.blank + base.nullVotes;
  return { ...base, turnout, abstentions: 10, notInstalled: 5, eligible: turnout + 15 };
};

/** Dados mínimos que batem com os totais de referência: o país inteiro dentro de SP. */
const fixture = () => {
  const abroad = close({ ...EXPECTED.abroad, sections: 100, countedSections: 100 });
  const rest = {
    lula: EXPECTED.turno2.lula - EXPECTED.abroad.lula,
    flavio: EXPECTED.turno2.flavio - EXPECTED.abroad.flavio,
    sections: EXPECTED.turno2.sections - 100,
  };
  const states: State[] = UFS.map((u) => ({
    ...(u.uf === "SP" ? close({ ...rest, countedSections: rest.sections }) : close({ sections: 0 })),
    uf: u.uf, name: u.name, region: u.region, ibgeCode: u.code,
  }));
  const national = (() => {
    const all = [...states, abroad];
    const sum = zero();
    for (const t of all) for (const k of Object.keys(sum) as (keyof Tally)[]) sum[k] += t[k];
    return sum;
  })();
  const round1 = { lula: EXPECTED.round1.lula, flavio: EXPECTED.round1.flavio, others: 0, blank: 0, nullVotes: 0, eligible: 0, turnout: 0 };
  const nationalFile: NationalFile = {
    candidates: [], meta, national, abroad, notes: [],
    round1: { meta, national: round1, abroad: round1, states: {} },
  };
  const rows: MunicipalityTuple[] = states.map((s) => [
    s.ibgeCode + "00001", "Município", s.uf, s.lula, s.flavio, s.blank, s.nullVotes, s.eligible, s.turnout, s.abstentions, s.sections, s.countedSections, s.notInstalled,
  ]);
  return { nationalFile, statesFile: { meta, states } as StatesFile, munisFile: { meta, rows } as MunicipalitiesFile };
};

const errorsOf = (f: ReturnType<typeof fixture>) =>
  validateAll(f.nationalFile, f.statesFile, f.munisFile).filter((c) => c.level === "error");

describe("validateAll", () => {
  it("não acusa erro quando os dados batem com os totais de referência", () => {
    expect(errorsOf(fixture())).toEqual([]);
  });

  it("devolve também as linhas informativas", () => {
    const f = fixture();
    const levels = validateAll(f.nationalFile, f.statesFile, f.munisFile).map((c) => c.level);
    expect(levels).toContain("ok");
    expect(levels).toContain("info");
  });

  it("acusa quando os votos de Lula não batem", () => {
    const f = fixture();
    f.nationalFile.national.lula += 1;
    expect(errorsOf(f).some((e) => e.text.includes("Lula"))).toBe(true);
  });

  it("acusa quando estados + exterior não somam o nacional", () => {
    const f = fixture();
    f.statesFile.states[0].flavio += 7;
    expect(errorsOf(f).some((e) => e.text.includes("Soma estados + exterior"))).toBe(true);
  });

  it("acusa quando a soma dos municípios diverge da UF", () => {
    const f = fixture();
    f.munisFile.rows[0][3] += 1;
    expect(errorsOf(f).some((e) => e.text.startsWith("AC:"))).toBe(true);
  });

  it("acusa quando a identidade de contagem falha", () => {
    const f = fixture();
    f.nationalFile.abroad.blank += 1;
    expect(errorsOf(f).some((e) => e.text.includes("Identidade"))).toBe(true);
  });

  it("acusa número de UFs diferente de 27", () => {
    const f = fixture();
    f.statesFile.states.pop();
    expect(errorsOf(f).some((e) => e.text.includes("UFs"))).toBe(true);
  });
});

describe("dados publicados", () => {
  it("public/data bate com os totais de referência (o mesmo que roda no build)", () => {
    const readJson = <T>(file: string) =>
      JSON.parse(readFileSync(path.join(process.cwd(), "public", "data", file), "utf8")) as T;
    const errors = validateAll(
      loadNational(),
      loadStates(),
      readJson<MunicipalitiesFile>("municipios.json"),
    ).filter((c) => c.level === "error");
    expect(errors).toEqual([]);
  });
});
