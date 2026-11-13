import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, PackageX, CheckCircle, ShieldAlert } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { medicineApi } from '../services/api.ts';
import { Category, Medicine } from '../../../types.ts';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter States initialized from URL params
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const inStockParam = searchParams.get('inStock') === 'true';
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 60;

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchTerm(searchParams.get('search') || '');
    setSelectedSort(searchParams.get('sort') || 'featured');
    setInStockOnly(searchParams.get('inStock') === 'true');
    if (searchParams.get('maxPrice')) {
      setMaxPrice(Number(searchParams.get('maxPrice')));
    }
  }, [searchParams]);

  // Fetch categories & medicines from REST API
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setCatalogError(null);
        const [cats, meds] = await Promise.all([
          medicineApi.getCategories(),
          medicineApi.getMedicines({
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            search: searchTerm || undefined,
            maxPrice: maxPrice,
            inStockOnly: inStockOnly || undefined,
            sort: selectedSort,
          }),
        ]);
        setCategories(cats);
        setMedicines(meds);
      } catch (error) {
        setCatalogError(
          (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Unable to load medicines. Check the backend and Supabase setup.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, searchTerm, selectedSort, inStockOnly, maxPrice]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'false') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSort('featured');
    setInStockOnly(false);
    setMaxPrice(60);
    setSearchParams(new URLSearchParams());
  };

  const isFiltering =
    selectedCategory !== 'all' ||
    searchTerm !== '' ||
    selectedSort !== 'featured' ||
    inStockOnly ||
    maxPrice < 60;

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Search Banner */}
        <div className="bg-white rounded-2xl border border-[#E3EAE5] p-6 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25332B] tracking-tight">
                Online Pharmacy & Healthcare Shop
              </h1>
              <p className="text-xs sm:text-sm text-[#718078] mt-1">
                Browse authentic non-prescription remedies, clinical supplements, and healthcare instruments.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateFilters('search', e.target.value);
                }}
                placeholder="Search products or ingredients..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3EAE5] bg-[#F8FAF8] text-xs sm:text-sm text-[#25332B] outline-none focus:border-[#2E8B57] focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="px-4 py-2 bg-white border border-[#E3EAE5] rounded-xl text-xs font-semibold text-[#25332B] flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2E8B57]" />
            <span>Filters & Categories</span>
          </button>
          {isFiltering && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#2E8B57] font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-[#E3EAE5] h-fit ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-4">
              <h2 className="text-sm font-bold text-[#25332B] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#2E8B57]" />
                Filter Catalog
              </h2>
              {isFiltering && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#718078] hover:text-[#1F5D42] flex items-center gap-1 font-medium transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-xs font-semibold text-[#718078] uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    updateFilters('category', 'all');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-[#E8F5EC] text-[#1F5D42] font-semibold'
                      : 'text-[#25332B] hover:bg-[#F8FAF8]'
                  }`}
                >
                  <span>All Products</span>
                  <span className="tabular-nums text-[11px] text-[#718078]">18</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.id);
                      updateFilters('category', c.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === c.id
                        ? 'bg-[#E8F5EC] text-[#1F5D42] font-semibold'
                        : 'text-[#25332B] hover:bg-[#F8FAF8]'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.product_count !== undefined && (
                      <span className="tabular-nums text-[11px] text-[#718078]">
                        {c.product_count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-[#E3EAE5]">
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-semibold text-[#718078] uppercase tracking-wider">
                  Max Price
                </span>
                <span className="font-bold text-[#1F5D42] tabular-nums">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxPrice(val);
                  updateFilters('maxPrice', val.toString());
                }}
                className="w-full accent-[#2E8B57] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#718078] mt-1 tabular-nums">
                <span>$5</span>
                <span>$30</span>
                <span>$60</span>
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-[#E3EAE5]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#25332B]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    updateFilters('inStock', e.target.checked ? 'true' : 'false');
                  }}
                  className="rounded text-[#2E8B57] focus:ring-[#2E8B57] w-4 h-4 cursor-pointer"
                />
                <span className="font-medium">In-Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Sort & Count Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E3EAE5]">
              <span className="text-xs text-[#718078]">
                Showing <strong className="text-[#25332B] tabular-nums">{medicines.length}</strong> items
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#718078] shrink-0">Sort By:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    updateFilters('sort', e.target.value);
                  }}
                  className="bg-[#F8FAF8] border border-[#E3EAE5] rounded-lg px-3 py-1.5 text-xs font-medium text-[#25332B] outline-none focus:border-[#2E8B57]"
                >
                  <option value="featured">Featured / Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A–Z</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {catalogError ? (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                {catalogError}
              </p>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-2xl bg-white border border-[#E3EAE5] animate-pulse p-4" />
                ))}
              </div>
            ) : medicines.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E3EAE5] p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F5EC] flex items-center justify-center text-[#2E8B57] mx-auto mb-4">
                  <PackageX className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="text-base font-bold text-[#25332B]">No products found</h3>
                <p className="text-xs sm:text-sm text-[#718078] max-w-sm mx-auto mt-1 mb-6">
                  Try adjusting your keywords, price filter, or category selection to find what you are looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 bg-[#2E8B57] text-white rounded-xl text-xs font-semibold hover:bg-[#1F5D42] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {medicines.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
