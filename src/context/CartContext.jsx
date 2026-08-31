import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'mbka_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Validate structure of items to avoid corruption
          return parsed.filter(item => item && item.id && typeof item.price === 'number');
        }
      }
    } catch (err) {
      console.warn('[Cart] Không thể đọc giỏ hàng từ localStorage:', err);
    }
    return [];
  });

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn('[Cart] Không thể lưu giỏ hàng vào localStorage:', err);
    }
  }, [cartItems]);

  // Check if item is already in cart
  const isInCart = (productId) => {
    if (!productId) return false;
    return cartItems.some(item => item.id === productId);
  };

  // Add product to cart (prevents duplicates)
  const addToCart = (product) => {
    if (!product || !product.id) return false;

    if (isInCart(product.id)) {
      return false; // Already in cart
    }

    const newItem = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: typeof product.price === 'number' ? Math.max(0, product.price) : 0,
      accessType: product.accessType || 'PAID',
      productType: product.productType || 'CAD',
      targetType: product.productType ? 'product' : 'course',
      fileTypes: Array.isArray(product.fileTypes) ? product.fileTypes : [],
      thumbnailUrl: product.thumbnailUrl || null,
      addedAt: new Date().toISOString()
    };

    setCartItems(prev => [...prev, newItem]);
    return true;
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    if (!productId) return;
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Computed values
  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    cartCount,
    cartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
