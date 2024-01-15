import Image from "next/image";
import Link from "next/link";

import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale';
import clsx from "clsx";
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
  const total = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const status =
    order.status === 'done' ? 'Доставлено' :
    order.status === 'courier' ? 'У курьера' : 'В сборке у продавца';

  return (
    <div className="p-3 rounded-lg border space-y-5">
      <div className="flex justify-between">
        <div className="space-y-1">
          <div className="font-semibold text-lg">
            Заказ от {dayjs(order.createdAt).format('D MMMM YYYY')}
          </div>
          <div>Номер заказа: <span>{order.id}</span></div>
        </div>
        <div className="text-sm space-x-1"><span>оплачено</span> <span className="text-base font-semibold">{total} ₽</span></div>
      </div>
      <div className="flex justify-between items-center gap-5">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex gap-2 items-center min-w-max">
            Статус доставки:
            <span className={clsx({
              "rounded-full px-2 py-[0.1rem]": true,
              "bg-sky-300": status === 'В сборке у продавца',
              "bg-amber-300": status === 'У курьера',
              "bg-green-300": status === 'Доставлено'
            })}
            >
              {status}
            </span>
          </div>
          <div>Дата доставки: {dayjs(order.deliveryDate).format('DD MMMM YYYY')}</div>
        </div>
        <ul className="overflow-x-auto flex">
          {
            order.items.map(item =>
              <li key={item.product.id} title="Перейти на страницу товара" className="shrink-0 p-3 transition-all border-2 border-transparent hover:border-green-400 rounded-lg">
                <Link href={`/products/${item.product.id}`}>
                  <Image
                    src={item.product.img_urls![0]}
                    alt="img"
                    width={80}
                    height={80}
                    className="rounded-md"
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