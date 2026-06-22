import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentThread } from './CommentThread'
import type { Comment } from '../../../api/posts'

const comments: Comment[] = [
  {
    id: 'c1',
    content: 'Achei muito bom!',
    author: { id: 'u2', name: 'Márcia', username: '@marcia' },
    createdAt: '2026-06-22T12:00:00.000Z',
    replies: [
      {
        id: 'c2',
        content: 'Valeu!',
        author: { id: 'u1', name: 'Júlio', username: '@julio' },
        createdAt: '2026-06-22T12:05:00.000Z',
        replies: [],
      },
    ],
  },
]

describe('CommentThread', () => {
  it('mostra mensagem quando não há comentários', () => {
    render(
      <CommentThread comments={[]} canComment onReply={vi.fn()} />,
    )
    expect(
      screen.getByText('Ainda não há comentários. Seja o primeiro!'),
    ).toBeInTheDocument()
  })

  it('alterna a exibição de respostas', async () => {
    const user = userEvent.setup()
    render(
      <CommentThread comments={comments} canComment onReply={vi.fn()} />,
    )

    expect(screen.queryByText('Valeu!')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ver respostas' }))
    expect(screen.getByText('Valeu!')).toBeInTheDocument()
  })

  it('esconde o botão Responder para visitantes', () => {
    render(
      <CommentThread comments={comments} canComment={false} onReply={vi.fn()} />,
    )
    expect(
      screen.queryByRole('button', { name: 'Responder' }),
    ).not.toBeInTheDocument()
  })
})
