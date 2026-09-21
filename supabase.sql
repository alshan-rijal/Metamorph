create table if not exists public.conversion_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  file_name text not null,
  conversion_type text not null,
  file_count int not null,
  created_at timestamptz default now()
);

alter table public.conversion_history enable row level security;
create policy "Users can view their own history" on public.conversion_history for select using (auth.uid() = user_id);
create policy "Users can insert their own history" on public.conversion_history for insert with check (auth.uid() = user_id);
