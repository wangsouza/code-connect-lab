import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostStats } from './PostStats'

describe('PostStats', () => {
  it('mostra as contagens', () => {
    render(
      <PostStats
        likesCount={12}
        commentsCount={4}
        likedByMe={false}
        canInteract
      />,
    )
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('desabilita curtir para visitantes', () => {
    render(
      <PostStats
        likesCount={0}
        commentsCount={0}
        likedByMe={false}
        canInteract={false}
      />,
    )
    expect(screen.getByRole('button', { name: 'Curtir' })).toBeDisabled()
  })

  it('chama onToggleLike quando logado', async () => {
    const user = userEvent.setup()
    const onToggleLike = vi.fn()
    render(
      <PostStats
        likesCount={1}
        commentsCount={0}
        likedByMe={false}
        canInteract
        onToggleLike={onToggleLike}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Curtir' }))
    expect(onToggleLike).toHaveBeenCalledOnce()
  })
})
