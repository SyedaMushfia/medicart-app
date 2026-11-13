import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Sparkles, Heart, Shield, Baby, Stethoscope, ArrowRight } from 'lucide-react';
import { medicineApi } from '../services/api.ts';
import { Category } from '../../../types.ts';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  medicines: <Pill className="w-8 h-8 text-[#2E8B57]" />,
  vitamins: <Sparkles className="w-8 h-8 text-[#2E8B57]" />,
  'personal-care': <Heart className="w-8 h-8 text-[#2E8B57]" />,
  'first-aid': <Shield className="w-8 h-8 text-[#2E8B57]" />,
  'baby-care': <Baby className="w-8 h-8 text-[#2E8B57]" />,
  devices: <Stethoscope className="w-8 h-8 text-[#2E8B57]" />,
};

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    medicineApi.getCategories()
      .then(setCategories)
      .catch((requestError: unknown) => {
        setError(
          (requestError as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Unable to load categories. Check the backend and Supabase setup.'
        );
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold text-[#2E8B57] uppercase tracking-wider block mb-1">
            Department Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#25332B] tracking-tight">
            Browse by Healthcare Category
          </h1>
          <p className="text-sm text-[#718078] mt-2">
            Explore our curated inventory of certified pharmaceuticals, dietary supplements, clinical wound dressings, and home diagnostic tools.
          </p>
        </div>

        {error && <p role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
        {!error && categories.length === 0 && <p className="text-sm text-[#718078]">No product categories are available yet.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group p-6 rounded-3xl bg-white border border-[#E3EAE5] hover:border-[#2E8B57] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#E8F5EC] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {CATEGORY_ICONS[cat.id] || <Pill className="w-8 h-8 text-[#2E8B57]" />}
                </div>

                <h3 className="text-lg font-bold text-[#25332B] group-hover:text-[#2E8B57] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#718078] mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E3EAE5] flex items-center justify-between text-xs font-semibold text-[#2E8B57]">
                <span>{cat.product_count !== undefined ? `${cat.product_count} Products Available` : 'View Products'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
