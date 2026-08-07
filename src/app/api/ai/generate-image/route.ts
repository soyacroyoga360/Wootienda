import { NextResponse } from "next/server"
import { requireBusinessPlan } from "@/lib/ai/plan"
import { generateProductImage } from "@/lib/ai/products"
import { GeminiError, IMAGE_MODEL } from "@/lib/ai/gemini"

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/webp": "webp",
  "image/jpeg": "jpg",
}

export async function POST(request: Request) {
  const gate = await requireBusinessPlan()
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status })

  const body = await request.json().catch(() => null)
  const productName = typeof body?.productName === "string" ? body.productName.trim() : ""
  if (!productName) {
    return NextResponse.json({ error: "Falta el nombre del producto" }, { status: 400 })
  }

  try {
    const { base64, mimeType } = await generateProductImage({
      productName,
      description: typeof body?.description === "string" ? body.description.trim() : undefined,
      businessCategory: gate.business.category,
    })

    const ext = EXT_BY_MIME[mimeType] || "jpg"
    const path = `${gate.userId}/products/ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const bytes = Buffer.from(base64, "base64")

    const { error: uploadError } = await gate.supabase.storage
      .from("business-assets")
      .upload(path, bytes, { contentType: mimeType, upsert: false })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = gate.supabase.storage.from("business-assets").getPublicUrl(path)

    await gate.supabase.from("ai_generations").insert({
      user_id: gate.userId,
      type: "image",
      prompt: productName,
      result: publicUrl,
      model: IMAGE_MODEL,
      product_id: typeof body?.productId === "string" ? body.productId : null,
    })

    return NextResponse.json({ imageUrl: publicUrl })
  } catch (err) {
    if (err instanceof GeminiError && err.status === 429) {
      return NextResponse.json(
        {
          error:
            "El proveedor de IA no pudo generar la imagen. Puede requerir activar la facturación en tu proyecto de Google AI Studio, o haber alcanzado el límite de uso.",
        },
        { status: 429 }
      )
    }
    console.error("Error generating product image:", err)
    return NextResponse.json({ error: "No se pudo generar la imagen con IA" }, { status: 500 })
  }
}
