import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  MessageCircle,
  Globe,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  Camera,
  Hash,
  AtSign,
  Video,
  ExternalLink,
  Search,
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
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
  theme: "claro", // claro, oscuro
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
  
  // En este punto, intentaríamos cargar el negocio desde Supabase:
  // const supabase = await createClient()
  // const { data: business } = await supabase.from('businesses').select('*').eq('slug', slug).single()
  
  // Por ahora, para mostrar una interfaz robusta y estética a los usuarios,
  // si no se encuentra en la base de datos (o da error por tablas inexistentes),
  // usaremos el mock. Si es un entorno real, descomentar notFound().
  
  const business = MOCK_BUSINESS // Simulación temporal

  if (!business) {
    notFound()
  }

  // Set CSS variable for primary color so hover states and buttons use the user's color
  const themeStyle = {
    "--user-primary": business.primary_color,
  } as React.CSSProperties

  const isDark = business.theme === 'oscuro'

  return (
    <div 
      className={`min-h-screen pb-24 ${isDark ? 'bg-[#121212] text-white' : 'bg-background text-foreground'}`}
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
        <div className="bg-card dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-xl border border-border/50 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full">
            {/* Logotipo/Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full border-4 border-card dark:border-[#1a1a1a] shadow-lg overflow-hidden bg-muted -mt-16 sm:-mt-20 relative z-20">
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
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {business.name}
              </h1>
              {business.description && (
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                  {business.description}
                </p>
              )}

              {/* Badges de info */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                {business.address && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                    <MapPin className="size-4" />
                    <span>{business.city ? `${business.city}, ${business.country}` : 'Ubicación física'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTAs rápidos */}
            <div className="flex flex-wrap sm:flex-col gap-3 shrink-0 pt-2 sm:pt-0">
              {business.whatsapp && (
                <a 
                  href={`https://wa.me/${business.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-10 px-4 py-2 rounded-full shadow-md text-white border-0 transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: business.primary_color }}
                >
                  <MessageCircle className="size-4 mr-2" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Redes sociales y Contacto extendido */}
          <div className="w-full mt-6 pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-3">
              {business.schedule && (
                <div className="flex items-start gap-2.5">
                  <Clock className="size-4 shrink-0 mt-0.5 text-foreground" />
                  <span>{business.schedule}</span>
                </div>
              )}
              {business.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 shrink-0 mt-0.5 text-foreground" />
                  <span>{business.address}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center md:justify-end gap-3 auto-rows-max">
              {business.socials?.instagram && (
                <a href={`https://instagram.com/${business.socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                  <Camera className="size-4" />
                </a>
              )}
              {business.socials?.facebook && (
                <a href={`https://facebook.com/${business.socials.facebook}`} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                  <Hash className="size-4" />
                </a>
              )}
              {business.socials?.twitter && (
                <a href={`https://twitter.com/${business.socials.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                  <AtSign className="size-4" />
                </a>
              )}
              {business.website && (
                <a href={business.website} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
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
            
            {/* Buscador visual (mock) */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 transition-shadow"
                style={{ '--tw-ring-color': `${business.primary_color}30` } as any}
              />
            </div>
          </div>

          {business.products && business.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {business.products.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-card dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-square w-full bg-secondary overflow-hidden">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.category && (
                      <span className="absolute top-3 inset-x-0 mx-auto w-max px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider">
                        {product.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-[var(--user-primary)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 mt-auto">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <span className="font-extrabold flex items-baseline gap-1" style={{ color: business.primary_color }}>
                        <span className="text-sm">$</span>
                        <span className="text-xl">{product.price.toLocaleString()}</span>
                      </span>
                      
                      {business.whatsapp ? (
                        <a 
                          href={`https://wa.me/${business.whatsapp}?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 px-3 rounded-full text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: business.primary_color }}
                        >
                          Pedir
                        </a>
                      ) : (
                        <button 
                          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 px-3 rounded-full text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: business.primary_color }}
                        >
                          Me interesa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ( // Product empty state
            <div className="py-20 text-center bg-card rounded-2xl border border-dashed border-border/50">
              <ShoppingBag className="size-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">No hay productos disponibles por el momento.</p>
            </div>
          )}
        </section>
      </main>

      {/* Marca de agua de Wootienda */}
      <footer className="mt-20 pb-8 text-center">
        <Link 
          href="/" 
          target="_blank" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
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
