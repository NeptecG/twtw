import type { Apartment, AvailabilityBlock } from "./db/schema";

// Shared placeholder content. Used by the offline data fallback (when no
// DATABASE_URL is set) AND by the DB seed script, so the site looks identical
// before and after Supabase is connected. Replace via the admin panel later.

const now = new Date();

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const PHOTOS = [
  "photo-1502672260266-1c1ef2d93688",
  "photo-1522708323590-d24dbb6b0267",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1505693416388-ac5ce068fe85",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1502005229762-cf1b2da7c5d6",
  "photo-1520250497591-112f2f40a3f4",
  "photo-1512917774080-9991f1c4c750",
  "photo-1502920917128-1aa500764cbd",
].map(photo);

const photosFor = (i: number) => [
  PHOTOS[i % PHOTOS.length],
  PHOTOS[(i + 3) % PHOTOS.length],
  PHOTOS[(i + 6) % PHOTOS.length],
];

type Spec = {
  slug: string;
  titleEl: string;
  titleEn: string;
  descriptionEl: string;
  descriptionEn: string;
  price: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  amenities: string[];
  seaView: boolean;
};

const SPECS: Spec[] = [
  { slug: "harbour-loft", titleEl: "Σοφίτα στο Λιμάνι", titleEn: "Harbour Loft", descriptionEl: "Φωτεινή σοφίτα με θέα στο ενετικό λιμάνι, λίγα βήματα από τα καφέ.", descriptionEn: "Bright loft overlooking the Venetian harbour, steps from the cafes.", price: 95, capacity: 2, bedrooms: 1, bathrooms: 1, sizeSqm: 48, amenities: ["wifi", "ac", "sea_view", "kitchen", "coffee", "tv"], seaView: true },
  { slug: "psani-beach-suite", titleEl: "Σουίτα Ψανή", titleEn: "Psani Beach Suite", descriptionEl: "Ευρύχωρη σουίτα δίπλα στην παραλία Ψανή, ιδανική για ζευγάρια.", descriptionEn: "Spacious suite by Psani beach, ideal for couples.", price: 110, capacity: 3, bedrooms: 1, bathrooms: 1, sizeSqm: 55, amenities: ["wifi", "ac", "sea_view", "kitchen", "balcony", "washer", "tv"], seaView: true },
  { slug: "kastro-view", titleEl: "Θέα Κάστρο", titleEn: "Kastro View", descriptionEl: "Παραδοσιακό διαμέρισμα με θέα στο κάστρο και την παλιά πόλη.", descriptionEn: "Traditional apartment with views of the castle and old town.", price: 85, capacity: 4, bedrooms: 2, bathrooms: 1, sizeSqm: 70, amenities: ["wifi", "ac", "kitchen", "parking", "heating", "tv"], seaView: false },
  { slug: "grimbovo-garden", titleEl: "Κήπος Γρίμποβο", titleEn: "Grimbovo Garden", descriptionEl: "Ισόγειο με ιδιωτικό κήπο, κοντά στην παραλία Γρίμποβο.", descriptionEn: "Ground-floor flat with a private garden near Grimbovo beach.", price: 120, capacity: 5, bedrooms: 2, bathrooms: 2, sizeSqm: 90, amenities: ["wifi", "ac", "kitchen", "parking", "pets", "balcony", "washer"], seaView: false },
  { slug: "old-town-stone", titleEl: "Πέτρινο Παλιάς Πόλης", titleEn: "Old Town Stone House", descriptionEl: "Πέτρινο σπίτι στα σοκάκια της παλιάς πόλης, γεμάτο χαρακτήρα.", descriptionEn: "Stone house in the old town lanes, full of character.", price: 130, capacity: 4, bedrooms: 2, bathrooms: 1, sizeSqm: 80, amenities: ["wifi", "ac", "kitchen", "heating", "coffee", "tv"], seaView: false },
  { slug: "seafront-studio", titleEl: "Στούντιο στη Θάλασσα", titleEn: "Seafront Studio", descriptionEl: "Κομψό στούντιο πάνω στο κύμα με ηλιοβασίλεμα στον κόλπο.", descriptionEn: "Elegant studio on the water with sunsets over the gulf.", price: 78, capacity: 2, bedrooms: 1, bathrooms: 1, sizeSqm: 35, amenities: ["wifi", "ac", "sea_view", "kitchen", "coffee"], seaView: true },
  { slug: "gulf-panorama", titleEl: "Πανόραμα Κόλπου", titleEn: "Gulf Panorama", descriptionEl: "Ρετιρέ με πανοραμική θέα στη γέφυρα Ρίου-Αντιρρίου.", descriptionEn: "Penthouse with panoramic views to the Rio-Antirrio bridge.", price: 160, capacity: 4, bedrooms: 2, bathrooms: 2, sizeSqm: 95, amenities: ["wifi", "ac", "sea_view", "kitchen", "balcony", "parking", "elevator", "tv"], seaView: true },
  { slug: "family-nest", titleEl: "Οικογενειακή Φωλιά", titleEn: "Family Nest", descriptionEl: "Άνετο τριάρι για οικογένειες, κοντά σε σχολεία και αγορά.", descriptionEn: "Comfortable three-room flat for families, near shops and market.", price: 105, capacity: 6, bedrooms: 3, bathrooms: 2, sizeSqm: 110, amenities: ["wifi", "ac", "kitchen", "parking", "washer", "heating", "pets"], seaView: false },
  { slug: "captains-quarters", titleEl: "Κατάλυμα Καπετάνιου", titleEn: "Captain's Quarters", descriptionEl: "Ναυτικής αισθητικής διαμέρισμα δίπλα στο φάρο του λιμανιού.", descriptionEn: "Nautical-styled apartment beside the harbour lighthouse.", price: 100, capacity: 3, bedrooms: 1, bathrooms: 1, sizeSqm: 52, amenities: ["wifi", "ac", "sea_view", "kitchen", "coffee", "balcony"], seaView: true },
  { slug: "olive-terrace", titleEl: "Ταράτσα Ελιάς", titleEn: "Olive Terrace", descriptionEl: "Διαμέρισμα με μεγάλη ταράτσα ανάμεσα σε ελιές, ήσυχη γειτονιά.", descriptionEn: "Apartment with a large terrace among olive trees, quiet area.", price: 88, capacity: 4, bedrooms: 2, bathrooms: 1, sizeSqm: 75, amenities: ["wifi", "ac", "kitchen", "parking", "balcony", "pets"], seaView: false },
  { slug: "marina-hideaway", titleEl: "Καταφύγιο Μαρίνας", titleEn: "Marina Hideaway", descriptionEl: "Ήσυχο διαμέρισμα κοντά στη μαρίνα, ιδανικό για χαλάρωση.", descriptionEn: "Quiet apartment near the marina, ideal for unwinding.", price: 92, capacity: 2, bedrooms: 1, bathrooms: 1, sizeSqm: 45, amenities: ["wifi", "ac", "sea_view", "kitchen", "washer", "tv"], seaView: true },
  { slug: "mountain-breeze", titleEl: "Αύρα Βουνού", titleEn: "Mountain Breeze", descriptionEl: "Διαμέρισμα στους πρόποδες της Ναυπακτίας με θέα στην πόλη.", descriptionEn: "Apartment on the slopes of Nafpaktia with views over town.", price: 72, capacity: 4, bedrooms: 2, bathrooms: 1, sizeSqm: 68, amenities: ["wifi", "ac", "kitchen", "parking", "heating", "coffee"], seaView: false },
];

// Stable, RFC-valid v4 UUIDs (version nibble 4, variant nibble 8).
const id = (n: number) => {
  const nn = n.toString(16).padStart(4, "0");
  const tail = n.toString(16).padStart(12, "0");
  return `11111111-${nn}-4a1b-8c2d-${tail}`;
};

export const placeholderApartments: Apartment[] = SPECS.map((s, i) => ({
  id: id(i + 1),
  slug: s.slug,
  titleEl: s.titleEl,
  titleEn: s.titleEn,
  descriptionEl: s.descriptionEl,
  descriptionEn: s.descriptionEn,
  pricePerNight: s.price.toFixed(2),
  capacity: s.capacity,
  bedrooms: s.bedrooms,
  bathrooms: s.bathrooms,
  sizeSqm: s.sizeSqm,
  amenities: s.amenities,
  photos: photosFor(i),
  areaLabel: "Naupaktos, Greece",
  lat: "38.393000",
  lng: "21.828000",
  seaView: s.seaView,
  published: true,
  createdAt: now,
  updatedAt: now,
}));

export const placeholderBlocks: AvailabilityBlock[] = [
  { id: id(101), apartmentId: id(1), startDate: "2026-08-10", endDate: "2026-08-14", reason: "Owner block" },
];

// Confirmed bookings that make the calendar visibly show unavailable dates.
export const placeholderConfirmed: {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
}[] = [
  { apartmentId: id(1), checkIn: "2026-08-20", checkOut: "2026-08-25" },
  { apartmentId: id(2), checkIn: "2026-08-05", checkOut: "2026-08-09" },
];
