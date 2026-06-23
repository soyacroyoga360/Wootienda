import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email, name, businessSlug } = await request.json()

    if (!email || !name || !businessSlug) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const result = await sendWelcomeEmail(email, name, businessSlug)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in welcome email route:", error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
