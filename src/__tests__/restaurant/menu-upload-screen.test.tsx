import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuUploadScreen } from '@/components/restaurant/menu-upload-screen'

// Mock functions
const mockOnMenuUploaded = jest.fn()
const mockOnBack = jest.fn()
const mockOnSkip = jest.fn()

// Mock menu items
const mockMenuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella',
    price: 12.99,
    category: 'Pizza',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing',
    price: 8.99,
    category: 'Salads',
    isAvailable: true
  }
]

describe('Menu Upload Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the menu upload screen with all elements', () => {
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    // Check for main heading
    expect(screen.getByText('Upload Your Menu')).toBeInTheDocument()
    
    // Check for description
    expect(screen.getByText(/We&apos;ll help you digitize your menu automatically/)).toBeInTheDocument()
    
    // Check for upload method options
    expect(screen.getByText('Physical Menu Photo')).toBeInTheDocument()
    expect(screen.getByText('PDF Menu')).toBeInTheDocument()
  })

  it('displays the MenuOS logo', () => {
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const logo = screen.getByAltText('MenuOS Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/menupro-logo.svg')
  })

  it('shows upload method selection initially', () => {
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    // Check for upload method cards
    expect(screen.getByText('Physical Menu Photo')).toBeInTheDocument()
    expect(screen.getByText(/Take a photo of your physical menu and we&apos;ll extract the details using AI/)).toBeInTheDocument()
    expect(screen.getByText('AI-Powered OCR')).toBeInTheDocument()
    
    expect(screen.getByText('PDF Menu')).toBeInTheDocument()
    expect(screen.getByText(/Upload your PDF menu and we&apos;ll parse the text to extract menu items/)).toBeInTheDocument()
    expect(screen.getByText('Text Parsing')).toBeInTheDocument()
  })

  it('handles physical menu upload selection', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const physicalMenuCard = screen.getByText('Physical Menu Photo').closest('div')
    await user.click(physicalMenuCard)
    
    // Should show physical menu upload interface
    expect(screen.getByText('Upload Physical Menu')).toBeInTheDocument()
    expect(screen.getByText('Upload Photo')).toBeInTheDocument()
    expect(screen.getByText('Take Photo')).toBeInTheDocument()
  })

  it('handles PDF menu upload selection', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const pdfMenuCard = screen.getByText('PDF Menu').closest('div')
    await user.click(pdfMenuCard)
    
    // Should show PDF upload interface
    expect(screen.getByText('Upload PDF Menu')).toBeInTheDocument()
    expect(screen.getByText(/We&apos;ll automatically extract menu items from your PDF/)).toBeInTheDocument()
  })

  it('shows upload tips for physical menu', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const physicalMenuCard = screen.getByText('Physical Menu Photo').closest('div')
    await user.click(physicalMenuCard)
    
    // Check for tips
    expect(screen.getByText(/📸 Tips for Best Results:/)).toBeInTheDocument()
    expect(screen.getByText(/• Ensure good lighting/)).toBeInTheDocument()
    expect(screen.getByText(/• Keep the menu flat and straight/)).toBeInTheDocument()
    expect(screen.getByText(/• Capture the entire menu in one photo/)).toBeInTheDocument()
    expect(screen.getByText(/• Avoid shadows and glare/)).toBeInTheDocument()
  })

  it('handles file upload for physical menu', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const physicalMenuCard = screen.getByText('Physical Menu Photo').closest('div')
    await user.click(physicalMenuCard)
    
    // Create a mock file
    const file = new File(['test content'], 'menu.jpg', { type: 'image/jpeg' })
    
    // Find the file input (it's hidden)
    const fileInput = screen.getByRole('button', { name: /Choose File/i }).nextElementSibling
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('handles file upload for PDF menu', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const pdfMenuCard = screen.getByText('PDF Menu').closest('div')
    await user.click(pdfMenuCard)
    
    // Find the file input (it's hidden)
    const fileInput = screen.getByRole('button', { name: /Choose PDF File/i }).nextElementSibling
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', '.pdf')
  })

  it('shows upload progress during processing', () => {
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
        isUploading={true}
        uploadProgress={50}
      />
    )
    
    expect(screen.getByText('Processing Your Menu...')).toBeInTheDocument()
    expect(screen.getByText(/Using AI to extract menu items from your photo.../)).toBeInTheDocument()
  })

  it('shows error state when upload fails', () => {
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
        error="Failed to process menu"
      />
    )
    
    expect(screen.getByText('Upload Failed')).toBeInTheDocument()
    expect(screen.getByText('Failed to process menu')).toBeInTheDocument()
  })

  it('displays parsed menu items', () => {
    const mockParsedItems = [
      {
        name: 'Margherita Pizza',
        price: 12.99,
        description: 'Classic tomato and mozzarella',
        category: 'Pizza',
        confidence: 0.95
      }
    ]
    
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
        parsedItems={mockParsedItems}
      />
    )
    
    expect(screen.getByText('Detected Menu Items')).toBeInTheDocument()
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument()
    expect(screen.getByText('$12.99')).toBeInTheDocument()
    expect(screen.getByText('95% confidence')).toBeInTheDocument()
  })

  it('handles adding parsed items to menu', async () => {
    const user = userEvent.setup()
    const mockParsedItems = [
      {
        name: 'Margherita Pizza',
        price: 12.99,
        description: 'Classic tomato and mozzarella',
        category: 'Pizza',
        confidence: 0.95
      }
    ]
    
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
        parsedItems={mockParsedItems}
      />
    )
    
    const addButton = screen.getByRole('button', { name: /Add to Menu/i })
    await user.click(addButton)
    
    // Should move item to menu items list
    expect(screen.getByText('Your Menu Items (1)')).toBeInTheDocument()
  })

  it('handles saving menu with items', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
        menuItems={mockMenuItems}
      />
    )
    
    const saveButton = screen.getByRole('button', { name: /Save Menu \(2 items\)/i })
    await user.click(saveButton)
    
    expect(mockOnMenuUploaded).toHaveBeenCalledWith(mockMenuItems)
  })

  it('handles back navigation', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const backButton = screen.getByRole('button', { name: /Back/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('handles skip functionality', async () => {
    const user = userEvent.setup()
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const skipButton = screen.getByRole('button', { name: /Skip for Now/i })
    await user.click(skipButton)
    
    expect(mockOnSkip).toHaveBeenCalledTimes(1)
  })

  it('has proper accessibility attributes', () => {
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Upload Your Menu')
    
    // Check for button accessibility
    const backButton = screen.getByRole('button', { name: /Back/i })
    expect(backButton).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(
      <MenuUploadScreen 
        onMenuUploaded={mockOnMenuUploaded}
        onBack={mockOnBack}
        onSkip={mockOnSkip}
      />
    )
    
    const container = screen.getByText('Upload Your Menu').closest('div')
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center')
  })
})
