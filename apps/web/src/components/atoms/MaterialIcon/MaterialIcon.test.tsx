import { render, screen } from '@testing-library/react'
import { MaterialIcon } from './MaterialIcon'

describe('MaterialIcon', () => {
  it('renderiza o nome do ícone', () => {
    render(<MaterialIcon name="feed" data-testid="icon" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveTextContent('feed')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('expõe aria-label quando informativo', () => {
    render(<MaterialIcon name="logout" aria-label="Sair" />)
    expect(screen.getByLabelText('Sair')).toBeInTheDocument()
  })
})
