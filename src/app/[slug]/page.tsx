import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProductCatalog } from "@/components/landing/product-catalog"
import {
  MapPin,
  Globe,
  Clock,
  Camera,
  Hash,
  AtSign,
  ShoppingBag,
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const supabase = await createClient()
    const { data: dbBusiness } = await supabase
      .from("businesses")
      .select("business_name, description")
      .eq("slug", slug)
      .maybeSingle()

    if (dbBusiness) {
      return {
        title: `${dbBusiness.business_name} | Wootienda`,
        description: dbBusiness.description || `Visita la tienda en línea de ${dbBusiness.business_name} en Wootienda.`,
      }
    }
  } catch (err) {
    console.error("Error generating metadata:", err)
  }
  
  if (slug === "cafe-sierra") {
    return {
      title: "Café Sierra | Wootienda",
      description: "El mejor café de especialidad tostado en la ciudad. Descubre nuestra selección de granos de origen único, métodos de extracción y repostería artesanal.",
    }
  }
  
  return {
    title: "Wootienda",
    description: "Crea la landing page de tu negocio en minutos.",
  }
}

// Helper to convert hex to RGB values for neon theme glowing shadows
function hexToRgb(hex: string): string {
  let cleanHex = hex.replace("#", "")
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((char) => char + char).join("")
  }
  if (cleanHex.length !== 6) {
    return "238, 29, 109" // fallback to Wootienda pink (rgb equivalent of #EE1D6D)
  }
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

// Mock data for visual development since the database might be empty
const MOCK_BUSINESS = {
  name: "Café Sierra",
  description: "El mejor café de especialidad tostado en la ciudad. Descubre nuestra selección de granos de origen único, métodos de extracción y repostería artesanal.",
  banner_url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop",
  logo_url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=500&auto=format&fit=crop",
  phone: "+52 55 1234 5678",
  email: "hola@cafesierra.com",
  whatsapp: "525512345678",
  website: "https://cafesierra.com",
  address: "Av. de los Insurgentes Sur 123, Roma Norte",
  city: "Ciudad de México",
  country: "México",
  schedule: "Lun-Sáb: 8:00 - 21:00, Dom: 9:00 - 18:00",
  socials: {
    instagram: "@cafesierra",
    facebook: "cafesierra.mx",
    twitter: "@cafesierra_mx",
  },
  theme: "claro", // claro, oscuro, glassmorphism, neon-glow, gradient-mesh
  typography: "default",
  primary_color: "#EE1D6D", // Wootienda Pink as default
  products: [
    {
      id: "1",
      name: "Café de Origen: Veracruz",
      description: "Tueste medio, notas a chocolate, nuez y caramelo. 250g.",
      price: 250,
      image_url: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop",
      category: "Granos",
    },
    {
      id: "2",
      name: "Cold Brew Embotellado",
      description: "Extracción en frío por 24 horas. Listo para beber.",
      price: 85,
      image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1000&auto=format&fit=crop",
      category: "Bebidas",
    },
    {
      id: "3",
      name: "Chemex 6 Tazas",
      description: "Método de extracción por goteo con filtro de papel. Diseño elegante de vidrio.",
      price: 1250,
      image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
      category: "Accesorios",
    },
    {
      id: "4",
      name: "Croissant de Almendra",
      description: "Masa hojaldrada con crema de almendra y almendras fileteadas.",
      price: 65,
      image_url: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop",
      category: "Repostería",
    }
  ]
}

export default async function BusinessLandingPage({ params }: PageProps) {
  const { slug } = await params
  
  let business = null
  let isMock = false

  try {
    const supabase = await createClient()
    
    // 1. Intentar cargar el negocio desde Supabase por su slug
    const { data: dbBusiness } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      
    if (dbBusiness) {
      // 2. Cargar los productos reales asociados a este negocio
      const { data: dbProducts } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", dbBusiness.id)
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      // 3. Cargar enlaces de redes sociales de la tabla social_links
      const { data: dbSocialLinks } = await supabase
        .from("social_links")
        .select("platform, url")
        .eq("business_id", dbBusiness.id)

      const socials: Record<string, string> = {}
      dbSocialLinks?.forEach((link) => {
        socials[link.platform] = link.url
      })

      business = {
        name: dbBusiness.business_name,
        description: dbBusiness.description || "¡Bienvenido a nuestro negocio!",
        banner_url: dbBusiness.banner_url || "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop",
        logo_url: dbBusiness.logo_url || null,
        phone: dbBusiness.phone || "",
        email: dbBusiness.email || "",
        whatsapp: dbBusiness.whatsapp || "",
        website: dbBusiness.website || "",
        address: dbBusiness.address || "",
        city: dbBusiness.city || "",
        country: dbBusiness.country || "",
        schedule: dbBusiness.schedule || "",
        socials: {
          instagram: socials.instagram || "",
          facebook: socials.facebook || "",
          twitter: socials.twitter || socials.x || "",
        },
        theme: dbBusiness.theme || "claro",
        typography: dbBusiness.typography || "default",
        primary_color: dbBusiness.primary_color || "#EE1D6D",
        products: (dbProducts || []).map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: Number(p.price) || 0,
          image_url: p.image_url || "",
          category: p.category || "General",
        }))
      }
    }
  } catch (err) {
    console.error("Error al conectar o consultar Supabase:", err)
  }

  // Caemos al Mock si no existe en BD pero el slug es 'cafe-sierra' o 'demo'
  if (!business) {
    if (slug === "cafe-sierra" || slug === "demo") {
      business = MOCK_BUSINESS
      isMock = true
    } else {
      notFound()
    }
  }

  // Set CSS variables for primary color, RGB, and dynamic typography
  const themeStyle = {
    "--user-primary": business.primary_color,
    "--user-primary-rgb": hexToRgb(business.primary_color),
    fontFamily: 
      business.typography === "inter" 
        ? "var(--font-inter), system-ui, sans-serif" 
        : business.typography === "outfit" 
        ? "var(--font-outfit), system-ui, sans-serif" 
        : "var(--font-plus-jakarta), system-ui, sans-serif",
  } as React.CSSProperties

  let containerClass = "min-h-screen pb-24 transition-all duration-300"
  let mainCardClass = ""
  let logoBorderClass = ""
  let linkIconClass = ""
  let textMutedClass = ""
  let titleTextClass = ""

  if (business.theme === "oscuro") {
    containerClass += " bg-[#121212] text-white"
    mainCardClass = "bg-[#1a1a1a] rounded-3xl p-6 shadow-xl border border-[#262626] mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    logoBorderClass = "border-4 border-[#1a1a1a]"
    linkIconClass = "p-2 rounded-full bg-[#262626] hover:bg-[#333333] text-gray-200 transition-colors"
    textMutedClass = "text-gray-400"
    titleTextClass = "text-white"
  } else if (business.theme === "glassmorphism") {
    containerClass += " bg-gradient-to-tr from-[#0f172a] via-[#1e1b4b] to-[#311042] text-white"
    mainCardClass = "bg-white/10 dark:bg-black/25 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/15 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left text-white"
    logoBorderClass = "border-4 border-white/10 dark:border-black/25"
    linkIconClass = "p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
    textMutedClass = "text-gray-200"
    titleTextClass = "text-white"
  } else if (business.theme === "neon-glow") {
    containerClass += " bg-[#030303] text-white"
    mainCardClass = "bg-[#09090b] rounded-3xl p-6 shadow-[0_0_15px_rgba(var(--user-primary-rgb,238,29,109),0.07)] border border-primary/20 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    logoBorderClass = "border-4 border-[#09090b]"
    linkIconClass = "p-2 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white transition-colors border border-primary/10"
    textMutedClass = "text-gray-400"
    titleTextClass = "text-white"
  } else if (business.theme === "gradient-mesh") {
    containerClass += " bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#fce7f3] dark:from-[#090514] dark:via-[#120a2a] dark:to-[#1a0b2e] text-slate-900 dark:text-white"
    mainCardClass = "bg-white/70 dark:bg-black/40 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-indigo-100 dark:border-purple-950/40 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    logoBorderClass = "border-4 border-white/70 dark:border-black/40"
    linkIconClass = "p-2 rounded-full bg-indigo-50 dark:bg-purple-950/30 hover:bg-indigo-100 dark:hover:bg-purple-900/40 text-indigo-700 dark:text-purple-300 transition-colors"
    textMutedClass = "text-slate-600 dark:text-slate-300"
    titleTextClass = "text-slate-900 dark:text-white"
  } else {
    // claro
    containerClass += " bg-[#f8fafc] text-slate-900"
    mainCardClass = "bg-white rounded-3xl p-6 shadow-xl border border-slate-100 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    logoBorderClass = "border-4 border-white"
    linkIconClass = "p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
    textMutedClass = "text-slate-500"
    titleTextClass = "text-slate-900"
  }

  return (
    <div 
      className={containerClass}
      style={themeStyle}
    >
      {/* 1. Header / Banner */}
      <header className="relative w-full h-64 md:h-80 lg:h-96 bg-secondary/50">
        {business.banner_url ? (
          <Image
            src={business.banner_url}
            alt={`Banner de ${business.name}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900" />
        )}
        
        {/* Overlay para garantizar legibilidad si hay texto sobre el banner */}
        <div className="absolute inset-0 bg-black/20" />
      </header>

      {/* 2. Main content area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Contenedor del perfil (Foto flotante y nombre) */}
        <div className={mainCardClass}>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full">
            {/* Logotipo/Avatar */}
            <div className={`w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full shadow-lg overflow-hidden bg-muted -mt-16 sm:-mt-20 relative z-20 ${logoBorderClass}`}>
              {business.logo_url ? (
                <Image
                  src={business.logo_url}
                  alt={`Logo de ${business.name}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-4xl text-muted-foreground uppercase">
                  {business.name.substring(0, 2)}
                </div>
              )}
            </div>

            {/* Detalles principales */}
            <div className="flex-1 space-y-3">
              <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${titleTextClass}`}>
                {business.name}
              </h1>
              {business.description && (
                <p className={`${textMutedClass} max-w-2xl leading-relaxed`}>
                  {business.description}
                </p>
              )}

              {/* Badges de info */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                {business.address && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    business.theme === 'glassmorphism' 
                      ? 'bg-white/10 text-white' 
                      : business.theme === 'oscuro' 
                      ? 'bg-slate-800 text-slate-200' 
                      : business.theme === 'neon-glow'
                      ? 'bg-[#09090b] text-white border border-[#ee1d6d]/20'
                      : business.theme === 'gradient-mesh'
                      ? 'bg-white/50 dark:bg-black/20 text-slate-800 dark:text-slate-200'
                      : 'bg-secondary text-secondary-foreground'
                  } text-sm`}>
                    <MapPin className="size-4" />
                    <span>{business.city ? `${business.city}, ${business.country}` : 'Ubicación física'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA rápido a WhatsApp */}
            <div className="flex flex-wrap sm:flex-col gap-3 shrink-0 pt-2 sm:pt-0">
              {business.whatsapp && (
                <a 
                  href={`https://wa.me/${business.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-bold h-10 px-6 rounded-full shadow-md text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-200 border-0"
                  style={{ backgroundColor: business.primary_color }}
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Redes sociales y Contacto extendido */}
          <div className={`w-full mt-6 pt-6 border-t ${
            business.theme === 'glassmorphism' 
              ? 'border-white/10' 
              : business.theme === 'oscuro' 
              ? 'border-slate-800' 
              : business.theme === 'neon-glow'
              ? 'border-[#ee1d6d]/10'
              : business.theme === 'gradient-mesh'
              ? 'border-indigo-100/50 dark:border-purple-950/20'
              : 'border-border/50'
          } grid grid-cols-1 md:grid-cols-2 gap-4 text-sm`}>
            <div className="space-y-3">
              {business.schedule && (
                <div className={`flex items-start gap-2.5 ${textMutedClass}`}>
                  <Clock className="size-4 shrink-0 mt-0.5" />
                  <span>{business.schedule}</span>
                </div>
              )}
              {business.address && (
                <div className={`flex items-start gap-2.5 ${textMutedClass}`}>
                  <MapPin className="size-4 shrink-0 mt-0.5" />
                  <span>{business.address}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center md:justify-end gap-3 auto-rows-max">
              {business.socials?.instagram && (
                <a href={`https://instagram.com/${business.socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className={linkIconClass}>
                  <Camera className="size-4" />
                </a>
              )}
              {business.socials?.facebook && (
                <a href={`https://facebook.com/${business.socials.facebook}`} target="_blank" rel="noreferrer" className={linkIconClass}>
                  <Hash className="size-4" />
                </a>
              )}
              {business.socials?.twitter && (
                <a href={`https://twitter.com/${business.socials.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className={linkIconClass}>
                  <AtSign className="size-4" />
                </a>
              )}
              {business.website && (
                <a href={business.website} target="_blank" rel="noreferrer" className={linkIconClass}>
                  <Globe className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 3. Catálogo de Productos */}
        <section className="mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="size-6" style={{ color: business.primary_color }} />
              Nuestro Catálogo
            </h2>
          </div>

          <ProductCatalog 
            products={business.products}
            primaryColor={business.primary_color}
            whatsapp={business.whatsapp}
            theme={business.theme}
          />
        </section>
      </main>

      {/* Marca de agua de Wootienda */}
      <footer className="mt-20 pb-8 text-center">
        <Link 
          href="/" 
          target="_blank" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-all duration-300 border-0"
        >
          <span>Creado con</span>
          <div className="flex items-center gap-1 opacity-70">
            <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
              <span className="text-[10px] font-bold">W</span>
            </div>
            <span className="font-bold tracking-tight">Wootienda</span>
          </div>
        </Link>
      </footer>
    </div>
  )
}
