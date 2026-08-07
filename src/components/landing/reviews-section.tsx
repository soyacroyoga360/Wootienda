"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { Star, MessageSquarePlus, ExternalLink } from "lucide-react"

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
  googleRating: GoogleRatingData | null
  googleProfileUrl: string
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

export function ReviewsSection({ businessId, initialReviews, googleRating, googleProfileUrl, primaryColor, tokens }: ReviewsSectionProps) {
  const supabase = createClient()
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nativeAvg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

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
        <div className="flex items-center gap-4">
          {googleRating ? (
            <a
              href={googleRating.googleMapsUri}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl p-3 pr-4 transition-transform hover:-translate-y-0.5"
              style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}
            >
              <div className="size-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tokens.muted }}>
                  Google — {googleRating.userRatingCount} reseñas
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold" style={{ color: tokens.text }}>
                    {googleRating.rating.toFixed(1)}
                  </span>
                  <StarRow rating={googleRating.rating} />
                  <ExternalLink className="size-3" style={{ color: tokens.muted }} />
                </div>
              </div>
            </a>
          ) : reviews.length > 0 ? (
            <a
              href={googleProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl p-3 pr-4 transition-transform hover:-translate-y-0.5"
              style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}
            >
              <div className="size-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                <Star className="size-4 fill-white text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tokens.muted }}>
                  {reviews.length} reseña{reviews.length === 1 ? "" : "s"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold" style={{ color: tokens.text }}>
                    {nativeAvg.toFixed(1)}
                  </span>
                  <StarRow rating={nativeAvg} />
                  <ExternalLink className="size-3" style={{ color: tokens.muted }} />
                </div>
              </div>
            </a>
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
