import type { SourceMeta } from "@/types";

export const SourceNote = ({ meta, extra }: { meta: SourceMeta; extra?: string }) => {
  return (
    <p className="font-data mt-6 border-t border-line pt-3 text-xs leading-relaxed text-ink-3">
      Fonte:{" "}
      <a href={meta.url} className="underline decoration-line underline-offset-2 hover:text-ink" target="_blank" rel="noreferrer">
        TSE
      </a>{" "}
      · {meta.source.replace(/^TSE\s+—\s+/, "")} · referência: {meta.reference}
      {extra ? ` · ${extra}` : ""}
    </p>
  );
};
