export interface GooglePlaceRating {
  rating: number
  userRatingCount: number
  googleMapsUri: string
}

/**
 * Places API (New) — https://places.googleapis.com/v1/places/{placeId}.
 * Cached for an hour so a busy landing page doesn't hammer the Google API
 * (and burn quota) on every single visitor.
 */
export async function getGooglePlaceRating(placeId: string): Promise<GooglePlaceRating | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || !placeId) return null

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri",
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    const data = await res.json()
    if (typeof data.rating !== "number") return null

    return {
      rating: data.rating,
      userRatingCount: typeof data.userRatingCount === "number" ? data.userRatingCount : 0,
      googleMapsUri: data.googleMapsUri || `https://www.google.com/maps/place/?q=place_id:${placeId}`,
    }
  } catch (err) {
    console.error("Error fetching Google Place rating:", err)
    return null
  }
}
