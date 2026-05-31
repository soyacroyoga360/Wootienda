import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  // Resolver el origen de forma robusta para evitar redirecciones internas a 0.0.0.0 o localhost
  let redirectOrigin = origin
  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto") || "http"
  const hostHeader = request.headers.get("host")

  if (
    redirectOrigin.includes("0.0.0.0") ||
    redirectOrigin.includes("localhost") ||
    redirectOrigin.includes("127.0.0.1")
  ) {
    if (forwardedHost) {
      redirectOrigin = `${forwardedProto}://${forwardedHost}`
    } else if (hostHeader) {
      if (hostHeader.includes("0.0.0.0") || hostHeader.includes("localhost") || hostHeader.includes("127.0.0.1")) {
        redirectOrigin = "http://2.24.104.66:3000"
      } else {
        redirectOrigin = `http://${hostHeader}`
      }
    } else {
      redirectOrigin = "http://2.24.104.66:3000"
    }
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${next}`)
    }
  }

  // Auth code error — redirect to login with error
  return NextResponse.redirect(`${redirectOrigin}/login?error=auth_callback_failed`)
}
