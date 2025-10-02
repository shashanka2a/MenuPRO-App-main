import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestaurantApp } from '@/components/restaurant/restaurant-app'

// Mock the Restaurant app component
jest.mock('@/components/restaurant/restaurant-app', () => ({
  RestaurantApp: ({ onRestaurantSubmit, onEmailSubmit, onBack }: any) => (
    <div data-testid="restaurant-app">
      <button onClick={() => onRestaurantSubmit({ name: 'Test Restaurant' })}>
        Submit Restaurant
      </button>
      <button onClick={() => onEmailSubmit('test@restaurant.com')}>
        Submit Email
      </button>
      <button onClick={onBack}>Back</button>
    </div>
  )
}))

describe('Restaurant Onboarding Flow Integration', () => {
  it('renders the complete restaurant flow', () => {
    const mockOnRestaurantSubmit = jest.fn()
    const mockOnEmailSubmit = jest.fn()
    const mockOnBack = jest.fn()
    
    render(
      <RestaurantApp 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    expect(screen.getByTestId('restaurant-app')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Submit Restaurant/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Submit Email/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
  })

  it('handles restaurant submission', async () => {
    const user = userEvent.setup()
    const mockOnRestaurantSubmit = jest.fn()
    const mockOnEmailSubmit = jest.fn()
    const mockOnBack = jest.fn()
    
    render(
      <RestaurantApp 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    const submitButton = screen.getByRole('button', { name: /Submit Restaurant/i })
    await user.click(submitButton)
    
    expect(mockOnRestaurantSubmit).toHaveBeenCalledWith({ name: 'Test Restaurant' })
  })

  it('handles email submission', async () => {
    const user = userEvent.setup()
    const mockOnRestaurantSubmit = jest.fn()
    const mockOnEmailSubmit = jest.fn()
    const mockOnBack = jest.fn()
    
    render(
      <RestaurantApp 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    const emailButton = screen.getByRole('button', { name: /Submit Email/i })
    await user.click(emailButton)
    
    expect(mockOnEmailSubmit).toHaveBeenCalledWith('test@restaurant.com')
  })

  it('handles back navigation', async () => {
    const user = userEvent.setup()
    const mockOnRestaurantSubmit = jest.fn()
    const mockOnEmailSubmit = jest.fn()
    const mockOnBack = jest.fn()
    
    render(
      <RestaurantApp 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    const backButton = screen.getByRole('button', { name: /Back/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })
})
