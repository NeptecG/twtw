import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ContactLink } from "@/components/contact-link";
import { BrandIcon } from "@/components/brand-icon";
import { LocationMap } from "@/components/location-map";

const PHONE_INTL = "302634000000";

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

  const details = [
    { icon: Phone, kind: "phone" as const, label: t("phone"), value: "+30 26340 00000", href: "tel:+302634000000" },
    { icon: Mail, kind: "email" as const, label: t("email"), value: "hello@ether-naupaktos.gr", href: "mailto:hello@ether-naupaktos.gr" },
    { icon: MapPin, kind: undefined, label: t("address"), value: "Naupaktos 303 00, Greece", href: undefined },
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
          <ul className="space-y-5">
            {details.map((d) => (
              <li key={d.label} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sea/10 text-sea">
                  <d.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {d.label}
                  </p>
                  {d.href && d.kind ? (
                    <ContactLink
                      kind={d.kind}
                      value={d.value}
                      href={d.href}
                      className="text-lg text-foreground transition-colors hover:text-sea"
                    >
                      {d.value}
                    </ContactLink>
                  ) : (
                    <p className="text-lg text-foreground">{d.value}</p>
                  )}
                </div>
              </li>
            ))}
            <li className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sea/10 text-sea">
                <BrandIcon name="whatsapp" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  WhatsApp
                </p>
                <a
                  href={`https://wa.me/${PHONE_INTL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-foreground transition-colors hover:text-sea"
                >
                  +30 26340 00000
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sea/10 text-sea">
                <BrandIcon name="viber" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Viber</p>
                <ContactLink
                  kind="phone"
                  label="Viber"
                  value="+30 26340 00000"
                  href={`viber://chat?number=%2B${PHONE_INTL}`}
                  className="text-lg text-foreground transition-colors hover:text-sea"
                >
                  +30 26340 00000
                </ContactLink>
              </div>
            </li>
          </ul>

          <LocationMap locale={locale} title="Naupaktos map" className="h-[300px] rounded-3xl" />
        </div>
      </div>
    </section>
  );
}
