// Cart Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  };

  const saveCartToStorage = async (items) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  };

  const addToCart = (book, bookType = 'soft') => {
    const newItem = {
      id: `${book.id}_${bookType}`,
      book: book,
      bookType: bookType,
      quantity: 1,
      price: bookType === 'hard' ? book.hard_price : book.soft_price,
      title: book.title,
      author: book.author,
      cover_image: book.cover_image_url || book.cover_url,
    };

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === newItem.id
    );

    let newCartItems;
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      newCartItems = [...cartItems, newItem];
    }

    setCartItems(newCartItems);
    saveCartToStorage(newCartItems);
  };

  const removeFromCart = (itemId) => {
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
    saveCartToStorage(newCartItems);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const newCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(newCartItems);
    saveCartToStorage(newCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToStorage([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (bookId, bookType = 'soft') => {
    return cartItems.some(
      (item) => item.book.id === bookId && item.bookType === bookType
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};