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

// Confirmation to the guest so their request does not vanish into a void.
// Plain text, in the language they browsed in.
export async function sendGuestConfirmationEmail(input: {
  to: string;
  locale: "el" | "en";
  guestName: string;
  apartmentTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !from) {
    return { skipped: true as const };
  }

  const el = input.locale === "el";
  const subject = el
    ? `Λάβαμε το αίτημά σας: ${input.apartmentTitle} (${input.checkIn} έως ${input.checkOut})`
    : `We received your request: ${input.apartmentTitle} (${input.checkIn} to ${input.checkOut})`;
  const text = el
    ? [
        `Γεια σας ${input.guestName},`,
        "",
        `Λάβαμε το αίτημα κράτησής σας για το διαμέρισμα "${input.apartmentTitle}".`,
        "",
        `Ημερομηνίες: ${input.checkIn} έως ${input.checkOut}`,
        `Άτομα: ${input.guests}`,
        "",
        "Θα ελέγξουμε τη διαθεσιμότητα και θα επικοινωνήσουμε μαζί σας προσωπικά το συντομότερο.",
        "Δεν έχει γίνει καμία χρέωση. Το αίτημα δεν αποτελεί επιβεβαιωμένη κράτηση.",
        "",
        "Ether Naupaktos",
        "Breath in Tranquility",
      ].join("\n")
    : [
        `Hello ${input.guestName},`,
        "",
        `We received your booking request for the "${input.apartmentTitle}" apartment.`,
        "",
        `Dates: ${input.checkIn} to ${input.checkOut}`,
        `Guests: ${input.guests}`,
        "",
        "We will check availability and get back to you personally as soon as we can.",
        "Nothing has been charged. This request is not a confirmed booking yet.",
        "",
        "Ether Naupaktos",
        "Breath in Tranquility",
      ].join("\n");

  const resend = new Resend(apiKey);
  return resend.emails.send({ from, to: input.to, subject, text });
}
