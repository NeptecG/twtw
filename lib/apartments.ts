import { and, eq, gte, lte, sql } from "drizzle-orm";
import { apartments, availabilityBlocks, bookingRequests } from "./db/schema";
import type { Apartment } from "./db/schema";
import {
  placeholderApartments,
  placeholderBlocks,
  placeholderConfirmed,
} from "./placeholder-data";

export type ApartmentFilters = {
  guests?: number;
  maxPrice?: number;
  seaView?: boolean;
  amenities?: string[];
  q?: string;
};

// When no DATABASE_URL is configured, the site runs on placeholder content so
// it can be built and previewed offline. Once Supabase is connected, the same
// queries hit the real database.
const hasDb = !!process.env.DATABASE_URL;

function filterPlaceholders(f: ApartmentFilters): Apartment[] {
  const q = f.q?.trim().toLowerCase();
  return placeholderApartments
    .filter((a) => a.published)
    .filter((a) => (f.guests ? a.capacity >= f.guests : true))
    .filter((a) => (f.maxPrice ? Number(a.pricePerNight) <= f.maxPrice : true))
    .filter((a) => (f.seaView ? a.seaView : true))
    .filter((a) =>
      f.amenities?.length ? f.amenities.every((am) => a.amenities.includes(am)) : true,
    )
    .filter((a) =>
      q ? a.titleEl.toLowerCase().includes(q) || a.titleEn.toLowerCase().includes(q) : true,
    )
    .sort((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));
}

export async function listApartments(f: ApartmentFilters = {}): Promise<Apartment[]> {
  if (!hasDb) return filterPlaceholders(f);

  const { db } = await import("./db/client");
  const where = [eq(apartments.published, true)];
  if (f.guests) where.push(gte(apartments.capacity, f.guests));
  if (f.maxPrice) where.push(lte(apartments.pricePerNight, String(f.maxPrice)));
  if (f.seaView) where.push(eq(apartments.seaView, true));
  if (f.amenities?.length) {
    where.push(sql`${apartments.amenities} @> ${JSON.stringify(f.amenities)}::jsonb`);
  }
  if (f.q) {
    const like = `%${f.q}%`;
    where.push(
      sql`(${apartments.titleEl} ilike ${like} or ${apartments.titleEn} ilike ${like})`,
    );
  }
  return db.select().from(apartments).where(and(...where)).orderBy(apartments.pricePerNight);
}

export async function getApartmentBySlug(slug: string): Promise<Apartment | null> {
  if (!hasDb) {
    return (
      placeholderApartments.find((a) => a.slug === slug && a.published) ?? null
    );
  }

  const { db } = await import("./db/client");
  const rows = await db
    .select()
    .from(apartments)
    .where(and(eq(apartments.slug, slug), eq(apartments.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getApartmentById(apartmentId: string): Promise<Apartment | null> {
  if (!hasDb) {
    return placeholderApartments.find((a) => a.id === apartmentId) ?? null;
  }

  const { db } = await import("./db/client");
  const rows = await db
    .select()
    .from(apartments)
    .where(eq(apartments.id, apartmentId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getApartmentAvailability(apartmentId: string): Promise<{
  blocks: { startDate: string; endDate: string }[];
  confirmed: { checkIn: string; checkOut: string }[];
}> {
  if (!hasDb) {
    return {
      blocks: placeholderBlocks
        .filter((b) => b.apartmentId === apartmentId)
        .map((b) => ({ startDate: b.startDate, endDate: b.endDate })),
      confirmed: placeholderConfirmed
        .filter((c) => c.apartmentId === apartmentId)
        .map((c) => ({ checkIn: c.checkIn, checkOut: c.checkOut })),
    };
  }

  const { db } = await import("./db/client");
  const blocks = await db
    .select({ startDate: availabilityBlocks.startDate, endDate: availabilityBlocks.endDate })
    .from(availabilityBlocks)
    .where(eq(availabilityBlocks.apartmentId, apartmentId));
  const confirmed = await db
    .select({ checkIn: bookingRequests.checkIn, checkOut: bookingRequests.checkOut })
    .from(bookingRequests)
    .where(
      and(
        eq(bookingRequests.apartmentId, apartmentId),
        eq(bookingRequests.status, "confirmed"),
      ),
    );
  return { blocks, confirmed };
}
