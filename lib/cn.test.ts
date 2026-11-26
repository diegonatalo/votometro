import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("junta as classes com espaço", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignora valores falsos", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });
});
