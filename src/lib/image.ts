import sharp from "sharp"

const MAX_DIMENSION = 1024
const WEBP_QUALITY = 82

/**
 * Product photos always land in storage as WebP — smaller than the PNG/JPEG
 * Gemini returns, and sharp reads the input format automatically so this
 * works regardless of what the model sends back.
 */
export async function optimizeToWebp(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
}
