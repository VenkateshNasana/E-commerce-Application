import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout, onOpenAuth }) => {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    couponCode,
    applyCoupon,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
  } = useCart();

  const { user } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponMessage({ type: 'success', text: `✅ Coupon "${couponInput.toUpperCase()}" applied!` });
    } else {
      setCouponMessage({ type: 'error', text: '❌ Invalid or expired coupon code.' });
    }
    setTimeout(() => setCouponMessage(null), 3000);
  };

  const handleCheckout = () => {
    if (!user) {
      setIsOpen(false);
      onOpenAuth();
    } else {
      setIsOpen(false);
      onOpenCheckout();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#121824] border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#0a0d14]">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-white">Your Gear Cart</h2>
            {itemCount > 0 && (
              <span className="bg-cyan-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                {itemCount} ITEMS
              </span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-14 h-14 text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Your cart is empty</h3>
              <p className="text-xs text-slate-500">Add some gaming gear to get started!</p>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold text-xs px-5 py-2.5 rounded-full hover:opacity-90 transition shadow-neon"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const productPrice = item.product.discountPrice || item.product.price;
              const primaryImage = item.product.images?.find((img) => img.isPrimary)?.url || item.product.images?.[0]?.url;

              return (
                <div key={item.id} className="flex space-x-4 bg-[#0a0d14] border border-slate-800 rounded-2xl p-3 group">
                  <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={primaryImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-200 leading-snug line-clamp-2 pr-2">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-600 hover:text-red-400 transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">{item.product.brand}</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-slate-400 hover:text-white p-0.5"
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-white">
                        ${(productPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Totals + Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-800 bg-[#0a0d14] px-5 py-5 space-y-4">
            {/* Coupon Input */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="GAMER10 or NEXUS25"
                    className="w-full bg-[#121824] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponInput || !!couponCode}
                  className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-bold px-4 rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <div className={`flex items-center space-x-2 text-[11px] font-semibold ${couponMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponMessage.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{couponMessage.text}</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-slate-200 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white border-t border-slate-700 pt-2 mt-1">
                <span>Total</span>
                <span className="text-cyan-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-sm py-3.5 rounded-xl shadow-neon hover:opacity-90 transition"
            >
              {user ? 'Proceed to Secure Checkout →' : 'Sign In to Checkout →'}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>256-bit SSL encrypted & PCI compliant checkout</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
