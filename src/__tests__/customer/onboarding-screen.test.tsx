import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingScreen } from '@/components/pwa/onboarding-screen'

// Mock the onLaunchApp function
const mockOnLaunchApp = jest.fn()

describe('Customer Onboarding Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the onboarding screen with all elements', () => {
    render(<OnboardingScreen onLaunchApp={mockOnLaunchApp} />)
    
    // Check for main heading
    expect(screen.getByText('Welcome to MenuPRO')).toBeInTheDocument()
    
    // Check for description
    expect(screen.getByText(/Scan QR code to order/)).toBeInTheDocument()
    
    // Check for launch button
    expect(screen.getByRole('button', { name: /Launch App/i })).toBeInTheDocument()
  })

  it('displays the MenuPRO logo', () => {
    render(<OnboardingScreen onLaunchApp={mockOnLaunchApp} />)
    
    const logo = screen.getByAltText('MenuPRO Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/menupro-logo.svg')
  })

  it('calls onLaunchApp when launch button is clicked', async () => {
    const user = userEvent.setup()
    render(<OnboardingScreen onLaunchApp={mockOnLaunchApp} />)
    
    const launchButton = screen.getByRole('button', { name: /Launch App/i })
    await user.click(launchButton)
    
    expect(mockOnLaunchApp).toHaveBeenCalledTimes(1)
  })

  it('shows the correct features list', () => {
    render(<OnboardingScreen onLaunchApp={mockOnLaunchApp} />)
    
    // Check for feature items
    expect(screen.getByText('📱 Scan QR Code')).toBeInTheDocument()
    expect(screen.getByText('🍽️ Browse Menu')).toBeInTheDocument()
    expect(screen.getByText('💳 Easy Payment')).toBeInTheDocument()
    expect(screen.getByText('📧 Email Receipt')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<OnboardingScreen onLaunchApp={mockOnLaunchApp} />)
    
    const launchButton = screen.getByRole('button', { name: /Launch App/i })
    expect(launchButton).toBeInTheDocument()
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Welcome to MenuPRO')
  })

  it('applies correct styling classes', () => {
    render(<OnboardingScreen onLaunchApp={mockOnLaunchApp} />)
    
    const container = screen.getByText('Welcome to MenuPRO').closest('div')
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center')
  })
})
