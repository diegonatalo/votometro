import type { ReactNode } from "react";
import { formatLegalDate } from "@/lib/legal";

export type LegalSection = {
  /** Âncora da seção, em português e kebab-case (vira `#id` no sumário). */
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  title: string;
  /** Uma frase sobre o que a página cobre. */
  summary: string;
  /** Data da última mudança no texto, no formato `AAAA-MM-DD`. */
  updatedAt: string;
  sections: LegalSection[];
  /** Algo antes do título, como a marca do projeto com link para o início. */
  header?: ReactNode;
};

/**
 * Layout de `/privacidade` e `/termos`: título, data, sumário com âncoras e seções.
 * Sem cores fixas (só opacidade), para herdar a paleta de cada projeto.
 */
export const LegalPage = ({ title, summary, updatedAt, sections, header }: LegalPageProps) => (
  <main id="conteudo" className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
    {header}
    <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
    <p className="mt-3 opacity-80">{summary}</p>
    <p className="mt-1 text-sm opacity-70">Atualizada em {formatLegalDate(updatedAt)}.</p>

    {sections.length > 1 && (
      <nav aria-label="Nesta página" className="mt-8">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="underline-offset-4 hover:underline">
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )}

    <div className="mt-10 space-y-10">
      {sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`} className="scroll-mt-20">
          <h2 id={`${section.id}-titulo`} className="text-xl font-semibold">
            {section.title}
          </h2>
          <div className="mt-3 space-y-3 leading-7 opacity-90">{section.content}</div>
        </section>
      ))}
    </div>
  </main>
);
