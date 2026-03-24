# Componentes & Formularios — Wootienda

## 1. Componentes Globales Compartidos

### 1.1 `shared/navbar.tsx`
- **Tipo:** Client Component
- **Uso:** Landing marketing, blog
- **Props:** `variant: 'marketing' | 'minimal'`
- **Contenido:**
  - Logo
  - Links: Inicio, Blog, Directorio, Precios
  - CTA: Registrar mi negocio / Iniciar sesión
  - Menú hamburguesa en móvil (Framer Motion)
  - Cambio de apariencia al hacer scroll (sticky + blur)

### 1.2 `shared/logo.tsx`
- **Tipo:** Server Component
- **Props:** `size: 'sm' | 'md' | 'lg'`, `variant: 'full' | 'icon'`
- SVG inline para evitar request adicional

### 1.3 `shared/loading-spinner.tsx`
- **Tipo:** Client Component
- Spinner animado con Tailwind
- Usado en `loading.tsx` y Suspense fallbacks

### 1.4 `shared/image-upload.tsx`
- **Tipo:** Client Component
- Drag & drop + click to upload
- Preview de imagen
- Compresión client-side antes de subir
- Props: `bucket`, `folder`, `maxSize`, `aspectRatio`
- Output: URL de Supabase Storage

### 1.5 `shared/search-bar.tsx`
- **Tipo:** Client Component
- Input con ícono de búsqueda
- Debounce 300ms
- Usado en directorio y dashboard

---

## 2. Componentes de Marketing (Landing)

### 2.1 `marketing/hero-section.tsx`
- **Tipo:** Server Component
- Headline principal + subtítulo
- CTA: "Registra tu negocio gratis"
- Animación de entrada con Framer Motion (client wrapper)
- Imagen/ilustración hero

### 2.2 `marketing/features-section.tsx`
- **Tipo:** Server Component
- Grid de 3-4 features principales
- Iconos de Lucide
- Texto descriptivo breve

### 2.3 `marketing/how-it-works.tsx`
- **Tipo:** Server Component
- 3 pasos: Regístrate → Configura → Comparte
- Ilustraciones/iconos por paso
- Timeline visual

### 2.4 `marketing/pricing-section.tsx`
- **Tipo:** Server Component
- 3 cards: Free, Pro, Business
- Toggle mensual/anual
- CTA por plan
- Badge "Popular" en Pro

### 2.5 `marketing/testimonials.tsx`
- **Tipo:** Server Component 
- Carousel con cards de testimonios
- Avatar, nombre, negocio, texto

### 2.6 `marketing/faq-section.tsx`
- **Tipo:** Client Component (Accordion)
- Preguntas frecuentes expandibles
- Usando shadcn/ui Accordion

### 2.7 `marketing/cta-section.tsx`
- Sección de cierre con CTA grande
- "Empieza gratis hoy"

### 2.8 `marketing/footer.tsx`
- **Tipo:** Server Component
- Links: Términos, Privacidad, Blog, Contacto
- Redes sociales
- Copyright

---

## 3. Componentes de Autenticación

### 3.1 `auth/login-form.tsx`
- **Tipo:** Client Component
- **Campos:**
  - Email (input email, required)
  - Contraseña (input password, min 6 chars)
- **Acciones:**
  - Botón "Iniciar sesión" → Server Action
  - Link "¿Olvidaste tu contraseña?" → `/forgot-password`
  - Link "¿No tienes cuenta? Regístrate" → `/register`
- **Validación:** Zod + react-hook-form
- **Feedback:** Sonner toast en error/éxito

### 3.2 `auth/register-form.tsx`
- **Tipo:** Client Component
- **Campos:**
  - Nombre completo (input text, required)
  - Username / slug (slug-input con validación en tiempo real)
  - Email (input email, required)
  - Contraseña (input password, min 6 chars)
  - Confirmar contraseña (must match)
  - Checkbox aceptar términos
- **Preview:** "Tu URL será: wootienda.com/{username}"
- **Validación:** Zod + react-hook-form
- **Post-registro:** Pantalla de "Revisa tu email"

### 3.3 `auth/slug-input.tsx`
- **Tipo:** Client Component
- Input especial para el slug/username
- **Comportamiento:**
  1. El usuario escribe texto libre
  2. Se auto-formatea: minúsculas, sin acentos, espacios → guiones
  3. Debounce 500ms → fetch a `/api/slug/check`
  4. Estados visuales:
     - ⏳ Verificando... (spinner)
     - ✅ Disponible (check verde)
     - ❌ No disponible o reservado (X roja)
  5. Preview: `wootienda.com/slug-formateado`
- **Props:** `value`, `onChange`, `onValidityChange`

### 3.4 `auth/forgot-password-form.tsx`
- **Tipo:** Client Component
- **Campo:** Email
- **Acción:** Envía email de recuperación via Supabase Auth
- **Feedback:** "Si el email existe, recibirás instrucciones"

### 3.5 `auth/reset-password-form.tsx`
- **Tipo:** Client Component
- **Campos:** Nueva contraseña + Confirmar contraseña
- **Accede con:** Token en URL (query param)
- **Post-reset:** Redirect a `/login`

---

## 4. Componentes del Dashboard

### 4.1 `dashboard/sidebar.tsx`
- **Tipo:** Client Component
- **Links:**
  - Dashboard (overview)
  - Mi Negocio (editar)
  - Productos (lista)
  - Apariencia (banner, tema)
  - Configuración (cuenta)
- Responsive: drawer en móvil, sidebar fija en desktop
- Indicador de ruta activa
- Logo + nombre del negocio en el top
- Botón "Ver mi página" (abre `/slug` en nueva pestaña)

### 4.2 `dashboard/topbar.tsx`
- **Tipo:** Client Component
- Botón de menú hamburguesa (móvil)
- Breadcrumb de la ruta actual
- Avatar del usuario + dropdown (Perfil, Cerrar sesión)

### 4.3 `dashboard/stats-cards.tsx`
- **Tipo:** Server Component
- Grid 2x2 o 4 columnas:
  - Total de vistas (este mes)
  - Visitantes únicos
  - Productos activos
  - Clicks de contacto

### 4.4 `dashboard/recent-products.tsx`
- **Tipo:** Server Component
- Lista de los últimos 5 productos creados
- Thumbnail, nombre, precio, estado
- Link "Ver todos"

### 4.5 `dashboard/quick-actions.tsx`
- **Tipo:** Server Component
- Botones rápidos:
  - + Nuevo producto
  - Editar negocio
  - Cambiar banner
  - Ver mi página

---

## 5. Componentes de Negocio

### 5.1 `business/business-form.tsx`
- **Tipo:** Client Component
- **Modo:** Crear / Editar (reutilizable)
- **Campos del formulario:**

| Campo | Tipo | Validación | Requerido |
|---|---|---|---|
| Nombre del negocio | text | min 2, max 255 | ✅ |
| Slug (URL) | slug-input | unique, formatted | ✅ (precargado desde registro) |
| Categoría | select | lista predefinida | ✅ |
| Industria | text | max 100 | ❌ |
| Descripción | textarea | max 2000 | ❌ |
| Descripción corta | text | max 300 | ❌ |
| Email de contacto | email | valid email | ❌ |
| Teléfono | tel | valid phone | ❌ |
| WhatsApp | tel | valid phone | ❌ |
| Website | url | valid URL | ❌ |
| Ciudad | text | max 100 | ❌ |
| Departamento | select | lista de departamentos | ❌ |
| Dirección | textarea | max 500 | ❌ |

- **Sections:** Información básica → Contacto → Ubicación
- **Step form** (multi-step) para la creación inicial
- **Formulario simple** para edición

### 5.2 `business/business-preview.tsx`
- **Tipo:** Client Component
- Preview en tiempo real de cómo se verá la landing pública
- Se actualiza mientras el usuario edita el formulario

---

## 6. Componentes de Productos

### 6.1 `products/product-form.tsx`
- **Tipo:** Client Component
- **Campos:**

| Campo | Tipo | Validación | Requerido |
|---|---|---|---|
| Nombre | text | min 2, max 255 | ✅ |
| Descripción | textarea | max 2000 | ❌ |
| Descripción corta | text | max 300 | ❌ |
| Precio | number | >= 0 | ❌ |
| Moneda | select | USD, COP, etc. | ❌ |
| Categoría | select/crear nueva | del catálogo del negocio | ✅ |
| Imagen | image-upload | max 5MB, jpg/png/webp | ❌ |
| Destacado | switch | boolean | ❌ |

- **Botones IA:**
  - 🪄 "Generar descripción con IA" (junto al campo descripción)
  - 🖼️ "Generar imagen con IA" (junto al campo imagen)

### 6.2 `products/product-card.tsx`
- **Tipo:** Server Component
- Card con imagen, nombre, precio, estado (activo/inactivo)
- Acciones: Editar, Eliminar, Toggle activo
- Badges: "IA" si fue generado con IA

### 6.3 `products/product-list.tsx`
- **Tipo:** Server Component + Client wrapper
- Grid responsive de product-cards
- Filtros: Categoría, Estado
- Ordenar: Fecha, Precio, Nombre
- Botón "+ Nuevo producto"
- Empty state si no hay productos

### 6.4 `products/ai-description-generator.tsx`
- **Tipo:** Client Component
- **Input:** Texto guía / nombre del producto
- **Botón:** "Generar descripción"
- **Output:** Descripción generada (streaming con typewriter effect)
- **Acciones:** "Usar esta descripción" / "Regenerar"
- Contador de generaciones restantes (plan free)

### 6.5 `products/ai-image-generator.tsx`
- **Tipo:** Client Component
- **Input:** Descripción del producto para la imagen
- **Botón:** "Generar imagen"
- **Output:** Preview de imagen generada
- **Acciones:** "Usar esta imagen" / "Regenerar"
- Loading state con skeleton
- Contador de generaciones restantes

---

## 7. Componentes de Apariencia

### 7.1 `appearance/theme-selector.tsx`
- **Tipo:** Client Component
- Grid de temas con **preview en vivo** (miniatura renderizada de cómo se ve la landing)
- Cada card muestra: nombre del tema, preview, badge "FREE" o "PRO" 🔒
- **Temas Free:** default, clean, minimal (3 temas gratuitos)
- **Temas Pro:** glassmorphism, neon-glow, gradient-mesh, magazine, dark-luxury, storefront, vibrant, elegant-serif (8+ temas premium con diseños avanzados)
- Si el usuario con plan Free intenta seleccionar un tema Pro → Modal de upgrade
- Selección visual: borde animado + check en el tema activo
- **Preview interactivo:** Click en "Vista previa" abre un modal con la landing completa usando ese tema

### 7.2 `appearance/banner-uploader.tsx`
- **Tipo:** Client Component
- Upload de imagen para banner (16:9 o similar)
- Crop/resize integrado
- Preview del banner actual
- Botón cambiar/eliminar

### 7.3 `appearance/color-picker.tsx`
- **Tipo:** Client Component
- Selector de color primario del negocio
- Paleta de 12 colores predefinidos + input hex custom
- Preview en tiempo real de cómo se ven los botones, precios, badges

### 7.4 `appearance/category-manager.tsx`
- **Tipo:** Client Component
- CRUD de categorías del negocio (las que se muestran en la barra de navegación de la landing)
- Cada categoría tiene:
  - Nombre (ej: "Redes", "Diseño", "Branding")
  - Ícono (selector de ícono de Lucide, o subir ícono custom)
  - Orden de display (drag & drop para reordenar)
- Máximo 8 categorías por negocio
- Estas categorías se asignan a los productos desde el formulario de producto

### 7.5 `appearance/landing-preview.tsx`
- **Tipo:** Client Component
- Preview completo de la landing del negocio con el tema actual
- Renderizado dentro de un iframe o contenedor escalado
- Se actualiza en tiempo real al cambiar tema/color/banner
- Botón "Ver mi página" que abre la URL real en nueva pestaña

---

## 8. Componentes de Landing Pública del Negocio

La landing pública de cada negocio es una página dinámica e interactiva. La estructura sigue este layout (referencia: estilo Wootienda):

```
┌──────────────────────────────────────────────────────────┐
│                    HERO FULLSCREEN                        │
│  ┌──────────┐                                            │
│  │  LOGO    │  Nombre del Negocio                        │
│  │ circular │  Subtítulo / descripción corta              │
│  └──────────┘                                            │
│     Fondo: banner del negocio (parallax o overlay oscuro)│
│                                                          │
│  [ SERVICIOS ]  [ NOSOTROS ]  [ CONTACTO ]  [ BLOG ]    │
│  (botones de navegación interna / secciones del negocio) │
│                                                          │
│  "¿Quieres tu propia página? Clic Aquí" (CTA plataforma)│
└──────────────────────────────────────────────────────────┘
│                                                          │
│         BARRA DE CATEGORÍAS (íconos circulares)          │
│  (⊙) Redes  (⊙) Menú  (⊙) Diseño  (⊙) Branding  →     │
│         ← scroll horizontal en móvil                     │
│         Click en categoría → filtra el grid ↓            │
│                                                          │
├──────────────────────────────────────────────────────────┤
│              GRID DE PRODUCTOS (3 cols desktop)           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                  │
│  │ [image] │  │ [image] │  │ [image] │                  │
│  │ Categ.  │  │ Categ.  │  │ Categ.  │                  │
│  │ Nombre  │  │ Nombre  │  │ Nombre  │                  │
│  │ $Precio │  │ $Precio │  │ $Precio │                  │
│  └─────────┘  └─────────┘  └─────────┘                  │
│  (animación stagger al aparecer, hover scale + shadow)   │
│  Click en card → abre MODAL/VISTA DETALLE ↓              │
├──────────────────────────────────────────────────────────┤
│              VISTA DETALLE DEL PRODUCTO (Modal)          │
│  ┌──────────────┐  Nombre del producto                   │
│  │              │  $Precio (destacado en color primario)  │
│  │  Imagen      │  Descripción completa                  │
│  │  (con zoom)  │                                        │
│  │              │  [🟢 Compra por WhatsApp]               │
│  └──────────────┘  (abre WhatsApp con mensaje predefinido)│
├──────────────────────────────────────────────────────────┤
│              SECCIÓN DE CONTACTO                          │
│  WhatsApp · Teléfono · Email · Dirección                 │
├──────────────────────────────────────────────────────────┤
│              REDES SOCIALES (íconos)                      │
├──────────────────────────────────────────────────────────┤
│              FOOTER                                       │
│  "Creado con [Plataforma]" ← CTA para nuevos registros  │
└──────────────────────────────────────────────────────────┘
```

### 8.1 `business-landing/business-hero.tsx`
- **Tipo:** Server Component + Client wrapper para animaciones
- **Estructura:**
  - Imagen de banner como fondo (fullscreen viewport height) con overlay oscuro semitransparente
  - Logo circular centrado (con borde del color primario del negocio)
  - Nombre del negocio (tipografía grande, bold, blanca)
  - Subtítulo / descripción corta
  - **Botones de navegación interna:** links a secciones de la página (scroll suave)
    - El negocio define estos botones desde el dashboard (ej: Servicios, Nosotros, Contacto)
    - Estilo: botones con color primario del negocio, bordes redondeados
  - **CTA de la plataforma:** "¿Quieres tu propia página? Clic Aquí" → link a `/register`
- **Animaciones:** Fade in del logo + stagger de los botones con Framer Motion
- **Responsive:** En móvil los botones se apilan verticalmente (como en la referencia Wootienda)

### 8.2 `business-landing/category-nav.tsx`
- **Tipo:** Client Component
- **Estructura:**
  - Barra horizontal de categorías del negocio
  - Cada categoría tiene un **ícono circular** (seleccionable desde el dashboard) + label
  - Scroll horizontal en móvil con flechas `<` `>` en desktop
  - **Categoría activa** resaltada (fondo relleno del color primario)
  - Click en categoría → filtra el grid de productos (sin recargar página)
  - Opción "Todos" para mostrar todos los productos
- **Animaciones:** Underline slide o scale del ícono activo
- **Props:** `categories`, `activeCategory`, `onCategoryChange`, `primaryColor`

### 8.3 `business-landing/products-grid.tsx`
- **Tipo:** Client Component
- **Estructura:**
  - Grid responsive: 3 columnas en desktop, 2 en tablet, 1 en móvil
  - Se filtra dinámicamente según la categoría seleccionada en `category-nav`
  - Animación de layout con Framer Motion `AnimatePresence` + `layoutId` al filtrar
  - Stagger animation al cargar las cards
- **Empty state:** "No hay productos en esta categoría" si el filtro no tiene resultados

### 8.4 `business-landing/product-card.tsx`
- **Tipo:** Client Component
- **Estructura de la card:**
  - Imagen del producto (aspect ratio 4:3, `next/image` con blur placeholder)
  - Badge de categoría (pequeño, encima de la imagen o debajo)
  - Nombre del producto
  - Precio formateado en color primario del negocio (ej: `$150,000`)
- **Interacciones:**
  - Hover: scale 1.02 + shadow elevation + cursor pointer
  - Click: abre el **modal de detalle** del producto
- **Animaciones:** Fade in + scale con stagger en el grid

### 8.5 `business-landing/product-detail-modal.tsx`
- **Tipo:** Client Component
- **Estructura (modal o sheet lateral):**
  - Imagen grande del producto (con zoom on hover/pinch en móvil)
  - Nombre del producto (H2)
  - Precio destacado en color primario, tamaño grande
  - Descripción completa del producto
  - **Botón CTA: "🟢 Compra por WhatsApp"**
    - Color verde WhatsApp (`#25D366`)
    - Al hacer click abre `https://wa.me/{whatsapp}?text={mensaje}` 
    - Mensaje predefinido: "Hola, me interesa el producto: {nombre} (${precio}). Vi tu catálogo en {url}"
  - Botón de cerrar
- **Animaciones:** Scale in + backdrop blur con Framer Motion
- **Responsive:** En móvil se convierte en bottom sheet (slide from bottom)

### 8.6 `business-landing/business-contact.tsx`
- **Tipo:** Server Component
- Sección de contacto del negocio
- Grid con íconos: WhatsApp, Teléfono, Email, Dirección
- Cada item es clickeable (tel:, mailto:, wa.me, maps)
- Mapa embebido (futuro, opcional)

### 8.7 `business-landing/business-social-links.tsx`
- **Tipo:** Server Component
- Grid de íconos de redes sociales con brand colors
- Hover: scale + color de la red social
- Links abren en nueva pestaña
- Íconos: Instagram, Facebook, TikTok, Twitter, LinkedIn, YouTube, Website

### 8.8 `business-landing/platform-cta.tsx`
- **Tipo:** Server Component
- Banner fijo al final (o flotante)
- "¿Quieres tu propia página como esta? Crea la tuya gratis"
- Link a `/register` — genera tráfico orgánico para la plataforma
- Diseño sutil para no distraer del contenido del negocio

---

## 9. Componentes del Blog

### 9.1 `blog/blog-card.tsx`
- Cover image, título, excerpt, fecha, tags
- Link a `/blog/[slug]`
- Hover effect sutil

### 9.2 `blog/blog-list.tsx`
- Grid de blog-cards
- Filtro por tags
- Paginación

### 9.3 `blog/blog-content.tsx`
- Render de markdown/MDX
- Typography styles (prose de Tailwind)
- Code blocks, imágenes, headings, listas
