import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Package } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '../../../types.ts';

export const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = (location.state as { order?: Order } | null)?.order;

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md bg-white rounded-3xl border border-[#E3EAE5] p-8 text-center">
          <h1 className="text-xl font-bold">Order details unavailable</h1>
          <p className="text-sm text-[#718078] mt-2 mb-6">
            To look up an order, enter the order reference and checkout email.
          </p>
          <Link to="/track" className="px-5 py-3 bg-[#2E8B57] text-white rounded-xl font-semibold">
            Look up an order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="bg-white rounded-3xl border border-[#E3EAE5] p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-[#2E8B57] mx-auto mb-4" />
          <p className="text-sm font-bold text-[#2E8B57]">ORDER PLACED</p>
          <h1 className="text-3xl font-extrabold mt-2">Thank you, {order.customer_name}!</h1>
          <p className="text-sm text-[#718078] mt-2">
            A confirmation for this order is associated with {order.customer_email}.
          </p>
          <div className="inline-block mt-6 px-6 py-4 rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5]">
            <p className="text-xs text-[#718078]">Order reference</p>
            <p className="text-2xl font-mono font-extrabold text-[#1F5D42]">{order.order_reference}</p>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-[#E3EAE5] p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[#F8FAF8]">
              <p className="text-xs text-[#718078]">Placed</p>
              <p className="font-semibold">{format(new Date(order.order_date), 'MMM d, yyyy · h:mm a')}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF8]">
              <p className="flex items-center gap-1 text-xs text-[#718078]"><Clock className="w-3.5 h-3.5" /> Expected delivery</p>
              <p className="font-semibold">{format(new Date(order.expected_delivery_time), 'MMM d, yyyy · h:mm a')}</p>
              <p className="text-xs text-[#718078]">Estimated one hour after order placement.</p>
            </div>
          </div>

          <h2 className="flex items-center gap-2 font-bold border-b border-[#E3EAE5] pb-3">
            <Package className="w-5 h-5 text-[#2E8B57]" /> Items ordered
          </h2>
          <div className="divide-y divide-[#E3EAE5]">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between gap-4 text-sm">
                <span>{item.medicine_name} × {item.quantity}</span>
                <span className="font-semibold">${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-[#E3EAE5] pt-4 text-lg font-bold">
            <span>Total</span><span>${Number(order.total_amount).toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate(`/track?ref=${encodeURIComponent(order.order_reference)}`)}
            className="w-full mt-6 py-3 rounded-xl bg-[#2E8B57] text-white font-semibold hover:bg-[#1F5D42]"
          >
            Look up this order
          </button>
        </section>
      </div>
    </div>
  );
};
