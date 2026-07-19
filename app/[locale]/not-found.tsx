import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Gift-project 404 pattern: the brand mark stands in for the zero.
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="container-page flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center gap-[clamp(0.5rem,2vw,1.25rem)]">
        <span className="font-display text-[clamp(5rem,4rem+10vw,10rem)] font-medium leading-[0.9] text-ink">
          4
        </span>
        <Image
          src="/logo-mark.png"
          alt=""
          width={840}
          height={858}
          priority
          className="h-auto w-[clamp(4.5rem,3.5rem+9vw,9rem)]"
        />
        <span className="font-display text-[clamp(5rem,4rem+10vw,10rem)] font-medium leading-[0.9] text-ink">
          4
        </span>
      </div>

      <h1 className="mt-8 text-3xl leading-tight sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">{t("text")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-terracotta px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#379e86]"
      >
        {t("cta")}
      </Link>
    </section>
  );
}
