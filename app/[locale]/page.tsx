import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Waves, Heart, CalendarCheck, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { listApartments } from "@/lib/apartments";
import { ApartmentCard } from "@/components/apartment-card";
import type { Locale } from "@/i18n/routing";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=80";
const LOCATION_IMAGE =
  "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1200&q=80";

const WHY = [
  { icon: Waves, key: 1 },
  { icon: Heart, key: 2 },
  { icon: CalendarCheck, key: 3 },
  { icon: Sparkles, key: 4 },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const apartments = await listApartments();
  const featured = apartments.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={HERO_IMAGE}
            alt="Naupaktos"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/75" />
        </div>

        <div className="container-wide flex min-h-[86vh] flex-col justify-end pb-20 pt-32 text-[#e6f3de]">
          <p className="eyebrow animate-fade-up text-[#e6f3de]/80">{t("heroKicker")}</p>
          <h1
            className="animate-fade-up mt-4 max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {t("heroTitle")}
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-[#e6f3de]/85"
            style={{ animationDelay: "160ms" }}
          >
            {t("heroSubtitle")}
          </p>
          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/apartments"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#379e86]"
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-[#e6f3de]/40 px-7 py-3.5 text-sm font-semibold text-[#e6f3de] transition-colors hover:bg-[#e6f3de]/10"
            >
              {t("secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">{t("featured")}</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{t("featuredSubtitle")}</h2>
          </div>
          <Link
            href="/apartments"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-sea"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((apartment, i) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              locale={locale as Locale}
              priority={i < 3}
            />
          ))}
        </div>
      </section>

      {/* Why stay */}
      <section className="bg-secondary/50">
        <div className="container-page py-20 sm:py-24">
          <p className="eyebrow">{t("whyTitle")}</p>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, key }) => (
              <div key={key}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sea/10 text-sea">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl">{t(`why${key}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`why${key}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="container-page py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
            <Image
              src={LOCATION_IMAGE}
              alt="Naupaktos"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="lg:pl-6">
            <p className="eyebrow">{t("heroKicker")}</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{t("locationTitle")}</h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {t("locationText")}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sea"
            >
              {t("secondaryCta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact band */}
      <section className="container-wide">
        <div className="relative overflow-hidden rounded-[2rem] bg-sea px-6 py-16 text-center text-sea-foreground sm:px-16 sm:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl">{t("contactCtaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sea-foreground/80">{t("contactCtaText")}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#379e86]"
          >
            {t("contactCtaButton")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
