import { EventEmitter } from 'node:events';
import { IncomingMessage, ServerResponse } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSupabase = vi.hoisted(() => ({
  configured: true,
  checkConnection: vi.fn(),
  placeOrder: vi.fn(),
  findOrder: vi.fn(),
}));

vi.mock('../db/supabaseClient.ts', () => ({
  get isSupabaseConfigured() {
    return mockSupabase.configured;
  },
  db: {
    checkConnection: mockSupabase.checkConnection,
    placeOrder: mockSupabase.placeOrder,
    findOrder: mockSupabase.findOrder,
  },
}));

import { handleNativeApiRequest } from '../router.ts';

const order = {
  id: 'a7a4e712-fd5c-4e51-9a7a-808419a1550e',
  order_reference: 'MC-ORDER-123',
  customer_name: 'Test Customer',
  customer_email: 'test@example.com',
  total_amount: 13,
  order_date: '2026-10-30T10:00:00.000Z',
  expected_delivery_time: '2026-10-30T11:00:00.000Z',
  items: [{
    id: 'f4c97b84-3f21-4127-9068-c7244d090981',
    order_id: 'a7a4e712-fd5c-4e51-9a7a-808419a1550e',
    medicine_id: 'med-001',
    medicine_name: 'Sample medicine',
    image_url: '/sample.jpg',
    quantity: 1,
    unit_price: 13,
    subtotal: 13,
  }],
};

function createMockExchange(options: {
  url: string;
  method: string;
  body?: unknown;
}) {
  const req = new EventEmitter() as unknown as IncomingMessage;
  req.url = options.url;
  req.method = options.method;
  req.headers = {};

  type MockResponse = EventEmitter & {
    statusCode: number;
    _data: string;
    writeHead: (statusCode: number) => MockResponse;
    end: (chunk?: string | Uint8Array) => MockResponse;
  };
  const res = new EventEmitter() as MockResponse;
  res.statusCode = 200;
  res._data = '';
  res.writeHead = ((statusCode: number) => {
    res.statusCode = statusCode;
    return res;
  });
  res.end = ((chunk?: string | Uint8Array) => {
    if (chunk) res._data += chunk.toString();
    return res;
  });

  const dispatch = async () => {
    const responsePromise = handleNativeApiRequest(req, res as unknown as ServerResponse);
    if (options.body !== undefined) {
      req.emit('data', Buffer.from(JSON.stringify(options.body)));
    }
    req.emit('end');
    await responsePromise;
    return {
      statusCode: res.statusCode,
      body: res._data ? JSON.parse(res._data) : null,
    };
  };

  return { dispatch };
}

describe('MediCart Supabase API', () => {
  beforeEach(() => {
    mockSupabase.configured = true;
    mockSupabase.checkConnection.mockReset();
    mockSupabase.placeOrder.mockReset();
    mockSupabase.findOrder.mockReset();
  });

  it('reports when Supabase is not configured', async () => {
    mockSupabase.configured = false;
    const { dispatch } = createMockExchange({ url: '/api/health', method: 'GET' });

    const result = await dispatch();

    expect(result.statusCode).toBe(503);
    expect(result.body.success).toBe(false);
    expect(result.body.data.supabase_configured).toBe(false);
    expect(mockSupabase.checkConnection).not.toHaveBeenCalled();
  });

  it('checks Supabase connectivity in the health endpoint', async () => {
    mockSupabase.checkConnection.mockResolvedValue(undefined);
    const { dispatch } = createMockExchange({ url: '/api/health', method: 'GET' });

    const result = await dispatch();

    expect(result.statusCode).toBe(200);
    expect(result.body.data.supabase_connected).toBe(true);
    expect(mockSupabase.checkConnection).toHaveBeenCalledOnce();
  });

  it('reports a Supabase connection failure from the health endpoint', async () => {
    mockSupabase.checkConnection.mockRejectedValue(new Error('TypeError: fetch failed'));
    const { dispatch } = createMockExchange({ url: '/api/health', method: 'GET' });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await dispatch();

    expect(result.statusCode).toBe(503);
    expect(result.body.data.supabase_connected).toBe(false);
    expect(result.body.error).toBe('TypeError: fetch failed');
    consoleError.mockRestore();
  });

  it('validates checkout before attempting to save an order', async () => {
    const { dispatch } = createMockExchange({
      url: '/api/orders',
      method: 'POST',
      body: {
        customer_name: 'A',
        customer_email: 'not-an-email',
        items: [],
      },
    });

    const result = await dispatch();

    expect(result.statusCode).toBe(400);
    expect(result.body.success).toBe(false);
    expect(mockSupabase.placeOrder).not.toHaveBeenCalled();
  });

  it('uses the database order result and normalizes checkout email', async () => {
    mockSupabase.placeOrder.mockResolvedValue(order);
    const { dispatch } = createMockExchange({
      url: '/api/orders',
      method: 'POST',
      body: {
        customer_name: 'Test Customer',
        customer_email: 'TEST@EXAMPLE.COM',
        items: [{ medicine_id: 'med-001', quantity: 1 }],
      },
    });

    const result = await dispatch();

    expect(result.statusCode).toBe(201);
    expect(result.body.data.order_reference).toMatch(/^MC-/);
    expect(mockSupabase.placeOrder).toHaveBeenCalledWith(
      expect.objectContaining({ customer_email: 'test@example.com' })
    );
  });

  it('rejects duplicate products in one checkout', async () => {
    const { dispatch } = createMockExchange({
      url: '/api/orders',
      method: 'POST',
      body: {
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        items: [
          { medicine_id: 'med-001', quantity: 1 },
          { medicine_id: 'med-001', quantity: 2 },
        ],
      },
    });

    const result = await dispatch();

    expect(result.statusCode).toBe(400);
    expect(mockSupabase.placeOrder).not.toHaveBeenCalled();
  });

  it('returns a conflict if inventory changed before checkout completed', async () => {
    mockSupabase.placeOrder.mockRejectedValue(new Error('INSUFFICIENT_STOCK'));
    const { dispatch } = createMockExchange({
      url: '/api/orders',
      method: 'POST',
      body: {
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        items: [{ medicine_id: 'med-001', quantity: 1 }],
      },
    });

    const result = await dispatch();

    expect(result.statusCode).toBe(409);
    expect(result.body.error).toContain('stock');
  });

  it('looks up orders using both email and reference', async () => {
    mockSupabase.findOrder.mockResolvedValue(order);
    const { dispatch } = createMockExchange({
      url: '/api/orders/track?reference=mc-order-123&email=TEST%40EXAMPLE.COM',
      method: 'GET',
    });

    const result = await dispatch();

    expect(result.statusCode).toBe(200);
    expect(result.body.data.customer_name).toBe('Test Customer');
    expect(mockSupabase.findOrder).toHaveBeenCalledWith('mc-order-123', 'test@example.com');
  });

  it('does not expose the removed auth and admin endpoints', async () => {
    const { dispatch } = createMockExchange({ url: '/api/auth/login', method: 'POST' });

    const result = await dispatch();

    expect(result.statusCode).toBe(404);
  });
});
