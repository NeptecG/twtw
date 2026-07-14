import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ContactLink } from "@/components/contact-link";
import { ContactIcon } from "@/components/contact-icons";
import { BrandIcon } from "@/components/brand-icon";
import { phoneDisplay } from "@/lib/phone";

// Placeholders: swap for the real numbers/profiles when the owner provides them.
const PHONE_LOCAL = "26340 00000";
const PHONE_INTL = "302634000000";
const MOBILE_LOCAL = "690 000 0000";
const MOBILE_INTL = "306900000000";
const INSTAGRAM_URL = "https://www.instagram.com/ethernaupaktos";
const FACEBOOK_URL = "https://www.facebook.com/ethernaupaktos";
const MESSENGER_URL = "https://m.me/ethernaupaktos";

const SOCIAL_CHIP =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-sea-foreground/15 bg-sea-foreground/5 text-sea-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta hover:bg-terracotta hover:text-primary-foreground";

const NAV = [
  { key: "nav.home", href: "/" },
  { key: "nav.apartments", href: "/apartments" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
] as const;

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();
  const phoneDisp = phoneDisplay(PHONE_LOCAL, locale);
  const mobileDisp = phoneDisplay(MOBILE_LOCAL, locale);

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
                  className="nav-underline inline-block text-sea-foreground/85 transition-colors duration-200 hover:text-terracotta"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/faq"
                className="nav-underline inline-block text-sea-foreground/85 transition-colors duration-200 hover:text-terracotta"
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
                value={phoneDisp}
                href={`tel:+${PHONE_INTL}`}
                className="nav-underline inline-flex items-center gap-2.5 text-sea-foreground/85 transition-colors duration-200 hover:text-terracotta"
              >
                <ContactIcon name="phone" className="h-4 w-4 text-terracotta" />
                {phoneDisp}
              </ContactLink>
            </li>
            <li>
              <ContactLink
                kind="phone"
                label={t("contact.mobile")}
                value={mobileDisp}
                href={`tel:+${MOBILE_INTL}`}
                className="nav-underline inline-flex items-center gap-2.5 text-sea-foreground/85 transition-colors duration-200 hover:text-terracotta"
              >
                <ContactIcon name="mobile" className="h-4 w-4 text-terracotta" />
                {mobileDisp}
              </ContactLink>
            </li>
            <li>
              <ContactLink
                kind="email"
                value="hello@ether-naupaktos.gr"
                href="mailto:hello@ether-naupaktos.gr"
                className="nav-underline inline-flex items-center gap-2.5 text-sea-foreground/85 transition-colors duration-200 hover:text-terracotta"
              >
                <ContactIcon name="email" className="h-4 w-4 text-terracotta" />
                hello@ether-naupaktos.gr
              </ContactLink>
            </li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={SOCIAL_CHIP}
            >
              <ContactIcon name="instagram" />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={SOCIAL_CHIP}
            >
              <ContactIcon name="facebook" />
            </a>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Messenger"
              className={SOCIAL_CHIP}
            >
              <ContactIcon name="messenger" />
            </a>
            <ContactLink
              kind="phone"
              label="Viber"
              ariaLabel="Viber"
              value={phoneDisp}
              href={`viber://chat?number=%2B${PHONE_INTL}`}
              className={SOCIAL_CHIP}
            >
              <ContactIcon name="viber" />
            </ContactLink>
            <a
              href={`https://wa.me/${PHONE_INTL}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={SOCIAL_CHIP}
            >
              <BrandIcon name="whatsapp" className="h-5 w-5" />
            </a>
          </div>
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
