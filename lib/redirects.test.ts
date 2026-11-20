import { describe, expect, it } from "vitest";
import { REDIRECTS } from "@/lib/redirects";

describe("REDIRECTS", () => {
  it("são permanentes e levam a uma rota interna", () => {
    for (const redirect of REDIRECTS) {
      expect(redirect.permanent, redirect.source).toBe(true);
      expect(redirect.source.startsWith("/"), redirect.source).toBe(true);
      expect(redirect.destination.startsWith("/"), redirect.destination).toBe(true);
    }
  });

  it("não repetem a origem nem apontam para si mesmos", () => {
    const sources = REDIRECTS.map((redirect) => redirect.source);
    expect(new Set(sources).size).toBe(sources.length);
    for (const redirect of REDIRECTS) expect(redirect.destination).not.toBe(redirect.source);
  });
});
