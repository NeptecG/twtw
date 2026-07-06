import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["el", "en"],
  defaultLocale: "el",
  // Greek (default) has no prefix ("/"); English is served under "/en".
  localePrefix: "as-needed",
  // Root is always Greek; do not auto-redirect by browser language.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
