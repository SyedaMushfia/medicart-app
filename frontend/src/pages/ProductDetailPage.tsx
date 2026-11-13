import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Pill,
  Heart,
  Share2,
} from 'lucide-react';
import { medicineApi } from '../services/api.ts';
import { useCart } from '../context/CartContext.tsx';
import { Medicine } from '../../../types.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { toast } from 'sonner';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState<Medicine | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Medicine[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setLoadError(null);
        const data = await medicineApi.getMedicineById(id);
        setProduct(data);

        // Fetch related products in same category
        const catalog = await medicineApi.getMedicines({ category: data.category_id });
        setRelatedProducts(catalog.filter((m) => m.id !== id).slice(0, 3));
      } catch (error) {
        setProduct(null);
        setRelatedProducts([]);
        setLoadError(
          (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Unable to load this product. Check the backend and Supabase setup.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-white rounded-3xl border border-[#E3EAE5]" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-3/4 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-bold text-[#25332B]">{loadError ? 'Unable to Load Product' : 'Healthcare Product Not Found'}</h2>
        <p className="text-sm text-[#718078] mt-2 mb-6">{loadError || 'The requested product could not be found or has been discontinued.'}</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#2E8B57] text-white rounded-xl text-xs font-semibold hover:bg-[#1F5D42]"
        >
          Return to Pharmacy Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const cartItem = items.find((i) => i.medicine.id === product.id);
  const currentInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#718078] hover:text-[#25332B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-lg border border-[#E3EAE5] text-[#718078] hover:text-[#25332B] transition-colors"
              title="Share product link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product PDP Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-[#E3EAE5] shadow-xs">
          {/* Left Column: Product Gallery / Image */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-lg rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5] p-8 flex items-center justify-center overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />

            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2E8B57]">
                  {product.category_name || 'Healthcare'}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    isOutOfStock
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-[#E8F5EC] text-[#1F5D42] border border-[#A8D5BA]/50'
                  }`}
                >
                  {isOutOfStock ? 'Currently Out of Stock' : `In Stock (${product.stock_quantity} available)`}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25332B] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-extrabold text-[#1F5D42] tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-[#718078]">
                  Tax included
                </span>
              </div>

              {/* Short Description */}
              <p className="text-sm text-[#718078] leading-relaxed">
                {product.description}
              </p>

            </div>

            {/* Purchase Control & Quantity Stepper */}
            <div className="pt-6 border-t border-[#E3EAE5] space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E3EAE5] bg-[#F8FAF8] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-[#25332B] hover:bg-white rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-[#25332B] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity || isOutOfStock}
                    className="p-2 text-[#25332B] hover:bg-white rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#2E8B57] text-white hover:bg-[#1F5D42]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart · ${(product.price * quantity).toFixed(2)}</span>
                </button>
              </div>

              {currentInCart > 0 && (
                <p className="text-xs text-[#2E8B57] font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  You have {currentInCart} unit(s) of this item in your shopping cart.
                </p>
              )}

              {/* Delivery & Assurance Strip */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#718078]">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAF8] border border-[#E3EAE5]">
                  <Truck className="w-4 h-4 text-[#2E8B57] shrink-0" />
                  <span>Estimated delivery within one hour</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAF8] border border-[#E3EAE5]">
                  <ShieldCheck className="w-4 h-4 text-[#2E8B57] shrink-0" />
                  <span>Licensed dispensary direct packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[#25332B] mb-6">Related Healthcare Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
