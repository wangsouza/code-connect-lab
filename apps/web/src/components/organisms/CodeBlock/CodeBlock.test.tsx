import { render, screen } from '@testing-library/react'
import { CodeBlock } from './CodeBlock'

describe('CodeBlock', () => {
  it('renderiza o código do post', () => {
    render(<CodeBlock code="const x = 1;" />)
    expect(screen.getByText('Código:')).toBeInTheDocument()
    expect(screen.getByText('const x = 1;')).toBeInTheDocument()
  })
})
