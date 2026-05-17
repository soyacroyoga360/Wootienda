import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/shared/header"
import {
  formatBlogDate,
  getAllBlogPosts,
  getBlogPost,
  markdownToHtml,
} from "@/lib/blog"
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post || !post.published) {
    return { title: "Articulo no encontrado" }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post || !post.published) {
    notFound()
  }

  const html = markdownToHtml(post.content)

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <article>
          <header className="border-b border-border bg-secondary/25">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-8"
              >
                <ArrowLeft className="size-4" />
                Volver al blog
              </Link>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-5">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {formatBlogDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  {post.readingMinutes} min
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative aspect-[16/8] min-h-64 rounded-2xl overflow-hidden bg-muted border border-border shadow-sm mb-10">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </article>
      </main>
    </>
  )
}
