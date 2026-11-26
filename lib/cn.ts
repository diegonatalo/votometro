/** Junta classes, ignorando valores falsos: `cn("a", cond && "b")`. */
export const cn = (...classes: (string | false | null | undefined)[]): string => classes.filter(Boolean).join(" ");
