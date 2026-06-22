import type { HTMLAttributes } from 'react'

interface MaterialIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Nome do ícone do Material Icons (ex: `feed`, `logout`, `code`). */
  name: string
}

/**
 * Renderiza um ícone do Material Icons (fonte carregada no index.html).
 * Decorativo por padrão (`aria-hidden`); passe `aria-label` quando o ícone
 * comunicar significado por si só.
 */
export function MaterialIcon({
  name,
  className = '',
  ...props
}: MaterialIconProps) {
  return (
    <span
      aria-hidden={props['aria-label'] ? undefined : true}
      className={`material-icons select-none leading-none ${className}`}
      {...props}
    >
      {name}
    </span>
  )
}
