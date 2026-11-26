import type { Page } from "@playwright/test";

/** O `<h1>` da página, pelo texto. */
export const title = (page: Page, name: string | RegExp) => page.getByRole("heading", { level: 1, name });

/** Erros do console e exceções da página, para conferir no fim do teste. */
export const collectErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
};

/** Abre o site já no tema pedido, como se a pessoa tivesse escolhido antes. */
export const presetTheme = async (page: Page, theme: "light" | "dark") => {
  await page.addInitScript((value) => localStorage.setItem("votometro:theme:v1", value), theme);
};
