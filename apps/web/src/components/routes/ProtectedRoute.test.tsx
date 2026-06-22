import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { getToken } from '../../api/tokenStorage'

vi.mock('../../api/tokenStorage', () => ({
  getToken: vi.fn(),
}))

const mockedGetToken = vi.mocked(getToken)

function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={['/feed']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('renders children when a token exists', () => {
    mockedGetToken.mockReturnValue('valid-token')
    renderWithRoutes()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when there is no token', () => {
    mockedGetToken.mockReturnValue(null)
    renderWithRoutes()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
