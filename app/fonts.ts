import { EB_Garamond, Manrope } from "next/font/google";

// Display serif - elegant, editorial, with full Greek + polytonic support.
export const display = EB_Garamond({
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body / UI sans - modern humanist, with Greek support.
export const sans = Manrope({
  subsets: ["latin", "greek"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
