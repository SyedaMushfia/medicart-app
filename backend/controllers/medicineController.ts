import { IncomingMessage, ServerResponse } from 'node:http';
import { db } from '../db/supabaseClient.ts';
import { parseQueryParams, sendJson, sendError } from '../middleware/httpUtils.ts';

export async function handleGetMedicines(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const { query } = parseQueryParams(req.url || '');
    const category = query.category;
    const search = query.search;
    const minPrice = query.minPrice ? parseFloat(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? parseFloat(query.maxPrice) : undefined;
    const inStockOnly = query.inStockOnly === 'true';
    const sort = query.sort;

    const medicines = await db.getMedicines({
      category,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      sort,
    });

    sendJson(res, 200, {
      success: true,
      data: medicines,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch medicines';
    console.error('GET /api/medicines failed:', msg);
    sendError(res, 500, msg);
  }
}

export async function handleGetMedicineById(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
): Promise<void> {
  try {
    const medicine = await db.getMedicineById(id);
    if (!medicine) {
      sendError(res, 404, `Product with ID '${id}' not found`);
      return;
    }

    sendJson(res, 200, {
      success: true,
      data: medicine,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch medicine details';
    console.error(`GET /api/medicines/${id} failed:`, msg);
    sendError(res, 500, msg);
  }
}

export async function handleGetCategories(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const categories = await db.getCategories();
    sendJson(res, 200, {
      success: true,
      data: categories,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch categories';
    console.error('GET /api/categories failed:', msg);
    sendError(res, 500, msg);
  }
}
