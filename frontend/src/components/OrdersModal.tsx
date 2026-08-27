import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, ChevronRight, User as UserIcon, Phone, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';

interface OrdersModalProps {
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-950/50 border-amber-500/40',
  CONFIRMED: 'text-cyan-400 bg-cyan-950/50 border-cyan-500/40',
  PROCESSING: 'text-blue-400 bg-blue-950/50 border-blue-500/40',
  SHIPPED: 'text-purple-400 bg-purple-950/50 border-purple-500/40',
  DELIVERED: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/40',
  CANCELLED: 'text-red-400 bg-red-950/50 border-red-500/40',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-3 h-3" />,
  CONFIRMED: <CheckCircle className="w-3 h-3" />,
  PROCESSING: <Package className="w-3 h-3" />,
  SHIPPED: <Truck className="w-3 h-3" />,
  DELIVERED: <CheckCircle className="w-3 h-3" />,
  CANCELLED: <XCircle className="w-3 h-3" />,
};

export const OrdersModal: React.FC<OrdersModalProps> = ({ onClose }) => {
  const { user, updateProfile } = useAuth() as any;
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.orders);
      } catch (err) {
        console.warn('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await api.put('/auth/profile', { name: profileName, phone: profilePhone });
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err: any) {
      setProfileMessage('Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const parseAddress = (addr: string) => {
    try {
      const parsed = JSON.parse(addr);
      return `${parsed.fullName}, ${parsed.street}, ${parsed.city}, ${parsed.state} ${parsed.postalCode}`;
    } catch {
      return addr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#0a0d14] rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-lg font-black text-white">My Account</h2>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0a0d14] shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'orders' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order History</span>
            {orders.length > 0 && <span className="bg-cyan-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">{orders.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'profile' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {selectedOrder ? (
                /* Order Detail View */
                <div className="space-y-5">
                  <button onClick={() => setSelectedOrder(null)} className="flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition">
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    <span>Back to Orders</span>
                  </button>

                  <div className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-white">{selectedOrder.orderNumber}</h3>
                        <p className="text-xs text-slate-400">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold ${STATUS_COLORS[selectedOrder.status]}`}>
                        {STATUS_ICON[selectedOrder.status]}
                        <span>{selectedOrder.status}</span>
                      </span>
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Items Ordered</h4>
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=80'}
                            alt={item.product?.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-800 border border-slate-700"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-200">{item.product?.name}</p>
                            <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <span className="text-xs font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-800 pt-4 grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-400 uppercase">Shipping To</p>
                        <p className="text-slate-300">{parseAddress(selectedOrder.shippingAddress)}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-slate-400">
                          <span>Subtotal</span>
                          <span>${selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        {selectedOrder.discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Discount</span>
                            <span>-${selectedOrder.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-400">
                          <span>Shipping</span>
                          <span>{selectedOrder.shippingFee === 0 ? 'FREE' : `$${selectedOrder.shippingFee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-white text-sm border-t border-slate-800 pt-1">
                          <span>Total</span>
                          <span className="text-cyan-400">${selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Orders List */
                <div className="space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-4 animate-pulse space-y-2">
                          <div className="h-4 bg-slate-800 rounded w-1/3" />
                          <div className="h-3 bg-slate-800 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <Package className="w-12 h-12 text-slate-700 mx-auto" />
                      <h3 className="text-sm font-bold text-slate-300">No orders yet</h3>
                      <p className="text-xs text-slate-500">Your NexusGaming orders will appear here.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#0a0d14] border border-slate-800 hover:border-slate-600 rounded-2xl p-4 cursor-pointer transition group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-extrabold text-slate-200">{order.orderNumber}</p>
                            <p className="text-[11px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${STATUS_COLORS[order.status]}`}>
                              {STATUS_ICON[order.status]}
                              <span>{order.status}</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{order.items?.length || 0} item(s)</span>
                          <span className="font-extrabold text-white">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Settings Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-md">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
                />
                <div>
                  <p className="text-base font-extrabold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-cyan-950/50 text-cyan-300 border-cyan-500/40">
                    {user?.role}
                  </span>
                </div>
              </div>

              {profileMessage && (
                <div className="bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 rounded-xl px-4 py-2 text-xs font-semibold">
                  {profileMessage}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition shadow-neon disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{profileSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
