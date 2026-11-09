export type Region = "N" | "NE" | "CO" | "SE" | "S";
export type CandidateId = "lula" | "flavio";

export type Tally = {
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
};

export type SourceMeta = {
  source: string;
  url: string;
  /** Data/hora de referência do arquivo TSE (dd/mm/aaaa hh:mm:ss, Brasília). */
  reference: string;
  generatedAt: string;
};

export type State = Tally & {
  uf: string;
  name: string;
  region: Region;
  ibgeCode: string;
};

export type Municipality = Tally & {
  ibge: string;
  name: string;
  uf: string;
};

/** Resultado de um território (Brasil, UF, município ou exterior). */
export type Result = Tally & { id: string; name: string };

export type Round1Row = {
  lula: number;
  flavio: number;
  others: number;
  blank: number;
  nullVotes: number;
  eligible: number;
  turnout: number;
};

export type Note = {
  id: string;
  title: string;
  text: string;
};

export type Person = {
  sq: string;
  name: string;
  ballotName: string;
  party: string;
  /** Caminho da foto (arquivo do TSE) dentro de public/. */
  photo: string;
};

export type Candidate = Person & {
  id: "lula" | "flavio";
  number: string;
  partyName: string;
  /** Coligação ou federação como registrada no TSE. */
  coalition: string;
  /** Situação no TSE (ex.: Eleito, Não eleito). */
  electionStatus: string;
  vice: Person;
};

export type NationalFile = {
  candidates: Candidate[];
  meta: SourceMeta;
  national: Tally;
  abroad: Tally;
  round1: { meta: SourceMeta; national: Round1Row; abroad: Round1Row; states: Record<string, Round1Row> };
  notes: Note[];
};

export type StatesFile = {
  meta: SourceMeta;
  states: State[];
};

export type MunicipalityTuple = [
  ibge: string, name: string, uf: string,
  lula: number, flavio: number, blank: number, nullVotes: number,
  eligible: number, turnout: number, abstentions: number,
  sections: number, countedSections: number, notInstalled: number,
];

export type MunicipalitiesFile = {
  meta: SourceMeta;
  rows: MunicipalityTuple[];
};

export type OvertimeGroup = {
  sections: number;
  lula: number;
  flavio: number;
  blank: number;
  nullVotes: number;
  turnout: number;
};

export type OvertimeFile = {
  status: "available" | "unavailable";
  meta: SourceMeta;
  reason?: string;
  brasiliaCutoff: string;
  round?: number;
  total?: { after: OvertimeGroup; upTo: OvertimeGroup; noTime: number };
  thresholds?: { minutes: number; sections: number }[];
  byState?: Record<string, { after: OvertimeGroup; upTo: OvertimeGroup }>;
  /** ibge → [sectionsAfter, lula, flavio, turnout] */
  byMunicipality?: Record<string, [number, number, number, number]>;
};

export function tallyFromTuple(t: MunicipalityTuple): Municipality {
  return {
    ibge: t[0], name: t[1], uf: t[2], lula: t[3], flavio: t[4], blank: t[5], nullVotes: t[6],
    eligible: t[7], turnout: t[8], abstentions: t[9], sections: t[10], countedSections: t[11], notInstalled: t[12],
  };
}
