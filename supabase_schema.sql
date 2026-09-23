-- EduPulse production Supabase schema
-- Run once in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text unique not null,
  student_id text,
  major text,
  bio text,
  year_level text,
  gpa numeric,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text not null,
  progress int not null default 0 check (progress between 0 and 100),
  icon_name text default 'BookOpen',
  instructor text,
  total_lessons int default 20,
  completed_lessons int default 0,
  color_gradient text default 'from-blue-600 to-indigo-600',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  course_code text not null default 'GEN-101',
  course_name text not null default 'General Coursework',
  due_date text not null default 'Upcoming',
  due_time text not null default '11:59 PM',
  status text not null default 'pending',
  weightage int default 10,
  max_score int default 100,
  earned_score int,
  submission_date text,
  file_format text,
  description text,
  feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.schedule_events (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  course_code text not null default 'GEN-101',
  type text not null default 'lecture',
  start_time text not null default '10:00 AM',
  end_time text not null default '11:00 AM',
  day text not null,
  location text,
  instructor text,
  is_online boolean not null default false,
  meeting_url text,
  color text default 'from-blue-600 to-indigo-600',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id text primary key default gen_random_uuid()::text,
  student_id uuid references auth.users(id) on delete cascade not null,
  activity_type text not null,
  duration_minutes int not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Upgrade an existing database created by an older version.
alter table public.profiles add column if not exists year_level text;
alter table public.profiles add column if not exists gpa numeric;
alter table public.courses alter column user_id type uuid using user_id::uuid;
alter table public.assignments add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.schedule_events add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.activity_logs alter column student_id type uuid using student_id::uuid;

create index if not exists courses_user_id_idx on public.courses(user_id);
create index if not exists assignments_user_id_idx on public.assignments(user_id);
create index if not exists schedule_user_id_idx on public.schedule_events(user_id);
create index if not exists activity_student_id_idx on public.activity_logs(student_id);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.assignments enable row level security;
alter table public.schedule_events enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "Public read access for profiles" on public.profiles;
drop policy if exists "Public write access for profiles" on public.profiles;
drop policy if exists "Public read access for courses" on public.courses;
drop policy if exists "Public write access for courses" on public.courses;
drop policy if exists "Public read access for assignments" on public.assignments;
drop policy if exists "Public write access for assignments" on public.assignments;
drop policy if exists "Public read access for schedule_events" on public.schedule_events;
drop policy if exists "Public write access for schedule_events" on public.schedule_events;
drop policy if exists "Public read access for activity_logs" on public.activity_logs;
drop policy if exists "Public write access for activity_logs" on public.activity_logs;

create policy "profiles_owner_select" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_owner_insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_owner_update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "courses_owner_all" on public.courses for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "assignments_owner_all" on public.assignments for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "schedule_owner_all" on public.schedule_events for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "activity_owner_all" on public.activity_logs for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());

do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.courses;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.assignments;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.schedule_events;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.activity_logs;
exception when duplicate_object then null;
end $$;
