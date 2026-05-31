import Link from "next/link"
import {
  Package,
  Layers,
  Sparkles,
  Image,
  Palette,
  LayoutTemplate,
  Check,
  Zap,
  Crown,
  Star,
} from "lucide-react"

const plans = [
  {
    name: "Gratis",
    slug: "free",
    price: "$0",
    period: "/mes",
    description: "Perfecto para empezar y probar la plataforma.",
    icon: Zap,
    iconBg: "bg-secondary text-muted-foreground",
    cta: "Empezar gratis",
    ctaVariant: "outline" as const,
    href: "/register",
    highlighted: false,
    features: [
      { icon: Package, text: "Hasta 10 productos", included: true },
      { icon: Layers, text: "1 categoría por producto", included: true },
      { icon: LayoutTemplate, text: "1 tema visual", included: true },
      { icon: Sparkles, text: "Generación de descripciones con IA", included: false },
      { icon: Image, text: "Generación de imágenes con IA", included: false },
      { icon: Palette, text: "Temas premium", included: false },
      { icon: LayoutTemplate, text: "Modelos de página avanzados", included: false },
    ],
  },
  {
    name: "Pro",
    slug: "pro",
    price: "$10",
    period: "/mes",
    description: "Ideal para negocios que quieren crecer con IA.",
    icon: Star,
    iconBg: "bg-accent/10 text-accent-foreground",
    cta: "Elegir Pro",
    ctaVariant: "default" as const,
    href: "/register?plan=pro",
    highlighted: true,
    features: [
      { icon: Package, text: "Hasta 30 categorías", included: true },
      { icon: Layers, text: "Hasta 30 productos por categoría", included: true },
      { icon: LayoutTemplate, text: "Todos los temas visuales", included: true },
      { icon: Sparkles, text: "Generación de descripciones con IA", included: true },
      { icon: Image, text: "Generación de imágenes de productos con IA", included: true },
      { icon: Image, text: "Generación de imágenes de categorías con IA", included: true },
      { icon: Palette, text: "Temas premium", included: false },
      { icon: LayoutTemplate, text: "Modelos de página avanzados", included: false },
    ],
  },
  {
    name: "Premium",
    slug: "premium",
    price: "$20",
    period: "/mes",
    description: "Máxima personalización y herramientas exclusivas.",
    icon: Crown,
    iconBg: "bg-gradient-gold text-black",
    cta: "Elegir Premium",
    ctaVariant: "default" as const,
    href: "/register?plan=premium",
    highlighted: false,
    features: [
      { icon: Package, text: "Hasta 30 categorías", included: true },
      { icon: Layers, text: "Hasta 30 productos por categoría", included: true },
      { icon: LayoutTemplate, text: "Todos los temas visuales", included: true },
      { icon: Sparkles, text: "Generación de descripciones con IA", included: true },
      { icon: Image, text: "Generación de imágenes de productos con IA", included: true },
      { icon: Image, text: "Generación de imágenes de categorías con IA", included: true },
      { icon: Palette, text: "Temas premium exclusivos", included: true },
      { icon: LayoutTemplate, text: "Modelos de página avanzados", included: true },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Precios simples y transparentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu negocio. Sin costos ocultos, cancela cuando quieras.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`relative flex flex-col rounded-2xl border p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.highlighted
                  ? "border-primary/50 bg-gradient-to-b from-primary/[0.03] to-transparent shadow-lg shadow-primary/10 scale-[1.02] md:scale-[1.03]"
                  : "border-border/50 bg-card shadow-sm hover:border-primary/20"
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-md">
                    <Star className="size-3" />
                    Más popular
                  </span>
                </div>
              )}

              {/* Plan icon & name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.iconBg}`}>
                  <plan.icon className="size-5" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-muted-foreground text-sm font-medium ml-1">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.97] mb-8 ${
                  plan.highlighted || plan.slug === "premium"
                    ? "text-white gradient-brand hover:shadow-[var(--shadow-pink-lg)] shadow-md"
                    : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="border-t border-border/50 mb-6" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Check className="size-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                          <span className="text-xs leading-none">—</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground line-through"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
