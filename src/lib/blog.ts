import fs from "node:fs"
import path from "node:path"

export type BlogPost = {
  slug: string
  title: string
  seoTitle: string
  description: string
  date: string
  modifiedDate: string
  author: string
  category: string
  keywords: string[]
  coverImage: string
  published: boolean
  content: string
  readingMinutes: number
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

function parseFrontmatter(fileContent: string) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { metadata: {} as Record<string, string>, content: fileContent }
  }

  const metadata = match[1].split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const separatorIndex = line.indexOf(":")
    if (separatorIndex === -1) return acc

    const key = line.slice(0, separatorIndex).trim()
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "")

    acc[key] = value
    return acc
  }, {})

  return { metadata, content: match[2].trim() }
}

function getReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export function getAllBlogPosts({ includeDrafts = false } = {}) {
  if (!fs.existsSync(BLOG_DIR)) return []

  return fs
    .readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      const filePath = path.join(BLOG_DIR, fileName)
      const { metadata, content } = parseFrontmatter(fs.readFileSync(filePath, "utf8"))

      return {
        slug,
        title: metadata.title ?? slug,
        seoTitle: metadata.seoTitle ?? metadata.title ?? slug,
        description: metadata.description ?? "",
        date: metadata.date ?? "",
        modifiedDate: metadata.modifiedDate ?? metadata.date ?? "",
        author: metadata.author ?? "Equipo Wootienda",
        category: metadata.category ?? "Blog",
        keywords: (metadata.keywords ?? "")
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        coverImage: metadata.coverImage ?? "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=1600&auto=format&fit=crop",
        published: metadata.published !== "false",
        content,
        readingMinutes: getReadingMinutes(content),
      } satisfies BlogPost
    })
    .filter((post) => includeDrafts || post.published)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getBlogPost(slug: string) {
  return getAllBlogPosts({ includeDrafts: true }).find((post) => post.slug === slug)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function renderInline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

export function markdownToHtml(markdown: string) {
  const blocks = markdown.split(/\r?\n\s*\r?\n/)
  let skippedDocumentTitle = false

  return blocks
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""

      if (trimmed.startsWith("### ")) {
        return `<h3>${renderInline(trimmed.slice(4))}</h3>`
      }

      if (trimmed.startsWith("## ")) {
        return `<h2>${renderInline(trimmed.slice(3))}</h2>`
      }

      if (trimmed.startsWith("# ")) {
        if (!skippedDocumentTitle) {
          skippedDocumentTitle = true
          return ""
        }

        return `<h1>${renderInline(trimmed.slice(2))}</h1>`
      }

      const lines = trimmed.split(/\r?\n/)

      if (lines.every((line) => line.startsWith("- "))) {
        const items = trimmed
          .split(/\r?\n/)
          .map((line) => `<li>${renderInline(line.slice(2).trim())}</li>`)
          .join("")
        return `<ul>${items}</ul>`
      }

      return `<p>${renderInline(trimmed).replace(/\r?\n/g, "<br />")}</p>`
    })
    .join("\n")
}

export function formatBlogDate(date: string) {
  if (!date) return "Sin fecha"

  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`))
}
