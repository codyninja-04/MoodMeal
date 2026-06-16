# MoodMeal

An AI meal recommendation engine that asks how you feel, not what you want.

Answer three quick questions — energy, stress, craving — and MoodMeal recommends
three meals backed by the nutritional science of the mood-food relationship. It
then finds nearby restaurants serving that dish, or hands you a simple recipe to
make it yourself. The whole thing, from opening the app to a decision, takes
under two minutes.

## How it works

1. **Check in.** A three-question flow (energy slider, stress pills, craving
   grid) captures your current state in about 15 seconds.
2. **Map the mood.** `lib/mood-map.ts` translates the raw inputs into
   nutritional language (slow-release carbs, magnesium, omega-3s…) so Claude
   gets structured intent, not bare numbers.
3. **Recommend.** Claude returns exactly three meals with a one-line reason that
   reads like a friend who knows nutrition, plus the nutrients and a generic
   search term that actually works on a map.
4. **Act.** Tap *Find nearby* to pull restaurants from Google Places, or *Cook
   at home* for a 6-ingredient, 6-step recipe.

## Tech stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS (dark mode from day one, mobile-first)
- **Database + Auth:** Supabase (auth is optional — anonymous sessions via cookie)
- **AI:** Claude API (`claude-sonnet-4-6`)
- **Restaurants:** Google Places API
- **Deploy:** Vercel

## Getting started

```bash
npm install
cp .env.local.example .env.local
# Fill in Supabase, Anthropic, and Google credentials
```

Run the migration in `supabase/migrations/001_initial_schema.sql` from the
Supabase SQL editor, then (optionally) regenerate types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
npm run dev
```

The app runs at `http://localhost:3000`. Supabase is optional for local dev —
without it, recommendations still work, they just aren't persisted.

## Environment variables

See `.env.local.example`. You need an Anthropic key for recommendations and a
server-side Google Places key (scoped to the Places + Geocoding APIs) for the
nearby search. Keep the Places key server-side only — it's never exposed to the
browser, and all calls go through `/api/*` routes.

## Project layout

```
app/            Landing, mood flow, results, optional login, API routes
components/     mood/ · results/ · ui/  (PascalCase, functional, typed)
hooks/          useMoodFlow · useLocation
lib/            claude · places · mood-map · supabase · session
supabase/       SQL migration
```

## Roadmap

- **Phase 1 (done):** mood check-in, Claude recommendations, geolocation,
  Places search, recipe generation, anonymous sessions.
- **Phase 2 (done):** saved meals for signed-in users, mood history page with a
  trend view, "show me three more" on the same mood, and shareable meal cards
  (Web Share / copy link, with an OG image at `/api/og`). Magic-link auth with
  anonymous check-ins migrated to the account on sign-in.
- **Phase 3:** delivery affiliate links, white-label, premium history + trends.
