import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { useSession } from '../../../api/SessionProvider'

vi.mock('../../../api/SessionProvider', () => ({
  useSession: vi.fn(),
}))

describe('AppLayout', () => {
  it('renderiza o menu lateral e o conteúdo', () => {
    vi.mocked(useSession).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      refresh: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <AppLayout>
          <p>Conteúdo</p>
        </AppLayout>
      </MemoryRouter>,
    )
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })
})
