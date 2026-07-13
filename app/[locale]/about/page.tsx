import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Anchor, Castle, Umbrella, UtensilsCrossed, Mountain, Sunset } from "lucide-react";
import { LocationMap } from "@/components/location-map";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("intro") };
}

const AREA_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

const THINGS = [
  { icon: Anchor, key: 1 },
  { icon: Castle, key: 2 },
  { icon: Umbrella, key: 3 },
  { icon: UtensilsCrossed, key: 4 },
  { icon: Mountain, key: 5 },
  { icon: Sunset, key: 6 },
] as const;

const DESTINATIONS = [1, 2, 3, 4] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="pb-10">
      {/* Intro */}
      <section className="container-page py-14 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl leading-tight sm:text-5xl">{t("title")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src={AREA_IMAGE}
              alt="Naupaktos"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Things to do */}
      <section className="bg-secondary/50">
        <div className="container-page py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl">{t("thingsToDoTitle")}</h2>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {THINGS.map(({ icon: Icon, key }) => (
              <div key={key} className="border-t border-sea/25 pt-6">
                <h3 className="flex items-center gap-2.5 font-display text-2xl">
                  <Icon className="h-5 w-5 text-sea" aria-hidden />
                  {t(`thing${key}Title`)}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t(`thing${key}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting here */}
      <section className="container-page py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl">{t("gettingHereTitle")}</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          {t("gettingHereText")}
        </p>
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {DESTINATIONS.map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-3xl text-sea">{t(`dest${i}Time`)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t(`dest${i}Place`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="container-page pb-16 sm:pb-20">
        <h2 className="text-2xl">{t("mapTitle")}</h2>
        <div className="mt-5">
          <LocationMap locale={locale} title="Naupaktos map" className="h-[380px] rounded-3xl" />
        </div>
      </section>
    </div>
  );
}
