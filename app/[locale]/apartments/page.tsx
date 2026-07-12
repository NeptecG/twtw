import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { listApartments, type ApartmentFilters as Filters } from "@/lib/apartments";
import { ApartmentCard } from "@/components/apartment-card";
import { ApartmentFilters } from "@/components/apartment-filters";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("apartments") };
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function parseFilters(sp: SearchParams): Filters {
  const guests = Number(first(sp.guests));
  const maxPrice = Number(first(sp.maxPrice));
  const amenities = (first(sp.amenities) ?? "").split(",").filter(Boolean);
  return {
    guests: Number.isFinite(guests) && guests > 0 ? guests : undefined,
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    seaView: first(sp.seaView) === "1" || undefined,
    amenities: amenities.length ? amenities : undefined,
    q: first(sp.q)?.trim() || undefined,
  };
}

export default async function ApartmentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("filters");
  const tNav = await getTranslations("nav");
  const tMeta = await getTranslations("meta");

  const apartments = await listApartments(parseFilters(sp));

  return (
    <section className="container-page py-14 sm:py-20">
      <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{tNav("apartments")}</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
        {tMeta("defaultDescription")}
      </p>

      <div className="mt-10">
        <Suspense fallback={<div className="h-40 rounded-2xl border border-border bg-card/50" />}>
          <ApartmentFilters />
        </Suspense>
      </div>

      <p className="mt-8 text-sm font-medium text-muted-foreground">
        {t("results", { count: apartments.length })}
      </p>

      {apartments.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apartments.map((apartment, i) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              locale={locale as Locale}
              priority={i < 3}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center">
          <p className="font-display text-2xl text-ink">{t("noResults")}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("noResultsHint")}</p>
        </div>
      )}
    </section>
  );
}
