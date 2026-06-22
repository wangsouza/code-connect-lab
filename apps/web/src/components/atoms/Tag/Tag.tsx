import type { ReactNode } from 'react'

type TagVariant = 'default' | 'active'

interface TagProps {
  children: ReactNode
  variant?: TagVariant
}

/** Chip de tecnologia/categoria exibido em posts e filtros. */
export function Tag({ children, variant = 'default' }: TagProps) {
  const variants: Record<TagVariant, string> = {
    default: 'bg-cinza-medio/30 text-offwhite',
    active: 'bg-cinza-medio text-verde-petroleo',
  }

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-sm ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
