'use client';

import throttle from 'lodash/throttle';
import { getAPI } from "@/supabase/api";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { createContext, useEffect, useState } from "react";

interface CartContextI {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setItemQuantity: (productId: string, newQuantity: number) => void;
}

export const CartContext = createContext({} as CartContextI);

interface Props {
  children: React.ReactNode;
  initialCart: CartItem[];
  uid: string | null;
}

const saveCartToLocalStorage = throttle(function(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
}, 2000);

export default function CartContextProvider({ children, initialCart, uid }: Props) {
  const api = getAPI(createClientSupabaseClient());
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  useEffect(() => {
    // try to fetch cart from local storage if cart from supabase is empty or doesn't exist at all
    if (!uid || cart.length === 0) {
      const cartString = localStorage.getItem('cart');

      if (cartString) {
        setCart(JSON.parse(cartString));
      }
    }

    // fetch products based on cartItems and update the state
    // you have to try to fetch products after this useEffect has worked.
  }, []);

  useEffect(() => {
    saveCartToLocalStorage(cart);
  }, [cart]);

  const addItem = (item: CartItem) => {
    if (uid) {
      api.addToCart(item.product_id, item.quantity);
    }

    setCart([
      ...cart,
      item
    ]);
  };

  const removeItem = (productId: string) => {
    if (uid) {
      api.deleteFromCart(productId);
    }

    setCart(
      cart.filter(item => item.product_id !== productId)
    );
  };

  const clearCart = () => {
    if (uid) {
      api.clearCart();
    }

    setCart([]);
  };

  const setItemQuantity = (productId: string, newQuantity: number) => {
    if (uid) {
      api.setCartItemQuantity(productId, newQuantity);
    }

    setCart(
      cart.map(item => {
        if (item.product_id !== productId) return item;

        return {
          ...item,
          quantity: newQuantity
        };
      })
    );
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clearCart,
        setItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}