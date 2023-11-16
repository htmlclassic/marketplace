'use client';

import { getAPI } from "@/supabase/api";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useEffect, useState } from "react";
import { CartState } from "../page";

interface Props {
  cartItem: CartState;
  setItemQuantity: (newQuantity: number) => void;
}

export default function ControlQuantity({
  cartItem,
  setItemQuantity
}: Props) {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const maxQuantity = cartItem.maxQuantity;
  const api = getAPI(createClientSupabaseClient());

  useEffect(() => {
    if (cartItem.quantity !== quantity) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const changeQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      api.setCartItemQuantity(cartItem.product_id, newQuantity)
      setQuantity(newQuantity);
      setItemQuantity(newQuantity);
    }
  };

  return (
    <div className="flex max-w-[200px]">
      <button
        className="border px-3 py-1 cursor-pointer active:border-black hover:bg-blue-50 disabled:active:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-default"
        onClick={() => changeQuantity(quantity - 1)}
        disabled={quantity === 1}
      >
        -
      </button>
      <input 
        type="number"
        min={1}
        max={maxQuantity}
        className="border-t border-b text-center min-w-0 outline-none"
        value={quantity}
        onChange={e => changeQuantity(Number(e.target.value))}
        onFocus={e => e.target.select()}
      />
      <button
        className="border px-3 py-1 cursor-pointer active:border-black hover:bg-blue-50 disabled:active:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-default"
        onClick={() => changeQuantity(quantity + 1)}
        disabled={quantity === maxQuantity}
      >
        +
      </button>
    </div>
  );
}