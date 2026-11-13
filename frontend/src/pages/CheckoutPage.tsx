import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext.tsx';
import { orderApi } from '../services/api.ts';

const CheckoutSchema = z.object({
  customer_name: z.string().trim().min(2, 'Enter your name (at least 2 characters).').max(120),
  customer_email: z.string().trim().email('Enter a valid email address.').max(254),
});

type CheckoutForm = z.infer<typeof CheckoutSchema>;

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(CheckoutSchema) });

  const submitOrder = async (form: CheckoutForm) => {
    try {
      setSubmitting(true);
      setOrderError(null);
      const order = await orderApi.createOrder({
        ...form,
        items: items.map(({ medicine, quantity }) => ({
          medicine_id: medicine.id,
          quantity,
        })),
      });
      clearCart();
      toast.success(`Order ${order.order_reference} placed!`);
      navigate(`/order-confirmation/${order.id}`, { state: { order } });
    } catch (error) {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Unable to place your order. Please try again.';
      setOrderError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E3EAE5] text-center max-w-md">
          <h1 className="text-xl font-bold">Your cart is empty</h1>
          <p className="text-sm text-[#718078] mt-2 mb-6">Add products before checking out.</p>
          <Link to="/shop" className="px-6 py-3 bg-[#2E8B57] text-white rounded-xl font-semibold">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-[#718078] mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>
        <h1 className="text-3xl font-extrabold text-[#25332B]">Checkout</h1>
        <p className="text-sm text-[#718078] mt-1 mb-8">No account needed. Enter your name and email to place your order.</p>

        {orderError && (
          <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{orderError}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit(submitOrder)} className="lg:col-span-3 bg-white rounded-3xl border border-[#E3EAE5] p-6 sm:p-8 space-y-5">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-semibold mb-1.5">Your name</label>
              <input
                id="customer_name"
                autoComplete="name"
                {...register('customer_name')}
                className="w-full px-4 py-3 rounded-xl border border-[#E3EAE5] bg-[#F8FAF8] outline-none focus:border-[#2E8B57]"
                placeholder="Full name"
              />
              {errors.customer_name && <p className="text-rose-600 text-xs mt-1">{errors.customer_name.message}</p>}
            </div>
            <div>
              <label htmlFor="customer_email" className="block text-sm font-semibold mb-1.5">Email address</label>
              <input
                id="customer_email"
                type="email"
                autoComplete="email"
                {...register('customer_email')}
                className="w-full px-4 py-3 rounded-xl border border-[#E3EAE5] bg-[#F8FAF8] outline-none focus:border-[#2E8B57]"
                placeholder="you@example.com"
              />
              {errors.customer_email && <p className="text-rose-600 text-xs mt-1">{errors.customer_email.message}</p>}
              <p className="text-xs text-[#718078] mt-1">Use this same email with your order reference to look up your order.</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#2E8B57] text-white rounded-xl font-bold hover:bg-[#1F5D42] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing order...</> : <><CheckCircle className="w-4 h-4" /> Place order</>}
            </button>
          </form>

          <aside className="lg:col-span-2 bg-white rounded-3xl border border-[#E3EAE5] p-6 h-fit">
            <h2 className="text-lg font-bold border-b border-[#E3EAE5] pb-3 mb-3">Order summary</h2>
            <div className="divide-y divide-[#E3EAE5]">
              {items.map(({ medicine, quantity }) => (
                <div key={medicine.id} className="py-3 flex justify-between gap-3 text-sm">
                  <span>{medicine.name} × {quantity}</span>
                  <span className="font-semibold">${(medicine.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-[#E3EAE5] pt-3 font-bold text-base">
                <span>Estimated total</span><span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#718078]">Final total and stock availability are verified by the server before your order is saved.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
