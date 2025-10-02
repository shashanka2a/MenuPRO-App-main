import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailVerificationScreen } from '@/components/pwa/email-verification-screen'

// Mock functions
const mockOnEmailSubmit = jest.fn()
const mockOnProceedToOTP = jest.fn()

describe('Email Verification Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the email verification screen with all elements', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
      />
    )
    
    // Check for main heading
    expect(screen.getByText('Verify Your Email')).toBeInTheDocument()
    
    // Check for description
    expect(screen.getByText(/We&apos;ll send you a verification code/)).toBeInTheDocument()
    
    // Check for email input
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument()
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Send Verification Code/i })).toBeInTheDocument()
  })

  it('displays the MenuPRO logo', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
      />
    )
    
    const logo = screen.getByAltText('MenuPRO Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/menupro-logo.png')
  })

  it('handles email input and submission', async () => {
    const user = userEvent.setup()
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
      />
    )
    
    const emailInput = screen.getByLabelText(/Email address/i)
    const submitButton = screen.getByRole('button', { name: /Send Verification Code/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    expect(mockOnEmailSubmit).toHaveBeenCalledWith('test@example.com')
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
      />
    )
    
    const emailInput = screen.getByLabelText(/Email address/i)
    const submitButton = screen.getByRole('button', { name: /Send Verification Code/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    // Should show validation error
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
    expect(mockOnEmailSubmit).not.toHaveBeenCalled()
  })

  it('shows success state after email submission', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
        success={true}
        email="test@example.com"
      />
    )
    
    // Check for success message
    expect(screen.getByText('Verification Email Sent!')).toBeInTheDocument()
    expect(screen.getByText(/We&apos;ve sent a verification code to/)).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    
    // Check for proceed button
    expect(screen.getByRole('button', { name: /Enter Verification Code/i })).toBeInTheDocument()
  })

  it('calls onProceedToOTP when proceed button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
        success={true}
        email="test@example.com"
      />
    )
    
    const proceedButton = screen.getByRole('button', { name: /Enter Verification Code/i })
    await user.click(proceedButton)
    
    expect(mockOnProceedToOTP).toHaveBeenCalledTimes(1)
  })

  it('shows resend option in success state', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
        success={true}
        email="test@example.com"
      />
    )
    
    expect(screen.getByText(/Didn&apos;t receive the email?/)).toBeInTheDocument()
    expect(screen.getByText(/Try a different email/)).toBeInTheDocument()
  })

  it('shows loading state during submission', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
        isLoading={true}
      />
    )
    
    const submitButton = screen.getByRole('button', { name: /Sending.../i })
    expect(submitButton).toBeDisabled()
  })

  it('shows error message when submission fails', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
        error="Failed to send verification email"
      />
    )
    
    expect(screen.getByText('Failed to send verification email')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
      />
    )
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Verify Your Email')
    
    // Check for form accessibility
    const emailInput = screen.getByLabelText(/Email address/i)
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
  })

  it('applies correct styling classes', () => {
    render(
      <EmailVerificationScreen 
        onEmailSubmit={mockOnEmailSubmit}
        onProceedToOTP={mockOnProceedToOTP}
      />
    )
    
    const container = screen.getByText('Verify Your Email').closest('div')
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center')
  })
})
