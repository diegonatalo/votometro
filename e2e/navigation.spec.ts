import { expect, test } from "@playwright/test";
import { collectErrors, title, presetTheme } from "./fixtures";

const PAGES = [
  { path: "/", heading: /A apuração do 2º turno inteira/ },
  { path: "/app", heading: /Presidente, 2º turno/ },
];

for (const { path, heading } of PAGES) {
  test(`abre ${path} sem erros no console`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await expect(title(page, heading)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("o botão da landing abre o app", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("main").getByRole("link", { name: "Abrir o app" }).first().click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(title(page, /Presidente, 2º turno/)).toBeVisible();
});

test("a landing mostra o print do app no tema escolhido", async ({ page }) => {
  await presetTheme(page, "dark");
  await page.goto("/");
  const preview = page.getByRole("img", { name: /Tela do app/ }).filter({ visible: true });
  await expect(preview).toHaveCount(1);
  await expect(preview).toHaveAttribute("src", /app-escuro/);
});

test("o tema escolhido continua depois de recarregar", async ({ page }) => {
  await page.goto("/app");
  const html = page.locator("html");
  const toDark = page.getByRole("button", { name: "Mudar para o tema escuro" });
  if (await toDark.isVisible()) await toDark.click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Mudar para o tema claro" }).click();
  await page.reload();
  await expect(html).not.toHaveClass(/dark/);
});

// sem conferir o console: o Chromium registra a própria resposta 404 como erro
test("a 404 avisa e leva de volta ao app", async ({ page }) => {
  await page.goto("/nao-existe");
  await expect(title(page, /Essa página não foi apurada/)).toBeVisible();
  await page.getByRole("link", { name: "Voltar ao resultado" }).click();
  await expect(page).toHaveURL(/\/app$/);
});
