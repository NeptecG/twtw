import { Resend } from "resend";

export type BookingEmailInput = {
  apartmentTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  message?: string;
};

export async function sendBookingRequestEmail(input: BookingEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL;

  // Not configured (e.g. local preview without keys): skip silently so the
  // guest still gets a success response.
  if (!apiKey || !to || !from) {
    return { skipped: true as const };
  }

  const resend = new Resend(apiKey);
  return resend.emails.send({
    from,
    to,
    replyTo: input.guestEmail,
    subject: `New booking request: ${input.apartmentTitle} (${input.checkIn} to ${input.checkOut})`,
    text: [
      `New booking request for ${input.apartmentTitle}`,
      "",
      `Dates:  ${input.checkIn} to ${input.checkOut}`,
      `Guests: ${input.guests}`,
      `Name:   ${input.guestName}`,
      `Email:  ${input.guestEmail}`,
      `Phone:  ${input.guestPhone ?? "-"}`,
      "",
      `Message:`,
      input.message ?? "-",
    ].join("\n"),
  });
}
