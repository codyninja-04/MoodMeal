create extension if not exists "pgcrypto";

-- Mood sessions: one per check-in
create table mood_sessions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete set null,
  session_token       text,                       -- for anonymous users, stored in cookie

  -- Mood inputs
  energy_level        integer not null check (energy_level between 1 and 5),
  stress_level        integer not null check (stress_level between 1 and 5),
  craving_type        text not null check (
                        craving_type in (
                          'light', 'hearty', 'sweet', 'savoury',
                          'warm', 'cold', 'crunchy', 'comfort'
                        )
                      ),

  -- Claude output
  recommendations     jsonb,                      -- full recommendation response stored here
  created_at          timestamptz default now()
);

-- Saved meals: meals a user bookmarked
create table saved_meals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  session_id    uuid references mood_sessions(id),
  meal_name     text not null,
  meal_data     jsonb not null,
  saved_at      timestamptz default now()
);

-- RLS
alter table mood_sessions  enable row level security;
alter table saved_meals    enable row level security;

-- Anonymous sessions are readable by session token (enforced at app level)
-- Authenticated users only see their own sessions
create policy "users see own sessions"
  on mood_sessions for select
  using (
    auth.uid() = user_id
    or user_id is null
  );

create policy "insert session"
  on mood_sessions for insert with check (true);

create policy "update own session"
  on mood_sessions for update
  using (auth.uid() = user_id or user_id is null);

create policy "users manage saved meals"
  on saved_meals for all
  using (auth.uid() = user_id);
