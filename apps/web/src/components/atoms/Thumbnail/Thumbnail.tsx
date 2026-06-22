import { useState } from 'react'
import { MaterialIcon } from '../MaterialIcon/MaterialIcon'

interface ThumbnailProps {
  src?: string | null
  alt: string
}

/**
 * Thumbnail do post. Quando a imagem está ausente ou falha ao carregar,
 * exibe um placeholder com gradiente e ícone de código, garantindo que o
 * card mantenha o layout mesmo sem imagem.
 */
export function Thumbnail({ src, alt }: ThumbnailProps) {
  const [failed, setFailed] = useState(false)
  const showPlaceholder = !src || failed

  return (
    <div className="h-60 w-full overflow-hidden rounded-lg bg-cinza-medio">
      {showPlaceholder ? (
        <div
          role="img"
          aria-label={`${alt} (sem imagem)`}
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cinza-escuro to-verde-petroleo"
        >
          <MaterialIcon
            name="code"
            className="text-5xl text-verde-destaque/70"
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}
