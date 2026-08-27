import React, { useState } from 'react';
import { Gamepad2, Search, ShoppingBag, Heart, User as UserIcon, Shield, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenWishlist: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCategorySelect: (slug: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenOrders,
  onOpenAdmin,
  onOpenWishlist,
  searchTerm,
  setSearchTerm,
  onCategorySelect,
}) => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, setIsOpen: setIsCartOpen } = useCart();
  const { wishlistProducts } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onCategorySelect('')}>
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-neon">
              <Gamepad2 className="w-7 h-7 text-black font-extrabold" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 uppercase">
                Nexus<span className="text-cyan-400">Gaming</span>
              </span>
              <span className="block text-[10px] tracking-widest text-slate-400 font-semibold uppercase -mt-1">
                Ultra Gear Marketplace
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search RTX 4090, OLED laptops, keyboards..."
                className="w-full bg-[#121824] border border-slate-700/60 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Category Shortcuts */}
            <button
              onClick={() => onCategorySelect('gpu-components')}
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition"
            >
              GPUs
            </button>
            <button
              onClick={() => onCategorySelect('laptops-pcs')}
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition"
            >
              Laptops & Rigs
            </button>
            <button
              onClick={() => onCategorySelect('peripherals-accessories')}
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition"
            >
              Peripherals
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-slate-300 hover:text-pink-400 transition hover:bg-slate-800/60 rounded-lg"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistProducts.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-300 hover:text-cyan-400 transition hover:bg-slate-800/60 rounded-lg"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-[#121824] hover:bg-slate-800 border border-slate-700/70 rounded-full px-3 py-1.5 transition"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-cyan-400"
                  />
                  <span className="text-xs font-semibold text-slate-200">{user.name.split(' ')[0]}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#121824] border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-slate-200">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-900/60 border border-purple-500 text-purple-300 text-[9px] font-bold rounded uppercase">
                          Admin Command Mode
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-400 flex items-center space-x-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Order History & Profile</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 flex items-center space-x-2"
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-slate-800 flex items-center space-x-2 border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition shadow-neon"
              >
                Sign In / Join
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-3">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-300">
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-cyan-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121824] border-b border-slate-800 px-4 py-4 space-y-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
          />
          <div className="flex flex-col space-y-2 pt-2">
            <button onClick={() => { onCategorySelect('gpu-components'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-slate-300">GPUs & Components</button>
            <button onClick={() => { onCategorySelect('laptops-pcs'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-slate-300">Gaming Laptops & Rigs</button>
            <button onClick={() => { onCategorySelect('peripherals-accessories'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-slate-300">Peripherals</button>
            <button onClick={() => { onOpenWishlist(); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-pink-400">Wishlist ({wishlistProducts.length})</button>
            {user ? (
              <>
                <button onClick={() => { onOpenOrders(); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-cyan-400">My Orders</button>
                {isAdmin && <button onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-purple-400">Admin Dashboard</button>}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-red-400">Logout</button>
              </>
            ) : (
              <button onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }} className="w-full bg-cyan-500 text-black text-xs font-bold py-2 rounded-lg">Sign In</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
