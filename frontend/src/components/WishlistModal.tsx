import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface WishlistModalProps {
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ onClose }) => {
  const { wishlistProducts, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#0a0d14] rounded-t-3xl shrink-0">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            <h2 className="text-base font-extrabold text-white">Wishlist</h2>
            <span className="bg-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {wishlistProducts.length} items
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Heart className="w-14 h-14 text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500">Click the heart icon on any product to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistProducts.map((product) => {
                const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;
                const activePrice = product.discountPrice || product.price;

                return (
                  <div key={product.id} className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-4 flex space-x-4">
                    <img
                      src={primaryImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-cyan-400">{product.brand}</p>
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">{product.name}</h4>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-sm font-extrabold text-white">${activePrice.toFixed(2)}</span>
                          {product.discountPrice && (
                            <span className="ml-1 text-[10px] text-slate-500 line-through">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => addToCart(product, 1)}
                            disabled={product.stockQuantity <= 0}
                            className="p-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-black rounded-lg hover:opacity-90 transition disabled:opacity-40"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="p-1.5 bg-slate-800 hover:bg-red-950/50 text-slate-400 hover:text-red-400 rounded-lg transition"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
