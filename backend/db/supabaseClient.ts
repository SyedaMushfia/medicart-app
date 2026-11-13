import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Category, Medicine, Order, PlaceOrderInput } from '../../types.ts';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseSecretKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project')
);

let client: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in the backend environment.'
    );
  }

  client ??= createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}

function throwOnError(error: { message: string } | null): void {
  if (error) {
    throw new Error(`Supabase request failed: ${error.message}`);
  }
}

class SupabaseDatabase {
  async checkConnection(): Promise<void> {
    const { error } = await getSupabase()
      .from('medicines')
      .select('id')
      .limit(1);
    throwOnError(error);
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await getSupabase()
      .from('medicines')
      .select('category_id, name, image_url')
      .order('category_id');
    throwOnError(error);

    const categories = new Map<string, Category>();
    for (const medicine of data || []) {
      if (!medicine.category_id) continue;

      const existing = categories.get(medicine.category_id);
      if (existing) {
        existing.product_count = (existing.product_count || 0) + 1;
      } else {
        categories.set(medicine.category_id, {
          id: medicine.category_id,
          name: medicine.category_id
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          description: `Browse ${medicine.category_id.replaceAll('-', ' ')} products.`,
          image_url: medicine.image_url,
          product_count: 1,
        });
      }
    }

    return [...categories.values()];
  }

  async getMedicines(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sort?: string;
  }): Promise<Medicine[]> {
    let query = getSupabase().from('medicines').select('*');
    if (params?.category && params.category !== 'all') {
      query = query.eq('category_id', params.category);
    }
    if (params?.search) {
      const search = params.search.replace(/[,%()]/g, ' ').trim();
      if (search) query = query.ilike('name', `%${search}%`);
    }
    if (params?.minPrice !== undefined) query = query.gte('price', params.minPrice);
    if (params?.maxPrice !== undefined) query = query.lte('price', params.maxPrice);
    if (params?.inStockOnly) query = query.gt('stock_quantity', 0);

    switch (params?.sort) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'name-asc':
        query = query.order('name', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    throwOnError(error);
    return (data || []) as Medicine[];
  }

  async getMedicineById(id: string): Promise<Medicine | null> {
    const { data, error } = await getSupabase()
      .from('medicines')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    throwOnError(error);
    return data as Medicine | null;
  }

  async placeOrder(input: PlaceOrderInput): Promise<Order> {
    const { data, error } = await getSupabase().rpc('place_order', {
      p_customer_name: input.customer_name,
      p_customer_email: input.customer_email,
      p_order_reference: input.order_reference,
      p_items: input.items,
    });
    throwOnError(error);

    if (!data || typeof data !== 'object') {
      throw new Error('Supabase did not return the created order.');
    }
    return data as Order;
  }

  async findOrder(reference: string, email: string): Promise<Order | null> {
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_reference', reference.trim().toUpperCase())
      .eq('customer_email', email.trim().toLowerCase())
      .maybeSingle();
    throwOnError(error);
    return data as Order | null;
  }
}

export const db = new SupabaseDatabase();
