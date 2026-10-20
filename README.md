# HyreMoto Affiliate Seminar

One public seminar landing page, plus a private admin view. Original forest-green, ivory, gold, Syne and Plus Jakarta Sans styling retained. Removed fleet pages, commission estimator, VIP ticketing, invented speakers, reservation counters and earnings claims.

## Run locally (Node 22.12+ or Node 24 recommended)

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To use a different port: `npm run dev -- --port 3001`.

## Add your hero video

Put your video at **public/videos/hero.mp4**. That exact filename is already wired into the hero.

Use a landscape H.264 MP4, ideally 10–20 seconds, compressed for web. No import or code change is needed. Restart/reload if the page was already open when you added it. The muted video autoplays and loops with a genuine pause/play button. If autoplay is blocked, motion is reduced or the file is missing, the local green graphic remains visible. Reduced-motion visitors receive no background video request. To adjust the crop, edit `objectPosition` in `src/components/HeroSection.tsx`.

The local fallback is `public/images/hero-poster.svg`. You may replace it with a real poster and update `posterUrl` in the same component.

## Supabase status

Integration code is included, but no live project is configured or deployed. The form remains closed until all browser configuration is supplied. No success message appears unless the endpoint confirms persistence or an existing registration. No attendee data is stored in localStorage. Email/WhatsApp delivery is not connected.

## Connect the dedicated project

1. Create/select a dedicated HyreMoto Supabase project. Do not reuse an unrelated production database.
2. Run `supabase/setup.sql` once in its SQL Editor. RLS permits attendee reads only for explicitly approved seminar admins; public direct reads, inserts, updates and deletes are denied. The server-side function handles registration inserts.
3. Create a Cloudflare Turnstile widget for the actual frontend hostname (and localhost for testing). Copy its public site key into `.env.local` alongside the Supabase URL and publishable key using `.env.example`.
4. Deploy `supabase/functions/register-seminar` with JWT verification disabled as declared in `supabase/config.toml`. This is an intentionally public endpoint: the handler enforces origin checks, field validation, a mandatory verified Turnstile challenge/action/hostname, request limits and a database-backed rate limit. Privileged keys stay in the function runtime.
5. Set the server secrets from `supabase/.env.example`. ALLOWED_ORIGINS is a comma-separated list of exact origins, without trailing slashes. Generate a long random RATE_LIMIT_SALT. Keep REGISTRATION_OPEN=false until verified. The project's SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by Supabase.
6. Create admin users privately in Supabase Authentication. Add each approved user UUID to `seminar_admins` through SQL. Do not enable public admin signup. Require appropriate password security and configure Auth restrictions for your domain.
7. Open `http://localhost:3000/#admin` (or the deployed site's `/#admin` in a new tab). Sign in to search/filter attendees and export all matching rows to CSV. The table displays the first 200 matches; export includes all fetched matches. Export protects against spreadsheet formula injection.
8. Confirm the event copy, privacy notice, approved contacts and actual date before launch. Add HyreMoto’s approved privacy notice/link; the current purpose text does not replace it. Then set REGISTRATION_OPEN=true and rebuild with browser environment values.

## Verification before launch

- Real submission persists one row with consent text/version and server timestamps.
- Retry with the same email creates no duplicate and does not overwrite another attendee's details.
- Missing consent, malformed data, invalid challenge and unapproved origins fail.
- Anonymous users cannot read attendee information or write directly to tables.
- A signed-in user without explicit admin membership cannot view or export registrations.
- Admin filters and CSV export return expected results.
- Test the actual supplied MP4 on mobile and desktop, including pause/play and reduced-motion.

The files have local build/type checks; live database/access checks require the dedicated project. No emails or WhatsApp messages are sent by this package.

## Build and hosting

```sh
npm run typecheck
npm run build
```

Deploy `dist/` to a static host. Public assets are copied during build, so add the MP4 before building. Admin uses `/#admin`, requiring no special rewrite. React escapes displayed attendee values; only explicitly approved admins have database read access.
