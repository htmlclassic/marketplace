'use client';

import { useContext } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import Link from "next/link";
import { CartContext } from '@/src/CartContext';

export default function CartItemsCount() {
  const { cart } = useContext(CartContext);
  const cartItemsCount = cart.length;

  let count = cartItemsCount.toString();
  if (cartItemsCount > 99) count = cartItemsCount + '+';

  return (
    <Link href="/cart" className="relative flex flex-shrink-0 items-center w-max">
      <ShoppingCartIcon sx={{ width: 27, height: 27 }} />
      <div
        className="-translate-x-[5px] font-bold translate-y-[3px] flex justify-center leading-4 items-center text-[0.8rem] min-w-[1.6rem] min-h-[1.6rem] rounded-full text-white"
      >
        {count}
      </div>
    </Link>
  );
}