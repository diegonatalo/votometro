import type { OvertimeGroup } from "@/types";

export type OvertimeCandidate = {
  id: "lula" | "flavio";
  /** Votos do candidato nas seções que fecharam depois do horário. */
  votes: number;
  /** Fatia dos votos válidos dessas seções. */
  validShare: number;
  /** Quanto esses votos representam de todos os votos do candidato (mesmo recorte, sem o exterior). */
  ofCandidateTotal: number;
};

export type OvertimeSummary = {
  /** Todos os votos registrados nessas seções (comparecimento: válidos, brancos e nulos). */
  votes: number;
  /** Fatia de todos os votos do recorte. */
  ofAllVotes: number;
  sections: number;
  ofAllSections: number;
  blankNull: number;
  candidates: OvertimeCandidate[];
};

const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);

/**
 * Resumo das seções que fecharam depois do horário (`after`) contra o total do recorte
 * (`after` + `upTo`, os boletins dos estados, sem o exterior). Candidatos do mais votado ao menos votado.
 */
export function overtimeSummary(after: OvertimeGroup, upTo: OvertimeGroup): OvertimeSummary {
  const valid = after.lula + after.flavio;
  const candidates = (["lula", "flavio"] as const)
    .map((id) => ({
      id,
      votes: after[id],
      validShare: pct(after[id], valid),
      ofCandidateTotal: pct(after[id], after[id] + upTo[id]),
    }))
    .sort((a, b) => b.votes - a.votes);
  return {
    votes: after.turnout,
    ofAllVotes: pct(after.turnout, after.turnout + upTo.turnout),
    sections: after.sections,
    ofAllSections: pct(after.sections, after.sections + upTo.sections),
    blankNull: after.blank + after.nullVotes,
    candidates,
  };
}
