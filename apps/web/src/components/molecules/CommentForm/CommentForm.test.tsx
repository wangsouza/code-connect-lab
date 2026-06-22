import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentForm } from './CommentForm'

describe('CommentForm', () => {
  it('mostra aviso de login para visitantes', () => {
    render(<CommentForm canComment={false} onSubmit={vi.fn()} />)
    expect(
      screen.getByText('Faça login para comentar neste post.'),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Comentário')).not.toBeInTheDocument()
  })

  it('envia o comentário quando logado', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<CommentForm canComment onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Comentário'), 'Muito bom!')
    await user.click(screen.getByRole('button', { name: 'Comentar' }))

    expect(onSubmit).toHaveBeenCalledWith('Muito bom!')
  })
})
