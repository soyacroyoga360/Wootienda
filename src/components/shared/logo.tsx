import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  /** "icon" = circular badge, "horizontal" = full wordmark, "both" = icon + wordmark */
  variant?: "icon" | "horizontal" | "both"
  /** Tailwind height class for the image */
  size?: "sm" | "md" | "lg"
  /** Link destination, defaults to "/" */
  href?: string
  /** Extra classes on the wrapper */
  className?: string
}

const sizes = {
  sm: { icon: 28, horizontal: 100, both: 24 },
  md: { icon: 36, horizontal: 140, both: 32 },
  lg: { icon: 48, horizontal: 180, both: 40 },
}

export function Logo({
  variant = "both",
  size = "md",
  href = "/",
  className,
}: LogoProps) {
  const s = sizes[size]

  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {(variant === "icon" || variant === "both") && (
        <Image
          src="/logo-icon.png"
          alt="Wootienda"
          width={s[variant === "icon" ? "icon" : "both"]}
          height={s[variant === "icon" ? "icon" : "both"]}
          className="shrink-0"
          priority
        />
      )}
      {(variant === "horizontal" || variant === "both") && (
        <Image
          src="/logo-horizontal.png"
          alt="Wootienda"
          width={s[variant === "horizontal" ? "horizontal" : "horizontal"]}
          height={Math.round(
            s[variant === "horizontal" ? "horizontal" : "horizontal"] / 5
          )}
          className="shrink-0 h-auto"
          style={{
            width: variant === "both" ? s.horizontal * 0.75 : s.horizontal,
          }}
          priority
        />
      )}
    </span>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
