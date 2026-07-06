"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "home", href: "/" },
  { key: "apartments", href: "/apartments" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          href="/"
          className="group flex items-baseline gap-1.5"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl font-semibold leading-none tracking-tight text-ink">
            TWTW
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta transition-transform group-hover:scale-125" />
          <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            Naupaktos
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "relative text-sm font-medium tracking-wide transition-colors",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(item.key)}
              {isActive(pathname, item.href) && (
                <span className="absolute -bottom-1.5 left-0 h-px w-full bg-terracotta" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/apartments"
            className="hidden rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#379e86] md:inline-block"
          >
            {t("bookNow")}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-wide flex flex-col py-4">
            {NAV.map((item, i) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "animate-fade-up border-b border-border/60 py-3 font-display text-2xl",
                  isActive(pathname, item.href) ? "text-sea" : "text-foreground",
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-5">
              <LanguageSwitcher />
              <Link
                href="/apartments"
                onClick={() => setOpen(false)}
                className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-primary-foreground"
              >
                {t("bookNow")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
