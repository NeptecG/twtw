import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const requestStatus = pgEnum("request_status", [
  "pending",
  "confirmed",
  "declined",
]);

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
  apartmentId: uuid("apartment_id")
    .notNull()
    .references(() => apartments.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason"),
});

export const bookingRequests = pgTable("booking_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  apartmentId: uuid("apartment_id")
    .notNull()
    .references(() => apartments.id, { onDelete: "cascade" }),
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
export type NewApartment = typeof apartments.$inferInsert;
export type AvailabilityBlock = typeof availabilityBlocks.$inferSelect;
export type BookingRequest = typeof bookingRequests.$inferSelect;
