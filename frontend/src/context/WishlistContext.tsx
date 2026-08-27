import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await api.get('/wishlist');
      const products = res.data.wishlist.map((item: any) => item.product);
      setWishlistProducts(products);
    } catch (err) {
      console.warn('Wishlist fetch error:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      const saved = localStorage.getItem('nexus_guest_wishlist');
      if (saved) {
        try {
          setWishlistProducts(JSON.parse(saved));
        } catch (e) {
          setWishlistProducts([]);
        }
      }
    }
  }, [user]);

  const toggleWishlist = async (product: Product) => {
    if (user) {
      await api.post('/wishlist/toggle', { productId: product.id });
      await fetchWishlist();
    } else {
      const exists = wishlistProducts.some((p) => p.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = wishlistProducts.filter((p) => p.id !== product.id);
      } else {
        updated = [...wishlistProducts, product];
      }
      setWishlistProducts(updated);
      localStorage.setItem('nexus_guest_wishlist', JSON.stringify(updated));
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistProducts.some((p) => p.id === productId);
  };

  const wishlistIds = wishlistProducts.map((p) => p.id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
