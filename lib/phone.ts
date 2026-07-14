// Greek readers know the local format; the +30 country code is only useful
// to an international (English) audience dialling from abroad.
export function phoneDisplay(local: string, locale: string): string {
  return locale === "en" ? `+30 ${local}` : local;
}
