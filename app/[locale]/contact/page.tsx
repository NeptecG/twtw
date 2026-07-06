import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

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
    { icon: Phone, label: t("phone"), value: "+30 26340 00000", href: "tel:+302634000000" },
    { icon: Mail, label: t("email"), value: "hello@twtw-naupaktos.gr", href: "mailto:hello@twtw-naupaktos.gr" },
    { icon: MapPin, label: t("address"), value: "Naupaktos 303 00, Greece", href: undefined },
  ];

  return (
    <section className="container-page py-14 sm:py-20">
      <p className="eyebrow">Naupaktos · Greece</p>
      <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{t("title")}</h1>
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
                  {d.href ? (
                    <a
                      href={d.href}
                      className="text-lg text-foreground transition-colors hover:text-sea"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="text-lg text-foreground">{d.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="overflow-hidden rounded-3xl border border-border">
            <iframe
              title="Naupaktos map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=21.808%2C38.383%2C21.848%2C38.403&layer=mapnik&marker=38.393%2C21.828"
              loading="lazy"
              className="h-[300px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
