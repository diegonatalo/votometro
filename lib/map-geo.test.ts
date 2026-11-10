import { describe, expect, it } from "vitest";
import { loadStatesTopo } from "@/lib/data";
import { BASE, buildStateShapes, featuresOf, makeProjection } from "@/lib/map-geo";
import { UFS } from "@/lib/meta";

const topo = loadStatesTopo();
const features = featuresOf(topo, "estados");

describe("featuresOf", () => {
  it("devolve uma feição para cada UF", () => {
    expect(features.map((f) => f.properties.id).sort()).toEqual(UFS.map((u) => u.uf).sort());
  });
});

describe("buildStateShapes", () => {
  const shapes = buildStateShapes(topo, makeProjection(features));

  it("gera um caminho SVG, limites e centróide para cada estado", () => {
    expect(shapes).toHaveLength(27);
    for (const shape of shapes) {
      expect(shape.d, shape.uf).toMatch(/^M/);
      expect(shape.bounds[1][0], shape.uf).toBeGreaterThan(shape.bounds[0][0]);
      expect(shape.bounds[1][1], shape.uf).toBeGreaterThan(shape.bounds[0][1]);
      expect(Number.isFinite(shape.centroid[0]) && Number.isFinite(shape.centroid[1]), shape.uf).toBe(true);
    }
  });

  it("o mapa cabe no quadrado de coordenadas base", () => {
    for (const shape of shapes) {
      expect(shape.bounds[0][0], shape.uf).toBeGreaterThanOrEqual(0);
      expect(shape.bounds[0][1], shape.uf).toBeGreaterThanOrEqual(0);
      expect(shape.bounds[1][0], shape.uf).toBeLessThanOrEqual(BASE);
      expect(shape.bounds[1][1], shape.uf).toBeLessThanOrEqual(BASE);
    }
  });

  it("o norte fica acima do sul: Roraima acima do Rio Grande do Sul", () => {
    const y = (uf: string) => shapes.find((s) => s.uf === uf)!.centroid[1];
    expect(y("RR")).toBeLessThan(y("RS"));
  });
});
