import HomeIcon from './assets/home.svg';
import MessageIcon from './assets/message.svg';
import CatalogIcon from './assets/catalog.svg';
import WalletIcon from './assets/wallet.svg';
import CartIcon from './assets/cart.svg';
import UserIcon from './assets/user.svg';

import Link from 'next/link';
import Image from 'next/image';

const links = [
  {
    href: '/',
    iconSrc: HomeIcon
  },
  {
    href: '/account/messages',
    iconSrc: MessageIcon
  },
  {
    href: '/catalog',
    iconSrc: CatalogIcon
  },
  {
    href: '/account/wallet',
    iconSrc: WalletIcon
  },
  {
    href: '/cart',
    iconSrc: CartIcon
  },
  {
    href: '/account',
    iconSrc: UserIcon
  }
];

export default function MobileMenu() {
  return (
    <div
      className="bg-white fixed z-10 bottom-0 left-0 w-full px-[15px] flex justify-between items-center sm:hidden"
    >
      {
        links.map(link =>
          <Link key={link.href} href={link.href} className="py-[15px] px-[15px]">
            <Image
              src={link.iconSrc}
              alt="icon"
              width={25}
              height={25}
            />
          </Link>
        )
      }
    </div>
  );
}
