"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Waves, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AMENITY_CHIPS = ["wifi", "ac", "parking", "pets", "kitchen", "balcony"] as const;
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
const PRICE_OPTIONS = [80, 100, 120, 160] as const;

export function ApartmentFilters() {
  const t = useTranslations("filters");
  const tForm = useTranslations("form");
  const tAmenity = useTranslations("amenities");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search input is locally controlled and debounced into the URL.
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const guests = searchParams.get("guests") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const seaView = searchParams.get("seaView") === "1";
  const amenities = (searchParams.get("amenities") ?? "").split(",").filter(Boolean);
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const today = new Date().toISOString().slice(0, 10);

  const hasFilters =
    !!guests ||
    !!maxPrice ||
    seaView ||
    amenities.length > 0 ||
    !!searchParams.get("q") ||
    !!checkIn ||
    !!checkOut;

  function update(mutate: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    mutate(params);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function setParam(key: string, value: string | null) {
    update((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });
  }

  function toggleAmenity(key: string) {
    const next = amenities.includes(key)
      ? amenities.filter((a) => a !== key)
      : [...amenities, key];
    setParam("amenities", next.length ? next.join(",") : null);
  }

  function clearAll() {
    setSearch("");
    router.push(pathname, { scroll: false });
  }

  // Debounce the search box into the URL.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (search === current) return;
    const id = setTimeout(() => setParam("q", search.trim() || null), 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 sm:p-5">
      {/* Availability dates: native date inputs, filters the list server-side */}
      <div className="mb-3 grid grid-cols-2 gap-3 sm:max-w-md">
        <label className="grid gap-1.5 text-sm font-medium">
          {tForm("checkIn")}
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setParam("checkIn", e.target.value || null)}
            className="h-11 rounded-full border border-border bg-background px-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          {tForm("checkOut")}
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setParam("checkOut", e.target.value || null)}
            className="h-11 rounded-full border border-border bg-background px-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 rounded-full border-border bg-background pl-9"
            aria-label={t("search")}
          />
        </div>

        <Select
          value={guests || "any"}
          onValueChange={(v) => setParam("guests", v === "any" ? null : v)}
        >
          <SelectTrigger className="h-11 rounded-full sm:min-w-[9rem]" aria-label={t("guests")}>
            <SelectValue>
              {(value: string) =>
                value === "any" ? t("guests") : t("guestsValue", { count: Number(value) })
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("guests")}</SelectItem>
            {GUEST_OPTIONS.map((g) => (
              <SelectItem key={g} value={String(g)}>
                {t("guestsValue", { count: g })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={maxPrice || "any"}
          onValueChange={(v) => setParam("maxPrice", v === "any" ? null : v)}
        >
          <SelectTrigger className="h-11 rounded-full sm:min-w-[9rem]" aria-label={t("price")}>
            <SelectValue>
              {(value: string) =>
                value === "any" ? t("price") : t("priceUpTo", { count: Number(value) })
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("price")}</SelectItem>
            {PRICE_OPTIONS.map((p) => (
              <SelectItem key={p} value={String(p)}>
                {t("priceUpTo", { count: p })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => setParam("seaView", seaView ? null : "1")}
          aria-pressed={seaView}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors",
            seaView
              ? "border-sea bg-sea text-sea-foreground"
              : "border-border bg-background text-foreground hover:bg-secondary",
          )}
        >
          <Waves className="h-4 w-4" />
          {t("seaView")}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {AMENITY_CHIPS.map((key) => {
          const active = amenities.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleAmenity(key)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "border-sea bg-sea/10 text-sea"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {tAmenity(key)}
            </button>
          );
        })}

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            {t("clear")}
          </button>
        )}
      </div>
    </div>
  );
}
