import React, { useState } from 'react';
import { X, MapPin, CreditCard, CheckCircle, Package, ChevronRight, Tag, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

type CheckoutStep = 'address' | 'payment' | 'confirmation';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onOrderSuccess }) => {
  const { cartItems, couponCode, subtotal, discount, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PAYPAL' | 'TEST_GATEWAY'>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.street || !address.city || !address.state || !address.postalCode) {
      setError('All address fields are required');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod,
        couponCode: couponCode || undefined,
      });

      await clearCart();
      onOrderSuccess(res.data.order);
      setStep('confirmation');
    } catch (err: any) {
      setError(err.message || 'Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'address', label: 'Shipping', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmed', icon: CheckCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#0a0d14] rounded-t-3xl">
          <div>
            <h2 className="text-lg font-black text-white">Secure Checkout</h2>
            <p className="text-[11px] text-slate-400">Complete your NexusGaming order</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-800/60">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isDone = (step === 'payment' && s.id === 'address') || (step === 'confirmation');
              return (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center space-x-2 ${isActive ? 'text-cyan-400' : isDone ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-black ${
                      isActive ? 'border-cyan-400 bg-cyan-500/20' : isDone ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-700 bg-slate-900'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold hidden sm:block">{s.label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-3 ${isDone ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Main Step Content */}
          <div className="md:col-span-3 p-6">
            {error && (
              <div className="flex items-center space-x-2 bg-red-950/50 border border-red-500/40 text-red-300 rounded-xl px-4 py-3 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">{error}</span>
              </div>
            )}

            {/* STEP 1: Shipping Address */}
            {step === 'address' && (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-extrabold text-white">Delivery Address</h3>
                </div>

                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="Full Name"
                  required
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Street Address"
                  required
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    required
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State / Province"
                    required
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="ZIP / Postal Code"
                    required
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="Country"
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-sm py-3 rounded-xl hover:opacity-90 transition shadow-neon mt-2 flex items-center justify-center space-x-2"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-extrabold text-white">Payment Method</h3>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-3">
                  {(['CREDIT_CARD', 'PAYPAL', 'TEST_GATEWAY'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl border text-xs font-bold transition ${
                        paymentMethod === method
                          ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                          : 'border-slate-700 bg-[#0a0d14] text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {method === 'CREDIT_CARD' ? '💳 Credit Card' : method === 'PAYPAL' ? '🅿️ PayPal' : '🧪 Test Pay'}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="space-y-3 p-4 bg-[#0a0d14] border border-slate-700 rounded-2xl">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="Card Number (4242 4242 4242 4242)"
                      className="w-full bg-[#121824] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full bg-[#121824] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.slice(0, 3))}
                        placeholder="CVC"
                        className="w-full bg-[#121824] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>Test mode: use any card number. No real charges apply.</span>
                    </p>
                  </div>
                )}

                {paymentMethod === 'TEST_GATEWAY' && (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300">
                    <p className="font-bold mb-1">🧪 Test Gateway Active</p>
                    <p>Payment will be simulated instantly. No real money is processed. This mode bypasses all gateway validation.</p>
                  </div>
                )}

                <div className="flex space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm py-3 rounded-xl transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-sm py-3 rounded-xl hover:opacity-90 transition shadow-neon disabled:opacity-60 flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    <span>{loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Order Confirmed */}
            {step === 'confirmation' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white">Order Placed!</h3>
                <p className="text-sm text-slate-300">
                  Your NexusGaming order has been confirmed and is being processed. Check your order history for tracking.
                </p>
                <div className="flex flex-col space-y-2 mt-4">
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-sm py-3 rounded-xl hover:opacity-90 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-2 bg-[#0a0d14] border-l border-slate-800/60 p-5 rounded-br-3xl">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto mb-4">
              {cartItems.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                const img = item.product.images?.[0]?.url;
                return (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={img || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100'} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                      <span className="absolute -top-1 -right-1 bg-slate-700 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-cyan-400">${(price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span className={shipping === 0 ? 'text-emerald-400' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-extrabold text-sm text-white border-t border-slate-700 pt-2">
                <span>Total</span>
                <span className="text-cyan-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {couponCode && (
              <div className="mt-3 flex items-center space-x-2 text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-3 py-2 rounded-lg">
                <Tag className="w-3 h-3" />
                <span>Coupon "{couponCode}" applied</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
