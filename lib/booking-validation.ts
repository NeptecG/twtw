import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

export const bookingRequestSchema = z
  .object({
    apartmentId: z.uuid(),
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.number().int().min(1).max(30),
    guestName: z.string().trim().min(1).max(120),
    guestEmail: z.email(),
    // Digits and spaces only, optional leading +, 6-17 characters total.
    guestPhone: z
      .string()
      .trim()
      .regex(/^\+?[0-9][0-9 ]{4,15}[0-9]$/, "Invalid phone")
      .optional(),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((v) => new Date(v.checkOut) > new Date(v.checkIn), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
