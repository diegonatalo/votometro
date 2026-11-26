import { describe, expect, it } from "vitest";
import { overtimeSummary } from "@/lib/overtime";
import type { OvertimeGroup } from "@/types";

const group = (g: Partial<OvertimeGroup>): OvertimeGroup => ({ sections: 0, lula: 0, flavio: 0, blank: 0, nullVotes: 0, turnout: 0, ...g });

describe("overtimeSummary", () => {
  const after = group({ sections: 10, lula: 60, flavio: 30, blank: 4, nullVotes: 6, turnout: 100 });
  const upTo = group({ sections: 90, lula: 540, flavio: 270, blank: 40, nullVotes: 50, turnout: 900 });
  const s = overtimeSummary(after, upTo);

  it("conta todos os votos das seções e o peso deles no total", () => {
    expect(s.votes).toBe(100);
    expect(s.ofAllVotes).toBe(10);
    expect(s.sections).toBe(10);
    expect(s.ofAllSections).toBe(10);
    expect(s.blankNull).toBe(10);
  });

  it("dá a fatia dos válidos e o peso no total de cada candidato, do mais votado ao menos votado", () => {
    expect(s.candidates.map((c) => c.id)).toEqual(["lula", "flavio"]);
    expect(s.candidates[0]).toMatchObject({ votes: 60, ofCandidateTotal: 10 });
    expect(s.candidates[0]!.validShare).toBeCloseTo(66.667, 2);
    expect(s.candidates[1]).toMatchObject({ votes: 30, ofCandidateTotal: 10 });
    expect(s.candidates[1]!.validShare).toBeCloseTo(33.333, 2);
  });

  it("põe na frente quem teve mais votos nessas seções", () => {
    const flip = overtimeSummary(group({ lula: 10, flavio: 20, turnout: 30 }), group({ lula: 100, flavio: 100, turnout: 200 }));
    expect(flip.candidates.map((c) => c.id)).toEqual(["flavio", "lula"]);
  });

  it("não divide por zero sem seções", () => {
    const empty = overtimeSummary(group({}), group({}));
    expect(empty.ofAllVotes).toBe(0);
    expect(empty.candidates.every((c) => c.validShare === 0 && c.ofCandidateTotal === 0)).toBe(true);
  });
});
