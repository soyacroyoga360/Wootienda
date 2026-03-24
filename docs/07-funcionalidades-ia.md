# Funcionalidades de IA — Wootienda

## 1. Visión General

La IA es una feature diferenciadora de la plataforma. Permite a los usuarios generar contenido profesional para sus productos sin necesidad de habilidades de redacción o diseño.

**Dos capacidades principales:**
1. **Generación de descripciones** de productos (texto)
2. **Generación de imágenes** de productos (visual)

---

## 2. Generación de Descripciones

### 2.1 Modelo y API

| Aspecto | Detalle |
|---|---|
| Proveedor | Google Gemini (capa gratuita) |
| Modelo | `gemini-2.0-flash` (rápido, gratuito, alta calidad) |
| SDK | `@google/generative-ai` |
| Endpoint | `POST /api/ai/generate-description` |
| Respuesta | Streaming (Server-Sent Events) |
| Límite gratuito | 15 RPM / 1M tokens/min (gratis) |

### 2.2 Prompt Engineering

```typescript
// lib/ai/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiFlash = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash' 
})

export const geminiImagen = genAI.getGenerativeModel({ 
  model: 'imagen-3.0-generate-002' 
})
```

```typescript
// lib/ai/generate-description.ts

const SYSTEM_PROMPT = `Eres un experto en copywriting de productos para negocios locales.
Genera descripciones atractivas, profesionales y optimizadas para SEO.
Las descripciones deben ser:
- Claras y concisas (máximo 200 palabras)
- Orientadas a beneficios del cliente
- Con tono profesional pero cercano
- En español natural (no robótico)
Responde SOLO con la descripción, sin comillas ni prefijos.`

const buildUserPrompt = (data: {
  productName: string
  context?: string
  businessCategory: string
  businessName: string
}) => {
  return `Genera una descripción para el producto "${data.productName}" 
del negocio "${data.businessName}" (categoría: ${data.businessCategory}).
${data.context ? `Contexto adicional: ${data.context}` : ''}`
}
```

### 2.3 Implementación del Route Handler

```typescript
// app/api/ai/generate-description/route.ts

import { geminiFlash } from '@/lib/ai/gemini'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // 1. Verificar autenticación
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Verificar límite de generaciones (plan free)
  const { data: count } = await supabase.rpc('count_ai_generations_this_month', { uid: user.id })
  const limit = 30 // Generoso porque Gemini es gratuito
  if (count >= limit) {
    return Response.json({ error: 'Generation limit reached' }, { status: 429 })
  }

  // 3. Parsear y validar body
  const body = await request.json()
  // ... validación con Zod

  // 4. Llamar a Gemini con streaming
  const prompt = `${SYSTEM_PROMPT}\n\n${buildUserPrompt(body)}`
  const result = await geminiFlash.generateContentStream(prompt)

  // 5. Registrar generación en BD
  await supabase.from('ai_generations').insert({
    user_id: user.id,
    type: 'text',
    prompt: body.productName,
    model: 'gemini-2.0-flash',
    product_id: body.productId || null,
  })

  // 6. Stream response
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        controller.enqueue(encoder.encode(text))
      }
      controller.close()
    }
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
```

### 2.4 Componente Client

```typescript
// components/products/ai-description-generator.tsx
// 
// Estados:
// - idle: botón "🪄 Generar con IA"
// - loading: spinner + "Generando..."
// - streaming: texto apareciendo con typewriter effect
// - done: texto completo + botones [Usar] [Regenerar] [Cancelar]
// - error: mensaje de error + [Reintentar]
// - limit-reached: modal de upgrade
```

---

## 3. Generación de Imágenes

### 3.1 Modelo y API

| Aspecto | Detalle |
|---|---|
| Proveedor | Google Gemini (Imagen 3) |
| Modelo | `imagen-3.0-generate-002` |
| SDK | `@google/generative-ai` |
| Endpoint | `POST /api/ai/generate-image` |
| Respuesta | JSON con imagen en base64 |
| Tiempo estimado | 5-15 segundos |
| Resolución | 1024x1024 (cuadrada para productos) |
| Costo | **Gratuito** (capa free de Gemini) |

### 3.2 Prompt Engineering para Imágenes

```typescript
// lib/ai/generate-image.ts

const buildImagePrompt = (data: {
  description: string
  businessCategory: string
}) => {
  return `Professional product photography of: ${data.description}. 
Clean white background, studio lighting, high quality, commercial photography style. 
Category: ${data.businessCategory}. 
No text, no watermarks, photorealistic.`
}
```

### 3.3 Flujo de Generación de Imagen

```
1. Usuario escribe descripción del producto
2. Click "🖼️ Generar imagen"
3. POST /api/ai/generate-image
4. Backend llama a Imagen 3 via Gemini API
5. Recibe imagen en base64
6. Frontend muestra preview
7. Si el usuario acepta:
   a. Convertir base64 a File/Blob
   b. Upload a Supabase Storage (carpeta del usuario)
   c. Guardar URL permanente en el producto
8. Registrar generación en ai_generations
```

### 3.4 Implementación del Route Handler

```typescript
// app/api/ai/generate-image/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  // 1. Auth + límite (igual que descripción)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // 2. Generar imagen con Imagen 3
  const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' })
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: buildImagePrompt(body) }] }],
    generationConfig: {
      responseModalities: ['image'],
    },
  })

  const response = result.response
  const imagePart = response.candidates?.[0]?.content?.parts?.[0]

  if (!imagePart?.inlineData) {
    return Response.json({ error: 'Image generation failed' }, { status: 500 })
  }

  // 3. Registrar generación
  await supabase.from('ai_generations').insert({
    user_id: user.id,
    type: 'image',
    prompt: body.description,
    model: 'imagen-3.0-generate-002',
  })

  // 4. Retornar imagen en base64
  return Response.json({
    imageBase64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  })
}
```

---

## 4. Límites por Plan

| Feature | Free | Pro | Business |
|---|---|---|---|
| Generaciones de texto/mes | 30 | 200 | Ilimitado |
| Generaciones de imagen/mes | 15 | 100 | Ilimitado |
| Modelo de texto | gemini-2.0-flash | gemini-2.0-flash | gemini-2.0-flash |
| Modelo de imagen | imagen-3.0-generate-002 | imagen-3.0-generate-002 | imagen-3.0-generate-002 |
| Resolución imagen | 1024x1024 | 1024x1024 | 1024x1024 |

> **Nota:** Al usar la capa gratuita de Gemini, los límites de la API de Google son de 15 RPM (requests por minuto) y 1M tokens/minuto. Los límites por plan son para controlar el uso por usuario, no por costo.

---

## 5. UX del Generador de IA

### 5.1 Botón Integrado en el Formulario

Los botones de IA se integran directamente en el formulario de producto, al lado del campo correspondiente:

```
┌─────────────────────────────────────────────┐
│ Descripción del producto                     │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │  [textarea con la descripción]          │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│ [🪄 Generar con IA]  3/10 generaciones     │
├─────────────────────────────────────────────┤
│ Imagen del producto                          │
│ ┌───────────────┐                           │
│ │               │                           │
│ │  [preview]    │  [📤 Subir imagen]        │
│ │               │  [🖼️ Generar con IA]      │
│ └───────────────┘  2/3 generaciones         │
└─────────────────────────────────────────────┘
```

### 5.2 Modal de Resultado IA

```
┌─────────────────────────────────────────────┐
│ ✨ Descripción Generada                      │
│─────────────────────────────────────────────│
│                                              │
│ "Nuestro producto premium ofrece una         │
│ experiencia única combinando calidad          │
│ artesanal con diseño moderno..."             │
│                                              │
│─────────────────────────────────────────────│
│  [✓ Usar esta descripción]  [↻ Regenerar]   │
└─────────────────────────────────────────────┘
```

---

## 6. Manejo de Errores de IA

| Error | Handling |
|---|---|
| API key inválida | Log server-side, 500 genérico al usuario |
| Rate limit de Gemini (15 RPM) | Retry con backoff, toast "Intenta en unos segundos" |
| Content policy violation | Toast "La descripción no pudo generarse, intenta con otro texto" |
| Timeout (>60s) | Cancelar, toast "La generación tomó demasiado tiempo" |
| Límite de plan alcanzado | Modal con CTA de upgrade al plan Pro |
| Error de red | Toast "Error de conexión, intenta de nuevo" |
| Imagen bloqueada por safety | Toast "La imagen no se pudo generar. Intenta con otra descripción" |

---

## 7. Costos de IA

| Operación | Modelo | Costo |
|---|---|---|
| Descripción de texto | gemini-2.0-flash | **$0 (gratuito)** |
| Generación de imagen | imagen-3.0-generate-002 | **$0 (gratuito)** |

### Límites de la Capa Gratuita de Google Gemini

| Recurso | Límite gratis |
|---|---|
| Requests por minuto (RPM) | 15 |
| Tokens por minuto | 1,000,000 |
| Requests por día | 1,500 |
| Imágenes por día | ~500 (estimado) |

**Proyección:** Con estos límites se pueden atender ~50 usuarios activos diarios generando contenido sin ningún costo. Si la plataforma crece más allá del free tier, Google ofrece planes de pago escalonados.

---

## 8. Escalabilidad: Migración a Plan de Pago

Si la capa gratuita se queda corta, las opciones son:

| Estrategia | Detalle |
|---|---|
| Google Gemini (pago) | Mismo código, solo cambiar el billing. Bajo costo por token |
| OpenAI como fallback | Agregar OpenAI como proveedor alternativo para planes premium |
| Queue de generaciones | Usar una cola (BullMQ/Inngest) para controlar RPM |
| Cache de prompts | Si el mismo producto se regenera, servir desde cache |

> **Recomendación:** Empezar 100% con Gemini gratuito. Solo agregar proveedores alternativos si se supera el límite del free tier.
