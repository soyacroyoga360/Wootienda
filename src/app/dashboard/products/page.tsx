"use client"

import { useState, useEffect } from "react"
import Papa from "papaparse"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BusinessUpgradeModal } from "@/components/dashboard/business-upgrade-modal"
import { toast } from "sonner"
import {
  Package,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  ImagePlus,
  Tag,
  DollarSign,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Sparkles,
  Wand2,
  FileSpreadsheet,
  UploadCloud,
  CircleAlert,
  CheckCircle2,
  Crown,
  PackageOpen,
  X,
  Loader2,
  Check,
  Globe,
} from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  business_id: string
  name: string
  description: string | null
  price: number | null
  compare_at_price: number | null
  category: string | null
  image_url: string | null
  is_active: boolean
  is_featured: boolean
}

const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600", label: "Café Veracruz" },
  { url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600", label: "Cold Brew" },
  { url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600", label: "Taza Chemex" },
  { url: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=600", label: "Croissant Almendra" },
  { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600", label: "Pan Artesanal" },
  { url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600", label: "Tarta de Chocolate" },
  { url: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=600", label: "Hamburguesa" },
  { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600", label: "Pizza" }
]

const MAX_CSV_ROWS = 40
// Stay well clear of the Gemini free-tier RPM ceiling between per-row AI calls.
const AI_ROW_DELAY_MS = 2500
const MAX_UPLOAD_BYTES = 1024 * 1024
const MAX_PDF_BYTES = 8 * 1024 * 1024

interface CsvRow {
  name: string
  description: string
  category: string
  price: number | null
}

interface ImportRowStatus {
  status: "pending" | "working" | "done" | "error"
  message?: string
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}

function parseCsvFile(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: CsvRow[] = []
        for (const raw of results.data) {
          const entry: Record<string, string> = {}
          for (const [key, value] of Object.entries(raw)) {
            entry[normalizeHeader(key)] = typeof value === "string" ? value.trim() : ""
          }
          const name = entry["nombre"] || entry["name"] || entry["producto"] || ""
          if (!name) continue
          const description = entry["descripcion"] || entry["description"] || ""
          const category = entry["categoria"] || entry["category"] || ""
          const priceRaw = entry["precio"] || entry["price"] || ""
          // Prices in this app are whole pesos — strip everything but digits so
          // "$15.000" / "15,000" (thousands separators) don't get parsed as 15.
          const priceNum = priceRaw ? Number(priceRaw.replace(/[^0-9]/g, "")) : NaN
          rows.push({ name, description, category, price: Number.isFinite(priceNum) && priceNum > 0 ? priceNum : null })
        }
        resolve(rows)
      },
      error: (err: Error) => reject(err),
    })
  })
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(",")[1] || "")
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [businessPlan, setBusinessPlan] = useState("free")
  const [userId, setUserId] = useState<string | null>(null)
  const isBusinessPlan = businessPlan === "business"

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form states
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formComparePrice, setFormComparePrice] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formImageUrl, setFormImageUrl] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)
  const [formIsFeatured, setFormIsFeatured] = useState(false)

  // AI generation states
  const [isGeneratingText, setIsGeneratingText] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState("")

  // Manual image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // CSV/PDF import states
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)
  const [csvFileName, setCsvFileName] = useState("")
  const [csvRows, setCsvRows] = useState<CsvRow[]>([])
  const [csvGenerateDescriptions, setCsvGenerateDescriptions] = useState(true)
  const [csvGenerateImages, setCsvGenerateImages] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<ImportRowStatus[]>([])
  const [isParsingPdf, setIsParsingPdf] = useState(false)

  const openUpgradeModal = (feature: string) => {
    setUpgradeFeature(feature)
    setIsUpgradeOpen(true)
  }

  const reloadProducts = async (bizId: string) => {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", bizId)
      .order("created_at", { ascending: false })
    setProducts(productsData || [])
  }

  // Load business & products
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)

        // 1. Get business
        const { data: business } = await supabase
          .from("businesses")
          .select("id, plan")
          .eq("user_id", user.id)
          .maybeSingle()

        if (business) {
          setBusinessId(business.id)
          setBusinessPlan(business.plan || "free")
          await reloadProducts(business.id)
        }
      } catch (err) {
        console.error("Error loading products data:", err)
        toast.error("Error al cargar productos")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  const openAddModal = () => {
    setEditingProduct(null)
    setFormName("")
    setFormDescription("")
    setFormPrice("")
    setFormComparePrice("")
    setFormCategory("")
    setFormImageUrl("")
    setFormIsActive(true)
    setFormIsFeatured(false)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name || "")
    setFormDescription(product.description || "")
    setFormPrice(product.price?.toString() || "")
    setFormComparePrice(product.compare_at_price?.toString() || "")
    setFormCategory(product.category || "")
    setFormImageUrl(product.image_url || "")
    setFormIsActive(product.is_active ?? true)
    setFormIsFeatured(product.is_featured ?? false)
    setIsModalOpen(true)
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) return
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)

      if (error) throw error

      setProducts(products.filter((p) => p.id !== product.id))
      toast.success("Producto eliminado correctamente")
    } catch (err) {
      console.error("Error deleting product:", err)
      toast.error("Error al eliminar el producto")
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) {
      toast.error("Error: No se encontró el ID de tu negocio.")
      return
    }

    if (!formName.trim()) {
      toast.error("Ingresa el nombre del producto")
      return
    }

    setIsSaving(true)
    try {
      const priceNum = parseFloat(formPrice) || null
      const comparePriceNum = parseFloat(formComparePrice) || null

      const productPayload = {
        business_id: businessId,
        name: formName.trim(),
        description: formDescription.trim() || null,
        price: priceNum,
        compare_at_price: comparePriceNum,
        category: formCategory.trim() || null,
        image_url: formImageUrl.trim() || null,
        is_active: formIsActive,
        is_featured: formIsFeatured,
      }

      if (editingProduct) {
        // Update
        const { data, error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", editingProduct.id)
          .select()
          .single()

        if (error) throw error
        setProducts(products.map((p) => (p.id === editingProduct.id ? data : p)))
        toast.success("Producto actualizado con éxito")
      } else {
        // Create
        const { data, error } = await supabase
          .from("products")
          .insert(productPayload)
          .select()
          .single()

        if (error) throw error
        setProducts([data, ...products])
        toast.success("Producto agregado con éxito")
      }

      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving product:", err)
      const message = err instanceof Error ? err.message : "Intenta de nuevo."
      toast.error(`Error al guardar: ${message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // AI: generate/improve description, category and suggested price
  const handleAIGenerate = async () => {
    if (!formName.trim()) {
      toast.error("Escribe un nombre de producto para generar detalles con IA")
      return
    }
    if (!isBusinessPlan) {
      openUpgradeModal("La generación de descripciones con IA")
      return
    }

    setIsGeneratingText(true)
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formName.trim(),
          existingDescription: formDescription.trim() || undefined,
          productId: editingProduct?.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error en la generación con IA")

      setFormDescription(data.description)
      setFormCategory(data.category)
      if (!formPrice) setFormPrice(String(Math.round(data.suggestedPrice)))
      toast.success("¡Descripción y categoría generadas con éxito!")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en la generación con IA"
      toast.error(message)
    } finally {
      setIsGeneratingText(false)
    }
  }

  // AI: generate a product photo and upload it to storage
  const handleAIGenerateImage = async () => {
    if (!formName.trim()) {
      toast.error("Escribe un nombre de producto para generar una imagen con IA")
      return
    }
    if (!isBusinessPlan) {
      openUpgradeModal("La generación de imágenes con IA")
      return
    }

    setIsGeneratingImage(true)
    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formName.trim(),
          description: formDescription.trim() || undefined,
          productId: editingProduct?.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error generando la imagen con IA")

      setFormImageUrl(data.imageUrl)
      toast.success("¡Imagen generada con éxito!")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error generando la imagen con IA"
      toast.error(message)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Manual image upload — straight to Supabase Storage, no URL pasting
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!userId) {
      toast.error("No se encontró tu sesión, recarga la página e intenta de nuevo")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen válido")
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("La imagen supera 1MB. Elige una más liviana o comprímela antes de subirla.")
      return
    }

    setIsUploadingImage(true)
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const path = `${userId}/products/upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(path, file, { contentType: file.type, upsert: false })
      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("business-assets").getPublicUrl(path)

      setFormImageUrl(publicUrl)
      toast.success("Imagen subida con éxito")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al subir la imagen"
      toast.error(message)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // CSV/PDF import
  const openCsvModal = () => {
    if (!isBusinessPlan) {
      openUpgradeModal("La importación de productos desde CSV o PDF")
      return
    }
    setCsvFileName("")
    setCsvRows([])
    setImportProgress([])
    setCsvGenerateDescriptions(true)
    setCsvGenerateImages(false)
    setIsCsvModalOpen(true)
  }

  const handleCsvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    try {
      const rows = await parseCsvFile(file)
      if (rows.length === 0) {
        toast.error("El CSV no tiene filas válidas. Se requiere una columna 'nombre'.")
        return
      }
      const truncated = rows.slice(0, MAX_CSV_ROWS)
      if (rows.length > MAX_CSV_ROWS) {
        toast.warning(`El CSV tiene ${rows.length} filas, se importarán solo las primeras ${MAX_CSV_ROWS}.`)
      }
      setCsvFileName(file.name)
      setCsvRows(truncated)
      setImportProgress(truncated.map(() => ({ status: "pending" })))
    } catch (err) {
      console.error("Error parsing CSV:", err)
      toast.error("No se pudo leer el archivo CSV")
    }
  }

  const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (file.size > MAX_PDF_BYTES) {
      toast.error("El PDF supera 8MB. Usa un archivo más liviano.")
      return
    }

    setIsParsingPdf(true)
    try {
      const fileBase64 = await readFileAsBase64(file)
      const res = await fetch("/api/ai/parse-catalog-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64, mimeType: file.type || "application/pdf" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error leyendo el PDF")

      const extracted = (data.products || []) as Array<{
        name: string
        description?: string
        price?: number
        category?: string
      }>
      const rows: CsvRow[] = extracted
        .filter((p) => p.name?.trim())
        .map((p) => ({
          name: p.name.trim(),
          description: p.description?.trim() || "",
          category: p.category?.trim() || "",
          price: typeof p.price === "number" && p.price > 0 ? Math.round(p.price) : null,
        }))

      if (rows.length === 0) {
        toast.error("No se encontraron productos en el PDF")
        return
      }

      const truncated = rows.slice(0, MAX_CSV_ROWS)
      if (rows.length > MAX_CSV_ROWS) {
        toast.warning(`Se encontraron ${rows.length} productos, se importarán solo los primeros ${MAX_CSV_ROWS}.`)
      }
      setCsvFileName(file.name)
      setCsvRows(truncated)
      setImportProgress(truncated.map(() => ({ status: "pending" })))
      toast.success(`${truncated.length} producto${truncated.length === 1 ? "" : "s"} detectado${truncated.length === 1 ? "" : "s"} en el PDF`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo leer el PDF"
      toast.error(message)
    } finally {
      setIsParsingPdf(false)
    }
  }

  const handleRunImport = async () => {
    if (!businessId || csvRows.length === 0) return

    setIsImporting(true)
    let insertedCount = 0

    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i]
      setImportProgress((prev) => prev.map((p, idx) => (idx === i ? { status: "working" } : p)))

      try {
        let description = row.description
        let category = row.category
        let price = row.price
        let usedAiText = false

        if (csvGenerateDescriptions && (!description || !category || !price)) {
          if (i > 0) await sleep(AI_ROW_DELAY_MS)
          const res = await fetch("/api/ai/generate-description", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName: row.name, existingDescription: description || undefined }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || "Error de IA generando el texto")
          description = description || data.description
          category = category || data.category
          price = price ?? Math.round(data.suggestedPrice)
          usedAiText = true
        }

        let imageUrl: string | null = null
        if (csvGenerateImages) {
          if (usedAiText || i > 0) await sleep(AI_ROW_DELAY_MS)
          const res = await fetch("/api/ai/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName: row.name, description: description || undefined }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || "Error de IA generando la imagen")
          imageUrl = data.imageUrl
        }

        const { error } = await supabase.from("products").insert({
          business_id: businessId,
          name: row.name,
          description: description || null,
          category: category || null,
          price: price ?? null,
          image_url: imageUrl,
          is_active: true,
          is_featured: false,
          ai_generated_description: usedAiText,
          ai_generated_image: csvGenerateImages,
        })
        if (error) throw error

        insertedCount += 1
        setImportProgress((prev) => prev.map((p, idx) => (idx === i ? { status: "done" } : p)))
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido"
        setImportProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { status: "error", message } : p))
        )
      }
    }

    await reloadProducts(businessId)
    setIsImporting(false)
    toast.success(`Importación completa: ${insertedCount} de ${csvRows.length} productos agregados`)
  }

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory =
      selectedCategory === "all" ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase())

    return matchesSearch && matchesCategory
  })

  // Get distinct categories
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[]

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Package className="size-6 text-amber-600" />
            <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          </div>
          <p className="text-muted-foreground ml-9">
            Administra tu catálogo de productos
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="lg" variant="outline" onClick={openCsvModal}>
            <FileSpreadsheet className="size-4" />
            Importar CSV/PDF
            {!isBusinessPlan && <Crown className="size-3.5 text-pink-500" />}
          </Button>
          <Button size="lg" onClick={openAddModal}>
            <Plus className="size-4" />
            Agregar producto
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-xl border border-border/50 text-sm">
            <Filter className="size-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-sm font-medium pr-1 cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando catálogo...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-5">
            <PackageOpen className="size-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Aún no tienes productos
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Agrega tu primer producto para empezar a mostrar tu catálogo en tu
            landing page pública.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={openAddModal}>
              <Plus className="size-4" />
              Agregar producto
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-xl mx-auto border-t border-border/40 pt-8">
            {[
              { icon: ImagePlus, title: "Fotos Ilustrativas", desc: "Usa fotos de catálogo predeterminadas" },
              { icon: Tag, title: "Categorías", desc: "Organiza por menús o secciones" },
              { icon: DollarSign, title: "Descuentos", desc: "Muestra precios de antes y después" },
            ].map((hint) => (
              <div key={hint.title} className="text-center">
                <hint.icon className="size-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">{hint.title}</p>
                <p className="text-xs text-muted-foreground">{hint.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtered empty state */}
      {!isLoading && products.length > 0 && filteredProducts.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center shadow-sm">
          <p className="text-muted-foreground">No se encontraron productos que coincidan con la búsqueda.</p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-secondary overflow-hidden shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40 bg-secondary/80">
                    <Package className="size-12 stroke-[1.5]" />
                    <span className="text-xs">Sin imagen</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.is_featured && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="size-3" />
                      Destacado
                    </span>
                  )}
                  {!product.is_active && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-muted-foreground bg-secondary shadow-sm uppercase tracking-wider">
                      Borrador
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-muted-foreground shrink-0 max-w-[100px] truncate">
                      {product.category || "General"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {product.description || "Sin descripción proporcionada."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold text-foreground">
                      ${product.price?.toLocaleString() || "0"}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.compare_at_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                      title="Editar producto"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                      title="Eliminar producto"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Glassmorphic Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package className="size-5 text-primary" />
                {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-xl transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prod-name">Nombre del producto *</Label>
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isGeneratingText}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-60 cursor-pointer"
                  >
                    {isGeneratingText ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="size-3.5" />
                    )}
                    {isGeneratingText ? "Generando..." : "Generar detalles con IA"}
                    {!isBusinessPlan && <Crown className="size-3 text-pink-500" />}
                  </button>
                </div>
                <Input
                  id="prod-name"
                  placeholder="Ej: Café Bourbon Tostado"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Price fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prod-price">Precio ($COP) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="prod-price"
                      type="number"
                      placeholder="35000"
                      className="pl-8"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-compare-price">Precio original / de antes (Opcional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="prod-compare-price"
                      type="number"
                      placeholder="42000"
                      className="pl-8"
                      value={formComparePrice}
                      onChange={(e) => setFormComparePrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="prod-category">Categoría</Label>
                <Input
                  id="prod-category"
                  placeholder="Ej: Café en Grano, Repostería, Bebidas"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="prod-desc">Descripción</Label>
                <textarea
                  id="prod-desc"
                  rows={3}
                  placeholder="Escribe los ingredientes, tueste, notas o detalles especiales del producto..."
                  className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary resize-none"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              {/* Image URL & Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Imagen del producto</Label>
                  <button
                    type="button"
                    onClick={handleAIGenerateImage}
                    disabled={isGeneratingImage}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-60 cursor-pointer"
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="size-3.5" />
                    )}
                    {isGeneratingImage ? "Generando..." : "Generar imagen con IA"}
                    {!isBusinessPlan && <Crown className="size-3 text-pink-500" />}
                  </button>
                </div>
                {formImageUrl ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60 bg-secondary/30">
                    <Image src={formImageUrl} alt="Vista previa" fill className="object-cover" sizes="500px" />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer border-0"
                      aria-label="Quitar imagen"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-8 cursor-pointer hover:border-primary/50 hover:bg-secondary/20 transition-colors">
                    {isUploadingImage ? (
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    ) : (
                      <UploadCloud className="size-6 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{isUploadingImage ? "Subiendo..." : "Subir imagen"}</span>
                    <span className="text-xs text-muted-foreground">JPG, PNG o WebP — máx. 1MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                  </label>
                )}

                {/* Preset image selector */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">O selecciona una de nuestras imágenes rápidas:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => setFormImageUrl(img.url)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          formImageUrl === img.url ? "border-primary scale-95" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        title={img.label}
                      >
                        <Image
                          src={img.url}
                          alt={img.label}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="accent-primary size-4 rounded cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-semibold">Producto activo / visible</p>
                    <p className="text-xs text-muted-foreground">Si está desactivado, se guardará como borrador.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="accent-primary size-4 rounded cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-semibold">Destacar en la landing</p>
                    <p className="text-xs text-muted-foreground">Se mostrará en la sección de recomendados arriba del menú.</p>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSaving}
                  className="min-w-[150px]"
                >
                  {isSaving && <Loader2 className="size-4 animate-spin" />}
                  {isSaving ? "Guardando..." : "Guardar Producto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-primary" />
                Importar productos
              </h3>
              <button
                onClick={() => !isImporting && setIsCsvModalOpen(false)}
                disabled={isImporting}
                className="p-2 text-muted-foreground hover:text-foreground rounded-xl transition-colors disabled:opacity-40"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {csvRows.length === 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-2xl py-10 cursor-pointer hover:border-primary/50 hover:bg-secondary/20 transition-colors">
                      <FileSpreadsheet className="size-8 text-muted-foreground" />
                      <span className="text-sm font-semibold">Subir CSV</span>
                      <span className="text-xs text-muted-foreground">o arrástralo aquí</span>
                      <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvFileChange} />
                    </label>

                    <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-2xl py-10 cursor-pointer hover:border-primary/50 hover:bg-secondary/20 transition-colors">
                      {isParsingPdf ? (
                        <Loader2 className="size-8 text-muted-foreground animate-spin" />
                      ) : (
                        <UploadCloud className="size-8 text-muted-foreground" />
                      )}
                      <span className="text-sm font-semibold">{isParsingPdf ? "Leyendo con IA..." : "Subir PDF"}</span>
                      <span className="text-xs text-muted-foreground">menú o catálogo — máx. 8MB</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={handlePdfFileChange}
                        disabled={isParsingPdf}
                      />
                    </label>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary/20 rounded-xl p-4 space-y-1.5">
                    <p className="font-semibold text-foreground">CSV — columnas esperadas:</p>
                    <p><strong>nombre</strong> (obligatoria) — descripcion, precio, categoria (opcionales)</p>
                    <p className="pt-1"><strong>PDF</strong> — sube tu menú o catálogo tal cual; la IA lee el documento y extrae los productos, precios y categorías automáticamente.</p>
                    <p>En ambos casos, si falta algún dato la IA puede completarlo: descripción, categoría y precio sugerido.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {csvFileName} — {csvRows.length} producto{csvRows.length === 1 ? "" : "s"} detectado{csvRows.length === 1 ? "" : "s"}
                    </p>
                    {!isImporting && (
                      <button
                        type="button"
                        onClick={() => { setCsvRows([]); setImportProgress([]) }}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Cambiar archivo
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={csvGenerateDescriptions}
                        onChange={(e) => setCsvGenerateDescriptions(e.target.checked)}
                        disabled={isImporting}
                        className="accent-primary size-4 rounded cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-semibold">Completar con IA los campos faltantes</p>
                        <p className="text-xs text-muted-foreground">Descripción, categoría y precio sugerido para filas incompletas.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={csvGenerateImages}
                        onChange={(e) => setCsvGenerateImages(e.target.checked)}
                        disabled={isImporting}
                        className="accent-primary size-4 rounded cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-semibold">Generar una imagen con IA para cada producto</p>
                        <p className="text-xs text-muted-foreground">Más lento — puede tardar varios minutos con listas grandes.</p>
                      </div>
                    </label>
                  </div>

                  <div className="border border-border/60 rounded-xl divide-y divide-border/50 max-h-72 overflow-y-auto">
                    {csvRows.map((row, i) => {
                      const status = importProgress[i]?.status || "pending"
                      return (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <div className="shrink-0">
                            {status === "pending" && <div className="size-4 rounded-full border-2 border-border" />}
                            {status === "working" && <Loader2 className="size-4 animate-spin text-primary" />}
                            {status === "done" && <CheckCircle2 className="size-4 text-emerald-500" />}
                            {status === "error" && <CircleAlert className="size-4 text-destructive" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{row.name}</p>
                            {importProgress[i]?.status === "error" && (
                              <p className="text-xs text-destructive">{importProgress[i]?.message}</p>
                            )}
                          </div>
                          {!row.description && <span className="text-[10px] text-muted-foreground shrink-0">sin descripción</span>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {csvRows.length > 0 && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/50">
                <Button variant="outline" size="lg" onClick={() => setIsCsvModalOpen(false)} disabled={isImporting}>
                  {isImporting ? "Importando..." : "Cerrar"}
                </Button>
                <Button size="lg" onClick={handleRunImport} disabled={isImporting} className="min-w-[180px]">
                  {isImporting && <Loader2 className="size-4 animate-spin" />}
                  {isImporting ? "Importando..." : `Importar ${csvRows.length} producto${csvRows.length === 1 ? "" : "s"}`}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <BusinessUpgradeModal open={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} feature={upgradeFeature} />
    </>
  )
}
