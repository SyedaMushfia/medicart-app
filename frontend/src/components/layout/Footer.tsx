import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E3EAE5] text-[#718078] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[#1F5D42]">
              <div className="w-8 h-8 rounded-lg bg-[#2E8B57] flex items-center justify-center text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14" /><path d="M5 12h14" />
                </svg>
              </div>
              <span>Medi<span className="text-[#2E8B57]">Cart</span></span>
            </Link>

            <p className="leading-relaxed max-w-sm">
              MediCart is a licensed online healthcare platform providing certified pharmaceuticals,
              daily nutritional supplements, and diagnostics with guaranteed cold-chain temperature preservation.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#1F5D42] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
              <span>Certified Pharmacy Reg #PH-894022 · Verified Dispensary</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#25332B]">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#2E8B57] transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#2E8B57] transition-colors">Shop Medicines</Link></li>
              <li><Link to="/categories" className="hover:text-[#2E8B57] transition-colors">Healthcare Categories</Link></li>
              <li><Link to="/track" className="hover:text-[#2E8B57] transition-colors">Track Your Order</Link></li>
              <li><Link to="/about" className="hover:text-[#2E8B57] transition-colors">About Our Dispensary</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#25332B]">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/shop?category=medicines" className="hover:text-[#2E8B57] transition-colors">Over-the-Counter Medicines</Link></li>
              <li><Link to="/shop?category=vitamins" className="hover:text-[#2E8B57] transition-colors">Vitamins & Supplements</Link></li>
              <li><Link to="/shop?category=personal-care" className="hover:text-[#2E8B57] transition-colors">Personal Care & Skin</Link></li>
              <li><Link to="/shop?category=first-aid" className="hover:text-[#2E8B57] transition-colors">First Aid & Wound Care</Link></li>
              <li><Link to="/shop?category=devices" className="hover:text-[#2E8B57] transition-colors">Medical Devices</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#25332B]">Dispensary Support</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <span>450 Healthcare Blvd, Suite 200, Springfield, OR 97477</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2E8B57] shrink-0" />
                <span>+1 (800) 633-4227 (24/7)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2E8B57] shrink-0" />
                <span>care@medicart.health</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E3EAE5] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 MediCart Health Inc. All rights reserved. Non-prescription demo platform.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#25332B] cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#25332B] cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-[#25332B] cursor-pointer">Dispensary License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
