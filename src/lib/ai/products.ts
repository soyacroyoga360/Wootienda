import { generateJSON, generateJSONFromFile, generateImageBytes } from "./gemini"

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

export interface ExtractedProduct {
  name: string
  description?: string
  price?: number
  category?: string
}

const CATALOG_SCHEMA = {
  type: "OBJECT",
  properties: {
    products: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          description: { type: "STRING" },
          price: { type: "NUMBER" },
          category: { type: "STRING" },
        },
        required: ["name"],
      },
    },
  },
  required: ["products"],
}

const CATALOG_PROMPT = `Extrae todos los productos de este documento (puede ser un menú, catálogo o lista de precios).
Para cada producto identifica: nombre, descripción breve si está disponible, precio (solo el número entero, sin símbolos ni puntos ni comas de miles) si está visible, y la categoría o sección a la que pertenece.
Si un campo no está visible para un producto, simplemente omítelo — no inventes datos que no estén en el documento. No inventes productos que no aparezcan.`

export async function extractProductsFromDocument(fileBase64: string, mimeType: string): Promise<ExtractedProduct[]> {
  const result = await generateJSONFromFile<{ products: ExtractedProduct[] }>(
    fileBase64,
    mimeType,
    CATALOG_PROMPT,
    CATALOG_SCHEMA
  )
  return result.products || []
}
