import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles, HeartPulse, ShieldCheck, Pill, Check } from 'lucide-react';

interface FloatingProduct {
  id: string;
  name: string;
  badge: string;
  price: string;
  top: string;
  left?: string;
  right?: string;
  rotation: number;
  image: string;
  categoryLink: string;
}

const floatingProducts: FloatingProduct[] = [
  {
    id: 'p-1',
    name: 'Herbal Cough & Congestion',
    badge: 'Fast Relief',
    price: '$11.50',
    top: '12%',
    left: '4%',
    rotation: -4,
    image: '/images/category_medicines_1793340492870.jpg',
    categoryLink: '/shop?category=medicines',
  },
  {
    id: 'p-2',
    name: 'Vitality + Omega-3 Alaskan Oil',
    badge: 'Top Rated',
    price: '$22.95',
    top: '58%',
    left: '2%',
    rotation: 5,
    image: '/images/category_vitamins_1793340493065.jpg',
    categoryLink: '/shop?category=vitamins',
  },
  {
    id: 'p-3',
    name: 'Upper Arm BP Monitor',
    badge: 'Clinical Grade',
    price: '$49.99',
    top: '22%',
    right: '4%',
    rotation: 3,
    image: '/images/category_devices_1793340493972.jpg',
    categoryLink: '/shop?category=devices',
  },
];

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedProductId, setSelectedProductId] = useState<string | null>('p-2');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#F8FAF8] via-white to-[#F8FAF8]"
    >
      {/* Decorative ambient background blur & medical grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#A8D5BA]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#E8F5EC] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F5EC] text-[#1F5D42] text-xs font-semibold rounded-full border border-[#A8D5BA]/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2E8B57]" />
              <span>Certified Online Pharmacy & Delivery</span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#1F5D42] tracking-tight leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Your Health, <br />
              <span className="text-[#2E8B57]">Just a Click Away.</span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#718078] leading-relaxed max-w-xl"
            >
              Discover everyday healthcare essentials, verified medicines and diagnostics delivered safely to your doorstep with guaranteed cold-chain handling and real-time tracking.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E8B57] hover:bg-[#1F5D42] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Shop Medicines</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center px-5 py-3 bg-white hover:bg-[#F8FAF8] text-[#1F5D42] text-sm font-semibold rounded-xl border border-[#E3EAE5] shadow-sm transition-colors"
              >
                Explore Categories
              </Link>
            </motion.div>

            {/* Trust bullet markers */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#718078]"
            >
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2E8B57]" />
                <span>100% Genuine Medicines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2E8B57]" />
                <span>Estimated delivery in one hour</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2E8B57]" />
                <span>Cash on Delivery Supported</span>
              </div>
            </motion.div>
          </div>

          {/* Right Interactive Animated Composition Column */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
            {/* Centerpiece Studio Image */}
            <motion.div
              style={{
                transform: shouldReduceMotion
                  ? 'none'
                  : `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0)`,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="relative w-full max-w-[440px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group cursor-pointer"
            >
              <img
                src="/images/hero_pharmacy_wellness_1793340492919.jpg"
                alt="MediCart Apothecary & Wellness Essentials"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F5D42]/60 via-transparent to-transparent pointer-events-none" />

              {/* Bottom badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1F5D42]">Apothecary & Home Wellness</p>
                  <p className="text-[11px] text-[#718078]">Handled with certified pharmaceutical care</p>
                </div>
                <span className="text-xs font-bold text-[#2E8B57] bg-[#E8F5EC] px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </motion.div>

            {/* Floating Interactive Product Card 1 (Left Top) */}
            <motion.div
              style={{
                transform: shouldReduceMotion
                  ? 'none'
                  : `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0) rotate(${floatingProducts[0].rotation}deg)`,
              }}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -8, 0],
                      transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                    }
              }
              whileHover={{ scale: 1.06, rotate: 0 }}
              onClick={() => setSelectedProductId('p-1')}
              className={`absolute top-[6%] left-0 sm:-left-4 z-20 bg-white p-2.5 rounded-2xl shadow-xl border cursor-pointer transition-all max-w-[210px] ${
                selectedProductId === 'p-1' ? 'border-[#2E8B57] ring-2 ring-[#2E8B57]/30' : 'border-[#E3EAE5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F8FAF8] shrink-0 border border-[#E3EAE5]">
                  <img
                    src={floatingProducts[0].image}
                    alt={floatingProducts[0].name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#2E8B57] bg-[#E8F5EC] px-1.5 py-0.5 rounded">
                    {floatingProducts[0].badge}
                  </span>
                  <p className="text-xs font-bold text-[#25332B] truncate mt-0.5">
                    {floatingProducts[0].name}
                  </p>
                  <p className="text-[11px] font-semibold text-[#1F5D42] tabular-nums">
                    {floatingProducts[0].price}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Interactive Product Card 2 (Bottom Left) */}
            <motion.div
              style={{
                transform: shouldReduceMotion
                  ? 'none'
                  : `translate3d(${mousePos.x * 32}px, ${mousePos.y * 32}px, 0) rotate(${floatingProducts[1].rotation}deg)`,
              }}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, 9, 0],
                      transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                    }
              }
              whileHover={{ scale: 1.06, rotate: 0 }}
              onClick={() => setSelectedProductId('p-2')}
              className={`absolute bottom-[4%] left-2 sm:-left-6 z-20 bg-white p-2.5 rounded-2xl shadow-xl border cursor-pointer transition-all max-w-[215px] ${
                selectedProductId === 'p-2' ? 'border-[#2E8B57] ring-2 ring-[#2E8B57]/30' : 'border-[#E3EAE5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F8FAF8] shrink-0 border border-[#E3EAE5]">
                  <img
                    src={floatingProducts[1].image}
                    alt={floatingProducts[1].name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#1F5D42] bg-[#A8D5BA]/30 px-1.5 py-0.5 rounded">
                    {floatingProducts[1].badge}
                  </span>
                  <p className="text-xs font-bold text-[#25332B] truncate mt-0.5">
                    {floatingProducts[1].name}
                  </p>
                  <p className="text-[11px] font-semibold text-[#1F5D42] tabular-nums">
                    {floatingProducts[1].price}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Interactive Product Card 3 (Right Top) */}
            <motion.div
              style={{
                transform: shouldReduceMotion
                  ? 'none'
                  : `translate3d(${mousePos.x * -28}px, ${mousePos.y * -28}px, 0) rotate(${floatingProducts[2].rotation}deg)`,
              }}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -7, 0],
                      transition: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                    }
              }
              whileHover={{ scale: 1.06, rotate: 0 }}
              onClick={() => setSelectedProductId('p-3')}
              className={`absolute top-[18%] -right-2 sm:-right-6 z-20 bg-white p-2.5 rounded-2xl shadow-xl border cursor-pointer transition-all max-w-[210px] ${
                selectedProductId === 'p-3' ? 'border-[#2E8B57] ring-2 ring-[#2E8B57]/30' : 'border-[#E3EAE5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F8FAF8] shrink-0 border border-[#E3EAE5]">
                  <img
                    src={floatingProducts[2].image}
                    alt={floatingProducts[2].name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#2E8B57] bg-[#E8F5EC] px-1.5 py-0.5 rounded">
                    {floatingProducts[2].badge}
                  </span>
                  <p className="text-xs font-bold text-[#25332B] truncate mt-0.5">
                    {floatingProducts[2].name}
                  </p>
                  <p className="text-[11px] font-semibold text-[#1F5D42] tabular-nums">
                    {floatingProducts[2].price}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Background Medical Floating Icons */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : { rotate: [0, 360], transition: { duration: 40, repeat: Infinity, ease: 'linear' } }
              }
              className="absolute -top-3 right-10 text-[#A8D5BA]/40 pointer-events-none"
            >
              <HeartPulse className="w-10 h-10" />
            </motion.div>
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : { y: [0, -10, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }
              }
              className="absolute bottom-16 right-6 text-[#A8D5BA]/40 pointer-events-none"
            >
              <Pill className="w-8 h-8" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
