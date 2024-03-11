'use client';

import { AnimatePresence } from "framer-motion";
import Item from "./Item";
import { useContext } from "react";
import { CartContext } from "@/src/CartContext";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

export default function ItemList() {
  const { cart, clearCart, removeItem, setItemQuantity } = useContext(CartContext);

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl bg-white p-2">
      <button
        onClick={clearCart}
        className="p-3 font-medium px-5 text-sm w-max rounded-full bg-sky-900 bg-opacity-5 hover:bg-opacity-10 transition-all duration-300"
      >
        <span className="mr-3">Очистить корзину</span>
        <RemoveShoppingCartIcon sx={{ width: 20, height: 20 }} />
      </button>
      <AnimatePresence>
        {
          cart.map(cartItem => {
            return (
              <Item
                cartItem={cartItem}
                removeCartItem={() => removeItem(cartItem.product.id)}
                setItemQuantity={(newQuantity: number) => setItemQuantity(cartItem.product.id, newQuantity)}
                key={cartItem.product.id}
              />
            );
          })
        }
      </AnimatePresence>
    </div>
  );
}