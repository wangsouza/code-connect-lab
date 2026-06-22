import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('mostra a inicial quando não há imagem', () => {
    render(<Avatar name="Júlio" />)
    const fallback = screen.getByRole('img', { name: 'Júlio' })
    expect(fallback).toHaveTextContent('J')
  })

  it('renderiza a imagem quando há src', () => {
    render(<Avatar name="Júlio" src="https://example.com/a.png" />)
    expect(screen.getByRole('img', { name: 'Júlio' })).toHaveAttribute(
      'src',
      'https://example.com/a.png',
    )
  })
})
