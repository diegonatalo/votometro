import { useCallback, useSyncExternalStore } from "react";
import {
  DARK_QUERY,
  parseTheme,
  type Theme,
  type ThemeColors,
} from "@/lib/theme";

const CHANGE_EVENT = "theme:change";

const readChoice = (key: string): Theme | null => {
  try {
    return parseTheme(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const systemTheme = (): Theme =>
  window.matchMedia(DARK_QUERY).matches ? "dark" : "light";

const applyTheme = (theme: Theme, colors?: ThemeColors) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  if (colors) {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", colors[theme]);
  }
};

/** Tema em uso: a classe `dark` do `<html>`, aplicada antes da pintura por `themeScript`. */
const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

// No servidor não há tema; o navegador corrige logo após a hidratação.
const getServerSnapshot = (): Theme => "light";

/**
 * Tema claro/escuro. Só grava em `key` quando o usuário escolhe; sem escolha,
 * acompanha o sistema. Sincroniza entre componentes e abas.
 * `colors` deve ser uma constante de módulo.
 */
export const useTheme = (key: string, colors?: ThemeColors) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(DARK_QUERY);
      const sync = () => {
        applyTheme(readChoice(key) ?? systemTheme(), colors);
        onChange();
      };
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) sync();
      };
      media.addEventListener("change", sync);
      window.addEventListener("storage", onStorage);
      window.addEventListener(CHANGE_EVENT, onChange);
      return () => {
        media.removeEventListener("change", sync);
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(CHANGE_EVENT, onChange);
      };
    },
    [key, colors],
  );

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback(
    (next: Theme) => {
      applyTheme(next, colors);
      try {
        localStorage.setItem(key, next);
      } catch {
        // Armazenamento bloqueado: o tema vale só nesta visita.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key, colors],
  );

  const toggle = useCallback(
    () => setTheme(getSnapshot() === "dark" ? "light" : "dark"),
    [setTheme],
  );

  return { theme, setTheme, toggle };
};
