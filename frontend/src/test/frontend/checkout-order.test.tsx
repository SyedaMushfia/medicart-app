import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { OrderConfirmationPage } from '../../pages/OrderConfirmationPage.tsx';
import { Order } from '../../../../types.ts';

const testOrder: Order = {
  id: 'order-test-001',
  order_reference: 'MC-ORDER-123',
  customer_name: 'Test Customer',
  customer_email: 'test@example.com',
  total_amount: 13,
  order_date: '2026-10-30T10:00:00.000Z',
  expected_delivery_time: '2026-10-30T11:00:00.000Z',
  items: [{
    id: 'item-test-001',
    order_id: 'order-test-001',
    medicine_id: 'med-test-001',
    medicine_name: 'Sample medicine',
    image_url: '/sample.jpg',
    quantity: 1,
    unit_price: 13,
    subtotal: 13,
  }],
};

describe('Order Confirmation Component', () => {
  it('Order confirmation displays order reference and summary details', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/order-confirmation/${testOrder.id}`,
            state: { order: testOrder },
          },
        ]}
      >
        <OrderConfirmationPage />
      </MemoryRouter>
    );

    expect(screen.getByText(testOrder.order_reference)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Test Customer/ })).toBeInTheDocument();
    expect(screen.getAllByText(`$${testOrder.total_amount.toFixed(2)}`).length).toBeGreaterThan(0);
    expect(screen.getByText('Estimated one hour after order placement.')).toBeInTheDocument();
  });
});
