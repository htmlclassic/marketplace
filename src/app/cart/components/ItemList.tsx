'use client';

import { getAPI } from "@/supabase/api";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Item from "./Item";
import LoadingSpinner from "@/src/components/LoadingSpinner";

interface Props {
  cart: CartItem[];
  removeCartItem: (productId: string) => void;
  setItemQuantity: (productId: string, newQuantity: number) => void;
}

export default function ItemList({ cart, removeCartItem, setItemQuantity }: Props) {
  const [products, setProducts] = useState<Product[] | null>(null);
  
  useEffect(() => {
    (async function seedProducts() {
      const api = getAPI(createClientSupabaseClient());
      const products = await api.getProducts(cart.map(item => item.product_id));

      if (products) {
        setProducts(products);
      }
    })();
  }, []);

  if (!products) return (
    <div className="flex justify-center items-center grow h-full">
      <div className="w-8 h-8 text-green-300">
        <LoadingSpinner />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <AnimatePresence>
        {
          cart.map(cartItem => {
            const product = products.find(({ id }) => id === cartItem.product_id)!;

            return (
              <Item
                product={product}
                cartItem={cartItem}
                removeCartItem={() => removeCartItem(product.id)}
                setItemQuantity={(newQuantity: number) => setItemQuantity(product.id, newQuantity)}
                key={product.id}
              />
            );
          })
        }
      </AnimatePresence>
    </div>
  );
}