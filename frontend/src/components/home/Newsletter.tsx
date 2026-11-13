import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribed(true);
    toast.success('Thank you for subscribing to MediCart Wellness Brief!');
  };

  return (
    <section className="py-16 bg-[#1F5D42] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto text-[#A8D5BA]">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Stay Updated on Healthcare Essentials
          </h2>

          <p className="text-sm text-white/80 leading-relaxed">
            Subscribe for monthly pharmacist health guides, new vitamin arrivals, and seasonal wellness reminders.
          </p>

          {isSubscribed ? (
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-2 text-sm text-[#A8D5BA]">
              <CheckCircle className="w-5 h-5" />
              <span>You are subscribed with {email}. Look out for our monthly health updates!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white text-[#25332B] placeholder:text-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#A8D5BA]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#2E8B57] text-white rounded-xl text-sm font-semibold hover:bg-[#257347] transition-colors whitespace-nowrap shadow-sm"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-white/60">
            No spam. We respect your medical privacy and unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
