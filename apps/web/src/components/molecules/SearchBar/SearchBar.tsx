import { useEffect, useState } from 'react'
import { MaterialIcon } from '../../atoms/MaterialIcon/MaterialIcon'

interface SearchBarProps {
  initialValue?: string
  /** Deve ser estável (ex.: useCallback) para não reiniciar o debounce. */
  onSearch: (term: string) => void
  delay?: number
}

/** Campo de busca full-text com debounce; dispara `onSearch` ao parar de digitar. */
export function SearchBar({
  initialValue = '',
  onSearch,
  delay = 400,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const id = setTimeout(() => onSearch(value.trim()), delay)
    return () => clearTimeout(id)
  }, [value, delay, onSearch])

  return (
    <div className="flex w-full items-center gap-4 rounded bg-cinza-escuro px-4 py-2 text-cinza-medio focus-within:ring-2 focus-within:ring-verde-destaque">
      <MaterialIcon name="search" className="text-2xl" />
      <input
        type="search"
        aria-label="Buscar posts"
        placeholder="Digite o que você procura"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full bg-transparent text-lg text-offwhite placeholder:text-cinza-medio focus:outline-none"
      />
    </div>
  )
}
