import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/hooks/use-theme";

const KEY = "my-app:theme:v1";
const COLORS = { light: "#ffffff", dark: "#000000" };

const isDark = () => document.documentElement.classList.contains("dark");

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  document.head.innerHTML = '<meta name="theme-color" content="">';
});
afterEach(() => vi.restoreAllMocks());

describe("useTheme", () => {
  it("lê o tema aplicado pelo script e não grava nada ao abrir", () => {
    document.documentElement.classList.add("dark");
    const { result } = renderHook(() => useTheme(KEY));
    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("alterna aplicando a classe, a cor da barra e gravando a escolha", () => {
    const { result } = renderHook(() => useTheme(KEY, COLORS));
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("dark");
    expect(isDark()).toBe(true);
    expect(localStorage.getItem(KEY)).toBe("dark");
    expect(document.querySelector("meta")).toHaveAttribute("content", "#000000");
  });

  it("mantém instâncias diferentes sincronizadas", () => {
    const a = renderHook(() => useTheme(KEY));
    const b = renderHook(() => useTheme(KEY));
    act(() => a.result.current.setTheme("dark"));
    expect(b.result.current.theme).toBe("dark");
  });

  it("sem escolha salva, acompanha a mudança do sistema", () => {
    let onSystemChange = () => {};
    const media = {
      matches: false,
      addEventListener: (_: string, listener: () => void) => {
        onSystemChange = listener;
      },
      removeEventListener: () => {},
    };
    vi.spyOn(window, "matchMedia").mockReturnValue(
      media as unknown as MediaQueryList,
    );
    const { result } = renderHook(() => useTheme(KEY));
    media.matches = true;
    act(() => onSystemChange());
    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("com escolha salva, ignora a mudança do sistema", () => {
    let onSystemChange = () => {};
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: (_: string, listener: () => void) => {
        onSystemChange = listener;
      },
      removeEventListener: () => {},
    } as unknown as MediaQueryList);
    localStorage.setItem(KEY, "light");
    const { result } = renderHook(() => useTheme(KEY));
    act(() => onSystemChange());
    expect(result.current.theme).toBe("light");
  });

  it("aplica a escolha feita em outra aba", () => {
    const { result } = renderHook(() => useTheme(KEY));
    localStorage.setItem(KEY, "dark");
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    });
    expect(result.current.theme).toBe("dark");
  });
});
