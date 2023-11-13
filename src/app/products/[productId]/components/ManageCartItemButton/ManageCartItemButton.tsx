'use client';

import { getAPI } from "@/supabase/api";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useContext, useState } from "react";
import { CartContext } from "@/src/reactContext";
import Link from "next/link";
import LoadingSpinner from "@/src/components/LoadingSpinner";

interface Props {
  productId: string;
  inCart: boolean;
  quantity: number;
  maxQuantity: number;
}

export default function ManageCartItemButton({
  productId,
  inCart: inCartInitial,
  quantity: qnt,
  maxQuantity,
}: Props) {

  const [inCart, setInCart] = useState(inCartInitial);
  const [quantity, setQuantity] = useState(qnt);
  const {cartItemsCount, setCartItemsCount} = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const api = getAPI(createClientSupabaseClient());

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-5 w-full max-w-[300px] h-12">
        <LoadingSpinner />
      </div>
    );
  }

  const handleAdd = async () => {
    setIsLoading(true);
    await api.addToCart(productId);
    setIsLoading(false);
    setCartItemsCount(cartItemsCount + 1);
    setInCart(true);
  };

  const handleDelete = async () => {
    api.deleteFromCart(productId);
    setCartItemsCount(cartItemsCount - 1);
    setInCart(false);
  };

  const handleDecreaseQuantity = async () => {
    if (quantity === 1) {
      handleDelete();
    } else {
      api.setCartItemQuantity(productId, quantity - 1);
      setQuantity(q => q - 1);
    }
  };

  const handleIncreaseQuantity = async () => {
    if (quantity < maxQuantity) {
      api.setCartItemQuantity(productId, quantity + 1)
      setQuantity(q => q + 1);
    }
  };

  return (
    <div className="flex justify-between gap-5 w-full max-w-[300px] h-12">
      {
        inCart
        ?
          <>
            <Link
              href="/cart"
              className="bg-green-500 w-max px-3 flex items-center rounded-lg transition-all text-white"
            >
              Go to cart
            </Link>
            <div className="flex grow">
              <button
                className="border-2 cursor-pointer active:border-sky-500 grow"
                onClick={handleDecreaseQuantity}
              >
                -
              </button>
                <output className="flex justify-center items-center border-2 border-l-0 border-r-0 grow-[2]">
                  {quantity}
                </output>
              <button className="border-2 cursor-pointer active:border-sky-500 grow"
                onClick={handleIncreaseQuantity}
              >
                +
              </button>
            </div>
          </>
        :
          <button
            onClick={handleAdd}
            className="bg-sky-500 p-3 rounded-lg transition-all text-white w-full"
          >
            Add to cart
          </button>
      }
    </div>
  );
}