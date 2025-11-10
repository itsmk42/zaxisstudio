-- Create table for admin users
create table if not exists public.admin_users (
  id bigserial primary key,
  username text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Index for quick lookup
create index if not exists admin_users_username_idx on public.admin_users (username);

