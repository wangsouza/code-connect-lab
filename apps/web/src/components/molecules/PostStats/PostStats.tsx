import { MaterialIcon } from '../../atoms/MaterialIcon/MaterialIcon'

interface PostStatsProps {
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  /** Habilita o botão de curtir (apenas usuários logados). */
  canInteract: boolean
  onToggleLike?: () => void
  onShare?: () => void
}

/** Linha de ações de um post: curtir, compartilhar e contagem de comentários. */
export function PostStats({
  likesCount,
  commentsCount,
  likedByMe,
  canInteract,
  onToggleLike,
  onShare,
}: PostStatsProps) {
  return (
    <div className="flex items-center gap-4 text-cinza-medio">
      <button
        type="button"
        onClick={onToggleLike}
        disabled={!canInteract}
        aria-pressed={likedByMe}
        aria-label={likedByMe ? 'Remover curtida' : 'Curtir'}
        title={canInteract ? undefined : 'Faça login para curtir'}
        className={`flex flex-col items-center transition-colors enabled:hover:text-verde-destaque disabled:cursor-not-allowed disabled:opacity-60 ${
          likedByMe ? 'text-verde-destaque' : ''
        }`}
      >
        <MaterialIcon name="code" className="text-2xl" />
        <span className="text-sm">{likesCount}</span>
      </button>

      <button
        type="button"
        onClick={onShare}
        aria-label="Compartilhar"
        className="flex flex-col items-center transition-colors hover:text-verde-destaque"
      >
        <MaterialIcon name="share" className="text-2xl" />
      </button>

      <span className="flex flex-col items-center" aria-label="Comentários">
        <MaterialIcon name="chat" className="text-2xl" />
        <span className="text-sm">{commentsCount}</span>
      </span>
    </div>
  )
}
