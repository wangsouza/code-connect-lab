import { Link } from 'react-router-dom'
import type { PostSummary } from '../../../api/posts'
import { Avatar } from '../../atoms/Avatar/Avatar'
import { Tag } from '../../atoms/Tag/Tag'
import { Thumbnail } from '../../atoms/Thumbnail/Thumbnail'
import { PostStats } from '../../molecules/PostStats/PostStats'

interface PostCardProps {
  post: PostSummary
  canInteract: boolean
  onToggleLike?: () => void
  onShare?: () => void
}

/** Card de post exibido no grid do feed. */
export function PostCard({
  post,
  canInteract,
  onToggleLike,
  onShare,
}: PostCardProps) {
  const href = `/posts/${post.slug}`

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-cinza-escuro">
      <Link
        to={href}
        aria-label={`Abrir post: ${post.title}`}
        className="block bg-cinza-medio p-6"
      >
        <Thumbnail src={post.thumbnailUrl} alt={post.title} />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <Link
            to={href}
            className="text-lg font-semibold text-offwhite hover:text-verde-destaque"
          >
            {post.title}
          </Link>
          <p className="line-clamp-3 text-base text-cinza-medio">
            {post.description}
          </p>
        </div>

        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between">
          <PostStats
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            likedByMe={post.likedByMe}
            canInteract={canInteract}
            onToggleLike={onToggleLike}
            onShare={onShare}
          />
          <div className="flex items-center gap-2 text-sm text-cinza-medio">
            <Avatar name={post.author.name} />
            <span className="font-semibold">{post.author.username}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
