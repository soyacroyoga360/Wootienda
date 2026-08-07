const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"

/**
 * "-latest" aliases track Google's cheapest current lite tier automatically,
 * so this doesn't need updating every time a model gets deprecated (which
 * happens often — gemini-2.0-flash-lite and gemini-2.5-flash-lite both 404'd
 * within the same generation). No alias exists yet for image models, so that
 * one is pinned and may need bumping if Google retires it.
 */
export const TEXT_MODEL = "gemini-flash-lite-latest"
export const IMAGE_MODEL = "gemini-3.1-flash-lite-image"

export class GeminiError extends Error {
  status: number
  constructor(status: number, body: string) {
    super(`Gemini API error ${status}: ${body.slice(0, 300)}`)
    this.name = "GeminiError"
    this.status = status
  }
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY no está configurada")
  return key
}

export async function generateJSON<T>(prompt: string, schema: object): Promise<T> {
  const res = await fetch(
    `${GEMINI_API_BASE}/models/${TEXT_MODEL}:generateContent?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      }),
    }
  )

  if (!res.ok) {
    throw new GeminiError(res.status, await res.text().catch(() => ""))
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini no devolvió contenido")
  return JSON.parse(text) as T
}

/**
 * Gemini reads documents (PDF pages get treated as images internally, per
 * usageMetadata) natively — no separate PDF-to-text/markdown step needed.
 * Confirmed working with the cheap lite model on a real multi-item menu PDF.
 */
export async function generateJSONFromFile<T>(
  fileBase64: string,
  mimeType: string,
  prompt: string,
  schema: object
): Promise<T> {
  const res = await fetch(
    `${GEMINI_API_BASE}/models/${TEXT_MODEL}:generateContent?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ inlineData: { mimeType, data: fileBase64 } }, { text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      }),
    }
  )

  if (!res.ok) {
    throw new GeminiError(res.status, await res.text().catch(() => ""))
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini no devolvió contenido")
  return JSON.parse(text) as T
}

export async function generateImageBytes(prompt: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(
    `${GEMINI_API_BASE}/models/${IMAGE_MODEL}:generateContent?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    }
  )

  if (!res.ok) {
    throw new GeminiError(res.status, await res.text().catch(() => ""))
  }

  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData)
  if (!imagePart?.inlineData) throw new Error("Gemini no devolvió una imagen")
  return { base64: imagePart.inlineData.data, mimeType: imagePart.inlineData.mimeType }
}
