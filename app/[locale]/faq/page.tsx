import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title"), description: t("intro") };
}

const QUESTIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <section className="container-page py-14 sm:py-20">
      <h1 className="text-4xl leading-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("intro")}</p>

      <div className="mt-12 max-w-3xl">
        {QUESTIONS.map((i) => (
          <details
            key={i}
            className="group border-t border-sea/25 py-5 last:border-b"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
              {t(`q${i}`)}
              <ChevronDown className="h-5 w-5 shrink-0 text-sea transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t(`a${i}`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
