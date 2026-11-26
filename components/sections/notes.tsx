import type { NationalFile } from "@/types";
import { SectionTitle } from "@/components/section-title";
import { SourceNote } from "@/components/source-note";

export const Notes = ({ data }: { data: NationalFile }) => {
  return (
    <section id="notas" aria-labelledby="h-notas" className="pt-20 sm:pt-28">
      <SectionTitle id="h-notas" n="06" em="entre fontes">Notas e diferenças</SectionTitle>
      <ul className="mt-6 grid gap-x-12 md:grid-cols-2">
        {data.notes.map((n) => (
          <li key={n.id} className="border-b border-line">
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold [&::-webkit-details-marker]:hidden">
                {n.title}
                <span aria-hidden="true" className="text-xl font-normal text-ink-3 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2.5 max-w-3xl text-[0.95rem] leading-relaxed text-ink-2">{n.text}</p>
            </details>
          </li>
        ))}
      </ul>
      <SourceNote meta={data.meta} />
    </section>
  );
};
