import React from 'react'
import { render, screen } from '@testing-library/react'
import { Logo } from './index'

describe('<Logo />', () => {
  it('should render', () => {
    render(<Logo />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
