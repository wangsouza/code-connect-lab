import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button/Button'

interface CommentFormProps {
  /** Apenas usuários logados podem comentar. */
  canComment: boolean
  onSubmit: (content: string) => Promise<void> | void
  submitting?: boolean
  placeholder?: string
  submitLabel?: string
}

/** Formulário de comentário; desabilitado para visitantes (com aviso de login). */
export function CommentForm({
  canComment,
  onSubmit,
  submitting = false,
  placeholder = 'Escreva um comentário…',
  submitLabel = 'Comentar',
}: CommentFormProps) {
  const [content, setContent] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    await onSubmit(trimmed)
    setContent('')
  }

  if (!canComment) {
    return (
      <p className="text-base text-cinza-medio">
        Faça login para comentar neste post.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        aria-label="Comentário"
        placeholder={placeholder}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        className="w-full resize-y rounded bg-cinza-medio/20 p-3 text-base text-offwhite placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde-destaque"
      />
      <div className="self-end">
        <Button type="submit" disabled={submitting || !content.trim()}>
          {submitting ? 'Enviando…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
