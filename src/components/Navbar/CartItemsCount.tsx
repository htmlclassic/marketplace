'use client';

import { useContext } from 'react';
import { CartContext } from '../../reactContext';

import CartIcon from './assets/cart-icon.svg';
import Image from 'next/image';
import Link from "next/link";

export default function CartItemsCount() {
  const { cartItemsCount } = useContext(CartContext);

  return (
    <Link href="/cart" className="relative flex flex-shrink-0 border border-transparent items-center w-max transition-all duration-300 hover:border-white">
      <Image src={CartIcon} alt="cart icon" width={35} height={35} />
      <div className="flex justify-center leading-4 items-center text-[0.65rem] translate-y-[4px] translate-x-[-7px] min-w-[1.6rem] min-h-[1.6rem] rounded-full bg-sky-500 text-white">
        {cartItemsCount}
      </div>
    </Link>
  );
}