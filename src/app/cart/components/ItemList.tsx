'use client';

import { AnimatePresence } from "framer-motion";
import Item from "./Item";

interface Props {
  cart: CartItem[];
  removeCartItem: (productId: string) => void;
  setItemQuantity: (productId: string, newQuantity: number) => void;
}

export default function ItemList({ cart, removeCartItem, setItemQuantity }: Props) {
  return (
    <div className="flex flex-col gap-10">
      <AnimatePresence>
        {
          cart.map(cartItem => {
            return (
              <Item
                cartItem={cartItem}
                removeCartItem={() => removeCartItem(cartItem.product.id)}
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