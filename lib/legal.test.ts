import { describe, expect, it } from "vitest";
import { footerLinks, formatLegalDate } from "@/lib/legal";

describe("formatLegalDate", () => {
  it("escreve a data por extenso", () => {
    expect(formatLegalDate("2026-11-20")).toBe("20 de novembro de 2026");
  });

  it("tira o zero à esquerda do dia", () => {
    expect(formatLegalDate("2027-03-05")).toBe("5 de março de 2027");
  });

  it("recusa formato ou mês inválido", () => {
    expect(() => formatLegalDate("20/11/2026")).toThrow("AAAA-MM-DD");
    expect(() => formatLegalDate("2026-13-01")).toThrow();
    expect(() => formatLegalDate("2026-01-00")).toThrow();
  });
});

describe("footerLinks", () => {
  it("sem opções não tem links", () => {
    expect(footerLinks({})).toEqual([]);
  });

  it("põe os links na ordem certa", () => {
    const links = footerLinks({
      privacy: true,
      terms: true,
      sourceUrl: "https://github.com/x/y",
      authorUrl: "https://exemplo.dev",
    });
    expect(links.map((link) => link.label)).toEqual(["Privacidade", "Termos de uso", "Código", "Feito por Diego"]);
    expect(links.filter((link) => link.external).map((link) => link.href)).toEqual([
      "https://github.com/x/y",
      "https://exemplo.dev",
    ]);
  });

  it("mostra só o que o projeto tem", () => {
    expect(footerLinks({ privacy: true }).map((link) => link.href)).toEqual(["/privacidade"]);
  });
});
