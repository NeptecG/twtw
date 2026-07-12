# Ether Naupaktos

Bilingual (Greek/English) holiday-rental website for apartments in Naupaktos,
Greece. Guests browse apartments, check live availability, and send a
request-to-book that emails the owner. No online payments.

Built with Next.js 15 (App Router), Supabase (Postgres + Storage), Drizzle,
next-intl, Tailwind + shadcn/ui, react-day-picker, and Resend.

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
```

Runs on realistic placeholder content with no accounts required. To connect a
real database and enable booking emails, see **[SETUP.md](SETUP.md)**.

## Structure

- `app/[locale]/` - public pages (home, apartments, apartment detail, about, contact)
- `app/api/booking-request/` - validate + store + email a booking request
- `lib/availability.ts` - pure availability computation (unit-tested)
- `lib/booking-validation.ts` - request validation schema (unit-tested)
- `lib/apartments.ts` - data access (falls back to placeholders with no DB)
- `lib/db/schema.ts` - Drizzle database schema
- `messages/` - Greek + English translations
- `docs/superpowers/` - design spec and implementation plan

## Roadmap

- **Phase 1 (done):** public bilingual booking site.
- **Phase 2:** owner admin dashboard (login, manage apartments/availability/requests).
- **Phase 3:** SEO polish, sitemap, domain, deploy.
