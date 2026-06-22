import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSession } from '../../../api/SessionProvider'
import {
  getPosts,
  likePost,
  unlikePost,
  type PostSummary,
} from '../../../api/posts'
import { extractApiError } from '../../../api/client'
import { SearchBar } from '../../molecules/SearchBar/SearchBar'
import { Tabs } from '../../molecules/Tabs/Tabs'
import { PostCard } from '../../organisms/PostCard/PostCard'
import { AppLayout } from '../../templates/AppLayout/AppLayout'

export function FeedPage() {
  const { isAuthenticated } = useSession()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''

  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const result = await getPosts({ search: search || undefined })
        if (!active) return
        setPosts(result.data)
        setError('')
      } catch (err) {
        if (active)
          setError(extractApiError(err, 'Não foi possível carregar o feed.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [search])

  const handleSearch = useCallback(
    (term: string) => {
      setSearchParams(term ? { search: term } : {}, { replace: true })
    },
    [setSearchParams],
  )

  async function handleToggleLike(post: PostSummary) {
    const liked = post.likedByMe
    // Atualização otimista
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likedByMe: !liked,
              likesCount: item.likesCount + (liked ? -1 : 1),
            }
          : item,
      ),
    )
    try {
      await (liked ? unlikePost(post.id) : likePost(post.id))
    } catch {
      // Reverte em caso de erro
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                likedByMe: liked,
                likesCount: item.likesCount + (liked ? 1 : -1),
              }
            : item,
        ),
      )
    }
  }

  function handleShare(post: PostSummary) {
    const url = `${window.location.origin}/posts/${post.slug}`
    void navigator.clipboard?.writeText(url)
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-4">
          <SearchBar initialValue={search} onSearch={handleSearch} />
          <Tabs />
        </div>

        {error && <p className="text-base text-red-400">{error}</p>}

        {loading ? (
          <p className="text-lg text-offwhite">Carregando…</p>
        ) : posts.length === 0 ? (
          <p className="text-lg text-cinza-medio">
            Nenhum post encontrado{search ? ` para “${search}”` : ''}.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                canInteract={isAuthenticated}
                onToggleLike={() => handleToggleLike(post)}
                onShare={() => handleShare(post)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
