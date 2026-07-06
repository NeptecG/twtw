import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local first (see SETUP.md).");
    process.exit(1);
  }

  // Dynamic imports so dotenv runs before the DB client reads DATABASE_URL.
  const { db } = await import("../lib/db/client");
  const { apartments, availabilityBlocks, bookingRequests } = await import("../lib/db/schema");
  const { placeholderApartments, placeholderBlocks, placeholderConfirmed } = await import(
    "../lib/placeholder-data"
  );

  console.log("Clearing existing data…");
  await db.delete(bookingRequests);
  await db.delete(availabilityBlocks);
  await db.delete(apartments);

  console.log("Inserting apartments…");
  await db.insert(apartments).values(placeholderApartments);

  console.log("Inserting availability blocks…");
  await db.insert(availabilityBlocks).values(placeholderBlocks);

  console.log("Inserting confirmed bookings…");
  await db.insert(bookingRequests).values(
    placeholderConfirmed.map((c) => ({
      apartmentId: c.apartmentId,
      checkIn: c.checkIn,
      checkOut: c.checkOut,
      guests: 2,
      guestName: "Seed Guest",
      guestEmail: "guest@example.com",
      status: "confirmed" as const,
    })),
  );

  console.log(`Seeded ${placeholderApartments.length} apartments.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
