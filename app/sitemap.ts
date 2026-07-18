import type { MetadataRoute } from "next";
import { listApartments } from "@/lib/apartments";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Greek lives at the root, English under /en (see i18n/routing.ts).
const localePath = (locale: "el" | "en", path: string) =>
  locale === "el" ? `${BASE}${path || "/"}` : `${BASE}/en${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apartments = await listApartments();
  const staticPaths = ["", "/apartments", "/about", "/contact", "/faq", "/privacy"];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of staticPaths) {
    for (const locale of ["el", "en"] as const) {
      entries.push({
        url: localePath(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }
  for (const apartment of apartments) {
    for (const locale of ["el", "en"] as const) {
      entries.push({
        url: localePath(locale, `/apartments/${apartment.slug}`),
        lastModified: apartment.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }
  return entries;
}
