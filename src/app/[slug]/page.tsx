import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { LandingLayout } from "@/components/landing/landing-layout"

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
  category: "restaurant",
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
        category: dbBusiness.category || "restaurant",
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

  return <LandingLayout business={business as any} />
}
