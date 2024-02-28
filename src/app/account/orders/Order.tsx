import Image from "next/image";
import Link from "next/link";

import type { Order } from "./page";

import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale';
import clsx from "clsx";
import { Timer } from "./Timer";
import { numberWithSpaces } from "@/src/utils";
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: [
    "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
    "августа", "сентября", "октября", "ноября", "декабря"
  ]
})

interface Props {
  order: Order;
}

export default function Order({ order }: Props) {
  const total = order.order_items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isOrderPaid = order.order_payment_details[0].is_paid;

  // set fake order status
  let status: 'В сборке у продавца' | 'У курьера' | 'Доставлено' | 'Ожидает оплаты' | 'Отменён';
  const dateDiff = dayjs(order.delivery_date).diff(dayjs(), 'day', true);
  const minutesPassed = dayjs().diff(dayjs(order.created_at), 'minute');

  if (minutesPassed < 30 && !isOrderPaid) {
    status = 'Ожидает оплаты'
  }
  else if (minutesPassed >= 30 && !isOrderPaid) {
    status = 'Отменён';
  } else {
    if (dateDiff <= 0) status = 'Доставлено';
    else if (dateDiff < 2) status = 'У курьера';
    else status = 'В сборке у продавца';
  }

  return (
    <div className="p-3 rounded-lg border space-y-5">
      <div className="flex gap-2 items-baseline justify-between">
        <div className="space-y-1">
          <div className="font-semibold text-lg">
            Заказ от {dayjs(order.created_at).format('D MMMM YYYY')}
          </div>
          <div>Номер заказа: <span>{order.id}</span></div>
        </div>
        <div className="text-sm flex flex-wrap items-center h-max gap-1 justify-end">
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
                      : <>
                          Осталось времени для оплаты: <Timer startTime={order.created_at} />
                        </>
                  }
                </span>
          }
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex gap-2 items-center min-w-max">
            Статус доставки:
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
        <ul className="overflow-x-auto flex max-w-96">
          {
            order.order_items.slice(0, 4).map(item =>
              <li key={item.product?.id} title="Перейти на страницу товара" className="relative shrink-0 w-[80px] h-[80px] transition-all p-1 rounded-lg">
                <Link href={`/products/${item.product?.id}`}>
                  <Image
                    src={item.product?.img_urls?.[0] || ''}
                    alt="img"
                    fill
                    className="rounded-md object-cover"
                  />
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
}