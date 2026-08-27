import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Zap, Plus, Minus, MessageSquare, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  if (!product) return null;

  const { addToCart, setIsOpen: setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
  );
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const activePrice = product.discountPrice || product.price;
  const inWishlist = isInWishlist(product.id);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to write a review');
    if (!reviewTitle || !reviewComment) return;

    try {
      setIsSubmittingReview(true);
      const res = await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      setReviewsList([res.data.review, ...reviewsList]);
      setReviewTitle('');
      setReviewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition ${
                      selectedImage === img.url ? 'border-cyan-400 opacity-100 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Guarantees */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Original Manufacturer 2-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Fast Cyber Courier Shipping Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Authentic Benchmark Certified</span>
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-cyan-400 uppercase tracking-widest">{product.brand}</span>
                <span className="text-slate-500">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl font-black text-white leading-tight mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-200">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">({reviewsList.length} verified reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline space-x-3 mb-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-3xl font-black text-cyan-400">${activePrice.toFixed(2)}</span>
                {product.discountPrice && (
                  <>
                    <span className="text-sm text-slate-500 line-through">${product.price.toFixed(2)}</span>
                    <span className="text-xs font-bold text-pink-400 bg-pink-950/60 border border-pink-500/40 px-2 py-0.5 rounded-full">
                      SAVE ${Math.round(product.price - product.discountPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-6">{product.description}</p>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-bold text-slate-300 uppercase">Quantity</span>
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    ({product.stockQuantity} available)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={product.stockQuantity <= 0}
                    onClick={() => addToCart(product, quantity)}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/40 font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    disabled={product.stockQuantity <= 0}
                    onClick={handleBuyNow}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-neon hover:opacity-90 transition"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="p-6 md:p-8 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-extrabold text-white">Gamer Reviews & Ratings</h3>
            </div>
            <span className="text-xs text-slate-400">{reviewsList.length} Total Reviews</span>
          </div>

          {/* Write Review Form */}
          {user && (
            <form onSubmit={handleAddReview} className="bg-[#121824] border border-slate-800 p-4 rounded-2xl mb-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Submit Your Review</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`w-4 h-4 cursor-pointer ${
                        star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Review Headline (e.g. Unbelievable FPS Boost!)"
                className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your honest gaming performance review..."
                rows={2}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-cyan-500 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-cyan-400 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Review</span>
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews written yet. Be the first gamer to leave a review!</p>
            ) : (
              reviewsList.map((rev) => (
                <div key={rev.id} className="bg-[#121824] border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-200">{rev.user?.name || 'Verified Gamer'}</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-cyan-300">{rev.title}</h5>
                  <p className="text-xs text-slate-300">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
