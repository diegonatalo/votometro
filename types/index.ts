export type Region = "N" | "NE" | "CO" | "SE" | "S";
export type CandidateId = "lula" | "flavio";

export interface Tally {
  lula: number;
  flavio: number;
  blank: number;
  nullVotes: number;
  eligible: number;
  turnout: number;
  abstentions: number;
  /** Eleitores aptos em seções não instaladas (não entram em comparecimento nem em abstenção). */
  notInstalled: number;
  sections: number;
  countedSections: number;
}

export interface SourceMeta {
  source: string;
  url: string;
  /** Data/hora de referência do arquivo TSE (dd/mm/aaaa hh:mm:ss, Brasília). */
  reference: string;
  generatedAt: string;
}

export interface State extends Tally {
  uf: string;
  name: string;
  region: Region;
  ibgeCode: string;
}

export interface Municipality extends Tally {
  ibge: string;
  name: string;
  uf: string;
}

/** Resultado de um território (Brasil, UF, município ou exterior). */
export type Result = Tally & { id: string; name: string };

export interface Round1Row {
  lula: number;
  flavio: number;
  others: number;
  blank: number;
  nullVotes: number;
  eligible: number;
  turnout: number;
}

export interface Note {
  id: string;
  title: string;
  text: string;
}

export interface Person {
  sq: string;
  name: string;
  ballotName: string;
  party: string;
  /** Caminho da foto (arquivo do TSE) dentro de public/. */
  photo: string;
}

export interface Candidate extends Person {
  id: "lula" | "flavio";
  number: string;
  partyName: string;
  /** Coligação ou federação como registrada no TSE. */
  coalition: string;
  /** Situação no TSE (ex.: Eleito, Não eleito). */
  electionStatus: string;
  vice: Person;
}

export interface NationalFile {
  candidates: Candidate[];
  meta: SourceMeta;
  national: Tally;
  abroad: Tally;
  round1: { meta: SourceMeta; national: Round1Row; abroad: Round1Row; states: Record<string, Round1Row> };
  notes: Note[];
}

export interface StatesFile {
  meta: SourceMeta;
  states: State[];
}

export type MunicipalityTuple = [
  ibge: string, nome: string, uf: string,
  lula: number, flavio: number, brancos: number, nulos: number,
  aptos: number, comparecimento: number, abstencoes: number,
  secoes: number, secoesTotalizadas: number, naoInstalados: number,
];

export interface MunicipalitiesFile {
  meta: SourceMeta;
  rows: MunicipalityTuple[];
}

export interface OvertimeGroup {
  sections: number;
  lula: number;
  flavio: number;
  blank: number;
  nullVotes: number;
  turnout: number;
}

export interface OvertimeFile {
  status: "available" | "unavailable";
  meta: SourceMeta;
  reason?: string;
  brasiliaCutoff: string;
  round?: number;
  total?: { after: OvertimeGroup; upTo: OvertimeGroup; noTime: number };
  thresholds?: { minutes: number; sections: number }[];
  byState?: Record<string, { after: OvertimeGroup; upTo: OvertimeGroup }>;
  /** ibge → [secoesApos, lula, flavio, comparecimento] */
  byMunicipality?: Record<string, [number, number, number, number]>;
}

export function tallyFromTuple(t: MunicipalityTuple): Municipality {
  return {
    ibge: t[0], name: t[1], uf: t[2], lula: t[3], flavio: t[4], blank: t[5], nullVotes: t[6],
    eligible: t[7], turnout: t[8], abstentions: t[9], sections: t[10], countedSections: t[11], notInstalled: t[12],
  };
}
