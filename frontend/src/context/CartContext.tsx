import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountFixed, setDiscountFixed] = useState<number>(0);

  // Sync cart with backend when logged in or local state
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.cart.items || []);
    } catch (err) {
      console.warn('Cart fetch failed:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Local storage fallback for guest
      const saved = localStorage.getItem('nexus_guest_cart');
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch (e) {
          setCartItems([]);
        }
      }
    }
  }, [user]);

  const saveLocalGuestCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('nexus_guest_cart', JSON.stringify(items));
  };

  const addToCart = async (product: Product, quantity = 1) => {
    if (user) {
      await api.post('/cart/add', { productId: product.id, quantity });
      await fetchCart();
    } else {
      const existingIdx = cartItems.findIndex((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = [...cartItems];
        updated[existingIdx].quantity += quantity;
      } else {
        updated = [
          ...cartItems,
          {
            id: `guest-${Date.now()}`,
            cartId: 'guest',
            productId: product.id,
            quantity,
            product,
          },
        ];
      }
      saveLocalGuestCart(updated);
    }
    setIsOpen(true);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (user) {
      await api.put(`/cart/items/${itemId}`, { quantity });
      await fetchCart();
    } else {
      if (quantity < 1) {
        removeFromCart(itemId);
      } else {
        const updated = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        saveLocalGuestCart(updated);
      }
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (user) {
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
    } else {
      const updated = cartItems.filter((item) => item.id !== itemId);
      saveLocalGuestCart(updated);
    }
  };

  const clearCart = async () => {
    if (user) {
      await api.delete('/cart/clear');
      setCartItems([]);
    } else {
      saveLocalGuestCart([]);
    }
    setCouponCode('');
    setDiscountPercent(0);
    setDiscountFixed(0);
  };

  const applyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'GAMER10') {
      setCouponCode('GAMER10');
      setDiscountPercent(10);
      setDiscountFixed(0);
      return true;
    } else if (formatted === 'NEXUS25') {
      setCouponCode('NEXUS25');
      setDiscountFixed(25);
      setDiscountPercent(0);
      return true;
    }
    return false;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : discountFixed;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.0;
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100) / 100;
  const total = Math.max(0, subtotal - discount + shipping + tax);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        setIsOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        applyCoupon,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
