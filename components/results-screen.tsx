import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { SectionTitle } from "@/components/section-title";
import { BrazilMap } from "@/components/map/brazil-map";
import { Hero } from "@/components/sections/hero";
import { Notes } from "@/components/sections/notes";
import { Overtime } from "@/components/sections/overtime";
import { Regions } from "@/components/sections/regions";
import { RoundCompare } from "@/components/sections/round-compare";
import { SiteFooter } from "@/components/site-footer";
import { StatesTable } from "@/components/states-table";
import { ThemeToggle } from "@/components/theme-toggle";
import { SourceNote } from "@/components/source-note";
import { loadMunicipalities, loadNational, loadOvertime, loadStates, loadStatesTopo } from "@/lib/data";
import { SOURCE_URL } from "@/lib/site";

const NAV = [
  { href: "#resultado", label: "Resultado" },
  { href: "#mapa", label: "Mapa" },
  { href: "#regioes", label: "Regiões" },
  { href: "#turnos", label: "Turnos" },
  { href: "#17h", label: "Após 17h" },
  { href: "#tabela", label: "Estados" },
  { href: "#notas", label: "Notas" },
];

export const ResultsScreen = () => {
  const national = loadNational();
  const states = loadStates();
  const overtime = loadOvertime();
  const topo = loadStatesTopo();
  const munis = loadMunicipalities();

  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-4 pt-2.5 pb-1 sm:px-6 md:flex-nowrap md:py-3">
          <Link href="/" className="inline-flex shrink-0 items-center gap-3">
            <Wordmark className="text-[1.6rem]" />
            <span className="font-data rounded-full border border-line px-2.5 py-1 text-xs whitespace-nowrap text-ink-2 max-sm:hidden">2026 · 2º turno</span>
          </Link>
          <div className="ml-auto md:order-last md:ml-0"><ThemeToggle /></div>
          <nav aria-label="Seções" className="scroll-thin -mx-4 flex w-[calc(100%+2rem)] gap-1.5 overflow-x-auto px-4 pt-1 pb-2.5 text-sm text-ink-2 md:mx-0 md:w-auto md:flex-1 md:gap-0.5 md:p-0">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="shrink-0 rounded-full border border-line px-3.5 py-2 whitespace-nowrap hover:bg-surface-2 hover:text-ink md:border-transparent md:px-3">{n.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main id="conteudo" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Hero data={national} />

        <section id="mapa" aria-labelledby="h-mapa" className="pt-20 sm:pt-28">
          <SectionTitle id="h-mapa" n="01" em="ficou na frente">Onde cada candidato</SectionTitle>
          <p className="mt-4 mb-8 max-w-2xl text-lg leading-relaxed text-ink-2">Cor pelo candidato à frente, intensidade pelo percentual. Passe o mouse ou toque para ver os números; clique num estado para aproximar e listar os municípios.</p>
          <BrazilMap
            states={states.states}
            topo={topo}
            national={national.national}
            meta={states.meta}
            candidates={national.candidates}
          />
        </section>

        <Regions states={states.states} meta={states.meta} />
        <RoundCompare data={national} />
        <Overtime data={overtime} munis={munis} />

        <section id="tabela" aria-labelledby="h-tabela" className="pt-20 sm:pt-28">
          <SectionTitle id="h-tabela" n="05">Todos os estados</SectionTitle>
          <div className="mt-8"><StatesTable states={states.states} /></div>
          <SourceNote meta={states.meta} />
        </section>

        <Notes data={national} />
      </main>

      <SiteFooter sourceUrl={SOURCE_URL} authorUrl="https://diegonatalo.dev">
        <Wordmark className="text-xl" />
        <p className="font-data text-xs leading-relaxed text-ink-2">
          Dados: Tribunal Superior Eleitoral (resultados.tse.jus.br). Geometrias: IBGE, API de malhas. Referência dos dados: {national.meta.reference}. Atualizado em {national.meta.generatedAt}.
        </p>
        <p className="font-data text-xs leading-relaxed text-ink-2">Site informativo e independente, sem vínculo com o TSE. Os valores exibidos vêm dos arquivos oficiais, sem estimativas.</p>
      </SiteFooter>
    </>
  );
};
