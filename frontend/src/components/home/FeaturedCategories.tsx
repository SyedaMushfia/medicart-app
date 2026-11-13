import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pill, Sparkles, Heart, Shield, Baby, Stethoscope } from 'lucide-react';
import { Category } from '../../../../types.ts';

interface FeaturedCategoriesProps {
  categories: Category[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  medicines: <Pill className="w-5 h-5 text-[#2E8B57]" />,
  vitamins: <Sparkles className="w-5 h-5 text-[#2E8B57]" />,
  'personal-care': <Heart className="w-5 h-5 text-[#2E8B57]" />,
  'first-aid': <Shield className="w-5 h-5 text-[#2E8B57]" />,
  'baby-care': <Baby className="w-5 h-5 text-[#2E8B57]" />,
  devices: <Stethoscope className="w-5 h-5 text-[#2E8B57]" />,
};

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-white border-b border-[#E3EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#25332B] tracking-tight">
              Featured Healthcare Categories
            </h2>
            <p className="text-sm text-[#718078] mt-1 max-w-lg">
              Explore scientifically formulated vitamins, certified over-the-counter medicines, and clinical diagnostics.
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-semibold text-[#2E8B57] hover:text-[#1F5D42] flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group p-4 rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5] hover:border-[#2E8B57] hover:bg-white hover:shadow-sm transition-all flex flex-col items-center text-center justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E3EAE5] flex items-center justify-center group-hover:scale-110 transition-transform mb-3 shadow-xs">
                {CATEGORY_ICONS[cat.id] || <Pill className="w-5 h-5 text-[#2E8B57]" />}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-[#25332B] group-hover:text-[#2E8B57] transition-colors leading-snug">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#718078] mt-1 block">
                  {cat.product_count !== undefined ? `${cat.product_count} Products` : 'Browse'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
