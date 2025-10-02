import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartScreen } from '@/components/pwa/cart-screen'

// Mock cart items data
const mockCartItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella',
    price: 12.99,
    quantity: 2,
    image: '/pizza.jpg'
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing',
    price: 8.99,
    quantity: 1,
    image: '/salad.jpg'
  }
]

// Mock functions
const mockOnUpdateQuantity = jest.fn()
const mockOnRemoveItem = jest.fn()
const mockOnCheckout = jest.fn()
const mockOnBack = jest.fn()

describe('Cart Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the cart screen with all elements', () => {
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    // Check for main heading
    expect(screen.getByText('Your Cart')).toBeInTheDocument()
    
    // Check for back button
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
    
    // Check for checkout button
    expect(screen.getByRole('button', { name: /Proceed to Checkout/i })).toBeInTheDocument()
  })

  it('displays cart items correctly', () => {
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    // Check for cart items
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument()
    expect(screen.getByText('Classic tomato and mozzarella')).toBeInTheDocument()
    expect(screen.getByText('$12.99')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2')).toBeInTheDocument() // Quantity input
    
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument()
    expect(screen.getByText('Fresh romaine lettuce with caesar dressing')).toBeInTheDocument()
    expect(screen.getByText('$8.99')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1')).toBeInTheDocument() // Quantity input
  })

  it('calculates and displays total correctly', () => {
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    // Calculate expected total: (12.99 * 2) + (8.99 * 1) = 25.98 + 8.99 = 34.97
    const expectedTotal = (12.99 * 2) + (8.99 * 1)
    expect(screen.getByText(`$${expectedTotal.toFixed(2)}`)).toBeInTheDocument()
  })

  it('calls onUpdateQuantity when quantity is changed', async () => {
    const user = userEvent.setup()
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    const quantityInput = screen.getByDisplayValue('2')
    await user.clear(quantityInput)
    await user.type(quantityInput, '3')
    await user.tab() // Trigger onBlur
    
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 3)
  })

  it('calls onRemoveItem when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i })
    await user.click(removeButtons[0])
    
    expect(mockOnRemoveItem).toHaveBeenCalledWith('1')
  })

  it('calls onCheckout when checkout button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i })
    await user.click(checkoutButton)
    
    expect(mockOnCheckout).toHaveBeenCalledTimes(1)
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    const backButton = screen.getByRole('button', { name: /Back/i })
    await user.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('shows empty state when no cart items', () => {
    render(
      <CartScreen 
        cartItems={[]}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument()
    expect(screen.getByText(/Add some items to get started/)).toBeInTheDocument()
  })

  it('disables checkout button when cart is empty', () => {
    render(
      <CartScreen 
        cartItems={[]}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i })
    expect(checkoutButton).toBeDisabled()
  })

  it('shows item subtotals correctly', () => {
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    // Check for item subtotals
    expect(screen.getByText('$25.98')).toBeInTheDocument() // 12.99 * 2
    expect(screen.getByText('$8.99')).toBeInTheDocument() // 8.99 * 1
  })

  it('has proper accessibility attributes', () => {
    render(
      <CartScreen 
        cartItems={mockCartItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
        onCheckout={mockOnCheckout}
        onBack={mockOnBack}
      />
    )
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Your Cart')
    
    // Check for quantity inputs
    const quantityInputs = screen.getAllByRole('spinbutton')
    expect(quantityInputs).toHaveLength(2)
    
    // Check for remove buttons
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i })
    expect(removeButtons).toHaveLength(2)
  })
})
