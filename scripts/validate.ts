import { readFile } from "node:fs/promises";
import { validateAll } from "@/lib/validation";
import type { MunicipalitiesFile, NationalFile, StatesFile } from "@/types";

const read = async <T>(f: string): Promise<T> => JSON.parse(await readFile(`public/data/${f}`, "utf8")) as T;

export async function runValidation(): Promise<boolean> {
  const [national, states, munis] = await Promise.all([
    read<NationalFile>("national.json"),
    read<StatesFile>("states.json"),
    read<MunicipalitiesFile>("municipios.json"),
  ]);
  const checks = validateAll(national, states, munis);
  for (const c of checks) {
    const tag = c.level === "ok" ? "  OK  " : c.level === "error" ? " ERRO " : " info ";
    console.log(`[${tag}] ${c.text}`);
  }
  const errors = checks.filter((c) => c.level === "error").length;
  console.log(errors === 0 ? "\nValidação concluída: todos os totais conferem." : `\nValidação FALHOU: ${errors} divergência(s).`);
  return errors === 0;
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/validate.ts")) {
  runValidation().then((ok) => process.exit(ok ? 0 : 1));
}
