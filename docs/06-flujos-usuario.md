# Flujos de Usuario — Wootienda

## 1. Flujo de Registro de Usuario

```
┌──────────────────────────────────────────────────────────────┐
│                    FLUJO DE REGISTRO                          │
└──────────────────────────────────────────────────────────────┘

[Visitante en Landing Page]
        │
        │ Click "Registra tu negocio" (CTA)
        ▼
[/register — Formulario de Registro]
        │
        │ Campos:
        │  ├── Nombre completo
        │  ├── Username (slug) ← validación en tiempo real
        │  │    └── wootienda.com/mi-negocio (preview)
        │  ├── Email
        │  ├── Contraseña
        │  ├── Confirmar contraseña
        │  └── Aceptar términos
        │
        │ Submit → Server Action: registerUser()
        ▼
[Supabase Auth: signUp()]
        │
        │ Se guarda en user_metadata:
        │  ├── full_name
        │  └── username (slug elegido)
        │
        ▼
[Pantalla: "Revisa tu correo electrónico"]
        │
        │ Se muestra:
        │  "Hemos enviado un email a tu@correo.com"
        │  "Tu URL será: wootienda.com/tu-slug"
        │
        ▼
[Usuario revisa email → Click en link de confirmación]
        │
        │ Link: wootienda.com/auth/callback?token=xxx&type=signup
        ▼
[/auth/callback — Route Handler]
        │
        │ Verifica token con Supabase
        │ Crea sesión
        │ Verifica si tiene negocio:
        │
        ├── SÍ tiene negocio ──→ Redirect a /dashboard
        │
        └── NO tiene negocio ──→ Redirect a /business/create
                                   (con slug precargado desde user_metadata)
```

---

## 2. Flujo de Inicio de Sesión

```
[/login — Formulario de Login]
        │
        │ Campos:
        │  ├── Email
        │  └── Contraseña
        │
        │ Submit → Server Action: loginUser()
        ▼
[Supabase Auth: signInWithPassword()]
        │
        ├── Error ──→ Toast: "Credenciales incorrectas"
        │              (permanecer en /login)
        │
        └── Éxito ──→ Verificar si tiene negocio
                │
                ├── SÍ ──→ Redirect a /dashboard
                └── NO ──→ Redirect a /business/create
```

---

## 3. Flujo de Recuperación de Contraseña

```
[/login — Click "¿Olvidaste tu contraseña?"]
        │
        ▼
[/forgot-password — Formulario]
        │
        │ Campo: Email
        │ Submit → Supabase: resetPasswordForEmail()
        ▼
[Pantalla: "Revisa tu correo"]
        │
        ▼
[Usuario abre email → Click en link]
        │
        │ Link: wootienda.com/reset-password?token=xxx
        ▼
[/reset-password — Formulario]
        │
        │ Campos:
        │  ├── Nueva contraseña
        │  └── Confirmar contraseña
        │
        │ Submit → Supabase: updateUser({ password })
        ▼
[Toast: "Contraseña actualizada"]
        │
        └── Redirect a /login
```

---

## 4. Flujo de Creación de Negocio

```
[/business/create — Formulario Multi-Step]
        │
        ▼
┌─── STEP 1: Información Básica ───┐
│                                    │
│  • Nombre del negocio              │
│  • Slug (precargado, editable)     │
│  • Categoría (select)              │
│  • Descripción corta               │
│                                    │
│  [Siguiente →]                     │
└────────────────────────────────────┘
        │
        ▼
┌─── STEP 2: Contacto ─────────────┐
│                                    │
│  • Email de contacto               │
│  • Teléfono                        │
│  • WhatsApp                        │
│  • Website                         │
│                                    │
│  [← Anterior]  [Siguiente →]      │
└────────────────────────────────────┘
        │
        ▼
┌─── STEP 3: Ubicación ────────────┐
│                                    │
│  • Ciudad                          │
│  • Departamento                    │
│  • Dirección                       │
│                                    │
│  [← Anterior]  [Siguiente →]      │
└────────────────────────────────────┘
        │
        ▼
┌─── STEP 4: Apariencia ───────────┐
│                                    │
│  • Subir logo (image-upload)       │
│  • Subir banner (image-upload)     │
│  • Seleccionar tema                │
│                                    │
│  [← Anterior]  [Crear Negocio ✓]  │
└────────────────────────────────────┘
        │
        │ Submit → Server Action: createBusiness()
        │  1. Insertar en tabla businesses
        │  2. Upload logo/banner a Supabase Storage
        │  3. Crear registro en business_stats
        ▼
[Toast: "¡Negocio creado exitosamente!"]
        │
        └── Redirect a /dashboard
```

---

## 5. Flujo del Dashboard

```
[/dashboard — Vista General]
        │
        ├── Stats Cards (vistas, visitantes, productos, clicks)
        ├── Productos recientes (últimos 5)
        ├── Acciones rápidas
        │     ├── + Nuevo producto
        │     ├── Editar negocio
        │     ├── Cambiar banner
        │     └── Ver mi página (abre /slug en nueva tab)
        │
        │
[Sidebar de navegación]
        │
        ├── Dashboard (/dashboard)
        ├── Mi Negocio (/business/edit)
        ├── Productos (/products)
        ├── Apariencia (/appearance)
        └── Configuración (/settings)
```

---

## 6. Flujo de Gestión de Productos

```
[/products — Lista de Productos]
        │
        ├── Filtros: Categoría, Estado (activo/inactivo)
        ├── Ordenar: Fecha, Precio, Nombre
        ├── Grid de ProductCards
        │     ├── [Card] → Click → /products/[id]/edit
        │     ├── Toggle activo/inactivo (inline)
        │     └── Eliminar (con confirmación)
        │
        └── [+ Nuevo Producto] → /products/new
                │
                ▼
[/products/new — Formulario de Producto]
        │
        │ Campos:
        │  ├── Nombre
        │  ├── Descripción ← [🪄 Generar con IA]
        │  ├── Descripción corta
        │  ├── Precio + Moneda
        │  ├── Categoría
        │  ├── Imagen ← [🖼️ Generar con IA] o [Upload]
        │  └── Destacado (switch)
        │
        │ Submit → Server Action: createProduct()
        ▼
[Toast: "Producto creado"]
        │
        └── Redirect a /products
```

---

## 7. Flujo de Generación con IA

### 7.1 Generar Descripción

```
[Usuario en formulario de producto]
        │
        │ Escribe nombre del producto o una guía
        │ Click "🪄 Generar descripción con IA"
        ▼
[Verificar límite de generaciones del plan]
        │
        ├── Límite alcanzado → Modal: "Upgrade a Pro para más generaciones"
        │
        └── Disponible → POST /api/ai/generate-description
                │
                │ Body: { productName, context, businessCategory }
                │
                ▼
        [Google Gemini — gemini-2.0-flash]
                │
                │ Streaming response (typewriter effect)
                ▼
        [Descripción generada visible en textarea]
                │
                ├── [✓ Usar esta descripción] → Se llena el campo
                ├── [↻ Regenerar] → Nueva petición
                └── [✗ Cancelar] → Se descarta
                │
                │ Se registra en ai_generations
                ▼
        [Contador de generaciones actualizado]
```

### 7.2 Generar Imagen

```
[Usuario en formulario de producto]
        │
        │ Escribe descripción para la imagen
        │ Click "🖼️ Generar imagen con IA"
        ▼
[Verificar límite de generaciones del plan]
        │
        ├── Límite alcanzado → Modal upgrade
        │
        └── Disponible → POST /api/ai/generate-image
                │
                │ Body: { description, style: "product-photo" }
                │
                ▼
        [Google Imagen 3 via Gemini API]
                │
                │ Loading state (skeleton + "Generando imagen...")
                │ ~5-15 segundos
                ▼
        [Preview de imagen generada]
                │
                ├── [✓ Usar esta imagen] → Upload a Supabase Storage
                │                          → URL se asigna al producto
                ├── [↻ Regenerar]
                └── [✗ Cancelar]
```

---

## 8. Flujo de la Landing Pública del Negocio

```
[Visitante accede a wootienda.com/nombre-negocio]
        │
        ▼
[Middleware: verificar si es ruta de app o slug de negocio]
        │
        ├── Ruta de app (blog, auth, etc.) → Continuar normalmente
        │
        └── Posible slug de negocio → /[businessSlug]/page.tsx
                │
                ▼
        [Server Component: buscar negocio por slug]
                │
                ├── No encontrado → notFound() → 404
                │
                ├── Negocio inactivo → notFound() → 404
                │
                └── Encontrado → Render landing
                        │
                        │ Incrementar vista (business_stats)
                        │
                        ▼
                [Landing pública del negocio — Estructura dinámica]
                        │
                        │ === HERO FULLSCREEN ===
                        ├── Banner de fondo (parallax/overlay oscuro)
                        ├── Logo circular (borde color primario)
                        ├── Nombre del negocio + subtítulo
                        ├── Botones de navegación interna (Servicios, Nosotros, etc.)
                        │     └── (en móvil se apilan verticalmente)
                        ├── CTA de plataforma: "¿Quieres tu propia página?"
                        │
                        │ === BARRA DE CATEGORÍAS ===
                        ├── Íconos circulares de categorías del negocio
                        │     ├── Ej: (⊙) Redes  (⊙) Menú  (⊙) Diseño  (⊙) Branding
                        │     ├── Scroll horizontal en móvil
                        │     ├── Click cambia categoría activa
                        │     └── Filtra el grid de productos dinámicamente
                        │
                        │ === GRID DE PRODUCTOS ===
                        ├── Grid 3 cols desktop / 2 tablet / 1 móvil
                        │     ├── Card: imagen + badge categoría + nombre + $precio
                        │     ├── Hover: scale + shadow
                        │     ├── Animación stagger al cargar + AnimatePresence al filtrar
                        │     └── Click en card → abre modal de detalle
                        │
                        │ === MODAL DETALLE PRODUCTO ===
                        ├── Imagen grande (zoom on hover/pinch)
                        ├── Nombre + Precio destacado
                        ├── Descripción completa
                        ├── [🟢 Compra por WhatsApp] ← CTA principal
                        │     └── Abre wa.me/{num}?text=Hola, me interesa {producto}...
                        │
                        │ === CONTACTO + REDES ===
                        ├── Información de contacto (WhatsApp, tel, email, dirección)
                        ├── Redes sociales (íconos con brand colors)
                        │
                        │ === FOOTER ===
                        └── "Creado con [Plataforma]" + link a /register
```

---

## 9. Flujo de Apariencia

```
[/appearance — Personalización]
        │
        ├── Banner
        │     ├── Preview del banner actual
        │     ├── [Cambiar banner] → image-upload (16:9, max 5MB)
        │     └── [Eliminar banner]
        │
        ├── Tema
        │     ├── Grid de temas con preview visual en miniatura
        │     ├── 3 temas FREE: default, clean, minimal
        │     ├── 8+ temas PRO: glassmorphism, neon-glow, gradient-mesh, etc.
        │     │     └── Temas Pro tienen badge 🔒 y al click → Modal upgrade
        │     ├── "Vista previa" → abre modal con landing completa en ese tema
        │     └── Click para seleccionar → guarda inmediatamente
        │
        ├── Color Primario
        │     ├── Paleta de 12 colores predefinidos
        │     ├── Input color custom (#hex)
        │     └── Preview en tiempo real de botones, precios, badges
        │
        ├── Categorías de Productos
        │     ├── Lista de categorías del negocio (drag & drop para reordenar)
        │     ├── Cada una con: nombre + ícono (Lucide o custom)
        │     ├── [+ Nueva categoría] → inline form
        │     ├── Editar / Eliminar cada categoría
        │     └── Máximo 8 categorías
        │
        └── Preview en Vivo
              ├── Vista de la landing completa con cambios aplicados
              └── Botón "Ver mi página" → abre /slug en nueva pestaña
```

---

## 10. Protección de Rutas (Middleware)

```
[Toda request]
        │
        ▼
[middleware.ts]
        │
        │ 1. Refresh session de Supabase
        │ 2. Verificar ruta:
        │
        ├── PÚBLICA (sin auth requerido):
        │     /
        │     /blog, /blog/*
        │     /login, /register
        │     /forgot-password, /reset-password
        │     /auth/callback
        │     /api/slug/check
        │     /[businessSlug] (landings públicas)
        │
        ├── PROTEGIDA (requiere auth):
        │     /dashboard/*
        │     /business/*
        │     /products/*
        │     /appearance/*
        │     /settings/*
        │     /api/ai/*
        │     /api/upload
        │     │
        │     ├── NO autenticado → Redirect a /login
        │     └── Autenticado → Continuar
        │
        └── AUTH (si ya está logueado):
              /login, /register
              │
              └── Autenticado → Redirect a /dashboard
```

---

## 11. Manejo de la Ruta Dinámica `[businessSlug]`

**Problema:** El slug del negocio está en el root (`/nombre-negocio`), lo que puede conflictoar con rutas de la app.

**Solución:** 
1. Las rutas de la app usan **route groups** `(marketing)`, `(auth)`, `(dashboard)` que no afectan la URL
2. Las rutas con nombre propio (`/blog`, `/login`, etc.) tienen prioridad sobre `[businessSlug]` porque Next.js prioriza rutas estáticas sobre dinámicas
3. El middleware ayuda a verificar la sesión pero no interviene en el routing de slugs
4. El `[businessSlug]/page.tsx` verifica en la BD si el slug existe, si no → `notFound()`
5. Se mantiene una lista de **slugs reservados** en la BD que se validan al crear un negocio
