import { render, screen } from '@testing-library/react'
import { PostDetailCard } from './PostDetailCard'
import type { PostDetail } from '../../../api/posts'

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
  comments: [],
}

describe('PostDetailCard', () => {
  it('renderiza título, autor e ações', () => {
    render(<PostDetailCard post={post} canInteract />)
    expect(
      screen.getByRole('heading', { name: 'Meu post' }),
    ).toBeInTheDocument()
    expect(screen.getByText('@julio')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Curtir' })).toBeEnabled()
  })
})
