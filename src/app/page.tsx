import { Header } from "@/components/shared/header"
import { Logo } from "@/components/shared/logo"
import Link from "next/link"
import {
  Palette,
  Package,
  Sparkles,
  Link2,
  Smartphone,
  LayoutDashboard,
  ArrowRight,
  Zap,
  Shield,
  Clock,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Palette,
      title: "Landing personalizable",
      description:
        "Elige entre múltiples temas, personaliza colores y sube tu banner. Tu marca, tu estilo.",
    },
    {
      icon: Package,
      title: "Catálogo de productos",
      description:
        "Sube tus productos con fotos, precios y descripciones. Organízalos por categorías.",
    },
    {
      icon: Sparkles,
      title: "Contenido con IA",
      description:
        "Genera descripciones de productos, textos de landing y más con inteligencia artificial.",
    },
    {
      icon: Link2,
      title: "URL personalizada",
      description:
        "Obtén tu propia URL wootienda.com/tu-negocio para compartir con tus clientes.",
    },
    {
      icon: Smartphone,
      title: "100% Responsive",
      description:
        "Tu landing se ve perfecta en celular, tablet y computadora. Sin configuración extra.",
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard intuitivo",
      description:
        "Administra todo desde un panel simple: productos, apariencia, contacto y más.",
    },
  ]

  const trustItems = [
    { icon: Zap, text: "Configura en 5 minutos" },
    { icon: Shield, text: "Sin tarjeta de crédito" },
    { icon: Clock, text: "URL personalizada incluida" },
  ]

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl float" />
            <div
              className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl float"
              style={{ animationDelay: "2s" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(238,29,109,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(238,29,109,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Plataforma en desarrollo
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
                Crea tu{" "}
                <span className="text-gradient-brand">tienda digital</span>
                <br />
                en minutos
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Registra tu negocio, personaliza tu landing y empieza a vender.
                Con herramientas de IA para generar contenido profesional al
                instante.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white gradient-brand hover:shadow-[var(--shadow-pink-lg)] transition-all duration-300 active:scale-[0.97] text-base shadow-md"
                >
                  <Sparkles className="size-4" />
                  Empezar gratis
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-foreground bg-secondary hover:bg-secondary/80 border border-border transition-all duration-300 active:scale-[0.97] text-base"
                >
                  Ya tengo cuenta
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* Trust items */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
                {trustItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <item.icon className="size-4 text-primary" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Todo lo que necesitas para tu negocio
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Herramientas profesionales para crear tu presencia digital sin
                conocimientos técnicos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 -z-10 blur-xl" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Logo variant="both" size="sm" href="/" />
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Wootienda. Todos los derechos
              reservados.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
