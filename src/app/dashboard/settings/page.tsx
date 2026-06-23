"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Settings,
  User,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Trash2,
  Mail,
  Globe,
  Crown,
  Loader2,
  Check,
} from "lucide-react"

const RESERVED_SLUGS = [
  "dashboard",
  "login",
  "register",
  "auth",
  "api",
  "blog",
  "admin",
  "settings",
  "reset-password",
  "terms",
  "privacy",
  "pricing",
  "wootienda",
  "www",
  "app",
  "help",
  "support",
]

export default function SettingsPage() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isSavingSlug, setIsSavingSlug] = useState(false)

  // User auth details
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")

  // Password fields
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Business / Plan details
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState("free")
  const [slug, setSlug] = useState("")
  const [originalSlug, setOriginalSlug] = useState("")

  // Load auth details & business plan
  useEffect(() => {
    async function loadSettings() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setEmail(user.email || "")
          setFullName(user.user_metadata?.full_name || "")

          const { data: business } = await supabase
            .from("businesses")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()

          if (business) {
            setBusinessId(business.id)
            setCurrentPlan(business.plan || "free")
            setSlug(business.slug || "")
            setOriginalSlug(business.slug || "")
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [supabase])

  // Profile Save Action
  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Ingresa tu nombre")
      return
    }

    setIsSavingProfile(true)
    try {
      // 1. Update Supabase Auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })
      if (authError) throw authError

      // 2. Update business name to keep in sync
      if (businessId) {
        const { error: bizError } = await supabase
          .from("businesses")
          .update({ business_name: fullName.trim() })
          .eq("id", businessId)
        if (bizError) throw bizError
      }

      toast.success("Perfil actualizado correctamente")
    } catch (err: any) {
      console.error("Error updating profile:", err)
      toast.error(`Error al guardar perfil: ${err.message || "Intenta de nuevo."}`)
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Password Update Action
  const handleChangePassword = async () => {
    if (!newPassword) {
      toast.error("Ingresa la nueva contraseña")
      return
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    setIsChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setNewPassword("")
      setConfirmPassword("")
      toast.success("Contraseña actualizada con éxito")
    } catch (err: any) {
      console.error("Error changing password:", err)
      toast.error(`Error al cambiar contraseña: ${err.message || "Intenta de nuevo."}`)
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Slug/URL Update Action
  const handleSaveSlug = async () => {
    const cleanSlug = slug.trim().toLowerCase()
    if (!cleanSlug) {
      toast.error("El slug no puede estar vacío")
      return
    }

    if (cleanSlug.length < 3) {
      toast.error("El slug debe tener al menos 3 caracteres")
      return
    }

    if (RESERVED_SLUGS.includes(cleanSlug)) {
      toast.error("Esta palabra está reservada para el sistema")
      return
    }

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(cleanSlug)) {
      toast.error("El slug solo puede contener letras minúsculas, números y guiones (sin empezar ni terminar en guion)")
      return
    }

    setIsSavingSlug(true)
    try {
      // Check duplicate
      const { data: duplicate } = await supabase
        .from("businesses")
        .select("id")
        .eq("slug", cleanSlug)
        .neq("id", businessId)
        .maybeSingle()

      if (duplicate) {
        toast.error("Esta dirección ya está en uso por otro negocio")
        return
      }

      // Update in DB
      const { error } = await supabase
        .from("businesses")
        .update({ slug: cleanSlug })
        .eq("id", businessId)

      if (error) throw error

      setOriginalSlug(cleanSlug)
      toast.success("Dirección de tu tienda actualizada correctamente", {
        description: "El enlace 'Ver mi landing' del sidebar ahora apunta a tu nueva URL."
      })
      
      // Reload page to refresh layouts / sidebars / links
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      console.error("Error updating slug:", err)
      toast.error(`Error al actualizar la dirección: ${err.message || "Intenta de nuevo."}`)
    } finally {
      setIsSavingSlug(false)
    }
  }

  // Plan Demo Toggle (WOW Factor!)
  const handleSwitchPlan = async (planType: string) => {
    if (!businessId) {
      toast.error("No se encontró el ID de tu negocio")
      return
    }

    setIsUpgrading(true)
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ plan: planType })
        .eq("id", businessId)

      if (error) throw error

      setCurrentPlan(planType)
      toast.success(`¡Plan cambiado a ${planType.toUpperCase()} con éxito (Simulación Demo)!`, {
        description: "Todo el dashboard y apariencia se han adaptado automáticamente."
      })
    } catch (err: any) {
      console.error("Error changing plan:", err)
      toast.error("Error al actualizar el plan")
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="size-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        </div>
        <p className="text-muted-foreground ml-9">
          Administra tu cuenta, contraseñas y simula planes premium
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando configuración...</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-6">
          {/* Current plan Sandbox Switcher */}
          <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 rounded-2xl border border-primary/10 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Plan activo
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    {currentPlan}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Simula o actualiza tu plan en tiempo real para probar características PRO.
                </p>
              </div>

              {/* Demo selector buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {["free", "pro", "business"].map((p) => {
                  const isActive = currentPlan === p
                  return (
                    <button
                      key={p}
                      onClick={() => handleSwitchPlan(p)}
                      disabled={isUpgrading}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm scale-95"
                          : "bg-card text-muted-foreground border-border hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      {isActive && <Check className="size-3" />}
                      {!isActive && p === "pro" && <Crown className="size-3 text-amber-500" />}
                      {!isActive && p === "business" && <Crown className="size-3 text-violet-500" />}
                      Plan {p}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Profile section */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <User className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Perfil del Administrador</h2>
                <p className="text-sm text-muted-foreground">
                  Información personal y de contacto asociada a la cuenta
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Nombre completo</Label>
                <Input
                  id="profile-name"
                  placeholder="Tu nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email de la cuenta</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="profile-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-border/40">
              <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="min-w-[150px]">
                {isSavingProfile && <Loader2 className="size-4 animate-spin" />}
                {isSavingProfile ? "Guardando..." : "Guardar perfil"}
              </Button>
            </div>
          </div>

          {/* Slug URL configuration section */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                <Globe className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Dirección Web de tu Negocio (URL)</h2>
                <p className="text-sm text-muted-foreground">
                  Elige la dirección URL única (slug) para tu landing page pública
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-slug">Subdominio / Slug de URL</Label>
                <div className="flex rounded-xl overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all duration-200">
                  <span className="bg-secondary px-3.5 py-2.5 text-sm text-muted-foreground flex items-center border-r border-border font-medium select-none">
                    wootienda.com/
                  </span>
                  <input
                    id="business-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none"
                    placeholder="mi-negocio"
                  />
                </div>
                {slug !== originalSlug && (
                  <p className="text-xs text-muted-foreground">
                    Tu nueva URL será: <span className="font-semibold text-foreground">wootienda.com/{slug || "mi-negocio"}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-border/40">
              <Button 
                onClick={handleSaveSlug} 
                disabled={isSavingSlug || slug === originalSlug || !slug}
                className="min-w-[150px]"
              >
                {isSavingSlug && <Loader2 className="size-4 animate-spin" />}
                {isSavingSlug ? "Guardando..." : "Actualizar dirección"}
              </Button>
            </div>
          </div>

          {/* Password section */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Lock className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Cambiar Contraseña</h2>
                <p className="text-sm text-muted-foreground">
                  Actualiza tus datos de seguridad de acceso
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-border/40">
              <Button onClick={handleChangePassword} disabled={isChangingPassword} className="min-w-[170px]">
                {isChangingPassword && <Loader2 className="size-4 animate-spin" />}
                {isChangingPassword ? "Actualizando..." : "Cambiar contraseña"}
              </Button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-card rounded-2xl border border-destructive/20 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                <Shield className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Zona de Peligro</h2>
                <p className="text-sm text-muted-foreground">
                  Acciones destructivas e irreversibles de la cuenta
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 gap-4">
              <div>
                <p className="text-sm font-semibold">Eliminar cuenta y negocio</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Se eliminará permanentemente tu negocio, productos, enlaces y todos los datos asociados sin posibilidad de recuperación.
                </p>
              </div>
              <Button variant="destructive" size="sm" className="shrink-0" onClick={() => toast.error("Función desactivada para demostraciones.")}>
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
