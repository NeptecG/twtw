// Amenity keys are stable ids stored in the DB. Labels come from i18n messages
// under `amenities.<key>`. Icons map to lucide-react icon names used in the UI.
export const AMENITY_KEYS = [
  "wifi",
  "ac",
  "sea_view",
  "parking",
  "pets",
  "kitchen",
  "washer",
  "balcony",
  "tv",
  "heating",
  "coffee",
  "elevator",
] as const;

export type AmenityKey = (typeof AMENITY_KEYS)[number];

export function isAmenityKey(value: string): value is AmenityKey {
  return (AMENITY_KEYS as readonly string[]).includes(value);
}
