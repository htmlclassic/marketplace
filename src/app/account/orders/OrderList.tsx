'use client';

import { useEffect, useState } from "react";
import Order from "./Order";
import type { Orders } from "./types";

interface Props {
  orders: Orders;
}

export default function OrderList({ orders }: Props) {
  const [activeOrderId, setActiveOrderId] = useState(-1);

  if (!orders) return (
    <div className="h-full flex items-center justify-center text-center">
      <p>Вы ещё ничего не заказывали</p>
    </div>
  );

  useEffect(() => {
    const handleCloseAllOrdersOnOutsideClick = () => setActiveOrderId(-1);

    window.addEventListener('click', handleCloseAllOrdersOnOutsideClick);

    return () => window.removeEventListener('click', handleCloseAllOrdersOnOutsideClick);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {
        orders.map(order => 
          <Order 
            key={order.id} 
            order={order} 
            isActive={order.id === activeOrderId}
            onClick={() => {
              if (activeOrderId === order.id) setActiveOrderId(-1);
              else setActiveOrderId(order.id);
            }}
          />
        )
      }
    </div>
  );
}
