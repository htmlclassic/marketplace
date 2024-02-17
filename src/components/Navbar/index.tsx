'use client';

import CartItemsCount from './CartItemsCount';
import Link from 'next/link';
import MenuIcon from './assets/menu-icon.svg';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SearchInput from '../SearchInput/SearchInput';

export default function Navbar() {
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
    <div className="h-[var(--header-height)] transform-gpu sticky top-0 py-1 px-4 hidden sm:flex gap-x-10 justify-between items-center bg-black bg-opacity-80 backdrop-blur-md text-white z-20">
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
      <div className="flex items-center lg:gap-4 justify-between">
        <CartItemsCount />
        <Link href="/account" title="Аккаунт" className="shrink-0 flex py-2 pl-4">
          <UserIcon />
        </Link>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12.75C8.83 12.75 6.25 10.17 6.25 7C6.25 3.83 8.83 1.25 12 1.25C15.17 1.25 17.75 3.83 17.75 7C17.75 10.17 15.17 12.75 12 12.75ZM12 2.75C9.66 2.75 7.75 4.66 7.75 7C7.75 9.34 9.66 11.25 12 11.25C14.34 11.25 16.25 9.34 16.25 7C16.25 4.66 14.34 2.75 12 2.75Z" fill="currentColor" />
      <path d="M20.5901 22.75C20.1801 22.75 19.8401 22.41 19.8401 22C19.8401 18.55 16.3202 15.75 12.0002 15.75C7.68015 15.75 4.16016 18.55 4.16016 22C4.16016 22.41 3.82016 22.75 3.41016 22.75C3.00016 22.75 2.66016 22.41 2.66016 22C2.66016 17.73 6.85015 14.25 12.0002 14.25C17.1502 14.25 21.3401 17.73 21.3401 22C21.3401 22.41 21.0001 22.75 20.5901 22.75Z" fill="currentColor" />
    </svg>
  );
}