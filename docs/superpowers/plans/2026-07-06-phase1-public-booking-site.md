# TWTW Rentals Phase 1: Public Booking Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. For any task that produces user-facing UI, ALSO use the frontend-design and ui-ux-pro-max skills to generate the styled markup — this plan defines the data, states, and acceptance criteria; those skills own the visual layer.

**Goal:** Ship a bilingual (Greek/English) public website where guests browse Naupaktos rental apartments, check live availability, and send a booking request that emails the owner.

**Architecture:** One Next.js App Router app. Postgres schema, storage, and (later) auth via Supabase. Availability is a pure function computed from confirmed booking requests plus manual blocks. Booking requests are validated server-side, written to the database, and trigger a Resend email to the owner. UI is server-rendered for SEO, styled with Tailwind + shadcn/ui.

**Tech Stack:** Next.js (App Router, TypeScript), Supabase (Postgres + Storage), Drizzle ORM, next-intl, react-day-picker, zod, Resend, Tailwind CSS, shadcn/ui. Deploy: Vercel.

---

## File Structure

```
To twtw/
  app/
    [locale]/
      layout.tsx                # locale layout, nav, footer, intl provider
      page.tsx                  # home
      apartments/page.tsx       # listing + filters
      apartments/[slug]/page.tsx# detail + calendar + request form
      about/page.tsx
      contact/page.tsx
    api/
      booking-request/route.ts  # POST: validate, insert, email owner
    layout.tsx                  # root html
    globals.css
  components/
    site-header.tsx
    site-footer.tsx
    language-switcher.tsx
    apartment-card.tsx
    apartment-filters.tsx
    availability-calendar.tsx   # react-day-picker wrapper
    booking-request-form.tsx    # client form -> POST /api/booking-request
    photo-gallery.tsx
    amenity-list.tsx
  lib/
    db/schema.ts                # Drizzle table definitions
    db/client.ts                # Drizzle + postgres client
    availability.ts             # PURE availability computation
    booking-validation.ts       # PURE zod schema + request validation
    apartments.ts               # data access: list/filter/getBySlug
    email.ts                    # Resend wrapper
    amenities.ts                # amenity keys + icons + i18n keys
  messages/
    el.json
    en.json
  i18n/
    routing.ts                  # next-intl locales config
    request.ts                  # next-intl request config
  supabase/
    migrations/0001_init.sql    # tables
    seed.ts                     # placeholder apartments + blocks
  tests/
    availability.test.ts
    booking-validation.test.ts
  middleware.ts                 # next-intl locale middleware
  drizzle.config.ts
  .env.local.example
  next.config.ts
```

Split rationale: pure logic (`availability.ts`, `booking-validation.ts`) is isolated from I/O so it is unit-testable without a database. Data access (`apartments.ts`, `email.ts`) wraps side effects. UI components are presentational and receive data as props.

---

## Task 1: Scaffold the Next.js app

**Files:**
- Create: whole app skeleton via CLI in `To twtw/`

- [ ] **Step 1: Create the Next.js app in the existing folder**

Run from inside `To twtw/`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm --yes
```
Expected: app files created alongside the existing `docs/`. If it refuses because the dir is non-empty, temporarily move `docs/` out, scaffold, move it back.

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds, `.next/` produced.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app"
```

---

## Task 2: Install dependencies and init shadcn/ui

**Files:**
- Modify: `package.json`
- Create: `components.json`, `lib/utils.ts`

- [ ] **Step 1: Install runtime + dev deps**

```bash
npm install next-intl drizzle-orm postgres zod react-day-picker date-fns resend @supabase/supabase-js
npm install -D drizzle-kit tsx vitest
```

- [ ] **Step 2: Init shadcn/ui and add base components**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button card input label select textarea dialog badge calendar sonner
```
Expected: `components/ui/*` created, `lib/utils.ts` with `cn()`.

- [ ] **Step 3: Add test + db scripts to package.json**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"db:generate": "drizzle-kit generate",
"db:push": "drizzle-kit push",
"db:seed": "tsx supabase/seed.ts"
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add deps, shadcn/ui, scripts"
```

---

## Task 3: Environment + Supabase/Drizzle client

**Files:**
- Create: `.env.local.example`, `lib/db/client.ts`, `drizzle.config.ts`

- [ ] **Step 1: Write `.env.local.example`**

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# Direct Postgres connection string for Drizzle (Supabase -> Project Settings -> Database)
DATABASE_URL=
# Resend
RESEND_API_KEY=
OWNER_NOTIFICATION_EMAIL=
FROM_EMAIL=bookings@example.com
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 2: Write `drizzle.config.ts`**

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

- [ ] **Step 3: Write `lib/db/client.ts`**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
// ponytail: single shared client; fine for serverless with postgres-js prepare:false
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add env example and drizzle client"
```

---

## Task 4: Database schema

**Files:**
- Create: `lib/db/schema.ts`
- Create (generated): `supabase/migrations/0001_*.sql`

- [ ] **Step 1: Write `lib/db/schema.ts`**

```ts
import { pgTable, uuid, text, integer, numeric, boolean, date, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const requestStatus = pgEnum("request_status", ["pending", "confirmed", "declined"]);

export const apartments = pgTable("apartments", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  titleEl: text("title_el").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionEl: text("description_el").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull().default(2),
  bedrooms: integer("bedrooms").notNull().default(1),
  bathrooms: integer("bathrooms").notNull().default(1),
  sizeSqm: integer("size_sqm"),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  photos: jsonb("photos").$type<string[]>().notNull().default([]),
  areaLabel: text("area_label"),
  lat: numeric("lat", { precision: 9, scale: 6 }),
  lng: numeric("lng", { precision: 9, scale: 6 }),
  seaView: boolean("sea_view").notNull().default(false),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const availabilityBlocks = pgTable("availability_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  apartmentId: uuid("apartment_id").notNull().references(() => apartments.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason"),
});

export const bookingRequests = pgTable("booking_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  apartmentId: uuid("apartment_id").notNull().references(() => apartments.id, { onDelete: "cascade" }),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  guests: integer("guests").notNull().default(1),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  message: text("message"),
  status: requestStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Apartment = typeof apartments.$inferSelect;
export type AvailabilityBlock = typeof availabilityBlocks.$inferSelect;
export type BookingRequest = typeof bookingRequests.$inferSelect;
```

- [ ] **Step 2: Generate migration**

Run: `npm run db:generate`
Expected: SQL file written to `supabase/migrations/`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add database schema and migration"
```

---

## Task 5: Availability computation (PURE, TDD)

**Files:**
- Create: `lib/availability.ts`
- Test: `tests/availability.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { isRangeAvailable, disabledDateMatchers } from "@/lib/availability";

const blocks = [
  { startDate: "2026-08-10", endDate: "2026-08-14" }, // check-out day free
];
const confirmed = [
  { checkIn: "2026-08-20", checkOut: "2026-08-25" },
];

describe("isRangeAvailable", () => {
  it("allows a free range", () => {
    expect(isRangeAvailable("2026-08-01", "2026-08-05", blocks, confirmed)).toBe(true);
  });
  it("rejects overlap with a block", () => {
    expect(isRangeAvailable("2026-08-12", "2026-08-16", blocks, confirmed)).toBe(false);
  });
  it("rejects overlap with a confirmed booking", () => {
    expect(isRangeAvailable("2026-08-24", "2026-08-27", blocks, confirmed)).toBe(false);
  });
  it("allows check-in on a prior booking's check-out day", () => {
    expect(isRangeAvailable("2026-08-25", "2026-08-28", blocks, confirmed)).toBe(true);
  });
  it("rejects check-out before check-in", () => {
    expect(isRangeAvailable("2026-08-05", "2026-08-01", blocks, confirmed)).toBe(false);
  });
  it("rejects zero-night stay", () => {
    expect(isRangeAvailable("2026-08-05", "2026-08-05", blocks, confirmed)).toBe(false);
  });
});

describe("disabledDateMatchers", () => {
  it("returns one interval per block and confirmed booking (checkout exclusive)", () => {
    const m = disabledDateMatchers(blocks, confirmed);
    expect(m).toHaveLength(2);
    expect(m[0]).toEqual({ from: new Date("2026-08-10"), to: new Date("2026-08-13") });
    expect(m[1]).toEqual({ from: new Date("2026-08-20"), to: new Date("2026-08-24") });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL, "isRangeAvailable is not a function".

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/availability.ts
// Dates are ISO "YYYY-MM-DD". Ranges are [checkIn, checkOut) — checkout day is free.
type Span = { startDate: string; endDate: string };
type Booking = { checkIn: string; checkOut: string };

const toTime = (iso: string) => new Date(iso + "T00:00:00Z").getTime();

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  // half-open intervals [start, end): overlap when aStart < bEnd && bStart < aEnd
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

// react-day-picker disabled matchers: inclusive {from,to}. Checkout day stays selectable,
// so the last disabled day is (end - 1).
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (all 8 assertions).

- [ ] **Step 5: Commit**

```bash
git add lib/availability.ts tests/availability.test.ts
git commit -m "feat: pure availability computation with tests"
```

---

## Task 6: Booking request validation (PURE, TDD)

**Files:**
- Create: `lib/booking-validation.ts`
- Test: `tests/booking-validation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { bookingRequestSchema } from "@/lib/booking-validation";

const valid = {
  apartmentId: "11111111-1111-1111-1111-111111111111",
  checkIn: "2026-08-01",
  checkOut: "2026-08-05",
  guests: 2,
  guestName: "Maria P",
  guestEmail: "maria@example.com",
  guestPhone: "+306900000000",
  message: "Hello",
};

describe("bookingRequestSchema", () => {
  it("accepts a valid payload", () => {
    expect(bookingRequestSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a bad email", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, guestEmail: "nope" }).success).toBe(false);
  });
  it("rejects checkout <= checkin", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, checkOut: "2026-08-01" }).success).toBe(false);
  });
  it("rejects guests < 1", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, guests: 0 }).success).toBe(false);
  });
  it("rejects empty name", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, guestName: "" }).success).toBe(false);
  });
  it("allows optional phone/message to be absent", () => {
    const { guestPhone, message, ...rest } = valid;
    expect(bookingRequestSchema.safeParse(rest).success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL, cannot import `bookingRequestSchema`.

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/booking-validation.ts
import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

export const bookingRequestSchema = z
  .object({
    apartmentId: z.string().uuid(),
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.number().int().min(1).max(30),
    guestName: z.string().trim().min(1).max(120),
    guestEmail: z.string().email(),
    guestPhone: z.string().trim().max(40).optional(),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((v) => new Date(v.checkOut) > new Date(v.checkIn), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/booking-validation.ts tests/booking-validation.test.ts
git commit -m "feat: booking request validation schema with tests"
```

---

## Task 7: Amenities catalog + i18n setup

**Files:**
- Create: `lib/amenities.ts`, `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/el.json`, `messages/en.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Write `lib/amenities.ts`**

```ts
// Amenity keys are stable ids stored in DB; labels come from i18n messages (amenities.<key>).
export const AMENITY_KEYS = [
  "wifi", "ac", "sea_view", "parking", "pets", "kitchen",
  "washer", "balcony", "tv", "heating", "coffee", "elevator",
] as const;
export type AmenityKey = (typeof AMENITY_KEYS)[number];
```

- [ ] **Step 2: Write `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["el", "en"],
  defaultLocale: "el",
});
```

- [ ] **Step 3: Write `i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) locale = routing.defaultLocale;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
```

- [ ] **Step 4: Write `middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 5: Wire the plugin in `next.config.ts`**

```ts
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }, { protocol: "https", hostname: "images.unsplash.com" }] },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Seed `messages/el.json` and `messages/en.json`**

Create both with matching keys. Starter `messages/en.json`:
```json
{
  "nav": { "home": "Home", "apartments": "Apartments", "about": "The Area", "contact": "Contact" },
  "home": { "heroTitle": "Stay in the heart of Naupaktos", "heroSubtitle": "Handpicked apartments by the Venetian harbour and the sea.", "cta": "Browse apartments", "featured": "Featured stays", "whyTitle": "Why stay with us" },
  "filters": { "guests": "Guests", "price": "Price", "seaView": "Sea view", "search": "Search", "clear": "Clear", "results": "{count} apartments" },
  "apartment": { "perNight": "/ night", "guests": "Up to {count} guests", "bedrooms": "{count} bedrooms", "amenities": "Amenities", "availability": "Availability", "requestToBook": "Request to book", "from": "From", "location": "Location" },
  "form": { "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Guests", "name": "Full name", "email": "Email", "phone": "Phone", "message": "Message", "submit": "Send request", "success": "Request sent. The owner will contact you soon.", "error": "Something went wrong. Please try again." },
  "amenities": { "wifi": "Wi-Fi", "ac": "Air conditioning", "sea_view": "Sea view", "parking": "Parking", "pets": "Pets allowed", "kitchen": "Kitchen", "washer": "Washing machine", "balcony": "Balcony", "tv": "TV", "heating": "Heating", "coffee": "Coffee maker", "elevator": "Elevator" },
  "footer": { "rights": "All rights reserved.", "contact": "Contact" },
  "contact": { "title": "Contact us", "intro": "Questions about a stay in Naupaktos? Send us a message." }
}
```
Create `messages/el.json` with the same keys, Greek values (e.g. `"home.heroTitle": "Μείνετε στην καρδιά της Ναυπάκτου"`, `"nav.apartments": "Διαμερίσματα"`, etc.).

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: i18n routing, messages, amenities catalog"
```

---

## Task 8: Data access layer

**Files:**
- Create: `lib/apartments.ts`

- [ ] **Step 1: Write `lib/apartments.ts`**

```ts
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "./db/client";
import { apartments, availabilityBlocks, bookingRequests } from "./db/schema";

export type ApartmentFilters = {
  guests?: number;
  maxPrice?: number;
  seaView?: boolean;
  amenities?: string[];
  q?: string;
};

export async function listApartments(f: ApartmentFilters = {}) {
  const where = [eq(apartments.published, true)];
  if (f.guests) where.push(gte(apartments.capacity, f.guests));
  if (f.maxPrice) where.push(lte(apartments.pricePerNight, String(f.maxPrice)));
  if (f.seaView) where.push(eq(apartments.seaView, true));
  if (f.amenities?.length) where.push(sql`${apartments.amenities} @> ${JSON.stringify(f.amenities)}::jsonb`);
  if (f.q) where.push(sql`(${apartments.titleEl} ilike ${"%" + f.q + "%"} or ${apartments.titleEn} ilike ${"%" + f.q + "%"})`);
  return db.select().from(apartments).where(and(...where)).orderBy(apartments.pricePerNight);
}

export async function getApartmentBySlug(slug: string) {
  const rows = await db.select().from(apartments).where(and(eq(apartments.slug, slug), eq(apartments.published, true))).limit(1);
  return rows[0] ?? null;
}

export async function getApartmentAvailability(apartmentId: string) {
  const blocks = await db.select({ startDate: availabilityBlocks.startDate, endDate: availabilityBlocks.endDate })
    .from(availabilityBlocks).where(eq(availabilityBlocks.apartmentId, apartmentId));
  const confirmed = await db.select({ checkIn: bookingRequests.checkIn, checkOut: bookingRequests.checkOut })
    .from(bookingRequests).where(and(eq(bookingRequests.apartmentId, apartmentId), eq(bookingRequests.status, "confirmed")));
  return { blocks, confirmed };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/apartments.ts
git commit -m "feat: apartments data access layer"
```

---

## Task 9: Seed placeholder data

**Files:**
- Create: `supabase/seed.ts`

- [ ] **Step 1: Write `supabase/seed.ts`**

Insert 12 placeholder apartments with Greek + English titles/descriptions, varied prices (45-140), capacity (2-6), amenities subsets, sea_view mix, and Unsplash placeholder photo URLs. Add a few `availability_blocks` and one `confirmed` booking so the calendar visibly shows unavailable dates. Use the Drizzle client.

```ts
import "dotenv/config";
import { db } from "../lib/db/client";
import { apartments, availabilityBlocks, bookingRequests } from "../lib/db/schema";

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

async function main() {
  await db.delete(bookingRequests);
  await db.delete(availabilityBlocks);
  await db.delete(apartments);

  const rows = Array.from({ length: 12 }).map((_, i) => ({
    slug: `apartment-${i + 1}`,
    titleEl: `Διαμέρισμα ${i + 1} — Ναύπακτος`,
    titleEn: `Apartment ${i + 1} — Naupaktos`,
    descriptionEl: "Άνετο διαμέρισμα κοντά στο ενετικό λιμάνι, με εύκολη πρόσβαση σε παραλίες και ταβέρνες.",
    descriptionEn: "Comfortable apartment near the Venetian harbour, close to beaches and tavernas.",
    pricePerNight: String(45 + i * 8),
    capacity: 2 + (i % 5),
    bedrooms: 1 + (i % 3),
    bathrooms: 1 + (i % 2),
    sizeSqm: 40 + i * 5,
    amenities: ["wifi", "ac", "kitchen", ...(i % 2 ? ["parking"] : []), ...(i % 3 ? ["balcony"] : [])],
    photos: [photo("photo-1502672260266-1c1ef2d93688"), photo("photo-1522708323590-d24dbb6b0267")],
    areaLabel: "Naupaktos, Greece",
    lat: "38.393", lng: "21.828",
    seaView: i % 2 === 0,
    published: true,
  }));
  const inserted = await db.insert(apartments).values(rows).returning({ id: apartments.id });

  await db.insert(availabilityBlocks).values([
    { apartmentId: inserted[0].id, startDate: "2026-08-10", endDate: "2026-08-14", reason: "Owner block" },
  ]);
  await db.insert(bookingRequests).values([
    { apartmentId: inserted[0].id, checkIn: "2026-08-20", checkOut: "2026-08-25", guests: 2, guestName: "Test Guest", guestEmail: "guest@example.com", status: "confirmed" },
  ]);
  console.log("Seeded", inserted.length, "apartments");
  process.exit(0);
}
main();
```

- [ ] **Step 2: Commit** (running the seed requires live DB env; defer running to setup step)

```bash
git add supabase/seed.ts
git commit -m "feat: placeholder seed data"
```

---

## Task 10: Email wrapper

**Files:**
- Create: `lib/email.ts`

- [ ] **Step 1: Write `lib/email.ts`**

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingRequestEmail(input: {
  apartmentTitle: string;
  checkIn: string; checkOut: string; guests: number;
  guestName: string; guestEmail: string; guestPhone?: string; message?: string;
}) {
  const to = process.env.OWNER_NOTIFICATION_EMAIL!;
  const from = process.env.FROM_EMAIL!;
  return resend.emails.send({
    from, to,
    replyTo: input.guestEmail,
    subject: `New booking request: ${input.apartmentTitle} (${input.checkIn} to ${input.checkOut})`,
    text: [
      `Apartment: ${input.apartmentTitle}`,
      `Dates: ${input.checkIn} to ${input.checkOut}`,
      `Guests: ${input.guests}`,
      `Name: ${input.guestName}`,
      `Email: ${input.guestEmail}`,
      `Phone: ${input.guestPhone ?? "-"}`,
      `Message: ${input.message ?? "-"}`,
    ].join("\n"),
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/email.ts
git commit -m "feat: resend booking-request email wrapper"
```

---

## Task 11: Booking request API route

**Files:**
- Create: `app/api/booking-request/route.ts`

- [ ] **Step 1: Write the route**

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { bookingRequests } from "@/lib/db/schema";
import { bookingRequestSchema } from "@/lib/booking-validation";
import { isRangeAvailable } from "@/lib/availability";
import { getApartmentBySlug, getApartmentAvailability } from "@/lib/apartments";
import { sendBookingRequestEmail } from "@/lib/email";
import { eq } from "drizzle-orm";
import { apartments } from "@/lib/db/schema";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const apt = (await db.select().from(apartments).where(eq(apartments.id, data.apartmentId)).limit(1))[0];
  if (!apt) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { blocks, confirmed } = await getApartmentAvailability(data.apartmentId);
  if (!isRangeAvailable(data.checkIn, data.checkOut, blocks, confirmed)) {
    return NextResponse.json({ error: "unavailable" }, { status: 409 });
  }

  await db.insert(bookingRequests).values({
    apartmentId: data.apartmentId,
    checkIn: data.checkIn, checkOut: data.checkOut, guests: data.guests,
    guestName: data.guestName, guestEmail: data.guestEmail,
    guestPhone: data.guestPhone, message: data.message, status: "pending",
  });

  try {
    await sendBookingRequestEmail({
      apartmentTitle: apt.titleEn, checkIn: data.checkIn, checkOut: data.checkOut,
      guests: data.guests, guestName: data.guestName, guestEmail: data.guestEmail,
      guestPhone: data.guestPhone, message: data.message,
    });
  } catch (e) {
    // ponytail: request is already saved; email failure should not 500 the guest. Log and continue.
    console.error("booking email failed", e);
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/booking-request/route.ts
git commit -m "feat: booking-request API route (validate, availability, insert, email)"
```

---

## Task 12: Layout, header, footer, language switcher

**Files:**
- Create: `app/[locale]/layout.tsx`, `components/site-header.tsx`, `components/site-footer.tsx`, `components/language-switcher.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`

USE frontend-design + ui-ux-pro-max skills for visual styling. Requirements:

- Root `app/layout.tsx`: html shell, load a serif display font (headings) + clean sans (body) via `next/font`, set the sea-and-stone palette as CSS variables / Tailwind theme.
- `app/[locale]/layout.tsx`: wrap children in `NextIntlClientProvider`, render `<SiteHeader/>` + children + `<SiteFooter/>`, include `<Toaster/>` (sonner). Call `setRequestLocale(locale)`. `generateStaticParams` from `routing.locales`.
- `SiteHeader`: logo/wordmark "TWTW", nav links (home, apartments, about, contact) from `useTranslations("nav")`, `<LanguageSwitcher/>`, mobile menu.
- `LanguageSwitcher`: toggles `/el` <-> `/en` preserving the current path, using next-intl `usePathname`/`useRouter` from `@/i18n/routing` navigation helpers (create `i18n/navigation.ts` exporting `createNavigation(routing)`).
- `SiteFooter`: contact, copyright with current year, links.

Acceptance:
- [ ] Header/nav renders on all pages in both locales.
- [ ] Language switch keeps you on the same page in the other language.
- [ ] `npm run build` succeeds.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: app layout, header, footer, language switcher"
```

---

## Task 13: Home page

**Files:**
- Create: `app/[locale]/page.tsx`
- Create: `components/apartment-card.tsx`

USE frontend-design + ui-ux-pro-max skills. Requirements:

- Hero: full-bleed Naupaktos harbour/fortress image, `home.heroTitle` + `home.heroSubtitle`, primary CTA to `/apartments`.
- Featured stays: fetch up to 6 apartments via `listApartments()`, render `ApartmentCard` grid.
- "Why stay" value props (3-4 items), location teaser, contact CTA.
- `ApartmentCard` props: `apartment: Apartment`, `locale`. Shows first photo (next/image), localized title, price/night, capacity, sea-view badge, links to `/apartments/[slug]`.

Acceptance:
- [ ] Home renders featured apartments from DB.
- [ ] Localized text in both locales.
- [ ] `npm run build` succeeds.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: home page and apartment card"
```

---

## Task 14: Apartments listing + filters

**Files:**
- Create: `app/[locale]/apartments/page.tsx`, `components/apartment-filters.tsx`

USE frontend-design + ui-ux-pro-max skills. Requirements:

- Server component reads `searchParams` (guests, maxPrice, seaView, amenities, q), calls `listApartments(filters)`, renders result count + `ApartmentCard` grid.
- `ApartmentFilters` (client): controls for guests (select), price (slider/number), sea view (toggle), amenity checkboxes, search box. On change, pushes updated query string (URL is the source of truth, so filters are shareable and SSR-friendly).
- Empty state when no matches.

Acceptance:
- [ ] Changing a filter updates the visible list and the URL.
- [ ] Reloading a filtered URL shows the same filtered results (SSR).
- [ ] `npm run build` succeeds.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: apartments listing with filters and search"
```

---

## Task 15: Apartment detail + gallery + amenities

**Files:**
- Create: `app/[locale]/apartments/[slug]/page.tsx`, `components/photo-gallery.tsx`, `components/amenity-list.tsx`

USE frontend-design + ui-ux-pro-max skills. Requirements:

- Server component: `getApartmentBySlug(slug)`, 404 via `notFound()` if missing. `generateMetadata` for SEO (localized title + description).
- Sections: `PhotoGallery` (photos, lightbox optional), title, price/night, capacity/bedrooms/baths/size, localized description, `AmenityList` (maps amenity keys to `amenities.<key>` labels + icons), location map placeholder (static map image or embed), and the booking box (Task 16) in a sticky sidebar on desktop.
- `AmenityList` props: `amenities: string[]`. Ignores unknown keys.

Acceptance:
- [ ] Visiting `/en/apartments/apartment-1` shows that apartment.
- [ ] Unknown slug returns 404.
- [ ] `npm run build` succeeds.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: apartment detail page, gallery, amenities"
```

---

## Task 16: Availability calendar + booking request form

**Files:**
- Create: `components/availability-calendar.tsx`, `components/booking-request-form.tsx`

USE frontend-design + ui-ux-pro-max skills for styling; logic below is required.

- [ ] **Step 1: `AvailabilityCalendar` (client)**

Props: `blocks`, `confirmed`, `value: {from?: Date; to?: Date}`, `onChange`. Uses `react-day-picker` range mode. Computes `disabled` via `disabledDateMatchers(blocks, confirmed)` plus `{ before: new Date() }` (no past dates). Passes selection up via `onChange`.

- [ ] **Step 2: `BookingRequestForm` (client)**

Props: `apartmentId`, `maxGuests`, `blocks`, `confirmed`, `locale`. Renders `AvailabilityCalendar` + fields (guests, name, email, phone, message). On submit: build ISO `checkIn`/`checkOut` from selected range, POST JSON to `/api/booking-request`. On 200 -> success toast + reset. On 409 -> "those dates are no longer available" toast. On 400 -> field errors. Disable submit unless a valid range and required fields are present. Client-side, mirror `bookingRequestSchema` for instant feedback (import and `safeParse`).

- [ ] **Step 3: Manual verification** (needs live DB + env — do during setup/deploy step)

Select available dates, submit -> expect success toast + a row in `booking_requests` (status pending) + owner email. Select dates overlapping the seeded confirmed booking on apartment-1 -> submit disabled or 409.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: availability calendar and booking request form"
```

---

## Task 17: About/Area + Contact pages

**Files:**
- Create: `app/[locale]/about/page.tsx`, `app/[locale]/contact/page.tsx`

USE frontend-design + ui-ux-pro-max skills. Requirements:

- About/Area: Naupaktos intro copy (bilingual), things-to-do highlights, map of the town.
- Contact: intro, phone, email, embedded map pin, and a simple contact message form (can reuse Resend via a `/api/contact` route mirroring Task 11 minus availability — or a `mailto:` fallback for now; ponytail: mailto is acceptable for Phase 1).

Acceptance:
- [ ] Both pages render bilingually.
- [ ] `npm run build` succeeds.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: about/area and contact pages"
```

---

## Task 18: Final Phase 1 verification

- [ ] **Step 1: Full test run**

Run: `npm test`
Expected: availability + booking-validation suites PASS.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds, all routes compile, both locales generated.

- [ ] **Step 3: Lint/typecheck**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 4: Setup checklist doc**

Create `SETUP.md` listing the exact steps the owner does: create Supabase project, copy DATABASE_URL + keys into `.env.local`, run `npm run db:push`, run `npm run db:seed`, create Resend account + verify domain (or use onboarding domain), set `OWNER_NOTIFICATION_EMAIL`, deploy to Vercel with the same env vars.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: phase 1 verification + setup docs"
```

---

## Self-Review

**Spec coverage:**
- Public pages (home, list, detail, about, contact) -> Tasks 12-17. Covered.
- Bilingual GR/EN + switcher -> Task 7, 12. Covered.
- Search + filters (9-20 units) -> Task 14 + `listApartments`. Covered.
- Live availability calendar -> Tasks 5, 16. Covered.
- Request-to-book + owner email -> Tasks 6, 10, 11, 16. Covered.
- Data model (apartments, availability_blocks, booking_requests) -> Task 4. Covered.
- Design direction (Mediterranean editorial) -> frontend-design/ui-ux-pro-max noted on UI tasks. Covered.
- Placeholder content -> Task 9. Covered.
- Admin dashboard -> intentionally deferred to Phase 2 plan. Not in scope here (correct).

**Placeholder scan:** No "TBD"/"implement later" in logic tasks. UI tasks intentionally delegate visual markup to the frontend-design/ui-ux-pro-max skills with explicit data contracts and acceptance criteria, which is the agreed division of labor, not a plan gap.

**Type consistency:** `Apartment`/`AvailabilityBlock`/`BookingRequest` types from Task 4 used consistently. `isRangeAvailable`/`disabledDateMatchers` (Task 5) signatures match usage in Tasks 11 and 16. `bookingRequestSchema` (Task 6) used in Tasks 11 and 16. `listApartments`/`getApartmentBySlug`/`getApartmentAvailability` (Task 8) used in Tasks 11, 13, 14, 15, 16. Consistent.

## Notes for execution

- Tasks 1-11 need no live services and can be built/tested offline (weak-machine friendly). Tasks needing a live DB/email (seed run, form manual test) happen during the SETUP.md step or after Vercel deploy.
- Env is required before `db:push`/`db:seed`/manual form test. The owner supplies Supabase + Resend credentials at the setup step.
