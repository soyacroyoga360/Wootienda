import { Button } from "@/components/ui/button"
import Link from "next/link"
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
  PackageOpen,
} from "lucide-react"

export const metadata = {
  title: "Productos",
}

export default function ProductsPage() {
  // Placeholder: no products yet
  const products: unknown[] = []

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
        <Button size="lg" className="shrink-0">
          <Plus className="size-4" />
          Agregar producto
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="size-4" />
            Filtrar
          </Button>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button className="p-2 bg-secondary text-foreground transition-colors">
              <Grid3X3 className="size-4" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-5">
            <PackageOpen className="size-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Aún no tienes productos
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Agrega tu primer producto para empezar a mostrar tu catálogo en tu
            landing page.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg">
              <Plus className="size-4" />
              Agregar producto
            </Button>
            <Button variant="outline" size="lg">
              <Sparkles className="size-4" />
              Generar con IA
            </Button>
          </div>

          {/* Feature hints */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-xl mx-auto">
            {[
              {
                icon: ImagePlus,
                title: "Fotos",
                desc: "Sube hasta 5 fotos por producto",
              },
              {
                icon: Tag,
                title: "Categorías",
                desc: "Organiza por categorías",
              },
              {
                icon: DollarSign,
                title: "Precios",
                desc: "Precio, descuento, moneda",
              },
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

      {/* Product Grid (when there are products) */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Product Card Template */}
          <div className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Image placeholder */}
            <div className="aspect-square bg-secondary flex items-center justify-center">
              <ImagePlus className="size-10 text-muted-foreground/50" />
            </div>
            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold line-clamp-1">
                    Nombre del producto
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    Categoría
                  </p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="size-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-primary">$0</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                    <Eye className="size-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                    <Pencil className="size-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                    <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
