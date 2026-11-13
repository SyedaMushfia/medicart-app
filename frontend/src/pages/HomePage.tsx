import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InteractiveHero } from '../components/home/InteractiveHero.tsx';
import { FeaturedCategories } from '../components/home/FeaturedCategories.tsx';
import { WhyChooseUs } from '../components/home/WhyChooseUs.tsx';
import { HowItWorks } from '../components/home/HowItWorks.tsx';
import { Newsletter } from '../components/home/Newsletter.tsx';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { medicineApi } from '../services/api.ts';
import { Category, Medicine } from '../../../types.ts';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, meds] = await Promise.all([
          medicineApi.getCategories(),
          medicineApi.getMedicines(),
        ]);
        setCategories(cats);
        setFeaturedProducts(meds.slice(0, 6));
      } catch (error) {
        setCatalogError(
          (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Unable to load the catalog. Check the backend and Supabase setup.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Interactive Animated Hero */}
      <InteractiveHero />

      {/* 2. Featured Categories */}
      <FeaturedCategories categories={categories} />

      {/* 3. Featured Products Collection */}
      <section className="py-16 bg-[#F8FAF8] border-b border-[#E3EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2E8B57] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pharmacist Curated</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#25332B] tracking-tight">
                Featured Health Essentials
              </h2>
              <p className="text-sm text-[#718078] mt-1">
                Popular doctor-recommended vitamins, fever relievers, and home diagnostics.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#2E8B57] hover:text-[#1F5D42] flex items-center gap-1 group whitespace-nowrap"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {catalogError ? (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {catalogError}
            </p>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-white border border-[#E3EAE5] animate-pulse p-4" />
              ))}
            </div>
          ) : featuredProducts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#718078]">No medicines are available yet.</p>
          )}
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Newsletter Subscription */}
      <Newsletter />
    </div>
  );
};
