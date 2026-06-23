"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Palette,
  Eye,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Lock,
  Crown,
  ImagePlus,
  Type,
  Layers,
  Paintbrush,
  Check,
  Sparkles,
  Loader2,
  X,
} from "lucide-react"
import Image from "next/image"

const PRESET_BANNERS = [
  { url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800", label: "Cafetería Rústica" },
  { url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800", label: "Café Minimalista" },
  { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800", label: "Panadería Tueste" },
  { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800", label: "Tienda Moderna" }
]

const PRESET_LOGOS = [
  { url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=150", label: "Café Logo" },
  { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=150", label: "Pan Logo" },
  { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=150", label: "Gradiente Logo" }
]

const freeThemes = [
  {
    id: "claro",
    name: "Claro Profesional",
    description: "Diseño limpio y moderno con fondo blanco, ideal para cualquier tienda",
  },
  {
    id: "oscuro",
    name: "Oscuro Premium",
    description: "Fondo oscuro elegante con alto contraste, ideal para marcas exclusivas",
  },
]

const proThemes = [
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Efecto cristal con blur y sombras premium",
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Estilo nocturno futurista con resplandor neón",
  },
  {
    id: "gradient-mesh",
    name: "Gradient Mesh",
    description: "Fondos con degradados fluidos e interactivos",
  },
]

export default function AppearancePage() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState("free")
  
  // State variables mapped to DB
  const [bannerUrl, setBannerUrl] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#EE1D6D")
  const [theme, setTheme] = useState("claro")
  const [typography, setTypography] = useState("default")
  
  // Upgrade Modal
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [selectedProTheme, setSelectedProTheme] = useState("")

  // Load business appearance
  useEffect(() => {
    async function loadAppearance() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: business } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (business) {
          setBusinessId(business.id)
          setUserPlan(business.plan || "free")
          setBannerUrl(business.banner_url || "")
          setLogoUrl(business.logo_url || "")
          setPrimaryColor(business.primary_color || "#EE1D6D")
          setTheme(business.theme || "claro")
          setTypography(business.typography || "default")
        }
      } catch (err) {
        console.error("Error loading appearance data:", err)
        toast.error("Error al cargar la configuración de apariencia")
      } finally {
        setIsLoading(false)
      }
    }
    loadAppearance()
  }, [supabase])

  const handleSave = async () => {
    if (!businessId) {
      toast.error("No se encontró el ID de tu negocio")
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("businesses")
        .update({
          banner_url: bannerUrl.trim() || null,
          logo_url: logoUrl.trim() || null,
          primary_color: primaryColor,
          theme: theme,
          typography: typography,
        })
        .eq("id", businessId)

      if (error) throw error

      toast.success("Apariencia guardada correctamente. ¡Revisa tu landing!")
    } catch (err: any) {
      console.error("Error saving appearance:", err)
      toast.error(`Error al guardar: ${err.message || "Intenta de nuevo."}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleThemeClick = (themeId: string, isPro: boolean) => {
    if (isPro && userPlan === "free") {
      setSelectedProTheme(themeId)
      setIsUpgradeOpen(true)
      return
    }
    setTheme(themeId)
  }

  // Simulator upgrade inside modal
  const handleSimulateUpgrade = async () => {
    if (!businessId) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ plan: "pro" })
        .eq("id", businessId)

      if (error) throw error
      setUserPlan("pro")
      setTheme(selectedProTheme)
      setIsUpgradeOpen(false)
      toast.success("¡Plan actualizado a PRO con éxito! Ahora tienes acceso a todos los temas.")
    } catch (err) {
      toast.error("Error al simular la actualización")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Palette className="size-6 text-violet-600" />
            <h1 className="text-3xl font-bold tracking-tight">Apariencia</h1>
          </div>
          <p className="text-muted-foreground ml-9">
            Personaliza el estilo y diseño de tu landing page pública
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando personalizador...</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-6">
          {/* Logo and Banner Section */}
          <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                <ImagePlus className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Portada e Identidad Visual</h2>
                <p className="text-sm text-muted-foreground">
                  Personaliza el banner de cabecera y el logo flotante de tu landing
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Banner input */}
              <div className="space-y-3">
                <Label htmlFor="banner-input">URL de la Imagen de Portada (Banner)</Label>
                <Input
                  id="banner-input"
                  placeholder="https://images.unsplash.com/... o cualquier enlace directo"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                />
                
                {/* Banner presets */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Selecciona un fondo rápido para tu portada:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_BANNERS.map((banner) => (
                      <button
                        type="button"
                        key={banner.url}
                        onClick={() => setBannerUrl(banner.url)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          bannerUrl === banner.url ? "border-primary scale-95" : "border-transparent opacity-85 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={banner.url}
                          alt={banner.label}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logo input */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <Label htmlFor="logo-input">URL del Logo del Negocio</Label>
                <Input
                  id="logo-input"
                  placeholder="https://images.unsplash.com/... o cualquier enlace directo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />

                {/* Logo presets */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Selecciona un icono flotante rápido:</p>
                  <div className="flex gap-3">
                    {PRESET_LOGOS.map((logo) => (
                      <button
                        type="button"
                        key={logo.url}
                        onClick={() => setLogoUrl(logo.url)}
                        className={`relative size-12 rounded-full overflow-hidden border-2 transition-all ${
                          logoUrl === logo.url ? "border-primary scale-90" : "border-transparent opacity-85 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={logo.url}
                          alt={logo.label}
                          fill
                          className="object-cover"
                          sizes="50px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Color Section */}
          <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Paintbrush className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Color de Acento Primario</h2>
                <p className="text-sm text-muted-foreground">
                  El color de los botones principales, enlaces y destacados de tu landing
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { color: "#EE1D6D", name: "Rosa Wootienda" },
                { color: "#3B82F6", name: "Azul Eléctrico" },
                { color: "#10B981", name: "Verde Esmeralda" },
                { color: "#F59E0B", name: "Ámbar Cálido" },
                { color: "#8B5CF6", name: "Violeta Místico" },
                { color: "#EF4444", name: "Rojo Pasión" },
                { color: "#06B6D4", name: "Cian Fresco" },
                { color: "#171717", name: "Negro Elegante" },
              ].map((item) => (
                <button
                  key={item.color}
                  onClick={() => setPrimaryColor(item.color)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none group"
                  title={item.name}
                >
                  <div
                    className="size-11 rounded-full border-2 hover:scale-105 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                    style={{ 
                      backgroundColor: item.color,
                      borderColor: primaryColor === item.color ? "rgba(0,0,0,0.3)" : "transparent"
                    }}
                  >
                    {primaryColor === item.color && (
                      <Check className="size-5 text-white mix-blend-difference" />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom color picker */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/40">
              <Label htmlFor="custom-color-picker" className="text-sm font-semibold">Personalizar código de color hexadecimal:</Label>
              <div className="flex items-center gap-2">
                <input
                  id="custom-color-picker"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="size-8 rounded-lg cursor-pointer border border-border"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-28 h-8 font-mono text-sm uppercase"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </section>

          {/* Themes Section */}
          <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Layers className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Tema y Estilo de la Landing</h2>
                <p className="text-sm text-muted-foreground">
                  Elige la atmósfera y esquema de colores base que vestirá tu catálogo público
                </p>
              </div>
            </div>

            {/* Free themes */}
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Temas Gratuitos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {freeThemes.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => handleThemeClick(t.id, false)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    theme === t.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {t.id === "claro" ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-violet-500" />}
                      <span className="text-sm font-bold text-foreground">{t.name}</span>
                    </div>
                    {theme === t.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Pro themes */}
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              Temas PRO Exclusivos
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm">
                <Crown className="size-2.5" />
                PRO
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {proThemes.map((t) => {
                const isSelected = theme === t.id
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => handleThemeClick(t.id, true)}
                    className={`text-left p-4 rounded-xl border-2 relative overflow-hidden group transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/5 shadow-sm"
                        : "border-border hover:border-amber-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-foreground">{t.name}</span>
                      {userPlan === "free" && <Lock className="size-3.5 text-muted-foreground" />}
                      {userPlan !== "free" && isSelected && <Check className="size-4 text-amber-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>

                    {/* Lock overlay for free plans on hover */}
                    {userPlan === "free" && (
                      <div className="absolute inset-0 bg-background/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm">
                          <Crown className="size-3" />
                          Desbloquear con PRO
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Typography */}
          <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <Type className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Tipografía</h2>
                <p className="text-sm text-muted-foreground">
                  Elige la fuente de texto y títulos para tu landing page
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "default", name: "Plus Jakarta Sans", preview: "Aa Bb" },
                { id: "inter", name: "Inter", preview: "Aa Bb" },
                { id: "outfit", name: "Outfit", preview: "Aa Bb" },
              ].map((font) => {
                const isSelected = typography === font.id
                return (
                  <button
                    type="button"
                    key={font.id}
                    onClick={() => setTypography(font.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="text-2xl font-bold mb-1">{font.preview}</p>
                    <span className="text-xs text-muted-foreground">{font.name}</span>
                    {isSelected && (
                      <Check className="size-4 text-primary mt-1" />
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Action Save Bar */}
          <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary animate-pulse" />
              Los cambios se reflejarán instantáneamente en tu landing.
            </div>
            <Button size="lg" onClick={handleSave} disabled={isSaving} className="min-w-[160px]">
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      )}

      {/* Upgrade PRO Modal */}
      {isUpgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 flex flex-col items-center text-center animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <Crown className="size-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Desbloquea Wootienda PRO</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              El tema que has seleccionado es exclusivo para usuarios con planes premium. Actualiza hoy y accede a todos los estilos ilimitados, integraciones y dominio propio.
            </p>
            
            <div className="w-full space-y-3">
              <Button onClick={handleSimulateUpgrade} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold">
                Activar Plan PRO (Demo instantánea)
              </Button>
              <Button variant="outline" onClick={() => setIsUpgradeOpen(false)} className="w-full">
                Seguir con Plan Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
