import { render, screen } from '@testing-library/react'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renderiza o conteúdo', () => {
    render(<Tag>React</Tag>)
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
