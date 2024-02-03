'use client';

import { useContext, useEffect, useRef } from 'react';

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
      <CartIcon />
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

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.5 19.5a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 100-4 2 2 0 000 4zM16.5 19.5a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 100-4 2 2 0 000 4zM3 4a.5.5 0 01.5-.5h2a.5.5 0 01.476.348L9.37 14.5H17a.5.5 0 010 1H9.004a.5.5 0 01-.476-.348L5.135 4.5H3.5A.5.5 0 013 4z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        d="M8.5 13L6 6h13.337a.5.5 0 01.48.637l-1.713 6a.5.5 0 01-.481.363H8.5z"
      ></path>
    </svg>
  );
}