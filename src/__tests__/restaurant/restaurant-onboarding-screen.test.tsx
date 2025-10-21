import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestaurantOnboardingScreen } from '@/components/restaurant/restaurant-onboarding-screen'

// Mock functions
const mockOnRestaurantSubmit = jest.fn()
const mockOnEmailSubmit = jest.fn()
const mockOnBack = jest.fn()

describe('Restaurant Onboarding Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the restaurant onboarding screen with all elements', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    // Check for main heading
    expect(screen.getByText('Join MenuOS')).toBeInTheDocument()
    
    // Check for description
    expect(screen.getByText(/Let&apos;s get your restaurant set up/)).toBeInTheDocument()
    
    // Check for progress steps
    expect(screen.getByText('Restaurant Info')).toBeInTheDocument()
    expect(screen.getByText('Email Verification')).toBeInTheDocument()
    expect(screen.getByText('Menu Setup')).toBeInTheDocument()
  })

  it('displays the MenuOS logo', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    const logo = screen.getByAltText('MenuOS Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/menupro-logo.png')
  })

  it('shows restaurant information form', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    // Check for form fields
    expect(screen.getByLabelText(/Restaurant name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Cuisine type/i)).toBeInTheDocument()
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument()
  })

  it('handles restaurant form submission', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    // Fill out the form
    await user.type(screen.getByLabelText(/Restaurant name/i), 'Test Restaurant')
    await user.type(screen.getByLabelText(/Address/i), '123 Main St')
    await user.type(screen.getByLabelText(/Phone number/i), '555-1234')
    await user.type(screen.getByLabelText(/Email address/i), 'test@restaurant.com')
    await user.type(screen.getByLabelText(/Cuisine type/i), 'Italian')
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Continue/i })
    await user.click(submitButton)
    
    expect(mockOnRestaurantSubmit).toHaveBeenCalledWith({
      name: 'Test Restaurant',
      address: '123 Main St',
      phone: '555-1234',
      email: 'test@restaurant.com',
      cuisine: 'Italian'
    })
  })

  it('shows email verification step', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
        currentStep={2}
        restaurantData={{
          name: 'Test Restaurant',
          address: '123 Main St',
          phone: '555-1234',
          email: 'test@restaurant.com',
          cuisine: 'Italian'
        }}
      />
    )
    
    // Check for email verification content
    expect(screen.getByText('Email Verification')).toBeInTheDocument()
    expect(screen.getByText(/We&apos;ll send a verification code/)).toBeInTheDocument()
    expect(screen.getByText('test@restaurant.com')).toBeInTheDocument()
  })

  it('shows success state after email verification', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
        currentStep={2}
        success={true}
        restaurantData={{
          name: 'Test Restaurant',
          address: '123 Main St',
          phone: '555-1234',
          email: 'test@restaurant.com',
          cuisine: 'Italian'
        }}
      />
    )
    
    // Check for success message
    expect(screen.getByText('Verification Email Sent!')).toBeInTheDocument()
    expect(screen.getByText(/We&apos;ve sent a verification code to/)).toBeInTheDocument()
  })

  it('shows form validation errors', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
        error="Please fill in all required fields"
      />
    )
    
    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /Continue/i })
    await user.click(submitButton)
    
    expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument()
  })

  it('shows loading state during submission', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
        isLoading={true}
      />
    )
    
    const submitButton = screen.getByRole('button', { name: /Processing.../i })
    expect(submitButton).toBeDisabled()
  })

  it('handles back navigation', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
        currentStep={2}
      />
    )
    
    const backButton = screen.getByRole('button', { name: /Back/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('shows progress indicators correctly', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
        currentStep={2}
      />
    )
    
    // Check for progress steps
    const progressSteps = screen.getAllByRole('listitem')
    expect(progressSteps).toHaveLength(3)
    
    // First step should be completed
    expect(progressSteps[0]).toHaveClass('completed')
    
    // Second step should be active
    expect(progressSteps[1]).toHaveClass('active')
  })

  it('has proper accessibility attributes', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Join MenuOS')
    
    // Check for form accessibility
    const nameInput = screen.getByLabelText(/Restaurant name/i)
    expect(nameInput).toHaveAttribute('required')
    
    const emailInput = screen.getByLabelText(/Email address/i)
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
  })

  it('applies correct styling classes', () => {
    render(
      <RestaurantOnboardingScreen 
        onRestaurantSubmit={mockOnRestaurantSubmit}
        onEmailSubmit={mockOnEmailSubmit}
        onBack={mockOnBack}
      />
    )
    
    const container = screen.getByText('Join MenuOS').closest('div')
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center')
  })
})
