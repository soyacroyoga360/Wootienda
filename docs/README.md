# Wootienda — Documentación del Proyecto

## Índice de Documentación

| # | Documento | Descripción |
|---|---|---|
| 01 | [Modelo de Negocio](./01-modelo-de-negocio.md) | Propuesta de valor, monetización, público objetivo, roadmap |
| 02 | [Arquitectura](./02-arquitectura.md) | Stack tecnológico, estructura de carpetas, patrones, rendering |
| 03 | [Base de Datos](./03-base-de-datos.md) | Schema SQL completo, tablas, RLS, funciones RPC, storage |
| 04 | [Componentes & Formularios](./04-componentes-formularios.md) | Todos los componentes, props, campos de formularios |
| 05 | [Sistema de Diseño](./05-design-system.md) | Paleta de colores, tipografía, espaciado, temas, dark mode |
| 06 | [Flujos de Usuario](./06-flujos-usuario.md) | Registro, login, creación de negocio, productos, IA, middleware |
| 07 | [Funcionalidades de IA](./07-funcionalidades-ia.md) | Generación de texto e imágenes, modelos, límites, costos |
| 08 | [API Routes & Actions](./08-api-routes-actions.md) | Server Actions, Route Handlers, middleware, validaciones, SEO |
| 09 | [Plan de Implementación](./09-plan-de-implementacion.md) | Fases de desarrollo, orden de archivos, checklists de verificación |
| 10 | [Dominios Personalizados](./10-dominios-personalizados.md) | Custom domains, DNS, Vercel API, flujo del cliente |

---

## Resumen Ejecutivo

**Wootienda** es una plataforma donde:

1. En la **raíz (`/`)** hay una **landing page** que promociona los servicios
2. Hay una sección de **blog** con contenido de valor
3. Los usuarios se **registran** eligiendo un **username único** que se convierte en su URL: `wootienda.com/mi-negocio`
4. Cada usuario accede a un **dashboard** donde puede:
   - Configurar su negocio (nombre, contacto, ubicación)
   - Personalizar su landing (banner, tema, colores)
   - Subir **productos** con nombre, descripción, precio e imagen
   - Usar **IA** para generar descripciones e imágenes de productos
5. La **landing pública** del negocio es visible para cualquier visitante

---

## Stack Tecnológico

- **Next.js 15** (App Router, RSC, Server Actions)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Google Gemini** (IA para texto e imágenes — free tier)
- **Tailwind CSS + shadcn/ui** (Design system)
- **Vercel** (Deploy)

---

## Cómo Usar Esta Documentación

1. **Revisa cada documento** y deja comentarios o correcciones
2. Una vez aprobada la arquitectura, procedemos a inicializar el proyecto
3. El desarrollo sigue el orden:
   - Setup del proyecto (Next.js + Supabase)
   - Auth (registro/login/middleware)
   - Landing marketing
   - Dashboard + CRUD negocio
   - CRUD productos con IA
   - Landing pública del negocio
   - Blog
   - Optimización y deploy
