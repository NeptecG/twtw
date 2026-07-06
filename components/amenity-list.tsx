import {
  Wifi,
  Snowflake,
  Waves,
  Car,
  PawPrint,
  UtensilsCrossed,
  WashingMachine,
  Fence,
  Tv,
  Flame,
  Coffee,
  ChevronsUpDown,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { isAmenityKey, type AmenityKey } from "@/lib/amenities";

const ICONS: Record<AmenityKey, LucideIcon> = {
  wifi: Wifi,
  ac: Snowflake,
  sea_view: Waves,
  parking: Car,
  pets: PawPrint,
  kitchen: UtensilsCrossed,
  washer: WashingMachine,
  balcony: Fence,
  tv: Tv,
  heating: Flame,
  coffee: Coffee,
  elevator: ChevronsUpDown,
};

export function AmenityList({ amenities }: { amenities: string[] }) {
  const t = useTranslations("amenities");
  const keys = amenities.filter(isAmenityKey);

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
      {keys.map((key) => {
        const Icon = ICONS[key];
        return (
          <li key={key} className="flex items-center gap-3 text-sm text-foreground">
            <Icon className="h-5 w-5 shrink-0 text-sea" />
            <span>{t(key)}</span>
          </li>
        );
      })}
    </ul>
  );
}
