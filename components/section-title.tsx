import type { ReactNode } from "react";

type Props = {
  id: string;
  n: string;
  children: ReactNode;
  /** Complemento do título, em itálico e tom mais claro. */
  em?: ReactNode;
};

/** Título de seção no estilo de jornal: fio grosso, número em mono e serifa com complemento em itálico. */
export const SectionTitle = ({ id, n, children, em }: Props) => {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
      <span className="font-data text-sm font-semibold text-ink-3" aria-hidden="true">{n}</span>
      <h2 id={id} className="font-display text-3xl leading-[1.05] tracking-[-0.03em] text-balance sm:text-5xl">
        {children}
        {em ? <> <em className="text-ink-2">{em}</em></> : null}
      </h2>
    </div>
  );
};
