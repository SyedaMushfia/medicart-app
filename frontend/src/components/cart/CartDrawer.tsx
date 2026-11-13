import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext.tsx';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    total,
  } = useCart();

  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewFullCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E3EAE5]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E3EAE5] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#25332B]">Your Shopping Cart</h2>
                <p className="text-xs text-[#718078] mt-0.5">
                  {items.length === 0
                    ? 'Cart is empty'
                    : `${items.reduce((s, i) => s + i.quantity, 0)} item(s) selected`}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#718078] hover:text-[#25332B] hover:bg-[#F8FAF8] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F5EC] flex items-center justify-center text-[#2E8B57] mb-4">
                    <Truck className="w-8 h-8 opacity-70" />
                  </div>
                  <h3 className="text-base font-semibold text-[#25332B]">Your cart is empty</h3>
                  <p className="text-sm text-[#718078] max-w-xs mt-1 mb-6">
                    Explore healthcare essentials, vitamins, and over-the-counter wellness products.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/shop');
                    }}
                    className="px-5 py-2.5 bg-[#2E8B57] text-white rounded-xl text-sm font-semibold hover:bg-[#1F5D42] transition-colors"
                  >
                    Browse Medicines & Products
                  </button>
                </div>
              ) : (
                items.map(({ medicine, quantity }) => (
                  <div
                    key={medicine.id}
                    className="flex gap-4 p-3 rounded-xl border border-[#E3EAE5] bg-[#F8FAF8]/50 hover:bg-[#F8FAF8] transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg bg-white border border-[#E3EAE5] overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img
                        src={medicine.image_url}
                        alt={medicine.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#25332B] line-clamp-1">
                            {medicine.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(medicine.id)}
                            className="text-[#718078] hover:text-red-500 transition-colors p-0.5"
                            title="Remove product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#718078] mt-0.5">
                          {medicine.category_name || 'Healthcare'} · <span className="tabular-nums">${medicine.price.toFixed(2)}</span>
                        </p>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E3EAE5]/60">
                        <div className="flex items-center border border-[#E3EAE5] bg-white rounded-lg">
                          <button
                            onClick={() => updateQuantity(medicine.id, quantity - 1)}
                            className="p-1 hover:bg-[#F8FAF8] text-[#25332B] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold tabular-nums text-[#25332B]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(medicine.id, quantity + 1)}
                            disabled={quantity >= medicine.stock_quantity}
                            className={`p-1 hover:bg-[#F8FAF8] text-[#25332B] transition-colors ${
                              quantity >= medicine.stock_quantity ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[#1F5D42] tabular-nums">
                          ${(medicine.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Action */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#E3EAE5] bg-white space-y-3">
                <div className="space-y-1.5 text-xs text-[#718078]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#25332B] tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#25332B] pt-2 border-t border-[#E3EAE5]">
                    <span>Total Amount</span>
                    <span className="text-[#1F5D42] tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleViewFullCart}
                    className="flex-1 py-2.5 border border-[#E3EAE5] text-[#25332B] rounded-xl text-xs font-semibold hover:bg-[#F8FAF8] transition-colors"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    className="flex-2 py-2.5 bg-[#2E8B57] text-white rounded-xl text-xs font-semibold hover:bg-[#1F5D42] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#718078] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E8B57]" />
                  <span>100% Genuine Pharmacy Stock · Tamper-proof Packaging</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
