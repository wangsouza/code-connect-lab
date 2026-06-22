import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSession } from '../../../api/SessionProvider'
import {
  createComment,
  getPost,
  likePost,
  unlikePost,
  type PostDetail,
} from '../../../api/posts'
import { extractApiError } from '../../../api/client'
import { CommentForm } from '../../molecules/CommentForm/CommentForm'
import { CodeBlock } from '../../organisms/CodeBlock/CodeBlock'
import { CommentThread } from '../../organisms/CommentThread/CommentThread'
import { PostDetailCard } from '../../organisms/PostDetailCard/PostDetailCard'
import { AppLayout } from '../../templates/AppLayout/AppLayout'

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useSession()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!slug) return
    let active = true
    async function load() {
      setLoading(true)
      try {
        const result = await getPost(slug!)
        if (!active) return
        setPost(result)
        setError('')
      } catch (err) {
        if (active)
          setError(extractApiError(err, 'Não foi possível carregar o post.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [slug])

  async function handleToggleLike() {
    if (!post) return
    const liked = post.likedByMe
    setPost({
      ...post,
      likedByMe: !liked,
      likesCount: post.likesCount + (liked ? -1 : 1),
    })
    try {
      await (liked ? unlikePost(post.id) : likePost(post.id))
    } catch {
      setPost({
        ...post,
        likedByMe: liked,
        likesCount: post.likesCount + (liked ? 1 : -1),
      })
    }
  }

  function handleShare() {
    if (!post) return
    void navigator.clipboard?.writeText(window.location.href)
  }

  async function handleComment(content: string, parentId?: string) {
    if (!post) return
    setSubmitting(true)
    try {
      const created = await createComment(post.id, { content, parentId })
      setPost((current) => {
        if (!current) return current
        if (parentId) {
          return {
            ...current,
            commentsCount: current.commentsCount + 1,
            comments: current.comments.map((comment) =>
              comment.id === parentId
                ? { ...comment, replies: [...comment.replies, created] }
                : comment,
            ),
          }
        }
        return {
          ...current,
          commentsCount: current.commentsCount + 1,
          comments: [...current.comments, created],
        }
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      {loading ? (
        <p className="text-lg text-offwhite">Carregando…</p>
      ) : error || !post ? (
        <p className="text-base text-red-400">
          {error || 'Post não encontrado.'}
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          <PostDetailCard
            post={post}
            canInteract={isAuthenticated}
            onToggleLike={handleToggleLike}
            onShare={handleShare}
          />

          <CodeBlock code={post.content} />

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-offwhite">Comentários</h2>
            <CommentForm
              canComment={isAuthenticated}
              onSubmit={(content) => handleComment(content)}
              submitting={submitting}
            />
            <CommentThread
              comments={post.comments}
              canComment={isAuthenticated}
              onReply={(parentId, content) => handleComment(content, parentId)}
            />
          </section>
        </div>
      )}
    </AppLayout>
  )
}
