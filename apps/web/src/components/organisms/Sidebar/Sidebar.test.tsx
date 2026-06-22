import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useSession } from '../../../api/SessionProvider'

vi.mock('../../../api/SessionProvider', () => ({
  useSession: vi.fn(),
}))

const mockedUseSession = vi.mocked(useSession)

function renderSidebar() {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('mostra "Login" para visitantes', () => {
    mockedUseSession.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      refresh: vi.fn(),
      logout: vi.fn(),
    })
    renderSidebar()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Sair')).not.toBeInTheDocument()
  })

  it('mostra "Sair" para usuários logados', () => {
    mockedUseSession.mockReturnValue({
      user: { id: '1', name: 'Júlio', email: 'julio@codeconnect.dev' },
      isAuthenticated: true,
      loading: false,
      refresh: vi.fn(),
      logout: vi.fn(),
    })
    renderSidebar()
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })
})
