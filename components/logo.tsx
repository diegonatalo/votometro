import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * O "ô" do logo: circunflexo com um traço na cor de cada candidato sobre o anel neutro da urna.
 * Desenhado para a caixa de 1em de altura, com a base do anel na linha de base do texto.
 */
const Glyph = () => (
  <svg viewBox="0 0 60 100" className="mx-[0.01em] h-[1em] w-[0.6em] overflow-visible" aria-hidden="true">
    <path d="M12 36 L30 13" fill="none" stroke="var(--lula)" strokeWidth="11" strokeLinecap="round" />
    <path d="M30 13 L48 36" fill="none" stroke="var(--flavio)" strokeWidth="11" strokeLinecap="round" />
    <circle cx="30" cy="72.5" r="20.5" fill="none" stroke="currentColor" strokeWidth="13" />
  </svg>
);

/** Nome do site com o "ô" desenhado. O texto acessível continua "Votômetro". */
export const Wordmark = ({ className }: { className?: string }) => (
  <span className={cn("inline-flex items-baseline font-sans font-extrabold leading-none tracking-[-0.04em] text-ink", className)}>
    <span className="sr-only">Votômetro</span>
    <span aria-hidden="true" className="inline-flex items-baseline">
      vot
      <Glyph />
      metro
    </span>
  </span>
);

/** Só o símbolo, sem fundo. */
export const LogoMark = ({ className, label }: { className?: string; label?: string }) => (
  <svg viewBox="0 0 100 100" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    <path d="M27 42 L50 17" fill="none" stroke="var(--lula)" strokeWidth="12" strokeLinecap="round" />
    <path d="M50 17 L73 42" fill="none" stroke="var(--flavio)" strokeWidth="12" strokeLinecap="round" />
    <circle cx="50" cy="66" r="19" fill="none" stroke="var(--ink)" strokeWidth="13" />
  </svg>
);

/** Circunflexo dos 50%, a assinatura das barras divididas. */
export const MidChevron = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 20 12" className={className} style={style} aria-hidden="true">
    <path d="M3 10 L10 3 L17 10" fill="none" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
