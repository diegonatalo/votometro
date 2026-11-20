const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/**
 * Data de atualização de uma página legal, de `AAAA-MM-DD` para "20 de novembro de 2026".
 * Lê a string em vez de usar `Date`, para não depender de fuso nem do relógio na renderização.
 */
export const formatLegalDate = (isoDate: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  const day = match ? Number(match[3]) : 0;
  if (!match || !month || day < 1 || day > 31) {
    throw new Error(`Data inválida para página legal: "${isoDate}" (use AAAA-MM-DD).`);
  }
  return `${day} de ${month} de ${match[1]}`;
};

export type FooterLink = { href: string; label: string; external: boolean };

export type FooterOptions = {
  /** O projeto tem `/privacidade`. */
  privacy?: boolean;
  /** O projeto tem `/termos`. */
  terms?: boolean;
  /** Repositório público do projeto. */
  sourceUrl?: string;
  /** Site de quem fez (ex.: o portfolio). */
  authorUrl?: string;
};

/** Links do rodapé na ordem em que aparecem: Privacidade, Termos, Código, autor. */
export const footerLinks = ({ privacy, terms, sourceUrl, authorUrl }: FooterOptions): FooterLink[] => [
  ...(privacy ? [{ href: "/privacidade", label: "Privacidade", external: false }] : []),
  ...(terms ? [{ href: "/termos", label: "Termos de uso", external: false }] : []),
  ...(sourceUrl ? [{ href: sourceUrl, label: "Código", external: true }] : []),
  ...(authorUrl ? [{ href: authorUrl, label: "Feito por Diego", external: true }] : []),
];
