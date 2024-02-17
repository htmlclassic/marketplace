'use client';

import HomeIcon from './assets/HomeIcon';
import CatalogIcon from './assets/CatalogIcon';
import WalletIcon from './assets/WalletIcon';
import CartIcon from './assets/CartIcon';
import UserIcon from './assets/UserIcon';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  {
    href: '/catalog',
    Icon: CatalogIcon
  },
  {
    href: '/account/wallet',
    Icon: WalletIcon
  },
  {
    href: '/cart',
    Icon: CartIcon
  },
  {
    href: '/account',
    Icon: UserIcon
  }
];

export default function MobileMenu() {
  const path = usePathname();

  return (
    <div
      className="bg-white fixed z-30 bottom-0 left-0 w-full px-[15px] flex justify-between items-center sm:hidden  h-[var(--mobile-menu-height)]"
    >
      <Link
        href="/"
        className={clsx({
          "p-4 transition-all duration-300": true,
          "text-black": path === '/',
          "text-gray-400": path !== '/'
        })}
      >
        <HomeIcon width={26} height={26} />
      </Link>
      {
        links.map(link =>
          <Link key={link.href} href={link.href} className={clsx({
            "p-4 transition-all duration-300": true,
            "text-gray-400": !path.startsWith(link.href),
            "text-black": path.startsWith(link.href)
          })}>
            { <link.Icon width={26}  height={26} /> }
          </Link>
        )
      }
    </div>
  );
}
