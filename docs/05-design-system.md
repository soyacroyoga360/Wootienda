# Sistema de Diseño & Guía Visual — Wootienda

## 1. Filosofía de Diseño

- **Bold & Energético:** La marca Wootienda usa rosa (hot pink) como acento vibrante sobre fondos oscuros y claros, transmitiendo modernidad y dinamismo
- **Premium pero accesible:** Diseño sofisticado con glassmorphism, gradientes y micro-animaciones que generan una sensación premium
- **Movimiento con propósito:** Cada transición y animación tiene una función — guiar la atención, dar feedback o hacer la experiencia más fluida
- **Responsive-first:** Diseño adaptable a móvil, tablet y desktop
- **Accesible:** WCAG 2.1 AA, contraste mínimo 4.5:1 en texto
- **Consistente:** shadcn/ui como base (Radix primitives + Tailwind CSS) + Framer Motion para animaciones avanzadas

---

## 2. Paleta de Colores — Identidad Wootienda

### 2.1 Colores de Marca

| Token | Hex | Nombre | Uso Principal |
|---|---|---|---|
| **Brand Pink** | `#EE1D6D` | Rosa Wootienda | CTAs principales, links, acentos, badges, hover states |
| **Brand Gray** | `#2A2A2A` | Charcoal | Texto principal, títulos, estructura del logo |
| **Brand Yellow** | `#FEDA00` | Dorado/Amarillo | Highlights, badges premium, ofertas, estrellas |
| **Brand Cream** | `#EFEBE8` | Crema | Fondos sutiles, cards secondary, separadores |
| **Brand Black** | `#000000` | Negro | Texto body, fondos dark mode |

### 2.2 CSS Custom Properties — Light Mode

```css
/* globals.css — Light mode */
:root {
  /* === COLORES BASE === */
  --background: 0 0% 100%;              /* #FFFFFF - fondo principal */
  --foreground: 0 0% 0%;                /* #000000 - texto principal */
  
  --card: 30 14% 95%;                   /* #EFEBE8 - fondo de cards */
  --card-foreground: 0 0% 16%;          /* #2A2A2A */
  
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 16%;
  
  /* === BRAND PINK como Primary === */
  --primary: 340 84% 52%;               /* #EE1D6D - rosa Wootienda */
  --primary-foreground: 0 0% 100%;      /* #FFFFFF - texto sobre pink */
  
  /* === BRAND CREAM como Secondary === */
  --secondary: 24 23% 93%;              /* #EFEBE8 - crema */
  --secondary-foreground: 0 0% 16%;     /* #2A2A2A */
  
  /* === MUTED === */
  --muted: 24 10% 94%;                  /* similar al cream pero más neutro */
  --muted-foreground: 0 0% 45%;         /* #737373 */
  
  /* === ACCENT (Yellow para highlights) === */
  --accent: 49 99% 50%;                 /* #FEDA00 - amarillo brand */
  --accent-foreground: 0 0% 0%;         /* #000000 */
  
  /* === ESTADOS === */
  --destructive: 0 84% 60%;             /* #EF4444 - rojo error */
  --destructive-foreground: 0 0% 100%;
  
  --success: 142 76% 36%;               /* #16A34A - verde éxito */
  --success-foreground: 0 0% 100%;
  
  --warning: 49 99% 50%;                /* #FEDA00 - amarillo warning (= accent) */
  --warning-foreground: 0 0% 0%;
  
  /* === BORDES E INPUTS === */
  --border: 24 10% 90%;                 /* borde sutil cream */
  --input: 24 10% 90%;
  --ring: 340 84% 52%;                  /* #EE1D6D - focus ring = brand pink */
  
  /* === RADIUS === */
  --radius: 0.75rem;
}
```

### 2.3 CSS Custom Properties — Dark Mode

```css
/* Dark mode */
.dark {
  --background: 0 0% 7%;                /* #121212 - fondo oscuro profundo */
  --foreground: 0 0% 95%;               /* #F2F2F2 - texto claro */
  
  --card: 0 0% 11%;                     /* #1C1C1C */
  --card-foreground: 0 0% 95%;
  
  --popover: 0 0% 11%;
  --popover-foreground: 0 0% 95%;
  
  --primary: 340 84% 55%;               /* #F23D7F - pink más brillante en dark */
  --primary-foreground: 0 0% 100%;
  
  --secondary: 0 0% 15%;                /* #262626 */
  --secondary-foreground: 0 0% 90%;
  
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 60%;         /* #999999 */
  
  --accent: 49 99% 55%;                 /* #FFE01A - yellow más brillante */
  --accent-foreground: 0 0% 0%;
  
  --destructive: 0 63% 45%;
  --destructive-foreground: 0 0% 100%;
  
  --success: 142 69% 50%;
  --warning: 49 99% 55%;
  
  --border: 0 0% 18%;
  --input: 0 0% 18%;
  --ring: 340 84% 55%;
}
```

### 2.4 Paleta Semántica Completa

| Token | Light | Dark | Uso |
|---|---|---|---|
| `primary` | `#EE1D6D` | `#F23D7F` | CTAs, links, hover, focus rings, precios |
| `secondary` | `#EFEBE8` | `#262626` | Fondos de cards, secciones alternas |
| `accent` | `#FEDA00` | `#FFE01A` | Badges pro, estrellas, ofertas, highlights |
| `success` | `#16A34A` | `#4ADE80` | Slug disponible, operaciones exitosas |
| `destructive` | `#EF4444` | `#F87171` | Errores, eliminar, slug no disponible |
| `warning` | `#FEDA00` | `#FFE01A` | Alertas, límites IA, plan warnings |
| `muted` | `#737373` | `#999999` | Texto secundario, placeholders |
| `background` | `#FFFFFF` | `#121212` | Fondo principal |
| `foreground` | `#000000` | `#F2F2F2` | Texto principal |
| Brand Gray | `#2A2A2A` | `#D4D4D4` | Títulos, headings, logo text |

### 2.5 Gradientes de Marca

```css
/* === GRADIENTES PRINCIPALES === */

/* Hero principal, CTAs premium — Pink a Magenta */
.gradient-brand {
  background: linear-gradient(135deg, #EE1D6D 0%, #C2185B 50%, #880E4F 100%);
}

/* Hover de CTAs — Pink con brillo dorado */
.gradient-brand-warm {
  background: linear-gradient(135deg, #EE1D6D 0%, #FF6B9D 40%, #FEDA00 100%);
}

/* Badge IA / Premium — Pink a Purple */
.gradient-ai {
  background: linear-gradient(135deg, #EE1D6D 0%, #9C27B0 50%, #7B1FA2 100%);
}

/* Cards premium / Plan Pro — Dark con glow */
.gradient-premium {
  background: linear-gradient(135deg, #2A2A2A 0%, #1a1a2e 50%, #16213e 100%);
}

/* Acento dorado — Ofertas, badges destacados */
.gradient-gold {
  background: linear-gradient(135deg, #FEDA00 0%, #FFB300 50%, #FF8F00 100%);
}

/* Fondo hero dark — Profundidad */
.gradient-dark-hero {
  background: linear-gradient(180deg, #000000 0%, #1a1a2e 40%, #2A2A2A 100%);
}

/* Glassmorphism overlay */
.gradient-glass {
  background: linear-gradient(135deg, 
    rgba(238, 29, 109, 0.08) 0%, 
    rgba(254, 218, 0, 0.05) 50%, 
    rgba(42, 42, 42, 0.03) 100%
  );
}

/* Mesh gradient para fondos hero (animado) */
.gradient-mesh {
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(238, 29, 109, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(254, 218, 0, 0.10) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(238, 29, 109, 0.08) 0%, transparent 50%);
}
```

---

## 3. Tipografía

### 3.1 Font Stack

```typescript
// src/app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google'

// Font principal — moderna, geométrica, premium
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

// Alternativa para headings de impacto (opcional)
// import { Outfit } from 'next/font/google'
// const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' })
```

> **¿Por qué Plus Jakarta Sans?** Es moderna, geométrica, con excelente legibilidad en pantalla. Se ve premium sin ser genérica (como Inter). Tiene weights de 300 a 800 para máxima flexibilidad. Combina perfectamente con la identidad energética de Wootienda.

### 3.2 Escala Tipográfica

| Nivel | Tailwind | Tamaño | Weight | Line Height | Uso |
|---|---|---|---|---|---|
| Display XL | `text-6xl` | 60px | 800 (extrabold) | 1.0 | Hero headlines, números impacto |
| Display | `text-5xl` | 48px | 800 | 1.1 | Hero subtítulos |
| H1 | `text-4xl` | 36px | 700 (bold) | 1.15 | Títulos de página |
| H2 | `text-3xl` | 30px | 700 | 1.2 | Secciones principales |
| H3 | `text-2xl` | 24px | 600 (semibold) | 1.3 | Subsecciones |
| H4 | `text-xl` | 20px | 600 | 1.4 | Títulos de cards |
| H5 | `text-lg` | 18px | 500 (medium) | 1.5 | Labels grandes |
| Body | `text-base` | 16px | 400 (normal) | 1.6 | Texto general |
| Small | `text-sm` | 14px | 400 | 1.5 | Texto secundario, captions |
| XS | `text-xs` | 12px | 500 | 1.4 | Badges, metadatos, chips |

### 3.3 Clases Estandarizadas

```html
<!-- Display headlines (hero) -->
<h1 class="text-5xl md:text-6xl font-extrabold tracking-tight leading-none">
  Crea tu <span class="text-primary">tienda</span> digital
</h1>

<!-- Headings de página -->
<h1 class="text-3xl md:text-4xl font-bold tracking-tight">...</h1>
<h2 class="text-2xl md:text-3xl font-bold tracking-tight">...</h2>
<h3 class="text-xl md:text-2xl font-semibold">...</h3>

<!-- Body -->
<p class="text-base text-foreground leading-relaxed">...</p>
<p class="text-sm text-muted-foreground">...</p>
<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">...</span>

<!-- Precio destacado -->
<span class="text-2xl font-extrabold text-primary">$150,000</span>

<!-- Badge / Chip -->
<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground">PRO</span>
```

---

## 4. Sistema de Animaciones

### 4.1 Librería: Framer Motion (Principal)

Framer Motion es la librería de animaciones del proyecto. Se usa para:
- Animaciones de entrada (scroll reveal, page transitions)
- Stagger de elementos (grids, listas)
- Gestos (drag, hover, tap)
- Layout animations (filtrado de productos con AnimatePresence)
- Modales y sheets con spring physics

### 4.2 Variantes Reutilizables (`lib/animations.ts`)

```typescript
// src/lib/animations.ts
import { type Variants, type Transition } from 'framer-motion'

// === TRANSICIONES BASE ===

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
}

export const smoothTransition: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1], // ease-out expo
}

export const quickTransition: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
}

// === FADE IN VARIANTES ===

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.6, ease: 'easeOut' } 
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
}

// === SCALE VARIANTES ===

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: springTransition 
  },
}

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 15 
    } 
  },
}

// === STAGGER CONTAINERS ===

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// === HOVER / TAP ===

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4, 
    transition: quickTransition 
  },
  tap: { scale: 0.98 },
}

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
}

export const iconSpin = {
  rest: { rotate: 0 },
  hover: { rotate: 15, scale: 1.1 },
}

// === PAGE TRANSITIONS ===

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    transition: { duration: 0.25 } 
  },
}

// === MODAL / SHEET ===

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 25 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10, 
    transition: { duration: 0.15 } 
  },
}

export const bottomSheet: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 30 } 
  },
  exit: { 
    y: '100%', 
    transition: { duration: 0.25, ease: 'easeIn' } 
  },
}

// === SCROLL REVEAL (uso con useInView) ===

export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  },
}

export const scrollRevealScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
}

// === CONTADOR NÚMERO ===
// Para stats y métricas con efecto "counting up"
// Usar con useMotionValue + useTransform + animate de framer-motion
```

### 4.3 Hook: Scroll Reveal (`hooks/use-scroll-reveal.ts`)

```typescript
// src/hooks/use-scroll-reveal.ts
'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'

export function useScrollReveal(options?: { once?: boolean; margin?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: options?.margin ?? '-80px',
  })
  return { ref, isInView }
}
```

### 4.4 Componente: AnimateOnScroll

```typescript
// src/components/shared/animate-on-scroll.tsx
'use client'

import { motion, type Variants } from 'framer-motion'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { fadeInUp } from '@/lib/animations'

interface AnimateOnScrollProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
  delay?: number
}

export function AnimateOnScroll({ 
  children, 
  variants = fadeInUp, 
  className,
  delay = 0 
}: AnimateOnScrollProps) {
  const { ref, isInView } = useScrollReveal()

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
```

---

## 5. Transiciones CSS (Tailwind Utilities)

### 5.1 Transiciones Base para globals.css

```css
/* === TRANSICIONES GLOBALES === */

/* Hover suave para links y botones */
.transition-base {
  @apply transition-all duration-200 ease-out;
}

/* Cards — hover con elevación */
.transition-card {
  @apply transition-all duration-300 ease-out;
}

/* Colores — cambio suave (dark mode toggle, hover states) */
.transition-colors-smooth {
  @apply transition-colors duration-300 ease-in-out;
}

/* Transform — para scale y translate */
.transition-transform-snappy {
  @apply transition-transform duration-200 ease-out;
}

/* === HOVER UTILITIES === */

/* Card hover elevada */
.hover-lift {
  @apply transition-card hover:-translate-y-1 hover:shadow-lg;
}

/* Card hover con glow rosa */
.hover-glow-pink {
  @apply transition-card hover:shadow-[0_0_20px_rgba(238,29,109,0.15)];
}

/* Card hover con glow dorado */
.hover-glow-gold {
  @apply transition-card hover:shadow-[0_0_20px_rgba(254,218,0,0.15)];
}

/* Botón press — scale down al click */
.press-effect {
  @apply transition-transform-snappy active:scale-[0.97];
}

/* Link con underline animado */
.link-underline {
  @apply relative;
}
.link-underline::after {
  @apply content-[''] absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 ease-out;
}
.link-underline:hover::after {
  @apply w-full;
}

/* === GLOW & PULSE === */

/* Pulse rosa sutil (para CTAs importantes) */
.pulse-pink {
  animation: pulse-pink 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-pink {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(238, 29, 109, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(238, 29, 109, 0);
  }
}

/* Glow animado para badges premium */
.glow-gold {
  animation: glow-gold 3s ease-in-out infinite alternate;
}

@keyframes glow-gold {
  from {
    box-shadow: 0 0 5px rgba(254, 218, 0, 0.3);
  }
  to {
    box-shadow: 0 0 20px rgba(254, 218, 0, 0.5);
  }
}

/* === BACKGROUND ANIMATIONS === */

/* Shimmer para skeletons / loading */
.shimmer {
  background: linear-gradient(
    90deg,
    rgba(239, 235, 232, 0.3) 0%,
    rgba(239, 235, 232, 0.6) 50%,
    rgba(239, 235, 232, 0.3) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Gradient shift para hero backgrounds */
.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Float suave para elementos decorativos */
.float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Rotate lento para elementos decorativos */
.spin-slow {
  animation: spin-slow 20s linear infinite;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 5.2 Glassmorphism Utilities

```css
/* === GLASSMORPHISM === */

/* Glass card — sutil, para overlays y navbars */
.glass {
  @apply bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10;
}

/* Glass card fuerte — para modales y elementos flotantes */
.glass-strong {
  @apply bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-white/30 dark:border-white/15;
}

/* Glass con tinte rosa — para CTAs y elementos de marca */
.glass-pink {
  @apply bg-primary/5 dark:bg-primary/10 backdrop-blur-xl border border-primary/10;
}

/* Navbar glass (cambia al hacer scroll) */
.navbar-glass {
  @apply bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50;
}
```

---

## 6. Espaciado

Sistema de 4px base (Tailwind default):

| Token | Valor | Uso |
|---|---|---|
| `gap-1` / `p-1` | 4px | Mínimo, entre íconos y texto |
| `gap-2` / `p-2` | 8px | Dentro de badges, chips |
| `gap-3` / `p-3` | 12px | Dentro de inputs |
| `gap-4` / `p-4` | 16px | Padding de cards, gap entre items |
| `gap-6` / `p-6` | 24px | Padding de secciones en cards |
| `gap-8` / `py-8` | 32px | Entre secciones menores |
| `gap-12` / `py-12` | 48px | Entre secciones de landing |
| `gap-16` / `py-16` | 64px | Secciones principales |
| `gap-20` / `py-20` | 80px | Espaciado hero, entre secciones grandes |
| `gap-24` / `py-24` | 96px | Espaciado máximo hero |

**Container máx:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

---

## 7. Sombras & Bordes

### 7.1 Shadow System

```css
/* Sombras custom con tinte rosa para la marca */
:root {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.10), 0 4px 8px rgba(0, 0, 0, 0.06);
  --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08);
  
  /* Sombras con color de marca */
  --shadow-pink: 0 8px 25px rgba(238, 29, 109, 0.20);
  --shadow-pink-lg: 0 15px 40px rgba(238, 29, 109, 0.25);
  --shadow-gold: 0 8px 25px rgba(254, 218, 0, 0.20);
}
```

### 7.2 Elementos

| Elemento | Border Radius | Shadow | Border |
|---|---|---|---|
| Botones primarios | `rounded-xl` (12px) | hover: `shadow-pink` | ninguno |
| Botones secundarios | `rounded-xl` (12px) | ninguna | `border border-border` |
| Cards | `rounded-2xl` (16px) | `shadow-sm` → hover: `shadow-lg` | `border border-border/50` |
| Inputs | `rounded-xl` (12px) | ninguna | `border border-input` |
| Modals | `rounded-3xl` (24px) | `shadow-xl` | `border border-border/30` |
| Avatars/Logos | `rounded-full` | ninguna | `ring-2 ring-primary` |
| Badges | `rounded-full` | ninguna | ninguno |
| Images | `rounded-xl` (12px) | ninguna | ninguno |
| Navbar | `rounded-none` | glass effect | `border-b border-border/50` |
| Product cards | `rounded-2xl` (16px) | `shadow-sm` | `border border-border/30` |

---

## 8. Breakpoints (Responsive)

| Breakpoint | Ancho | Uso |
|---|---|---|
| Mobile | `< 640px` | 1 columna, sidebar collapse, bottom sheets |
| `sm` | `≥ 640px` | 2 columnas en grids |
| `md` | `≥ 768px` | Sidebar visible, modals centrados |
| `lg` | `≥ 1024px` | 3 columnas, layout desktop completo |
| `xl` | `≥ 1280px` | 4 columnas, max container |
| `2xl` | `≥ 1536px` | Extra ancho |

---

## 9. Iconografía

- **Librería:** Lucide React
- **Tamaño estándar:** `size={20}` para inline, `size={24}` para acciones
- **Stroke width:** 2 (default), 1.5 para íconos sutiles
- **Animaciones de íconos:** Framer Motion `rotate`, `scale`, `pathLength` para loading

| Contexto | Íconos |
|---|---|
| Navegación | `Home`, `LayoutDashboard`, `Package`, `Palette`, `Settings` |
| Acciones | `Plus`, `Pencil`, `Trash2`, `Eye`, `ExternalLink`, `Download` |
| Auth | `Mail`, `Lock`, `User`, `LogIn`, `LogOut` |
| Social | `Instagram`, `Facebook`, `Twitter`, `Linkedin`, `Youtube` |
| IA | `Sparkles`, `Wand2`, `Image`, `FileText`, `Brain` |
| Estado | `Check`, `X`, `Loader2`, `AlertCircle`, `Info`, `CheckCircle2` |
| Contacto | `Phone`, `MapPin`, `Globe`, `MessageCircle` |
| Premium | `Crown`, `Star`, `Zap`, `Diamond` |

---

## 10. Componentes de Estilo Premium

### 10.1 Botón Primario (CTA Wootienda)

```tsx
// Botón principal con gradient, hover glow y press effect
<Button className="
  bg-gradient-to-r from-[#EE1D6D] to-[#C2185B]
  hover:from-[#F23D7F] hover:to-[#EE1D6D]
  text-white font-semibold
  px-8 py-3 rounded-xl
  shadow-md hover:shadow-pink-lg
  transition-all duration-300
  active:scale-[0.97]
  relative overflow-hidden
  group
">
  <span class="relative z-10">Crea tu tienda gratis</span>
  {/* Shine effect on hover */}
  <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
</Button>
```

### 10.2 Card con Hover Premium

```tsx
<motion.div
  variants={cardHover}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
  className="
    relative group
    bg-card border border-border/50
    rounded-2xl overflow-hidden
    shadow-sm hover:shadow-lg
    transition-shadow duration-300
  "
>
  {/* Glow border effect on hover */}
  <div className="
    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
    transition-opacity duration-500
    bg-gradient-to-r from-primary/20 via-transparent to-accent/20
    -z-10 blur-xl
  " />
  
  {/* Card content */}
  {children}
</motion.div>
```

### 10.3 Badge IA / Premium

```tsx
// Badge con gradient animado
<span className="
  inline-flex items-center gap-1
  px-3 py-1 rounded-full
  text-xs font-bold text-white
  bg-gradient-to-r from-[#EE1D6D] to-[#9C27B0]
  shadow-sm
">
  <Sparkles size={12} />
  IA
</span>

// Badge Pro con glow dorado
<span className="
  inline-flex items-center gap-1
  px-3 py-1 rounded-full
  text-xs font-bold text-black
  bg-gradient-to-r from-[#FEDA00] to-[#FFB300]
  glow-gold
">
  <Crown size={12} />
  PRO
</span>
```

### 10.4 Input Focus Styling

```css
/* En globals.css — Input focus con glow rosa */
input:focus, textarea:focus, select:focus {
  @apply ring-2 ring-primary/30 border-primary outline-none;
  box-shadow: 0 0 0 3px rgba(238, 29, 109, 0.1);
  transition: all 0.2s ease;
}
```

### 10.5 Precio Destacado

```tsx
// Precio grande con color primario
<div className="flex items-baseline gap-1">
  <span className="text-sm font-medium text-muted-foreground">Desde</span>
  <span className="text-3xl font-extrabold text-primary">$150,000</span>
  <span className="text-sm text-muted-foreground">COP</span>
</div>
```

---

## 11. Temas del Negocio (Landing Pública)

Cada negocio selecciona un tema desde el dashboard en `/appearance`. El tema controla la apariencia de su landing pública. El **color primario** siempre es personalizable por el negocio (no está atado al rosa de Wootienda).

### Temas FREE (todos los planes)

| Tema | Descripción | Hero | Cards | Animación |
|---|---|---|---|---|
| `default` | Limpio y profesional | Overlay oscuro gradient, centrado | Border sutil, shadow-sm, rounded-2xl | Fade in up suave |
| `clean` | Minimalista moderno | Overlay claro, mucho espacio blanco | Sin border, hover shadow elevada | Slide up |
| `minimal` | Ultra simple | Sin overlay, tipografía impacto | Flat, solo separador línea | Ninguna (instant) |

### Temas PRO 🔒 (requieren plan Pro o Business)

| Tema | Descripción | Hero | Cards | Animación |
|---|---|---|---|---|
| `glassmorphism` | Efecto cristal/blur premium | Glass overlay con blur intenso | Glass cards con backdrop-blur | Fade + blur in |
| `neon-glow` | Futurista, oscuro con glow | Fondo oscuro + glow en texto | Dark cards con neon borders | Glow pulse + slide |
| `gradient-mesh` | Gradientes fluidos | Mesh gradient animado de fondo | Gradient borders sutiles | Scale + spring |
| `magazine` | Editorial, tipografía bold | Imagen full sin overlay, texto en bloque | Cards estilo editorial, tipo grande | Stagger slide |
| `dark-luxury` | Premium, oscuro y dorado | Negro profundo + acentos dorados | Cards con bordes gold, sombras suaves | Fade + scale elegante |
| `storefront` | Estilo e-commerce pro | Banner como tienda, CTA prominente | Cards con botón "Ver" visible | Stagger grid rápido |
| `vibrant` | Colorido, energético | Colores vivos del primario, superpuestos | Cards con color de fondo accent | Bounce + spring |
| `elegant-serif` | Clásico, tipografía serif | Imagen con overlay suave, serif heading | Cards delgadas, serif en nombres | Fade lento |

### Implementación técnica

```typescript
// Cada tema es un objeto de configuración en lib/themes/
interface BusinessTheme {
  id: string;
  name: string;
  tier: 'free' | 'pro';
  preview: string;
  variables: {
    heroOverlay: string;
    heroLayout: 'center' | 'left' | 'split';
    cardBorderRadius: string;
    cardShadow: string;
    cardHover: 'scale' | 'shadow' | 'glow' | 'none';
    categoryShape: 'circle' | 'square' | 'pill';
    fontHeading: string;
    fontBody: string;
    animationType: 'fade' | 'slide' | 'scale' | 'spring' | 'none';
    animationIntensity: 'subtle' | 'medium' | 'dramatic';
    modalStyle: 'modal' | 'sheet' | 'fullscreen';
  };
}
```

> Los temas se implementan como objetos de configuración TypeScript que generan CSS custom properties en el scope de la landing pública. El tema seleccionado se guarda en `businesses.theme` y se aplica server-side para evitar FOUC (Flash of Unstyled Content).

---

## 12. Dark Mode

- Implementado con `next-themes`
- Toggle en navbar (marketing) y topbar (dashboard)
- Store en `localStorage`
- Respeta `prefers-color-scheme` del sistema como default
- Los temas de negocios tienen variantes dark automáticas
- **Transición**: `transition-colors duration-300` en el `<html>` para cambio suave

---

## 13. Efectos Visuales Premium

### 13.1 Partículas / Decorativos (Hero Landing Marketing)

```tsx
// Círculos decorativos flotantes con colores de marca
// Posicionados absolute detrás del hero content
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {/* Círculo rosa grande */}
  <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full 
    bg-primary/5 dark:bg-primary/10 blur-3xl float" />
  
  {/* Círculo dorado */}
  <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full 
    bg-accent/5 dark:bg-accent/10 blur-3xl float" 
    style={{ animationDelay: '2s' }} />
  
  {/* Grid pattern sutil */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(238,29,109,0.03)_1px,transparent_1px),
    linear-gradient(90deg,rgba(238,29,109,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
</div>
```

### 13.2 Texto con Gradiente

```css
/* Texto header con gradiente de marca */
.text-gradient-brand {
  @apply bg-clip-text text-transparent;
  background-image: linear-gradient(135deg, #EE1D6D 0%, #FEDA00 100%);
}

/* Texto con gradiente rosa */
.text-gradient-pink {
  @apply bg-clip-text text-transparent;
  background-image: linear-gradient(135deg, #EE1D6D 0%, #F23D7F 50%, #FF6B9D 100%);
}
```

### 13.3 Cursor Trail / Mouse Glow (opcional, solo landing marketing)

```tsx
// Un sutil glow que sigue el mouse — solo en hero section
// Implementar con useMotionValue y useTransform de Framer Motion
// Color: rgba(238, 29, 109, 0.08) — rosa muy sutil
```

### 13.4 Reglas de Rendimiento

- Todas las animaciones usan `transform` y `opacity` (propiedades GPU-accelerated)
- `will-change: transform` solo en elementos que se animan frecuentemente
- Respetar `prefers-reduced-motion` — desactivar animaciones para usuarios que lo soliciten
- No más de 3 animaciones simultáneas visibles en viewport
- Skeleton shimmer en vez de spinner para loading states
- Las animaciones de scroll reveal se disparan una sola vez (`once: true`)

```css
/* Respetar preferencia del usuario */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
