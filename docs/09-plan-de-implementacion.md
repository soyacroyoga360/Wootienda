# Plan de Implementación — Wootienda

## Resumen

El desarrollo se divide en **7 fases secuenciales**. Cada fase produce funcionalidad entregable y verificable. Las dependencias fluyen de arriba hacia abajo: cada fase requiere que la anterior esté completa.

```
FASE 0 ─── Setup del proyecto (cimientos)
  │
FASE 1 ─── Auth (registro, login, middleware)
  │
FASE 2 ─── Dashboard + CRUD negocio
  │
FASE 3 ─── CRUD productos + categorías
  │
FASE 4 ─── Landing pública del negocio
  │
FASE 5 ─── IA (descripciones + imágenes)
  │
FASE 6 ─── Marketing, Blog y Polish
```

---

## FASE 0 — Setup del Proyecto

**Objetivo:** Proyecto funcional con todas las herramientas configuradas, estructura de carpetas creada y BD desplegada.

### 0.1 Inicializar proyecto Next.js
```bash
pnpm create next-app@latest wootienda --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 0.2 Instalar dependencias
```bash
# Core
pnpm add @supabase/supabase-js @supabase/ssr

# UI
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add framer-motion sonner next-themes

# Forms & Validation
pnpm add zod react-hook-form @hookform/resolvers

# IA
pnpm add @google/generative-ai

# Utilidades
pnpm add date-fns

# Dev
pnpm add -D @tailwindcss/typography
```

### 0.3 Configurar shadcn/ui
```bash
pnpm dlx shadcn@latest init
# Componentes iniciales mínimos:
pnpm dlx shadcn@latest add button input label card dialog form select textarea toast skeleton badge separator tabs dropdown-menu sheet switch avatar
```

### 0.4 Crear estructura de carpetas

```
src/
├── app/
│   ├── (marketing)/layout.tsx          # Layout marketing (navbar + footer)
│   ├── (marketing)/page.tsx            # Landing principal (placeholder)
│   ├── (auth)/layout.tsx               # Layout auth (centrado)
│   ├── (auth)/login/page.tsx           # Placeholder
│   ├── (auth)/register/page.tsx        # Placeholder
│   ├── (auth)/callback/route.ts        # Auth callback
│   ├── (auth)/forgot-password/page.tsx
│   ├── (auth)/reset-password/page.tsx
│   ├── (dashboard)/layout.tsx          # Layout dashboard (sidebar + topbar)
│   ├── (dashboard)/dashboard/page.tsx  # Placeholder
│   ├── [businessSlug]/page.tsx         # Placeholder
│   ├── api/                            # Vacío por ahora
│   ├── layout.tsx                      # Root layout (providers)
│   ├── globals.css
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                             # shadcn/ui (auto-generado)
│   ├── shared/
│   │   ├── navbar.tsx
│   │   ├── logo.tsx
│   │   └── loading-spinner.tsx
│   └── providers.tsx                   # ThemeProvider, Toaster
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # createBrowserClient
│   │   ├── server.ts                   # createServerClient
│   │   ├── middleware.ts               # Helper para middleware
│   │   └── admin.ts                    # Service role client
│   ├── utils.ts                        # cn(), formatSlug(), formatPrice()
│   ├── constants.ts                    # Slugs reservados, límites, etc.
│   └── types.ts                        # Database types de Supabase
│
├── hooks/
│   └── use-debounce.ts
│
└── actions/                            # Vacío por ahora
```

### 0.5 Configurar Supabase

1. **Crear proyecto en Supabase Dashboard**
2. **Ejecutar schema.sql completo** (del doc 03):
   - Extensiones: uuid-ossp, unaccent, pg_trgm
   - Tablas: businesses, product_categories, products, social_links, business_stats, slug_history, blog_posts, ai_generations
   - Triggers para updated_at
   - Funciones RPC: check_slug_availability, get_business_with_products
   - Políticas RLS en todas las tablas
3. **Crear buckets en Storage:**
   - `logos` (público, 2MB max, image/*)
   - `banners` (público, 5MB max, image/*)
   - `products` (público, 5MB max, image/*)
4. **Generar types de TypeScript:**
   ```bash
   pnpm dlx supabase gen types typescript --project-id <project-id> > src/lib/types.ts
   ```

### 0.6 Archivos de configuración

- `.env.local` — Con todas las variables (Supabase URL, keys, Gemini key)
- `.env.example` — Template sin valores
- `middleware.ts` — Boilerplate vacío, se completa en Fase 1
- `next.config.ts` — Configurar `images.remotePatterns` para Supabase Storage

### 0.7 Verificación Fase 0
- [ ] `pnpm dev` arranca sin errores
- [ ] Las rutas placeholder cargan (/, /login, /register, /dashboard)
- [ ] Supabase client se conecta (probar query trivial)
- [ ] shadcn/ui funciona (renderizar un `<Button>`)
- [ ] Dark mode toggle funciona
- [ ] Types de Supabase generados y sin errores TS

---

## FASE 1 — Autenticación

**Objetivo:** Registro con username/slug, login, logout, middleware de protección, recuperación de contraseña.

**Dependencias:** Fase 0 completa.

### 1.1 Schemas de validación (`lib/validations/auth.ts`)

```typescript
// registerSchema: email, password (min 8), fullName (min 2), slug (min 3, regex [a-z0-9-])
// loginSchema: email, password
// forgotPasswordSchema: email
// resetPasswordSchema: password, confirmPassword
```

### 1.2 Middleware (`middleware.ts`)
- Verificar sesión de Supabase en cada request
- **Proteger:** /dashboard/*, /business/*, /products/*, /appearance/*, /settings/*
- **Redirigir:** usuario autenticado en /login o /register → /dashboard
- **Permitir:** /, /blog/*, /[businessSlug] sin auth

### 1.3 Auth callback (`(auth)/callback/route.ts`)
- Manejar confirmación de email
- Manejar reset de password
- Redirect a /dashboard o /reset-password según el caso

### 1.4 Formulario de registro (`components/auth/register-form.tsx`)
- Campos: nombre completo, email, password, slug (username)
- **Validación de slug en tiempo real:**
  - Formato: solo minúsculas, números, guiones
  - Longitud: 3-100 caracteres
  - Disponibilidad: debounce 500ms → fetch a `/api/slug/check`
  - Lista de slugs reservados (dashboard, login, register, admin, api, blog, etc.)
- Preview: "Tu URL será: wootienda.com/**mi-slug**"
- Submit → Server Action `registerUser()`

### 1.5 Route Handler - Check Slug (`api/slug/check/route.ts`)
```
GET /api/slug/check?slug=mi-negocio
→ { available: boolean, suggestion?: string }
```

### 1.6 Formulario de login (`components/auth/login-form.tsx`)
- Campos: email, password
- Link a "¿Olvidaste tu contraseña?"
- Submit → Server Action `loginUser()`

### 1.7 Forgot/Reset password
- `forgot-password-form.tsx` → envía email de recuperación
- `reset-password-form.tsx` → nueva contraseña (tras click en email)

### 1.8 Server Actions auth (`actions/auth.ts`)
- `registerUser()`: crear usuario en Supabase Auth con user_metadata (fullName, username/slug)
- `loginUser()`: sign in con email/password
- `logoutUser()`: sign out + redirect
- `updatePassword()`: actualizar contraseña

### 1.9 Hook `use-auth.ts`
- Provee: user, session, isLoading, signOut
- Listener de cambios de sesión (onAuthStateChange)

### 1.10 Verificación Fase 1
- [ ] Registro crea usuario y redirige a /dashboard
- [ ] Slug se valida en tiempo real (formato + disponibilidad)
- [ ] Slugs reservados son rechazados
- [ ] Login funciona y redirige a /dashboard
- [ ] Logout redirige a /
- [ ] Rutas protegidas redirigen a /login si no hay sesión
- [ ] /login redirige a /dashboard si ya hay sesión
- [ ] Recuperación de contraseña envía email y permite reset
- [ ] Email de confirmación funciona (si está habilitado)

---

## FASE 2 — Dashboard + CRUD Negocio

**Objetivo:** Layout del dashboard, crear/editar negocio, sidebar, topbar, vista general con stats.

**Dependencias:** Fase 1 completa.

### 2.1 Layout del dashboard (`(dashboard)/layout.tsx`)
- **Sidebar** (desktop): logo, nav links (Dashboard, Productos, Apariencia, Configuración), nombre del negocio, botón logout
- **Topbar**: título de la página actual, avatar del usuario, dropdown con opciones
- **Responsive**: en móvil sidebar se convierte en sheet lateral (hamburger menu)
- Cargar datos del negocio del usuario (si existe)
- Si el usuario no tiene negocio → redirigir a /business/create

### 2.2 Crear negocio (`business/create/page.tsx`)
- Formulario completo:
  - Nombre del negocio
  - Categoría (industria) — select con opciones predefinidas
  - Descripción y descripción corta
  - Email, teléfono, WhatsApp
  - Ciudad, departamento, dirección
  - Logo upload
- Submit → Server Action `createBusiness()`
- El slug ya fue elegido en el registro (se usa el mismo)

### 2.3 Editar negocio (`business/edit/page.tsx`)
- Mismo formulario pre-llenado
- Opción de cambiar slug (con validación de disponibilidad + historial en slug_history)
- Submit → Server Action `updateBusiness()`

### 2.4 Dashboard home (`dashboard/page.tsx`)
- **Stats cards**: productos publicados, visitas este mes, productos con IA
- **Preview de la landing**: miniatura o link directo
- **Quick actions**: "Agregar producto", "Personalizar landing", "Ver mi página"
- **Productos recientes**: últimos 5 productos creados

### 2.5 Validación Zod (`lib/validations/business.ts`)
```typescript
// businessSchema: businessName (min 2, max 255), category, description, 
//                 shortDescription (max 300), email, phone, whatsapp, 
//                 city, department, address
```

### 2.6 Server Actions (`actions/business.ts`)
- `createBusiness()`: insertar en businesses, subir logo a Storage
- `updateBusiness()`: actualizar datos, manejar cambio de slug
- `updateBusinessAppearance()`: tema, banner, color primario (se completa en Fase 4)

### 2.7 Upload images (`actions/upload.ts`)
- `uploadImage()`: subir a Supabase Storage (logos, banners, products)
- Validar tipo MIME server-side (image/jpeg, image/png, image/webp)
- Validar tamaño max (varía por tipo)
- Generar nombre único con UUID
- `deleteImage()`: eliminar de Storage

### 2.8 Redes sociales (`actions/social-links.ts`)
- CRUD de links sociales del negocio
- Componente `social-links-form.tsx`: lista dinámica (agregar/eliminar links)
- Plataformas soportadas: Instagram, Facebook, TikTok, Twitter/X, LinkedIn, YouTube, Website

### 2.9 Configuración de cuenta (`settings/page.tsx`)
- Cambiar nombre completo
- Cambiar contraseña
- Zona peligrosa: eliminar cuenta (requiere confirmación)

### 2.10 Verificación Fase 2
- [ ] Redirect a /business/create si no hay negocio
- [ ] Crear negocio funciona con todos los campos + logo
- [ ] Editar negocio pre-llena el formulario y actualiza correctamente
- [ ] Dashboard muestra stats y acciones rápidas
- [ ] Sidebar navega correctamente entre secciones
- [ ] Upload de imágenes funciona (logo)
- [ ] Redes sociales se pueden agregar/editar/eliminar
- [ ] Cambio de slug registra historial en slug_history
- [ ] Settings permite cambiar nombre y contraseña

---

## FASE 3 — CRUD Productos + Categorías

**Objetivo:** Gestión completa de productos y categorías del negocio desde el dashboard.

**Dependencias:** Fase 2 completa.

### 3.1 Gestión de categorías (`components/appearance/category-manager.tsx`)
- CRUD de product_categories del negocio
- Cada categoría: nombre + ícono (selector de Lucide) + orden
- Drag & drop para reordenar (display_order)
- Máximo 8 categorías por negocio
- Ubicar en la sección de Apariencia (/appearance) — es parte de la personalización de la landing

### 3.2 Server Actions categorías (`actions/categories.ts`)
```typescript
'use server'
export async function createCategory(data: CategoryData): Promise<ActionResult>
export async function updateCategory(id: string, data: CategoryData): Promise<ActionResult>
export async function deleteCategory(id: string): Promise<ActionResult>
export async function reorderCategories(orderedIds: string[]): Promise<ActionResult>
```

### 3.3 Lista de productos (`products/page.tsx`)
- Tabla/grid con todos los productos del negocio
- Columnas: imagen (thumbnail), nombre, categoría, precio, estado (activo/inactivo), acciones
- Filtro por categoría
- Buscar por nombre
- Toggle activo/inactivo inline
- Botón "Nuevo producto"
- Empty state: "Aún no tienes productos. ¡Crea tu primero!"

### 3.4 Formulario de producto (`components/products/product-form.tsx`)
- Campos: nombre, descripción, descripción corta, precio, moneda, categoría (select del catálogo), imagen, destacado (switch)
- **Categoría**: select poblado desde product_categories del negocio + opción "Crear nueva categoría" inline
- Upload de imagen con preview
- Validación Zod en client y server
- Botones IA: "Generar descripción con IA", "Generar imagen con IA" (se conectan en Fase 5, por ahora disabled con tooltip "Próximamente")

### 3.5 Crear producto (`products/new/page.tsx`)
- Usa product-form con mode="create"
- Submit → `createProduct()`

### 3.6 Editar producto (`products/[id]/edit/page.tsx`)
- Usa product-form con mode="edit" pre-llenado
- Submit → `updateProduct()`

### 3.7 Server Actions productos (`actions/products.ts`)
- `createProduct()`: insertar + upload imagen + asignar category_id
- `updateProduct()`: actualizar + cambiar imagen si es nueva
- `deleteProduct()`: eliminar (con confirmación dialog)
- `toggleProductActive()`: cambiar is_active
- `reorderProducts()`: actualizar display_order

### 3.8 Validación Zod (`lib/validations/product.ts`)
```typescript
// productSchema: name (min 2, max 255), description (max 2000), 
//                shortDescription (max 300), price (>= 0), currency,
//                categoryId (UUID), image (file), isFeatured (boolean)
```

### 3.9 Verificación Fase 3
- [ ] Crear/editar/eliminar categorías desde /appearance
- [ ] Reordenar categorías con drag & drop
- [ ] Máximo 8 categorías enforced
- [ ] Crear producto con todos los campos + imagen
- [ ] Categoría seleccionable del catálogo del negocio
- [ ] Crear categoría inline desde el form de producto
- [ ] Editar producto pre-llena correctamente
- [ ] Eliminar producto con confirmación
- [ ] Toggle activo/inactivo funciona
- [ ] Lista de productos filtra por categoría y búsqueda
- [ ] Botones de IA visibles pero deshabilitados (placeholder)

---

## FASE 4 — Landing Pública del Negocio

**Objetivo:** Página pública de cada negocio con hero, categorías, grid de productos, modal de detalle con WhatsApp CTA. Sistema de temas.

**Dependencias:** Fase 3 completa (necesita datos de negocio, productos, categorías).

### 4.1 Página `[businessSlug]/page.tsx`
- **Server Component** que carga datos del negocio + productos + categorías + redes sociales
- RPC `get_business_with_products` o queries paralelas con `Promise.all`
- Metadata dinámica para SEO (generateMetadata)
- Open Graph image dinámico
- ISR con `revalidate = 300` (5 min)
- Si slug no encontrado → buscar en slug_history → redirect 301 o 404

### 4.2 Hero (`business-landing/business-hero.tsx`)
- Banner fullscreen con overlay oscuro
- Logo circular con borde del color primario
- Nombre + descripción corta
- Botones de navegación interna (scroll suave a secciones)
- CTA plataforma: "¿Quieres tu propia página?"
- Framer Motion: fade in logo, stagger botones

### 4.3 Barra de categorías (`business-landing/category-nav.tsx`)
- Client Component (maneja state de categoría activa)
- Íconos circulares de las product_categories del negocio
- Opción "Todos" por defecto
- Click filtra el grid (client-side, sin reload)
- Scroll horizontal en móvil
- Animación del indicador activo

### 4.4 Grid de productos (`business-landing/products-grid.tsx`)
- Client Component (se filtra según categoría activa)
- Grid responsive: 3 cols desktop, 2 tablet, 1 móvil
- Framer Motion AnimatePresence para transiciones al filtrar
- Stagger animation al montar
- Solo muestra productos donde `is_active = true`

### 4.5 Product card (`business-landing/product-card.tsx`)
- Imagen con `next/image`, placeholder blur
- Badge de categoría
- Nombre + precio en color primario
- Hover: scale 1.02 + shadow
- Click → abre modal de detalle

### 4.6 Modal de detalle (`business-landing/product-detail-modal.tsx`)
- Imagen grande (zoom on hover)
- Nombre, precio (grande, color primario), descripción completa
- **Botón "Compra por WhatsApp"** (verde #25D366):
  - `https://wa.me/{whatsapp}?text=Hola, me interesa {nombre} (${precio}). Vi tu catálogo en {url}`
  - URL-encode del mensaje
- Bottom sheet en móvil, modal centrado en desktop
- Framer Motion scale in + backdrop blur

### 4.7 Secciones de contacto y redes sociales
- `business-contact.tsx`: grid de iconos (WhatsApp, tel, email, dirección) clickeables
- `business-social-links.tsx`: íconos de redes con brand colors
- `platform-cta.tsx`: "¿Quieres tu propia página? Crea la tuya gratis" → /register

### 4.8 Sistema de temas

#### Estructura de tema
```typescript
// lib/themes/index.ts — registro de todos los temas
// lib/themes/types.ts — interface BusinessTheme
// lib/themes/default.ts, clean.ts, minimal.ts (FREE)
// lib/themes/glassmorphism.ts, neon-glow.ts, etc. (PRO)
```

#### Theme selector en dashboard (`components/appearance/theme-selector.tsx`)
- Grid de temas con preview
- Badges FREE / PRO 🔒
- Click en PRO sin plan → modal upgrade
- Vista previa de la landing con el tema

#### Color picker (`components/appearance/color-picker.tsx`)
- 12 colores predefinidos + hex custom
- Preview en tiempo real

#### Banner uploader (`components/appearance/banner-uploader.tsx`)
- Upload de imagen 16:9
- Crop/resize
- Preview

#### Aplicar tema en la landing
- El tema se guarda en `businesses.theme`
- En `[businessSlug]/page.tsx` se carga el tema y se pasan las variables CSS al scope
- Las variables CSS controlan: overlay, card-radius, shadow, font, animation, etc.

### 4.9 Verificación Fase 4
- [ ] Landing carga correctamente con datos del negocio
- [ ] Hero muestra banner, logo, nombre, botones
- [ ] Barra de categorías filtra productos al hacer click
- [ ] Grid anima las transiciones al filtrar
- [ ] Product card muestra datos correctos
- [ ] Modal de detalle abre con imagen, precio, descripción
- [ ] Botón WhatsApp genera link con mensaje correcto
- [ ] Sección de contacto y redes sociales funciona
- [ ] Footer CTA de plataforma linkea a /register
- [ ] Temas FREE se aplican correctamente (default, clean, minimal)
- [ ] Al menos 1 tema PRO implementado y funcional
- [ ] Tema Pro rechaza usuarios sin plan Pro
- [ ] Color primario cambia la apariencia de la landing
- [ ] SEO: metadata, Open Graph correctos
- [ ] slug_history redirect funciona (301)
- [ ] 404 si slug no existe

---

## FASE 5 — Funcionalidades de IA

**Objetivo:** Generar descripciones de productos e imágenes con Google Gemini API.

**Dependencias:** Fase 3 completa (form de productos existe).

### 5.1 Cliente Gemini (`lib/ai/gemini.ts`)
```typescript
// Configurar GoogleGenerativeAI con GEMINI_API_KEY
// Export: model para texto (gemini-2.0-flash), model para imágenes (imagen-3.0-generate-002)
```

### 5.2 Generar descripción (`lib/ai/generate-description.ts`)
- Prompt: incluir nombre del producto, categoría del negocio, contexto
- Streaming response (Server-Sent Events)
- Guardar en ai_generations para tracking

### 5.3 Route Handler descripción (`api/ai/generate-description/route.ts`)
- POST con body: { productName, context, businessCategory }
- Verificar auth (user logueado)
- Verificar límite mensual según plan (30 free, 200 pro, ilimitado business)
- Streaming response con ReadableStream
- Rate limit básico

### 5.4 Generar imagen (`lib/ai/generate-image.ts`)
- Prompt construido desde nombre + categoría + estilo
- Imagen 3 retorna base64 → subir a Supabase Storage
- Guardar en ai_generations

### 5.5 Route Handler imagen (`api/ai/generate-image/route.ts`)
- POST con body: { productName, style, businessCategory }
- Verificar auth + límite mensual (15 free, 100 pro, ilimitado business)
- Respuesta: { imageUrl } (URL de Supabase Storage)

### 5.6 Componentes cliente
- **`ai-description-generator.tsx`**: botón "✨ Generar con IA" en el form de producto → llama al endpoint → muestra typewriter effect → "Usar esta descripción" llena el textarea
- **`ai-image-generator.tsx`**: botón "🎨 Generar imagen con IA" → loading skeleton → preview de imagen generada → "Usar esta imagen" la asigna al producto

### 5.7 Conectar al form de productos
- Habilitar los botones IA que estaban disabled en Fase 3
- Integrar con los campos del formulario de producto

### 5.8 Tracking y límites
- Tabla `ai_generations` registra cada uso
- Query para contar usos del mes actual: `SELECT COUNT(*) FROM ai_generations WHERE user_id = ? AND type = ? AND created_at >= date_trunc('month', NOW())`
- Si al límite → mostrar mensaje + CTA upgrade

### 5.9 Verificación Fase 5
- [ ] Generar descripción con IA funciona (streaming/typewriter)
- [ ] Descripción generada se puede copiar al campo del producto
- [ ] Generar imagen funciona y se previsualiza
- [ ] Imagen generada se sube a Storage y se puede asignar
- [ ] Límites mensuales se verifican y se muestra contador
- [ ] Al llegar al límite, se muestra mensaje de upgrade
- [ ] ai_generations se registra cada uso
- [ ] Rate limiting funciona (no se puede spamear)
- [ ] Error handling: si Gemini falla, mensaje amigable

---

## FASE 6 — Marketing, Blog y Polish

**Objetivo:** Landing principal, blog, SEO, animaciones, polish general.

**Dependencias:** Fases 1-5 completas (la landing y blog son independientes conceptualmente, pero hacerlas al final permite usar componentes ya construidos).

### 6.1 Landing marketing (`(marketing)/page.tsx`)
- **Hero section**: título, subtítulo, CTA "Crea tu negocio gratis"
- **Features section**: 4-6 features con íconos (URL propia, productos, IA, temas, WhatsApp, stats)
- **How it works**: 3 pasos (Regístrate → Personaliza → Comparte)
- **Pricing section**: 3 planes (Free, Pro, Business) con features list
- **Testimonials**: (placeholders por ahora)
- **FAQ section**: preguntas frecuentes expandibles
- **CTA final**: "Empieza gratis hoy"
- **Footer**: links, redes sociales, copyright

### 6.2 Blog (`(marketing)/blog/`)
- Blog con MDX (archivos en `src/content/blogs/`)
- Lista de artículos (`blog/page.tsx`): cards con imagen, título, excerpt, fecha
- Artículo individual (`blog/[slug]/page.tsx`): MDX rendering con Typography plugin
- SSG con `generateStaticParams`
- SEO: metadata por artículo, structured data
- Crear 2-3 artículos iniciales

### 6.3 Navbar marketing (`components/shared/navbar.tsx`)
- Logo + nombre de la app
- Links: Inicio, Blog, Planes
- CTA: "Iniciar sesión" / "Registrarse"
- Responsive: hamburger en móvil
- Scroll: background cambia al scrollear

### 6.4 SEO global
- `layout.tsx`: metadata base, viewport, manifest
- `robots.ts`: configurar crawling
- `sitemap.ts`: generar sitemap dinámico (landing + blogs + negocios públicos)
- Open Graph images por defecto
- Structured data (JSON-LD) para negocios

### 6.5 404 y Error boundary
- `not-found.tsx`: página 404 con diseño y CTA
- `error.tsx`: error boundary con opción de reintentar

### 6.6 Polish y animaciones
- Framer Motion en la landing marketing (scroll reveal)
- Transitions suaves en navegación del dashboard
- Loading states con skeletons en todas las páginas que cargan datos
- Toast notifications en todas las acciones (crear, editar, eliminar, error)
- Estados vacíos con ilustraciones o iconografía
- Responsive final: verificar todas las páginas en móvil

### 6.7 Verificación Fase 6
- [ ] Landing marketing completa con todas las secciones
- [ ] Blog renderiza MDX correctamente
- [ ] Navbar responsive y scroll effect
- [ ] SEO: sitemap, robots.txt, metadata, OG images
- [ ] 404 y error pages diseñadas
- [ ] Animaciones fluidas sin layout shift
- [ ] Loading states en todas las páginas con datos
- [ ] Toasts en todas las acciones CRUD
- [ ] Responsive: todo funciona en móvil
- [ ] Lighthouse score > 90 en performance

---

## Orden de Desarrollo por Archivo

Referencia rápida de qué archivos crear en cada fase:

### Fase 0: Setup
| Archivo | Tipo |
|---|---|
| `src/lib/supabase/client.ts` | Supabase browser client |
| `src/lib/supabase/server.ts` | Supabase server client |
| `src/lib/supabase/middleware.ts` | Supabase middleware helper |
| `src/lib/supabase/admin.ts` | Supabase admin client |
| `src/lib/utils.ts` | cn(), formatSlug(), formatPrice() |
| `src/lib/constants.ts` | RESERVED_SLUGS, PLANS, LIMITS |
| `src/lib/types.ts` | Types auto-generados de Supabase |
| `src/components/providers.tsx` | ThemeProvider + Toaster |
| `src/app/layout.tsx` | Root layout con providers |
| `src/app/globals.css` | Tailwind + custom styles |
| `src/app/not-found.tsx` | 404 placeholder |
| `src/app/error.tsx` | Error boundary placeholder |
| `supabase/schema.sql` | Schema SQL completo |

### Fase 1: Auth
| Archivo | Tipo |
|---|---|
| `middleware.ts` | Route protection |
| `src/lib/validations/auth.ts` | Zod schemas auth |
| `src/actions/auth.ts` | Server Actions auth |
| `src/hooks/use-auth.ts` | Auth hook |
| `src/hooks/use-debounce.ts` | Debounce hook |
| `src/app/(auth)/layout.tsx` | Auth layout |
| `src/app/(auth)/login/page.tsx` | Login page |
| `src/app/(auth)/register/page.tsx` | Register page |
| `src/app/(auth)/callback/route.ts` | Auth callback |
| `src/app/(auth)/forgot-password/page.tsx` | Forgot password |
| `src/app/(auth)/reset-password/page.tsx` | Reset password |
| `src/components/auth/login-form.tsx` | Login form |
| `src/components/auth/register-form.tsx` | Register form + slug input |
| `src/components/auth/forgot-password-form.tsx` | Forgot password form |
| `src/components/auth/reset-password-form.tsx` | Reset password form |
| `src/app/api/slug/check/route.ts` | Slug availability API |

### Fase 2: Dashboard + Negocio
| Archivo | Tipo |
|---|---|
| `src/lib/validations/business.ts` | Zod schemas |
| `src/actions/business.ts` | Server Actions |
| `src/actions/upload.ts` | Upload actions |
| `src/actions/social-links.ts` | Social links actions |
| `src/app/(dashboard)/layout.tsx` | Dashboard layout |
| `src/app/(dashboard)/dashboard/page.tsx` | Dashboard home |
| `src/app/(dashboard)/business/create/page.tsx` | Create business |
| `src/app/(dashboard)/business/edit/page.tsx` | Edit business |
| `src/app/(dashboard)/settings/page.tsx` | Account settings |
| `src/components/dashboard/sidebar.tsx` | Sidebar nav |
| `src/components/dashboard/topbar.tsx` | Top bar |
| `src/components/dashboard/stats-cards.tsx` | Stats overview |
| `src/components/dashboard/quick-actions.tsx` | Quick action buttons |
| `src/components/business/business-form.tsx` | Business form |
| `src/components/business/social-links-form.tsx` | Social links CRUD |
| `src/components/shared/image-upload.tsx` | Reusable image uploader |

### Fase 3: Productos + Categorías
| Archivo | Tipo |
|---|---|
| `src/lib/validations/product.ts` | Zod schemas |
| `src/actions/products.ts` | Server Actions |
| `src/actions/categories.ts` | Category actions |
| `src/app/(dashboard)/products/page.tsx` | Product list |
| `src/app/(dashboard)/products/new/page.tsx` | New product |
| `src/app/(dashboard)/products/[id]/edit/page.tsx` | Edit product |
| `src/app/(dashboard)/appearance/page.tsx` | Appearance (categorías + temas) |
| `src/components/products/product-form.tsx` | Product form |
| `src/components/products/product-card.tsx` | Product card (dashboard) |
| `src/components/products/product-list.tsx` | Products table/grid |
| `src/components/appearance/category-manager.tsx` | Category CRUD + drag & drop |

### Fase 4: Landing Pública
| Archivo | Tipo |
|---|---|
| `src/app/[businessSlug]/page.tsx` | Landing page (Server Component) |
| `src/components/business-landing/business-hero.tsx` | Hero fullscreen |
| `src/components/business-landing/category-nav.tsx` | Category icon bar |
| `src/components/business-landing/products-grid.tsx` | Filterable grid |
| `src/components/business-landing/product-card.tsx` | Public product card |
| `src/components/business-landing/product-detail-modal.tsx` | Detail + WhatsApp CTA |
| `src/components/business-landing/business-contact.tsx` | Contact section |
| `src/components/business-landing/business-social-links.tsx` | Social links |
| `src/components/business-landing/platform-cta.tsx` | Platform promo |
| `src/components/appearance/theme-selector.tsx` | Theme picker |
| `src/components/appearance/color-picker.tsx` | Color picker |
| `src/components/appearance/banner-uploader.tsx` | Banner upload |
| `src/components/appearance/landing-preview.tsx` | Live preview |
| `src/lib/themes/types.ts` | Theme interface |
| `src/lib/themes/index.ts` | Theme registry |
| `src/lib/themes/default.ts` | Default theme |
| `src/lib/themes/clean.ts` | Clean theme (FREE) |
| `src/lib/themes/minimal.ts` | Minimal theme (FREE) |
| `src/lib/themes/glassmorphism.ts` | Glassmorphism (PRO) |

### Fase 5: IA
| Archivo | Tipo |
|---|---|
| `src/lib/ai/gemini.ts` | Gemini client config |
| `src/lib/ai/generate-description.ts` | Text generation logic |
| `src/lib/ai/generate-image.ts` | Image generation logic |
| `src/app/api/ai/generate-description/route.ts` | Description endpoint |
| `src/app/api/ai/generate-image/route.ts` | Image endpoint |
| `src/components/products/ai-description-generator.tsx` | Description UI |
| `src/components/products/ai-image-generator.tsx` | Image UI |

### Fase 6: Marketing + Blog
| Archivo | Tipo |
|---|---|
| `src/app/(marketing)/page.tsx` | Landing marketing |
| `src/app/(marketing)/layout.tsx` | Marketing layout |
| `src/app/(marketing)/blog/page.tsx` | Blog list |
| `src/app/(marketing)/blog/[slug]/page.tsx` | Blog article |
| `src/components/marketing/hero-section.tsx` | Hero |
| `src/components/marketing/features-section.tsx` | Features |
| `src/components/marketing/how-it-works.tsx` | Steps |
| `src/components/marketing/pricing-section.tsx` | Pricing |
| `src/components/marketing/faq-section.tsx` | FAQ |
| `src/components/marketing/cta-section.tsx` | CTA |
| `src/components/marketing/footer.tsx` | Footer |
| `src/components/shared/navbar.tsx` | Navbar marketing |
| `src/components/blog/blog-card.tsx` | Blog card |
| `src/components/blog/blog-list.tsx` | Blog grid |
| `src/app/sitemap.ts` | Sitemap dinámico |
| `src/app/robots.ts` | robots.txt |

---

## Reglas de Desarrollo

1. **TypeScript strict**: sin `any`, sin `@ts-ignore`
2. **Server Components por defecto**: solo `'use client'` cuando sea necesario
3. **Validación doble**: Zod en client (UX) + Zod en server (seguridad)
4. **RLS siempre activo**: nunca desactivar Row Level Security
5. **Errores amigables**: nunca exponer errores internos al usuario
6. **Accesibilidad**: labels en inputs, focus visible, keyboard nav, semantic HTML
7. **Responsive**: mobile-first, probar en 3 breakpoints (mobile, tablet, desktop)
8. **Commits atómicos**: un commit por feature/fix funcional
9. **Variables de entorno**: nunca hardcodear keys, URLs o secrets

---

## Checklist Pre-Deploy

- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] RLS activo en todas las tablas de Supabase
- [ ] Storage buckets con políticas correctas
- [ ] `next.config.ts` con `images.remotePatterns` para Supabase
- [ ] Metadata SEO en todas las páginas
- [ ] Sitemap y robots.txt generados
- [ ] 404 y error pages diseñadas
- [ ] Lighthouse > 90 en Performance
- [ ] Sin console.log en producción
- [ ] .env.example actualizado
