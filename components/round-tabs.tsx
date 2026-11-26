"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tab = { id: string; label: string; content: ReactNode };

/** Abas acessíveis (setas, Home e End) para alternar entre recortes, como Brasil e Exterior. */
export const RoundTabs = ({ tabs, label, aside }: { tabs: Tab[]; label: string; aside?: ReactNode }) => {
  const base = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focus = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: tabs.length - 1 };
    const to = moves[e.key];
    if (to === undefined) return;
    e.preventDefault();
    focus(to);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div role="tablist" aria-label={label} className="inline-flex rounded-full bg-surface-2 p-1">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => { refs.current[i] = el; }}
              id={`${base}-${t.id}-tab`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${base}-${t.id}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
              className={cn(
                "cursor-pointer rounded-full px-4.5 py-2.5 text-sm",
                i === active ? "bg-surface font-bold text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]" : "font-semibold text-ink-2 hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {aside}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} id={`${base}-${t.id}-panel`} role="tabpanel" aria-labelledby={`${base}-${t.id}-tab`} hidden={i !== active}>
          {t.content}
        </div>
      ))}
    </div>
  );
};
