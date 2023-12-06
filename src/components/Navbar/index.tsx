'use client';

import CartItemsCount from './CartItemsCount';
import Link from 'next/link';
import MenuIcon from './assets/menu-icon.svg';
import UserIcon from "./assets/user-icon.svg";

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import SearchInput from '../SearchInput/SearchInput';

interface Props {
  session: boolean;
}

export default function Navbar({ session }: Props) {
  const [showCatalog, setShowCatalog] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleCloseMenu = (e: MouseEvent) => {
      if (e.composedPath().includes(ref.current as EventTarget)) return;
      setShowCatalog(false);
    };

    window.addEventListener('click', handleCloseMenu);

    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

  return (
    <div className="gradient min-h-[70px] transform-gpu sticky top-0 py-1 px-4 hidden sm:flex gap-x-10 justify-between items-center bg-white z-20">
      <button
        ref={ref}
        onClick={() => setShowCatalog(!showCatalog)}
        className="lg:hidden shrink-0 p-2"
      >
        <Image
          src={MenuIcon}
          alt="Menu icon"
          width={25}
          height={25}
        />
      </button>
      <Link href="/" className='text-2xl font-medium'>Marketplace</Link>
      <SearchInput />
      <div className={clsx({
        'flex items-center lg:gap-4': true,
        'justify-between': session,
        'justify-end': !session
      })}>
        { 
          session &&
            <CartItemsCount />
        }
        <Link href="/account" title="Аккаунт" className="shrink-0 flex py-2 pl-4">
          <Image
            src={UserIcon}
            width={25}
            height={25}
            alt="user icon"
          />
        </Link>
      </div>
    </div>
  );
}
