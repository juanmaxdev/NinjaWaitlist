import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Hero from '../../../../app/components/sections/Hero'

vi.mock('/assets/image/ninja_avatar_pose_rodillas_humo.png', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt={props.alt} />
  },
}))

describe('Hero component', () => {
  const mockOnTriggerRain = vi.fn()

  const renderHero = () => render(<Hero onTriggerRain={mockOnTriggerRain} />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the main headings and paragraph', () => {
    renderHero()

    expect(screen.getByText('INICIATIVA')).toBeInTheDocument()
    expect(screen.getByText('NINJA')).toBeInTheDocument()
    expect(screen.getByText('WAITLIST')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Algo se está forjando en las sombras\./
      )
    ).toBeInTheDocument()
  })

  it('should render the button with the ninja image', () => {
    renderHero()
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    const image = screen.getByAltText('ninja_avatar_pose_rodillas')
    expect(image).toBeInTheDocument()
  })

  it('should call onTriggerRain when the button is clicked', () => {
    renderHero()
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockOnTriggerRain).toHaveBeenCalledTimes(1)
  })
})
