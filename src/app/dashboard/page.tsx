import Link from "next/link"
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
} from "lucide-react"

export default function DashboardPage() {
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

  const stats = [
    {
      label: "Visitas",
      value: "0",
      icon: Eye,
      change: null,
    },
    {
      label: "Productos",
      value: "0",
      icon: ShoppingBag,
      change: null,
    },
    {
      label: "Impresiones",
      value: "0",
      icon: TrendingUp,
      change: null,
    },
  ]

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de administración
        </p>
      </div>

      {/* Alert — setup needed */}
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

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border/50 p-5"
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
