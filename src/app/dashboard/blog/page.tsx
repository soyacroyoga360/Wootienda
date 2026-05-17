import Link from "next/link"
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog"
import { BookOpenText, FileText, FolderOpen, Plus } from "lucide-react"

export const metadata = {
  title: "Blog",
}

export default function DashboardBlogPage() {
  const posts = getAllBlogPosts({ includeDrafts: true })
  const publishedCount = posts.filter((post) => post.published).length

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Blog</h1>
          <p className="text-muted-foreground">
            Administra el contenido editorial que se publica desde archivos Markdown.
          </p>
        </div>
        <Link
          href="/blog"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
        >
          <BookOpenText className="size-4" />
          Ver blog publico
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-2">Articulos</p>
          <p className="text-3xl font-bold">{posts.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-2">Publicados</p>
          <p className="text-3xl font-bold">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-2">Fuente</p>
          <p className="text-base font-semibold">content/blog</p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-8">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
            <Plus className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold mb-1">Crear un nuevo articulo</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Agrega un archivo `.md` en `content/blog` con frontmatter: title,
              description, date, author, category, coverImage y published. El nombre
              del archivo sera el slug publico del articulo.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-secondary p-3 text-muted-foreground">
                <FileText className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="font-semibold">{post.title}</h2>
                  <span className={post.published ? "text-xs font-medium text-success" : "text-xs font-medium text-muted-foreground"}>
                    {post.published ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatBlogDate(post.date)}</span>
                  <span>{post.category}</span>
                  <span>{post.slug}.md</span>
                </div>
              </div>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary transition-colors"
            >
              <FolderOpen className="size-4" />
              Abrir
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
