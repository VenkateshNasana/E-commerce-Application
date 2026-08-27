import React from 'react';
import { Product } from '../types';
import { Star, ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600';

  const inWishlist = isInWishlist(product.id);
  const activePrice = product.discountPrice || product.price;

  return (
    <div className="group relative bg-[#121824] border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col justify-between">
      {/* Top Badges & Image */}
      <div className="relative overflow-hidden bg-slate-950 aspect-[4/3] cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Discount Badge */}
        {product.discountPrice && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow">
            Save ${Math.round(product.price - product.discountPrice)}
          </span>
        )}

        {/* Stock Status Badge */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            product.stockQuantity > 0 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 'bg-red-950/80 text-red-400 border border-red-500/40'
          }`}
        >
          {product.stockQuantity > 0 ? `${product.stockQuantity} in Stock` : 'Sold Out'}
        </span>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition ${
              inWishlist ? 'bg-pink-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-pink-400 hover:bg-slate-800'
            }`}
            title="Toggle Wishlist"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="p-2 bg-slate-900/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-xl backdrop-blur-md transition"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-200">{product.rating.toFixed(1)}</span>
              <span className="text-slate-500">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onOpenDetails(product)}
            className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 cursor-pointer line-clamp-2 leading-snug mb-2 transition"
          >
            {product.name}
          </h3>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-2">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-black text-white">${activePrice.toFixed(2)}</span>
              {product.discountPrice && (
                <span className="text-xs font-semibold text-slate-500 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <button
            disabled={product.stockQuantity <= 0}
            onClick={() => addToCart(product, 1)}
            className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center ${
              product.stockQuantity > 0
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-black hover:opacity-90 shadow-neon'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
