"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
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
  category: z.string(),
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
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "restaurant",
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

  // Format helper for dynamic slug creation in case it's needed
  const formatSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

  useEffect(() => {
    async function loadBusinessData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch business
        const { data: business } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (business) {
          // Fetch social links
          const { data: socials } = await supabase
            .from("social_links")
            .select("*")
            .eq("business_id", business.id)

          const socialMap: Record<string, string> = {}
          socials?.forEach((s) => {
            socialMap[s.platform] = s.url
          })

          reset({
            name: business.business_name || "",
            description: business.description || "",
            category: business.category || "restaurant",
            phone: business.phone || "",
            email: business.email || "",
            website: business.website || "",
            address: business.address || "",
            city: business.city || "",
            country: business.country || "",
            schedule: business.schedule || "",
            whatsapp: business.whatsapp || "",
            instagram: socialMap["instagram"] || "",
            facebook: socialMap["facebook"] || "",
            twitter: socialMap["twitter"] || socialMap["x"] || "",
            youtube: socialMap["youtube"] || "",
            telegram: socialMap["telegram"] || "",
          })
        }
      } catch (err) {
        console.error("Error loading business data:", err)
      }
    }
    loadBusinessData()
  }, [supabase, reset])

  async function onSubmit(data: BusinessFormData) {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No autenticado")

      // 1. Get or create business
      let { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (!business) {
        const generatedSlug = formatSlug(data.name || "mi-negocio")
        const { data: newBusiness, error: insertError } = await supabase
          .from("businesses")
          .insert({
            user_id: user.id,
            slug: generatedSlug,
            business_name: data.name,
            description: data.description,
            category: data.category,
            phone: data.phone,
            email: data.email,
            website: data.website,
            address: data.address,
            city: data.city,
            country: data.country,
            schedule: data.schedule,
            whatsapp: data.whatsapp,
          })
          .select("id")
          .single()

        if (insertError) throw insertError
        business = newBusiness
      } else {
        const { error: updateError } = await supabase
          .from("businesses")
          .update({
            business_name: data.name,
            description: data.description,
            category: data.category,
            phone: data.phone,
            email: data.email,
            website: data.website,
            address: data.address,
            city: data.city,
            country: data.country,
            schedule: data.schedule,
            whatsapp: data.whatsapp,
          })
          .eq("id", business.id)

        if (updateError) throw updateError
      }

      if (business) {
        // 2. Save social links
        const platforms = ["instagram", "facebook", "twitter", "youtube", "telegram"]
        for (const platform of platforms) {
          const urlValue = data[platform as keyof BusinessFormData]
          if (urlValue && urlValue.trim() !== "") {
            const { error: upsertError } = await supabase
              .from("social_links")
              .upsert({
                business_id: business.id,
                platform,
                url: urlValue.trim(),
              }, {
                onConflict: "business_id, platform"
              })
            if (upsertError) throw upsertError
          } else {
            await supabase
              .from("social_links")
              .delete()
              .eq("business_id", business.id)
              .eq("platform", platform)
          }
        }
      }

      toast.success("Negocio actualizado correctamente")
      reset(data)
    } catch (err: any) {
      console.error("Error saving business details:", err)
      toast.error(`Error al guardar: ${err.message || "Intenta de nuevo."}`)
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
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del negocio</Label>
            <Input
              id="name"
              placeholder="Ej: Café Sierra"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Tipo de negocio / Rubro</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              {...register("category")}
            >
              <option value="restaurant">Restaurante (Muestra botón MENÚ)</option>
              <option value="services">Empresa / Servicios (Muestra botón SERVICIOS)</option>
            </select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
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
