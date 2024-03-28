'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  {
    text: 'Аккаунт',
    href: '/account'
  },
  {
    text: 'Заказы',
    href: '/account/orders'
  },
  {
    text: 'Избранное',
    href: '/account/favorites'
  },
  {
    text: 'Сообщения',
    href: '/account/chats'
  },
  {
    text: 'Кошелёк',
    href: '/account/wallet'
  },
  {
    text: 'Продать товар',
    href: '/account/addproduct'
  },
  {
    text: 'Статистика продаж',
    href: '/account/sales'
  },
];

interface Props {
  show: boolean | null;
  hide: () => void;
}

export default function Nav({ show, hide }: Props) {
  const path = usePathname();

  return (
    <div
      className={clsx({
        "flex flex-col w-[--nav-width] h-[calc(100vh-var(--header-height)-var(--menu-height)-var(--top-padding))] sm:h-[calc(100vh-var(--header-height)-var(--top-padding))] flex-shrink-0 z-10 overflow-auto transition-all bg-white fixed": true,
        "-translate-x-[150%] sm:translate-x-0": show === null,
        "translate-x-0": show === true,
        "-translate-x-[150%]": show === false
      })}
      onClick={e => e.stopPropagation()}
    >
      {
        LINKS.map(link =>
          <Link
            key={link.href}
            href={link.href}
            className={clsx({
              "transition-all py-3 text-nowrap p-2 rounded-md hover:bg-gray-100": true,
            })}
            onClick={() => {
              const isMobile = window.innerWidth < 640;

              if (isMobile) {
                hide();
              }
            }}
          >
            <span
              className={clsx({
                "relative after:absolute after:left-0 after:bottom-[-5px] after:w-full after:h-[2px] after:bg-green-400": true,
                "after:opacity-100": link.href === path,
                "after:opacity-0": link.href !== path
              })}
            >{link.text}</span>
          </Link>
        )
      }
    </div>
  );
}