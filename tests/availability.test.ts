import { describe, it, expect } from "vitest";
import { isRangeAvailable, disabledDateMatchers } from "@/lib/availability";

const blocks = [
  { startDate: "2026-08-10", endDate: "2026-08-14" }, // checkout day free
];
const confirmed = [{ checkIn: "2026-08-20", checkOut: "2026-08-25" }];

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
