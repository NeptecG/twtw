import "./globals.css";
import type { ReactNode } from "react";

// Root layout is a pass-through. The <html>/<body> shell lives in
// app/[locale]/layout.tsx so `lang` can follow the active locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
