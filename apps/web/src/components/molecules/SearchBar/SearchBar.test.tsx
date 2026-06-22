import { fireEvent, render, screen } from '@testing-library/react'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('dispara onSearch com debounce', () => {
    vi.useFakeTimers()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} delay={300} />)

    // Limpa a chamada inicial do efeito
    vi.advanceTimersByTime(300)
    onSearch.mockClear()

    fireEvent.change(screen.getByLabelText('Buscar posts'), {
      target: { value: 'react' },
    })

    expect(onSearch).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(onSearch).toHaveBeenCalledWith('react')
  })
})
