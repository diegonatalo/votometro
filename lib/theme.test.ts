import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseTheme, themeScript } from "@/lib/theme";

const KEY = "my-app:theme:v1";
const COLORS = { light: "#ffffff", dark: "#000000" };

const mockSystem = (dark: boolean) =>
  vi
    .spyOn(window, "matchMedia")
    .mockReturnValue({ matches: dark } as MediaQueryList);

const run = (script: string) => new Function(script)();
const isDark = () => document.documentElement.classList.contains("dark");

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  document.head.innerHTML = '<meta name="theme-color" content="">';
});
afterEach(() => vi.restoreAllMocks());

describe("parseTheme", () => {
  it("aceita só light e dark", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
    expect(parseTheme("blue")).toBeNull();
    expect(parseTheme(null)).toBeNull();
  });
});

describe("themeScript", () => {
  it("sem escolha salva, segue o sistema", () => {
    mockSystem(true);
    run(themeScript(KEY));
    expect(isDark()).toBe(true);
  });

  it("a escolha salva vence o sistema", () => {
    mockSystem(true);
    localStorage.setItem(KEY, "light");
    run(themeScript(KEY));
    expect(isDark()).toBe(false);
  });

  it("ajusta a cor da barra quando recebe as cores", () => {
    localStorage.setItem(KEY, "dark");
    run(themeScript(KEY, COLORS));
    expect(document.querySelector("meta")).toHaveAttribute("content", "#000000");
  });

  it("não quebra a página se o armazenamento estiver bloqueado", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("bloqueado", "SecurityError");
    });
    expect(() => run(themeScript(KEY))).not.toThrow();
  });
});
