"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Crown, X } from "lucide-react"

interface BusinessUpgradeModalProps {
  open: boolean
  onClose: () => void
  feature?: string
}

export function BusinessUpgradeModal({ open, onClose, feature }: BusinessUpgradeModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 flex flex-col items-center text-center animate-in fade-in-50 zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
        >
          <X className="size-4" />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center mb-4">
          <Crown className="size-7" />
        </div>
        <h3 className="text-xl font-bold mb-2">Función exclusiva del plan Business</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {feature || "Esta función"} está disponible solo para negocios con plan Business: generación de
          descripciones e imágenes con IA, e importación masiva de productos desde CSV.
        </p>

        <div className="w-full space-y-3">
          <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold">
            <Link href="/dashboard/settings">Ver plan Business</Link>
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Seguir con mi plan actual
          </Button>
        </div>
      </div>
    </div>
  )
}
