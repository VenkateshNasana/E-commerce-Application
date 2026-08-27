import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductFilterProps {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onReset: () => void;
  brands: string[];
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedBrand,
  setSelectedBrand,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  onReset,
  brands,
}) => {
  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-slate-200">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-black uppercase tracking-wider">Refine Gear</h3>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-[#0a0d14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="createdAt">Featured / Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Max Price Range Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
          <span>Max Price</span>
          <span className="text-cyan-400">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="50"
          max="4000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>$50</span>
          <span>$4,000</span>
        </div>
      </div>

      {/* Brand Select */}
      {brands.length > 0 && (
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">Brand / Manufacturer</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-[#0a0d14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* In Stock Checkbox */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
        <input
          type="checkbox"
          id="inStockCheck"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="w-4 h-4 rounded accent-cyan-400 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
        />
        <label htmlFor="inStockCheck" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
          In Stock Only
        </label>
      </div>
    </div>
  );
};
