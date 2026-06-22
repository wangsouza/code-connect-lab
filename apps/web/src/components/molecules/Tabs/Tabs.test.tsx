import { render, screen } from '@testing-library/react'
import { Tabs } from './Tabs'

describe('Tabs', () => {
  it('marca a primeira aba como selecionada', () => {
    render(<Tabs tabs={['Recentes', 'Populares']} />)
    expect(screen.getByRole('tab', { name: 'Recentes' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: 'Populares' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })
})
