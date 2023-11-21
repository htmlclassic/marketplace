'use client';

import CartItemsCount from './CartItemsCount';
import Link from 'next/link';
import MenuIcon from './assets/menu-icon.svg';
import UserIcon from "./assets/user-icon.svg";

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import SearchInput from '../SearchInput/SearchInput';

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
    url: '/account/orders'
  },
  {
    content: 'Ваши продажи',
    url: '/account/sales'
  },
  {
    content: 'Продать товар',
    url: '/account/addproduct'
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
    <div className="min-h-[70px] transform-gpu border-transparent sticky top-0 py-1 px-2 hidden sm:flex gap-x-10 justify-between items-center bg-[#82ebae] z-10">
      <button
        ref={ref}
        onClick={() => setShowMenu(!showMenu)}
        className="lg:hidden shrink-0 p-2"
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
          'transform-gpu py-3 flex gap-y-2 flex-col min-w-[260px] h-screen w-max transition-all duration-200 -translate-x-full absolute -left-full top-full bg-[#82ebae] lg:py-0 lg:transition-none lg:translate-x-0 lg:flex-row lg:min-w-0 lg:h-auto lg:static lg:bg-transparent': true,
          'left-[-2px] translate-x-0': showMenu
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
        'flex items-center lg:gap-5': true,
        'justify-between': session,
        'justify-end': !session
      })}>
        { session && <CartItemsCount /> }
        <Link href="/account/profile" title="Профиль" className="shrink-0 flex p-2 border border-transparent hover:border-white transition-all">
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
