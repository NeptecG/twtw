import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Users, BedDouble, Bath, Ruler, Waves, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getApartmentBySlug, getApartmentAvailability } from "@/lib/apartments";
import { PhotoGallery } from "@/components/photo-gallery";
import { AmenityList } from "@/components/amenity-list";
import { BookingRequestForm } from "@/components/booking-request-form";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const apartment = await getApartmentBySlug(slug);
  if (!apartment) return {};
  const title = locale === "el" ? apartment.titleEl : apartment.titleEn;
  const description = locale === "el" ? apartment.descriptionEl : apartment.descriptionEn;
  return {
    title,
    description,
    openGraph: { title, description, images: apartment.photos.slice(0, 1) },
  };
}

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const apartment = await getApartmentBySlug(slug);
  if (!apartment) notFound();

  const t = await getTranslations("apartment");
  const availability = await getApartmentAvailability(apartment.id);
  const isEl = (locale as Locale) === "el";
  const title = isEl ? apartment.titleEl : apartment.titleEn;
  const description = isEl ? apartment.descriptionEl : apartment.descriptionEn;

  const lat = Number(apartment.lat ?? 38.393);
  const lng = Number(apartment.lng ?? 21.828);
  const d = 0.008;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;

  const facts = [
    { icon: Users, label: t("guestsLabel", { count: apartment.capacity }) },
    { icon: BedDouble, label: t("bedrooms", { count: apartment.bedrooms }) },
    { icon: Bath, label: t("bathrooms", { count: apartment.bathrooms }) },
    ...(apartment.sizeSqm
      ? [{ icon: Ruler, label: t("size", { count: apartment.sizeSqm }) }]
      : []),
  ];

  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/apartments"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {apartment.areaLabel}
          </p>
        </div>
        {apartment.seaView && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sea/10 px-3 py-1.5 text-sm font-semibold text-sea">
            <Waves className="h-4 w-4" />
            {t("seaView")}
          </span>
        )}
      </div>

      <div className="mt-8">
        <PhotoGallery photos={apartment.photos} alt={title} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-6">
            {facts.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <f.icon className="h-5 w-5 text-sea" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <section className="mt-10">
            <h2 className="text-2xl">{t("description")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl">{t("amenities")}</h2>
            <div className="mt-5">
              <AmenityList amenities={apartment.amenities} />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl">{t("location")}</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <iframe
                title={`${title} — map`}
                src={mapSrc}
                loading="lazy"
                className="h-[320px] w-full"
              />
            </div>
          </section>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_50px_-30px_rgba(18,59,73,0.55)]">
              <BookingRequestForm
                apartmentId={apartment.id}
                maxGuests={apartment.capacity}
                pricePerNight={apartment.pricePerNight}
                blocks={availability.blocks}
                confirmed={availability.confirmed}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
