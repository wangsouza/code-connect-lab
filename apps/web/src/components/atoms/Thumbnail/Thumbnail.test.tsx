import { render, screen } from '@testing-library/react'
import { Thumbnail } from './Thumbnail'

describe('Thumbnail', () => {
  it('mostra placeholder quando não há imagem', () => {
    render(<Thumbnail src={null} alt="Meu post" />)
    expect(screen.getByRole('img', { name: 'Meu post (sem imagem)' })).toBeInTheDocument()
  })

  it('renderiza a imagem quando há src', () => {
    render(<Thumbnail src="https://example.com/p.png" alt="Meu post" />)
    expect(screen.getByRole('img', { name: 'Meu post' })).toHaveAttribute(
      'src',
      'https://example.com/p.png',
    )
  })
})
