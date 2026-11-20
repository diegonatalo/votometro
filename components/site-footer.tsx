import Link from "next/link";
import { footerLinks, type FooterOptions } from "@/lib/legal";

const linkClass = "opacity-75 underline-offset-4 hover:underline hover:opacity-100";

/** Rodapé comum: Privacidade, Termos, Código e autor, conforme o que o projeto tem. */
export const SiteFooter = (props: FooterOptions) => {
  const links = footerLinks(props);
  if (links.length === 0) return null;
  return (
    <footer className="border-t border-current/15 px-6 py-6 text-sm">
      <nav aria-label="Rodapé" className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2">
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
    </footer>
  );
};
