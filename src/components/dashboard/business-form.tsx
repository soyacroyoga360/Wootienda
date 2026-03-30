"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Store,
  Save,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  MessageCircle,
  Camera,
  Hash,
  AtSign,
  Video,
  Share2,
} from "lucide-react"

const businessSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  description: z.string().max(500).optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  schedule: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  telegram: z.string().optional(),
})

type BusinessFormData = z.infer<typeof businessSchema>

export function BusinessForm() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      city: "",
      country: "",
      schedule: "",
      whatsapp: "",
      instagram: "",
      facebook: "",
      twitter: "",
      youtube: "",
      telegram: "",
    },
  })

  async function onSubmit(data: BusinessFormData) {
    setIsLoading(true)
    try {
      // TODO: Save to Supabase
      console.log("Business data:", data)
      toast.success("Negocio actualizado correctamente")
    } catch {
      toast.error("Error al guardar. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Store className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Información básica</h2>
            <p className="text-sm text-muted-foreground">
              Datos principales de tu negocio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="name">Nombre del negocio *</Label>
            <Input
              id="name"
              placeholder="Ej: Café Sierra"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe brevemente tu negocio..."
              className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Phone className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Cómo pueden contactarte los clientes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+52 55 1234 5678"
                className="pl-10"
                {...register("phone")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email de contacto</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="contacto@tunegocio.com"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio web</Label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="website"
                placeholder="https://tunegocio.com"
                className="pl-10"
                {...register("website")}
              />
            </div>
            {errors.website && (
              <p className="text-sm text-destructive">
                {errors.website.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <div className="relative">
              <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="whatsapp"
                placeholder="+52 55 1234 5678"
                className="pl-10"
                {...register("whatsapp")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <MapPin className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Ubicación</h2>
            <p className="text-sm text-muted-foreground">
              Dónde se encuentra tu negocio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Calle, número, colonia"
                className="pl-10"
                {...register("address")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              placeholder="Ciudad de México"
              {...register("city")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              placeholder="México"
              {...register("country")}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="schedule">Horario de atención</Label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="schedule"
                placeholder="Lun-Vie: 9am-6pm, Sáb: 10am-2pm"
                className="pl-10"
                {...register("schedule")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center">
            <Share2 className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Redes sociales</h2>
            <p className="text-sm text-muted-foreground">
              Conecta tus perfiles de redes sociales
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative">
              <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="instagram"
                placeholder="@tu_negocio"
                className="pl-10"
                {...register("instagram")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="facebook"
                placeholder="facebook.com/tunegocio"
                className="pl-10"
                {...register("facebook")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="twitter"
                placeholder="@tu_negocio"
                className="pl-10"
                {...register("twitter")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <div className="relative">
              <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="youtube"
                placeholder="youtube.com/@tunegocio"
                className="pl-10"
                {...register("youtube")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !isDirty}
          className="min-w-[160px]"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isLoading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
}
