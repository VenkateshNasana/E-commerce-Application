import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ShieldAlert } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onOpenDetails: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, onOpenDetails }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#121824] rounded-2xl p-4 space-y-4 animate-pulse border border-slate-800">
            <div className="bg-slate-800 h-48 rounded-xl w-full" />
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="h-6 bg-slate-800 rounded w-3/4" />
            <div className="h-8 bg-slate-800 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-[#121824] border border-slate-800 rounded-3xl p-8 max-w-md mx-auto my-8">
        <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Matching Gear Found</h3>
        <p className="text-xs text-slate-400">
          Try resetting your price filter, search query, or category selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onOpenDetails={onOpenDetails} />
      ))}
    </div>
  );
};
