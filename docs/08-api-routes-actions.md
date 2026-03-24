# API Routes & Server Actions — Wootienda

## 1. Estrategia de API

| Tipo | Cuándo usar | Ejemplos |
|---|---|---|
| **Server Actions** | Mutaciones desde formularios, acciones de usuario | CRUD negocio, CRUD productos, upload |
| **Route Handlers** | APIs externas, streaming, validaciones async, webhooks | IA, check slug, callbacks auth |

---

## 2. Server Actions

### 2.1 Auth Actions (`src/actions/auth.ts`)

```typescript
'use server'

// loginUser(formData) → redirect a /dashboard o error
export async function loginUser(formData: FormData): Promise<ActionResult>

// registerUser(formData) → crea usuario en Supabase Auth + redirect
export async function registerUser(formData: FormData): Promise<ActionResult>

// logoutUser() → cierra sesión + redirect a /
export async function logoutUser(): Promise<void>

// updatePassword(formData) → actualiza contraseña
export async function updatePassword(formData: FormData): Promise<ActionResult>
```

### 2.2 Business Actions (`src/actions/business.ts`)

```typescript
'use server'

// createBusiness(formData) → inserta negocio + redirect a /dashboard
export async function createBusiness(formData: FormData): Promise<ActionResult>

// updateBusiness(formData) → actualiza datos del negocio
export async function updateBusiness(businessId: string, formData: FormData): Promise<ActionResult>

// updateBusinessAppearance(data) → actualiza tema, banner, color
export async function updateBusinessAppearance(data: AppearanceData): Promise<ActionResult>

// deleteBusiness(businessId) → elimina negocio (soft delete: is_active = false)
export async function deleteBusiness(businessId: string): Promise<ActionResult>
```

### 2.3 Product Actions (`src/actions/products.ts`)

```typescript
'use server'

// createProduct(formData) → inserta producto
export async function createProduct(formData: FormData): Promise<ActionResult>

// updateProduct(productId, formData) → actualiza producto
export async function updateProduct(productId: string, formData: FormData): Promise<ActionResult>

// deleteProduct(productId) → elimina producto
export async function deleteProduct(productId: string): Promise<ActionResult>

// toggleProductActive(productId) → cambia is_active
export async function toggleProductActive(productId: string): Promise<ActionResult>

// reorderProducts(productIds) → actualiza display_order
export async function reorderProducts(productIds: string[]): Promise<ActionResult>
```

### 2.4 Upload Actions (`src/actions/upload.ts`)

```typescript
'use server'

// uploadImage(formData) → sube imagen a Supabase Storage
// formData contiene: file, bucket, folder (e.g. "logo", "banner", "products")
export async function uploadImage(formData: FormData): Promise<{ url: string }>

// deleteImage(path) → elimina imagen de Storage
export async function deleteImage(path: string): Promise<ActionResult>
```

### 2.5 Social Links Actions (`src/actions/social-links.ts`)

```typescript
'use server'

// updateSocialLinks(businessId, links) → upsert de links sociales
export async function updateSocialLinks(
  businessId: string, 
  links: SocialLink[]
): Promise<ActionResult>
```

---

## 3. Route Handlers (API)

### 3.1 Check Slug — `GET /api/slug/check`

```
GET /api/slug/check?slug=mi-negocio

Response 200:
{ "available": true }

Response 200:
{ "available": false, "reason": "taken" }

Response 200:
{ "available": false, "reason": "reserved" }

Response 400:
{ "error": "Invalid slug format" }
```

**Implementación:**
- No requiere autenticación (se usa en el formulario de registro)
- Valida formato del slug
- Verifica contra slugs reservados (is_reserved_slug)
- Verifica contra tabla businesses
- Rate limited (IP-based, max 30 req/min)

### 3.2 Generate Description — `POST /api/ai/generate-description`

```
POST /api/ai/generate-description
Authorization: Bearer (cookie de sesión Supabase)

Body:
{
  "productName": "Café artesanal premium",
  "context": "Café de especialidad cultivado en la Sierra Nevada",
  "businessCategory": "alimentos",
  "businessName": "Café Sierra"
}

Response: text/plain (streaming)
"Descubre el sabor auténtico de la Sierra Nevada..."
```

**Implementación:**
- Requiere autenticación
- Verifica límite de generaciones del plan
- Streaming response con Google Gemini (gemini-2.0-flash)
- Registra generación en ai_generations

### 3.3 Generate Image — `POST /api/ai/generate-image`

```
POST /api/ai/generate-image
Authorization: Bearer (cookie de sesión Supabase)

Body:
{
  "description": "Bolso de cuero artesanal color marrón",
  "businessCategory": "accesorios"
}

Response 200:
{
  "imageBase64": "/9j/4AAQSkZJRg...",
  "mimeType": "image/png"
}

Response 429:
{ "error": "Generation limit reached", "current": 15, "limit": 15 }
```

**Implementación:**
- Requiere autenticación
- Verifica límite de generaciones
- Llama a Google Imagen 3 via Gemini API (capa gratuita)
- Retorna imagen en base64 (el client la sube a Supabase Storage)
- Registra generación en ai_generations

### 3.4 Auth Callback — `GET /api/auth/callback`

```
GET /auth/callback?code=xxx&type=signup
GET /auth/callback?code=xxx&type=recovery
```

**Implementación:**
- Verifica el código con Supabase
- Intercambia por sesión
- Redirige según el tipo:
  - `signup` → verificar si tiene negocio → `/dashboard` o `/business/create`
  - `recovery` → `/reset-password`

### 3.5 Track View — `POST /api/track/view`

```
POST /api/track/view

Body:
{
  "businessId": "uuid",
  "type": "page_view" | "product_view" | "contact_click"
}

Response 200:
{ "ok": true }
```

**Implementación:**
- No requiere autenticación (visitantes públicos)
- Rate limited por IP
- Incrementa contadores en business_stats
- Upsert del mes/año actual

---

## 4. Middleware (`middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  '/dashboard',
  '/business/create',
  '/business/edit',
  '/products',
  '/appearance',
  '/settings',
]

// Rutas de auth (si ya logueado → redirect)
const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Crear response y refresh session
  let response = NextResponse.next({ request })
  const supabase = createServerClient(/* config con cookies */)
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Proteger rutas privadas
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. Redirect si ya está logueado y va a auth
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r))
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 5. Tipos Compartidos

```typescript
// lib/types.ts

export type ActionResult = {
  success: boolean
  error?: string
  data?: unknown
}

export type Business = {
  id: string
  user_id: string
  slug: string
  business_name: string
  category: string
  industry?: string
  description?: string
  short_description?: string
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  city?: string
  department?: string
  address?: string
  logo_url?: string
  banner_url?: string
  theme: string
  primary_color: string
  is_active: boolean
  is_verified: boolean
  plan: 'free' | 'pro' | 'business'
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  business_id: string
  name: string
  description?: string
  short_description?: string
  price?: number
  currency: string
  category?: string
  tags: string[]
  image_url?: string
  ai_generated_description: boolean
  ai_generated_image: boolean
  display_order: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type SocialLink = {
  id: string
  business_id: string
  platform: string
  url: string
  display_order: number
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  content: string
  excerpt?: string
  cover_image_url?: string
  author: string
  tags: string[]
  is_published: boolean
  published_at?: string
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}
```

---

## 6. Validaciones con Zod

```typescript
// lib/validations/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Solo letras minúsculas, números y guiones'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar los términos' }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// lib/validations/business.ts
export const businessSchema = z.object({
  businessName: z.string().min(2).max(255),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/),
  category: z.string().min(1),
  industry: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  shortDescription: z.string().max(300).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  whatsapp: z.string().max(50).optional(),
  website: z.string().url().optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
})

// lib/validations/product.ts
export const productSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().max(2000).optional(),
  shortDescription: z.string().max(300).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  category: z.string().max(100).optional(),
  isFeatured: z.boolean().default(false),
})
```

---

## 7. SEO & Metadata

### 7.1 Metadata Estática (Layout root)

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Wootienda — Tu presencia digital al instante',
    template: '%s | Wootienda'
  },
  description: 'Registra tu negocio y obtén una landing page profesional con URL personalizada. Genera contenido con IA.',
  openGraph: { /* ... */ },
}
```

### 7.2 Metadata Dinámica (Landing de negocio)

```typescript
// app/[businessSlug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const business = await getBusiness(params.businessSlug)
  return {
    title: business.business_name,
    description: business.short_description,
    openGraph: {
      title: business.business_name,
      description: business.short_description,
      images: [business.banner_url || business.logo_url],
    }
  }
}
```

### 7.3 Metadata del Blog

```typescript
// app/(marketing)/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image_url],
      type: 'article',
      publishedTime: post.published_at,
    }
  }
}
```
