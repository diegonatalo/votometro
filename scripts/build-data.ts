import { mkdir, stat, writeFile } from "node:fs/promises";
import { UFS } from "@/lib/meta";
import type { Candidate, State, Tally, MunicipalityTuple, MunicipalitiesFile, NationalFile, Note, SourceMeta, StatesFile, Round1Row } from "@/types";
import { ELE_T1, ELE_T2, getJson, parseUnit, pool, toRound1, unitPath } from "./lib/tse";
import { buildGeo } from "./build-geo";
import { buildOvertime } from "./build-overtime";
import { runValidation } from "./validate";

interface MunConfig {
  abr: { cd: string; mu?: { cd: string; cdi: string; nm: string }[] }[];
}

const OUT = "public/data";

interface RawCand { n: string; sqcand: string; nm: string; nmu: string; st: string; vs?: { sqcand: string; nm: string; nmu: string; sgp: string }[] }
interface RawNat { carg: { agr: { nm: string; com?: string; par: { sg: string; nm: string; cand?: RawCand[] }[] }[] }[] }

const PHOTO_BASE = "https://resultados.tse.jus.br/oficial/ele2026/6258/fotos/br";

async function downloadPhoto(sq: string): Promise<string> {
  const rel = `img/candidatos/${sq}.jpeg`;
  const dest = `public/${rel}`;
  try { if ((await stat(dest)).size > 0) return `/${rel}`; } catch { /* baixar */ }
  await mkdir("public/img/candidatos", { recursive: true });
  const res = await fetch(`${PHOTO_BASE}/${sq}.jpeg`);
  if (!res.ok) throw new Error(`Foto ${sq}: HTTP ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return `/${rel}`;
}

const properName = (s: string) => titleCase(s);

async function buildCandidates(): Promise<Candidate[]> {
  const raw = (await getJson(unitPath(ELE_T2, "br"))) as RawNat;
  const out: Candidate[] = [];
  for (const agr of raw.carg[0]?.agr ?? []) {
    for (const par of agr.par) {
      for (const c of par.cand ?? []) {
        const id = c.n === "13" ? "lula" : c.n === "22" ? "flavio" : null;
        if (!id) continue;
        const v = c.vs?.[0];
        if (!v) throw new Error(`Vice não encontrado para ${c.nmu}`);
        out.push({
          id, sq: c.sqcand, number: c.n, name: properName(c.nm), ballotName: properName(c.nmu), party: par.sg, partyName: properName(par.nm),
          coalition: agr.com ?? par.sg, electionStatus: c.st, photo: await downloadPhoto(c.sqcand),
          vice: { sq: v.sqcand, name: properName(v.nm), ballotName: properName(v.nmu), party: v.sgp, photo: await downloadPhoto(v.sqcand) },
        });
      }
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

function brasiliaNow(): string {
  return new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

async function main() {
  await mkdir(`${OUT}/geo`, { recursive: true });
  const generatedAt = brasiliaNow();
  const url2 = `https://resultados.tse.jus.br/oficial/ele2026/${ELE_T2}/dados/br/br-c0001-e00${ELE_T2}-u.json`;
  const url1 = `https://resultados.tse.jus.br/oficial/ele2026/${ELE_T1}/dados/br/br-c0001-e00${ELE_T1}-u.json`;

  console.log("2º turno: nacional, UFs e exterior…");
  const nationalUnit = parseUnit(await getJson(unitPath(ELE_T2, "br")));
  const ufCodes = [...UFS.map((u) => u.uf), "ZZ"];
  const ufUnits = await pool(ufCodes, 8, (uf) => getJson(unitPath(ELE_T2, uf)).then((j) => parseUnit(j as never)));
  const abroad = ufUnits[ufUnits.length - 1]!;

  const stateRows: State[] = UFS.map((u, i) => ({ uf: u.uf, name: u.name, region: u.region, ibgeCode: u.code, ...ufUnits[i]!.tally }));

  console.log("2º turno: municípios…");
  const cfg = (await getJson(`${ELE_T2}/config/mun-e00${ELE_T2}-cm.json`)) as MunConfig;
  const jobs: { uf: string; cd: string; ibge: string; name: string }[] = [];
  for (const a of cfg.abr) {
    if (a.cd === "zz") continue;
    for (const m of a.mu ?? []) jobs.push({ uf: a.cd.toUpperCase(), cd: m.cd, ibge: m.cdi, name: m.nm });
  }
  let done = 0;
  const rows = await pool(jobs, 10, async (j): Promise<MunicipalityTuple> => {
    const p = parseUnit((await getJson(unitPath(ELE_T2, j.uf, j.cd))) as never);
    if (++done % 500 === 0) console.log(`  ${done}/${jobs.length}`);
    const t = p.tally;
    return [j.ibge, titleCase(j.name), j.uf, t.lula, t.flavio, t.blank, t.nullVotes, t.eligible, t.turnout, t.abstentions, t.sections, t.countedSections, t.notInstalled];
  });
  rows.sort((a, b) => a[2].localeCompare(b[2]) || a[1].localeCompare(b[1], "pt-BR"));

  console.log("1º turno…");
  const t1National = toRound1(parseUnit((await getJson(unitPath(ELE_T1, "br"))) as never));
  const t1Units = await pool(ufCodes, 8, (uf) => getJson(unitPath(ELE_T1, uf)).then((j) => parseUnit(j as never)));
  const t1States: Record<string, Round1Row> = {};
  UFS.forEach((u, i) => (t1States[u.uf] = toRound1(t1Units[i]!)));
  const t1Abroad = toRound1(t1Units[t1Units.length - 1]!);

  const meta2: SourceMeta = { source: "TSE — Resultados (2º turno)", url: url2, reference: nationalUnit.generation, generatedAt };
  const meta1: SourceMeta = { source: "TSE — Resultados (1º turno)", url: url1, reference: toTurno1Ref(t1Units[0]!.generation), generatedAt };

  const geoIds = await buildGeo();
  const noGeo = rows.filter((r) => !geoIds.has(r[0])).map((r) => `${r[1]} (${r[2]})`);
  const notes = buildNotes(nationalUnit.tally, abroad.tally, nationalUnit.counting, rows.length, geoIds.size, noGeo);
  const national: NationalFile = {
    candidates: await buildCandidates(),
    meta: meta2, national: nationalUnit.tally, abroad: abroad.tally,
    round1: { meta: meta1, national: t1National, abroad: t1Abroad, states: t1States }, notes,
  };
  const states: StatesFile = { meta: meta2, states: stateRows };
  const munis: MunicipalitiesFile = { meta: meta2, rows };

  await writeFile(`${OUT}/national.json`, JSON.stringify(national));
  await writeFile(`${OUT}/states.json`, JSON.stringify(states));
  await writeFile(`${OUT}/municipios.json`, JSON.stringify(munis));
  for (const u of UFS) await writeFile(`${OUT}/municipios-${u.uf}.json`, JSON.stringify({ meta: meta2, rows: rows.filter((r) => r[2] === u.uf) } satisfies MunicipalitiesFile));
  console.log(`Escritos: national.json, states.json, municipios.json (${rows.length} municípios)`);

  await buildOvertime(generatedAt);

  console.log("\nValidação dos totais:");
  const ok = await runValidation();
  if (!ok) process.exit(1);
}

const toTurno1Ref = (s: string) => s;

function titleCase(s: string): string {
  const small = new Set(["DE", "DA", "DO", "DAS", "DOS", "E"]);
  return s
    .toLocaleLowerCase("pt-BR")
    .split(" ")
    .map((w, i) => (i > 0 && small.has(w.toUpperCase()) ? w : w.replace(/(^|['\-])(\p{L})/gu, (_m, a: string, b: string) => a + b.toLocaleUpperCase("pt-BR"))))
    .join(" ");
}

function buildNotes(t: Tally, ext: Tally, counting: string, nMunis: number, nGeo: number, noGeo: string[]): Note[] {
  const pct = ((t.abstentions / t.eligible) * 100).toFixed(2).replace(".", ",");
  const f = (n: number) => n.toLocaleString("pt-BR");
  const notes: Note[] = [
    {
      id: "abstencao",
      title: `Abstenção: ${pct}% no arquivo do TSE`,
      text: `O arquivo oficial do TSE registra ${f(t.abstentions)} abstenções entre ${f(t.eligible)} eleitores aptos (${pct}%). Veículos de imprensa citam valores arredondados entre 19% e 19,2%. Este site exibe o valor calculado a partir do arquivo do TSE.`,
    },
    {
      id: "nao-instaladas",
      title: "Eleitores em seções não instaladas",
      text: `${f(t.notInstalled)} eleitores aptos (${f(ext.notInstalled)} no exterior) estavam em seções não instaladas. Eles contam como aptos, mas não entram em comparecimento nem em abstenção; por isso aptos = comparecimento + abstenção + ${f(t.notInstalled)}.`,
    },
    {
      id: "nulos",
      title: "Votos nulos",
      text: "Votos nulos incluem os nulos técnicos. Brancos e nulos não entram no cálculo de percentual dos votos válidos.",
    },
    {
      id: "referencia",
      title: "Data/hora de referência",
      text: `Os números vêm do arquivo de totalização do TSE com última totalização em ${counting}. Cada seção do site indica a fonte e a referência.`,
    },
    {
      id: "exterior",
      title: "Exterior",
      text: "O voto no exterior é contado como território próprio, já somado ao total nacional, e não aparece no mapa.",
    },
  ];
  if (nMunis !== nGeo) {
    notes.push({
      id: "geometria",
      title: `Municípios: ${f(nMunis)} com resultado, ${f(nGeo)} no mapa`,
      text: `A malha do IBGE usada no mapa não traz geometria para: ${noGeo.join(", ")}. Esses municípios têm resultado no TSE, estão nos totais do estado e aparecem na busca e na lista, mas não são desenhados no mapa.`,
    });
  }
  return notes;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
