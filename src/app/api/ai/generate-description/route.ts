import { NextResponse } from "next/server"
import { requireBusinessPlan } from "@/lib/ai/plan"
import { generateProductDescription } from "@/lib/ai/products"
import { GeminiError, TEXT_MODEL } from "@/lib/ai/gemini"

export async function POST(request: Request) {
  const gate = await requireBusinessPlan()
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status })

  const body = await request.json().catch(() => null)
  const productName = typeof body?.productName === "string" ? body.productName.trim() : ""
  if (!productName) {
    return NextResponse.json({ error: "Falta el nombre del producto" }, { status: 400 })
  }

  try {
    const result = await generateProductDescription({
      productName,
      businessName: gate.business.business_name,
      businessCategory: gate.business.category,
      existingDescription: typeof body?.existingDescription === "string" ? body.existingDescription.trim() : undefined,
    })

    await gate.supabase.from("ai_generations").insert({
      user_id: gate.userId,
      type: "text",
      prompt: productName,
      result: result.description,
      model: TEXT_MODEL,
      product_id: typeof body?.productId === "string" ? body.productId : null,
    })

    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof GeminiError && err.status === 429) {
      return NextResponse.json(
        { error: "El proveedor de IA alcanzó su límite de uso. Intenta de nuevo en unos segundos." },
        { status: 429 }
      )
    }
    console.error("Error generating product description:", err)
    return NextResponse.json({ error: "No se pudo generar el contenido con IA" }, { status: 500 })
  }
}
