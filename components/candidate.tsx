import { CANDIDATES } from "@/lib/meta";
import type { Candidate, Person } from "@/types";

/** Nome de exibição com acentuação correta (os arquivos do TSE vêm sem acento). */
export const displayName = (c: Pick<Candidate, "id">): string => CANDIDATES[c.id].name;

/** Número do candidato em caixas, como no visor da urna. */
export const NumberBoxes = ({ number, size = "md" }: { number: string; size?: "sm" | "md" }) => {
  const dim = size === "sm" ? "h-7 w-[1.4rem] text-[0.95rem]" : "h-10 w-8 text-xl";
  return (
    <span className="inline-flex gap-[3px]" role="img" aria-label={`Número ${number}`}>
      {number.split("").map((d, i) => (
        <span key={i} className={`font-data inline-flex items-center justify-center rounded-[5px] border-[1.5px] border-ink font-semibold text-ink ${dim}`}>
          {d}
        </span>
      ))}
    </span>
  );
};

/** Sigla do partido (o TSE não publica logos). */
export const PartyBadge = ({ sigla, title }: { sigla: string; title?: string }) => {
  return (
    <abbr title={title} className="font-bold text-ink no-underline">
      {sigla}
    </abbr>
  );
};

/** Foto do arquivo do TSE, redonda, com anel na cor do candidato. */
export const Photo = ({ person, tone, size = 84 }: { person: Pick<Person, "photo" | "ballotName">; tone?: "lula" | "flavio"; size?: number }) => {
  return (
    <span
      className="inline-block shrink-0 rounded-full p-[3px]"
      style={{ width: size, height: size, background: tone ? `var(--${tone})` : "var(--line)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={person.photo}
        alt={`Foto de ${person.ballotName}`}
        width={size - 6}
        height={size - 6}
        loading="lazy"
        decoding="async"
        className="h-full w-full rounded-full border-2 border-surface bg-surface-2 object-cover object-top"
      />
    </span>
  );
};

/** Foto pequena redonda, para listas e painéis. */
export const Avatar = ({ c }: { c: Pick<Candidate, "id" | "photo" | "ballotName"> }) => {
  return (
    <span className="relative inline-block h-8 w-8 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: `var(--${c.id})` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.photo} alt="" width={32} height={32} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
    </span>
  );
};
