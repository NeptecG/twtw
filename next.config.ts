import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Owner pastes photo URLs from anywhere; a strict host whitelist made the
    // page crash on unknown hosts. Any https image is accepted (and local
    // files under /public always work).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default withNextIntl(nextConfig);
