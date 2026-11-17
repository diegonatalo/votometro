export type Theme = "light" | "dark";

/** Cor da barra do navegador (`<meta name="theme-color">`) em cada tema. */
export type ThemeColors = Record<Theme, string>;

export const DARK_QUERY = "(prefers-color-scheme: dark)";

export const parseTheme = (value: unknown): Theme | null =>
  value === "light" || value === "dark" ? value : null;

/**
 * Script inline para o `<head>` do layout: aplica a classe `dark` antes da
 * primeira pintura (sem flash). Usa a escolha salva em `key`; sem escolha,
 * segue o sistema. Com `colors`, também ajusta o `<meta name="theme-color">`.
 */
export const themeScript = (key: string, colors?: ThemeColors): string => {
  const meta = colors
    ? `var m=document.querySelector('meta[name="theme-color"]');` +
      `if(m)m.setAttribute("content",d?${JSON.stringify(colors.dark)}:${JSON.stringify(colors.light)});`
    : "";
  return (
    `(function(){try{var t=localStorage.getItem(${JSON.stringify(key)});` +
    `var d=t==="dark"||(t!=="light"&&window.matchMedia(${JSON.stringify(DARK_QUERY)}).matches);` +
    `document.documentElement.classList.toggle("dark",d);${meta}}catch(e){}})();`
  );
};
