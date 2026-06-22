import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { SessionProvider } from '../../../api/SessionProvider'

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <SessionProvider>
          <LoginPage />
        </SessionProvider>
      </MemoryRouter>
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Boas-vindas! Faça seu login.')).toBeInTheDocument()
  })

  it('renders the banner image', () => {
    render(
      <MemoryRouter>
        <SessionProvider>
          <LoginPage />
        </SessionProvider>
      </MemoryRouter>
    )
    expect(screen.getByAltText('Mulher desenvolvedora no computador')).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    render(
      <MemoryRouter>
        <SessionProvider>
          <LoginPage />
        </SessionProvider>
      </MemoryRouter>
    )
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })
})
