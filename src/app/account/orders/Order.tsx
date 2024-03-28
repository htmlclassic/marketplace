'use client';

import Image from "next/image";
import Link from "next/link";

import type { Order } from "./types";

import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale';
import clsx from "clsx";
import { Timer } from "./Timer";
import { numberWithSpaces } from "@/src/utils";
import { useState } from "react";

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: [
    "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
    "августа", "сентября", "октября", "ноября", "декабря"
  ]
})

interface Props {
  order: Order;
  isActive: boolean;
  onClick: () => void;
}

type Status = 'В сборке у продавца' | 'У курьера' | 'Доставлено' | 'Ожидает оплаты' | 'Отменён';

export default function Order({ order, isActive, onClick }: Props) {
  const total = order.order_items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isOrderPaid = order.order_payment_details[0].is_paid;
  const paymentType = order.order_payment_details[0].payment_type as PaymentType === 'bank_card'
    ? 'Банковская карта' : 'Кошелёк Marketplace';

  // set fake order status
  let statusInitial: Status;
  const dateDiff = dayjs(order.delivery_date).diff(dayjs(), 'day', true);
  const minutesPassed = dayjs().diff(dayjs(order.created_at), 'minute');

  if (minutesPassed < 30 && !isOrderPaid) {
    statusInitial = 'Ожидает оплаты'
  }
  else if (minutesPassed >= 30 && !isOrderPaid) {
    statusInitial = 'Отменён';
  } else {
    if (dateDiff <= 0) statusInitial = 'Доставлено';
    else if (dateDiff < 2) statusInitial = 'У курьера';
    else statusInitial = 'В сборке у продавца';
  }

  const [status, setStatus] = useState(statusInitial);

  return (
    <div
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      className={clsx({
        "p-3 rounded-lg border transition-all duration-300 sm:hover:border-slate-400 cursor-pointer": true,
        "border-black sm:border-slate-400": isActive
      })}
    >
      <div className="space-y-5">
        <div className="flex gap-5 items-baseline justify-between">
          <div className="space-y-1">
            <div className="font-semibold text-lg">
              Заказ от {dayjs(order.created_at).format('D MMMM YYYY')}
            </div>
            <div>Номер заказа: <span>{order.id}</span></div>
          </div>
          <div className="text-sm flex flex-wrap items-center text-right h-max gap-1 justify-end">
            {
              isOrderPaid
                ? <>
                    <span>оплачено</span><span className="text-base font-semibold text-nowrap">
                    {numberWithSpaces(total)} ₽</span>
                  </>
                : <span>
                    {
                      status === 'Отменён'
                        ? 'не оплачено'
                        : <div>
                            Осталось времени для оплаты:
                            <Timer
                              startTime={order.created_at}
                              onTimeUp={() => setStatus('Отменён')} 
                            />
                            <Link
                              href={`/transaction/${order.id}`}
                              className="underline block hover:text-sky-400"
                              onClick={e => e.stopPropagation()}
                            >Оплатить</Link>
                          </div>
                    }
                  </span>
            }
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex gap-2 items-center min-w-max">
              Статус:
              <span className={clsx({
                "rounded-full px-2 py-[0.1rem]": true,
                "bg-sky-300": status === 'В сборке у продавца',
                "bg-amber-300": status === 'У курьера',
                "bg-green-300": status === 'Доставлено',
                "bg-gray-300": status === 'Ожидает оплаты',
                "bg-red-300": status === 'Отменён'
              })}
              >
                {status}
              </span>
            </div>
            <div>Дата доставки: {dayjs(order.delivery_date).format('DD MMMM YYYY')}</div>
          </div>
          <ul className="overflow-x-auto flex gap-1 max-w-96">
            {
              order.order_items.slice(0, 4).map(item =>
                <li
                  key={item.product?.id} 
                  className="relative shrink-0 w-[70px] h-[70px] transition-all p-1 rounded-lg"
                >
                  <Image
                    src={item.product?.img_urls?.[0] || ''}
                    alt="img"
                    fill
                    className="rounded-md object-cover"
                  />
                </li>
              )
            }
          </ul>
        </div>
      </div>

      {/* extra order information */}
      <div className={clsx({
        "grid transition-all duration-300": true,
        "grid-rows-[0fr]": !isActive,
        "grid-rows-[1fr]": isActive,
      })}>
        <div className={clsx({
          "flex flex-col gap-5 transition-all duration-300 overflow-hidden": true,
          "mt-0": !isActive,
          "mt-16": isActive
        })}
        >
          <div className="flex flex-col min-[900px]:flex-row gap-x-10 gap-y-5 text-sm max-w-[800px]">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold mb-2 flex gap-3 items-center whitespace-nowrap"><UserIcon />Получатель</h3>
              <div>{order.receiver_name}</div>
              <div>{order.email}</div>
              <div>{order.phone_number}</div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold mb-2 flex gap-3 items-center whitespace-nowrap"><LocationIcon />Адрес доставки</h3>
              <div>{order.address}</div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold mb-2 flex gap-3 items-center whitespace-nowrap"><PaymentIcon />Способ оплаты</h3>
              <div>{paymentType}</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <h3 className="font-semibold mb-2 flex gap-3 items-center whitespace-nowrap"><BagIcon />Купленные товары</h3>
            {
              order.order_items.map(orderItem =>
                <Link
                  href={`/products/${orderItem.product?.id}`}
                  className="grid grid-cols-[1fr_4fr] grid-rows-[1fr_max-content] min-[450px]:grid-rows-[1fr] min-[450px]:grid-cols-[max-content_4fr_1fr_1fr] items-center gap-x-3 gap-y-6 transition-all border hover:bg-gray-100 p-3 rounded-md"
                  key={orderItem.id}
                  title="Перейти на страницу товара"
                > 
                  <div className="relative w-[100px] h-[100px] shrink-0">
                    <Image
                      src={orderItem.product?.img_urls?.[0] || ''}
                      alt="img"
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="max-w-[600px] line-clamp-4">{orderItem.product?.title}</div>
                  <div className="justify-self-start min-[450px]:justify-self-center whitespace-nowrap">{numberWithSpaces(orderItem.price)} ₽</div>
                  <div className="justify-self-end min-[450px]:justify-self-center whitespace-nowrap">{orderItem.quantity} шт</div>
                </Link>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function BagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#292D32"
        d="M11.12 18.25c-.19 0-.38-.07-.53-.22l-1.5-1.5a.754.754 0 010-1.06c.29-.29.77-.29 1.06 0l.99.99 2.72-2.51c.3-.28.78-.26 1.06.04s.26.78-.04 1.06l-3.25 3c-.14.13-.32.2-.51.2zM5.19 6.38c-.19 0-.39-.08-.53-.22a.754.754 0 010-1.06l3.63-3.63c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L5.72 6.16c-.15.14-.34.22-.53.22zM18.81 6.38c-.19 0-.38-.07-.53-.22l-3.63-3.63a.754.754 0 010-1.06c.29-.29.77-.29 1.06 0l3.63 3.63c.29.29.29.77 0 1.06-.14.14-.34.22-.53.22z"
      ></path>
      <path
        fill="#292D32"
        d="M20.21 10.6H4c-.7.01-1.5.01-2.08-.57-.46-.45-.67-1.15-.67-2.18 0-2.75 2.01-2.75 2.97-2.75h15.56c.96 0 2.97 0 2.97 2.75 0 1.04-.21 1.73-.67 2.18-.52.52-1.22.57-1.87.57zM4.22 9.1h15.79c.45.01.87.01 1.01-.13.07-.07.22-.31.22-1.12 0-1.13-.28-1.25-1.47-1.25H4.22c-1.19 0-1.47.12-1.47 1.25 0 .81.16 1.05.22 1.12.14.13.57.13 1.01.13h.24z"
      ></path>
      <path
        fill="#292D32"
        d="M14.89 22.75H8.86c-3.58 0-4.38-2.13-4.69-3.98l-1.41-8.65c-.07-.41.21-.79.62-.86.4-.07.79.21.86.62l1.41 8.64c.29 1.77.89 2.73 3.21 2.73h6.03c2.57 0 2.86-.9 3.19-2.64l1.68-8.75c.08-.41.47-.68.88-.59.41.08.67.47.59.88l-1.68 8.75c-.39 2.03-1.04 3.85-4.66 3.85z"
      ></path>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#292D32"
        d="M12 14.17c-2.13 0-3.87-1.73-3.87-3.87S9.87 6.44 12 6.44s3.87 1.73 3.87 3.87-1.74 3.86-3.87 3.86zm0-6.23c-1.3 0-2.37 1.06-2.37 2.37s1.06 2.37 2.37 2.37 2.37-1.06 2.37-2.37S13.3 7.94 12 7.94z"
      ></path>
      <path
        fill="#292D32"
        d="M12 22.76a5.97 5.97 0 01-4.13-1.67c-2.95-2.84-6.21-7.37-4.98-12.76C4 3.44 8.27 1.25 12 1.25h.01c3.73 0 8 2.19 9.11 7.09 1.22 5.39-2.04 9.91-4.99 12.75A5.97 5.97 0 0112 22.76zm0-20.01c-2.91 0-6.65 1.55-7.64 5.91C3.28 13.37 6.24 17.43 8.92 20a4.426 4.426 0 006.17 0c2.67-2.57 5.63-6.63 4.57-11.34-1-4.36-4.75-5.91-7.66-5.91z"
      ></path>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#292D32"
        d="M15 22.75H9c-5.43 0-7.75-2.32-7.75-7.75V9c0-5.43 2.32-7.75 7.75-7.75h6c5.43 0 7.75 2.32 7.75 7.75v6c0 5.43-2.32 7.75-7.75 7.75zm-6-20C4.39 2.75 2.75 4.39 2.75 9v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25V9c0-4.61-1.64-6.25-6.25-6.25H9z"
      ></path>
      <path
        fill="#292D32"
        d="M15.5 10.5c-1.24 0-2.25-1.01-2.25-2.25S14.26 6 15.5 6s2.25 1.01 2.25 2.25-1.01 2.25-2.25 2.25zm0-3c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zM8.5 10.5c-1.24 0-2.25-1.01-2.25-2.25S7.26 6 8.5 6s2.25 1.01 2.25 2.25S9.74 10.5 8.5 10.5zm0-3c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zM12 19.45c-2.9 0-5.25-2.36-5.25-5.25 0-.91.74-1.65 1.65-1.65h7.2c.91 0 1.65.74 1.65 1.65 0 2.89-2.35 5.25-5.25 5.25zm-3.6-5.4c-.08 0-.15.07-.15.15 0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-.08-.07-.15-.15-.15H8.4z"
      ></path>
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#292D32"
        d="M17.74 22.75H6.26c-2.49 0-4.51-2.02-4.51-4.51v-6.73C1.75 9.02 3.77 7 6.26 7h11.48c2.49 0 4.51 2.02 4.51 4.51v1.44c0 .41-.34.75-.75.75h-2.02c-.35 0-.67.13-.9.37l-.01.01c-.28.27-.41.64-.38 1.02.06.66.69 1.19 1.41 1.19h1.9c.41 0 .75.34.75.75v1.19c0 2.5-2.02 4.52-4.51 4.52zM6.26 8.5c-1.66 0-3.01 1.35-3.01 3.01v6.73c0 1.66 1.35 3.01 3.01 3.01h11.48c1.66 0 3.01-1.35 3.01-3.01v-.44H19.6c-1.51 0-2.79-1.12-2.91-2.56-.08-.82.22-1.63.82-2.22.52-.53 1.22-.82 1.97-.82h1.27v-.69c0-1.66-1.35-3.01-3.01-3.01H6.26z"
      ></path>
      <path
        fill="#292D32"
        d="M2.5 13.16c-.41 0-.75-.34-.75-.75V7.84c0-1.49.94-2.84 2.33-3.37l7.94-3c.82-.31 1.73-.2 2.44.3.72.5 1.14 1.31 1.14 2.18v3.8c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.8c0-.38-.18-.73-.5-.95-.32-.22-.7-.27-1.06-.13l-7.94 3c-.81.31-1.36 1.1-1.36 1.97v4.57c.01.42-.33.75-.74.75zM19.6 17.8c-1.51 0-2.79-1.12-2.91-2.56-.08-.83.22-1.64.82-2.23.51-.52 1.21-.81 1.96-.81h2.08c.99.03 1.75.81 1.75 1.77v2.06c0 .96-.76 1.74-1.72 1.77H19.6zm1.93-4.1h-2.05c-.35 0-.67.13-.9.37-.29.28-.43.66-.39 1.04.06.66.69 1.19 1.41 1.19h1.96c.13 0 .25-.12.25-.27v-2.06c0-.15-.12-.26-.28-.27z"
      ></path>
      <path
        fill="#292D32"
        d="M14 12.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h7c.41 0 .75.34.75.75s-.34.75-.75.75z"
      ></path>
    </svg>
  );
}