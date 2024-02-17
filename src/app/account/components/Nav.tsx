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
  width: number;
}

export default function Nav({ show, hide, width }: Props) {
  const path = usePathname();

  return (
    <div
      className={clsx({
        "flex flex-col flex-shrink-0 z-10 pr-10 overflow-hidden transition-all h-screen bg-white fixed": true,
        "-translate-x-[150%] sm:translate-x-0": show === null,
        "translate-x-0": show === true,
        "-translate-x-[150%]": show === false
      })}
      style={{
        width
      }}
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