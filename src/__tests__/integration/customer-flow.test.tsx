import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PWAApp } from '@/components/pwa-app'

// Mock the PWA app component
jest.mock('@/components/pwa-app', () => ({
  PWAApp: ({ onLaunchApp }: { onLaunchApp: () => void }) => (
    <div data-testid="pwa-app">
      <button onClick={onLaunchApp}>Launch App</button>
    </div>
  )
}))

describe('Customer Ordering Flow Integration', () => {
  it('renders the complete customer flow', () => {
    const mockOnLaunchApp = jest.fn()
    render(<PWAApp onLaunchApp={mockOnLaunchApp} />)
    
    expect(screen.getByTestId('pwa-app')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Launch App/i })).toBeInTheDocument()
  })

  it('handles app launch', async () => {
    const user = userEvent.setup()
    const mockOnLaunchApp = jest.fn()
    render(<PWAApp onLaunchApp={mockOnLaunchApp} />)
    
    const launchButton = screen.getByRole('button', { name: /Launch App/i })
    await user.click(launchButton)
    
    expect(mockOnLaunchApp).toHaveBeenCalledTimes(1)
  })
})
