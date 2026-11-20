import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LegalPage } from "@/components/legal-page";
import { SiteFooter } from "@/components/site-footer";

const sections = [
  { id: "o-que-guardamos", title: "O que guardamos", content: <p>Nada sai do navegador.</p> },
  { id: "contato", title: "Contato", content: <p>Escreva para nós.</p> },
];

describe("LegalPage", () => {
  it("mostra título, data por extenso e as seções", () => {
    render(<LegalPage title="Privacidade" summary="Resumo." updatedAt="2026-11-20" sections={sections} />);
    expect(screen.getByRole("heading", { level: 1, name: "Privacidade" })).toBeInTheDocument();
    expect(screen.getByText("Atualizada em 20 de novembro de 2026.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Contato" })).toHaveTextContent("Escreva para nós.");
  });

  it("liga o sumário às âncoras das seções", () => {
    render(<LegalPage title="Privacidade" summary="Resumo." updatedAt="2026-11-20" sections={sections} />);
    const nav = screen.getByRole("navigation", { name: "Nesta página" });
    expect(nav.querySelectorAll("a")[0]).toHaveAttribute("href", "#o-que-guardamos");
  });

  it("mostra o cabeçalho antes do título", () => {
    render(
      <LegalPage title="Privacidade" summary="Resumo." updatedAt="2026-11-20" sections={sections} header={<a href="/marca">Marca</a>} />,
    );
    expect(screen.getByRole("link", { name: "Marca" })).toHaveAttribute("href", "/marca");
  });

  it("sem sumário quando há uma seção só", () => {
    render(<LegalPage title="Termos" summary="Resumo." updatedAt="2026-11-20" sections={sections.slice(0, 1)} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});

describe("SiteFooter", () => {
  it("abre links externos em outra aba", () => {
    render(<SiteFooter privacy sourceUrl="https://github.com/x/y" />);
    expect(screen.getByRole("link", { name: "Privacidade" })).toHaveAttribute("href", "/privacidade");
    const source = screen.getByRole("link", { name: "Código" });
    expect(source).toHaveAttribute("target", "_blank");
    expect(source).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("não renderiza nada sem links", () => {
    const { container } = render(<SiteFooter />);
    expect(container).toBeEmptyDOMElement();
  });
});
