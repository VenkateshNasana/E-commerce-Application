import React, { useState, useEffect } from 'react';
import {
  X, BarChart3, Users, Package, ShoppingBag, DollarSign, AlertTriangle,
  Edit, Trash2, Plus, Save, ChevronRight, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { AdminStats, Product, Order, Category } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'categories'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '', description: '', price: '', discountPrice: '', stockQuantity: '',
    sku: '', brand: '', categoryId: '', isFeatured: false,
  });
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState('');

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/products?limit=100'),
        api.get('/orders/admin/all'),
        api.get('/categories'),
      ]);
      setStats(statsRes.data.stats);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || '',
      stockQuantity: product.stockQuantity.toString(),
      sku: product.sku,
      brand: product.brand,
      categoryId: product.categoryId,
      isFeatured: product.isFeatured,
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductSaving(true);
    try {
      if (editingProduct?.id) {
        await api.put(`/products/${editingProduct.id}`, productFormData);
        setProductMessage('Product updated successfully!');
      } else {
        await api.post('/products', productFormData);
        setProductMessage('Product created successfully!');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      await fetchData();
    } catch (err: any) {
      setProductMessage(err.message || 'Failed to save product.');
    } finally {
      setProductSaving(false);
      setTimeout(() => setProductMessage(''), 4000);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/admin/${orderId}/status`, { status });
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status: status as any } : o));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: categoryName, description: categoryDesc });
      setShowCategoryForm(false);
      setCategoryName('');
      setCategoryDesc('');
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${catId}`);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const ORDER_STATUSES = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const STATUS_COLORS: Record<string, string> = {
    CONFIRMED: 'text-cyan-400', PROCESSING: 'text-blue-400',
    SHIPPED: 'text-purple-400', DELIVERED: 'text-emerald-400', CANCELLED: 'text-red-400',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="bg-[#121824] border border-purple-800/60 rounded-3xl w-full max-w-5xl shadow-2xl my-4 max-h-[95vh] flex flex-col shadow-purple">
        {/* Admin Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-800/50 bg-gradient-to-r from-purple-950/60 to-[#0a0d14] rounded-t-3xl shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-600 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Admin Command Center</h2>
              <p className="text-[11px] text-purple-300">NexusGaming Store Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0a0d14] shrink-0 overflow-x-auto">
          {(['stats', 'products', 'orders', 'categories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-max flex items-center justify-center space-x-2 py-3.5 px-4 text-xs font-bold transition border-b-2 ${
                activeTab === tab ? 'border-purple-400 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'stats' && <BarChart3 className="w-3.5 h-3.5" />}
              {tab === 'products' && <Package className="w-3.5 h-3.5" />}
              {tab === 'orders' && <ShoppingBag className="w-3.5 h-3.5" />}
              {tab === 'categories' && <ArrowUpRight className="w-3.5 h-3.5" />}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>

        {/* Admin Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : (
            <>
              {/* STATS TAB */}
              {activeTab === 'stats' && stats && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' },
                      { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-cyan-400 bg-cyan-950/50 border-cyan-500/30' },
                      { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-purple-400 bg-purple-950/50 border-purple-500/30' },
                      { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-pink-400 bg-pink-950/50 border-pink-500/30' },
                    ].map((kpi) => {
                      const Icon = kpi.icon;
                      return (
                        <div key={kpi.label} className={`border rounded-2xl p-4 space-y-2 ${kpi.color}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{kpi.label}</span>
                            <Icon className="w-4 h-4 opacity-70" />
                          </div>
                          <p className="text-2xl font-black text-white">{kpi.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Low Stock Alert */}
                  {stats.lowStockProducts.length > 0 && (
                    <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs font-extrabold text-amber-300 uppercase">⚠️ Low Stock Alert</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {stats.lowStockProducts.map((p) => (
                          <div key={p.id} className="bg-[#0a0d14] border border-amber-500/20 rounded-xl px-3 py-2 flex justify-between items-center">
                            <span className="text-xs text-slate-300 font-semibold truncate">{p.name}</span>
                            <span className={`text-xs font-black ml-2 ${p.stockQuantity <= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                              {p.stockQuantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Orders */}
                  <div className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-3">Recent Orders</h3>
                    <div className="space-y-2">
                      {stats.recentOrders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{order.orderNumber}</p>
                            <p className="text-[10px] text-slate-500">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-white">${order.totalAmount?.toFixed(2)}</p>
                            <p className={`text-[10px] font-bold ${STATUS_COLORS[order.status] || 'text-slate-400'}`}>{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white">{products.length} Products</h3>
                    <button
                      onClick={() => { setEditingProduct(null); setProductFormData({ name: '', description: '', price: '', discountPrice: '', stockQuantity: '', sku: '', brand: '', categoryId: categories[0]?.id || '', isFeatured: false }); setShowProductForm(true); }}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {productMessage && (
                    <div className="bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 rounded-xl px-4 py-2 text-xs font-semibold">
                      {productMessage}
                    </div>
                  )}

                  {/* Inline Product Form */}
                  {showProductForm && (
                    <form onSubmit={handleSaveProduct} className="bg-[#0a0d14] border border-purple-700/50 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-extrabold text-purple-300 uppercase">{editingProduct?.id ? 'Edit Product' : 'Create New Product'}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={productFormData.name} onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} placeholder="Product Name *" required className="bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                        <input value={productFormData.sku} onChange={(e) => setProductFormData({...productFormData, sku: e.target.value})} placeholder="SKU *" required={!editingProduct?.id} className="bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                        <input value={productFormData.brand} onChange={(e) => setProductFormData({...productFormData, brand: e.target.value})} placeholder="Brand / Manufacturer" className="bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                        <input value={productFormData.price} onChange={(e) => setProductFormData({...productFormData, price: e.target.value})} placeholder="Price ($) *" type="number" step="0.01" required className="bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                        <input value={productFormData.discountPrice} onChange={(e) => setProductFormData({...productFormData, discountPrice: e.target.value})} placeholder="Discount Price ($)" type="number" step="0.01" className="bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                        <input value={productFormData.stockQuantity} onChange={(e) => setProductFormData({...productFormData, stockQuantity: e.target.value})} placeholder="Stock Quantity" type="number" className="bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                      </div>
                      <textarea value={productFormData.description} onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} placeholder="Product Description" rows={2} className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={productFormData.categoryId} onChange={(e) => setProductFormData({...productFormData, categoryId: e.target.value})} className="bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500">
                          <option value="">Select Category</option>
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                          <input type="checkbox" checked={productFormData.isFeatured} onChange={(e) => setProductFormData({...productFormData, isFeatured: e.target.checked})} className="accent-purple-500" />
                          <span>Mark as Featured</span>
                        </label>
                      </div>
                      <div className="flex space-x-3">
                        <button type="submit" disabled={productSaving} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-bold text-xs px-5 py-2 rounded-xl transition">
                          <Save className="w-3.5 h-3.5" />
                          <span>{productSaving ? 'Saving...' : 'Save Product'}</span>
                        </button>
                        <button type="button" onClick={() => setShowProductForm(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl transition">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Products Table */}
                  <div className="bg-[#0a0d14] border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="border-b border-slate-800 bg-slate-900/60">
                          <tr>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Product</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Price</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Stock</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Category</th>
                            <th className="text-right px-4 py-3 text-slate-400 font-bold uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=60'} alt={product.name} className="w-9 h-9 rounded-lg object-cover bg-slate-800" />
                                  <div>
                                    <p className="font-semibold text-slate-200 line-clamp-1">{product.name}</p>
                                    <p className="text-slate-500">{product.sku}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <span className="font-bold text-white">${(product.discountPrice || product.price).toFixed(2)}</span>
                                  {product.discountPrice && <span className="ml-1 text-slate-500 line-through text-[10px]">${product.price.toFixed(2)}</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`font-bold ${product.stockQuantity <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                  {product.stockQuantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-400">{product.category?.name || '—'}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => handleEditProduct(product)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-950/30 rounded-lg transition">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-white">{orders.length} Total Orders</h3>
                  <div className="bg-[#0a0d14] border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="border-b border-slate-800 bg-slate-900/60">
                          <tr>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Order #</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Customer</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Total</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Date</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase">Update Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} className="border-b border-slate-800/60 hover:bg-slate-800/20">
                              <td className="px-4 py-3 font-mono font-semibold text-slate-200">{order.orderNumber}</td>
                              <td className="px-4 py-3 text-slate-300">{(order as any).user?.name || '—'}</td>
                              <td className="px-4 py-3 font-extrabold text-white">${order.totalAmount.toFixed(2)}</td>
                              <td className="px-4 py-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className={`bg-[#121824] border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none focus:border-purple-500 ${STATUS_COLORS[order.status] || 'text-slate-300'}`}
                                >
                                  {ORDER_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white">{categories.length} Categories</h3>
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {showCategoryForm && (
                    <form onSubmit={handleCreateCategory} className="bg-[#0a0d14] border border-purple-700/50 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-purple-300">New Category</h4>
                      <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Category Name *" required className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                      <input value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} placeholder="Description" className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500" />
                      <div className="flex space-x-3">
                        <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition">Save</button>
                        <button type="button" onClick={() => setShowCategoryForm(false)} className="bg-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl transition">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{cat.name}</p>
                          <p className="text-[10px] text-slate-500">{cat._count?.products || 0} products · /{cat.slug}</p>
                        </div>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
