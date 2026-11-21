import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS } from "@/lib/security-headers";

const all = Object.fromEntries(
  SECURITY_HEADERS.flatMap((rule) => rule.headers.map((h) => [h.key, h.value])),
);

describe("SECURITY_HEADERS", () => {
  it("valem para todas as rotas", () => {
    expect(SECURITY_HEADERS.map((rule) => rule.source)).toEqual(["/:path*"]);
  });

  it("impedem abrir o site dentro de um iframe", () => {
    expect(all["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(all["X-Frame-Options"]).toBe("DENY");
  });

  it("não restringem scripts, que o Next e o tema injetam inline", () => {
    expect(all["Content-Security-Policy"]).not.toMatch(/script-src|default-src/);
  });

  it("trazem nosniff e uma política de referrer", () => {
    expect(all["X-Content-Type-Options"]).toBe("nosniff");
    expect(all["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });
});
