import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Tally, Round1Row } from "@/types";

export const TSE_BASE = "https://resultados.tse.jus.br/oficial/ele2026";
export const ELE_T1 = "6257";
export const ELE_T2 = "6258";
const CACHE_DIR = path.join(".cache", "tse");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Espaça as requisições e pausa tudo quando o servidor do TSE responde 429. */
let nextSlot = 0;
let blockedUntil = 0;
let strikes = 0;
async function throttle(): Promise<void> {
  const now = Date.now();
  const start = Math.max(nextSlot, now, blockedUntil);
  nextSlot = start + 200;
  if (start > now) await sleep(start - now);
}
function penalize(): void {
  strikes++;
  blockedUntil = Math.max(blockedUntil, Date.now() + Math.min(180_000, 30_000 * strikes));
  console.warn(`  429 do TSE: pausando ${Math.round((blockedUntil - Date.now()) / 1000)}s`);
}

/** Baixa um JSON do TSE, com cache em disco e novas tentativas. */
export async function getJson<T>(relPath: string, opts: { cache?: boolean } = {}): Promise<T> {
  const useCache = opts.cache ?? true;
  const file = path.join(CACHE_DIR, relPath.replace(/[\\/]/g, "_"));
  if (useCache) {
    try {
      return JSON.parse(await readFile(file, "utf8")) as T;
    } catch {
      /* sem cache */
    }
  }
  let lastErr: unknown;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      await throttle();
      const res = await fetch(`${TSE_BASE}/${relPath}`, { headers: { "user-agent": "apuracao-2026-build/1.0" } });
      if (res.status === 429) penalize();
      if (!res.ok) throw new Error(`HTTP ${res.status} em ${relPath}`);
      const text = await res.text();
      const json = JSON.parse(text) as T;
      if (useCache) {
        await mkdir(CACHE_DIR, { recursive: true });
        await writeFile(file, text);
      }
      return json;
    } catch (err) {
      lastErr = err;
      await sleep(Math.min(5000, 300 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function pool<I, O>(items: I[], size: number, fn: (item: I, idx: number) => Promise<O>): Promise<O[]> {
  const out: O[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await fn(items[i] as I, i);
    }
  });
  await Promise.all(workers);
  return out;
}

interface RawCand { n: string; vap?: string }
interface RawUnit {
  dg: string; hg: string; dt: string; ht: string;
  carg: { agr: { par: { cand?: RawCand[] }[] }[] }[];
  s: { ts: string; st: string };
  e: { te: string; c: string; a: string; esni: string };
  v: { vb: string; tvn: string };
}

export interface ParsedUnit {
  tally: Tally;
  votesByNumber: Map<string, number>;
  generation: string;
  counting: string;
}

const num = (s: string | undefined): number => Number(s ?? 0);

export function parseUnit(j: RawUnit): ParsedUnit {
  const votesByNumber = new Map<string, number>();
  for (const agr of j.carg[0]?.agr ?? []) {
    for (const par of agr.par) {
      for (const c of par.cand ?? []) votesByNumber.set(c.n, num(c.vap));
    }
  }
  const tally: Tally = {
    lula: votesByNumber.get("13") ?? 0,
    flavio: votesByNumber.get("22") ?? 0,
    blank: num(j.v.vb),
    nullVotes: num(j.v.tvn),
    eligible: num(j.e.te),
    turnout: num(j.e.c),
    abstentions: num(j.e.a),
    notInstalled: num(j.e.esni),
    sections: num(j.s.ts),
    countedSections: num(j.s.st),
  };
  return { tally, votesByNumber, generation: `${j.dg} ${j.hg}`, counting: `${j.dt} ${j.ht}` };
}

export function toRound1(p: ParsedUnit): Round1Row {
  let others = 0;
  for (const [n, v] of p.votesByNumber) if (n !== "13" && n !== "22") others += v;
  return {
    lula: p.tally.lula, flavio: p.tally.flavio, others,
    blank: p.tally.blank, nullVotes: p.tally.nullVotes, eligible: p.tally.eligible, turnout: p.tally.turnout,
  };
}

export function unitPath(ele: string, uf: string, tseMun?: string): string {
  const ufl = uf.toLowerCase();
  return `${ele}/dados/${ufl}/${ufl}${tseMun ?? ""}-c0001-e${ele.padStart(6, "0")}-u.json`;
}
