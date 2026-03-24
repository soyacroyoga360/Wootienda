# Arquitectura del Proyecto — Wootienda

## 1. Stack Tecnológico Detallado

| Categoría | Tecnología | Versión | Justificación |
|---|---|---|---|
| **Framework** | Next.js | 15.x | App Router, RSC, Server Actions, ISR |
| **React** | React | 19.x | Server Components, Suspense, Transitions |
| **Lenguaje** | TypeScript | 5.x | Type safety en todo el proyecto |
| **CSS** | Tailwind CSS | 4.x | Utility-first, tree-shaking, rendimiento |
| **Componentes UI** | shadcn/ui | latest | Radix primitives + Tailwind, accesible |
| **Base de datos** | Supabase (PostgreSQL) | — | RLS, Auth, Storage integrado |
| **Auth** | Supabase Auth | — | Email/password, OAuth, confirmación email |
| **Storage** | Supabase Storage | — | Imágenes de productos, logos, banners |
| **IA - Texto** | Google Gemini API | gemini-2.0-flash | Generación de descripciones (capa gratuita) |
| **IA - Imágenes** | Google Gemini API (Imagen 3) | imagen-3.0-generate-002 | Generación de imágenes (capa gratuita) |
| **Validación** | Zod | 3.x | Schema validation + react-hook-form |
| **Forms** | React Hook Form | 7.x | Formularios performantes |
| **Animaciones** | Framer Motion | 12.x | Animaciones fluidas, gestos |
| **Icons** | Lucide React | latest | Iconos consistentes, tree-shakeable |
| **Deploy** | Vercel | — | Edge functions, CDN global, analytics |
| **Package Manager** | pnpm | 9.x | Rápido, espacio en disco eficiente |

---

## 2. Estructura del Proyecto

```
directorio-negocios/
├── docs/                          # Documentación del proyecto
│
├── public/                        # Archivos estáticos
│   ├── images/
│   ├── icons/
│   └── og/                        # Open Graph images
│
├── src/
│   ├── app/                       # App Router (Next.js)
│   │   ├── (marketing)/           # Route group - páginas públicas
│   │   │   ├── page.tsx           # Landing page principal (/)
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # Lista de blogs (/blog)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Artículo individual (/blog/mi-articulo)
│   │   │   └── layout.tsx         # Layout con navbar + footer marketing
│   │   │
│   │   ├── (auth)/                # Route group - autenticación
│   │   │   ├── login/
│   │   │   │   └── page.tsx       # Inicio de sesión (/login)
│   │   │   ├── register/
│   │   │   │   └── page.tsx       # Registro con username (/register)
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx       # Recuperar contraseña
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx       # Restablecer contraseña
│   │   │   ├── callback/
│   │   │   │   └── route.ts       # Auth callback handler
│   │   │   └── layout.tsx         # Layout auth (centrado, sin navbar)
│   │   │
│   │   ├── (dashboard)/           # Route group - panel del usuario autenticado
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx       # Vista general del negocio (/dashboard)
│   │   │   ├── business/
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx   # Crear negocio (/business/create)
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx   # Editar negocio (/business/edit)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx       # Lista de productos (/products)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx   # Crear producto (/products/new)
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Editar producto
│   │   │   ├── appearance/
│   │   │   │   └── page.tsx       # Banner, tema, personalización
│   │   │   ├── settings/
│   │   │   │   └── page.tsx       # Configuración de cuenta
│   │   │   └── layout.tsx         # Layout dashboard (sidebar + topbar)
│   │   │
│   │   ├── [businessSlug]/        # Landing pública del negocio
│   │   │   └── page.tsx           # wootienda.com/nombre-negocio
│   │   │
│   │   ├── api/                   # Route Handlers
│   │   │   ├── ai/
│   │   │   │   ├── generate-description/
│   │   │   │   │   └── route.ts   # POST - generar descripción con IA
│   │   │   │   └── generate-image/
│   │   │   │       └── route.ts   # POST - generar imagen con IA
│   │   │   ├── slug/
│   │   │   │   └── check/
│   │   │   │       └── route.ts   # GET - verificar disponibilidad de slug
│   │   │   └── upload/
│   │   │       └── route.ts       # POST - upload de imágenes
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Estilos globales + Tailwind
│   │   ├── not-found.tsx          # Página 404 global
│   │   └── error.tsx              # Error boundary global
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── separator.tsx
│   │   │   └── ... (más shadcn/ui)
│   │   │
│   │   ├── marketing/             # Componentes de la landing pública
│   │   │   ├── hero-section.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── pricing-section.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── faq-section.tsx
│   │   │   ├── cta-section.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   ├── blog/                  # Componentes del blog
│   │   │   ├── blog-card.tsx
│   │   │   ├── blog-list.tsx
│   │   │   └── blog-content.tsx
│   │   │
│   │   ├── auth/                  # Componentes de autenticación
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   └── slug-input.tsx     # Input con validación de slug único
│   │   │
│   │   ├── dashboard/             # Componentes del dashboard
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── stats-cards.tsx
│   │   │   ├── recent-products.tsx
│   │   │   └── quick-actions.tsx
│   │   │
│   │   ├── business/              # Componentes del negocio
│   │   │   ├── business-form.tsx
│   │   │   ├── business-preview.tsx
│   │   │   └── business-card.tsx
│   │   │
│   │   ├── products/              # Componentes de productos
│   │   │   ├── product-form.tsx
│   │   │   ├── product-card.tsx
│   │   │   ├── product-list.tsx
│   │   │   ├── ai-description-generator.tsx
│   │   │   └── ai-image-generator.tsx
│   │   │
│   │   ├── appearance/            # Componentes de apariencia
│   │   │   ├── theme-selector.tsx
│   │   │   ├── banner-uploader.tsx
│   │   │   └── color-picker.tsx
│   │   │
│   │   ├── business-landing/      # Componentes de la landing pública del negocio
│   │   │   ├── business-hero.tsx
│   │   │   ├── business-products-grid.tsx
│   │   │   ├── business-contact.tsx
│   │   │   └── business-social-links.tsx
│   │   │
│   │   └── shared/                # Componentes compartidos
│   │       ├── navbar.tsx
│   │       ├── logo.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── image-upload.tsx
│   │       ├── search-bar.tsx
│   │       └── seo-head.tsx
│   │
│   ├── lib/                       # Utilidades y configuraciones
│   │   ├── supabase/
│   │   │   ├── client.ts          # Supabase browser client
│   │   │   ├── server.ts          # Supabase server client
│   │   │   ├── middleware.ts      # Supabase auth middleware helper
│   │   │   └── admin.ts           # Supabase admin client (service role)
│   │   │
│   │   ├── ai/
│   │   │   ├── gemini.ts           # Google Gemini client configuration
│   │   │   ├── generate-description.ts
│   │   │   └── generate-image.ts
│   │   │
│   │   ├── validations/
│   │   │   ├── auth.ts            # Zod schemas para auth
│   │   │   ├── business.ts        # Zod schemas para negocio
│   │   │   └── product.ts         # Zod schemas para productos
│   │   │
│   │   ├── utils.ts               # Utilidades generales (cn, formatSlug, etc.)
│   │   ├── constants.ts           # Constantes globales
│   │   └── types.ts               # Types globales del proyecto
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── use-auth.ts            # Hook de autenticación
│   │   ├── use-business.ts        # Hook del negocio del usuario
│   │   ├── use-products.ts        # Hook de productos
│   │   ├── use-debounce.ts        # Debounce para validación de slug
│   │   └── use-media-query.ts     # Responsive breakpoints
│   │
│   ├── actions/                   # Server Actions
│   │   ├── auth.ts                # Login, register, logout
│   │   ├── business.ts            # CRUD negocio
│   │   ├── products.ts            # CRUD productos
│   │   └── upload.ts              # Upload de archivos
│   │
│   └── content/                   # Contenido estático del blog
│       └── blogs/
│           ├── como-crear-tu-negocio-online.mdx
│           └── ...
│
├── supabase/
│   ├── schema.sql                 # Schema completo de la BD
│   ├── seed.sql                   # Datos de prueba
│   └── migrations/                # Migraciones incrementales
│
├── .env.local                     # Variables de entorno (no committear)
├── .env.example                   # Template de variables
├── middleware.ts                   # Next.js middleware (auth protection)
├── next.config.ts                 # Configuración de Next.js
├── tailwind.config.ts             # Configuración de Tailwind
├── tsconfig.json                  # TypeScript config
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 3. Arquitectura de Capas

```
┌─────────────────────────────────────────────────┐
│                    CLIENTE                        │
│  (Browser - React Server Components + Client)    │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────┐ │
│  │  Marketing   │  │   Dashboard  │  │  Auth   │ │
│  │  (RSC)       │  │ (Client+RSC) │  │(Client) │ │
│  └──────┬──────┘  └──────┬───────┘  └────┬────┘ │
│         │                │               │       │
├─────────┴────────────────┴───────────────┴───────┤
│              NEXT.JS APP ROUTER                   │
│     Server Actions + Route Handlers               │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────┐  ┌────────────┐  ┌──────────────┐ │
│  │ Supabase │  │  Supabase  │  │   Google     │ │
│  │   Auth   │  │  Database  │  │   Gemini     │ │
│  └──────────┘  └────────────┘  └──────────────┘ │
│  ┌──────────┐                                    │
│  │ Supabase │                                    │
│  │ Storage  │                                    │
│  └──────────┘                                    │
└──────────────────────────────────────────────────┘
```

---

## 4. Patrones Arquitectónicos

### 4.1 Server Components por Defecto
- Toda página es Server Component a menos que necesite interactividad
- Las páginas de marketing/landing/blog son 100% RSC (zero JS)
- Solo se marca `'use client'` en componentes con estado, eventos o hooks del browser

### 4.2 Server Actions para Mutaciones
- Crear/editar/eliminar negocio → Server Action
- CRUD de productos → Server Action
- Upload de imágenes → Server Action + Supabase Storage
- Beneficio: no se exponen endpoints REST innecesarios

### 4.3 Route Handlers para IA y Validaciones Async
- `/api/ai/generate-description` → Route Handler (streaming response)
- `/api/ai/generate-image` → Route Handler (async, puede tardar)
- `/api/slug/check` → Route Handler (validación en tiempo real vía fetch)

### 4.4 Middleware para Protección de Rutas
```typescript
// middleware.ts - Protege rutas del dashboard
// Rutas protegidas: /dashboard/*, /business/*, /products/*, /appearance/*, /settings/*
// Rutas públicas: /, /blog/*, /login, /register, /[businessSlug]
```

### 4.5 Row Level Security (RLS)
- Supabase RLS en todas las tablas
- Cada usuario solo puede leer/escribir sus propios datos
- Las landings públicas de negocios se leen sin auth (política SELECT pública)

---

## 5. Estrategia de Rendering

| Ruta | Rendering | Cache | Justificación |
|---|---|---|---|
| `/` (Landing) | SSG | Static | No cambia frecuentemente |
| `/blog` | SSG + ISR | Revalidate 1h | Contenido se actualiza periódicamente |
| `/blog/[slug]` | SSG | generateStaticParams | Contenido estático por artículo |
| `/login`, `/register` | SSR | No cache | Formularios dinámicos |
| `/dashboard/*` | SSR | No cache | Datos en tiempo real del usuario |
| `/[businessSlug]` | SSR + ISR | Revalidate 5min | Balance entre frescura y rendimiento |
| `/api/*` | Dynamic | No cache | Endpoints de API |

---

## 6. Optimización de Performance

### 6.1 Imágenes
- `next/image` para todas las imágenes
- Supabase Storage con transformaciones de tamaño
- Blur placeholder para LCP
- `priority` en imágenes above-the-fold

### 6.2 Fonts
- `next/font` con Google Fonts (Inter o Geist)
- `display: swap` para evitar FOIT
- Subset de caracteres latinos

### 6.3 Bundle
- Dynamic imports con `next/dynamic` para componentes pesados (editores, generadores IA)
- Tree-shaking de Lucide icons
- Sin barrel exports innecesarios

### 6.4 Data Fetching
- `Promise.all` para queries paralelas en Server Components
- `Suspense` boundaries para streaming
- Preload pattern para queries críticas

---

## 7. Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google Gemini (capa gratuita)
GEMINI_API_KEY=AIzaSy...

# App
NEXT_PUBLIC_APP_URL=https://wootienda.com
NEXT_PUBLIC_APP_NAME=Wootienda

# OpenAI (opcional, futuro fallback para planes premium)
# OPENAI_API_KEY=sk-...
```

---

## 8. Dependencias Principales

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.7",
    "@google/generative-ai": "^0.21",
    "zod": "^3",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "tailwind-merge": "^2",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "lucide-react": "latest",
    "framer-motion": "^12",
    "sonner": "^1",
    "next-themes": "^0.4",
    "date-fns": "^4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "tailwindcss": "^4",
    "postcss": "^8",
    "@tailwindcss/typography": "latest"
  }
}
```
