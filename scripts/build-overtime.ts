/**
 * Votos em seções que encerraram após o horário regular (17h de Brasília).
 *
 * Fonte: Boletim de Urna (BU) do TSE, dados abertos. Cada BU traz DT_ABERTURA e DT_ENCERRAMENTO da urna
 * (hora local da urna) e os votos da seção. O arquivo NÃO traz a hora de cada voto: o que se mede é o
 * resultado das seções cujo encerramento ocorreu depois do horário regular, nunca os votos dados depois das 17h.
 *
 * Uso: tsx scripts/build-overtime.ts [--turno 2] [--uf AC] [--out caminho.json]
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { Open } from "unzipper";
import type { OvertimeFile, OvertimeGroup } from "@/types";
import { ELE_T2, getJson } from "./lib/tse";

const CKAN = "https://dadosabertos.tse.jus.br/api/3/action/package_show?id=resultados-2026-boletim-de-urna";
/** Tolerância (min) após as 17h: o encerramento do BU costuma ocorrer minutos depois do horário, sem fila. */
export const CUTOFF_MIN = 15;
const THRESHOLDS = [1, 5, 15, 30, 60];

const emptyGroup = (): OvertimeGroup => ({ sections: 0, lula: 0, flavio: 0, blank: 0, nullVotes: 0, turnout: 0 });

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q;
    } else if (ch === ";" && !q) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out;
}

interface Sec { mun: string; uf: string; abre: number; closes: number; comp: number; lula: number; flavio: number; blank: number; nullVotes: number }

/** "2026-10-04 15:01:05" → minutos do dia (hora local da urna) */
function minutesOfDay(s: string | undefined): number {
  if (!s || s.length < 16) return NaN;
  return Number(s.slice(11, 13)) * 60 + Number(s.slice(14, 16)) + Number(s.slice(17, 19) || 0) / 60;
}

async function readSections(zipPath: string, uf: string): Promise<Sec[]> {
  const dir = await Open.file(zipPath);
  const entry = dir.files.find((f) => f.path.toLowerCase().endsWith(".csv"));
  if (!entry) throw new Error(`CSV não encontrado em ${zipPath}`);
  const stream = entry.stream();
  stream.setEncoding("latin1");
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let header: Record<string, number> | null = null;
  const secs = new Map<string, Sec>();
  for await (const line of rl) {
    if (!header) {
      header = Object.fromEntries(splitCsv(line).map((h, i) => [h.replace(/"/g, ""), i]));
      continue;
    }
    if (!line.includes("Presidente")) continue;
    const c = splitCsv(line);
    const g = (k: string) => c[header![k] ?? -1] ?? "";
    if (g("DS_CARGO_PERGUNTA") !== "Presidente") continue;
    const key = `${g("CD_MUNICIPIO")}|${g("NR_ZONA")}|${g("NR_SECAO")}`;
    let s = secs.get(key);
    if (!s) {
      s = { mun: g("CD_MUNICIPIO"), uf, abre: minutesOfDay(g("DT_ABERTURA")), closes: minutesOfDay(g("DT_ENCERRAMENTO")), comp: Number(g("QT_COMPARECIMENTO")), lula: 0, flavio: 0, blank: 0, nullVotes: 0 };
      secs.set(key, s);
    }
    const votes = Number(g("QT_VOTOS"));
    const tipo = g("DS_TIPO_VOTAVEL");
    const nr = g("NR_VOTAVEL");
    if (tipo === "Nominal") { if (nr === "13") s.lula += votes; else if (nr === "22") s.flavio += votes; }
    else if (tipo === "Branco") s.blank += votes;
    else if (tipo === "Nulo") s.nullVotes += votes;
  }
  return [...secs.values()];
}

async function download(url: string, dest: string): Promise<void> {
  try { if ((await stat(dest)).size > 0) return; } catch { /* baixar */ }
  await mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} em ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

interface CkanRes { name: string; url: string; format: string }

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

export async function buildOvertime(generatedAt: string): Promise<void> {
  const round = Number(arg("turno") ?? 2);
  const onlyUf = arg("uf")?.toUpperCase();
  const outFile = arg("out") ?? "public/data/overtime.json";
  const baseMeta = { source: "TSE — Boletim de Urna (dados abertos)", url: "https://dadosabertos.tse.jus.br/dataset/resultados-2026-boletim-de-urna", reference: "—", generatedAt };

  const pkg = (await (await fetch(CKAN)).json()) as { result: { resources: CkanRes[]; metadata_modified: string } };
  const label = round === 2 ? /Segundo turno/i : /Primeiro turno/i;
  const files = pkg.result.resources.filter((r) => /Boletim de Urna/i.test(r.name) && label.test(r.name) && !/Hash/i.test(r.name));
  const wanted = onlyUf ? files.filter((f) => f.name.startsWith(`${onlyUf} -`)) : files;

  if (wanted.length === 0) {
    const out: OvertimeFile = {
      status: "unavailable",
      meta: { ...baseMeta, reference: `catálogo consultado em ${generatedAt}` },
      brasiliaCutoff: "17:00",
      reason: `Até a consulta (${generatedAt}), o TSE ainda não publicou nos dados abertos os Boletins de Urna do ${round}º turno. Esse é o único arquivo público com a hora de encerramento de cada seção. Nenhum número foi estimado.`,
    };
    await writeFile(outFile, JSON.stringify(out));
    console.log(`Horário de encerramento: BUs do ${round}º turno ainda não publicados. overtime.json marcado como indisponível.`);
    return;
  }

  // TSE → IBGE (a chave do mapa)
  const cfg = (await getJson(`${ELE_T2}/config/mun-e00${ELE_T2}-cm.json`)) as { abr: { cd: string; mu?: { cd: string; cdi: string }[] }[] };
  const ibgeOf = new Map<string, string>();
  for (const a of cfg.abr) for (const m of a.mu ?? []) ibgeOf.set(`${a.cd.toUpperCase()}|${m.cd.replace(/^0+/, "")}`, m.cdi);

  const total = { after: emptyGroup(), upTo: emptyGroup(), noTime: 0 };
  const byState: NonNullable<OvertimeFile["byState"]> = {};
  const byMunicipality: NonNullable<OvertimeFile["byMunicipality"]> = {};
  const thresholds = THRESHOLDS.map((m) => ({ minutes: m, sections: 0 }));
  let ref = "";

  for (const f of wanted) {
    const uf = f.name.slice(0, 2).toUpperCase();
    if (uf === "ZZ") continue;
    const zip = path.join(".cache", "bu", path.basename(new URL(f.url).pathname));
    console.log(`BU ${uf}: baixando/lendo…`);
    await download(f.url, zip);
    const secs = await readSections(zip, uf);
    ref = ref || (f.name.match(/\d{2}\.\d{2}\.\d{4}/)?.[0] ?? "");

    // Horário-padrão de abertura por município (moda, em hora cheia): a urna registra hora local.
    const modeOpens = new Map<string, number>();
    const cont = new Map<string, Map<number, number>>();
    for (const s of secs) {
      if (Number.isNaN(s.abre)) continue;
      const h = Math.floor(s.abre / 60);
      const m = cont.get(s.mun) ?? new Map<number, number>();
      m.set(h, (m.get(h) ?? 0) + 1);
      cont.set(s.mun, m);
    }
    for (const [mun, m] of cont) modeOpens.set(mun, [...m.entries()].sort((a, b) => b[1] - a[1])[0]![0]);

    const g = (byState[uf] ??= { after: emptyGroup(), upTo: emptyGroup() });
    for (const s of secs) {
      const opens = modeOpens.get(s.mun);
      if (opens === undefined || Number.isNaN(s.closes)) { total.noTime++; continue; }
      const delay = s.closes - (opens + 9) * 60; // minutos após as 17h de Brasília (8h + 9h)
      for (const l of thresholds) if (delay > l.minutes) l.sections++;
      const grp = delay > CUTOFF_MIN ? "after" : "upTo";
      for (const dst of [total[grp], g[grp]]) {
        dst.sections++; dst.lula += s.lula; dst.flavio += s.flavio; dst.blank += s.blank; dst.nullVotes += s.nullVotes; dst.turnout += s.comp;
      }
      if (grp === "after") {
        const ibge = ibgeOf.get(`${uf}|${s.mun.replace(/^0+/, "")}`);
        if (ibge) {
          const m = (byMunicipality[ibge] ??= [0, 0, 0, 0]);
          m[0]++; m[1] += s.lula; m[2] += s.flavio; m[3] += s.comp;
        }
      }
    }
  }

  const out: OvertimeFile = {
    status: "available", round, brasiliaCutoff: "17:00",
    meta: { ...baseMeta, reference: `BU ${ref}` },
    total, thresholds, byState, byMunicipality,
  };
  await writeFile(outFile, JSON.stringify(out));
  console.log(`overtime: ${total.after.sections} seções após o corte (> ${CUTOFF_MIN} min depois das 17h), ${total.upTo.sections} dentro; ${total.noTime} sem horário.`);
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/build-overtime.ts")) {
  buildOvertime(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
