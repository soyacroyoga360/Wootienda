import { NextResponse } from "next/server"
import { sendInquiryEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { 
      businessEmail, 
      businessName, 
      customerName, 
      customerPhone, 
      customerEmail, 
      productName, 
      productPrice 
    } = await request.json()

    if (!businessEmail || !businessName || !customerName || !customerPhone || !productName || !productPrice) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const result = await sendInquiryEmail(
      businessEmail,
      businessName,
      customerName,
      customerPhone,
      customerEmail || "",
      productName,
      Number(productPrice)
    )
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in inquiry email route:", error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
