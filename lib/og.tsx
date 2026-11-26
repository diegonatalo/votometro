import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { colorForPctLula } from "./colors";
import { fmtPct } from "./format";
import { loadNational, loadStates, loadStatesTopo } from "./data";
import { BASE, buildStateShapes, featuresOf, makeProjection } from "./map-geo";
import { validPct } from "./stats";

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#111318";
const INK_2 = "#474c56";
const PAPER = "#f6f5f1";
const LULA = "#c2321d";
const FLAVIO = "#1f45a8";

/** As mesmas fontes do site, em WOFF (o gerador de imagens não lê WOFF2). */
const font = (pkg: string, file: string) => readFileSync(path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

const FONTS = [
  { name: "Schibsted Grotesk", data: font("schibsted-grotesk", "schibsted-grotesk-latin-700-normal.woff"), weight: 700 as const, style: "normal" as const },
  { name: "Schibsted Grotesk", data: font("schibsted-grotesk", "schibsted-grotesk-latin-800-normal.woff"), weight: 800 as const, style: "normal" as const },
  { name: "Newsreader", data: font("newsreader", "newsreader-latin-500-normal.woff"), weight: 500 as const, style: "normal" as const },
  { name: "IBM Plex Mono", data: font("ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
];

/** Imagem de compartilhamento: percentuais e mapa lidos dos dados, dois lados com o mesmo tratamento. */
export function renderOg() {
  const d = loadNational();
  const p = validPct(d.national);
  const topo = loadStatesTopo();
  const states = new Map(loadStates().states.map((s) => [s.uf, s]));
  const shapes = buildStateShapes(topo, makeProjection(featuresOf(topo, "estados")));
  const sides = [
    { name: "Lula", pct: p.lula, color: LULA },
    { name: "Flávio Bolsonaro", pct: p.flavio, color: FLAVIO },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: "56px 56px 56px 64px", gap: 32, background: PAPER, color: INK, fontFamily: "Schibsted Grotesk" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {/* "vot" + o "ô" desenhado + "metro"; o anel se apoia na linha de base do texto */}
            <div style={{ display: "flex", alignItems: "flex-end", fontSize: 50, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
              <span>vot</span>
              <svg width="30" height="50" viewBox="0 0 60 100" style={{ margin: "0 1px 7px 1px" }}>
                <path d="M12 36 L30 13" fill="none" stroke={LULA} strokeWidth="11" strokeLinecap="round" />
                <path d="M30 13 L48 36" fill="none" stroke={FLAVIO} strokeWidth="11" strokeLinecap="round" />
                <circle cx="30" cy="72.5" r="20.5" fill="none" stroke={INK} strokeWidth="13" />
              </svg>
              <span>metro</span>
            </div>
            <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 19, letterSpacing: 2.4, textTransform: "uppercase", color: INK_2 }}>
              Presidente · 2º turno · 25 out 2026
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", gap: 40 }}>
              {sides.map((s) => (
                <div key={s.name} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontFamily: "Newsreader", fontSize: 92, fontWeight: 500, color: s.color, lineHeight: 1, letterSpacing: -3 }}>{fmtPct(s.pct)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", position: "relative", height: 36, alignItems: "center" }}>
              <div style={{ display: "flex", width: "100%", height: 16, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${p.lula}%`, background: LULA, marginRight: 3 }} />
                <div style={{ flex: 1, background: FLAVIO }} />
              </div>
              <div style={{ position: "absolute", left: "50%", top: 0, width: 3, height: 36, marginLeft: -1.5, background: INK }} />
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 17, color: INK_2 }}>Votos válidos · TSE · referência {d.meta.reference}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 400 }}>
          <svg width="400" height="400" viewBox={`0 0 ${BASE} ${BASE}`}>
            {shapes.map((sh) => {
              const s = states.get(sh.uf);
              return <path key={sh.uf} d={sh.d} fill={s ? colorForPctLula(validPct(s).lula, "light") : "#dcd9d1"} stroke={PAPER} strokeWidth="2.5" strokeLinejoin="round" />;
            })}
          </svg>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: FONTS },
  );
}
