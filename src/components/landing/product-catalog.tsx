"use client"

import { useState } from "react"
import { Search, ShoppingBag, MessageCircle } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

interface ProductCatalogProps {
  products: Product[]
  primaryColor: string
  whatsapp: string | null
  theme: string
}

export function ProductCatalog({ products, primaryColor, whatsapp, theme }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Group categories dynamically
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[]

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Theme styling definitions for product cards
  let cardClass = "bg-card text-foreground border border-border/50 shadow-sm rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
  let titleClass = "font-bold text-lg leading-tight mb-2 text-foreground group-hover:text-primary transition-colors"
  let descClass = "text-muted-foreground text-sm mb-4 line-clamp-2 mt-auto leading-relaxed"
  let borderClass = "border-t border-border/50 mt-auto pt-4 flex items-center justify-between"
  let textClass = "font-extrabold flex items-baseline gap-0.5 text-foreground"
  
  if (theme === "oscuro") {
    cardClass = "bg-[#1a1a1a] text-white border border-[#262626] shadow-md rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    titleClass = "font-bold text-lg leading-tight mb-2 text-white transition-colors"
    descClass = "text-gray-400 text-sm mb-4 line-clamp-2 mt-auto leading-relaxed"
    borderClass = "border-t border-[#262626] mt-auto pt-4 flex items-center justify-between"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-white"
  } else if (theme === "glassmorphism") {
    cardClass = "bg-white/10 dark:bg-black/25 backdrop-blur-md text-white border border-white/15 shadow-2xl rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 flex flex-col"
    titleClass = "font-bold text-lg leading-tight mb-2 text-white drop-shadow-md"
    descClass = "text-gray-200 text-sm mb-4 line-clamp-2 mt-auto leading-relaxed"
    borderClass = "border-t border-white/10 mt-auto pt-4 flex items-center justify-between"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-white"
  } else if (theme === "neon-glow") {
    cardClass = "bg-[#09090b] text-white border border-primary/20 shadow-[0_0_15px_rgba(var(--user-primary-rgb,238,29,109),0.07)] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--user-primary-rgb,238,29,109),0.15)] rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col"
    titleClass = "font-bold text-lg leading-tight mb-2 text-white drop-shadow-[0_0_10px_rgba(var(--user-primary-rgb,238,29,109),0.2)]"
    descClass = "text-gray-400 text-sm mb-4 line-clamp-2 mt-auto leading-relaxed"
    borderClass = "border-t border-[#18181b] mt-auto pt-4 flex items-center justify-between"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-white"
  } else if (theme === "gradient-mesh") {
    cardClass = "bg-card/75 backdrop-blur-sm text-foreground border border-border/40 shadow-md rounded-2xl overflow-hidden hover:bg-card hover:-translate-y-1 transition-all duration-300 flex flex-col"
    titleClass = "font-bold text-lg leading-tight mb-2 text-foreground transition-colors"
    descClass = "text-muted-foreground text-sm mb-4 line-clamp-2 mt-auto leading-relaxed"
    borderClass = "border-t border-border/40 mt-auto pt-4 flex items-center justify-between"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-foreground"
  }

  return (
    <div className="space-y-8">
      {/* Search and Category filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 order-2 md:order-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "shadow-sm text-white border-0"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border-0"
            }`}
            style={selectedCategory === "all" ? { backgroundColor: primaryColor } : {}}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "shadow-sm text-white border-0"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border-0"
              }`}
              style={selectedCategory === cat ? { backgroundColor: primaryColor } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search bar */}
        <div className="relative w-full md:w-72 order-1 md:order-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 transition-shadow"
            style={{ "--tw-ring-color": `${primaryColor}30` } as React.CSSProperties}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </div>

      {/* Product list rendering */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className={`group ${cardClass}`}>
              <div className="relative aspect-square w-full bg-secondary/25 overflow-hidden shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 text-muted-foreground/30">
                    <ShoppingBag className="size-12 stroke-[1.5]" />
                  </div>
                )}
                {product.category && (
                  <span 
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 shadow-sm border border-white/5 backdrop-blur-sm"
                  >
                    {product.category}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className={titleClass}>
                  {product.name}
                </h3>
                <p className={descClass}>
                  {product.description || "Sin descripción disponible."}
                </p>

                <div className={borderClass}>
                  <span className={textClass}>
                    <span className="text-sm font-semibold pr-0.5">$</span>
                    <span className="text-xl font-extrabold">{product.price.toLocaleString()}</span>
                  </span>

                  {whatsapp ? (
                    <a
                      href={`https://wa.me/${whatsapp}?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap text-xs font-bold uppercase tracking-wider h-8 px-4 rounded-full text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer decoration-none no-underline border-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <MessageCircle className="size-3.5 mr-1" />
                      Pedir
                    </a>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center whitespace-nowrap text-xs font-bold uppercase tracking-wider h-8 px-4 rounded-full text-white transition-all shadow-sm cursor-pointer border-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Pedir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-card rounded-2xl border border-dashed border-border/50 shadow-sm">
          <ShoppingBag className="size-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground font-medium">No se encontraron productos en esta sección.</p>
        </div>
      )}
    </div>
  )
}
