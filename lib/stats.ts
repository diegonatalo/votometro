import type { Tally } from "@/types";

type Pair = Pick<Tally, "lula" | "flavio">;

export const valid = (t: Pair): number => t.lula + t.flavio;

export function validPct(t: Pair): { lula: number; flavio: number } {
  const v = valid(t);
  if (v === 0) return { lula: 0, flavio: 0 };
  return { lula: (t.lula / v) * 100, flavio: (t.flavio / v) * 100 };
}

/** Margem em votos (positivo = Lula na frente). */
export const voteMargin = (t: Pair): number => t.lula - t.flavio;

export function marginPp(t: Pair): number {
  const p = validPct(t);
  return p.lula - p.flavio;
}

export type Winner = "lula" | "flavio" | "tie";
export function winner(t: Pair): Winner {
  return t.lula === t.flavio ? "tie" : t.lula > t.flavio ? "lula" : "flavio";
}

export const turnoutPct = (t: Tally): number => (t.eligible ? (t.turnout / t.eligible) * 100 : 0);
export const abstentionPct = (t: Tally): number => (t.eligible ? (t.abstentions / t.eligible) * 100 : 0);

export function sumUp(list: Tally[]): Tally {
  const z: Tally = { lula: 0, flavio: 0, blank: 0, nullVotes: 0, eligible: 0, turnout: 0, abstentions: 0, notInstalled: 0, sections: 0, countedSections: 0 };
  for (const t of list) {
    z.lula += t.lula; z.flavio += t.flavio; z.blank += t.blank; z.nullVotes += t.nullVotes;
    z.eligible += t.eligible; z.turnout += t.turnout; z.abstentions += t.abstentions; z.notInstalled += t.notInstalled;
    z.sections += t.sections; z.countedSections += t.countedSections;
  }
  return z;
}
