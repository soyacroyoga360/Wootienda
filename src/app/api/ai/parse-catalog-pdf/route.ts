import { NextResponse } from "next/server"
import { requireBusinessPlan } from "@/lib/ai/plan"
import { extractProductsFromDocument } from "@/lib/ai/products"
import { GeminiError } from "@/lib/ai/gemini"

// ~10MB file, base64-inflated (~4/3), well under Gemini's 20MB inline-data cap.
const MAX_BASE64_LENGTH = Math.ceil((10 * 1024 * 1024 * 4) / 3)

export async function POST(request: Request) {
  const gate = await requireBusinessPlan()
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status })

  const body = await request.json().catch(() => null)
  const fileBase64 = typeof body?.fileBase64 === "string" ? body.fileBase64 : ""
  const mimeType = typeof body?.mimeType === "string" ? body.mimeType : "application/pdf"

  if (!fileBase64) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 })
  }
  if (fileBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: "El archivo es demasiado grande (máx. 10MB)" }, { status: 400 })
  }

  try {
    const products = await extractProductsFromDocument(fileBase64, mimeType)
    return NextResponse.json({ products })
  } catch (err) {
    if (err instanceof GeminiError && err.status === 429) {
      return NextResponse.json(
        { error: "El proveedor de IA alcanzó su límite de uso. Intenta de nuevo en unos segundos." },
        { status: 429 }
      )
    }
    console.error("Error extracting products from document:", err)
    return NextResponse.json(
      { error: "No se pudo leer el documento. Verifica que sea un PDF legible." },
      { status: 500 }
    )
  }
}
