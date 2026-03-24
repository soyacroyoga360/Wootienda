# Base de Datos — Wootienda (Supabase PostgreSQL)

## 1. Diagrama Entidad-Relación

```
┌─────────────────┐       ┌──────────────────────┐
│   auth.users     │       │      businesses       │
│ (Supabase Auth)  │       │                      │
├─────────────────┤       ├──────────────────────┤
│ id (UUID) PK     │──1:1──│ id (UUID) PK         │
│ email            │       │ user_id (FK)         │
│ user_metadata    │       │ slug (UNIQUE)        │
│  └─ full_name    │       │ business_name        │
│  └─ username     │       │ category             │
│ created_at       │       │ description          │
└─────────────────┘       │ short_description    │
                           │ email                │
                           │ phone                │
                           │ city                 │
                           │ address              │
                           │ logo_url             │
                           │ banner_url           │
                           │ theme                │
                           │ is_active            │
                           │ created_at           │
                           │ updated_at           │
                           └──────────┬───────────┘
                                      │
                    ┌─────────────────┼──────────────────┐
                    │ 1:N             │ 1:N              │ 1:N
          ┌─────────┴────────┐ ┌─────┴──────────┐ ┌────┴──────────┐
          │    products       │ │ social_links    │ │business_stats │
          ├──────────────────┤ ├────────────────┤ ├───────────────┤
          │ id (UUID) PK     │ │ id (UUID) PK   │ │ id (UUID) PK  │
          │ business_id (FK) │ │ business_id FK │ │ business_id FK│
          │ name             │ │ platform       │ │ total_views   │
          │ description      │ │ url            │ │ unique_visitors│
          │ price            │ │ display_order  │ │ month         │
          │ image_url        │ └────────────────┘ │ year          │
          │ category         │                     └───────────────┘
          │ is_active        │
          │ ai_generated     │
          │ display_order    │
          │ created_at       │
          │ updated_at       │
          └──────────────────┘

          ┌──────────────────┐  ┌──────────────────┐
          │  slug_history     │  │  blog_posts       │
          ├──────────────────┤  ├──────────────────┤
          │ id (UUID) PK     │  │ id (UUID) PK     │
          │ business_id (FK) │  │ slug (UNIQUE)    │
          │ old_slug         │  │ title            │
          │ new_slug         │  │ content          │
          │ changed_at       │  │ excerpt          │
          └──────────────────┘  │ cover_image_url  │
                                │ author           │
          ┌──────────────────┐  │ tags             │
          │ ai_generations    │  │ is_published     │
          ├──────────────────┤  │ published_at     │
          │ id (UUID) PK     │  │ created_at       │
          │ user_id (FK)     │  └──────────────────┘
          │ type (text/image)│
          │ prompt           │
          │ result           │
          │ tokens_used      │
          │ created_at       │
          └──────────────────┘
```

---

## 2. Schema SQL Completo

### 2.1 Extensiones

```sql
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para búsqueda por similitud
```

### 2.2 Tabla `businesses`

```sql
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identificador único de URL
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- Información del negocio
  business_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  industry VARCHAR(100),
  description TEXT,
  short_description VARCHAR(300),
  
  -- Contacto
  email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  website VARCHAR(500),
  
  -- Ubicación
  city VARCHAR(100),
  department VARCHAR(100),
  address TEXT,
  
  -- Apariencia
  logo_url TEXT,
  banner_url TEXT,
  theme VARCHAR(50) DEFAULT 'default',
  primary_color VARCHAR(7) DEFAULT '#2563EB',
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  plan VARCHAR(20) DEFAULT 'free',  -- free, pro, business
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
  CONSTRAINT slug_min_length CHECK (char_length(slug) >= 3),
  CONSTRAINT slug_max_length CHECK (char_length(slug) <= 100)
);

-- Índices
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_city ON public.businesses(city);
CREATE INDEX idx_businesses_is_active ON public.businesses(is_active) WHERE is_active = true;
CREATE INDEX idx_businesses_search ON public.businesses USING gin(
  (business_name || ' ' || COALESCE(description, '') || ' ' || COALESCE(city, '')) gin_trgm_ops
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.3 Tabla `product_categories`

```sql
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,          -- para filtrado en URL
  icon VARCHAR(50) DEFAULT 'Package',  -- nombre del ícono de Lucide
  custom_icon_url TEXT,                 -- ícono custom subido por el usuario
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_category_per_business UNIQUE(business_id, slug)
);

CREATE INDEX idx_product_categories_business ON public.product_categories(business_id);
CREATE INDEX idx_product_categories_order ON public.product_categories(business_id, display_order);
```

### 2.4 Tabla `products`

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  
  -- Información del producto
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(300),
  price DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'COP',
  
  -- Categorización (legacy text + FK)
  category VARCHAR(100),               -- nombre de categoría (redundante para búsqueda)
  tags TEXT[] DEFAULT '{}',
  
  -- Imagen
  image_url TEXT,
  
  -- IA
  ai_generated_description BOOLEAN DEFAULT false,
  ai_generated_image BOOLEAN DEFAULT false,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_products_business_id ON public.products(business_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_display_order ON public.products(business_id, display_order);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.5 Tabla `social_links`

```sql
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  
  platform VARCHAR(50) NOT NULL, -- instagram, facebook, tiktok, twitter, linkedin, youtube, website
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_business_platform UNIQUE(business_id, platform)
);

CREATE INDEX idx_social_links_business ON public.social_links(business_id);
```

### 2.6 Tabla `business_stats`

```sql
CREATE TABLE public.business_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  product_views INTEGER DEFAULT 0,
  contact_clicks INTEGER DEFAULT 0,
  
  -- Período
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_business_month UNIQUE(business_id, month, year)
);

CREATE INDEX idx_business_stats_business ON public.business_stats(business_id);
CREATE INDEX idx_business_stats_period ON public.business_stats(year, month);
```

### 2.7 Tabla `slug_history`

```sql
CREATE TABLE public.slug_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  old_slug VARCHAR(100) NOT NULL,
  new_slug VARCHAR(100) NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_slug_history_old ON public.slug_history(old_slug);
```

### 2.8 Tabla `blog_posts`

```sql
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  cover_image_url TEXT,
  
  author VARCHAR(255) DEFAULT 'Equipo Editorial',
  tags TEXT[] DEFAULT '{}',
  
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  -- SEO
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING gin(tags);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.9 Tabla `ai_generations`

```sql
CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  type VARCHAR(20) NOT NULL, -- 'text' | 'image'
  prompt TEXT NOT NULL,
  result TEXT,               -- descripción generada o URL de imagen
  model VARCHAR(100),        -- gemini-2.0-flash, imagen-3.0-generate-002, etc.
  tokens_used INTEGER DEFAULT 0,
  
  -- Referencia al producto (opcional)
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_type ON public.ai_generations(type);
CREATE INDEX idx_ai_generations_date ON public.ai_generations(user_id, created_at DESC);
```

---

## 3. Funciones RPC

### 3.1 Verificar disponibilidad de slug

```sql
CREATE OR REPLACE FUNCTION check_slug_availability(slug_to_check VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.businesses WHERE slug = slug_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.2 Generar slug desde nombre

```sql
CREATE OR REPLACE FUNCTION generate_slug_from_name(business_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convertir a minúsculas, quitar acentos, reemplazar espacios
  base_slug := lower(unaccent(trim(business_name)));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Si ya existe, agregar número
  WHILE EXISTS (SELECT 1 FROM public.businesses WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.3 Búsqueda de negocios

```sql
CREATE OR REPLACE FUNCTION search_businesses(
  search_term TEXT DEFAULT '',
  filter_category TEXT DEFAULT NULL,
  filter_city TEXT DEFAULT NULL,
  page_limit INTEGER DEFAULT 20,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug VARCHAR,
  business_name VARCHAR,
  short_description VARCHAR,
  category VARCHAR,
  city VARCHAR,
  logo_url TEXT,
  similarity REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.slug,
    b.business_name,
    b.short_description,
    b.category,
    b.city,
    b.logo_url,
    CASE 
      WHEN search_term = '' THEN 1.0
      ELSE similarity(
        b.business_name || ' ' || COALESCE(b.description, ''),
        search_term
      )
    END AS similarity
  FROM public.businesses b
  WHERE b.is_active = true
    AND (search_term = '' OR (
      b.business_name || ' ' || COALESCE(b.description, '') || ' ' || COALESCE(b.city, '')
    ) % search_term)
    AND (filter_category IS NULL OR b.category = filter_category)
    AND (filter_city IS NULL OR b.city = filter_city)
  ORDER BY similarity DESC, b.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.4 Contar generaciones IA del mes

```sql
CREATE OR REPLACE FUNCTION count_ai_generations_this_month(uid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.ai_generations
    WHERE user_id = uid
      AND created_at >= date_trunc('month', NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Row Level Security (RLS)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- === BUSINESSES ===
-- Lectura pública (para landing pages públicas)
CREATE POLICY "Businesses: public read active"
  ON public.businesses FOR SELECT
  USING (is_active = true);

-- El dueño puede hacer todo con su negocio
CREATE POLICY "Businesses: owner full access"
  ON public.businesses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- === PRODUCTS ===
-- Lectura pública de productos de negocios activos
CREATE POLICY "Products: public read active"
  ON public.products FOR SELECT
  USING (
    is_active = true 
    AND EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND is_active = true
    )
  );

-- El dueño del negocio puede gestionar sus productos
CREATE POLICY "Products: owner full access"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND user_id = auth.uid()
    )
  );

-- === SOCIAL LINKS ===
CREATE POLICY "Social links: public read"
  ON public.social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND is_active = true
    )
  );

CREATE POLICY "Social links: owner full access"
  ON public.social_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND user_id = auth.uid()
    )
  );

-- === BUSINESS STATS ===
CREATE POLICY "Stats: owner read"
  ON public.business_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND user_id = auth.uid()
    )
  );

-- Insertar stats se hace desde el servidor (service role)
CREATE POLICY "Stats: server insert"
  ON public.business_stats FOR INSERT
  WITH CHECK (true);  -- Solo accesible desde service role

-- === BLOG POSTS ===
CREATE POLICY "Blog: public read published"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

-- === AI GENERATIONS ===
CREATE POLICY "AI: user own data"
  ON public.ai_generations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 5. Storage Buckets

```sql
-- Bucket: business-assets (público)
-- Estructura:
-- business-assets/
--   ├── {user_id}/
--   │   ├── logo/
--   │   │   └── logo.webp
--   │   ├── banner/
--   │   │   └── banner.webp
--   │   └── products/
--   │       ├── product-1.webp
--   │       └── product-2.webp
--   └── blog/
--       ├── cover-1.webp
--       └── cover-2.webp

-- Políticas de Storage
-- Lectura pública
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'business-assets');

-- Upload por usuario autenticado (solo en su carpeta)
CREATE POLICY "Auth upload own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'business-assets'
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update por usuario autenticado (solo sus archivos)
CREATE POLICY "Auth update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'business-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Delete por usuario autenticado (solo sus archivos)
CREATE POLICY "Auth delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'business-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 6. Slugs Reservados

Estos slugs deben estar excluidos para evitar conflictos con rutas de la app:

```sql
-- Lista de slugs reservados (verificar en la función check_slug_availability)
-- dashboard, login, register, blog, admin, api, auth, settings,
-- products, business, appearance, forgot-password, reset-password,
-- callback, search, about, contact, pricing, terms, privacy,
-- help, support, status, favicon.ico, robots.txt, sitemap.xml

CREATE OR REPLACE FUNCTION is_reserved_slug(slug_to_check VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  reserved_slugs TEXT[] := ARRAY[
    'dashboard', 'login', 'register', 'blog', 'admin', 'api', 'auth',
    'settings', 'products', 'business', 'appearance', 'forgot-password',
    'reset-password', 'callback', 'search', 'about', 'contact', 'pricing',
    'terms', 'privacy', 'help', 'support', 'status', 'app', 'www',
    'favicon.ico', 'robots.txt', 'sitemap.xml'
  ];
BEGIN
  RETURN slug_to_check = ANY(reserved_slugs);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```
