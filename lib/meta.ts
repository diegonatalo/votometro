import type { Region } from "@/types";

export const UFS: { uf: string; name: string; region: Region; code: string }[] = [
  { uf: "AC", name: "Acre", region: "N", code: "12" },
  { uf: "AL", name: "Alagoas", region: "NE", code: "27" },
  { uf: "AP", name: "Amapá", region: "N", code: "16" },
  { uf: "AM", name: "Amazonas", region: "N", code: "13" },
  { uf: "BA", name: "Bahia", region: "NE", code: "29" },
  { uf: "CE", name: "Ceará", region: "NE", code: "23" },
  { uf: "DF", name: "Distrito Federal", region: "CO", code: "53" },
  { uf: "ES", name: "Espírito Santo", region: "SE", code: "32" },
  { uf: "GO", name: "Goiás", region: "CO", code: "52" },
  { uf: "MA", name: "Maranhão", region: "NE", code: "21" },
  { uf: "MT", name: "Mato Grosso", region: "CO", code: "51" },
  { uf: "MS", name: "Mato Grosso do Sul", region: "CO", code: "50" },
  { uf: "MG", name: "Minas Gerais", region: "SE", code: "31" },
  { uf: "PA", name: "Pará", region: "N", code: "15" },
  { uf: "PB", name: "Paraíba", region: "NE", code: "25" },
  { uf: "PR", name: "Paraná", region: "S", code: "41" },
  { uf: "PE", name: "Pernambuco", region: "NE", code: "26" },
  { uf: "PI", name: "Piauí", region: "NE", code: "22" },
  { uf: "RJ", name: "Rio de Janeiro", region: "SE", code: "33" },
  { uf: "RN", name: "Rio Grande do Norte", region: "NE", code: "24" },
  { uf: "RS", name: "Rio Grande do Sul", region: "S", code: "43" },
  { uf: "RO", name: "Rondônia", region: "N", code: "11" },
  { uf: "RR", name: "Roraima", region: "N", code: "14" },
  { uf: "SC", name: "Santa Catarina", region: "S", code: "42" },
  { uf: "SP", name: "São Paulo", region: "SE", code: "35" },
  { uf: "SE", name: "Sergipe", region: "NE", code: "28" },
  { uf: "TO", name: "Tocantins", region: "N", code: "17" },
];

export const REGIONS: { id: Region; name: string }[] = [
  { id: "N", name: "Norte" },
  { id: "NE", name: "Nordeste" },
  { id: "CO", name: "Centro-Oeste" },
  { id: "SE", name: "Sudeste" },
  { id: "S", name: "Sul" },
];

export const CANDIDATES = {
  lula: { id: "lula", name: "Lula", fullName: "Luiz Inácio Lula da Silva", party: "PT", number: "13" },
  flavio: { id: "flavio", name: "Flávio Bolsonaro", fullName: "Flávio Nantes Bolsonaro", party: "PL", number: "22" },
} as const;

/** Totais nacionais de referência (imprensa, a partir do TSE) usados na validação do build. */
export const EXPECTED = {
  turno2: { lula: 64_256_232, flavio: 59_826_041, difference: 4_430_191, sections: 499_248 },
  abroad: { lula: 200_154, flavio: 171_497 },
  round1: { lula: 53_879_538, flavio: 56_104_503 },
} as const;
