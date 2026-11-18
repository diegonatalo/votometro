import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorScreen } from "@/components/error-screen";

describe("ErrorScreen", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registra o erro no console", () => {
    const error = new Error("falhou");
    render(<ErrorScreen error={error} retry={() => {}} />);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("tenta de novo ao clicar no botão", async () => {
    const retry = vi.fn();
    render(<ErrorScreen error={new Error("falhou")} retry={retry} />);
    await userEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("leva de volta para o início", () => {
    render(<ErrorScreen error={new Error("falhou")} retry={() => {}} />);
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/");
  });
});
