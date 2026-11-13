import { IncomingMessage, ServerResponse } from 'node:http';
import {
  handleGetCategories,
  handleGetMedicineById,
  handleGetMedicines,
} from './controllers/medicineController.ts';
import { handleCreateOrder, handleTrackOrder } from './controllers/orderController.ts';
import { db, isSupabaseConfigured } from './db/supabaseClient.ts';
import { parseQueryParams, sendError, sendJson } from './middleware/httpUtils.ts';

export async function handleNativeApiRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const method = req.method?.toUpperCase() || 'GET';
  const { pathname } = parseQueryParams(req.url || '');

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return true;
  }

  if (pathname === '/api/health' && method === 'GET') {
    const data = {
      timestamp: new Date().toISOString(),
      supabase_configured: isSupabaseConfigured,
      environment: process.env.NODE_ENV || 'development',
    };

    if (!isSupabaseConfigured) {
      sendJson(res, 503, {
        success: false,
        message: 'Supabase is not configured',
        data,
      });
      return true;
    }

    try {
      await db.checkConnection();
      sendJson(res, 200, {
        success: true,
        message: 'Supabase is reachable and the medicines table is available',
        data: { ...data, supabase_connected: true },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Supabase connection check failed';
      console.error('Supabase health check failed:', message);
      sendJson(res, 503, {
        success: false,
        message: 'Supabase connection check failed',
        error: message,
        data: { ...data, supabase_connected: false },
      });
    }
    return true;
  }

  if (!pathname.startsWith('/api')) return false;

  if (!isSupabaseConfigured) {
    sendError(
      res,
      503,
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in the backend environment.'
    );
    return true;
  }

  if (pathname === '/api/categories' && method === 'GET') {
    await handleGetCategories(req, res);
    return true;
  }

  if (pathname === '/api/medicines' && method === 'GET') {
    await handleGetMedicines(req, res);
    return true;
  }

  const medicineMatch = pathname.match(/^\/api\/medicines\/([a-zA-Z0-9_-]+)$/);
  if (medicineMatch && method === 'GET') {
    await handleGetMedicineById(req, res, medicineMatch[1]);
    return true;
  }

  if (pathname === '/api/orders' && method === 'POST') {
    await handleCreateOrder(req, res);
    return true;
  }

  if (pathname === '/api/orders/track' && method === 'GET') {
    await handleTrackOrder(req, res);
    return true;
  }

  sendError(res, 404, `Endpoint ${method} ${pathname} not found`);
  return true;
}
