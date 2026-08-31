-- Jasmine Pollux Blooms Dashboard — Supabase schema
-- Run this once in Supabase SQL Editor (Dashboard > SQL Editor > New query > Run)

create extension if not exists pgcrypto;

create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  mobile text,
  address text,
  gst text,
  pan text,
  email text,
  bank_details text,
  created_at timestamptz default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  code text,
  colour text,
  category text,
  variety text,
  qty int not null default 0,
  unit text,
  rate numeric not null default 0,
  location text,
  bill_no text,
  vendor_name text,
  status text,
  created_at timestamptz default now()
);

create table if not exists stock_transfers (
  id uuid primary key default gen_random_uuid(),
  code text,
  name text,
  qty int not null default 0,
  received_date date,
  transfer_date date,
  location text,
  created_at timestamptz default now()
);

create table if not exists damage_stock (
  id uuid primary key default gen_random_uuid(),
  code text,
  name text,
  qty int not null default 0,
  received_date date,
  transfer_date date,
  location text,
  remarks text,
  created_at timestamptz default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  bill_no text,
  doc_type text default 'orderform',
  client text,
  delivery_location text,
  reference text,
  taxable numeric default 0,
  transport numeric default 0,
  total numeric default 0,
  date text,
  d_date text,
  due text,
  status text default 'Unpaid',
  items jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists cash_vouchers (
  id uuid primary key default gen_random_uuid(),
  v_no text,
  paid_to text,
  date text,
  total numeric default 0,
  rows jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  v_no text,
  received_from text,
  date text,
  total numeric default 0,
  rows jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  source text,
  interest text,
  date text,
  status text default 'New',
  created_at timestamptz default now()
);

create table if not exists quotations (
  id uuid primary key default gen_random_uuid(),
  no text,
  client text,
  service text,
  amount numeric default 0,
  date text,
  valid text,
  status text default 'Pending',
  created_at timestamptz default now()
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  role text,
  last_login text default '—',
  status text default 'Active',
  created_at timestamptz default now()
);

-- Enable Row Level Security and allow the app's anon key full access.
-- This app has its own login screen (not Supabase Auth), so every table
-- is opened up to the anon role. Anyone with the public anon key (which is
-- embedded in the deployed site, as intended) can read/write this data —
-- fine for an internal team tool, but know that trade-off going in.
alter table vendors enable row level security;
alter table inventory_items enable row level security;
alter table stock_transfers enable row level security;
alter table damage_stock enable row level security;
alter table invoices enable row level security;
alter table cash_vouchers enable row level security;
alter table receipts enable row level security;
alter table leads enable row level security;
alter table quotations enable row level security;
alter table app_users enable row level security;

create policy "allow anon all - vendors" on vendors for all using (true) with check (true);
create policy "allow anon all - inventory_items" on inventory_items for all using (true) with check (true);
create policy "allow anon all - stock_transfers" on stock_transfers for all using (true) with check (true);
create policy "allow anon all - damage_stock" on damage_stock for all using (true) with check (true);
create policy "allow anon all - invoices" on invoices for all using (true) with check (true);
create policy "allow anon all - cash_vouchers" on cash_vouchers for all using (true) with check (true);
create policy "allow anon all - receipts" on receipts for all using (true) with check (true);
create policy "allow anon all - leads" on leads for all using (true) with check (true);
create policy "allow anon all - quotations" on quotations for all using (true) with check (true);
create policy "allow anon all - app_users" on app_users for all using (true) with check (true);

-- Seed the 3 real vendors
insert into vendors (code, name, mobile, address, gst, pan, email, bank_details) values
  ('JPB00001', 'Black Tulip Flowers Intl', '+91 89706 36427', '#2&3, Shree AMM Residency, Dr. Marigowda Road, Hosur Main Road, Bengaluru', '29XXXXXXXXXXXXX', 'AAXXX0000X', 'sales.btfi@btfgroup.com', 'ICICI Bank — A/c 000000000000'),
  ('JPB00002', 'Misty Blooms', '+91 94833 96546', '230/4, 12th Cross Road, Wilson Garden, Bangalore', '29XXXXXXXXXXXXX', 'AAXXX0000X', 'accounts@mistybloom.in', 'ICICI Bank — A/c 343605000393'),
  ('JPB00003', 'Amazis Flora', '+91 93431 78474', 'Hosur Main Road, Bengaluru', '29XXXXXXXXXXXXX', 'AAXXX0000X', 'amazisflora@example.com', '—')
on conflict do nothing;

-- Seed the 2 real cash vouchers
insert into cash_vouchers (v_no, paid_to, date, total, rows) values
  ('CV-001', 'Misty Blooms', '21-Jun-2026', 6560, '[{"ref":"","desc":"Anthurium supply","col3":"","amount":6560}]'),
  ('CV-002', 'Black Tulip Flowers Intl', '20-Jul-2026', 16850, '[{"ref":"","desc":"Flower order","col3":"","amount":16850}]')
on conflict do nothing;

-- Seed your login account
insert into app_users (name, email, role, status) values
  ('Jasmine', 'jasminepolluxblooms@gmail.com', 'Admin', 'Active')
on conflict do nothing;
