import { z } from 'zod';

export const OrderItemSchema = z.object({
  medicine_id: z.string().min(1, 'Medicine ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const CreateOrderSchema = z.object({
  customer_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  customer_email: z.string().trim().email('Enter a valid email address').max(254),
  items: z.array(OrderItemSchema).min(1, 'Cart must contain at least one product').max(50),
}).superRefine(({ items }, context) => {
  const medicineIds = new Set<string>();
  for (const [index, item] of items.entries()) {
    if (medicineIds.has(item.medicine_id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'medicine_id'],
        message: 'A medicine may only appear once in the order.',
      });
    }
    medicineIds.add(item.medicine_id);
  }
});

export const OrderLookupSchema = z.object({
  reference: z.string().trim().min(1, 'Order reference is required').max(40),
  email: z.string().trim().email('Enter a valid email address').max(254),
});
