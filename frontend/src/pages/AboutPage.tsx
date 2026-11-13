import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Truck, Clock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F5D42] bg-[#E8F5EC] px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
            <span>Licensed Healthcare Dispensary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#25332B] tracking-tight">
            About MediCart Online Pharmacy
          </h1>
          <p className="text-sm text-[#718078] max-w-xl mx-auto leading-relaxed">
            Bridging clinical pharmaceutical excellence and modern doorstep logistics to ensure families have safe, dependable access to vital medicines and healthcare products.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E3EAE5] p-8 shadow-xs space-y-8">
          <div>
            <h2 className="text-lg font-bold text-[#25332B] mb-3">Our Founding Mission</h2>
            <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
              MediCart was developed to solve the friction of traditional pharmacy visits. Whether managing acute seasonal fevers, replenishing daily nutritional supplements, or procuring emergency wound care, our platform provides rapid stock allocation, transparent pricing, and verifiable delivery stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E3EAE5]">
            <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5]">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#2E8B57] flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#25332B] mb-1">Direct Verification</h3>
              <p className="text-xs text-[#718078]">
                Every batch is cross-checked against manufacturer certifications and lot numbers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5]">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#2E8B57] flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#25332B] mb-1">Cold-Chain Assurance</h3>
              <p className="text-xs text-[#718078]">
                Temperature-controlled containers preserve delicate formulations during transport.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E3EAE5]">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#2E8B57] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#25332B] mb-1">Express Dispatch</h3>
              <p className="text-xs text-[#718078]">
                Fast dispatch within 2 hours of order confirmation for priority essentials.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3EAE5] bg-[#E8F5EC] p-6 rounded-2xl text-[#1F5D42] space-y-2">
            <h3 className="text-sm font-bold">Responsible Pharmacy Notice</h3>
            <p className="text-xs leading-relaxed text-[#1F5D42]/90">
              MediCart adheres strictly to regulatory dispensing guidelines. Prescription-labeled medicines require formal verification by our pharmacy board prior to fulfillment. Always consult your primary physician before initiating new therapeutic regimens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
