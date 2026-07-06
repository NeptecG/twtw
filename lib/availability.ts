// Availability computation. Pure, no I/O.
// Dates are ISO "YYYY-MM-DD". Ranges are half-open [checkIn, checkOut):
// the checkout day is free for the next guest to check in.

type Span = { startDate: string; endDate: string };
type Booking = { checkIn: string; checkOut: string };

const toTime = (iso: string) => new Date(iso + "T00:00:00Z").getTime();

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  // half-open intervals overlap when aStart < bEnd && bStart < aEnd
  return toTime(aStart) < toTime(bEnd) && toTime(bStart) < toTime(aEnd);
}

export function isRangeAvailable(
  checkIn: string,
  checkOut: string,
  blocks: Span[],
  confirmed: Booking[],
): boolean {
  if (toTime(checkOut) <= toTime(checkIn)) return false; // at least one night
  for (const b of blocks) {
    if (overlaps(checkIn, checkOut, b.startDate, b.endDate)) return false;
  }
  for (const c of confirmed) {
    if (overlaps(checkIn, checkOut, c.checkIn, c.checkOut)) return false;
  }
  return true;
}

const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d;
};

// react-day-picker disabled matchers are inclusive { from, to }. The checkout
// day stays selectable, so the last disabled day is (end - 1).
export function disabledDateMatchers(blocks: Span[], confirmed: Booking[]) {
  const spans = [
    ...blocks.map((b) => ({ from: b.startDate, to: b.endDate })),
    ...confirmed.map((c) => ({ from: c.checkIn, to: c.checkOut })),
  ];
  return spans.map((s) => ({
    from: new Date(s.from + "T00:00:00Z"),
    to: addDays(s.to, -1),
  }));
}
