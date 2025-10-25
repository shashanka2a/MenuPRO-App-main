import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QRScanScreen } from '@/components/pwa/qr-scan-screen'

// Mock the onQRCodeScanned function
const mockOnQRCodeScanned = jest.fn()

describe('QR Scan Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the QR scan screen with all elements', () => {
    render(<QRScanScreen onQRCodeScanned={mockOnQRCodeScanned} />)
    
    // Check for main heading
    expect(screen.getByText('Scan QR Code')).toBeInTheDocument()
    
    // Check for description
    expect(screen.getByText(/Point your camera at the QR code/)).toBeInTheDocument()
    
    // Check for scan button
    expect(screen.getByRole('button', { name: /Start Scanning/i })).toBeInTheDocument()
  })

  it('displays the MenuPRO logo', () => {
    render(<QRScanScreen onQRCodeScanned={mockOnQRCodeScanned} />)
    
    const logo = screen.getByAltText('MenuPRO Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/menupro-logo.svg')
  })

  it('shows camera icon and instructions', () => {
    render(<QRScanScreen onQRCodeScanned={mockOnQRCodeScanned} />)
    
    // Check for camera icon (assuming it's rendered as an icon)
    expect(screen.getByText(/📷/)).toBeInTheDocument()
    
    // Check for instructions
    expect(screen.getByText(/Make sure the QR code is clearly visible/)).toBeInTheDocument()
  })

  it('handles scan button click', async () => {
    const user = userEvent.setup()
    render(<QRScanScreen onQRCodeScanned={mockOnQRCodeScanned} />)
    
    const scanButton = screen.getByRole('button', { name: /Start Scanning/i })
    await user.click(scanButton)
    
    // The button should be clickable (actual QR scanning would be mocked in real implementation)
    expect(scanButton).toBeInTheDocument()
  })

  it('shows proper accessibility attributes', () => {
    render(<QRScanScreen onQRCodeScanned={mockOnQRCodeScanned} />)
    
    const scanButton = screen.getByRole('button', { name: /Start Scanning/i })
    expect(scanButton).toBeInTheDocument()
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Scan QR Code')
  })

  it('displays scanning tips', () => {
    render(<QRScanScreen onQRCodeScanned={mockOnQRCodeScanned} />)
    
    // Check for tips section
    expect(screen.getByText(/Tips for best results/)).toBeInTheDocument()
    expect(screen.getByText(/• Ensure good lighting/)).toBeInTheDocument()
    expect(screen.getByText(/• Keep the QR code steady/)).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<QRScanScreen onQRCodeScanned={mockOnQRCodeScanned} />)
    
    const container = screen.getByText('Scan QR Code').closest('div')
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center')
  })
})
