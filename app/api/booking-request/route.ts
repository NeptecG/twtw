import { NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/booking-validation";
import { isRangeAvailable } from "@/lib/availability";
import { getApartmentById, getApartmentAvailability } from "@/lib/apartments";
import { sendBookingRequestEmail, sendGuestConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const apt = await getApartmentById(data.apartmentId);
  if (!apt) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { blocks, confirmed } = await getApartmentAvailability(data.apartmentId);
  if (!isRangeAvailable(data.checkIn, data.checkOut, blocks, confirmed)) {
    return NextResponse.json({ error: "unavailable" }, { status: 409 });
  }

  // Persist only when a database is configured. In offline preview the request
  // is validated and (optionally) emailed but not stored.
  if (process.env.DATABASE_URL) {
    const { db } = await import("@/lib/db/client");
    const { bookingRequests } = await import("@/lib/db/schema");
    await db.insert(bookingRequests).values({
      apartmentId: data.apartmentId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      message: data.message,
      status: "pending",
    });
  }

  try {
    await sendBookingRequestEmail({
      apartmentTitle: apt.titleEn,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      message: data.message,
    });
  } catch (e) {
    // ponytail: request already handled; email failure must not 500 the guest.
    console.error("booking email failed", e);
  }

  try {
    const locale = data.locale ?? "el";
    await sendGuestConfirmationEmail({
      to: data.guestEmail,
      locale,
      guestName: data.guestName,
      apartmentTitle: locale === "el" ? apt.titleEl : apt.titleEn,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
    });
  } catch (e) {
    console.error("guest confirmation email failed", e);
  }

  return NextResponse.json({ ok: true });
}
