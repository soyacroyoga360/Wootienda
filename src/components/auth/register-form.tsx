"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/shared/logo"
import { toast } from "sonner"
import {
  User,
  AtSign,
  Mail,
  Lock,
  UserPlus,
  Loader2,
  Check,
  X,
  ArrowLeft,
  Globe,
} from "lucide-react"

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(100, "Máximo 100 caracteres"),
    username: z
      .string()
      .min(3, "Mínimo 3 caracteres")
      .max(30, "Máximo 30 caracteres")
      .regex(
        /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
        "Solo letras minúsculas, números y guiones"
      ),
    email: z.string().email("Ingresa un email válido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

// Slugs reservados
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

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "reserved" | "invalid"
  >("idle")
  const [emailSent, setEmailSent] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const username = watch("username")

  // Formatear username → slug en tiempo real
  const formatSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

  // Check slug availability (debounced)
  const checkSlug = useCallback(
    async (slug: string) => {
      if (!slug || slug.length < 3) {
        setSlugStatus("idle")
        return
      }

      const formatted = formatSlug(slug)

      if (RESERVED_SLUGS.includes(formatted)) {
        setSlugStatus("reserved")
        return
      }

      if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(formatted)) {
        setSlugStatus("invalid")
        return
      }

      setSlugStatus("checking")

      try {
        const { data, error } = await supabase
          .from("businesses")
          .select("slug")
          .eq("slug", formatted)
          .maybeSingle()

        if (error) {
          // Table might not exist yet — treat as available
          setSlugStatus("available")
          return
        }

        setSlugStatus(data ? "taken" : "available")
      } catch {
        setSlugStatus("available")
      }
    },
    [supabase]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (username) checkSlug(username)
    }, 500)
    return () => clearTimeout(timeout)
  }, [username, checkSlug])

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: formatSlug(data.username),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error("Error al crear cuenta", {
          description: error.message,
        })
        return
      }

      setEmailSent(true)
      toast.success("¡Cuenta creada!", {
        description: "Revisa tu email para confirmar tu cuenta.",
      })
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Confirmation screen
  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <Mail className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Revisa tu email
        </h2>
        <p className="text-muted-foreground mb-2">
          Hemos enviado un enlace de confirmación a tu correo electrónico.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Tu URL será:{" "}
          <span className="font-semibold text-foreground">
            wootienda.com/{formatSlug(username || "")}
          </span>
        </p>
        <Button variant="outline" asChild>
          <Link href="/login">
            <ArrowLeft className="size-4" />
            Ir a iniciar sesión
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-6">
          <Logo variant="both" size="sm" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Crea tu cuenta
        </h1>
        <p className="text-muted-foreground">
          Registra tu negocio y obtén tu landing en minutos
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Tu nombre"
              className="pl-10"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Username / Slug */}
        <div className="space-y-2">
          <Label htmlFor="username">Username (tu URL)</Label>
          <div className="relative">
            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="username"
              placeholder="mi-negocio"
              className="pl-10 pr-10"
              {...register("username")}
            />
            {/* Status indicator */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {slugStatus === "checking" && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
              {slugStatus === "available" && (
                <Check className="size-4 text-success" />
              )}
              {(slugStatus === "taken" || slugStatus === "reserved") && (
                <X className="size-4 text-destructive" />
              )}
            </div>
          </div>

          {/* Slug preview / status message */}
          <div className="flex items-center gap-2 text-sm">
            {slugStatus === "available" && username && (
              <span className="text-success flex items-center gap-1.5">
                <Globe className="size-3.5" />
                wootienda.com/{formatSlug(username)} — ¡Disponible!
              </span>
            )}
            {slugStatus === "taken" && (
              <span className="text-destructive">
                Este username ya está en uso
              </span>
            )}
            {slugStatus === "reserved" && (
              <span className="text-destructive">
                Este nombre está reservado
              </span>
            )}
            {slugStatus === "idle" && !errors.username && (
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Globe className="size-3.5" />
                Tu URL será: wootienda.com/tu-negocio
              </span>
            )}
          </div>

          {errors.username && (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="pl-10"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              className="pl-10"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          {isLoading ? "Creando cuenta..." : "Crear cuenta gratis"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Al registrarte, aceptas nuestros{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de privacidad
          </Link>
        </p>
      </form>

      {/* Footer */}
      <p className="text-center mt-8 text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
