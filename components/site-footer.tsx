import Link from "next/link";
import type { ReactNode } from "react";
import { footerLinks, type FooterOptions } from "@/lib/legal";

const linkClass = "text-ink-2 underline-offset-4 hover:text-ink hover:underline";

type Props = FooterOptions & {
  /** Conteúdo antes dos links, como a marca e a nota sobre os dados. */
  children?: ReactNode;
};

/** Rodapé comum: Privacidade, Termos, Código e autor, conforme o que o projeto tem. */
export const SiteFooter = ({ children, ...options }: Props) => {
  const links = footerLinks(options);
  if (links.length === 0 && !children) return null;
  return (
    <footer className="border-t border-line bg-surface text-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-x-12 gap-y-6 px-4 py-10 sm:px-6">
        {children ? <div className="flex max-w-2xl flex-col gap-3">{children}</div> : null}
        {links.length > 0 ? (
          <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) =>
              link.external ? (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        ) : null}
      </div>
    </footer>
  );
};
