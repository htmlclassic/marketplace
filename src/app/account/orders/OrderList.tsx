import Order from "./Order";
import type { Orders } from "./page";

interface Props {
  orders: Orders;
}

export default function OrderList({ orders }: Props) {
  if (!orders) return (
    <div className="h-full flex items-center justify-center text-center">
      <p>Вы ещё ничего не заказывали</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      { orders.map(order => <Order key={order.id} order={order} />) }
    </div>
  );
}
