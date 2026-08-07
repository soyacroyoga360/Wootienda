"use client"

import { useState, useMemo } from "react"
import { Search, ShoppingBag, MessageCircle, X } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

interface Tokens {
  text: string
  muted: string
  border: string
  fade: string
  surface: string
  chipBg: string
  chipText: string
}

interface ProductCatalogProps {
  products: Product[]
  primaryColor: string
  whatsapp: string | null
  theme: string
  businessEmail: string | null
  businessName: string
  bannerUrl: string
  tokens: Tokens
}

/* ------------------------------------------------------- círculo de categoría */
function CategoryCircle({
  id,
  label,
  image,
  active,
  primaryColor,
  tokens,
  onSelect,
}: {
  id: string
  label: string
  image: string
  active: boolean
  primaryColor: string
  tokens: Tokens
  onSelect: (id: string) => void
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      className="flex flex-col items-center gap-2 shrink-0 w-[66px] bg-transparent border-0 cursor-pointer p-0"
    >
      <div
        className="w-[66px] h-[66px] rounded-full overflow-hidden transition-all duration-300"
        style={{
          boxShadow: active ? `0 0 0 2px ${primaryColor}, 0 0 0 5px ${tokens.fade}` : "none",
          opacity: active ? 1 : 0.72,
        }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={label} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: tokens.surface }}>
            <ShoppingBag className="size-5" style={{ color: tokens.muted }} />
          </div>
        )}
      </div>
      <span
        className="text-[11px] text-center truncate w-full"
        style={{ fontWeight: active ? 700 : 600, color: active ? tokens.text : tokens.muted }}
      >
        {label}
      </span>
    </button>
  )
}

export function ProductCatalog({
  products,
  primaryColor,
  whatsapp,
  theme,
  businessEmail,
  businessName,
  bannerUrl,
  tokens,
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [detail, setDetail] = useState<Product | null>(null)

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [isSendingLead, setIsSendingLead] = useState(false)

  const isDark = theme === "oscuro" || theme === "glassmorphism" || theme === "neon-glow"

  /**
   * Cada categoría se representa con la foto del primer producto que tenga
   * imagen dentro de esa categoría. "Todos" usa el banner del negocio.
   */
  const categories = useMemo(() => {
    const map = new Map<string, string>()
    products.forEach((p) => {
      if (!p.category) return
      if (!map.has(p.category) || (!map.get(p.category) && p.image_url)) {
        map.set(p.category, p.image_url || "")
      }
    })
    return Array.from(map.entries()).map(([name, image]) => ({ name, image }))
  }, [products])

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    const matchesCategory =
      selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  /**
   * Ritmo del catálogo: 1 destacado ancho, luego 2 en pareja, y se repite.
   * Evita que la rejilla se lea como una tabla uniforme.
   */
  const rows = useMemo(() => {
    const out: { kind: "featured" | "pair"; items: Product[] }[] = []
    let i = 0
    while (i < filtered.length) {
      out.push({ kind: "featured", items: [filtered[i]] })
      i += 1
      if (i < filtered.length) {
        out.push({ kind: "pair", items: filtered.slice(i, i + 2) })
        i += 2
      }
    }
    return out
  }, [filtered])

  const modalBg = isDark ? "#111113" : "#ffffff"
  const modalText = isDark ? "#ffffff" : "#1b1917"
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 12,
    border: `1px solid ${isDark ? "#2e2e33" : "#e2dcd3"}`,
    background: isDark ? "#1a1a1f" : "#fbf9f6",
    color: modalText,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  }

  const handlePedir = (product: Product) => {
    setSelectedProduct(product)
    setIsLeadModalOpen(true)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setIsSendingLead(true)
    try {
      if (businessEmail) {
        await fetch("/api/emails/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      if (whatsapp) {
        const text = `Hola ${businessName}, mi nombre es ${customerName} (Tel: ${customerPhone}). Estoy interesado en el producto: ${selectedProduct.name} ($${selectedProduct.price.toLocaleString()}).`
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
      } else {
        alert("¡Solicitud recibida! El negocio se pondrá en contacto contigo.")
      }
      setCustomerName("")
      setCustomerPhone("")
      setCustomerEmail("")
      setSelectedProduct(null)
    }
  }

  const priceTag = (value: number, big: boolean) => (
    <span
      className="shrink-0 rounded-full font-extrabold"
      style={{
        background: "#fff",
        color: "#1b1917",
        padding: big ? "7px 13px" : "5px 11px",
        fontSize: big ? 14 : 13,
      }}
    >
      ${value.toLocaleString()}
    </span>
  )

  const overlay = (strong: boolean) => ({
    background: `linear-gradient(180deg, rgba(0,0,0,0) ${strong ? 30 : 35}%, rgba(0,0,0,${strong ? 0.82 : 0.85}) 100%)`,
  })

  return (
    <div className="py-6">
      {/* Categorías en círculo + buscador */}
      <div className="flex items-center gap-3">
        <div className="flex gap-[18px] overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <CategoryCircle
            id="all"
            label="Todos"
            image={bannerUrl}
            active={selectedCategory.toLowerCase() === "all"}
            primaryColor={primaryColor}
            tokens={tokens}
            onSelect={setSelectedCategory}
          />
          {categories.map((c) => (
            <CategoryCircle
              key={c.name}
              id={c.name}
              label={c.name}
              image={c.image}
              active={selectedCategory.toLowerCase() === c.name.toLowerCase()}
              primaryColor={primaryColor}
              tokens={tokens}
              onSelect={setSelectedCategory}
            />
          ))}
        </div>
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer bg-transparent"
          style={{ border: `1px solid ${tokens.border}`, color: tokens.text }}
          aria-label="Buscar productos"
        >
          <Search className="size-[17px]" strokeWidth={1.8} />
        </button>
      </div>

      {showSearch && (
        <input
          type="text"
          autoFocus
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-4"
          style={inputStyle}
        />
      )}

      {/* Rejilla mixta */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3.5 mt-5">
          {rows.map((row, ri) =>
            row.kind === "featured" ? (
              <button
                key={row.items[0].id}
                onClick={() => setDetail(row.items[0])}
                className="relative rounded-[20px] overflow-hidden aspect-[16/10] w-full p-0 border-0 cursor-pointer bg-transparent group"
                style={{ boxShadow: isDark ? "none" : "0 8px 24px rgba(27,25,23,.08)" }}
              >
                {row.items[0].image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.items[0].image_url} alt={row.items[0].name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: tokens.surface }}>
                    <ShoppingBag className="size-10" style={{ color: tokens.muted }} />
                  </div>
                )}
                <div className="absolute inset-0" style={overlay(true)} />
                {row.items[0].category && (
                  <span
                    className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[.12em] backdrop-blur-sm"
                    style={{ background: tokens.chipBg, color: tokens.chipText }}
                  >
                    {row.items[0].category}
                  </span>
                )}
                <div className="absolute left-4 right-4 bottom-3.5 flex items-end justify-between gap-3 text-white text-left">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-[17px] font-bold tracking-tight truncate">{row.items[0].name}</h3>
                    {row.items[0].description && (
                      <p className="text-xs leading-snug text-white/70 line-clamp-1">{row.items[0].description}</p>
                    )}
                  </div>
                  {priceTag(row.items[0].price, true)}
                </div>
              </button>
            ) : (
              <div key={`pair-${ri}`} className="grid grid-cols-2 gap-3.5">
                {row.items.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDetail(p)}
                    className="relative rounded-[20px] overflow-hidden aspect-[3/4] p-0 border-0 cursor-pointer bg-transparent group"
                    style={{ boxShadow: isDark ? "none" : "0 8px 24px rgba(27,25,23,.08)" }}
                  >
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: tokens.surface }}>
                        <ShoppingBag className="size-8" style={{ color: tokens.muted }} />
                      </div>
                    )}
                    <div className="absolute inset-0" style={overlay(false)} />
                    <div className="absolute left-3.5 right-3.5 bottom-3 flex flex-col gap-1.5 text-white text-left">
                      <h3 className="text-sm font-bold leading-tight line-clamp-2">{p.name}</h3>
                      <span className="text-sm font-extrabold" style={{ color: isDark ? primaryColor : "#fff" }}>
                        ${p.price.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl mt-5" style={{ border: `1px dashed ${tokens.border}` }}>
          <ShoppingBag className="size-9 mx-auto mb-3" style={{ color: tokens.muted, opacity: 0.5 }} />
          <p className="font-medium" style={{ color: tokens.muted }}>
            No se encontraron productos en esta sección.
          </p>
        </div>
      )}

      {/* Detalle */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl"
            style={{ background: modalBg, color: modalText }}
          >
            <div className="relative aspect-[4/3] w-full">
              {detail.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={detail.image_url} alt={detail.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: tokens.surface }}>
                  <ShoppingBag className="size-14" style={{ color: tokens.muted }} />
                </div>
              )}
              <button
                onClick={() => setDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 md:p-7 space-y-4">
              <div className="flex items-center justify-between gap-3">
                {detail.category && (
                  <span
                    className="text-[10px] font-black uppercase tracking-[.14em] px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${primaryColor}1a`, color: primaryColor }}
                  >
                    {detail.category}
                  </span>
                )}
                <span className="text-2xl font-extrabold">${detail.price.toLocaleString()}</span>
              </div>

              <h3 className="text-xl font-extrabold tracking-tight">{detail.name}</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: isDark ? "rgba(255,255,255,.7)" : "#6f6862" }}>
                {detail.description || "Este producto no tiene una descripción detallada."}
              </p>

              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${isDark ? "#2e2e33" : "#ece7e0"}` }}>
                <button
                  onClick={() => setDetail(null)}
                  className="flex-1 h-12 text-[13px] font-bold rounded-2xl cursor-pointer border-0 bg-transparent"
                  style={{ color: isDark ? "rgba(255,255,255,.7)" : "#6f6862" }}
                >
                  Volver
                </button>
                <button
                  onClick={() => {
                    const p = detail
                    setDetail(null)
                    handlePedir(p)
                  }}
                  className="flex-1 h-12 text-[13px] font-bold text-white rounded-2xl flex items-center justify-center gap-2 cursor-pointer border-0 transition-transform hover:-translate-y-0.5"
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

      {/* Captura de lead */}
      {isLeadModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full sm:max-w-md p-6 rounded-t-[28px] sm:rounded-[28px] shadow-2xl"
            style={{ background: modalBg, color: modalText }}
          >
            <h3 className="text-xl font-extrabold mb-1.5">Completa tu solicitud</h3>
            <p className="text-sm mb-5" style={{ color: isDark ? "rgba(255,255,255,.65)" : "#6f6862" }}>
              Ingresa tus datos para pedir <strong>{selectedProduct.name}</strong> (${selectedProduct.price.toLocaleString()}).
            </p>

            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: isDark ? "rgba(255,255,255,.6)" : "#8a837b" }}>Tu nombre *</span>
                <input type="text" required placeholder="Ej: Juan Pérez" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: isDark ? "rgba(255,255,255,.6)" : "#8a837b" }}>Teléfono / WhatsApp *</span>
                <input type="tel" required placeholder="Ej: +57 300 123 4567" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={inputStyle} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: isDark ? "rgba(255,255,255,.6)" : "#8a837b" }}>Email (opcional)</span>
                <input type="email" placeholder="Ej: juan@gmail.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} style={inputStyle} />
              </label>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLeadModalOpen(false)
                    setSelectedProduct(null)
                  }}
                  className="flex-1 h-12 text-[13px] font-bold rounded-2xl cursor-pointer border-0 bg-transparent"
                  style={{ color: isDark ? "rgba(255,255,255,.7)" : "#6f6862" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSendingLead}
                  className="flex-1 h-12 text-[13px] font-bold text-white rounded-2xl cursor-pointer border-0 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSendingLead ? "Procesando..." : "Confirmar y pedir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
