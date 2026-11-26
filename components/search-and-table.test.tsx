import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useMounted } from "@/hooks/use-mounted";
import { renderHook } from "@testing-library/react";
import type { Municipality, State, Tally } from "@/types";
import { MunicipalitySearch } from "./map/municipality-search";
import { StatesTable } from "./states-table";

const tally = (lula: number, flavio: number, turnout = lula + flavio, eligible = turnout * 1.25): Tally => ({
  lula,
  flavio,
  blank: 0,
  nullVotes: 0,
  eligible,
  turnout,
  abstentions: eligible - turnout,
  notInstalled: 0,
  sections: 10,
  countedSections: 10,
});

const town = (ibge: string, name: string, uf: string): Municipality => ({ ...tally(10, 5), ibge, name, uf });

const towns = [
  town("1", "Santos", "SP"),
  town("2", "Santo André", "SP"),
  town("3", "Itanhaém", "SP"),
  town("4", "Vila Santa Rosa", "MG"),
  town("5", "São Paulo", "SP"),
];

describe("MunicipalitySearch", () => {
  const setup = (municipalities: Municipality[] | null = towns) => {
    const handlers = { onWake: vi.fn(), onPick: vi.fn() };
    render(<MunicipalitySearch municipalities={municipalities} {...handlers} />);
    return { ...handlers, input: screen.getByRole("combobox", { name: "Buscar município" }) };
  };
  const options = () => screen.getAllByRole("option").map((o) => o.textContent);

  it("ao focar, pede para carregar os municípios", async () => {
    const { onWake, input } = setup();
    await userEvent.click(input);
    expect(onWake).toHaveBeenCalled();
  });

  it("busca sem acento a partir de 2 letras: exato, depois começa com, depois contém", async () => {
    const { input } = setup();
    await userEvent.type(input, "s");
    expect(screen.queryByRole("listbox")).toBeNull();
    await userEvent.type(input, "antos");
    expect(options()).toEqual(["SantosSP"]);
    await userEvent.clear(input);
    await userEvent.type(input, "sant");
    expect(options()).toEqual(["SantosSP", "Santo AndréSP", "Vila Santa RosaMG"]);
    await userEvent.clear(input);
    await userEvent.type(input, "itanhaem");
    expect(options()).toEqual(["ItanhaémSP"]);
  });

  it("escolhe com o teclado e mostra o município no campo", async () => {
    const { input, onPick } = setup();
    await userEvent.type(input, "sant");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onPick).toHaveBeenCalledWith(towns[1]);
    expect(input).toHaveValue("Santo André — SP");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("marca a opção ativa para leitores de tela", async () => {
    const { input } = setup();
    await userEvent.type(input, "sant");
    await userEvent.keyboard("{ArrowDown}");
    const active = screen.getByRole("option", { selected: true });
    expect(active).toHaveTextContent("Santo André");
    expect(input).toHaveAttribute("aria-activedescendant", active.id);
  });

  it("escolhe com o mouse", async () => {
    const { input, onPick } = setup();
    await userEvent.type(input, "itan");
    fireEvent.mouseDown(screen.getByRole("option", { name: /Itanhaém/ }));
    expect(onPick).toHaveBeenCalledWith(towns[2]);
  });

  it("avisa quando não encontra", async () => {
    const { input } = setup();
    await userEvent.type(input, "xyz");
    expect(screen.getByRole("option")).toHaveTextContent("Nenhum município encontrado");
  });

  it("antes de carregar os municípios, mostra que está carregando", async () => {
    const { input } = setup(null);
    await userEvent.type(input, "san");
    expect(screen.getByRole("option")).toHaveTextContent("Carregando municípios…");
  });
});

const state = (uf: string, name: string, region: State["region"], lula: number, flavio: number): State => ({
  ...tally(lula, flavio),
  uf,
  name,
  region,
  ibgeCode: uf,
});

const states = [
  state("SP", "São Paulo", "SE", 400, 600),
  state("BA", "Bahia", "NE", 700, 300),
  state("RS", "Rio Grande do Sul", "S", 450, 550),
  state("AM", "Amazonas", "N", 520, 480),
];

describe("StatesTable", () => {
  const names = () =>
    within(screen.getByRole("table"))
      .getAllByRole("rowheader")
      .map((h) => h.textContent?.replace(/^[A-Z]{2}/, "").trim());
  const header = (name: string) => within(screen.getByRole("table")).getByRole("button", { name });

  it("começa em ordem alfabética", () => {
    render(<StatesTable states={states} />);
    expect(names()).toEqual(["Amazonas", "Bahia", "Rio Grande do Sul", "São Paulo"]);
    expect(screen.getByText("4 de 4")).toBeInTheDocument();
  });

  it("ordenar por números começa do maior e o segundo clique inverte", async () => {
    render(<StatesTable states={states} />);
    await userEvent.click(header("Lula"));
    expect(names()).toEqual(["Bahia", "Amazonas", "Rio Grande do Sul", "São Paulo"]);
    expect(header("Lula").closest("th")).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(header("Lula"));
    expect(names()[0]).toBe("São Paulo");
  });

  it("filtra por região e por busca sem acento ou pela sigla", async () => {
    render(<StatesTable states={states} />);
    await userEvent.click(within(screen.getByRole("group", { name: "Filtrar por região" })).getByRole("button", { name: "Nordeste" }));
    expect(names()).toEqual(["Bahia"]);
    expect(screen.getByText("1 de 4")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Todas" }));
    await userEvent.type(screen.getByLabelText("Buscar estado"), "sao");
    expect(names()).toEqual(["São Paulo"]);
    await userEvent.clear(screen.getByLabelText("Buscar estado"));
    await userEvent.type(screen.getByLabelText("Buscar estado"), "rs");
    expect(names()).toEqual(["Rio Grande do Sul"]);
  });
});

describe("useMounted", () => {
  it("é true no navegador depois de montar", () => {
    expect(renderHook(() => useMounted()).result.current).toBe(true);
  });
});
