import { siWhatsapp, siViber } from "simple-icons";

const ICONS = { whatsapp: siWhatsapp, viber: siViber } as const;

// Official brand glyphs from the simple-icons dataset, rendered inline so
// they inherit the surrounding text color.
export function BrandIcon({
  name,
  className = "h-4 w-4",
}: {
  name: keyof typeof ICONS;
  className?: string;
}) {
  const icon = ICONS[name];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}
