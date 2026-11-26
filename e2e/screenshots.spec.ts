import { mkdirSync, writeFileSync } from "node:fs";
import { test, type Page } from "@playwright/test";
import { presetTheme } from "./fixtures";

// Gera os prints da landing em public/landing/ (WebP), com os dados de verdade do app.
// Fica fora da suíte normal: rode com `SCREENSHOTS=1 pnpm test:e2e e2e/screenshots.spec.ts`.
test.skip(!process.env.SCREENSHOTS, "só com SCREENSHOTS=1");
test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });

/** Tira o print do topo da tela e grava como WebP, convertendo no próprio navegador. */
const shoot = async (page: Page, name: string) => {
  await page.evaluate(() => window.scrollTo(0, 0));
  const png = (await page.screenshot()).toString("base64");
  const webp = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    return canvas.toDataURL("image/webp", 0.82);
  }, `data:image/png;base64,${png}`);
  mkdirSync("public/landing", { recursive: true });
  writeFileSync(`public/landing/${name}.webp`, Buffer.from(webp.split(",")[1], "base64"));
};

for (const [theme, name] of [["light", "app-claro"], ["dark", "app-escuro"]] as const) {
  test(`print do app no tema ${theme}`, async ({ page }) => {
    await presetTheme(page, theme);
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/app");
    await page.getByRole("heading", { level: 1, name: /Presidente/ }).waitFor();
    // fontes carregadas e a contagem dos números terminada
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2_500);
    await shoot(page, name);
  });
}

/** Rola até o elemento (o `scroll-padding-top` o deixa abaixo do cabeçalho) e grava o print do README. */
const readmeShot = async (page: Page, name: string, target?: string) => {
  if (target) {
    await page.locator(target).first().evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await page.evaluate(() => window.scrollBy(0, -24));
  } else await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  mkdirSync("docs/screenshots", { recursive: true });
  writeFileSync(`docs/screenshots/${name}.png`, await page.screenshot());
};

/** Abre o app no tema pedido e espera as fontes e a contagem dos números. */
const openApp = async (page: Page, theme: "light" | "dark") => {
  await presetTheme(page, theme);
  await page.emulateMedia({ colorScheme: theme });
  await page.goto("/app");
  await page.getByRole("heading", { level: 1, name: /Presidente/ }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2_500);
};

test.describe("README", () => {
  test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });

  for (const theme of ["light", "dark"] as const) {
    test(`início no tema ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 760 });
      await openApp(page, theme);
      await readmeShot(page, `principal-${theme}`);
    });
  }

  test("seções do app", async ({ page }) => {
    await openApp(page, "dark");
    await readmeShot(page, "regioes", "#regioes h2");
    await readmeShot(page, "turnos", "#turnos h2");
    // a Bahia aproximada, com os municípios carregados no painel
    await page.locator("#mapa").evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await page.locator('[data-uf="BA"]').click();
    await page.getByRole("list", { name: "Lista de municípios" }).getByRole("button").first().waitFor();
    await page.waitForTimeout(1_500);
    await readmeShot(page, "mapa-estado", '#mapa [role="combobox"]');
  });

  test("celular", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openApp(page, "light");
    await readmeShot(page, "mobile");
  });
});
