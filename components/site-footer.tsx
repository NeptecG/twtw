import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NAV = [
  { key: "nav.home", href: "/" },
  { key: "nav.apartments", href: "/apartments" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
] as const;

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-sea text-sea-foreground">
      <div className="container-wide grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-semibold tracking-tight">TWTW</span>
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sea-foreground/70">
            {t("footer.tagline")}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-sea-foreground/50">
            {t("contact.address")}
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-sea-foreground/60">{t("footer.quickLinks")}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-sea-foreground/80 transition-colors hover:text-sea-foreground"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-sea-foreground/60">{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-sea-foreground/80">
            <li>
              <a href="tel:+302634000000" className="transition-colors hover:text-sea-foreground">
                +30 26340 00000
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@twtw-naupaktos.gr"
                className="transition-colors hover:text-sea-foreground"
              >
                hello@twtw-naupaktos.gr
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sea-foreground/15">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 text-xs text-sea-foreground/50 sm:flex-row">
          <span>
            © {year} TWTW Naupaktos. {t("footer.rights")}
          </span>
          <span>Naupaktos · Greece</span>
        </div>
      </div>
    </footer>
  );
}
