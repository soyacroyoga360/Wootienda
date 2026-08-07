"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Star, MessageSquareText, Trash2, Loader2 } from "lucide-react"

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  created_at: string
}

export default function ReviewsPage() {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: business } = await supabase
          .from("businesses")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle()

        if (business) {
          const { data } = await supabase
            .from("reviews")
            .select("*")
            .eq("business_id", business.id)
            .order("created_at", { ascending: false })

          setReviews(data || [])
        }
      } catch (err) {
        console.error("Error loading reviews:", err)
        toast.error("Error al cargar las reseñas")
      } finally {
        setIsLoading(false)
      }
    }
    loadReviews()
  }, [supabase])

  const handleDelete = async (review: Review) => {
    if (!confirm(`¿Eliminar la reseña de "${review.customer_name}"?`)) return

    setDeletingId(review.id)
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", review.id)
      if (error) throw error

      setReviews((prev) => prev.filter((r) => r.id !== review.id))
      toast.success("Reseña eliminada")
    } catch (err) {
      console.error("Error deleting review:", err)
      toast.error("No se pudo eliminar la reseña")
    } finally {
      setDeletingId(null)
    }
  }

  const avg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <MessageSquareText className="size-6 text-amber-600" />
            <h1 className="text-3xl font-bold tracking-tight">Reseñas</h1>
          </div>
          <p className="text-muted-foreground ml-9">
            Reseñas que tus clientes dejaron directamente en tu landing
          </p>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border/50">
            <span className="text-lg font-extrabold">{avg.toFixed(1)}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`size-4 ${s <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando reseñas...</p>
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-5">
            <MessageSquareText className="size-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Aún no tienes reseñas</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Cuando tus clientes dejen una reseña en tu landing pública, aparecerán aquí y podrás moderarlas.
          </p>
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-2xl border border-border/50 p-5 flex items-start justify-between gap-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-bold">{review.customer_name}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`size-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.created_at), { locale: es, addSuffix: true })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(review)}
                disabled={deletingId === review.id}
                className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 shrink-0 disabled:opacity-50"
                title="Eliminar reseña"
              >
                {deletingId === review.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
