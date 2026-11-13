import React from 'react';
import { ShoppingBag, MapPin, Lock, Layers } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <ShoppingBag className="w-6 h-6 text-[#2E8B57]" />,
      title: 'Convenient Online Shopping',
      desc: 'Browse hundreds of certified medicines, supplements, and wellness essentials from the comfort of home.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#2E8B57]" />,
      title: 'Reliable Order Tracking',
      desc: 'Real-time order stage verification from pharmacist packaging to doorstep dispatch with unique reference codes.',
    },
    {
      icon: <Lock className="w-6 h-6 text-[#2E8B57]" />,
      title: 'Secure Account Access',
      desc: 'Protected order histories, encrypted customer profiles, and robust inventory safeguards.',
    },
    {
      icon: <Layers className="w-6 h-6 text-[#2E8B57]" />,
      title: 'Wide Range of Products',
      desc: 'From essential daily vitamins to sterile clinical first-aid kits and calibrated diagnostic devices.',
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAF8] border-b border-[#E3EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#25332B] tracking-tight">
            Why Patients & Families Trust MediCart
          </h2>
          <p className="text-sm text-[#718078] mt-2">
            Every product in our inventory is sourced directly from licensed manufacturers and stored under controlled conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-[#E3EAE5] shadow-xs hover:border-[#A8D5BA] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F5EC] flex items-center justify-center mb-4">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-[#25332B] mb-2">{feat.title}</h3>
              <p className="text-xs text-[#718078] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
