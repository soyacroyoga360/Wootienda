"use client"

import { useState, useRef } from "react"
import { 
  Search, 
  ShoppingBag, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Coffee,
  GlassWater,
  Utensils,
  Cake,
  Shirt,
  Heart,
  Tv,
  Tag,
  Package,
  Sparkles,
  X
} from "lucide-react"

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
  businessEmail: string | null
  businessName: string
}

// Maps category name to appropriate Lucide Icon dynamically
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase().trim()
  if (name === "all" || name === "todos") return Sparkles
  if (name.includes("cafe") || name.includes("coffee") || name.includes("grano") || name.includes("taza") || name.includes("mug")) return Coffee
  if (
    name.includes("bebida") || 
    name.includes("drink") || 
    name.includes("jugo") || 
    name.includes("juice") || 
    name.includes("soda") || 
    name.includes("agua") || 
    name.includes("water") || 
    name.includes("licor") || 
    name.includes("beer") || 
    name.includes("coctel") ||
    name.includes("gaseosa")
  ) return GlassWater
  if (
    name.includes("comida") || 
    name.includes("food") || 
    name.includes("plato") || 
    name.includes("cena") || 
    name.includes("almuerzo") || 
    name.includes("lunch") || 
    name.includes("entree") || 
    name.includes("sushi") || 
    name.includes("pizza") || 
    name.includes("burger") || 
    name.includes("roll") ||
    name.includes("carne") ||
    name.includes("ensalada")
  ) return Utensils
  if (
    name.includes("postre") || 
    name.includes("dessert") || 
    name.includes("torta") || 
    name.includes("cake") || 
    name.includes("dulce") || 
    name.includes("sweet") || 
    name.includes("pan") || 
    name.includes("bakery") || 
    name.includes("croissant") || 
    name.includes("reposteria") ||
    name.includes("galleta")
  ) return Cake
  if (
    name.includes("ropa") || 
    name.includes("vestir") || 
    name.includes("clothing") || 
    name.includes("moda") || 
    name.includes("fashion") || 
    name.includes("camisa") || 
    name.includes("shirt") || 
    name.includes("calzado") || 
    name.includes("zapatos") ||
    name.includes("pantalon")
  ) return Shirt
  if (
    name.includes("salud") || 
    name.includes("belleza") || 
    name.includes("beauty") || 
    name.includes("fit") || 
    name.includes("gym") || 
    name.includes("cuidado") || 
    name.includes("skin") || 
    name.includes("spa") ||
    name.includes("maquillaje")
  ) return Heart
  if (
    name.includes("electro") || 
    name.includes("tech") || 
    name.includes("celular") || 
    name.includes("pc") || 
    name.includes("tv") || 
    name.includes("audio") || 
    name.includes("tecnologia") ||
    name.includes("accesorios")
  ) return Tv
  if (
    name.includes("promo") || 
    name.includes("descuento") || 
    name.includes("oferta") || 
    name.includes("sale") || 
    name.includes("descuentos") || 
    name.includes("promociones")
  ) return Tag
  return Package
}

export function ProductCatalog({ products, primaryColor, whatsapp, theme, businessEmail, businessName }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null)

  // Lead modal states
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [isSendingLead, setIsSendingLead] = useState(false)

  // Reference for the category slider scroll
  const categoryScrollRef = useRef<HTMLDivElement>(null)

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
  // DEFAULT / CLARO: Pure clean white with soft premium shadow
  let cardClass = "bg-white text-slate-900 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center"
  let titleClass = "font-bold text-sm md:text-base leading-tight mb-1 text-slate-900 transition-colors"
  let descClass = "text-slate-500 text-[10px] md:text-xs mb-3 line-clamp-2 max-w-[200px] leading-relaxed"
  let textClass = "font-extrabold flex items-baseline gap-0.5 text-slate-900"
  
  // Modal container themes
  let modalBg = "bg-white text-slate-900 border border-slate-100"
  let modalInputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"

  // Base background for circular button ring offsets
  let ringOffsetBg = "#ffffff" // claro

  if (theme === "oscuro") {
    cardClass = "bg-[#1a1a1a] text-white border border-[#262626] shadow-md rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
    titleClass = "font-bold text-sm md:text-base leading-tight mb-1 text-white transition-colors"
    descClass = "text-gray-400 text-[10px] md:text-xs mb-3 line-clamp-2 max-w-[200px] leading-relaxed"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-white"
    modalBg = "bg-[#1a1a1a] text-white border border-[#262626]"
    modalInputClass = "w-full px-4 py-2.5 rounded-xl border border-[#333] bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
    ringOffsetBg = "#121212"
  } else if (theme === "glassmorphism") {
    cardClass = "bg-white/10 dark:bg-black/25 backdrop-blur-md text-white border border-white/15 shadow-2xl rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 flex flex-col items-center"
    titleClass = "font-bold text-sm md:text-base leading-tight mb-1 text-white drop-shadow-md"
    descClass = "text-gray-200 text-[10px] md:text-xs mb-3 line-clamp-2 max-w-[200px] leading-relaxed"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-white"
    modalBg = "bg-[#1e1b4b]/95 backdrop-blur-xl text-white border border-white/20"
    modalInputClass = "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40"
    ringOffsetBg = "#150b24"
  } else if (theme === "neon-glow") {
    cardClass = "bg-[#09090b] text-white border border-primary/20 shadow-[0_0_15px_rgba(var(--user-primary-rgb,238,29,109),0.07)] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--user-primary-rgb,238,29,109),0.15)] rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
    titleClass = "font-bold text-sm md:text-base leading-tight mb-1 text-white drop-shadow-[0_0_10px_rgba(var(--user-primary-rgb,238,29,109),0.2)]"
    descClass = "text-gray-400 text-[10px] md:text-xs mb-3 line-clamp-2 max-w-[200px] leading-relaxed"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-white"
    modalBg = "bg-[#09090b] text-white border border-primary/30 shadow-[0_0_25px_rgba(var(--user-primary-rgb,238,29,109),0.15)]"
    modalInputClass = "w-full px-4 py-2.5 rounded-xl border border-[#27272a] bg-[#121214] text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
    ringOffsetBg = "#030303"
  } else if (theme === "gradient-mesh") {
    cardClass = "bg-card/75 backdrop-blur-sm text-foreground border border-border/40 shadow-md rounded-2xl overflow-hidden hover:bg-card hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
    titleClass = "font-bold text-sm md:text-base leading-tight mb-1 text-foreground transition-colors"
    descClass = "text-muted-foreground text-[10px] md:text-xs mb-3 line-clamp-2 max-w-[200px] leading-relaxed"
    textClass = "font-extrabold flex items-baseline gap-0.5 text-foreground"
    modalBg = "bg-white/90 dark:bg-[#120a2a]/90 backdrop-blur-md text-slate-900 dark:text-white border border-indigo-100 dark:border-purple-950/30"
    modalInputClass = "w-full px-4 py-2.5 rounded-xl border border-indigo-50 dark:border-purple-950/20 bg-white/50 dark:bg-black/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
    ringOffsetBg = "#100620"
  }

  // Scroll categories list left or right
  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const { scrollLeft, clientWidth } = categoryScrollRef.current
      const scrollAmount = clientWidth * 0.6
      categoryScrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      })
    }
  }

  const handlePedirClick = (product: Product) => {
    setSelectedProduct(product)
    setIsLeadModalOpen(true)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    setIsSendingLead(true)
    try {
      // 1. Send inquiry email in background
      if (businessEmail) {
        await fetch("/api/emails/inquiry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessEmail,
            businessName,
            customerName,
            customerPhone,
            customerEmail,
            productName: selectedProduct.name,
            productPrice: selectedProduct.price,
          }),
        })
      }
    } catch (err) {
      console.error("Error sending lead email:", err)
    } finally {
      setIsSendingLead(false)
      setIsLeadModalOpen(false)
      
      // 2. Redirect to WhatsApp or show success alert
      if (whatsapp) {
        const textMessage = `Hola ${businessName}, mi nombre es ${customerName} (Tel: ${customerPhone}). Estoy interesado en el producto: ${selectedProduct.name} ($${selectedProduct.price.toLocaleString()}).`
        window.open(
          `https://wa.me/${whatsapp}?text=${encodeURIComponent(textMessage)}`,
          "_blank",
          "noopener,noreferrer"
        )
      } else {
        alert("¡Solicitud recibida! El negocio se pondrá en contacto contigo.")
      }

      // Reset form states
      setCustomerName("")
      setCustomerPhone("")
      setCustomerEmail("")
      setSelectedProduct(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Carousel and Search Container */}
      <div className="flex flex-col gap-5">
        
        {/* Category Circles Carousel */}
        <div className="relative w-full group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scrollCategories("left")}
            className="absolute left-0 top-6 z-10 p-1 rounded-full bg-background/90 hover:bg-background border border-border/50 shadow-md hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 duration-200 cursor-pointer hidden md:flex items-center justify-center size-7"
            title="Anterior"
          >
            <ChevronLeft className="size-3.5 text-foreground" />
          </button>

          {/* Scroll Container */}
          {/* gap-3 on mobile allows 4 circles to fit perfectly on most phone screens */}
          <div
            ref={categoryScrollRef}
            className="flex items-start gap-3 md:gap-6 overflow-x-auto scrollbar-none px-2 md:px-8 py-2 scroll-smooth"
          >
            {/* Option "All / Todos" */}
            {(() => {
              const Icon = getCategoryIcon("all")
              const isActive = selectedCategory === "all"
              return (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="flex flex-col items-center gap-1.5 md:gap-2 group cursor-pointer shrink-0 border-0 bg-transparent outline-none focus:outline-none"
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ring-offset-2 ${
                      isActive
                        ? "scale-105 ring-2"
                        : "hover:scale-105 border hover:border-muted-foreground/30"
                    }`}
                    style={{
                      backgroundColor: isActive ? primaryColor : "rgba(var(--user-primary-rgb, 238, 29, 109), 0.04)",
                      color: isActive ? "#ffffff" : primaryColor,
                      borderColor: isActive ? primaryColor : "rgba(var(--user-primary-rgb, 238, 29, 109), 0.12)",
                      boxShadow: isActive ? `0 0 12px ${primaryColor}35` : "none",
                      ["--tw-ring-color" as any]: primaryColor,
                      ["--tw-ring-offset-color" as any]: ringOffsetBg
                    }}
                  >
                    <Icon className="size-4.5 md:size-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span
                    className={`text-[9.5px] md:text-[11px] font-bold uppercase tracking-wider text-center max-w-[65px] md:max-w-[80px] truncate transition-colors duration-200 ${
                      isActive ? "opacity-100 font-extrabold" : "opacity-60 group-hover:opacity-100 text-muted-foreground"
                    }`}
                  >
                    Todos
                  </span>
                </button>
              )
            })()}

            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat)
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="flex flex-col items-center gap-1.5 md:gap-2 group cursor-pointer shrink-0 border-0 bg-transparent outline-none focus:outline-none"
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ring-offset-2 ${
                      isActive
                        ? "scale-105 ring-2"
                        : "hover:scale-105 border hover:border-muted-foreground/30"
                    }`}
                    style={{
                      backgroundColor: isActive ? primaryColor : "rgba(var(--user-primary-rgb, 238, 29, 109), 0.04)",
                      color: isActive ? "#ffffff" : primaryColor,
                      borderColor: isActive ? primaryColor : "rgba(var(--user-primary-rgb, 238, 29, 109), 0.12)",
                      boxShadow: isActive ? `0 0 12px ${primaryColor}35` : "none",
                      ["--tw-ring-color" as any]: primaryColor,
                      ["--tw-ring-offset-color" as any]: ringOffsetBg
                    }}
                  >
                    <Icon className="size-4.5 md:size-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span
                    className={`text-[9.5px] md:text-[11px] font-bold uppercase tracking-wider text-center max-w-[65px] md:max-w-[80px] truncate transition-colors duration-200 ${
                      isActive ? "opacity-100 font-extrabold" : "opacity-60 group-hover:opacity-100 text-muted-foreground"
                    }`}
                  >
                    {cat}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollCategories("right")}
            className="absolute right-0 top-6 z-10 p-1  rounded-full bg-background/90 hover:bg-background border border-border/50 shadow-md hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 duration-200 cursor-pointer hidden md:flex items-center justify-center size-7"
            title="Siguiente"
          >
            <ChevronRight className="size-3.5 text-foreground" />
          </button>
        </div>

        {/* Live Search bar */}
        <div className="relative w-full max-w-md mx-auto px-2 md:px-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 transition-shadow"
            style={{ "--tw-ring-color": `${primaryColor}30` } as React.CSSProperties}
          />
          <Search className="absolute left-6 md:left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </div>

      {/* Product list rendering - TWO COLUMNS on mobile (grid-cols-2) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => setSelectedProductDetail(product)}
              className={`group p-3 md:p-4 cursor-pointer ${cardClass}`}
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full bg-secondary/15 rounded-xl overflow-hidden shrink-0 mb-3">
                {product.image_url ? (
                  <>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Hover glassmorphism overlay indicating clickable card */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm shadow-sm scale-90 group-hover:scale-100 transition-transform duration-300">
                        Ver detalles
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 text-muted-foreground/30">
                    <ShoppingBag className="size-8 md:size-12 stroke-[1.5]" />
                  </div>
                )}
              </div>

              {/* Product Details (Centered) */}
              <div className="flex-1 flex flex-col items-center w-full">
                {product.category && (
                  <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest text-primary mb-0.5 md:mb-1">
                    {product.category}
                  </span>
                )}
                
                <h3 className={`text-center ${titleClass} line-clamp-1`}>
                  {product.name}
                </h3>
                
                <p className={`text-center ${descClass}`}>
                  {product.description || "Sin descripción disponible."}
                </p>

                {/* Price and CTA Button */}
                <div className="mt-auto w-full flex flex-col items-center gap-2.5">
                  <span className={textClass}>
                    <span className="text-[10px] md:text-xs font-semibold pr-0.5">$</span>
                    <span className="text-sm md:text-lg font-extrabold">{product.price.toLocaleString()}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePedirClick(product)
                    }}
                    className="w-full inline-flex items-center justify-center whitespace-nowrap text-[10px] md:text-xs font-bold uppercase tracking-wider h-8 md:h-9 px-3 md:px-4 rounded-full text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer border-0 flex items-center justify-center gap-1 md:gap-1.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <MessageCircle className="size-3 md:size-3.5" />
                    Pedir
                  </button>
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

      {/* Product Detail Modal ("Ver más") */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-lg p-0 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden ${modalBg}`}>
            {/* Header image with close button */}
            <div className="relative aspect-[4/3] w-full bg-secondary/10">
              {selectedProductDetail.image_url ? (
                <img
                  src={selectedProductDetail.image_url}
                  alt={selectedProductDetail.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-muted-foreground/30">
                  <ShoppingBag className="size-16 stroke-[1.2]" />
                </div>
              )}
              {/* Close Button */}
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border-0 cursor-pointer shadow-md flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between gap-2">
                {selectedProductDetail.category && (
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${primaryColor}15`, 
                      color: primaryColor 
                    }}
                  >
                    {selectedProductDetail.category}
                  </span>
                )}
                <span className={`${textClass} text-lg md:text-2xl`}>
                  <span className="text-sm font-semibold pr-0.5">$</span>
                  <span>{selectedProductDetail.price.toLocaleString()}</span>
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight">
                  {selectedProductDetail.name}
                </h3>
                <div className="max-h-32 md:max-h-40 overflow-y-auto scrollbar-thin pr-1">
                  <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">
                    {selectedProductDetail.description || "Este producto no tiene una descripción detallada disponible."}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full hover:bg-secondary/15 transition-colors cursor-pointer border-0"
                >
                  Volver al menú
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProductDetail
                    setSelectedProductDetail(null)
                    handlePedirClick(prod)
                  }}
                  className="flex-1 py-3 text-xs md:text-sm font-black uppercase tracking-wider text-white rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="size-4" />
                  Pedir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead capture modal */}
      {isLeadModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all duration-300 ${modalBg}`}>
            <h3 className="text-xl font-bold mb-2">Completa tu solicitud</h3>
            <p className="text-sm opacity-80 mb-5">
              Ingresa tus datos para procesar tu interés en <strong>{selectedProduct.name}</strong> (${selectedProduct.price.toLocaleString()}).
            </p>
            
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-90">Tu Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={modalInputClass}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-90">Tu Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +57 300 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-90">Tu Email (Opcional)</label>
                <input
                  type="email"
                  placeholder="Ej: juan@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={modalInputClass}
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLeadModalOpen(false)
                    setSelectedProduct(null)
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-secondary/10 transition-colors cursor-pointer border-0"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSendingLead}
                  className="px-6 py-2 text-sm font-bold text-white rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSendingLead ? "Procesando..." : "Confirmar y Pedir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
