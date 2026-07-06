import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Anchor, Castle, Umbrella, Mountain } from "lucide-react";

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
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80";

const THINGS = [
  { icon: Anchor, key: 1 },
  { icon: Castle, key: 2 },
  { icon: Umbrella, key: 3 },
  { icon: Mountain, key: 4 },
] as const;

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
            <p className="eyebrow">Naupaktos · Greece</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{t("title")}</h1>
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
              <div key={key} className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sea/10 text-sea">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl">{t(`thing${key}Title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`thing${key}Text`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="container-page py-16 sm:py-20">
        <h2 className="text-2xl">{t("mapTitle")}</h2>
        <div className="mt-5 overflow-hidden rounded-3xl border border-border">
          <iframe
            title="Naupaktos map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=21.808%2C38.383%2C21.848%2C38.403&layer=mapnik&marker=38.393%2C21.828"
            loading="lazy"
            className="h-[380px] w-full"
          />
        </div>
      </section>
    </div>
  );
}
