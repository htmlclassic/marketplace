'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  {
    text: 'Личная информация',
    href: '/account/profile'
  },
  {
    text: 'Заказы',
    href: '/account/orders'
  },
  {
    text: 'Продать товар',
    href: '/account/addproduct'
  },
  {
    text: 'Статистика продаж',
    href: '/account/sales'
  },
  {
    text: 'Сообщения',
    href: '/account/chats'
  }
];

export default function Nav() {
  const path = usePathname();

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-5 max-w-5xl mx-auto">
      {
        LINKS.map(link =>
          <Link
            key={link.href}
            href={link.href}
            className={clsx({
              "p-3 rounded-md hover:bg-slate-600 transition-all hover:text-white grow aspect-video sm:p-20 sm:aspect-auto border flex text-center justify-center items-center sm:min-w-[35%]": true,
              "bg-slate-600 text-white": link.href === path
            })}
          >
            {link.text}
          </Link>
        )
      }
    </div>
  );
}