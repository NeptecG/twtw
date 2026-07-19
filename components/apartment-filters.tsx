"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import type { DateRange } from "react-day-picker";
import { el, enUS } from "react-day-picker/locale";
import { Waves, Search, X, CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AMENITY_CHIPS = ["wifi", "ac", "parking", "pets", "kitchen", "balcony"] as const;
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
const PRICE_OPTIONS = [80, 100, 120, 160] as const;

// Local-time date <-> "YYYY-MM-DD", so the calendar never shifts a day across timezones.
const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function ApartmentFilters() {
  const t = useTranslations("filters");
  const tAmenity = useTranslations("amenities");
  const locale = useLocale();
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

  // One combined check-in/check-out picker. URL is the source of truth; `pending`
  // holds a half-finished selection while the popover is open.
  const [datesOpen, setDatesOpen] = useState(false);
  const [pending, setPending] = useState<DateRange | undefined>(undefined);
  const urlRange: DateRange | undefined =
    checkIn && checkOut ? { from: parseDay(checkIn), to: parseDay(checkOut) } : undefined;
  const selectedRange = pending ?? urlRange;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  function onDatesSelect(r: DateRange | undefined) {
    if (r?.from && r?.to && toISO(r.to) > toISO(r.from)) {
      setPending(undefined);
      setDatesOpen(false);
      update((p) => {
        p.set("checkIn", toISO(r.from!));
        p.set("checkOut", toISO(r.to!));
      });
    } else {
      setPending(r);
    }
  }

  function clearDates() {
    setPending(undefined);
    setDatesOpen(false);
    update((p) => {
      p.delete("checkIn");
      p.delete("checkOut");
    });
  }

  function clearAll() {
    setSearch("");
    setPending(undefined);
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

  const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const datesLabel =
    checkIn && checkOut
      ? `${dateFmt.format(parseDay(checkIn))} · ${dateFmt.format(parseDay(checkOut))}`
      : t("dates");

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
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

        <Popover
          open={datesOpen}
          onOpenChange={(o) => {
            setDatesOpen(o);
            if (!o) setPending(undefined);
          }}
        >
          <PopoverTrigger
            aria-label={t("dates")}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors",
              checkIn && checkOut
                ? "border-sea bg-sea/10 text-sea"
                : "border-border bg-background text-foreground hover:bg-secondary",
            )}
          >
            <CalendarDays className="h-4 w-4" />
            {datesLabel}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={onDatesSelect}
              disabled={{ before: today }}
              defaultMonth={selectedRange?.from ?? today}
              numberOfMonths={1}
              locale={locale === "el" ? el : enUS}
              className="p-1"
            />
            {checkIn && checkOut && (
              <button
                type="button"
                onClick={clearDates}
                className="mx-auto mb-1 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
                {t("datesClear")}
              </button>
            )}
          </PopoverContent>
        </Popover>

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
