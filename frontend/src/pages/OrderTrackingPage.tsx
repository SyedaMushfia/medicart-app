import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '../../../types.ts';
import { orderApi } from '../services/api.ts';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [reference, setReference] = useState(searchParams.get('ref') || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setOrder(null);
    setLoading(true);
    try {
      setOrder(await orderApi.trackOrder(reference.trim(), email.trim()));
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { error?: string } } }).response?.data?.error ||
          'Unable to look up this order. Check the email and reference, then try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[65vh] bg-[#F8FAF8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <section className="bg-white rounded-3xl border border-[#E3EAE5] p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold text-[#25332B]">Look up your order</h1>
          <p className="text-sm text-[#718078] mt-2 mb-6">
            Enter the order reference and the email address used at checkout.
          </p>
          <form onSubmit={lookup} className="space-y-4">
            <div>
              <label htmlFor="order-reference" className="block text-sm font-semibold mb-1.5">Order reference</label>
              <input
                id="order-reference"
                required
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="e.g. MC-..."
                className="w-full px-4 py-3 rounded-xl border border-[#E3EAE5] bg-[#F8FAF8] outline-none focus:border-[#2E8B57]"
              />
            </div>
            <div>
              <label htmlFor="order-email" className="block text-sm font-semibold mb-1.5">Checkout email</label>
              <input
                id="order-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E3EAE5] bg-[#F8FAF8] outline-none focus:border-[#2E8B57]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2E8B57] text-white font-semibold hover:bg-[#1F5D42] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> {loading ? 'Looking up...' : 'Find order'}
            </button>
          </form>
        </section>

        {error && (
          <div role="alert" className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {order && (
          <section className="mt-6 bg-white rounded-3xl border border-[#E3EAE5] p-6 sm:p-8">
            <div className="flex flex-wrap justify-between gap-3 border-b border-[#E3EAE5] pb-4">
              <div>
                <p className="text-xs text-[#718078]">Order reference</p>
                <h2 className="text-xl font-mono font-bold text-[#1F5D42]">{order.order_reference}</h2>
                <p className="text-sm mt-1">Order for {order.customer_name}</p>
              </div>
              <div className="text-sm sm:text-right">
                <p className="flex items-center gap-1 text-xs text-[#718078]"><Clock className="w-3.5 h-3.5" /> Expected delivery</p>
                <p className="font-semibold">{format(new Date(order.expected_delivery_time), 'MMM d, yyyy · h:mm a')}</p>
                <p className="text-xs text-[#718078]">One hour after order placement</p>
              </div>
            </div>
            <div className="divide-y divide-[#E3EAE5]">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between gap-4 text-sm">
                  <span>{item.medicine_name} × {item.quantity}</span>
                  <span className="font-semibold">${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-[#E3EAE5] pt-4 font-bold text-lg">
              <span>Total</span><span>${Number(order.total_amount).toFixed(2)}</span>
            </div>
          </section>
        )}

        <p className="text-center text-sm text-[#718078] mt-6">
          Need to shop? <Link to="/shop" className="text-[#2E8B57] font-semibold">Browse medicines</Link>
        </p>
      </div>
    </div>
  );
};
