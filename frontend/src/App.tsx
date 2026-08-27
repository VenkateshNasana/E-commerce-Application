import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './services/api';
import { Product, Category, Order } from './types';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { ProductFilter } from './components/ProductFilter';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { WishlistModal } from './components/WishlistModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(4000);
  const [minPrice, setMinPrice] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [allBrands, setAllBrands] = useState<string[]>([]);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.warn('Failed to load categories:', err);
    }
  };

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategory) params.set('category', selectedCategory);
      if (maxPrice < 4000) params.set('maxPrice', maxPrice.toString());
      if (minPrice > 0) params.set('minPrice', minPrice.toString());
      if (selectedBrand) params.set('brand', selectedBrand);
      if (inStockOnly) params.set('inStock', 'true');
      params.set('sortBy', sortBy);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
      setCurrentPage(res.data.pagination.page);

      // Extract unique brands from all products for the filter
      if (page === 1 && !searchTerm && !selectedCategory) {
        const brands = [...new Set(res.data.products.map((p: Product) => p.brand))];
        setAllBrands(brands as string[]);
      }
    } catch (err) {
      console.warn('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, maxPrice, minPrice, selectedBrand, inStockOnly, sortBy]);

  // Debounced search
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMaxPrice(4000);
    setMinPrice(0);
    setSelectedBrand('');
    setInStockOnly(false);
    setSortBy('createdAt');
  };

  const handleOrderSuccess = (order: Order) => {
    setShowCheckout(false);
    setShowOrders(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14]">
      <Navbar
        onOpenAuth={() => setShowAuth(true)}
        onOpenOrders={() => setShowOrders(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenWishlist={() => setShowWishlist(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCategorySelect={(slug) => setSelectedCategory(slug)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Carousel - only show when no filters active */}
        {!searchTerm && !selectedCategory && (
          <HeroCarousel onShopNow={() => setSelectedCategory('')} />
        )}

        {/* Category Grid */}
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white">
              {searchTerm
                ? `Results for "${searchTerm}"`
                : selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || 'Category'
                : '🔥 Featured Gaming Arsenal'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          {/* Featured badge for home */}
          {!searchTerm && !selectedCategory && (
            <div className="hidden md:flex items-center space-x-2 bg-amber-950/40 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full text-[11px] font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Curated for Performance Gamers</span>
            </div>
          )}
        </div>

        {/* Main layout: Sidebar Filters + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Filter */}
          <div className="lg:w-56 shrink-0">
            <ProductFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onReset={handleResetFilters}
              brands={allBrands}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              loading={loading}
              onOpenDetails={setSelectedProduct}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-3 mt-8">
                <button
                  onClick={() => fetchProducts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-[#121824] border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => fetchProducts(i + 1)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-black shadow-neon'
                          : 'bg-[#121824] border border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => fetchProducts(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-[#121824] border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setShowCheckout(true)} onOpenAuth={() => setShowAuth(true)} />

      {/* All Modals */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={setSelectedProduct}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
      {showOrders && <OrdersModal onClose={() => setShowOrders(false)} />}
      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

// Root App wrapped in all Context Providers
const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
