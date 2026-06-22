import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FeedPage } from './FeedPage'
import { getPosts, type PaginatedPosts } from '../../../api/posts'
import { useSession } from '../../../api/SessionProvider'

vi.mock('../../../api/posts', () => ({
  getPosts: vi.fn(),
  likePost: vi.fn(),
  unlikePost: vi.fn(),
}))

vi.mock('../../../api/SessionProvider', () => ({
  useSession: vi.fn(),
}))

const mockedGetPosts = vi.mocked(getPosts)

const result: PaginatedPosts = {
  data: [
    {
      id: '1',
      slug: 'post-a',
      title: 'Post A',
      description: 'desc',
      thumbnailUrl: null,
      tags: [],
      author: { id: 'u1', name: 'Júlio', username: '@julio' },
      likesCount: 0,
      commentsCount: 0,
      likedByMe: false,
      createdAt: '2026-06-22T12:00:00.000Z',
    },
  ],
  meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
}

describe('FeedPage', () => {
  beforeEach(() => {
    vi.mocked(useSession).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      refresh: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('lista os posts retornados pela API', async () => {
    mockedGetPosts.mockResolvedValue(result)
    render(
      <MemoryRouter initialEntries={['/feed']}>
        <FeedPage />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Post A')).toBeInTheDocument()
  })

  it('mostra mensagem de vazio quando não há posts', async () => {
    mockedGetPosts.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    })
    render(
      <MemoryRouter initialEntries={['/feed']}>
        <FeedPage />
      </MemoryRouter>,
    )
    expect(await screen.findByText(/Nenhum post encontrado/)).toBeInTheDocument()
  })
})
