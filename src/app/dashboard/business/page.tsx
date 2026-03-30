import { BusinessForm } from "@/components/dashboard/business-form"
import { Store } from "lucide-react"

export const metadata = {
  title: "Mi Negocio",
}

export default function BusinessPage() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Store className="size-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Mi Negocio</h1>
        </div>
        <p className="text-muted-foreground ml-9">
          Configura los datos principales de tu negocio
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
        <BusinessForm />
      </div>
    </>
  )
}
