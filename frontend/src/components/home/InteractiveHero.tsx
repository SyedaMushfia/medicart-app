import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ShieldCheck, HeartPulse, Sparkles, Pill, Activity } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { medicineApi } from '../../services/api.ts';
import { Medicine } from '../../../../types.ts';

export const InteractiveHero: React.FC = () => {
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [interactiveProducts, setInteractiveProducts] = useState<Medicine[]>([]);
  const [catalogError, setCatalogError] = useState(false);

  useEffect(() => {
    medicineApi.getMedicines({ inStockOnly: true, sort: 'newest' })
      .then((products) => setInteractiveProducts(products.slice(0, 3)))
      .catch(() => setCatalogError(true));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 20; // -10 to +10px
    const y = ((clientY - top) / height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const handleQuickAdd = (medicine: Medicine) => {
    addToCart(medicine, 1);
  };

  const selectedProduct = interactiveProducts[selectedProductIndex];

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAF8] to-white pt-12 pb-20 border-b border-[#E3EAE5]"
    >
      {/* Decorative Subtle Healthcare Elements in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-[#A8D5BA]/40 border-dashed"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-10 text-[#2E8B57]/20"
        >
          <Activity className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12 left-12 text-[#2E8B57]/15"
        >
          <HeartPulse className="w-14 h-14" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Trust Kicker without static pill candy */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F5D42] bg-[#E8F5EC] px-3 py-1 rounded-full border border-[#A8D5BA]/50">
              <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
              <span>Certified Online Pharmacy & Healthcare Essentials</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#25332B] leading-[1.15] text-balance">
              Your Health, <br />
              <span className="text-[#2E8B57]">Just a Click Away.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#718078] leading-relaxed max-w-xl">
              Discover everyday healthcare essentials and get the verified medicines, pure vitamins,
              and wellness supplies you need delivered right to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="px-7 py-3.5 bg-[#2E8B57] text-white rounded-xl text-sm font-semibold hover:bg-[#1F5D42] transition-all shadow-sm hover:shadow flex items-center gap-2 group whitespace-nowrap"
              >
                <span>Shop Medicines Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="px-6 py-3.5 bg-white border border-[#E3EAE5] text-[#25332B] rounded-xl text-sm font-semibold hover:bg-[#F8FAF8] hover:border-[#2E8B57]/40 transition-colors whitespace-nowrap"
              >
                Explore Categories
              </Link>
            </div>

            {/* Adjacency Trust Metric Strip */}
            <div className="pt-6 border-t border-[#E3EAE5] grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#1F5D42] tabular-nums">100%</p>
                <p className="text-xs text-[#718078] mt-0.5">Authentic Pharmacy Stock</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#1F5D42] tabular-nums">&lt; 2 Hrs</p>
                <p className="text-xs text-[#718078] mt-0.5">Express Dispatch</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#1F5D42] tabular-nums">24/7</p>
                <p className="text-xs text-[#718078] mt-0.5">Pharmacist Guidance</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Animated Hero Stage */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-3xl bg-white border border-[#E3EAE5] p-6 shadow-sm overflow-hidden"
            >
              {/* Main Visual Composition with High-Fidelity Asset */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F8FAF8] border border-[#E3EAE5]">
                <img
                  src="/images/hero_pharmacy_composition_1793340539574.jpg"
                  alt="MediCart Apothecary & Pharmacy Collection"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Subtle scrim for interactive badge readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Interactive Product Selector Tabs inside Hero */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#1F5D42] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2E8B57]" />
                      Interactive Pharmacy Showcase
                    </span>
                    <span className="text-[11px] text-[#718078]">Click to inspect item</span>
                  </div>

                  {interactiveProducts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {interactiveProducts.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => setSelectedProductIndex(index)}
                          className={`text-left p-2 rounded-lg border transition-all text-xs ${
                            selectedProductIndex === index
                              ? 'bg-[#E8F5EC] border-[#2E8B57] text-[#1F5D42] shadow-xs'
                              : 'bg-white border-[#E3EAE5] text-[#25332B] hover:bg-[#F8FAF8]'
                          }`}
                        >
                          <p className="font-semibold truncate text-[12px]">{product.name.split(' ')[0]}</p>
                          <p className="text-[11px] font-medium text-[#718078] tabular-nums">${product.price.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#718078]">
                      {catalogError ? 'Featured products could not be loaded.' : 'No products are available yet.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Floating Interactive Product Card with Motion Parallax */}
              {selectedProduct && (
                <motion.div
                  key={selectedProduct.id}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          x: mousePosition.x * 0.8,
                          y: mousePosition.y * 0.8 + (Math.sin(Date.now() / 1000) * 4),
                        }
                  }
                  transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                  className="mt-4 p-4 rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-contain bg-white border border-[#E3EAE5] p-1 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#2E8B57]">
                          {selectedProduct.category_name || selectedProduct.category_id}
                        </span>
                        <span className="text-[11px] text-[#718078]">·</span>
                        <span className="text-[11px] text-[#718078]">
                          {selectedProduct.stock_quantity} in stock
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#25332B]">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-xs text-[#718078] line-clamp-1 mt-0.5">
                        {selectedProduct.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-sm font-extrabold text-[#1F5D42] tabular-nums">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleQuickAdd(selectedProduct)}
                      className="px-3 py-1.5 bg-[#2E8B57] text-white text-xs font-semibold rounded-lg hover:bg-[#1F5D42] transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
