import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, AlertCircle, Eye } from 'lucide-react';
import { Medicine } from '../../../../types.ts';
import { useCart } from '../../context/CartContext.tsx';

interface ProductCardProps {
  product: Medicine;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();
  const cartItem = items.find((i) => i.medicine.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group rounded-2xl bg-white border border-[#E3EAE5] overflow-hidden hover:border-[#A8D5BA] hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Product Image Area */}
        <Link
          to={`/product/${product.id}`}
          className="relative block aspect-square bg-[#F8FAF8] border-b border-[#E3EAE5] overflow-hidden p-4"
        >
          <img
            src={product.image_url}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Graceful styled SVG fallback container
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon w-full h-full flex flex-col items-center justify-center text-[#718078] text-xs';
                fallback.innerHTML = `<svg class="w-12 h-12 text-[#A8D5BA] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg><span>${product.name}</span>`;
                parent.appendChild(fallback);
              }
            }}
          />

          {/* Prescription or Stock Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            {isLowStock && (
              <span className="text-[11px] font-medium text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                Only {product.stock_quantity} left
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Details Floating Hover Action */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span
              className="p-2 bg-white/90 backdrop-blur-xs text-[#25332B] rounded-full shadow-sm hover:bg-[#2E8B57] hover:text-white transition-colors flex items-center justify-center"
              title="View Product Details"
            >
              <Eye className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Category & Package size */}
          <div className="flex items-center gap-2 text-xs text-[#718078]">
            <span>{product.category_name || 'Healthcare'}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-base font-semibold text-[#25332B] group-hover:text-[#2E8B57] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#718078] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart Action */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-[#E3EAE5]">
          <div>
            <span className="text-xs text-[#718078] block">Price</span>
            <span className="text-base font-bold text-[#1F5D42] tabular-nums">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : inCartQty > 0
                ? 'bg-[#E8F5EC] text-[#1F5D42] border border-[#2E8B57]/40 hover:bg-[#2E8B57] hover:text-white'
                : 'bg-[#2E8B57] text-white hover:bg-[#1F5D42]'
            }`}
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart ({inCartQty})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
