export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  product_count?: number;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  category_name?: string;
  stock_quantity: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  medicine_id: string;
  medicine_name: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  order_date: string;
  expected_delivery_time: string;
  items: OrderItem[];
}

export interface PlaceOrderInput {
  customer_name: string;
  customer_email: string;
  order_reference: string;
  items: { medicine_id: string; quantity: number }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
