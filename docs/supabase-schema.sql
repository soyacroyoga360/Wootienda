-- Wootienda / Directorio Negocios - Supabase schema
-- Ejecutar en Supabase SQL Editor sobre una base nueva o de desarrollo.

begin;

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- Shared trigger helper
create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Reserved route slugs
create or replace function public.is_reserved_slug(slug_to_check text)
returns boolean
language sql
stable
set search_path = public
as $$
  select lower(slug_to_check) = any (array[
    'dashboard', 'login', 'register', 'blog', 'admin', 'api', 'auth',
    'settings', 'appearance', 'business', 'products', 'product', 'pricing',
    'planes', 'checkout', 'success', 'cancel', 'help', 'support', 'docs',
    'contact', 'about', 'terms', 'privacy', 'favicon.ico'
  ]);
$$;

-- Businesses
create table if not exists public.businesses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug varchar(100) unique not null,
  business_name varchar(255) not null,
  category varchar(100) not null default 'general',
  industry varchar(100),
  description text,
  short_description varchar(300),
  email varchar(255),
  phone varchar(50),
  whatsapp varchar(50),
  website varchar(500),
  city varchar(100),
  department varchar(100),
  country varchar(100),
  address text,
  schedule text,
  logo_url text,
  banner_url text,
  theme varchar(50) default 'default',
  primary_color varchar(7) default '#EE1D6D',
  is_active boolean default true,
  is_verified boolean default false,
  plan varchar(20) default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint businesses_user_unique unique (user_id),
  constraint businesses_slug_format check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
  constraint businesses_slug_min_length check (char_length(slug) >= 3),
  constraint businesses_slug_max_length check (char_length(slug) <= 100),
  constraint businesses_slug_not_reserved check (not public.is_reserved_slug(slug)),
  constraint businesses_primary_color_format check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint businesses_plan_check check (plan in ('free', 'pro', 'business'))
);

create index if not exists idx_businesses_user_id on public.businesses(user_id);
create index if not exists idx_businesses_slug on public.businesses(slug);
create index if not exists idx_businesses_category on public.businesses(category);
create index if not exists idx_businesses_city on public.businesses(city);
create index if not exists idx_businesses_active on public.businesses(is_active) where is_active = true;
create index if not exists idx_businesses_search on public.businesses using gin (
  (business_name || ' ' || coalesce(description, '') || ' ' || coalesce(city, '') || ' ' || coalesce(country, '')) gin_trgm_ops
);

drop trigger if exists businesses_updated_at on public.businesses;
create trigger businesses_updated_at
  before update on public.businesses
  for each row execute function public.update_updated_at();

-- Product categories
create table if not exists public.product_categories (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name varchar(100) not null,
  slug varchar(100) not null,
  icon varchar(50) default 'Package',
  custom_icon_url text,
  display_order integer default 0,
  created_at timestamptz default now(),
  constraint product_categories_unique_per_business unique (business_id, slug),
  constraint product_categories_slug_format check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$')
);

create index if not exists idx_product_categories_business on public.product_categories(business_id);
create index if not exists idx_product_categories_order on public.product_categories(business_id, display_order);

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  name varchar(255) not null,
  description text,
  short_description varchar(300),
  price numeric(12, 2),
  compare_at_price numeric(12, 2),
  currency varchar(3) default 'COP',
  category varchar(100),
  tags text[] default '{}',
  image_url text,
  images text[] default '{}',
  ai_generated_description boolean default false,
  ai_generated_image boolean default false,
  display_order integer default 0,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint products_price_non_negative check (price is null or price >= 0),
  constraint products_compare_price_non_negative check (compare_at_price is null or compare_at_price >= 0),
  constraint products_currency_length check (char_length(currency) = 3)
);

create index if not exists idx_products_business_id on public.products(business_id);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active on public.products(is_active) where is_active = true;
create index if not exists idx_products_featured on public.products(business_id, is_featured) where is_featured = true;
create index if not exists idx_products_display_order on public.products(business_id, display_order);
create index if not exists idx_products_tags on public.products using gin(tags);
create index if not exists idx_products_search on public.products using gin (
  (name || ' ' || coalesce(description, '') || ' ' || coalesce(category, '')) gin_trgm_ops
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

-- Social links
create table if not exists public.social_links (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  platform varchar(50) not null,
  url text not null,
  display_order integer default 0,
  created_at timestamptz default now(),
  constraint social_links_unique_business_platform unique (business_id, platform),
  constraint social_links_platform_check check (platform in (
    'instagram', 'facebook', 'tiktok', 'twitter', 'x', 'linkedin',
    'youtube', 'website', 'telegram', 'whatsapp'
  ))
);

create index if not exists idx_social_links_business on public.social_links(business_id);
create index if not exists idx_social_links_order on public.social_links(business_id, display_order);

-- Monthly business stats
create table if not exists public.business_stats (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  total_views integer default 0,
  unique_visitors integer default 0,
  product_views integer default 0,
  contact_clicks integer default 0,
  month integer not null,
  year integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint business_stats_unique_month unique (business_id, month, year),
  constraint business_stats_month_check check (month between 1 and 12),
  constraint business_stats_year_check check (year between 2024 and 2200),
  constraint business_stats_non_negative check (
    total_views >= 0 and unique_visitors >= 0 and product_views >= 0 and contact_clicks >= 0
  )
);

create index if not exists idx_business_stats_business on public.business_stats(business_id);
create index if not exists idx_business_stats_period on public.business_stats(year, month);

drop trigger if exists business_stats_updated_at on public.business_stats;
create trigger business_stats_updated_at
  before update on public.business_stats
  for each row execute function public.update_updated_at();

-- Slug history
create table if not exists public.slug_history (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  old_slug varchar(100) not null,
  new_slug varchar(100) not null,
  changed_at timestamptz default now()
);

create index if not exists idx_slug_history_business on public.slug_history(business_id);
create index if not exists idx_slug_history_old on public.slug_history(old_slug);

create or replace function public.track_slug_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.slug is distinct from new.slug then
    insert into public.slug_history (business_id, old_slug, new_slug)
    values (old.id, old.slug, new.slug);
  end if;
  return new;
end;
$$;

drop trigger if exists businesses_track_slug_change on public.businesses;
create trigger businesses_track_slug_change
  after update of slug on public.businesses
  for each row execute function public.track_slug_change();

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug varchar(200) unique not null,
  title varchar(500) not null,
  content text not null,
  excerpt varchar(500),
  cover_image_url text,
  author varchar(255) default 'Equipo Editorial',
  tags text[] default '{}',
  is_published boolean default false,
  published_at timestamptz,
  meta_title varchar(70),
  meta_description varchar(160),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint blog_posts_slug_format check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$')
);

create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_published on public.blog_posts(is_published, published_at desc);
create index if not exists idx_blog_posts_tags on public.blog_posts using gin(tags);

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.update_updated_at();

-- AI generations
create table if not exists public.ai_generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type varchar(20) not null,
  prompt text not null,
  result text,
  model varchar(100),
  tokens_used integer default 0,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz default now(),
  constraint ai_generations_type_check check (type in ('text', 'image')),
  constraint ai_generations_tokens_non_negative check (tokens_used >= 0)
);

create index if not exists idx_ai_generations_user on public.ai_generations(user_id);
create index if not exists idx_ai_generations_type on public.ai_generations(type);
create index if not exists idx_ai_generations_date on public.ai_generations(user_id, created_at desc);
create index if not exists idx_ai_generations_product on public.ai_generations(product_id);

-- RPC helpers
create or replace function public.generate_slug_from_name(business_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  base_slug := lower(unaccent(trim(business_name)));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  if base_slug is null or char_length(base_slug) < 3 then
    base_slug := 'negocio';
  end if;

  final_slug := left(base_slug, 90);

  while public.is_reserved_slug(final_slug)
    or exists (select 1 from public.businesses where slug = final_slug)
  loop
    counter := counter + 1;
    final_slug := left(base_slug, 90) || '-' || counter;
  end loop;

  return final_slug;
end;
$$;

create or replace function public.check_slug_availability(slug_to_check varchar)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if slug_to_check is null
    or slug_to_check !~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'
    or char_length(slug_to_check) < 3
    or char_length(slug_to_check) > 100
    or public.is_reserved_slug(slug_to_check)
  then
    return false;
  end if;

  return not exists (
    select 1 from public.businesses where slug = slug_to_check
  );
end;
$$;

create or replace function public.search_businesses(
  search_term text default '',
  filter_category text default null,
  filter_city text default null,
  page_limit integer default 20,
  page_offset integer default 0
)
returns table (
  id uuid,
  slug varchar,
  business_name varchar,
  short_description varchar,
  category varchar,
  city varchar,
  country varchar,
  logo_url text,
  similarity real
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    b.id,
    b.slug,
    b.business_name,
    b.short_description,
    b.category,
    b.city,
    b.country,
    b.logo_url,
    case
      when coalesce(search_term, '') = '' then 1.0::real
      else similarity(
        b.business_name || ' ' || coalesce(b.description, '') || ' ' || coalesce(b.city, '') || ' ' || coalesce(b.country, ''),
        search_term
      )
    end as similarity
  from public.businesses b
  where b.is_active = true
    and (
      coalesce(search_term, '') = ''
      or (b.business_name || ' ' || coalesce(b.description, '') || ' ' || coalesce(b.city, '') || ' ' || coalesce(b.country, '')) % search_term
    )
    and (filter_category is null or b.category = filter_category)
    and (filter_city is null or b.city = filter_city)
  order by similarity desc, b.created_at desc
  limit least(greatest(page_limit, 1), 100)
  offset greatest(page_offset, 0);
end;
$$;

create or replace function public.count_ai_generations_this_month(uid uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.ai_generations
  where user_id = uid
    and created_at >= date_trunc('month', now());
$$;

create or replace function public.increment_business_stat(
  target_business_id uuid,
  stat_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_month integer := extract(month from now())::integer;
  current_year integer := extract(year from now())::integer;
begin
  insert into public.business_stats (business_id, month, year, total_views, unique_visitors, product_views, contact_clicks)
  values (
    target_business_id,
    current_month,
    current_year,
    case when stat_type = 'page_view' then 1 else 0 end,
    0,
    case when stat_type = 'product_view' then 1 else 0 end,
    case when stat_type = 'contact_click' then 1 else 0 end
  )
  on conflict (business_id, month, year)
  do update set
    total_views = public.business_stats.total_views + case when stat_type = 'page_view' then 1 else 0 end,
    product_views = public.business_stats.product_views + case when stat_type = 'product_view' then 1 else 0 end,
    contact_clicks = public.business_stats.contact_clicks + case when stat_type = 'contact_click' then 1 else 0 end,
    updated_at = now();
end;
$$;

-- Create a business automatically after Supabase Auth signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata_slug text;
  metadata_name text;
  final_slug text;
begin
  metadata_slug := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
  metadata_name := nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');

  if metadata_slug is null then
    final_slug := public.generate_slug_from_name(coalesce(metadata_name, split_part(new.email, '@', 1), 'negocio'));
  else
    final_slug := public.generate_slug_from_name(metadata_slug);
  end if;

  insert into public.businesses (user_id, slug, business_name, email)
  values (
    new.id,
    final_slug,
    coalesce(metadata_name, final_slug),
    new.email
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.businesses enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.social_links enable row level security;
alter table public.business_stats enable row level security;
alter table public.slug_history enable row level security;
alter table public.blog_posts enable row level security;
alter table public.ai_generations enable row level security;

drop policy if exists "Businesses: public read active" on public.businesses;
create policy "Businesses: public read active"
  on public.businesses for select
  using (is_active = true);

drop policy if exists "Businesses: owner full access" on public.businesses;
create policy "Businesses: owner full access"
  on public.businesses for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Product categories: public read active business" on public.product_categories;
create policy "Product categories: public read active business"
  on public.product_categories for select
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.is_active = true
  ));

drop policy if exists "Product categories: owner full access" on public.product_categories;
create policy "Product categories: owner full access"
  on public.product_categories for all
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ));

drop policy if exists "Products: public read active" on public.products;
create policy "Products: public read active"
  on public.products for select
  using (
    is_active = true
    and exists (
      select 1 from public.businesses b
      where b.id = business_id and b.is_active = true
    )
  );

drop policy if exists "Products: owner full access" on public.products;
create policy "Products: owner full access"
  on public.products for all
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ));

drop policy if exists "Social links: public read active business" on public.social_links;
create policy "Social links: public read active business"
  on public.social_links for select
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.is_active = true
  ));

drop policy if exists "Social links: owner full access" on public.social_links;
create policy "Social links: owner full access"
  on public.social_links for all
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ));

drop policy if exists "Business stats: owner read" on public.business_stats;
create policy "Business stats: owner read"
  on public.business_stats for select
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ));

drop policy if exists "Business stats: service role write" on public.business_stats;
create policy "Business stats: service role write"
  on public.business_stats for all
  using ((select auth.role()) = 'service_role')
  with check ((select auth.role()) = 'service_role');

drop policy if exists "Slug history: owner read" on public.slug_history;
create policy "Slug history: owner read"
  on public.slug_history for select
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.user_id = (select auth.uid())
  ));

drop policy if exists "Slug history: service role write" on public.slug_history;
create policy "Slug history: service role write"
  on public.slug_history for all
  using ((select auth.role()) = 'service_role')
  with check ((select auth.role()) = 'service_role');

drop policy if exists "Blog posts: public read published" on public.blog_posts;
create policy "Blog posts: public read published"
  on public.blog_posts for select
  using (is_published = true);

drop policy if exists "Blog posts: service role full access" on public.blog_posts;
create policy "Blog posts: service role full access"
  on public.blog_posts for all
  using ((select auth.role()) = 'service_role')
  with check ((select auth.role()) = 'service_role');

drop policy if exists "AI generations: user own data" on public.ai_generations;
create policy "AI generations: user own data"
  on public.ai_generations for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Storage bucket and policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-assets',
  'business-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Business assets: public read" on storage.objects;
create policy "Business assets: public read"
  on storage.objects for select
  using (bucket_id = 'business-assets');

drop policy if exists "Business assets: auth upload own folder" on storage.objects;
create policy "Business assets: auth upload own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'business-assets'
    and (select auth.role()) = 'authenticated'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

drop policy if exists "Business assets: auth update own files" on storage.objects;
create policy "Business assets: auth update own files"
  on storage.objects for update
  using (
    bucket_id = 'business-assets'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'business-assets'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

drop policy if exists "Business assets: auth delete own files" on storage.objects;
create policy "Business assets: auth delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'business-assets'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

commit;
