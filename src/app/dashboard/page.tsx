import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  Store,
  Package,
  Palette,
  Eye,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Crown,
  Settings,
} from "lucide-react"

export default async function DashboardPage() {
  let business = null
  let productCount = 0
  let stats = { total_views: 0, unique_visitors: 0, contact_clicks: 0 }
  let userPlan = "free"

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // 1. Fetch business details
      const { data: dbBusiness } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (dbBusiness) {
        business = dbBusiness
        userPlan = dbBusiness.plan || "free"

        // 2. Fetch product count
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("business_id", dbBusiness.id)
        productCount = count || 0

        // 3. Fetch latest stats
        const { data: dbStats } = await supabase
          .from("business_stats")
          .select("total_views, unique_visitors, contact_clicks")
          .eq("business_id", dbBusiness.id)
          .order("year", { ascending: false })
          .order("month", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (dbStats) {
          stats = {
            total_views: dbStats.total_views || 0,
            unique_visitors: dbStats.unique_visitors || 0,
            contact_clicks: dbStats.contact_clicks || 0,
          }
        }
      }
    }
  } catch (err) {
    console.error("Error loading dashboard data:", err)
  }

  const quickActions = [
    {
      title: "Mi Negocio",
      description: "Configura nombre, contacto, ubicación y redes sociales",
      href: "/dashboard/business",
      icon: Store,
      color: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
    },
    {
      title: "Productos",
      description: "Agrega, edita y organiza tu catálogo de productos",
      href: "/dashboard/products",
      icon: Package,
      color: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    },
    {
      title: "Apariencia",
      description: "Personaliza tema, colores, banner y estilo de tu landing",
      href: "/dashboard/appearance",
      icon: Palette,
      color: "bg-violet-500/10 text-violet-600 group-hover:bg-violet-500 group-hover:text-white",
    },
  ]

  const statsList = [
    {
      label: "Visitas",
      value: stats.total_views.toString(),
      icon: Eye,
    },
    {
      label: "Productos",
      value: productCount.toString(),
      icon: ShoppingBag,
    },
    {
      label: "Clics de contacto",
      value: stats.contact_clicks.toString(),
      icon: TrendingUp,
    },
  ]

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de administración, <span className="font-semibold text-foreground">{business?.business_name || "Comerciante"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            userPlan === "pro" 
              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm"
              : userPlan === "business"
              ? "bg-violet-500/10 text-violet-600 border border-violet-500/20 shadow-sm"
              : "bg-secondary text-muted-foreground"
          }`}>
            {(userPlan === "pro" || userPlan === "business") && <Crown className="size-3.5" />}
            Plan {userPlan}
          </span>
        </div>
      </div>

      {/* Plan-specific premium box */}
      {userPlan === "free" ? (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/5 border border-primary/20 mb-8 shadow-sm">
          <Crown className="size-6 text-primary shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">Actualiza a Wootienda PRO</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Desbloquea plantillas de diseño glassmorphic y neon, conecta tu propio dominio personalizado y obtén capacidades de generación de contenido por Inteligencia Artificial ilimitadas.
            </p>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-3"
            >
              Ver planes de actualización
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-accent/5 border border-amber-500/20 mb-8 shadow-sm">
          <Crown className="size-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">¡Disfrutas de características PRO activadas!</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Tienes acceso a todos los temas exclusivos de apariencia, analíticas detalladas y control completo del catálogo. Recuerda configurar tu dominio personalizado en la pestaña de configuración.
            </p>
          </div>
        </div>
      )}

      {/* Alert — setup needed */}
      {(!business?.phone || !business?.description) && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8">
          <AlertCircle className="size-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Completa la configuración de tu negocio</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Agrega los datos de tu negocio, sube productos y personaliza tu landing para activar tu tienda.
            </p>
            <Link
              href="/dashboard/business"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-2"
            >
              Configurar ahora
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statsList.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group bg-card rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${action.color}`}
            >
              <action.icon className="size-6" />
            </div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              {action.title}
              <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* AI tip */}
      <div className="mt-8 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 rounded-2xl border border-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Contenido con IA</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Usa inteligencia artificial para generar descripciones de
              productos, textos para tu landing y más. Disponible en cada
              sección del dashboard.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

