import { useState } from 'react'
import type { Comment } from '../../../api/posts'
import { Avatar } from '../../atoms/Avatar/Avatar'
import { CommentForm } from '../../molecules/CommentForm/CommentForm'

interface CommentThreadProps {
  comments: Comment[]
  canComment: boolean
  onReply: (parentId: string, content: string) => Promise<void>
}

function CommentItem({
  comment,
  canComment,
  onReply,
}: {
  comment: Comment
  canComment: boolean
  onReply: (parentId: string, content: string) => Promise<void>
}) {
  const [showReplies, setShowReplies] = useState(false)
  const [replying, setReplying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const hasReplies = comment.replies.length > 0

  async function handleReply(content: string) {
    setSubmitting(true)
    try {
      await onReply(comment.id, content)
      setReplying(false)
      setShowReplies(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <Avatar name={comment.author.name} size={24} />
        <p className="text-base text-offwhite">
          <span className="font-semibold text-verde-destaque">
            {comment.author.username}
          </span>{' '}
          {comment.content}
        </p>
      </div>

      <div className="ml-8 flex gap-4 text-sm text-cinza-medio">
        {canComment && (
          <button
            type="button"
            onClick={() => setReplying((value) => !value)}
            className="hover:text-offwhite"
          >
            Responder
          </button>
        )}
        {hasReplies && (
          <button
            type="button"
            onClick={() => setShowReplies((value) => !value)}
            className="hover:text-offwhite"
          >
            {showReplies ? 'Ocultar respostas' : 'Ver respostas'}
          </button>
        )}
      </div>

      {replying && (
        <div className="ml-8">
          <CommentForm
            canComment={canComment}
            onSubmit={handleReply}
            submitting={submitting}
            placeholder="Escreva uma resposta…"
            submitLabel="Responder"
          />
        </div>
      )}

      {showReplies && hasReplies && (
        <ul className="ml-8 flex flex-col gap-3 border-l border-cinza-medio/30 pl-4">
          {comment.replies.map((reply) => (
            <li key={reply.id} className="flex items-start gap-2">
              <Avatar name={reply.author.name} size={24} />
              <p className="text-base text-offwhite">
                <span className="font-semibold text-verde-destaque">
                  {reply.author.username}
                </span>{' '}
                {reply.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** Lista de comentários com respostas em um nível. */
export function CommentThread({
  comments,
  canComment,
  onReply,
}: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <p className="text-base text-cinza-medio">
        Ainda não há comentários. Seja o primeiro!
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          canComment={canComment}
          onReply={onReply}
        />
      ))}
    </ul>
  )
}
