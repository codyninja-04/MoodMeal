-- Phase 3: premium tier + saved recipe collection.

-- One profile per auth user, carrying the premium flag.
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  is_premium   boolean not null default false,
  created_at   timestamptz default now()
);

-- Premium-only "recipe box": recipes a user has kept.
create table saved_recipes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  recipe_name   text not null,
  recipe_data   jsonb not null,
  saved_at      timestamptz default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table profiles       enable row level security;
alter table saved_recipes  enable row level security;

create policy "users read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "users update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "users insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "users manage own recipes"
  on saved_recipes for all
  using (auth.uid() = user_id);
