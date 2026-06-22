import type { ReactNode } from 'react'
import { Sidebar } from '../../organisms/Sidebar/Sidebar'

/**
 * Layout base das páginas autenticáveis (Feed e Detalhes do post):
 * menu lateral fixo + área de conteúdo. Reaproveitado para manter a
 * estrutura consistente entre as telas.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-grafite">
      <div className="mx-auto flex max-w-[1200px] gap-12 px-4 py-14">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
