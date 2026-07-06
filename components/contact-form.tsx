"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const OWNER_EMAIL = "hello@twtw-naupaktos.gr";

export function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Website enquiry — ${name || "Guest"}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="c-name">{t("name")}</Label>
        <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="c-email">{t("email")}</Label>
        <Input
          id="c-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="c-message">{t("message")}</Label>
        <Textarea
          id="c-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
        />
      </div>
      <Button
        type="submit"
        className="rounded-full bg-terracotta px-7 py-6 text-base font-semibold text-primary-foreground hover:bg-[#a33f26]"
      >
        {t("send")}
      </Button>
    </form>
  );
}
