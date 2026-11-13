import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubscribed(true);
    toast.success('Thank you for subscribing to MediCart health updates!');
    setEmail('');
  };

  return (
    <section className="py-14 bg-[#1F5D42] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#A8D5BA]">
            <Mail className="w-3.5 h-3.5" />
            <span>Health Insights & Special Dispensary Offers</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Stay Updated with MediCart
          </h2>

          <p className="text-sm text-[#A8D5BA] leading-relaxed">
            Subscribe to receive seasonal health advisories, new medicine arrivals, and wellness tips from our licensed pharmacists.
          </p>

          {isSubscribed ? (
            <div className="pt-2 flex items-center justify-center gap-2 text-sm text-[#E8F5EC] bg-white/10 py-3 px-4 rounded-xl border border-white/20">
              <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
              <span>You are subscribed! We will only send essential health updates.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A8D5BA] transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-[#1F5D42] hover:bg-[#E8F5EC] text-sm font-bold rounded-xl transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-[#A8D5BA]/80 pt-1">
            We respect your privacy. No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
