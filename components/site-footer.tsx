import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ContactLink } from "@/components/contact-link";
import { BrandIcon } from "@/components/brand-icon";

const PHONE_DISPLAY = "+30 26340 00000";
const PHONE_INTL = "302634000000";

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
          <div className="flex items-center gap-3">
            <Image src="/logo-mark.png" alt="" width={44} height={44} className="h-11 w-11" />
            <div className="flex flex-col">
              <span className="font-display text-3xl font-semibold leading-none tracking-tight">
                Ether
              </span>
              <span className="mt-1 font-display text-sm italic text-sea-foreground/90">
                {t("footer.motto")}
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sea-foreground/90">
            {t("footer.tagline")}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-sea-foreground/80">
            {t("contact.address")}
          </p>
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sea-foreground/90">
            {t("footer.quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-sea-foreground/95 transition-colors hover:text-sea-foreground"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/faq"
                className="text-sea-foreground/95 transition-colors hover:text-sea-foreground"
              >
                {t("footer.faq")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sea-foreground/90">
            {t("footer.contact")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-sea-foreground/95">
            <li>
              <ContactLink
                kind="phone"
                value={PHONE_DISPLAY}
                href={`tel:+${PHONE_INTL}`}
                className="transition-colors hover:text-sea-foreground"
              >
                {PHONE_DISPLAY}
              </ContactLink>
            </li>
            <li>
              <a
                href={`https://wa.me/${PHONE_INTL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-sea-foreground"
              >
                <BrandIcon name="whatsapp" />
                WhatsApp
              </a>
            </li>
            <li>
              <ContactLink
                kind="phone"
                label="Viber"
                value={PHONE_DISPLAY}
                href={`viber://chat?number=%2B${PHONE_INTL}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-sea-foreground"
              >
                <BrandIcon name="viber" />
                Viber
              </ContactLink>
            </li>
            <li>
              <ContactLink
                kind="email"
                value="hello@ether-naupaktos.gr"
                href="mailto:hello@ether-naupaktos.gr"
                className="transition-colors hover:text-sea-foreground"
              >
                hello@ether-naupaktos.gr
              </ContactLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sea-foreground/15">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 text-xs text-sea-foreground/80 sm:flex-row">
          <span>
            © {year} Ether Naupaktos. {t("footer.rights")}
          </span>
          <span>Naupaktos · Greece</span>
        </div>
      </div>
    </footer>
  );
}
