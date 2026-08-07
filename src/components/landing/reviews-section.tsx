"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { Star, MessageSquarePlus } from "lucide-react"

export interface ReviewData {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  created_at: string
}

export interface GoogleRatingData {
  rating: number
  userRatingCount: number
  googleMapsUri: string
}

interface ReviewsSectionProps {
  businessId: string
  initialReviews: ReviewData[]
  primaryColor: string
  tokens: { text: string; muted: string; border: string; surface: string }
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          width={size}
          height={size}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-current opacity-25"}
        />
      ))}
    </div>
  )
}

export function ReviewsSection({ businessId, initialReviews, primaryColor, tokens }: ReviewsSectionProps) {
  const supabase = createClient()
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim()) {
      alert("Escribe tu nombre")
      return
    }
    if (rating < 1) {
      alert("Selecciona una calificación")
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          business_id: businessId,
          customer_name: customerName.trim(),
          rating,
          comment: comment.trim() || null,
        })
        .select()
        .single()

      if (error) throw error

      setReviews((prev) => [data, ...prev])
      setCustomerName("")
      setRating(0)
      setComment("")
      setIsFormOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo enviar tu reseña, intenta de nuevo")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-8 space-y-6">
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: tokens.text }}>
            Reseñas
          </h2>
          {reviews.length > 0 ? (
            <p className="text-sm" style={{ color: tokens.muted }}>
              {reviews.length} reseña{reviews.length === 1 ? "" : "s"} de nuestros clientes
            </p>
          ) : (
            <p className="text-sm" style={{ color: tokens.muted }}>
              Aún no hay reseñas. ¡Sé el primero!
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((v) => !v)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-bold transition-transform hover:-translate-y-0.5 cursor-pointer border-0 w-fit"
          style={{ backgroundColor: primaryColor, color: "#fff" }}
        >
          <MessageSquarePlus className="size-4" />
          Dejar una reseña
        </button>
      </div>

      {/* Formulario */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-5 space-y-4"
          style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: tokens.muted }}>
              Tu calificación *
            </label>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  className="p-0.5 cursor-pointer border-0 bg-transparent"
                  aria-label={`${s} estrellas`}
                >
                  <Star
                    className={
                      s <= (hoverRating || rating)
                        ? "size-6 fill-amber-400 text-amber-400"
                        : "size-6 fill-transparent text-current opacity-30"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: tokens.muted }}>
              Tu nombre *
            </span>
            <input
              type="text"
              required
              placeholder="Ej: Juan Pérez"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "transparent", border: `1px solid ${tokens.border}`, color: tokens.text }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: tokens.muted }}>
              Comentario (opcional)
            </span>
            <textarea
              rows={3}
              placeholder="Cuéntanos tu experiencia..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "transparent", border: `1px solid ${tokens.border}`, color: tokens.text }}
            />
          </label>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 h-11 text-[13px] font-bold rounded-xl cursor-pointer border-0 bg-transparent"
              style={{ color: tokens.muted }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 text-[13px] font-bold text-white rounded-xl cursor-pointer border-0 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? "Enviando..." : "Publicar reseña"}
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold" style={{ color: tokens.text }}>
                  {r.customer_name}
                </p>
                <span className="text-[11px]" style={{ color: tokens.muted }}>
                  {formatDistanceToNow(new Date(r.created_at), { locale: es, addSuffix: true })}
                </span>
              </div>
              <StarRow rating={r.rating} size={12} />
              {r.comment && (
                <p className="text-sm mt-2 leading-relaxed" style={{ color: tokens.muted }}>
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
