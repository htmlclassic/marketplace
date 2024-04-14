'use client';

import CartItemsCount from './CartItemsCount';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';

import React, { useEffect, useRef, useState } from 'react';
import SearchInput from '../SearchInput';
import Catalog from '../Catalog';

interface Props {
  searchHistory: SearchSuggestion[];
}

export default function Navbar({ searchHistory }: Props) {
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
    <div className="h-[var(--header-height)] transform-gpu sticky top-0 py-1 px-4 flex gap-x-5 sm:gap-x-10 justify-between items-center before:bg-black before:bg-opacity-80 before:backdrop-hack before:backdrop-blur-md text-white z-20">
      <div className="flex gap-7 items-center">
        <Button
          ref={ref}
          onClick={() => setShowCatalog(!showCatalog)}
          sx={{
            width: 'max-content',
            minWidth: 0,
            padding: '0.7rem',
            borderRadius: '100%'
          }}
          TouchRippleProps={{
            className: "text-white"
          }}
        >
          <CatalogIcon />
        </Button>
        <Link href="/" className="text-2xl font-medium hidden sm:inline">Marketplace</Link>
      </div>  
      <SearchInput searchHistory={searchHistory} />
      <div className="items-center lg:gap-4 justify-between hidden sm:flex">
        <CartItemsCount />
        <Link href="/account" title="Аккаунт" className="shrink-0 flex py-2 pl-4">
          <PersonIcon sx={{ width: 30, height: 30 }} />
        </Link>
      </div>
      <Link href="/" className="text-2xl font-medium sm:hidden">M</Link>

      <Catalog
        show={showCatalog}
        hide={() => setShowCatalog(false)}
      />
    </div>
  );
}

function CatalogIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="none"
      viewBox="0 0 30 30"
    >
      <path
        fill="#fff"
        stroke="#fff"
        strokeLinejoin="round"
        d="M1 .5h10c.186 0 .303.06.371.129.07.068.129.185.129.371v10c0 .186-.06.303-.129.371-.068.07-.185.129-.371.129H1c-.186 0-.303-.06-.371-.129C.559 11.303.5 11.186.5 11V1C.5.814.56.697.629.629.697.559.814.5 1 .5zM1 18.5h10c.186 0 .303.06.371.129.07.068.129.185.129.371v10c0 .186-.06.303-.129.371-.068.07-.185.129-.371.129H1c-.186 0-.303-.06-.371-.129C.559 29.303.5 29.186.5 29V19c0-.186.06-.303.129-.371.068-.07.185-.129.371-.129zM19 .5h10c.186 0 .303.06.371.129.07.068.129.185.129.371v10c0 .186-.06.303-.129.371-.068.07-.185.129-.371.129H19c-.186 0-.303-.06-.371-.129-.07-.068-.129-.185-.129-.371V1c0-.186.06-.303.129-.371.068-.07.185-.129.371-.129zM19 18.5h10c.186 0 .303.06.371.129.07.068.129.185.129.371v10c0 .186-.06.303-.129.371-.068.07-.185.129-.371.129H19c-.186 0-.303-.06-.371-.129-.07-.068-.129-.185-.129-.371V19c0-.186.06-.303.129-.371.068-.07.185-.129.371-.129z"
      ></path>
    </svg>
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