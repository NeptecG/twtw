import Image from "next/image";
import { useTranslations } from "next-intl";
import { Waves, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Apartment } from "@/lib/db/schema";
import type { Locale } from "@/i18n/routing";

export function ApartmentCard({
  apartment,
  locale,
  priority = false,
}: {
  apartment: Apartment;
  locale: Locale;
  priority?: boolean;
}) {
  const t = useTranslations("apartment");
  const title = locale === "el" ? apartment.titleEl : apartment.titleEn;
  const price = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(apartment.pricePerNight));

  return (
    <Link
      href={`/apartments/${apartment.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(18,59,73,0.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={apartment.photos[0]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          priority={priority}
        />
        {apartment.seaView && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sea/90 px-2.5 py-1 text-xs font-semibold text-sea-foreground backdrop-blur">
            <Waves className="h-3.5 w-3.5" />
            {t("seaView")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-ink">{title}</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{apartment.areaLabel}</p>

        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{t("guestsLabel", { count: apartment.capacity })}</span>
        </div>

        <div className="mt-auto flex items-baseline gap-1 pt-5">
          <span className="text-lg font-semibold text-sea">{price}</span>
          <span className="text-sm text-muted-foreground">{t("perNight")}</span>
        </div>
      </div>
    </Link>
  );
}
