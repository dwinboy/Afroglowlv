import type { ReactNode } from 'react'

/**
 * Cohesive gold line-icon set for the service cards.
 * All icons share a 24 viewBox, 1.75 stroke and round caps so they read as one
 * family. lucide has no native braid / dreadlocks / razor icon, so those three
 * are custom-drawn to match the stroke weight of the rest.
 */
const PATHS: Record<string, ReactNode> = {
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </>
  ),
  razor: (
    <>
      <path d="M3 5h9a3 3 0 0 1 3 3 3 3 0 0 1-3 3H3z" />
      <path d="M8 11v10" />
    </>
  ),
  braid: (
    <>
      <path d="M9 3c0 3 6 3 6 6s-6 3-6 6 6 3 6 6" />
      <path d="M15 3c0 3-6 3-6 6s6 3 6 6-6 3-6 6" />
    </>
  ),
  dread: (
    <>
      <path d="M6 3c1.5 1.9-1.5 3.1 0 5s-1.5 3.1 0 5 1.5 3.1 0 6" />
      <path d="M12 3c1.5 1.9-1.5 3.1 0 5s-1.5 3.1 0 5 1.5 3.1 0 6" />
      <path d="M18 3c1.5 1.9-1.5 3.1 0 5s-1.5 3.1 0 5 1.5 3.1 0 6" />
    </>
  ),
  crown: (
    <>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </>
  ),
  droplet: (
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
      <path d="M18.5 15l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </>
  ),
  // Barber pole (💈)
  pole: (
    <>
      <rect x="9" y="4" width="6" height="16" rx="3" />
      <path d="M9 9l6-3" />
      <path d="M9 13l6-3" />
      <path d="M9 17l6-3" />
    </>
  ),
  // Spa / treatment leaf (💆)
  flower: (
    <>
      <path d="M12 21c5-2 8-6 8-11 0 0-4 1-8 6-4-5-8-6-8-6 0 5 3 9 8 11z" />
      <path d="M12 21v-9" />
    </>
  ),
  // Nail polish (💅)
  polish: (
    <>
      <path d="M9.5 9h5v10a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2z" />
      <path d="M10.5 9V6.5h3V9" />
      <path d="M11 6.5V3h2v3.5" />
    </>
  ),
}

/**
 * Away from the homepage the service icon is stored in the database as an emoji
 * (the admin picks one from a fixed palette). Rather than migrate that data, we
 * map each emoji to a matching gold line-icon at render time; anything unmapped
 * falls back to scissors. Keeps existing services working with zero DB changes.
 */
const EMOJI_TO_ICON: Record<string, ServiceIconName> = {
  '✂️': 'scissors',
  '💈': 'pole',
  '🪒': 'razor',
  '👑': 'crown',
  '🧵': 'braid',
  '🔒': 'dread',
  '🎨': 'droplet',
  '👸': 'sparkle',
  '💆': 'flower',
  '✨': 'sparkle',
  '🌟': 'smile',
  '💅': 'polish',
}

export function ServiceGlyph({
  icon,
  size = 24,
  className,
}: {
  icon?: string | null
  size?: number
  className?: string
}) {
  const name = (icon && EMOJI_TO_ICON[icon]) || 'scissors'
  return <ServiceIcon name={name} size={size} className={className} />
}

export type ServiceIconName = keyof typeof PATHS

export function ServiceIcon({
  name,
  size = 24,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  const paths = PATHS[name]
  if (!paths) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  )
}
