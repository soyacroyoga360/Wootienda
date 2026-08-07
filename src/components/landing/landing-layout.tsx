"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ProductCatalog } from "./product-catalog"
import type { ReviewData, GoogleRatingData } from "./reviews-section"
import {
  MapPin,
  Globe,
  Clock,
  Phone,
  Mail,
  Info,
  ExternalLink,
  Star,
} from "lucide-react"

// lucide-react no longer ships brand/social logos — inlined as plain SVGs.
function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  )
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

export interface BusinessDetails {
  id: string
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
    youtube?: string
    telegram?: string
  }
  theme: string
  typography: string
  primary_color: string
  category: string
  products: Product[]
  reviews: ReviewData[]
  googleRating: GoogleRatingData | null
}

interface LandingLayoutProps {
  business: BusinessDetails
}

/**
 * Tokens por tema. Todo el layout nuevo se pinta con estos valores en vez de
 * cadenas de clases por tema — así agregar un tema es agregar un objeto.
 *
 * fade      -> color sólido al que se funde el banner (evita el corte duro)
 * onBanner  -> si la identidad va encima de la foto (temas oscuros) o debajo
 */
type ThemeTokens = {
  bg: string
  fade: string
  text: string
  muted: string
  border: string
  chipBg: string
  chipText: string
  ctaBg: string
  ctaText: string
  onBanner: boolean
  surface: string
}

function getThemeTokens(theme: string, primary: string): ThemeTokens {
  switch (theme) {
    case "oscuro":
      return {
        bg: "#0d0d0e",
        fade: "#0d0d0e",
        text: "#ffffff",
        muted: "rgba(255,255,255,.68)",
        border: "rgba(255,255,255,.10)",
        chipBg: "rgba(0,0,0,.5)",
        chipText: primary,
        ctaBg: primary,
        ctaText: "#ffffff",
        onBanner: true,
        surface: "rgba(255,255,255,.04)",
      }
    case "glassmorphism":
      return {
        bg: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 55%,#311042 100%)",
        fade: "#1b1340",
        text: "#ffffff",
        muted: "rgba(255,255,255,.72)",
        border: "rgba(255,255,255,.15)",
        chipBg: "rgba(255,255,255,.12)",
        chipText: "#ffffff",
        ctaBg: primary,
        ctaText: "#ffffff",
        onBanner: true,
        surface: "rgba(255,255,255,.08)",
      }
    case "neon-glow":
      return {
        bg: "#030303",
        fade: "#030303",
        text: "#ffffff",
        muted: "rgba(255,255,255,.62)",
        border: `${primary}33`,
        chipBg: "rgba(0,0,0,.6)",
        chipText: primary,
        ctaBg: primary,
        ctaText: "#ffffff",
        onBanner: true,
        surface: "#09090b",
      }
    case "gradient-mesh":
      return {
        bg: "linear-gradient(160deg,#eef2ff 0%,#f5ecff 55%,#fdeaf4 100%)",
        fade: "#f6effc",
        text: "#1b1626",
        muted: "#655d75",
        border: "#e6dcf2",
        chipBg: "rgba(255,255,255,.92)",
        chipText: "#1b1626",
        ctaBg: "#1b1626",
        ctaText: "#ffffff",
        onBanner: false,
        surface: "rgba(255,255,255,.65)",
      }
    default: // claro
      return {
        bg: "#fbf9f6",
        fade: "#fbf9f6",
        text: "#1b1917",
        muted: "#6f6862",
        border: "#e7e2db",
        chipBg: "rgba(251,249,246,.92)",
        chipText: "#1b1917",
        ctaBg: "#1b1917",
        ctaText: "#fbf9f6",
        onBanner: false,
        surface: "#f3efe9",
      }
  }
}

function hexToRgb(hex: string): string {
  let clean = hex.replace("#", "")
  if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("")
  if (clean.length !== 6) return "238, 29, 109"
  return `${parseInt(clean.slice(0, 2), 16)}, ${parseInt(clean.slice(2, 4), 16)}, ${parseInt(clean.slice(4, 6), 16)}`
}

function socialHref(value: string, base: string) {
  if (!value) return ""
  return value.startsWith("http") ? value : `${base}${value.replace("@", "")}`
}

export function LandingLayout({ business }: LandingLayoutProps) {
  const [view, setView] = useState<"portal" | "catalog" | "info">("portal")

  const T = getThemeTokens(business.theme, business.primary_color)

  // Prefer the real Google rating when the business has a Business Profile
  // linked; otherwise fall back to reviews left directly on the landing.
  // No placeholder — if neither exists yet, the badge just doesn't render.
  const nativeAvg =
    business.reviews.length > 0
      ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length
      : 0
  const hasRating = Boolean(business.googleRating) || business.reviews.length > 0
  const displayRating = business.googleRating?.rating ?? nativeAvg
  const displayCount = business.googleRating?.userRatingCount ?? business.reviews.length

  // The rating badge always links out to the real Google Business Profile —
  // the linked place if there is one, otherwise a Maps search by name/location
  // so people can still find and review the real listing.
  const googleProfileUrl =
    business.googleRating?.googleMapsUri ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      [business.name, business.city, business.country].filter(Boolean).join(", ")
    )}`

  const fontFamily =
    business.typography === "inter"
      ? "var(--font-inter), system-ui, sans-serif"
      : business.typography === "outfit"
      ? "var(--font-outfit), system-ui, sans-serif"
      : "var(--font-plus-jakarta), system-ui, sans-serif"

  const rootStyle = {
    "--user-primary": business.primary_color,
    "--user-primary-rgb": hexToRgb(business.primary_color),
    fontFamily,
  } as React.CSSProperties

  const isFoodType = business.category === "restaurant"
  const mainTabLabel = isFoodType ? "Menú" : "Servicios"

  const locationLabel = [business.city, business.country].filter(Boolean).join(", ")

  /* ---------------------------------------------------------------- PORTAL */
  if (view === "portal") {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-between py-12 px-4 select-none overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${business.banner_url})`, fontFamily }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-8 my-auto">
          <div
            className="w-28 h-28 md:w-32 md:h-32 rounded-full shadow-2xl border-4 overflow-hidden relative bg-black/30 backdrop-blur-sm flex items-center justify-center"
            style={{ borderColor: business.primary_color }}
          >
            {business.logo_url ? (
              <Image src={business.logo_url} alt={`Logo de ${business.name}`} fill className="object-cover" />
            ) : (
              <span className="font-extrabold text-white text-4xl uppercase">{business.name.substring(0, 2)}</span>
            )}
          </div>

          <div className="space-y-3 px-2">
            <h1
              className="text-4xl md:text-5xl text-white leading-none"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              {business.name}
            </h1>
            {business.description && (
              <p className="text-sm md:text-base text-white/80 max-w-xs mx-auto leading-relaxed">
                {business.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3.5 w-full items-center">
            <button
              onClick={() => setView("catalog")}
              className="w-64 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 cursor-pointer border-0"
              style={{ backgroundColor: business.primary_color, color: "#fff" }}
            >
              {mainTabLabel}
            </button>
            <button
              onClick={() => setView("info")}
              className="w-64 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-transparent border border-white/50 hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Información
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4 flex-wrap justify-center">
            {business.socials?.facebook && (
              <a href={socialHref(business.socials.facebook, "https://facebook.com/")} target="_blank" rel="noreferrer" className="size-10 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all hover:scale-110">
                <IconFacebook className="size-4" />
              </a>
            )}
            {business.socials?.instagram && (
              <a href={socialHref(business.socials.instagram, "https://instagram.com/")} target="_blank" rel="noreferrer" className="size-10 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all hover:scale-110">
                <IconInstagram className="size-4" />
              </a>
            )}
            {business.socials?.youtube && (
              <a href={socialHref(business.socials.youtube, "https://youtube.com/")} target="_blank" rel="noreferrer" className="size-10 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all hover:scale-110">
                <IconYoutube className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-xs">
          {hasRating && (
            <a
              href={googleProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <div className="size-7 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-bold text-white tracking-wide">
                  {displayCount} reseña{displayCount === 1 ? "" : "s"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-extrabold text-white">{displayRating.toFixed(1)}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`size-3 ${s <= Math.round(displayRating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-white/30"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </a>
          )}

          <Link href="/" target="_blank" className="text-xs text-white/70 hover:text-white transition-colors">
            ¿Quieres tu Menú <span className="font-bold underline">Wootienda</span>? Clic Aquí
          </Link>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------ CATÁLOGO / INFO */

  const identityBlock = (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <div
          className="w-13 h-13 md:w-14 md:h-14 shrink-0 rounded-full overflow-hidden relative"
          style={{ border: `2px solid ${T.onBanner ? "rgba(255,255,255,.25)" : T.fade}`, width: 54, height: 54, boxShadow: T.onBanner ? "none" : "0 6px 18px rgba(0,0,0,.14)" }}
        >
          {business.logo_url ? (
            <Image src={business.logo_url} alt={`Logo de ${business.name}`} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-lg uppercase" style={{ background: T.surface, color: T.text }}>
              {business.name.substring(0, 2)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          {locationLabel && (
            <span className="text-[10px] font-bold uppercase tracking-[.18em] truncate" style={{ color: business.primary_color }}>
              {locationLabel}
            </span>
          )}
          <h1
            className="text-[34px] md:text-[42px] leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display), Georgia, serif", color: T.onBanner ? "#fff" : T.text }}
          >
            {business.name}
          </h1>
        </div>
      </div>
      {business.description && (
        <p
          className="text-sm leading-relaxed max-w-md"
          style={{ color: T.onBanner ? "rgba(255,255,255,.75)" : T.muted, textWrap: "pretty" as never }}
        >
          {business.description}
        </p>
      )}
    </div>
  )

  const iconBtn =
    "w-11 h-11 rounded-2xl flex items-center justify-center transition-transform hover:-translate-y-0.5"
  const iconBtnStyle = { border: `1px solid ${T.border}`, color: T.text }

  return (
    <div className="min-h-screen" style={{ ...rootStyle, background: T.bg, color: T.text }}>
      {/* 1. Banner que se funde con la página */}
      <div className="relative w-full h-[280px] md:h-[380px]">
        {business.banner_url ? (
          <Image src={business.banner_url} alt={`Banner de ${business.name}`} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0" style={{ background: T.surface }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: T.onBanner
              ? `linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.45) 45%, ${T.fade} 100%)`
              : `linear-gradient(180deg, rgba(0,0,0,0) 45%, ${T.fade}d9 82%, ${T.fade} 100%)`,
          }}
        />
        {T.onBanner && (
          <div className="absolute left-0 right-0 bottom-5 px-6 md:px-8 max-w-3xl mx-auto w-full">{identityBlock}</div>
        )}
      </div>

      <main className="max-w-3xl mx-auto w-full px-6 md:px-8">
        {!T.onBanner && <div className="-mt-14 relative z-10">{identityBlock}</div>}

        {/* 2. Contacto directo */}
        <div className="flex gap-2.5 pt-5">
          {business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl text-[13px] font-bold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: T.ctaBg, color: T.ctaText }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Z" />
              </svg>
              WhatsApp
            </a>
          )}
          {business.address && (
            <button onClick={() => setView("info")} className={iconBtn} style={iconBtnStyle} aria-label="Ubicación">
              <MapPin className="size-[17px]" strokeWidth={1.8} />
            </button>
          )}
          {business.socials?.instagram && (
            <a href={socialHref(business.socials.instagram, "https://instagram.com/")} target="_blank" rel="noreferrer" className={iconBtn} style={iconBtnStyle} aria-label="Instagram">
              <IconInstagram className="size-[17px]" />
            </a>
          )}
          {business.socials?.facebook && (
            <a href={socialHref(business.socials.facebook, "https://facebook.com/")} target="_blank" rel="noreferrer" className={iconBtn} style={iconBtnStyle} aria-label="Facebook">
              <IconFacebook className="size-[17px]" />
            </a>
          )}
        </div>

        {/* 3. Pestañas subrayadas */}
        <div className="flex gap-6 pt-7 mt-6" style={{ borderBottom: `1px solid ${T.border}` }}>
          {([
            { id: "catalog", label: mainTabLabel },
            { id: "info", label: "Información" },
            { id: "portal", label: "Inicio" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className="pb-3 text-[13px] transition-colors cursor-pointer bg-transparent border-0"
              style={
                view === tab.id
                  ? { fontWeight: 700, color: T.text, boxShadow: `inset 0 -2px 0 ${business.primary_color}` }
                  : { fontWeight: 500, color: T.muted }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Contenido */}
        {view === "catalog" && (
          <ProductCatalog
            products={business.products}
            primaryColor={business.primary_color}
            whatsapp={business.whatsapp}
            theme={business.theme}
            businessEmail={business.email}
            businessName={business.name}
            bannerUrl={business.banner_url}
            tokens={{ text: T.text, muted: T.muted, border: T.border, fade: T.fade, surface: T.surface, chipBg: T.chipBg, chipText: T.chipText }}
          />
        )}

        {view === "info" && (
          <div className="py-8 space-y-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Info className="size-5" style={{ color: business.primary_color }} />
                Sobre nosotros
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: T.muted }}>
                {business.description || `Bienvenido a ${business.name}.`}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.schedule && (
                <div className="rounded-2xl p-5 space-y-2" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                  <h3 className="text-xs font-bold uppercase tracking-[.12em] flex items-center gap-2" style={{ color: T.muted }}>
                    <Clock className="size-4" style={{ color: business.primary_color }} />
                    Horarios
                  </h3>
                  <p className="text-sm font-medium">{business.schedule}</p>
                </div>
              )}

              <div className="rounded-2xl p-5 space-y-2.5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <h3 className="text-xs font-bold uppercase tracking-[.12em] flex items-center gap-2" style={{ color: T.muted }}>
                  <Phone className="size-4" style={{ color: business.primary_color }} />
                  Contacto
                </h3>
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-2.5 text-sm font-medium">
                    <Phone className="size-4" style={{ color: T.muted }} />
                    {business.phone}
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-2.5 text-sm font-medium break-all">
                    <Mail className="size-4 shrink-0" style={{ color: T.muted }} />
                    {business.email}
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm font-medium break-all">
                    <Globe className="size-4 shrink-0" style={{ color: T.muted }} />
                    {business.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>

            {business.address && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="size-5" style={{ color: business.primary_color }} />
                  Ubicación
                </h2>
                <p className="text-sm" style={{ color: T.muted }}>
                  {[business.address, business.city, business.country].filter(Boolean).join(", ")}
                </p>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    title="Mapa"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      [business.address, business.city, business.country].filter(Boolean).join(", ")
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="grayscale-[20%] opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    [business.address, business.city, business.country].filter(Boolean).join(", ")
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl text-[13px] font-bold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: T.ctaBg, color: T.ctaText }}
                >
                  <ExternalLink className="size-4" />
                  Abrir en Google Maps
                </a>
              </section>
            )}
          </div>
        )}

        <footer className="py-10 text-center">
          <Link href="/" target="_blank" className="text-[11px]" style={{ color: T.muted }}>
            Creado con <strong style={{ color: T.text }}>Wootienda</strong>
          </Link>
        </footer>
      </main>
    </div>
  )
}
