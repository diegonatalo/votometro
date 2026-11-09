import { EXPECTED } from "./meta";
import { sumUp, winner } from "./stats";
import type { MunicipalitiesFile, NationalFile, StatesFile, Tally } from "@/types";

export interface Check {
  nivel: "ok" | "erro" | "info";
  text: string;
}

const eq = (a: number, b: number) => a === b;
const n = (x: number) => x.toLocaleString("pt-BR");

/** Valida os arquivos gerados contra os totais nacionais conferidos. */
export function validateAll(national: NationalFile, states: StatesFile, munis: MunicipalitiesFile): Check[] {
  const out: Check[] = [];
  const check = (cond: boolean, ok: string, err: string) => out.push(cond ? { nivel: "ok", text: ok } : { nivel: "erro", text: err });
  const info = (text: string) => out.push({ nivel: "info", text });

  const nat = national.national;
  const sum = sumUp([...states.states, national.abroad]);

  for (const k of ["lula", "flavio", "blank", "nullVotes", "eligible", "turnout", "abstentions", "notInstalled", "sections"] as const) {
    check(eq(sum[k], nat[k]), `Estados + exterior = nacional (${k}: ${n(nat[k])})`, `Soma estados + exterior (${k}) = ${n(sum[k])} ≠ nacional ${n(nat[k])}`);
  }

  check(eq(nat.lula, EXPECTED.turno2.lula), `Lula = ${n(EXPECTED.turno2.lula)}`, `Lula ${n(nat.lula)} ≠ esperado ${n(EXPECTED.turno2.lula)}`);
  check(eq(nat.flavio, EXPECTED.turno2.flavio), `Flávio = ${n(EXPECTED.turno2.flavio)}`, `Flávio ${n(nat.flavio)} ≠ esperado ${n(EXPECTED.turno2.flavio)}`);
  check(eq(nat.lula - nat.flavio, EXPECTED.turno2.difference), `Diferença = ${n(EXPECTED.turno2.difference)}`, `Diferença ${n(nat.lula - nat.flavio)} ≠ ${n(EXPECTED.turno2.difference)}`);
  check(eq(nat.sections, EXPECTED.turno2.sections) && nat.countedSections === nat.sections, `Seções: ${n(nat.sections)} (100% totalizadas)`, `Seções ${n(nat.countedSections)}/${n(nat.sections)} (esperado ${n(EXPECTED.turno2.sections)} totalizadas)`);
  check(eq(national.abroad.lula, EXPECTED.abroad.lula) && eq(national.abroad.flavio, EXPECTED.abroad.flavio), `Exterior: Lula ${n(EXPECTED.abroad.lula)} / Flávio ${n(EXPECTED.abroad.flavio)}`, `Exterior ${n(national.abroad.lula)}/${n(national.abroad.flavio)} ≠ ${n(EXPECTED.abroad.lula)}/${n(EXPECTED.abroad.flavio)}`);
  check(national.round1.national.lula === EXPECTED.round1.lula && national.round1.national.flavio === EXPECTED.round1.flavio, "1º turno: Lula 53.879.538 / Flávio 56.104.503", `1º turno ${n(national.round1.national.lula)}/${n(national.round1.national.flavio)} diverge do esperado`);

  const ident = (t: Tally) => t.lula + t.flavio + t.blank + t.nullVotes === t.turnout && t.eligible === t.turnout + t.abstentions + t.notInstalled;
  const bad = [...states.states, national.abroad].filter((t) => !ident(t));
  check(ident(nat) && bad.length === 0, "Identidade: válidos + brancos + nulos = comparecimento; aptos = comparecimento + abstenção + eleitores de seções não instaladas", `Identidade de contagem falhou em ${bad.length} territórios`);

  check(states.states.length === 27, "27 UFs", `${states.states.length} UFs (esperado 27)`);

  let ufsBad = 0;
  for (const e of states.states) {
    const ms = munis.rows.filter((r) => r[2] === e.uf);
    const s = ms.reduce((a, r) => ({ l: a.l + r[3], f: a.f + r[4], b: a.b + r[5], nu: a.nu + r[6], ap: a.ap + r[7], c: a.c + r[8] }), { l: 0, f: 0, b: 0, nu: 0, ap: 0, c: 0 });
    if (s.l !== e.lula || s.f !== e.flavio || s.b !== e.blank || s.nu !== e.nullVotes || s.ap !== e.eligible || s.c !== e.turnout) {
      ufsBad++;
      out.push({ nivel: "erro", text: `${e.uf}: soma dos ${ms.length} municípios (Lula ${n(s.l)}, Flávio ${n(s.f)}) ≠ total da UF (Lula ${n(e.lula)}, Flávio ${n(e.flavio)})` });
    }
  }
  if (ufsBad === 0) out.push({ nivel: "ok", text: `Soma dos municípios = total de cada UF (27 UFs, ${n(munis.rows.length)} municípios)` });

  const wins = { lula: 0, flavio: 0, tie: 0 };
  for (const e of states.states) wins[winner(e)]++;
  info(`Estados vencidos: Lula ${wins.lula}, Flávio ${wins.flavio}, empate ${wins.tie}`);
  info(`Aptos ${n(nat.eligible)}; comparecimento ${n(nat.turnout)} (${((nat.turnout / nat.eligible) * 100).toFixed(2).replace(".", ",")}%)`);
  return out;
}
