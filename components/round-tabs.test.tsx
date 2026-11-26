import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RoundTabs } from "@/components/round-tabs";

const tabs = [
  { id: "brasil", label: "Brasil", content: <p>Tabela do Brasil</p> },
  { id: "exterior", label: "Exterior", content: <p>Tabela do exterior</p> },
];

describe("RoundTabs", () => {
  it("mostra só a primeira aba no início", () => {
    render(<RoundTabs tabs={tabs} label="Recorte" />);
    expect(screen.getByRole("tab", { name: "Brasil" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Tabela do Brasil")).toBeVisible();
    expect(screen.queryByText("Tabela do exterior")).not.toBeVisible();
  });

  it("troca de aba ao clicar", async () => {
    render(<RoundTabs tabs={tabs} label="Recorte" />);
    await userEvent.click(screen.getByRole("tab", { name: "Exterior" }));
    expect(screen.getByText("Tabela do exterior")).toBeVisible();
    expect(screen.queryByText("Tabela do Brasil")).not.toBeVisible();
  });

  it("anda entre as abas com as setas", async () => {
    render(<RoundTabs tabs={tabs} label="Recorte" />);
    screen.getByRole("tab", { name: "Brasil" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Exterior" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Exterior" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Brasil" })).toHaveFocus();
  });
});
