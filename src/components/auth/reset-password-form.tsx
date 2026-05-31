"use client"

import { useState } from "react"
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
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react"

const resetSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
})

type ResetForm = z.infer<typeof resetSchema>

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  })

  async function onSubmit(data: ResetForm) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      })

      if (error) {
        toast.error("Error al enviar solicitud", {
          description: error.message,
        })
        return
      }

      setEmailSent(true)
      toast.success("Enlace enviado", {
        description: "Revisa tu email para recuperar tu contraseña.",
      })
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <Mail className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Revisa tu email
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Hemos enviado un enlace de recuperación a tu correo electrónico. Haz clic en el enlace para actualizar tu contraseña.
        </p>
        <Button variant="outline" asChild>
          <Link href="/login">
            <ArrowLeft className="size-4" />
            Volver a Iniciar Sesión
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Volver a Iniciar Sesión
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-6">
          <Logo variant="both" size="sm" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Recuperar Contraseña
        </h1>
        <p className="text-muted-foreground">
          Ingresa tu email para recibir un enlace de recuperación
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {isLoading ? "Enviando enlace..." : "Enviar enlace de recuperación"}
        </Button>
      </form>
    </div>
  )
}
