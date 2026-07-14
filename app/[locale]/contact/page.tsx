import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ContactLink } from "@/components/contact-link";
import { ContactIcon } from "@/components/contact-icons";
import { BrandIcon } from "@/components/brand-icon";
import { LocationMap } from "@/components/location-map";
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
  "flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-sea transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta hover:bg-terracotta hover:text-primary-foreground";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("intro") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const phoneDisp = phoneDisplay(PHONE_LOCAL, locale);
  const mobileDisp = phoneDisplay(MOBILE_LOCAL, locale);

  const details = [
    { iconName: "phone" as const, kind: "phone" as const, label: t("phone"), value: phoneDisp, href: `tel:+${PHONE_INTL}` },
    { iconName: "mobile" as const, kind: "phone" as const, label: t("mobile"), value: mobileDisp, href: `tel:+${MOBILE_INTL}` },
    { iconName: "email" as const, kind: "email" as const, label: t("email"), value: "hello@ether-naupaktos.gr", href: "mailto:hello@ether-naupaktos.gr" },
  ];

  return (
    <section className="container-page py-14 sm:py-20">
      <h1 className="text-4xl leading-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("intro")}</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <ContactForm />
        </div>

        <div className="space-y-8">
          <ul className="space-y-3">
            {details.map((d) => (
              <li key={d.label}>
                <ContactLink
                  kind={d.kind}
                  value={d.value}
                  href={d.href}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta hover:shadow-[0_14px_34px_-20px_rgba(24,72,58,0.45)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sea/10 text-sea transition-colors duration-200 group-hover:bg-terracotta group-hover:text-primary-foreground">
                    <ContactIcon name={d.iconName} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {d.label}
                    </p>
                    <p className="truncate text-lg text-foreground transition-colors duration-200 group-hover:text-terracotta">
                      {d.value}
                    </p>
                  </div>
                </ContactLink>
              </li>
            ))}
            <li className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sea/10 text-sea">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {t("address")}
                </p>
                <p className="truncate text-lg text-foreground">Naupaktos 303 00, Greece</p>
              </div>
            </li>
          </ul>

          <div className="flex flex-wrap gap-3">
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

          <LocationMap locale={locale} title="Naupaktos map" className="h-[300px] rounded-3xl" />
        </div>
      </div>
    </section>
  );
}
