import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuScreen } from '@/components/pwa/menu-screen'

// Mock menu items data
const mockMenuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella',
    price: 12.99,
    category: 'Pizza',
    image: '/pizza.jpg',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing',
    price: 8.99,
    category: 'Salads',
    image: '/salad.jpg',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with ganache',
    price: 6.99,
    category: 'Desserts',
    image: '/cake.jpg',
    isAvailable: false
  }
]

// Mock functions
const mockOnAddToCart = jest.fn()
const mockOnViewCart = jest.fn()
const mockOnBack = jest.fn()

describe('Menu Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the menu screen with all elements', () => {
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    // Check for main heading
    expect(screen.getByText('Our Menu')).toBeInTheDocument()
    
    // Check for back button
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
    
    // Check for cart button
    expect(screen.getByRole('button', { name: /View Cart/i })).toBeInTheDocument()
  })

  it('displays menu items correctly', () => {
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    // Check for menu items
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument()
    expect(screen.getByText('Classic tomato and mozzarella')).toBeInTheDocument()
    expect(screen.getByText('$12.99')).toBeInTheDocument()
    
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument()
    expect(screen.getByText('Fresh romaine lettuce with caesar dressing')).toBeInTheDocument()
    expect(screen.getByText('$8.99')).toBeInTheDocument()
  })

  it('shows unavailable items as disabled', () => {
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    // Check for unavailable item
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
    expect(screen.getByText('Rich chocolate cake with ganache')).toBeInTheDocument()
    expect(screen.getByText('$6.99')).toBeInTheDocument()
    
    // The add button should be disabled for unavailable items
    const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i })
    const unavailableButton = addButtons.find(button => 
      button.closest('[data-testid="menu-item-3"]')
    )
    expect(unavailableButton).toBeDisabled()
  })

  it('calls onAddToCart when add button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    const addButton = screen.getAllByRole('button', { name: /Add to Cart/i })[0]
    await user.click(addButton)
    
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockMenuItems[0])
  })

  it('calls onViewCart when cart button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    const cartButton = screen.getByRole('button', { name: /View Cart/i })
    await user.click(cartButton)
    
    expect(mockOnViewCart).toHaveBeenCalledTimes(1)
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    const backButton = screen.getByRole('button', { name: /Back/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('displays menu items by category', () => {
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    // Check for category headers
    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Salads')).toBeInTheDocument()
    expect(screen.getByText('Desserts')).toBeInTheDocument()
  })

  it('shows empty state when no menu items', () => {
    render(
      <MenuScreen 
        menuItems={[]}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    expect(screen.getByText(/No menu items available/)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <MenuScreen 
        menuItems={mockMenuItems}
        onAddToCart={mockOnAddToCart}
        onViewCart={mockOnViewCart}
        onBack={mockOnBack}
      />
    )
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Our Menu')
    
    // Check for button accessibility
    const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i })
    addButtons.forEach(button => {
      expect(button).toBeInTheDocument()
    })
  })
})
