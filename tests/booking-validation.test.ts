import { describe, it, expect } from "vitest";
import { bookingRequestSchema } from "@/lib/booking-validation";

const valid = {
  apartmentId: "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
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
    void guestPhone;
    void message;
    expect(bookingRequestSchema.safeParse(rest).success).toBe(true);
  });
  it("rejects a phone containing letters", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, guestPhone: "69abc12345" }).success).toBe(false);
  });
  it("accepts a phone with spaces and leading plus", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, guestPhone: "+30 690 000 0000" }).success).toBe(true);
  });
  it("rejects a phone longer than 17 characters", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, guestPhone: "+30 690 000 00000 000" }).success).toBe(false);
  });
});
