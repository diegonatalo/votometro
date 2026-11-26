"use client";

import { useTheme } from "@/hooks/use-theme";
import { useMounted } from "@/hooks/use-mounted";
import { THEME_KEY } from "@/lib/storage-keys";
import { legendBins, type ThemeName } from "@/lib/colors";

export function useThemeName(): ThemeName {
  const { theme } = useTheme(THEME_KEY);
  const mounted = useMounted();
  return mounted && theme === "dark" ? "dark" : "light";
}

/** Legenda em faixas: Lula 70%+ … 50% … Flávio 70%+. */
export const Legend = () => {
  const theme = useThemeName();
  const bins = legendBins(theme);
  return (
    <figure className="w-full max-w-md" aria-label="Legenda do mapa: cor pelo candidato à frente, intensidade pelo percentual dos votos válidos">
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {bins.map((b) => (
          <div key={`${b.leader}-${b.label}`} className="flex-1" style={{ background: b.color }} title={`${b.leader === "lula" ? "Lula" : "Flávio"} ${b.label}`} />
        ))}
      </div>
      <figcaption className="font-data mt-1.5 flex justify-between text-xs text-ink-2">
        <span>Lula 70%+</span>
        <span>60</span>
        <span>55</span>
        <span>50</span>
        <span>55</span>
        <span>60</span>
        <span>Flávio 70%+</span>
      </figcaption>
    </figure>
  );
};
