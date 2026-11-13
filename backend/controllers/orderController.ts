import { randomBytes } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import { db } from '../db/supabaseClient.ts';
import { parseJsonBody, parseQueryParams, sendError, sendJson } from '../middleware/httpUtils.ts';
import { CreateOrderSchema, OrderLookupSchema } from '../validation.ts';

export async function handleCreateOrder(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const parsed = CreateOrderSchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) {
      sendError(res, 400, parsed.error.issues.map((issue) => issue.message).join(', '));
      return;
    }

    const order = await db.placeOrder({
      ...parsed.data,
      customer_email: parsed.data.customer_email.toLowerCase(),
      order_reference: `MC-${Date.now().toString(36).toUpperCase()}-${randomBytes(3)
        .toString('hex')
        .toUpperCase()}`,
    });

    sendJson(res, 201, {
      success: true,
      data: order,
      message: 'Order placed successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    console.error('POST /api/orders failed:', message);
    const stockConflict = message.includes('INSUFFICIENT_STOCK');
    sendError(res, stockConflict ? 409 : 500, stockConflict
      ? 'One or more items no longer have enough stock. Please update your cart and try again.'
      : message);
  }
}

export async function handleTrackOrder(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const { query } = parseQueryParams(req.url || '');
    const parsed = OrderLookupSchema.safeParse(query);
    if (!parsed.success) {
      sendError(res, 400, parsed.error.issues.map((issue) => issue.message).join(', '));
      return;
    }

    const order = await db.findOrder(parsed.data.reference, parsed.data.email.toLowerCase());
    if (!order) {
      sendError(res, 404, 'No order matched that reference and email address.');
      return;
    }

    sendJson(res, 200, { success: true, data: order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to look up order';
    console.error('GET /api/orders/track failed:', message);
    sendError(res, 500, message);
  }
}
