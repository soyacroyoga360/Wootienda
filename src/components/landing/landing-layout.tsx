"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ProductCatalog } from "./product-catalog"
import { 
  MapPin, 
  Globe, 
  Clock, 
  Phone, 
  Mail,
  ShoppingBag, 
  Info,
  ArrowLeft,
  Star,
  ExternalLink,
  MessageCircle,
  Camera,
  AtSign,
  Hash
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

interface BusinessDetails {
  name: string
  description: string
  banner_url: string
  logo_url: string | null
  phone: string
  email: string
  whatsapp: string
  website: string
  address: string
  city: string
  country: string
  schedule: string
  socials: {
    instagram: string
    facebook: string
    twitter: string
  }
  theme: string
  typography: string
  primary_color: string
  category: string
  products: Product[]
}

interface LandingLayoutProps {
  business: BusinessDetails
}

export function LandingLayout({ business }: LandingLayoutProps) {
  // Navigation State: 'portal' | 'catalog' | 'info'
  const [view, setView] = useState<"portal" | "catalog" | "info">("portal")

  // Helper to convert hex to RGB values for glowing neon themes
  const hexToRgb = (hex: string): string => {
    let cleanHex = hex.replace("#", "")
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((char) => char + char).join("")
    }
    if (cleanHex.length !== 6) {
      return "238, 29, 109"
    }
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }

  // Theme-specific styles
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
  let infoCardClass = ""
  let logoBorderClass = ""
  let linkIconClass = ""
  let textMutedClass = ""
  let titleTextClass = ""
  let tabActiveStyle = {}
  let tabInactiveClass = ""

  if (business.theme === "oscuro") {
    containerClass += " bg-[#121212] text-white"
    mainCardClass = "bg-[#1a1a1a] rounded-3xl p-6 shadow-xl border border-[#262626] mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    infoCardClass = "bg-[#1a1a1a] rounded-3xl p-6 border border-[#262626] space-y-6"
    logoBorderClass = "border-4 border-[#1a1a1a]"
    linkIconClass = "p-2.5 rounded-full bg-[#262626] hover:bg-[#333333] text-gray-200 transition-colors"
    textMutedClass = "text-gray-400"
    titleTextClass = "text-white"
    tabInactiveClass = "text-gray-400 hover:text-white hover:bg-white/5"
  } else if (business.theme === "glassmorphism") {
    containerClass += " bg-gradient-to-tr from-[#0f172a] via-[#1e1b4b] to-[#311042] text-white"
    mainCardClass = "bg-white/10 dark:bg-black/25 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/15 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left text-white"
    infoCardClass = "bg-white/10 dark:bg-black/25 backdrop-blur-md rounded-3xl p-6 border border-white/15 space-y-6 text-white"
    logoBorderClass = "border-4 border-white/10 dark:border-black/25"
    linkIconClass = "p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
    textMutedClass = "text-gray-200"
    titleTextClass = "text-white"
    tabInactiveClass = "text-gray-200 hover:text-white hover:bg-white/10"
  } else if (business.theme === "neon-glow") {
    containerClass += " bg-[#030303] text-white"
    mainCardClass = "bg-[#09090b] rounded-3xl p-6 shadow-[0_0_15px_rgba(var(--user-primary-rgb,238,29,109),0.07)] border border-primary/20 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    infoCardClass = "bg-[#09090b] rounded-3xl p-6 border border-primary/20 space-y-6 shadow-[0_0_10px_rgba(var(--user-primary-rgb,238,29,109),0.04)]"
    logoBorderClass = "border-4 border-[#09090b]"
    linkIconClass = "p-2.5 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white transition-colors border border-primary/10"
    textMutedClass = "text-gray-400"
    titleTextClass = "text-white"
    tabInactiveClass = "text-gray-400 hover:text-white hover:bg-[#18181b]"
  } else if (business.theme === "gradient-mesh") {
    containerClass += " bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#fce7f3] dark:from-[#090514] dark:via-[#120a2a] dark:to-[#1a0b2e] text-slate-900 dark:text-white"
    mainCardClass = "bg-white/70 dark:bg-black/40 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-indigo-100 dark:border-purple-950/40 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    infoCardClass = "bg-white/70 dark:bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-indigo-100 dark:border-purple-950/40 space-y-6"
    logoBorderClass = "border-4 border-white/70 dark:border-black/40"
    linkIconClass = "p-2.5 rounded-full bg-indigo-50 dark:bg-purple-950/30 hover:bg-indigo-100 dark:hover:bg-purple-900/40 text-indigo-700 dark:text-purple-300 transition-colors"
    textMutedClass = "text-slate-600 dark:text-slate-300"
    titleTextClass = "text-slate-900 dark:text-white"
    tabInactiveClass = "text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-purple-950/20"
  } else {
    // claro
    containerClass += " bg-[#ffffff] text-slate-900"
    mainCardClass = "bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/70 mb-8 flex flex-col items-center sm:items-start text-center sm:text-left"
    infoCardClass = "bg-white rounded-3xl p-6 border border-slate-100/70 space-y-6 shadow-sm"
    logoBorderClass = "border-4 border-white"
    linkIconClass = "p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
    textMutedClass = "text-slate-500"
    titleTextClass = "text-slate-900"
    tabInactiveClass = "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
  }

  // Active tab style override
  tabActiveStyle = {
    backgroundColor: business.primary_color,
    color: "#ffffff",
    boxShadow: `0 4px 10px ${business.primary_color}25`
  }

  // Labels based on category setting
  const isFoodType = business.category === "restaurant"
  const mainTabLabel = isFoodType ? "Menú" : "Servicios"

  // Render 1: Welcome Portal cover (Vista Inicial / Link-in-bio)
  if (view === "portal") {
    return (
      <div 
        className="relative min-h-screen flex flex-col items-center justify-between py-12 px-4 select-none overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${business.banner_url})`,
          fontFamily: themeStyle.fontFamily
        }}
      >
        {/* Dark overlay backdrop */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

        {/* Top Spacer or Small Watermark */}
        <div className="relative z-10 w-full text-center">
          <div className="inline-block w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-white text-xs border border-white/10">W</div>
        </div>

        {/* Center Welcome Container */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-8 my-auto">
          {/* Logo */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full shadow-2xl border-4 border-white/20 overflow-hidden relative bg-[#121212]/30 backdrop-blur-sm flex items-center justify-center">
            {business.logo_url ? (
              <Image
                src={business.logo_url}
                alt={`Logo de ${business.name}`}
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-extrabold text-white text-4xl uppercase">{business.name.substring(0, 2)}</span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3 px-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {business.name}
            </h1>
            {business.description && (
              <p className="text-sm md:text-base text-slate-200 opacity-90 max-w-xs mx-auto leading-relaxed drop-shadow-sm font-medium">
                {business.description}
              </p>
            )}
          </div>

          {/* Call To Actions */}
          <div className="flex flex-col gap-3.5 w-full items-center">
            <button
              onClick={() => setView("catalog")}
              className="w-64 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer border-0"
              style={{ backgroundColor: business.primary_color }}
            >
              Ver {mainTabLabel}
            </button>
            <button
              onClick={() => setView("info")}
              className="w-64 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-white transition-all bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              Más Información
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 pt-4">
            {business.socials?.instagram && (
              <a 
                href={`https://instagram.com/${business.socials.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center justify-center"
              >
                <Camera className="size-4" />
              </a>
            )}
            {business.socials?.facebook && (
              <a 
                href={`https://facebook.com/${business.socials.facebook}`} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center justify-center"
              >
                <Hash className="size-4" />
              </a>
            )}
            {business.socials?.twitter && (
              <a 
                href={`https://twitter.com/${business.socials.twitter.replace('@', '')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center justify-center"
              >
                <AtSign className="size-4" />
              </a>
            )}
            {business.website && (
              <a 
                href={business.website} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center justify-center"
              >
                <Globe className="size-4" />
              </a>
            )}
          </div>
        </div>

        {/* Google Reviews rating widget */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5 shadow-md">
            <div className="w-6.5 h-6.5 rounded-full bg-white flex items-center justify-center font-black text-xs text-blue-600 shadow-sm">G</div>
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">4.8</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="size-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-slate-300">Excelente reputación en Google</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render 2 & 3: Inner page layout (Header + Navigation tabs + active view content)
  return (
    <div 
      className={containerClass}
      style={themeStyle}
    >
      {/* 1. Header / Banner */}
      <header className="relative w-full h-48 md:h-64 bg-secondary/50">
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
        <div className="absolute inset-0 bg-black/20" />
      </header>

      {/* 2. Main content area */}
      <main className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        
        {/* Profile Card Header */}
        <div className={mainCardClass}>
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start w-full">
            {/* Logotipo/Avatar */}
            <div className={`w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-full shadow-lg overflow-hidden bg-muted -mt-14 sm:-mt-16 relative z-20 ${logoBorderClass}`}>
              {business.logo_url ? (
                <Image
                  src={business.logo_url}
                  alt={`Logo de ${business.name}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-muted-foreground uppercase">
                  {business.name.substring(0, 2)}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-2.5">
              <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${titleTextClass}`}>
                {business.name}
              </h1>
              {business.description && (
                <p className={`${textMutedClass} text-xs md:text-sm max-w-2xl leading-relaxed`}>
                  {business.description}
                </p>
              )}

              {/* Address Badge */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                {business.address && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
                    business.theme === 'glassmorphism' 
                      ? 'bg-white/10 text-white' 
                      : business.theme === 'oscuro' 
                      ? 'bg-slate-800 text-slate-200' 
                      : business.theme === 'neon-glow'
                      ? 'bg-[#09090b] text-white border border-[#ee1d6d]/20'
                      : business.theme === 'gradient-mesh'
                      ? 'bg-white/50 dark:bg-black/20 text-slate-800 dark:text-slate-200'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    <MapPin className="size-3.5" />
                    <span>{business.city ? `${business.city}, ${business.country}` : 'Ubicación física'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact Button */}
            <div className="flex gap-3 shrink-0 pt-1 sm:pt-0">
              {business.whatsapp && (
                <a 
                  href={`https://wa.me/${business.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap text-xs font-bold h-9 px-5 rounded-full shadow-md text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-200 border-0"
                  style={{ backgroundColor: business.primary_color }}
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Custom Tabbed Navigation Bar */}
        <div className="flex justify-center items-center gap-2 p-1.5 rounded-full bg-secondary/30 backdrop-blur-sm mb-8 w-fit mx-auto border border-border/30">
          <button
            onClick={() => setView("portal")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-0 ${tabInactiveClass}`}
          >
            <ArrowLeft className="size-3.5" />
            Inicio
          </button>
          
          <button
            onClick={() => setView("catalog")}
            style={view === "catalog" ? tabActiveStyle : {}}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-0 ${
              view === "catalog" ? "" : tabInactiveClass
            }`}
          >
            <ShoppingBag className="size-3.5" />
            {mainTabLabel}
          </button>
          
          <button
            onClick={() => setView("info")}
            style={view === "info" ? tabActiveStyle : {}}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-0 ${
              view === "info" ? "" : tabInactiveClass
            }`}
          >
            <Info className="size-3.5" />
            Información
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="transition-all duration-300">
          
          {/* View 2: Catalog content */}
          {view === "catalog" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <ProductCatalog 
                products={business.products}
                primaryColor={business.primary_color}
                whatsapp={business.whatsapp}
                theme={business.theme}
                businessEmail={business.email}
                businessName={business.name}
              />
            </div>
          )}

          {/* View 3: Information, Contact and Map content */}
          {view === "info" && (
            <div className={`space-y-6 animate-in fade-in duration-300 ${infoCardClass}`}>
              
              {/* About Us section */}
              <div>
                <h3 className="text-lg font-bold border-b border-border/30 pb-2 mb-3.5 flex items-center gap-2">
                  <Info className="size-5" style={{ color: business.primary_color }} />
                  Sobre Nosotros
                </h3>
                <p className="text-sm leading-relaxed opacity-90 whitespace-pre-line">
                  {business.description || `Bienvenido a ${business.name}. Estamos para servirte con la mejor calidad.`}
                </p>
              </div>

              {/* Schedule and Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Schedule Card */}
                {business.schedule && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider opacity-75 flex items-center gap-2">
                      <Clock className="size-4" style={{ color: business.primary_color }} />
                      Horarios de Atención
                    </h4>
                    <p className="text-sm bg-secondary/15 p-4 rounded-xl border border-border/10 font-medium">
                      {business.schedule}
                    </p>
                  </div>
                )}

                {/* Contact Links Card */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider opacity-75 flex items-center gap-2">
                    <Phone className="size-4" style={{ color: business.primary_color }} />
                    Datos de Contacto
                  </h4>
                  <div className="space-y-2 bg-secondary/15 p-4 rounded-xl border border-border/10">
                    {business.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="size-4 text-muted-foreground" />
                        <a href={`tel:${business.phone}`} className="hover:text-primary transition-colors font-medium">
                          {business.phone}
                        </a>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="size-4 text-muted-foreground" />
                        <a href={`mailto:${business.email}`} className="hover:text-primary transition-colors font-medium break-all">
                          {business.email}
                        </a>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="size-4 text-muted-foreground" />
                        <a href={business.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors font-medium break-all">
                          {business.website.replace("https://", "").replace("http://", "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Map & Location section */}
              {business.address && (
                <div className="pt-4 border-t border-border/30">
                  <h3 className="text-lg font-bold pb-2 mb-3.5 flex items-center gap-2">
                    <MapPin className="size-5" style={{ color: business.primary_color }} />
                    Nuestra Ubicación
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-sm opacity-90 flex items-center gap-1.5">
                      <MapPin className="size-4 text-muted-foreground shrink-0" />
                      <span>{business.address}{business.city ? `, ${business.city}` : ''}{business.country ? `, ${business.country}` : ''}</span>
                    </p>

                    {/* Interactive Google Map Mock / iframe */}
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-border/30 bg-muted/20 shadow-inner flex items-center justify-center">
                      {/* We embed a real dynamic openstreetmap or google maps search iframe safely */}
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address + ", " + business.city + ", " + business.country)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="grayscale-[20%] opacity-85 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address + ", " + business.city + ", " + business.country)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md transition-transform hover:scale-105 active:scale-95 border-0"
                        style={{ backgroundColor: business.primary_color }}
                      >
                        <ExternalLink className="size-4" />
                        Abrir en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Extended Social links in info */}
              <div className="pt-4 border-t border-border/30 flex flex-col items-center gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-75">Siguenos en Redes Sociales</h4>
                <div className="flex items-center gap-3">
                  {business.socials?.instagram && (
                    <a href={`https://instagram.com/${business.socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className={linkIconClass}>
                      <Camera className="size-4.5" />
                    </a>
                  )}
                  {business.socials?.facebook && (
                    <a href={`https://facebook.com/${business.socials.facebook}`} target="_blank" rel="noreferrer" className={linkIconClass}>
                      <Hash className="size-4.5" />
                    </a>
                  )}
                  {business.socials?.twitter && (
                    <a href={`https://twitter.com/${business.socials.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className={linkIconClass}>
                      <AtSign className="size-4.5" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer water-mark link */}
      <footer className="mt-20 pb-8 text-center">
        <Link 
          href="/" 
          target="_blank" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-all duration-300 border-0 decoration-none"
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
