# TWTW Rentals (Naupaktos) — Design Spec

Date: 2026-07-06
Status: Approved by owner (Neptec), ready for implementation plan.

## Goal

A professional bilingual (Greek/English) website for a set of holiday rental
apartments in Naupaktos, Greece. Guests browse apartments, check live
availability, and send a booking request. The owner confirms requests and
manages all content through a private admin dashboard. No online card payment.

All work lives in `C:\Users\denno\Desktop\To twtw`.

## Decisions (locked with owner)

- Booking model: request-to-book with a live availability calendar. Owner
  confirms or declines. No online payment, no VAT/bank setup.
- Languages: Greek and English, with a language switcher. Greek is the primary
  market language for locals; English for tourists.
- Content management: self-serve admin dashboard so the owner is independent.
- Scale: 9 to 20 units, so listing search and filters are required.
- Content: build with realistic placeholders; real photos/text/prices added
  later through the admin panel.

## Stack

- Next.js (App Router) for the public site, admin, and API routes.
- Supabase for Postgres database, owner authentication, and photo storage.
- Tailwind CSS + shadcn/ui for accessible, clean components.
- next-intl for Greek/English localization.
- react-day-picker for availability calendars.
- Resend for booking-request notification emails.
- Deploy on Vercel. Owner needs free accounts: Supabase, Resend, Vercel.

Rationale: Supabase collapses database, auth, and file storage into one managed
service, removing large amounts of custom backend code. Next.js on Vercel gives
SEO, one deploy target, and matches the owner's existing Vercel workflow.

## Architecture

Three logical parts inside one Next.js app:

1. Public site (Greek/English) — marketing and browsing.
2. Booking flow — availability calendar plus request form, writes a pending
   request to the database and emails the owner.
3. Admin dashboard — owner-only, behind Supabase Auth, manages apartments,
   availability, and requests.

### Data flow: booking

Guest selects dates (booked and blocked dates are disabled on the calendar) ->
submits request form (name, email, phone, guest count, message) -> a row is
inserted into `booking_requests` with status `pending` -> Resend emails the
owner -> owner opens admin and confirms or declines -> guest receives a
confirmation or decline email -> on confirm, the dates are treated as
unavailable.

## Data model

- `apartments`
  - id, slug
  - title_el, title_en
  - description_el, description_en
  - price_per_night, currency (EUR)
  - capacity (max guests), bedrooms, bathrooms, size_sqm
  - amenities (wifi, ac, sea_view, parking, pets, kitchen, washer, balcony, etc.)
  - photos (ordered list of storage paths)
  - address / area label, lat, lng (for map)
  - published (bool)
  - created_at, updated_at
- `availability_blocks`
  - id, apartment_id, start_date, end_date, reason (manual block / offline booking)
- `booking_requests`
  - id, apartment_id, check_in, check_out, guests
  - guest_name, guest_email, guest_phone, message
  - status (pending / confirmed / declined)
  - created_at
- Owner account: a single Supabase Auth user. No public sign-up.

Availability for an apartment = date is free unless covered by a confirmed
`booking_request` or an `availability_block`.

## Public pages

- Home: hero with Naupaktos harbor/fortress imagery, featured apartments,
  reasons to stay, location teaser, contact.
- Apartments list: responsive grid of all published units. Filters: guest
  count, price range, sea view, AC, wifi, parking, pets. Text search.
- Apartment detail: photo gallery, description, amenities, capacity, price per
  night, live availability calendar, request-to-book box, location map.
- About / The area: Naupaktos intro, things to do, map.
- Contact: form, phone, email, map pin.

Every page fully bilingual with a language switcher; URLs are locale-prefixed
(`/el/...`, `/en/...`).

## Admin dashboard

Behind login (Supabase Auth email/password, single owner account):

- Overview: pending booking requests front and center.
- Apartments: create, edit, delete; upload and reorder photos; set price,
  capacity, amenities, description in both languages; publish/unpublish.
- Availability: per-apartment calendar; block/unblock dates for offline
  bookings.
- Requests: list all; confirm or decline; view guest details.

## Design direction

Warm Mediterranean editorial. Large imagery, generous whitespace, serif
headings paired with a clean sans body, a sea-and-stone palette (deep blue,
sand, terracotta accent). Deliberately not a generic booking template.
Mobile-first, fast, accessible. Executed with the frontend-design and
ui-ux-pro-max skills.

SEO targets include "Naupaktos apartments", "Nafpaktos accommodation", and
Greek equivalents such as "διαμερίσματα Ναύπακτος" and "ενοικιαζόμενα Ναύπακτος".

## Build order

- Phase 1: Public bilingual site, apartment listings and detail, availability
  calendar, request-to-book flow, owner notification email. Seed placeholder
  apartments.
- Phase 2: Admin dashboard (login, manage apartments, availability, requests).
- Phase 3: Polish, SEO metadata, sitemap, map, deploy to Vercel, connect
  domain.

## Non-goals (YAGNI for now)

- Online card payments.
- Multi-owner / multi-tenant support.
- Reviews and ratings system.
- Channel manager sync with Booking.com / Airbnb.
- Languages beyond Greek and English.

## Constraints and notes

- Owner's local machine is weak for heavy local dev; verify primarily via
  production builds and Vercel preview deploys rather than a long-running local
  dev server.
- Owner is non-technical; anything they must do (create accounts, add env
  vars, add real content) will be guided step by step.
