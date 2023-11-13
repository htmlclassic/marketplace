'use client';

import { getAPI } from "@/supabase/api";
import { createClientSupabaseClient } from "@/supabase/utils_client";

import TrashIcon from './trash-icon.svg';
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/src/reactContext";

interface Props {
  productId: string;
  handleDeleteProduct: () => void;
}

export default function DeleteCartItemButton({ productId, handleDeleteProduct }: Props) {
  const api = getAPI(createClientSupabaseClient());
  const { setCartItemsCount } = useContext(CartContext);

  return (
    <button
      onClick={() => {
        api.deleteFromCart(productId);
        handleDeleteProduct();
        setCartItemsCount(c => c - 1);
      }}
      className="border-[1px] border-transparent transition-all hover:border-black p-3 shrink-0"
    >
      <Image
        src={TrashIcon}
        alt="Delete item from cart icon"
        width={15}
        height={15}
      />
    </button>
  );
}