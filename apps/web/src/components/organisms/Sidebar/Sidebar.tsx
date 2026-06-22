import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../../../api/SessionProvider'
import { MaterialIcon } from '../../atoms/MaterialIcon/MaterialIcon'

interface NavItemProps {
  icon: string
  label: string
}

function MenuLink({
  icon,
  label,
  to,
}: NavItemProps & { to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
          isActive ? 'text-offwhite' : 'text-cinza-medio hover:text-offwhite'
        }`
      }
    >
      <MaterialIcon name={icon} className="text-3xl" />
      <span className="text-2xl">{label}</span>
    </NavLink>
  )
}

function MenuButton({
  icon,
  label,
  onClick,
}: NavItemProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-4 py-2 text-cinza-medio transition-colors hover:text-offwhite"
    >
      <MaterialIcon name={icon} className="text-3xl" />
      <span className="text-2xl">{label}</span>
    </button>
  )
}

/** Menu lateral compartilhado. O último item alterna Login/Sair pela sessão. */
export function Sidebar() {
  const { isAuthenticated, logout } = useSession()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/feed', { replace: true })
  }

  return (
    <nav
      aria-label="Menu principal"
      className="flex w-44 shrink-0 flex-col items-center gap-20 rounded-lg bg-cinza-escuro px-4 py-10"
    >
      <Link
        to="/feed"
        className="text-xl font-semibold text-verde-destaque"
        aria-label="Code Connect — início"
      >
        &lt;code connect/&gt;
      </Link>

      <div className="flex w-full flex-col items-center gap-10">
        <Link
          to="/feed"
          className="w-full rounded-lg border border-verde-destaque px-4 py-3 text-center text-2xl text-verde-destaque transition-colors hover:bg-verde-destaque/10"
        >
          Publicar
        </Link>

        <MenuLink icon="feed" label="Feed" to="/feed" />

        {isAuthenticated ? (
          <MenuButton icon="logout" label="Sair" onClick={handleLogout} />
        ) : (
          <MenuLink icon="login" label="Login" to="/login" />
        )}
      </div>
    </nav>
  )
}
