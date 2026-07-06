# TWTW Naupaktos — Setup Guide

This is the Phase 1 public booking site: bilingual (Greek/English) apartment
listings with a live availability calendar and a request-to-book flow that
emails the owner. No online payments.

## What works with zero setup

Out of the box (no accounts, no database), the site runs on realistic
placeholder apartments so you can see and share it immediately:

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /el)
```

In this "offline" mode, booking requests are validated and confirmed to the
guest, but not stored and not emailed (there is nowhere to store or send them
yet). Everything else — browsing, filtering, calendars, both languages — is
fully live.

## Going live (real bookings + emails)

You will create three free accounts: **Supabase**, **Resend**, **Vercel**.
Nothing costs money to start.

### 1. Supabase (database + photo storage)

1. Create a project at https://supabase.com.
2. In **Project Settings → Database → Connection string**, copy the **URI**
   (use the connection pooler, port `6543`). This is your `DATABASE_URL`.
3. In **Project Settings → API**, copy the **Project URL**, the **anon** key,
   and the **service_role** key.

### 2. Environment variables

Copy the example file and fill it in:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...      # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=... # anon key
SUPABASE_SERVICE_ROLE_KEY=...     # service_role key
DATABASE_URL=...                  # the pooler URI from step 1

RESEND_API_KEY=...                # from step 3
OWNER_NOTIFICATION_EMAIL=you@example.com   # where booking requests are sent
FROM_EMAIL=onboarding@resend.dev           # verified sender (see step 3)

NEXT_PUBLIC_SITE_URL=https://your-domain.gr
```

### 3. Create the tables and seed content

```bash
npm run db:push     # creates the apartments / availability / booking tables
npm run db:seed     # loads the placeholder apartments into the database
```

### 4. Resend (owner notification emails)

1. Create an account at https://resend.com and make an **API key** →
   `RESEND_API_KEY`.
2. To send from your own domain, add and verify it in Resend, then set
   `FROM_EMAIL=bookings@your-domain.gr`. To just try it out, leave
   `FROM_EMAIL=onboarding@resend.dev` (Resend's shared test sender).
3. Set `OWNER_NOTIFICATION_EMAIL` to the address that should receive booking
   requests.

Now a submitted booking request is stored as `pending` and emailed to the
owner.

### 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at https://vercel.com.
3. Add all the variables from `.env.local` in the Vercel project settings.
4. Deploy. Point your domain at it.

## Replacing the placeholder apartments

Until the Phase 2 admin dashboard is built, the content lives in
`lib/placeholder-data.ts`. Edit titles, prices, descriptions, amenities and
photo URLs there, then run `npm run db:seed` again to reload the database
(or just redeploy if running in offline mode).

Phase 2 will add a private admin login where the owner manages apartments,
availability and booking requests without touching code.

## Useful commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm test` | Availability + validation unit tests |
| `npm run db:push` | Apply the schema to Supabase |
| `npm run db:seed` | Load placeholder apartments |
