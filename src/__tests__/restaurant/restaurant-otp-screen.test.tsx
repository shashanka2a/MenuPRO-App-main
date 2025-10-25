import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestaurantOTPScreen } from '@/components/restaurant/restaurant-otp-screen'

// Mock functions
const mockOnVerificationSuccess = jest.fn()
const mockOnBack = jest.fn()
const mockOnResendEmail = jest.fn()

describe('Restaurant OTP Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the OTP screen with all elements', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    // Check for main heading
    expect(screen.getByText('Enter Verification Code')).toBeInTheDocument()
    
    // Check for email display
    expect(screen.getByText(/We sent a 6-digit code to/)).toBeInTheDocument()
    expect(screen.getByText('test@restaurant.com')).toBeInTheDocument()
    
    // Check for OTP inputs
    const otpInputs = screen.getAllByRole('textbox')
    expect(otpInputs).toHaveLength(6)
    
    // Check for verify button
    expect(screen.getByRole('button', { name: /Verify Code/i })).toBeInTheDocument()
  })

  it('displays the MenuOS logo', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    const logo = screen.getByAltText('MenuOS Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/menupro-logo.svg')
  })

  it('handles OTP input correctly', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    const otpInputs = screen.getAllByRole('textbox')
    
    // Type in each input
    await user.type(otpInputs[0], '1')
    await user.type(otpInputs[1], '2')
    await user.type(otpInputs[2], '3')
    await user.type(otpInputs[3], '4')
    await user.type(otpInputs[4], '5')
    await user.type(otpInputs[5], '6')
    
    // Check that values are set
    expect(otpInputs[0]).toHaveValue('1')
    expect(otpInputs[1]).toHaveValue('2')
    expect(otpInputs[2]).toHaveValue('3')
    expect(otpInputs[3]).toHaveValue('4')
    expect(otpInputs[4]).toHaveValue('5')
    expect(otpInputs[5]).toHaveValue('6')
  })

  it('handles OTP paste functionality', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    const firstInput = screen.getAllByRole('textbox')[0]
    
    // Simulate paste event
    await user.click(firstInput)
    await user.paste('123456')
    
    // Check that all inputs are filled
    const otpInputs = screen.getAllByRole('textbox')
    expect(otpInputs[0]).toHaveValue('1')
    expect(otpInputs[1]).toHaveValue('2')
    expect(otpInputs[2]).toHaveValue('3')
    expect(otpInputs[3]).toHaveValue('4')
    expect(otpInputs[4]).toHaveValue('5')
    expect(otpInputs[5]).toHaveValue('6')
  })

  it('calls onVerificationSuccess when OTP is submitted', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    const otpInputs = screen.getAllByRole('textbox')
    
    // Fill in OTP
    await user.type(otpInputs[0], '1')
    await user.type(otpInputs[1], '2')
    await user.type(otpInputs[2], '3')
    await user.type(otpInputs[3], '4')
    await user.type(otpInputs[4], '5')
    await user.type(otpInputs[5], '6')
    
    // Submit
    const verifyButton = screen.getByRole('button', { name: /Verify Code/i })
    await user.click(verifyButton)
    
    expect(mockOnVerificationSuccess).toHaveBeenCalledWith('123456')
  })

  it('shows error for invalid OTP', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
        error="Invalid verification code"
      />
    )
    
    expect(screen.getByText('Invalid verification code')).toBeInTheDocument()
  })

  it('shows success state after verification', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
        success={true}
      />
    )
    
    expect(screen.getByText('Email Verified!')).toBeInTheDocument()
    expect(screen.getByText(/Welcome to MenuOS! Let&apos;s set up your restaurant dashboard/)).toBeInTheDocument()
  })

  it('handles resend email functionality', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
        canResend={true}
      />
    )
    
    const resendButton = screen.getByRole('button', { name: /Resend Code/i })
    await user.click(resendButton)
    
    expect(mockOnResendEmail).toHaveBeenCalledTimes(1)
  })

  it('shows timer countdown', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
        timeLeft={300}
      />
    )
    
    expect(screen.getByText(/Code expires in 5:00/)).toBeInTheDocument()
  })

  it('handles back navigation', async () => {
    const user = userEvent.setup()
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    const backButton = screen.getByRole('button', { name: /Back to Restaurant Info/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('shows loading state during verification', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
        isLoading={true}
      />
    )
    
    const verifyButton = screen.getByRole('button', { name: /Verifying.../i })
    expect(verifyButton).toBeDisabled()
  })

  it('disables verify button when OTP is incomplete', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    const verifyButton = screen.getByRole('button', { name: /Verify Code/i })
    expect(verifyButton).toBeDisabled()
  })

  it('has proper accessibility attributes', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Enter Verification Code')
    
    // Check for OTP inputs accessibility
    const otpInputs = screen.getAllByRole('textbox')
    otpInputs.forEach(input => {
      expect(input).toHaveAttribute('maxLength', '1')
      expect(input).toHaveAttribute('inputMode', 'numeric')
    })
  })

  it('applies correct styling classes', () => {
    render(
      <RestaurantOTPScreen 
        email="test@restaurant.com"
        onVerificationSuccess={mockOnVerificationSuccess}
        onBack={mockOnBack}
        onResendEmail={mockOnResendEmail}
      />
    )
    
    const container = screen.getByText('Enter Verification Code').closest('div')
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center')
  })
})
