// Structured data for Google rich results and AI search. Rendered server-side
// as a plain script tag; content is built from our own data, never user input.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function lodgingBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Ether Naupaktos",
    slogan: "Breath in Tranquility",
    url: BASE,
    logo: `${BASE}/logo-mark.png`,
    image: `${BASE}/og.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Naupaktos",
      postalCode: "303 00",
      addressCountry: "GR",
    },
    geo: { "@type": "GeoCoordinates", latitude: 38.393, longitude: 21.828 },
  };
}

export function apartmentJsonLd(input: {
  name: string;
  description: string;
  slug: string;
  locale: string;
  image?: string;
  price: string;
  capacity: number;
  rating?: string | null;
  reviewCount?: number;
}) {
  const path = input.locale === "el" ? "" : `/${input.locale}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: input.name,
    description: input.description,
    url: `${BASE}${path}/apartments/${input.slug}`,
    image: input.image,
    occupancy: { "@type": "QuantitativeValue", maxValue: input.capacity },
    containedInPlace: { "@type": "LodgingBusiness", name: "Ether Naupaktos" },
  };
  if (input.rating && input.reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(input.rating),
      reviewCount: input.reviewCount,
      bestRating: 5,
    };
  }
  return data;
}

export function faqJsonLd(qa: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
