import { useState } from 'react'

interface AvatarProps {
  /** Nome do usuário, usado para o fallback por inicial e acessibilidade. */
  name: string
  src?: string | null
  size?: number
}

/**
 * Avatar do usuário. Se não houver imagem (ou ela falhar), exibe um
 * placeholder com a inicial do nome sobre o verde de destaque.
 */
export function Avatar({ name, src, size = 32 }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  const dimension = { width: size, height: size }

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={name}
        style={dimension}
        className="flex shrink-0 items-center justify-center rounded-full bg-verde-destaque text-sm font-semibold text-verde-petroleo"
      >
        {initial}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      style={dimension}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-cover"
    />
  )
}
