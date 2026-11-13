import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop / Medicines', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Track Order', href: '/track' },
  { label: 'About Us', href: '/about' },
];

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setSearch('');
    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3EAE5]">
        <div className="bg-[#1F5D42] text-white text-xs py-1.5 px-4 text-center font-medium">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8D5BA]" />
            Licensed Pharmaceutical Distribution & Express Delivery
          </span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-[#1F5D42]">
            <span className="w-9 h-9 rounded-xl bg-[#2E8B57] flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span>Medi<span className="text-[#2E8B57]">Cart</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={isActive(link.href) ? 'text-[#2E8B57] font-semibold' : 'text-[#718078] hover:text-[#25332B]'}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search medicines"
              className="p-2 text-[#718078] hover:bg-[#F8FAF8] rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
              className="relative p-2 text-[#25332B] hover:bg-[#E8F5EC] rounded-lg"
            >
              <ShoppingBag className="w-5 h-5 text-[#2E8B57]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2E8B57] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[#25332B] hover:bg-[#F8FAF8] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#E3EAE5] bg-white px-4 pt-3 pb-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-[#25332B] hover:bg-[#F8FAF8]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 pt-24" onClick={() => setSearchOpen(false)}>
          <form
            onSubmit={submitSearch}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-2xl p-4 shadow-xl flex gap-2"
          >
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search medicines and healthcare products..."
              className="flex-1 px-4 py-3 rounded-xl border border-[#E3EAE5] outline-none focus:border-[#2E8B57]"
            />
            <button type="submit" className="px-4 rounded-xl bg-[#2E8B57] text-white font-semibold">
              Search
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X className="w-5 h-5 text-[#718078]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
