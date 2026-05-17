import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/shared/header"
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog"
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react"

export const metadata = {
  title: "Blog",
  description: "Guias y recursos para crear y mejorar la presencia digital de tu negocio.",
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-secondary/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-primary mb-3">Blog Wootienda</p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
                Recursos para negocios que quieren vender mejor en internet
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Guias, ideas y buenas practicas para organizar tu tienda digital,
                publicar tu catalogo y convertir visitas en conversaciones reales.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {featuredPost ? (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-stretch rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all mb-10"
            >
              <div className="relative min-h-72 lg:min-h-full bg-muted">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-5">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                    {featuredPost.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {formatBlogDate(featuredPost.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4" />
                    {featuredPost.readingMinutes} min
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {featuredPost.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Leer articulo
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Aun no hay articulos publicados</h2>
              <p className="text-muted-foreground">
                Crea archivos Markdown en `content/blog` para publicarlos aqui.
              </p>
            </div>
          )}

          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mb-3">
                      <span className="font-semibold text-primary">{post.category}</span>
                      <span>{post.readingMinutes} min</span>
                    </div>
                    <h2 className="text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
