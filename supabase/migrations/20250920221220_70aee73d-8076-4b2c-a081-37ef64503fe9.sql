-- Ensure profile-photos bucket exists and is public
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- Public read policy for profile photos
do $$
begin
  if not exists (
    select 1 from pg_policies where polname = 'Public read for profile-photos'
  ) then
    create policy "Public read for profile-photos"
    on storage.objects
    for select
    using (bucket_id = 'profile-photos');
  end if;
end$$;

-- Users can upload their own photos
do $$
begin
  if not exists (
    select 1 from pg_policies where polname = 'Users can upload their own profile photos'
  ) then
    create policy "Users can upload their own profile photos"
    on storage.objects
    for insert
    with check (
      bucket_id = 'profile-photos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end$$;

-- Users can update their own photos
do $$
begin
  if not exists (
    select 1 from pg_policies where polname = 'Users can update their own profile photos'
  ) then
    create policy "Users can update their own profile photos"
    on storage.objects
    for update
    using (
      bucket_id = 'profile-photos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end$$;

-- Users can delete their own photos
do $$
begin
  if not exists (
    select 1 from pg_policies where polname = 'Users can delete their own profile photos'
  ) then
    create policy "Users can delete their own profile photos"
    on storage.objects
    for delete
    using (
      bucket_id = 'profile-photos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end$$;

-- Ensure RLS for profiles table and policies for self-access
alter table public.profiles enable row level security;

-- View own profile
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'Users can view their own profile') then
    create policy "Users can view their own profile"
    on public.profiles
    for select
    using (auth.uid() = id);
  end if;
end $$;

-- Insert own profile
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'Users can insert their own profile') then
    create policy "Users can insert their own profile"
    on public.profiles
    for insert
    with check (auth.uid() = id);
  end if;
end $$;

-- Update own profile
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'Users can update their own profile') then
    create policy "Users can update their own profile"
    on public.profiles
    for update
    using (auth.uid() = id);
  end if;
end $$;