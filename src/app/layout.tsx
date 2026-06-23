import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Inter, Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: {
    default: "Wootienda — Tu presencia digital al instante",
    template: "%s | Wootienda",
  },
  description:
    "Registra tu negocio y obtén una landing page profesional con URL personalizada. Genera contenido con IA.",
  keywords: [
    "tienda online",
    "landing page",
    "negocio digital",
    "directorio",
    "Wootienda",
  ],
  openGraph: {
    title: "Wootienda — Tu presencia digital al instante",
    description:
      "Registra tu negocio y obtén una landing page profesional con URL personalizada.",
    type: "website",
    locale: "es_MX",
    siteName: "Wootienda",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: "var(--font-plus-jakarta)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
