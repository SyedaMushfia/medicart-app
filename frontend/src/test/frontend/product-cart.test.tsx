import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard.tsx';
import { CartProvider, useCart } from '../../context/CartContext.tsx';
import { Medicine } from '../../../../types.ts';

const sampleMedicine: Medicine = {
  id: 'med-test-001',
  name: 'Sample Multivitamin',
  description: 'A sample product for cart tests.',
  price: 24.5,
  image_url: '/sample.jpg',
  category_id: 'vitamins',
  category_name: 'Vitamins & Supplements',
  stock_quantity: 45,
  created_at: '2026-10-15T08:00:00Z',
};

// Helper component to test cart state changes
const CartInspector: React.FC = () => {
  const { items, itemCount, subtotal, total, addToCart, updateQuantity } = useCart();
  return (
    <div>
      <div data-testid="cart-count">{itemCount}</div>
      <div data-testid="cart-subtotal">{subtotal}</div>
      <div data-testid="cart-total">{total}</div>
      <button
        data-testid="add-btn"
        onClick={() => addToCart(sampleMedicine, 2)}
      >
        Add 2
      </button>
      <button
        data-testid="update-qty-btn"
        onClick={() => updateQuantity(sampleMedicine.id, 5)}
      >
        Update to 5
      </button>
    </div>
  );
};

describe('Product Card and Shopping Cart Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Product cards render product name, price, and category', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <ProductCard product={sampleMedicine} />
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(sampleMedicine.name)).toBeInTheDocument();
    expect(screen.getByText(`$${sampleMedicine.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(sampleMedicine.category_name || '')).toBeInTheDocument();
  });

  it('Add to Cart button updates items and item count in context', () => {
    render(
      <CartProvider>
        <CartInspector />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-subtotal').textContent).toBe('0');

    fireEvent.click(screen.getByTestId('add-btn'));

    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    const expectedSubtotal = Number((sampleMedicine.price * 2).toFixed(2));
    expect(Number(screen.getByTestId('cart-subtotal').textContent)).toBe(expectedSubtotal);
  });

  it('Cart quantities update correctly and total matches the item subtotal', () => {
    render(
      <CartProvider>
        <CartInspector />
      </CartProvider>
    );

    fireEvent.click(screen.getByTestId('add-btn'));

    fireEvent.click(screen.getByTestId('update-qty-btn')); // 5 items
    expect(screen.getByTestId('cart-count').textContent).toBe('5');
    const expectedSubtotal = Number((sampleMedicine.price * 5).toFixed(2));
    expect(Number(screen.getByTestId('cart-subtotal').textContent)).toBe(expectedSubtotal);
    expect(Number(screen.getByTestId('cart-total').textContent)).toBe(expectedSubtotal);
  });
});
