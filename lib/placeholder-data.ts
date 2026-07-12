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
  { slug: "studio-garden", titleEl: "Πνοή", titleEn: "Pnoe", descriptionEl: "Φωτεινό στούντιο στην πλευρά του κήπου, στο ισόγειο του συγκροτήματος, λίγα βήματα από το λιμάνι.", descriptionEn: "A bright studio on the garden side of the ground floor, a few steps from the harbour.", price: 68, capacity: 2, bedrooms: 1, bathrooms: 1, sizeSqm: 32, amenities: ["wifi", "ac", "kitchen", "coffee"], seaView: false },
  { slug: "studio-sea", titleEl: "Αύρα", titleEn: "Avra", descriptionEl: "Στούντιο στον πρώτο όροφο, στην μπροστινή πλευρά του κτιρίου, με θέα στη θάλασσα.", descriptionEn: "A first-floor studio at the front of the building, with sea view over the gulf.", price: 82, capacity: 2, bedrooms: 1, bathrooms: 1, sizeSqm: 34, amenities: ["wifi", "ac", "sea_view", "kitchen", "coffee", "tv"], seaView: true },
  { slug: "one-bed-garden", titleEl: "Γαλήνη", titleEn: "Galini", descriptionEl: "Ήσυχο διαμέρισμα ενός υπνοδωματίου στην πλευρά του κήπου, ιδανικό για ζευγάρι.", descriptionEn: "A quiet one-bedroom on the garden side, ideal for a couple.", price: 88, capacity: 3, bedrooms: 1, bathrooms: 1, sizeSqm: 45, amenities: ["wifi", "ac", "kitchen", "balcony", "washer"], seaView: false },
  { slug: "one-bed-sea", titleEl: "Ζέφυρος", titleEn: "Zephyros", descriptionEl: "Διαμέρισμα ενός υπνοδωματίου στον δεύτερο όροφο, με μπαλκόνι και θέα στη θάλασσα.", descriptionEn: "A one-bedroom apartment on the second floor with a sea-view balcony.", price: 100, capacity: 3, bedrooms: 1, bathrooms: 1, sizeSqm: 48, amenities: ["wifi", "ac", "sea_view", "kitchen", "balcony", "tv"], seaView: true },
  { slug: "one-bed-balcony", titleEl: "Νεφέλη", titleEn: "Nefeli", descriptionEl: "Άνετο διαμέρισμα ενός υπνοδωματίου με μεγάλο μπαλκόνι πάνω από την αυλή.", descriptionEn: "A comfortable one-bedroom with a large balcony over the courtyard.", price: 92, capacity: 2, bedrooms: 1, bathrooms: 1, sizeSqm: 46, amenities: ["wifi", "ac", "kitchen", "balcony", "coffee"], seaView: false },
  { slug: "two-bed-courtyard", titleEl: "Αιθρία", titleEn: "Aithria", descriptionEl: "Διαμέρισμα δύο υπνοδωματίων με πρόσβαση στην εσωτερική αυλή και πάρκινγκ.", descriptionEn: "A two-bedroom apartment opening onto the inner courtyard, with parking.", price: 105, capacity: 4, bedrooms: 2, bathrooms: 1, sizeSqm: 68, amenities: ["wifi", "ac", "kitchen", "parking", "washer"], seaView: false },
  { slug: "two-bed-sea", titleEl: "Θάλασσα", titleEn: "Thalassa", descriptionEl: "Διαμέρισμα δύο υπνοδωματίων στον τρίτο όροφο, μπροστά, με θέα στη θάλασσα και μπαλκόνι.", descriptionEn: "A third-floor two-bedroom at the front, with sea view and balcony.", price: 125, capacity: 4, bedrooms: 2, bathrooms: 2, sizeSqm: 72, amenities: ["wifi", "ac", "sea_view", "kitchen", "balcony", "tv"], seaView: true },
  { slug: "two-bed-family", titleEl: "Εστία", titleEn: "Estia", descriptionEl: "Ευρύχωρο διαμέρισμα δύο υπνοδωματίων για όλη την οικογένεια, δεκτά κατοικίδια.", descriptionEn: "A roomy two-bedroom that sleeps the whole family, pets welcome.", price: 118, capacity: 6, bedrooms: 2, bathrooms: 2, sizeSqm: 78, amenities: ["wifi", "ac", "kitchen", "parking", "washer", "pets"], seaView: false },
  { slug: "corner-suite", titleEl: "Ίρις", titleEn: "Iris", descriptionEl: "Γωνιακή σουίτα στον τρίτο όροφο με θέα στη θάλασσα από δύο πλευρές.", descriptionEn: "A corner suite on the third floor with sea view on two sides.", price: 135, capacity: 4, bedrooms: 2, bathrooms: 2, sizeSqm: 70, amenities: ["wifi", "ac", "sea_view", "kitchen", "balcony", "coffee"], seaView: true },
  { slug: "three-bed-terrace", titleEl: "Ουρανία", titleEn: "Ourania", descriptionEl: "Διαμέρισμα τριών υπνοδωματίων στον τελευταίο όροφο με ιδιωτική ταράτσα.", descriptionEn: "A three-bedroom on the top floor with a private terrace.", price: 145, capacity: 6, bedrooms: 3, bathrooms: 2, sizeSqm: 95, amenities: ["wifi", "ac", "kitchen", "parking", "balcony", "washer"], seaView: false },
  { slug: "penthouse-sea", titleEl: "Αίθηρ", titleEn: "Aether", descriptionEl: "Το ρετιρέ του τελευταίου ορόφου, μπροστά, με πανοραμική θέα στη θάλασσα και ασανσέρ.", descriptionEn: "The top-floor penthouse at the front, with panoramic sea view and lift.", price: 165, capacity: 4, bedrooms: 2, bathrooms: 2, sizeSqm: 90, amenities: ["wifi", "ac", "sea_view", "kitchen", "balcony", "elevator", "tv", "parking"], seaView: true },
  { slug: "ground-apartment", titleEl: "Ακτή", titleEn: "Akti", descriptionEl: "Ισόγειο διαμέρισμα χωρίς σκαλιά, με πρόσβαση σε κήπο και πάρκινγκ.", descriptionEn: "A step-free ground-floor apartment with garden access and parking.", price: 78, capacity: 4, bedrooms: 2, bathrooms: 1, sizeSqm: 60, amenities: ["wifi", "ac", "kitchen", "parking", "heating", "pets"], seaView: false },
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
