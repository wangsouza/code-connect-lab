interface TabsProps {
  /** Rótulos das abas; a primeira é a ativa. */
  tabs?: string[]
}

/**
 * Abas de ordenação do feed. Atualmente apenas "Recentes" está ativa
 * (ordenação padrão do backend).
 */
export function Tabs({ tabs = ['Recentes'] }: TabsProps) {
  return (
    <div role="tablist" className="flex justify-center gap-6">
      {tabs.map((tab, index) => {
        const active = index === 0
        return (
          <span
            key={tab}
            role="tab"
            aria-selected={active}
            className={`text-2xl ${
              active
                ? 'font-semibold text-verde-destaque underline'
                : 'text-cinza-medio'
            }`}
          >
            {tab}
          </span>
        )
      })}
    </div>
  )
}
