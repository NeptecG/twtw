import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title"), description: t("intro") };
}

const SECTIONS = [1, 2, 3, 4, 5] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <section className="container-page py-14 sm:py-20">
      <h1 className="text-4xl leading-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("intro")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("updated")}</p>

      <div className="mt-12 max-w-3xl space-y-10">
        {SECTIONS.map((i) => (
          <div key={i} className="border-t border-sea/25 pt-6">
            <h2 className="font-display text-2xl">{t(`s${i}Title`)}</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t(`s${i}Text`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
