import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PostDetailPage } from './PostDetailPage'
import { getPost, type PostDetail } from '../../../api/posts'
import { useSession } from '../../../api/SessionProvider'

vi.mock('../../../api/posts', () => ({
  getPost: vi.fn(),
  likePost: vi.fn(),
  unlikePost: vi.fn(),
  createComment: vi.fn(),
}))

vi.mock('../../../api/SessionProvider', () => ({
  useSession: vi.fn(),
}))

const mockedGetPost = vi.mocked(getPost)

const post: PostDetail = {
  id: '1',
  slug: 'meu-post',
  title: 'Meu post',
  description: 'Descrição',
  thumbnailUrl: null,
  tags: ['React'],
  author: { id: 'u1', name: 'Júlio', username: '@julio' },
  likesCount: 3,
  commentsCount: 1,
  likedByMe: false,
  createdAt: '2026-06-22T12:00:00.000Z',
  content: 'const x = 1;',
  comments: [
    {
      id: 'c1',
      content: 'Top!',
      author: { id: 'u2', name: 'Márcia', username: '@marcia' },
      createdAt: '2026-06-22T12:01:00.000Z',
      replies: [],
    },
  ],
}

function renderPage(authenticated: boolean) {
  vi.mocked(useSession).mockReturnValue({
    user: authenticated
      ? { id: 'u1', name: 'Júlio', email: 'julio@codeconnect.dev' }
      : null,
    isAuthenticated: authenticated,
    loading: false,
    refresh: vi.fn(),
    logout: vi.fn(),
  })
  return render(
    <MemoryRouter initialEntries={['/posts/meu-post']}>
      <Routes>
        <Route path="/posts/:slug" element={<PostDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PostDetailPage', () => {
  it('mostra o post, o código e os comentários', async () => {
    mockedGetPost.mockResolvedValue(post)
    renderPage(false)

    expect(await screen.findByRole('heading', { name: 'Meu post' })).toBeInTheDocument()
    expect(screen.getByText('const x = 1;')).toBeInTheDocument()
    expect(screen.getByText('Top!')).toBeInTheDocument()
  })

  it('bloqueia comentários para visitantes', async () => {
    mockedGetPost.mockResolvedValue(post)
    renderPage(false)

    expect(
      await screen.findByText('Faça login para comentar neste post.'),
    ).toBeInTheDocument()
  })

  it('permite comentar quando logado', async () => {
    mockedGetPost.mockResolvedValue(post)
    renderPage(true)

    expect(await screen.findByLabelText('Comentário')).toBeInTheDocument()
  })
})
