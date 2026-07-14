// Same icon set and paths as the gift (Kate) site's footer, so phone,
// mobile, email and the social marks render identically across projects.
const ICONS = {
  phone: {
    fill: "currentColor",
    stroke: "none",
    d: "M6.6 3h3.1l1.6 5-2.2 1.6a12 12 0 0 0 5.3 5.3l1.6-2.2 5 1.6v3.1a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z",
  },
  facebook: {
    fill: "currentColor",
    stroke: "none",
    d: "M14 8.5h2.2V5.6c-.4-.05-1.4-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7v3.1h2.5V22h3.1v-6.9h2.5l.4-3.1h-2.9V9.8c0-.9.25-1.3 1.4-1.3z",
  },
} as const;

export function ContactIcon({
  name,
  className = "h-5 w-5",
}: {
  name: "phone" | "mobile" | "email" | "instagram" | "facebook" | "messenger" | "viber";
  className?: string;
}) {
  if (name === "phone" || name === "facebook") {
    const { d } = ICONS[name];
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d={d} />
      </svg>
    );
  }

  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (name === "mobile") {
    return (
      <svg {...common}>
        <rect x="7" y="3" width="10" height="18" rx="2.5" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    );
  }

  if (name === "email") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3.5 7l8.5 6 8.5-6" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "messenger") {
    return (
      <svg {...common}>
        <path d="M12 3.2c5 0 8.8 3.6 8.8 8.2S17 19.6 12 19.6c-1 0-1.9-.12-2.8-.35L5 21l.4-3.4A8 8 0 0 1 3.2 11.4C3.2 6.8 7 3.2 12 3.2z" />
        <path d="M7.5 13.3l2.8-3 2 1.6 2.3-2.2" strokeWidth={1.5} />
      </svg>
    );
  }

  // viber
  return (
    <svg {...common}>
      <path d="M12 3.5c4.4 0 7.5 2.8 7.5 6.8 0 4-3.1 6.8-7.5 6.8-.8 0-1.5-.08-2.2-.24L6 20l.5-3.1A6.6 6.6 0 0 1 4.5 10.3C4.5 6.3 7.6 3.5 12 3.5z" />
      <path d="M9.2 8.2c1.2-.2 2.4.3 3.2 1.1.8.8 1.3 2 1.1 3.2" strokeWidth={1.5} />
    </svg>
  );
}
