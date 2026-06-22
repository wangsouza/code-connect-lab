import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PostCard } from './PostCard'
import type { PostSummary } from '../../../api/posts'

const post: PostSummary = {
  id: '1',
  slug: 'meu-post',
  title: 'Meu post',
  description: 'Descrição do post',
  thumbnailUrl: null,
  tags: ['React'],
  author: { id: 'u1', name: 'Júlio', username: '@julio' },
  likesCount: 5,
  commentsCount: 2,
  likedByMe: false,
  createdAt: '2026-06-22T12:00:00.000Z',
}

function renderCard(canInteract = false) {
  return render(
    <MemoryRouter>
      <PostCard post={post} canInteract={canInteract} />
    </MemoryRouter>,
  )
}

describe('PostCard', () => {
  it('renderiza os dados do post e linka para o detalhe', () => {
    renderCard()
    expect(screen.getByRole('link', { name: 'Meu post' })).toHaveAttribute(
      'href',
      '/posts/meu-post',
    )
    expect(screen.getByText('Descrição do post')).toBeInTheDocument()
    expect(screen.getByText('@julio')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('desabilita curtir para visitantes', () => {
    renderCard(false)
    expect(screen.getByRole('button', { name: 'Curtir' })).toBeDisabled()
  })
})
