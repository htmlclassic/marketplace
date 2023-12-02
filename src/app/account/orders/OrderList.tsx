import Order from "./Order";

interface Props {
  orders: Order[];
}

export default function OrderList({ orders }: Props) {
  return (
    <div className="flex flex-col gap-3">
      { orders.map(order => <Order key={order.id} order={order} />) }
    </div>
  );
}
