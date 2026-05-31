import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Wootienda",
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let businessSlug = "cafe-sierra"
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: business } = await supabase
        .from("businesses")
        .select("slug")
        .eq("user_id", user.id)
        .maybeSingle()
      if (business?.slug) {
        businessSlug = business.slug
      }
    }
  } catch (err) {
    console.error("Error fetching business slug in layout:", err)
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar initialSlug={businessSlug} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

