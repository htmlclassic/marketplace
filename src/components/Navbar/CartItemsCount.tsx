'use client';

import { useContext, useEffect, useRef } from 'react';

import CartIcon from './assets/cart-icon.svg';
import Image from 'next/image';
import Link from "next/link";
import { CartContext } from '@/src/CartContext';
import { motion, useAnimate } from 'framer-motion';

export default function CartItemsCount() {
  const { cart } = useContext(CartContext);
  const cartItemsCount = cart.length;

  const [scope, animate] = useAnimate();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    };

    animate(scope.current,
    {
      y: [1, 4, 1, 4]
    },
    {
      type: 'spring',
      bounce: 0.8
    })
  }, [cartItemsCount])

  return (
    <Link href="/cart" className="relative flex flex-shrink-0 items-center w-max">
      <Image src={CartIcon} alt="cart icon" width={35} height={35} />
      <motion.div
        initial={{
          x: -7,
          y: 4,
        }}
        ref={scope}
        className="flex justify-center leading-4 items-center text-[0.65rem] min-w-[1.6rem] min-h-[1.6rem] rounded-full bg-sky-500 text-white"
      >
        {cartItemsCount}
      </motion.div>
    </Link>
  );
}