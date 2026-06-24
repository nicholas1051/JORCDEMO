-- Contact messages
create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Facility / Multimedia room bookings
create table if not exists public.facility_bookings (
  id bigint generated always as identity primary key,
  org_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  purpose text not null,
  participants int default 1,
  date date not null,
  time_slot text not null,
  additional_info text,
  source text default 'contact',
  created_at timestamptz not null default now()
);

-- Program registrations
create table if not exists public.program_registrations (
  id bigint generated always as identity primary key,
  program text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  message text,
  created_at timestamptz not null default now()
);

-- Donation intents (linked to payment later)
create table if not exists public.donation_intents (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  country text,
  phone text,
  amount numeric not null,
  anonymous bool not null default false,
  created_at timestamptz not null default now()
);

-- Community comments (persist instead of local state)
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id bigint references public.posts(id) on delete cascade,
  author_name text not null,
  content text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Enable row-level security (all inserts allowed, reads only for approved/admin)
alter table public.contact_messages enable row level security;
alter table public.facility_bookings enable row level security;
alter table public.program_registrations enable row level security;
alter table public.donation_intents enable row level security;
alter table public.comments enable row level security;

-- Allow anonymous inserts on all form tables
create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  with check (true);

create policy "Anyone can insert facility bookings"
  on public.facility_bookings for insert
  with check (true);

create policy "Anyone can insert program registrations"
  on public.program_registrations for insert
  with check (true);

create policy "Anyone can insert donation intents"
  on public.donation_intents for insert
  with check (true);

create policy "Anyone can insert comments"
  on public.comments for insert
  with check (true);

-- RLS for posts (Community) - ensure it exists already
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'posts' and policyname = 'Anyone can insert posts') then
    create policy "Anyone can insert posts"
      on public.posts for insert
      with check (true);
  end if;
end $$;
