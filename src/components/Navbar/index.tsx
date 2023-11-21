'use client';

import CartItemsCount from './CartItemsCount';
import Link from 'next/link';
import MenuIcon from './assets/menu-icon.svg';
import UserIcon from "./assets/user-icon.svg";

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import SearchInput from './SearchInput';

interface Props {
  session: boolean;
}

const PATHS = [
  {
    content: 'Главная',
    url: '/'
  },
  {
    content: 'Заказы',
    url: '/orders'
  },
  {
    content: 'Ваши продажи',
    url: '/sales'
  },
  {
    content: 'Продать товар',
    url: '/addProduct'
  },
];

export default function Navbar({ session }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const currentPath = usePathname();

  useEffect(() => {
    const handleCloseMenu = (e: MouseEvent) => {
      if (e.composedPath().includes(ref.current as EventTarget)) return;
      setShowMenu(false);
    };

    window.addEventListener('click', handleCloseMenu);

    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

  const links = PATHS.map(link =>
    <Link
      href={link.url}
      onClick={() => setShowMenu(false)}
      className={clsx({
        'relative p-3 flex flex-col shrink-0': true,
        'animate-nav-static': currentPath === link.url,
        'animate-nav': currentPath !== link.url
      })}
    >{link.content}</Link>
  );

  return (
    <div className="min-h-[60px] transform-gpu border-transparent sticky top-0 py-1 px-2 flex gap-x-3 min-[530px]:gap-x-10 justify-between items-center bg-[rgba(0,0,0,0.8)] text-white z-10 before:w-full before:h-full before:absolute before:left-0 before:top-0 before:z-[-1] before:backdrop-blur-md">
      <button
        ref={ref}
        onClick={() => setShowMenu(!showMenu)}
        className="min-[920px]:hidden shrink-0 p-2"
      >
        <Image
          src={MenuIcon}
          alt="Menu icon"
          width={25}
          height={25}
        />
      </button>
      <nav
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className={clsx({
          'transform-gpu py-3 flex gap-y-2 flex-col min-w-[260px] h-screen w-max transition-all duration-200 -translate-x-full absolute -left-full top-full bg-[rgba(0,0,0,0.8)] min-[920px]:py-0 min-[920px]:transition-none min-[920px]:translate-x-0 min-[920px]:flex-row min-[920px]:min-w-0 min-[920px]:h-auto min-[920px]:static min-[920px]:bg-transparent': true,
          'backdrop-blur-md left-[-2px] translate-x-0': showMenu
        })}
      >
        { links[0] }
        {
          session &&
            links.slice(1).map((link, i) => <Fragment key={i}>{link}</Fragment>)
        }
      </nav>
      <SearchInput />
      <div className={clsx({
        'flex items-center min-[920px]:gap-5': true,
        'justify-between': session,
        'justify-end': !session
      })}>
        { session && <CartItemsCount /> }
        <Link href="/profile" title="Профиль" className="shrink-0 flex p-2 border border-transparent hover:border-white transition-all">
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
