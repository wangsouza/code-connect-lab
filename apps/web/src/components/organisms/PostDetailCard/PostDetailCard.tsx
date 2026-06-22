import type { PostDetail } from '../../../api/posts'
import { Avatar } from '../../atoms/Avatar/Avatar'
import { Tag } from '../../atoms/Tag/Tag'
import { Thumbnail } from '../../atoms/Thumbnail/Thumbnail'
import { PostStats } from '../../molecules/PostStats/PostStats'

interface PostDetailCardProps {
  post: PostDetail
  canInteract: boolean
  onToggleLike?: () => void
  onShare?: () => void
}

/** Cabeçalho da página de detalhes: post em destaque (sem o código). */
export function PostDetailCard({
  post,
  canInteract,
  onToggleLike,
  onShare,
}: PostDetailCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-cinza-escuro">
      <div className="bg-cinza-medio p-6">
        <Thumbnail src={post.thumbnailUrl} alt={post.title} />
      </div>

      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-3xl font-semibold text-offwhite">{post.title}</h1>
        <p className="text-lg text-cinza-medio">{post.description}</p>

        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between">
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
