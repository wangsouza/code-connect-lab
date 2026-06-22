interface CodeBlockProps {
  code: string
}

/** Seção "Código" da página de detalhes do post. */
export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-offwhite">Código:</h2>
      <pre className="overflow-x-auto rounded-lg bg-cinza-escuro p-6 text-sm text-offwhite">
        <code>{code}</code>
      </pre>
    </section>
  )
}
