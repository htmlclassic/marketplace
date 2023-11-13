import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

interface Props {
  order: Order;
}

export default function Order({ order }: Props) {
  const total = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const status =
    order.status === 'done' ? 'Доставлено' :
    order.status === 'courier' ? 'У курьера' : 'На сборке у продавца';

  return (
    <div className="p-3 border-2 rounded-lg border-slate-400">
      <div>Заказ от {dayjs(order.createdAt).format('DD.MM.YYYY HH:mm')}</div>
      <div className="font-bold">Номер заказа: {order.id}</div>
      <div>Статус доставки: {status}</div>
      <div>Дата доставки: {dayjs(order.deliveryDate).format('DD.MM.YYYY')}</div>
      <div>Адрес доставки: {order.address}</div>
      <div>Получатель: {order.receiver}</div>
      <div>Всего оплачено: {total} р</div>
      <ul className="flex flex-col gap-3 mt-3">
        {
          order.items.map(item =>
            <li key={item.product.id} className="p-3 flex flex-col gap-3 transition-all hover:bg-yellow-100 rounded-lg">
              <Link href={`/products/${item.product.id}`} >
                <Image
                  src={item.product.imageUrls![0]}
                  alt="img"
                  width={150}
                  height={150}
                />
                <div className="font-bold">{item.product.title}</div>
                <div className="line-clamp-3 text-sm">{item.product.description}</div>
                <div>{item.price} Р</div>
                <div>Количество: {item.quantity}</div>
              </Link>
            </li>
          )
        }
      </ul>
    </div>
  );
}