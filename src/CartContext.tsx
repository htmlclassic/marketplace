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
    if (!uid) {
      const cartString = localStorage.getItem('cart');

      if (cartString) {
        setCart(JSON.parse(cartString));
      }
    } else if (initialCart !== cart) {
      setCart(initialCart);
    }
  }, [initialCart]);

  useEffect(() => {
    // saveCartToLocalStorage is throttled, so I have to use this setCart updater
    // to save the latest state value (after useEffect above changes state)
    setCart(cart => {
      saveCartToLocalStorage(cart);

      return cart;
    });
  }, [cart]);

  const addItem = (item: CartItem) => {
    const itemAlreadyInCart = cart.find(cartItem => cartItem.product.id === item.product.id);
    if (itemAlreadyInCart) return;

    if (uid) {
      api.addToCart(item.product.id, item.quantity);
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
      cart.filter(item => item.product.id !== productId)
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
        if (item.product.id !== productId) return item;

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