import { describe, expect, it } from "vitest";
import { parseUnit, pool, toRound1, unitPath } from "@/scripts/lib/tse";

const raw = {
  dg: "07/11/2026",
  hg: "20:00:00",
  dt: "07/11/2026",
  ht: "19:55:00",
  carg: [
    {
      agr: [
        { par: [{ cand: [{ n: "13", vap: "600" }] }, { cand: [{ n: "22", vap: "400" }, { n: "12", vap: "50" }] }] },
      ],
    },
  ],
  s: { ts: "10", st: "9" },
  e: { te: "2000", c: "1100", a: "880", esni: "20" },
  v: { vb: "30", tvn: "20" },
};

describe("parseUnit", () => {
  it("lê os votos de Lula (13) e Flávio (22) pelo número de urna", () => {
    const { tally } = parseUnit(raw);
    expect(tally.lula).toBe(600);
    expect(tally.flavio).toBe(400);
  });

  it("lê brancos, nulos, aptos, comparecimento e seções", () => {
    expect(parseUnit(raw).tally).toMatchObject({
      blank: 30,
      nullVotes: 20,
      eligible: 2000,
      turnout: 1100,
      abstentions: 880,
      notInstalled: 20,
      sections: 10,
      countedSections: 9,
    });
  });

  it("junta data e hora de geração e de totalização", () => {
    const parsed = parseUnit(raw);
    expect(parsed.generation).toBe("07/11/2026 20:00:00");
    expect(parsed.counting).toBe("07/11/2026 19:55:00");
  });

  it("trata cargo ou candidato ausente como zero votos", () => {
    const { tally } = parseUnit({ ...raw, carg: [] });
    expect(tally.lula).toBe(0);
    expect(tally.flavio).toBe(0);
  });
});

describe("toRound1", () => {
  it("soma os demais candidatos em `others`", () => {
    const row = toRound1(parseUnit(raw));
    expect(row).toMatchObject({ lula: 600, flavio: 400, others: 50, blank: 30, nullVotes: 20 });
  });
});

describe("unitPath", () => {
  it("monta o caminho do arquivo de uma UF", () => {
    expect(unitPath("6258", "SP")).toBe("6258/dados/sp/sp-c0001-e006258-u.json");
  });

  it("inclui o município quando informado", () => {
    expect(unitPath("6258", "MG", "01120")).toBe("6258/dados/mg/mg01120-c0001-e006258-u.json");
  });
});

describe("pool", () => {
  it("processa tudo e mantém a ordem dos resultados", async () => {
    const result = await pool([1, 2, 3, 4, 5], 2, async (n) => n * 10);
    expect(result).toEqual([10, 20, 30, 40, 50]);
  });

  it("respeita o limite de tarefas simultâneas", async () => {
    let running = 0;
    let peak = 0;
    await pool(Array.from({ length: 8 }), 3, async () => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((resolve) => setTimeout(resolve, 5));
      running--;
    });
    expect(peak).toBe(3);
  });

  it("aceita lista vazia", async () => {
    expect(await pool([], 4, async () => 1)).toEqual([]);
  });
});
