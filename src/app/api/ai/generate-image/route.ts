import { NextResponse } from "next/server"
import { requireBusinessPlan } from "@/lib/ai/plan"
import { generateProductImage } from "@/lib/ai/products"
import { GeminiError, IMAGE_MODEL } from "@/lib/ai/gemini"
import { optimizeToWebp } from "@/lib/image"

export async function POST(request: Request) {
  const gate = await requireBusinessPlan()
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status })

  const body = await request.json().catch(() => null)
  const productName = typeof body?.productName === "string" ? body.productName.trim() : ""
  if (!productName) {
    return NextResponse.json({ error: "Falta el nombre del producto" }, { status: 400 })
  }

  try {
    const { base64 } = await generateProductImage({
      productName,
      description: typeof body?.description === "string" ? body.description.trim() : undefined,
      businessCategory: gate.business.category,
    })

    const webpBytes = await optimizeToWebp(Buffer.from(base64, "base64"))
    const path = `${gate.userId}/products/ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

    const { error: uploadError } = await gate.supabase.storage
      .from("business-assets")
      .upload(path, webpBytes, { contentType: "image/webp", upsert: false })

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
