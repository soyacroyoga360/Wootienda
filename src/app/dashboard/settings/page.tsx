import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Settings,
  User,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Trash2,
  ChevronRight,
  Mail,
  Globe,
  Crown,
} from "lucide-react"

export const metadata = {
  title: "Configuración",
}

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: User,
      iconColor: "bg-blue-500/10 text-blue-600",
      title: "Perfil",
      description: "Actualiza tu nombre y datos de cuenta",
    },
    {
      icon: Lock,
      iconColor: "bg-amber-500/10 text-amber-600",
      title: "Seguridad",
      description: "Cambia tu contraseña y configura 2FA",
    },
    {
      icon: Bell,
      iconColor: "bg-violet-500/10 text-violet-600",
      title: "Notificaciones",
      description: "Configura alertas de email y push",
    },
    {
      icon: CreditCard,
      iconColor: "bg-emerald-500/10 text-emerald-600",
      title: "Plan y facturación",
      description: "Administra tu suscripción y pagos",
    },
    {
      icon: Globe,
      iconColor: "bg-cyan-500/10 text-cyan-600",
      title: "Dominio personalizado",
      description: "Conecta tu propio dominio",
    },
  ]

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="size-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        </div>
        <p className="text-muted-foreground ml-9">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Current plan */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 rounded-2xl border border-primary/10 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                Plan actual
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-secondary text-foreground">
                FREE
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Accede a temas PRO, IA ilimitada y dominio personalizado
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Crown className="size-4 text-amber-500" />
            Actualizar a PRO
          </Button>
        </div>
      </div>

      {/* Profile section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <User className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Perfil</h2>
            <p className="text-sm text-muted-foreground">
              Información de tu cuenta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Nombre</Label>
            <Input id="profile-name" placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="profile-email"
                type="email"
                placeholder="tu@email.com"
                className="pl-10"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <Button>Guardar perfil</Button>
        </div>
      </div>

      {/* Password section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Lock className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
            <p className="text-sm text-muted-foreground">
              Actualiza tu contraseña de acceso
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
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <Button>Cambiar contraseña</Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card rounded-2xl border border-destructive/20 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <Shield className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Zona de peligro</h2>
            <p className="text-sm text-muted-foreground">
              Acciones irreversibles
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
          <div>
            <p className="text-sm font-medium">Eliminar cuenta</p>
            <p className="text-xs text-muted-foreground">
              Se eliminará tu negocio, productos y todos los datos asociados
            </p>
          </div>
          <Button variant="destructive" size="sm">
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </>
  )
}
