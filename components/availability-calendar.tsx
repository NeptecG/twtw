"use client";

import type { DateRange } from "react-day-picker";
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
      className="rounded-xl border border-border bg-background p-3"
    />
  );
}
