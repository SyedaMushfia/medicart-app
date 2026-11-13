import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    total,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center bg-white p-10 rounded-3xl border border-[#E3EAE5] shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F5EC] text-[#2E8B57] flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 opacity-70" />
          </div>
          <h1 className="text-xl font-bold text-[#25332B]">Your shopping cart is empty</h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-2 mb-6">
            You don't have any medical or wellness essentials in your cart right now.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E8B57] text-white rounded-xl text-xs font-semibold hover:bg-[#1F5D42] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Pharmacy Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25332B] tracking-tight">
              Shopping Cart Review
            </h1>
            <p className="text-xs sm:text-sm text-[#718078] mt-1">
              Verify your prescribed or wellness supplies before proceeding to secure checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table / List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E3EAE5] p-6 shadow-xs divide-y divide-[#E3EAE5]">
            {items.map(({ medicine, quantity }) => (
              <div key={medicine.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#F8FAF8] border border-[#E3EAE5] p-2 shrink-0 flex items-center justify-center">
                    <img
                      src={medicine.image_url}
                      alt={medicine.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#718078] block">
                      {medicine.category_name || 'Healthcare'}
                    </span>
                    <Link
                      to={`/product/${medicine.id}`}
                      className="text-sm font-bold text-[#25332B] hover:text-[#2E8B57] transition-colors line-clamp-1"
                    >
                      {medicine.name}
                    </Link>
                    <span className="text-xs text-[#718078] block mt-0.5">
                      Price per unit: <strong className="tabular-nums text-[#25332B]">${medicine.price.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                  {/* Stepper with stock limit prevention */}
                  <div className="flex items-center border border-[#E3EAE5] bg-[#F8FAF8] rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(medicine.id, quantity - 1)}
                      className="p-1.5 text-[#25332B] hover:bg-white rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold tabular-nums text-[#25332B]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(medicine.id, quantity + 1)}
                      disabled={quantity >= medicine.stock_quantity}
                      className="p-1.5 text-[#25332B] hover:bg-white rounded-lg disabled:opacity-40 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-bold text-[#1F5D42] tabular-nums block">
                      ${(medicine.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(medicine.id)}
                    className="p-2 text-[#718078] hover:text-red-600 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Checkout Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-[#E3EAE5] p-6 shadow-xs sticky top-24 space-y-5">
              <h2 className="text-base font-bold text-[#25332B] border-b border-[#E3EAE5] pb-3">
                Order Total Breakdown
              </h2>

              <div className="space-y-3 text-xs text-[#718078]">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#25332B] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#25332B] pt-3 border-t border-[#E3EAE5]">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#1F5D42] tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#2E8B57] text-white rounded-xl text-xs font-semibold hover:bg-[#1F5D42] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/shop"
                className="block text-center text-xs font-semibold text-[#718078] hover:text-[#25332B] transition-colors"
              >
                ← Continue Shopping
              </Link>

              <div className="pt-3 border-t border-[#E3EAE5] space-y-2 text-[11px] text-[#718078]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E8B57] shrink-0" />
                  <span>All items verified against licensed dispensary batch registry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
