// Google Maps embed (no API key). Shows Google's places layer, so nearby
// restaurants, supermarkets and shops are visible around the building.
// One building: default coords are the complex; replace with the real
// address coordinates when the owner provides them.
const BUILDING = { lat: 38.393, lng: 21.828 };

export function LocationMap({
  lat = BUILDING.lat,
  lng = BUILDING.lng,
  locale,
  title,
  className = "h-[320px]",
}: {
  lat?: number;
  lng?: number;
  locale: string;
  title: string;
  className?: string;
}) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=17&hl=${locale}&output=embed`;
  return (
    <div className={`overflow-hidden rounded-2xl border border-border ${className}`}>
      <iframe
        title={title}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
      />
    </div>
  );
}
