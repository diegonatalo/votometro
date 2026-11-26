"use client";

import { useTheme } from "@/hooks/use-theme";
import { useMounted } from "@/hooks/use-mounted";
import { THEME_KEY } from "@/lib/storage-keys";

const SUN = "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z";
const MOON = "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z";

/** Botão redondo que alterna entre claro e escuro; mostra o ícone do tema para onde vai. */
export const ThemeToggle = () => {
  const { theme, toggle } = useTheme(THEME_KEY);
  const mounted = useMounted();
  const dark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      title={dark ? "Tema claro" : "Tema escuro"}
      className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-surface-2"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dark ? SUN : MOON} />
      </svg>
    </button>
  );
};
