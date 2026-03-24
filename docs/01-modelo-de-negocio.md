# Modelo de Negocio — Wootienda

## 1. Visión del Producto

Plataforma tipo directorio de negocios con URLs personalizadas estilo Linktree, donde los negocios registrados obtienen una landing page pública en `wootienda.com/nombre-del-negocio`. La plataforma monetiza mediante planes de suscripción y ofrece herramientas de IA para generar contenido.

---

## 2. Propuesta de Valor

| Para el visitante | Para el negocio registrado |
|---|---|
| Descubrir negocios locales | Presencia digital inmediata con URL propia |
| Buscar por categoría/ubicación | Dashboard para gestionar productos y perfil |
| Leer blog con contenido de valor | IA para generar imágenes y descripciones de productos |
| Contacto directo con negocios | Estadísticas de visitas y engagement |

---

## 3. Modelo de Monetización

### Plan Free
- 1 negocio registrado
- Hasta 10 productos publicados
- Landing pública con URL personalizada
- Banner y temas básicos
- IA gratuita: 30 descripciones + 15 imágenes / mes (Google Gemini)

### Plan Pro ($X/mes)
- Hasta 50 productos
- IA: 200 descripciones + 100 imágenes / mes
- Temas premium
- Estadísticas avanzadas
- Badge verificado
- Soporte prioritario

### Plan Business ($XX/mes)
- Productos ilimitados
- Múltiples negocios
- IA ilimitada
- Dominio personalizado (ver doc 10)
- SEO avanzado
- Exportación de datos
- API access

> **Nota:** Los precios exactos se definirán después de validar con usuarios iniciales.

---

## 4. Público Objetivo

1. **Pequeños negocios locales** que no tienen presencia digital
2. **Emprendedores** que necesitan un catálogo rápido para compartir
3. **Profesionales independientes** (freelancers, consultores)
4. **Comercios** que quieren un directorio de productos online

---

## 5. Canales de Adquisición

| Canal | Estrategia |
|---|---|
| SEO orgánico | Landing optimizada + Blog con contenido de valor |
| Redes sociales | Compartir URLs de negocios (viralidad orgánica) |
| Referidos | Programa de referidos entre negocios |
| Directo | QR codes para compartir perfil de negocio |

---

## 6. Flujo Principal del Usuario

```
[Visitante llega a la Landing]
        │
        ├── Explora el directorio de negocios
        ├── Lee el blog
        └── Decide registrarse
                │
        [Registro con email + username]
                │
        [Confirmación de email]
                │
        [Registro de negocio - formulario]
        (nombre URL único, datos del negocio)
                │
        [Dashboard del negocio]
        ├── Configura banner/tema
        ├── Sube productos (nombre, precio, imagen, descripción)
        ├── Usa IA para generar contenido
        └── Gestiona perfil público
                │
        [Landing pública: wootienda.com/mi-negocio]
        (visible para cualquier visitante)
```

---

## 7. Métricas Clave (KPIs)

| Métrica | Descripción |
|---|---|
| Negocios registrados | Total de perfiles creados |
| Tasa de conversión | Visitantes → Registros |
| Productos publicados | Actividad de los usuarios |
| Uso de IA | Generaciones de imágenes/descripciones |
| Retención mensual | % usuarios activos mes a mes |
| Revenue (MRR) | Ingresos recurrentes por suscripciones |

---

## 8. Competencia y Diferenciación

| Competidor | Nosotros nos diferenciamos en |
|---|---|
| Linktree | Enfocado en negocios con catálogo de productos, no solo enlaces |
| Google My Business | Más sencillo, URL propia, IA integrada |
| Shopify/Tiendanube | Sin costos de e-commerce, enfoque en directorio |
| Páginas amarillas | Digital, moderno, con IA y personalización |

---

## 9. Stack Tecnológico Resumido

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router) + React 19 |
| UI Framework | Tailwind CSS + shadcn/ui (Radix) |
| Backend/API | Next.js Route Handlers + Server Actions |
| Base de datos | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Autenticación | Supabase Auth |
| IA | Google Gemini API (texto + imágenes, capa gratuita) |
| Deploy | Vercel |
| Animaciones | Framer Motion |

---

## 10. Roadmap de Producto (Fases)

### Fase 1 — MVP (actual)
- [x] Landing page principal
- [x] Blog
- [x] Registro de usuarios con username único
- [x] Registro de negocio con formulario
- [x] Dashboard básico (banner, tema, productos)
- [x] Landing pública por slug (`/nombre-negocio`)
- [x] IA para generar imágenes y descripciones

### Fase 2 — Crecimiento
- [ ] Planes de suscripción (pagos con Stripe/MercadoPago)
- [ ] Búsqueda avanzada con filtros
- [ ] Estadísticas de visitas por negocio
- [ ] Sistema de reseñas/valoraciones
- [ ] Compartir con QR Code

### Fase 3 — Expansión
- [ ] Dominio personalizado por negocio (ver doc 10-dominios-personalizados.md)
- [ ] Múltiples idiomas (i18n)
- [ ] App móvil (PWA)
- [ ] Marketplace de temas
- [ ] API pública para integraciones
