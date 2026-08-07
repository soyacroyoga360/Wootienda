import { createClient } from "@/lib/supabase/server"

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export interface GatedBusiness {
  id: string
  plan: string
  business_name: string
  category: string
}

export type BusinessPlanGate =
  | { ok: true; userId: string; business: GatedBusiness; supabase: SupabaseServerClient }
  | { ok: false; status: number; error: string }

/**
 * AI product tools (description/image generation, CSV import) are exclusive
 * to the Business plan — gate every AI route through this before doing any
 * Gemini call.
 */
export async function requireBusinessPlan(): Promise<BusinessPlanGate> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, status: 401, error: "No autenticado" }
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, plan, business_name, category")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!business) {
    return { ok: false, status: 404, error: "No se encontró tu negocio" }
  }

  if (business.plan !== "business") {
    return {
      ok: false,
      status: 403,
      error: "Esta función es exclusiva del plan Business",
    }
  }

  return { ok: true, userId: user.id, business, supabase }
}
