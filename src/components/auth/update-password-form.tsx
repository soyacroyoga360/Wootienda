"use client"

import { useState, useEffect } from "react"
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
import { Lock, Loader2, ArrowLeft, KeyRound } from "lucide-react"

const updatePasswordSchema = z
  .object({
    password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>

export function UpdatePasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [sessionActive, setSessionActive] = useState<boolean | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
  })

  // Verificar que el usuario tenga una sesión válida (exchanged by the recovery link)
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setSessionActive(false)
        toast.error("Acceso denegado", {
          description: "No tienes una sesión de recuperación válida. Solicita un nuevo enlace.",
        })
      } else {
        setSessionActive(true)
      }
    }
    checkSession()
  }, [supabase])

  async function onSubmit(data: UpdatePasswordForm) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        toast.error("Error al actualizar contraseña", {
          description: error.message,
        })
        return
      }

      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido actualizada con éxito. Iniciando sesión...",
      })

      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (sessionActive === false) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-6">
          <Lock className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Enlace Inválido o Expirado
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Tu enlace de recuperación ha expirado o no es válido. Por favor, solicita un nuevo enlace desde la pantalla de recuperación.
        </p>
        <Button variant="outline" asChild>
          <Link href="/reset-password">
            <ArrowLeft className="size-4" />
            Recuperar Contraseña
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6">
          <Logo variant="both" size="sm" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Nueva Contraseña
        </h1>
        <p className="text-muted-foreground">
          Ingresa tu nueva contraseña para restablecer tu cuenta
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">Nueva Contraseña</Label>
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
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

        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          disabled={isLoading || sessionActive !== true}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <KeyRound className="size-4" />
          )}
          {isLoading ? "Actualizando contraseña..." : "Restablecer Contraseña"}
        </Button>
      </form>
    </div>
  )
}
