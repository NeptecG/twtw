"use client";

import { useLocale } from "next-intl";
import type { DateRange } from "react-day-picker";
import { el, enUS } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { disabledDateMatchers } from "@/lib/availability";

export function AvailabilityCalendar({
  blocks,
  confirmed,
  value,
  onChange,
}: {
  blocks: { startDate: string; endDate: string }[];
  confirmed: { checkIn: string; checkOut: string }[];
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  const locale = useLocale();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabled = [...disabledDateMatchers(blocks, confirmed), { before: today }];

  return (
    <Calendar
      mode="range"
      selected={value}
      onSelect={onChange}
      disabled={disabled}
      numberOfMonths={1}
      locale={locale === "el" ? el : enUS}
      className="rounded-xl border border-border bg-background p-3"
    />
  );
}
