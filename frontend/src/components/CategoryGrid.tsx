import React from 'react';
import { Category } from '../types';
import { Cpu, Laptop, Keyboard, Gamepad, Disc } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'gpu-components':
      return Cpu;
    case 'laptops-pcs':
      return Laptop;
    case 'peripherals-accessories':
      return Keyboard;
    case 'consoles-vr':
      return Gamepad;
    default:
      return Disc;
  }
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Explore Gear Categories</h2>
          <p className="text-xs text-slate-400">Filter hardware by specialized battle station components</p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory('')}
            className="text-xs font-bold text-cyan-400 hover:underline"
          >
            Show All Products
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          const isSelected = selectedCategory === cat.slug;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? '' : cat.slug)}
              className={`group relative overflow-hidden rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-neon scale-[1.02]'
                  : 'bg-[#121824] border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black'
                  } transition`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {cat._count && (
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">
                    {cat._count.products} Items
                  </span>
                )}
              </div>

              <h3 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-slate-500 line-clamp-2">
                {cat.description || 'High performance gaming equipment.'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
