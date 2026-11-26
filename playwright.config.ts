import { createHash } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

const CI = Boolean(process.env.CI);
// Uma porta por pasta (20000 a 29999), para um projeto nunca testar o servidor de outro,
// nem se ele subir durante o build. No CI é 3100, a do BETTER_AUTH_URL do ci.yml.
const PORT = CI ? 3100 : 20000 + (createHash("sha1").update(__dirname).digest().readUInt32BE(0) % 10000);

// Roda contra o build de produção. No CI o `pnpm build` já rodou no passo anterior.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: CI ? `pnpm start --port ${PORT}` : `pnpm build && pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Porta ocupada é erro: quem está nela pode ser outro app, com outro banco.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
