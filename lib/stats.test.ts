import { describe, expect, it } from "vitest";
import {
  abstentionPct,
  marginPp,
  sumUp,
  turnoutPct,
  valid,
  validPct,
  voteMargin,
  winner,
} from "@/lib/stats";
import type { Tally } from "@/types";

const tally = (patch: Partial<Tally> = {}): Tally => ({
  lula: 0,
  flavio: 0,
  blank: 0,
  nullVotes: 0,
  eligible: 0,
  turnout: 0,
  abstentions: 0,
  notInstalled: 0,
  sections: 0,
  countedSections: 0,
  ...patch,
});

describe("votos válidos", () => {
  it("valid soma os dois candidatos", () => {
    expect(valid({ lula: 60, flavio: 40 })).toBe(100);
  });

  it("validPct divide em percentuais que somam 100", () => {
    const pct = validPct({ lula: 60, flavio: 40 });
    expect(pct).toEqual({ lula: 60, flavio: 40 });
    expect(validPct({ lula: 1, flavio: 2 }).lula + validPct({ lula: 1, flavio: 2 }).flavio).toBeCloseTo(100);
  });

  it("validPct devolve zeros sem votos válidos", () => {
    expect(validPct({ lula: 0, flavio: 0 })).toEqual({ lula: 0, flavio: 0 });
  });
});

describe("margem", () => {
  it("voteMargin é positiva quando Lula está na frente", () => {
    expect(voteMargin({ lula: 70, flavio: 50 })).toBe(20);
    expect(voteMargin({ lula: 50, flavio: 70 })).toBe(-20);
  });

  it("marginPp é a diferença de percentuais", () => {
    expect(marginPp({ lula: 60, flavio: 40 })).toBe(20);
    expect(marginPp({ lula: 50, flavio: 50 })).toBe(0);
  });
});

describe("winner", () => {
  it("identifica o vencedor e o empate", () => {
    expect(winner({ lula: 2, flavio: 1 })).toBe("lula");
    expect(winner({ lula: 1, flavio: 2 })).toBe("flavio");
    expect(winner({ lula: 5, flavio: 5 })).toBe("tie");
    expect(winner({ lula: 0, flavio: 0 })).toBe("tie");
  });
});

describe("comparecimento e abstenção", () => {
  it("calcula percentuais sobre os eleitores aptos", () => {
    const t = tally({ eligible: 200, turnout: 150, abstentions: 50 });
    expect(turnoutPct(t)).toBe(75);
    expect(abstentionPct(t)).toBe(25);
  });

  it("devolve zero sem eleitores aptos", () => {
    expect(turnoutPct(tally())).toBe(0);
    expect(abstentionPct(tally())).toBe(0);
  });
});

describe("sumUp", () => {
  it("soma todos os campos", () => {
    const sum = sumUp([
      tally({ lula: 1, flavio: 2, blank: 3, nullVotes: 4, eligible: 5, turnout: 6, abstentions: 7, notInstalled: 8, sections: 9, countedSections: 10 }),
      tally({ lula: 10, flavio: 20, blank: 30, nullVotes: 40, eligible: 50, turnout: 60, abstentions: 70, notInstalled: 80, sections: 90, countedSections: 100 }),
    ]);
    expect(sum).toEqual({
      lula: 11,
      flavio: 22,
      blank: 33,
      nullVotes: 44,
      eligible: 55,
      turnout: 66,
      abstentions: 77,
      notInstalled: 88,
      sections: 99,
      countedSections: 110,
    });
  });

  it("uma lista vazia dá tudo zero", () => {
    expect(sumUp([])).toEqual(tally());
  });
});
