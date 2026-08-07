import { generateJSON, generateImageBytes } from "./gemini"

export interface ProductDescriptionInput {
  productName: string
  businessName: string
  businessCategory: string
  existingDescription?: string
}

export interface ProductDescriptionResult {
  description: string
  category: string
  suggestedPrice: number
}

const DESCRIPTION_SCHEMA = {
  type: "OBJECT",
  properties: {
    description: { type: "STRING" },
    category: { type: "STRING" },
    suggestedPrice: { type: "NUMBER" },
  },
  required: ["description", "category", "suggestedPrice"],
}

function buildDescriptionPrompt(input: ProductDescriptionInput): string {
  const base = `Eres un experto en copywriting de productos para negocios locales latinoamericanos.
Genera: una descripción atractiva y profesional orientada a beneficios del cliente (máximo 60 palabras), una categoría corta (2-3 palabras) y un precio sugerido en pesos (número entero, sin símbolos) razonable para este tipo de producto.
Responde en español natural, sin comillas ni prefijos.

Producto: "${input.productName}"
Negocio: "${input.businessName}" (rubro: ${input.businessCategory})`

  if (input.existingDescription) {
    return `${base}
Descripción actual a mejorar (conserva la idea central, mejora redacción, claridad y atractivo): "${input.existingDescription}"`
  }
  return base
}

export function generateProductDescription(input: ProductDescriptionInput) {
  return generateJSON<ProductDescriptionResult>(buildDescriptionPrompt(input), DESCRIPTION_SCHEMA)
}

export interface ProductImageInput {
  productName: string
  description?: string
  businessCategory: string
}

function buildImagePrompt(input: ProductImageInput): string {
  return `Professional product photography of: ${input.productName}${input.description ? ` — ${input.description}` : ""}.
Clean plain white background, soft studio lighting, centered composition, high quality commercial photography style.
Business category: ${input.businessCategory}.
No text, no watermarks, no logos, photorealistic.`
}

export function generateProductImage(input: ProductImageInput) {
  return generateImageBytes(buildImagePrompt(input))
}
