import { Button } from "@/components/ui/button"
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
} from "lucide-react"

export const metadata = {
  title: "Apariencia",
}

const freeThemes = [
  {
    id: "default",
    name: "Profesional",
    description: "Limpio y moderno con overlay de gradiente",
  },
  {
    id: "clean",
    name: "Minimalista",
    description: "Mucho espacio blanco, tipografía elegante",
  },
  {
    id: "minimal",
    name: "Ultra Simple",
    description: "Sin efectos, directo al contenido",
  },
]

const proThemes = [
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Efecto cristal con blur premium",
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Futurista y oscuro con brillos",
  },
  {
    id: "gradient-mesh",
    name: "Gradient Mesh",
    description: "Gradientes fluidos y animados",
  },
  {
    id: "dark-luxury",
    name: "Dark Luxury",
    description: "Premium oscuro con acentos dorados",
  },
  {
    id: "vibrant",
    name: "Vibrante",
    description: "Colores vivos y energéticos",
  },
  {
    id: "storefront",
    name: "Storefront",
    description: "Estilo e-commerce profesional",
  },
]

export default function AppearancePage() {
  const currentTheme = "default"

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
            Personaliza el estilo y diseño de tu landing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="size-4" />
            Vista previa
          </Button>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button className="p-2 bg-secondary text-foreground transition-colors">
              <Monitor className="size-4" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Smartphone className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
            <ImagePlus className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Banner / Imagen de portada</h2>
            <p className="text-sm text-muted-foreground">
              Imagen de cabecera de tu landing (1200×400 px recomendado)
            </p>
          </div>
        </div>

        <div className="relative aspect-[3/1] rounded-xl border-2 border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
          <div className="w-14 h-14 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
            <ImagePlus className="size-7" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              Haz clic o arrastra una imagen
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG o WebP. Máx 5MB.
            </p>
          </div>
        </div>
      </section>

      {/* Color Section */}
      <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Paintbrush className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Color primario</h2>
            <p className="text-sm text-muted-foreground">
              Color principal de tu landing (botones, links, acentos)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { color: "#EE1D6D", name: "Rosa" },
            { color: "#3B82F6", name: "Azul" },
            { color: "#10B981", name: "Verde" },
            { color: "#F59E0B", name: "Ámbar" },
            { color: "#8B5CF6", name: "Violeta" },
            { color: "#EF4444", name: "Rojo" },
            { color: "#06B6D4", name: "Cian" },
            { color: "#2A2A2A", name: "Grafito" },
          ].map((item) => (
            <button
              key={item.color}
              className="group flex flex-col items-center gap-1.5"
              title={item.name}
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground/20 transition-all duration-200 flex items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                {item.color === "#EE1D6D" && (
                  <Check className="size-4 text-white" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50">
          <span className="text-sm font-medium">Modo:</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-foreground transition-colors">
              <Sun className="size-4" />
              Claro
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Moon className="size-4" />
              Oscuro
            </button>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Layers className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tema de tu landing</h2>
            <p className="text-sm text-muted-foreground">
              Elige un diseño base para tu página pública
            </p>
          </div>
        </div>

        {/* Free themes */}
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Temas gratuitos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {freeThemes.map((theme) => (
            <button
              key={theme.id}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                currentTheme === theme.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{theme.name}</span>
                {currentTheme === theme.id && (
                  <Check className="size-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {theme.description}
              </p>
            </button>
          ))}
        </div>

        {/* Pro themes */}
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          Temas PRO
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600">
            <Crown className="size-3" />
            PRO
          </span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {proThemes.map((theme) => (
            <button
              key={theme.id}
              className="text-left p-4 rounded-xl border-2 border-border hover:border-amber-500/30 transition-all duration-200 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{theme.name}</span>
                <Lock className="size-3.5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {theme.description}
              </p>
              {/* Locked overlay */}
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <Crown className="size-3" />
                  Desbloquear con PRO
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
            <Type className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tipografía</h2>
            <p className="text-sm text-muted-foreground">
              Elige la fuente para los títulos de tu landing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "default", name: "Plus Jakarta Sans", preview: "Aa Bb Cc" },
            { id: "inter", name: "Inter", preview: "Aa Bb Cc" },
            { id: "outfit", name: "Outfit", preview: "Aa Bb Cc" },
          ].map((font) => (
            <button
              key={font.id}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                font.id === "default"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="text-2xl font-bold mb-1">{font.preview}</p>
              <span className="text-xs text-muted-foreground">{font.name}</span>
              {font.id === "default" && (
                <Check className="size-4 text-primary mt-1" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Save bar */}
      <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          Los cambios se reflejan en tu landing pública al guardar
        </div>
        <Button size="lg">Guardar cambios</Button>
      </div>
    </>
  )
}
