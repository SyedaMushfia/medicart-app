import React from 'react';
import { Search, ShoppingCart, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <Search className="w-6 h-6 text-[#2E8B57]" />,
      title: 'Browse',
      desc: 'Find the healthcare products, vitamins, and supplies you need using our search and category filters.',
    },
    {
      step: '02',
      icon: <ShoppingCart className="w-6 h-6 text-[#2E8B57]" />,
      title: 'Order',
      desc: 'Add items to your cart, review order quantities with live stock verification, and confirm checkout.',
    },
    {
      step: '03',
      icon: <Truck className="w-6 h-6 text-[#2E8B57]" />,
      title: 'Track',
      desc: 'Follow your delivery timeline stage-by-stage with your reference ID until it reaches your doorstep.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-[#E3EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#25332B] tracking-tight">
            How MediCart Works
          </h2>
          <p className="text-sm text-[#718078] mt-2">
            A seamless three-step journey to getting quality pharmaceutical and wellness care delivered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5] flex flex-col items-center text-center"
            >
              <div className="absolute top-4 right-4 text-xs font-bold text-[#A8D5BA] tabular-nums font-mono">
                {st.step}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E3EAE5] flex items-center justify-center mb-4 shadow-xs">
                {st.icon}
              </div>

              <h3 className="text-lg font-bold text-[#25332B] mb-2">{st.title}</h3>
              <p className="text-xs text-[#718078] leading-relaxed max-w-xs">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
