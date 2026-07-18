"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingRequestSchema } from "@/lib/booking-validation";

function isoLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function BookingRequestForm({
  apartmentId,
  maxGuests,
  pricePerNight,
  blocks,
  confirmed,
}: {
  apartmentId: string;
  maxGuests: number;
  pricePerNight: string;
  blocks: { startDate: string; endDate: string }[];
  confirmed: { checkIn: string; checkOut: string }[];
}) {
  const t = useTranslations("form");
  const tApt = useTranslations("apartment");
  const locale = useLocale();

  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const price = Number(pricePerNight);
  const nights =
    range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;
  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const guestOptions = Array.from({ length: Math.max(1, maxGuests) }, (_, i) => i + 1);
  const ready = !!range?.from && !!range?.to && nights > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!range?.from || !range?.to) {
      toast.error(t("requiredRange"));
      return;
    }

    const payload = {
      apartmentId,
      checkIn: isoLocal(range.from),
      checkOut: isoLocal(range.to),
      guests: Number(guests),
      guestName: name,
      guestEmail: email,
      guestPhone: phone || undefined,
      message: message || undefined,
      locale: locale === "en" ? ("en" as const) : ("el" as const),
    };

    const parsed = bookingRequestSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(t("error"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(t("success"));
        setRange(undefined);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else if (res.status === 409) {
        toast.error(t("unavailable"));
      } else {
        toast.error(t("error"));
      }
    } catch {
      toast.error(t("error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-3xl text-ink">{currency.format(price)}</span>
        <span className="text-sm text-muted-foreground">{tApt("perNight")}</span>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">{t("selectDates")}</span>
        <AvailabilityCalendar
          blocks={blocks}
          confirmed={confirmed}
          value={range}
          onChange={setRange}
        />
      </div>

      {ready && (
        <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            {t("nights", { count: nights })} · {t("total")}
          </span>
          <span className="font-semibold text-ink">{currency.format(price * nights)}</span>
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="guests">{t("guests")}</Label>
          <Select value={guests} onValueChange={(v) => setGuests(v ?? "2")}>
            <SelectTrigger id="guests" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {guestOptions.map((g) => (
                <SelectItem key={g} value={String(g)}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            maxLength={17}
            value={phone}
            onChange={(e) =>
              // digits, spaces and one leading + only, 17 chars max (same rule as the server)
              setPhone(
                e.target.value.replace(/[^\d+ ]/g, "").replace(/(?!^)\+/g, "").slice(0, 17),
              )
            }
            autoComplete="tel"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("messagePlaceholder")}
            rows={3}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting || !ready}
        className="w-full rounded-full bg-terracotta py-6 text-base font-semibold text-primary-foreground hover:bg-[#379e86]"
      >
        {submitting ? t("submitting") : tApt("requestToBook")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">{t("noCharge")}</p>
    </form>
  );
}
