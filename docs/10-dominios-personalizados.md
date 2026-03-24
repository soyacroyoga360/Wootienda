# Dominios Personalizados — Wootienda

## 1. Concepto

Los clientes de Wootienda pueden conectar su propio dominio (`supropiodominio.com`) para que su tienda se vea bajo su marca en lugar de `wootienda.com/su-negocio`.

**Ejemplo:**
- Sin dominio personalizado: `wootienda.com/cafesierra`
- Con dominio personalizado: `www.cafesierra.com`

---

## 2. Solución Recomendada: Vercel Custom Domains API

Wootienda usa **Vercel** para el deploy. Vercel permite agregar múltiples dominios custom a un proyecto de forma programática.

### Ventajas
- **SSL automático** (Let's Encrypt) — sin configuración manual
- **CDN global** — mismo rendimiento que wootienda.com
- **API programática** — se puede automatizar desde el dashboard del negocio
- **Sin infraestructura adicional** — no se necesita servidor extra

### Cómo funciona

```
1. Cliente va a Dashboard → Configuración → Dominio personalizado
2. Ingresa: "www.supropiodominio.com"
3. Wootienda le muestra instrucciones DNS:
   "Agrega un registro CNAME: www → cname.vercel-dns.com"
   "O un registro A: @ → 76.76.21.21"
4. Cliente configura DNS en su proveedor (GoDaddy, Namecheap, Cloudflare, etc.)
5. Wootienda verifica el DNS automáticamente
6. ✅ SSL se genera automáticamente
7. ✅ supropiodominio.com ahora muestra la tienda del cliente
```

---

## 3. Implementación Técnica

### 3.1 Tabla en Base de Datos

```sql
CREATE TABLE public.custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  
  domain VARCHAR(255) UNIQUE NOT NULL,       -- ej: "www.cafesierra.com"
  status VARCHAR(20) DEFAULT 'pending',       -- pending, verifying, active, error
  vercel_domain_id VARCHAR(100),              -- ID del dominio en Vercel
  
  dns_verified BOOLEAN DEFAULT false,
  ssl_issued BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  
  CONSTRAINT unique_domain UNIQUE(domain)
);

CREATE INDEX idx_custom_domains_business ON public.custom_domains(business_id);
CREATE INDEX idx_custom_domains_domain ON public.custom_domains(domain);

-- RLS
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom domains: owner full access"
  ON public.custom_domains FOR ALL
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
```

### 3.2 Vercel API Integration

```typescript
// lib/vercel/domains.ts

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID

// Agregar dominio al proyecto de Vercel
export async function addDomainToVercel(domain: string) {
  const response = await fetch(
    `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains?teamId=${VERCEL_TEAM_ID}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  )
  return response.json()
}

// Verificar estado del dominio
export async function checkDomainStatus(domain: string) {
  const response = await fetch(
    `https://api.vercel.com/v6/domains/${domain}/config?teamId=${VERCEL_TEAM_ID}`,
    {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    }
  )
  return response.json()
}

// Eliminar dominio
export async function removeDomainFromVercel(domain: string) {
  const response = await fetch(
    `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}?teamId=${VERCEL_TEAM_ID}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    }
  )
  return response.json()
}
```

### 3.3 Middleware: Resolver dominio custom

```typescript
// En middleware.ts — agregar lógica para dominios custom

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Si no es wootienda.com, buscar en custom_domains
  if (!hostname.includes('wootienda.com') && !hostname.includes('localhost')) {
    // Buscar qué negocio tiene este dominio
    const business = await getBusinessByCustomDomain(hostname)
    
    if (business) {
      // Reescribir internamente a /[businessSlug]
      const url = request.nextUrl.clone()
      url.pathname = `/${business.slug}${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }
  
  // ... resto del middleware existente
}
```

### 3.4 Variables de Entorno Adicionales

```env
# Vercel API (para dominios custom)
VERCEL_TOKEN=xxx
VERCEL_PROJECT_ID=prj_xxx
VERCEL_TEAM_ID=team_xxx  # opcional, solo si usas un team
```

---

## 4. Flujo del Usuario

```
[Dashboard → Configuración → Dominio Personalizado]
        │
        │ Solo disponible en Plan Pro o Business
        ▼
[Formulario: "Ingresa tu dominio"]
        │
        │ Input: www.supropiodominio.com
        │ Validación: formato válido, no es wootienda.com
        ▼
[Backend: POST a Vercel API → agregar dominio]
        │
        │ Guardar en custom_domains con status = 'pending'
        ▼
[Mostrar instrucciones DNS al cliente]
        │
        │ "Agrega este registro en tu proveedor de DNS:"
        │ 
        │ Tipo: CNAME
        │ Host: www
        │ Valor: cname.vercel-dns.com
        │
        │ — o para dominio raíz (@): —
        │
        │ Tipo: A
        │ Host: @
        │ Valor: 76.76.21.21
        ▼
[Polling: verificar DNS cada 30s]
        │
        ├── DNS no propagado → "Esperando verificación DNS..."
        │                       (puede tomar 1-48 horas)
        │
        └── DNS verificado → status = 'active'
                │
                │ SSL automático por Vercel (Let's Encrypt)
                ▼
        [✅ "Tu dominio está activo!"]
        [www.supropiodominio.com → muestra tu tienda]
```

---

## 5. Restricciones por Plan

| Feature | Free | Pro | Business |
|---|---|---|---|
| Dominio personalizado | ❌ | ✅ 1 dominio | ✅ Múltiples |
| SSL automático | — | ✅ | ✅ |
| Instrucciones DNS guiadas | — | ✅ | ✅ |

---

## 6. Alternativas Evaluadas

| Opción | Dificultad | Pro | Contra |
|---|---|---|---|
| **Vercel Custom Domains API** ✅ | ⭐⭐ Media | SSL auto, CDN, API nativa | Requiere Vercel Pro ($20/mes) para API |
| Subdominio wildcard + CNAME | ⭐⭐ Media | Simple para subdominios | Solo funciona con `*.wootienda.com`, no dominios propios |
| Reverse Proxy (Cloudflare/Nginx) | ⭐⭐⭐ Alta | Máxima flexibilidad | Infraestructura extra, complejidad |
| Iframe/embed | ⭐ Fácil | Trivial de implementar | Malo para SEO, UX pobre, inseguro |

---

## 7. Estimaciones

| Tarea | Tiempo estimado |
|---|---|
| Tabla custom_domains + RLS | 1 hora |
| Integración Vercel API | 3-4 horas |
| Middleware de resolución | 2-3 horas |
| UI en dashboard (formulario + instrucciones DNS) | 4-5 horas |
| Testing y polish | 2-3 horas |
| **Total** | **~2-3 días** |
