"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Same behaviour as the Kokkinos / Kate sites: on touch devices tel:/mailto:
// open the dialer or mail app natively; on a PC those links usually do
// nothing, so clicking opens a small dialog with the value and a Copy button.
export function ContactLink({
  kind,
  value,
  href,
  className,
  children,
}: {
  kind: "phone" | "email";
  value: string;
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("contact");
  const [desktop, setDesktop] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setDesktop(window.matchMedia("(pointer: fine)").matches);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      ta.remove();
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <a
        href={href}
        className={className}
        onClick={(e) => {
          if (desktop) {
            e.preventDefault();
            setCopied(false);
            setOpen(true);
          }
        }}
      >
        {children}
      </a>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-3xl border-border bg-card p-8 text-center">
          <DialogTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {kind === "phone" ? t("phone") : t("email")}
          </DialogTitle>
          <p className="font-display text-2xl text-ink break-all">{value}</p>
          <button
            type="button"
            onClick={copy}
            className="mx-auto mt-2 rounded-full bg-terracotta px-7 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#379e86]"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
