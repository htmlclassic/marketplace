'use client';

import { useEffect, useState } from "react";
import Order from "./Order";
import type { Orders } from "./types";
import { getOrders } from "./utils";
import { useLazyLoad } from "../../hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Props {
  initialOrders: Orders;
}

export default function OrderList({
  initialOrders,
}: Props) {
  const [activeOrderId, setActiveOrderId] = useState(-1);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({ 
    queryKey: ['orders'], 
    queryFn: getOrders,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: false
  });

  if (!initialOrders) return (
    <div className="h-full flex items-center justify-center text-center">
      <p>Вы ещё ничего не заказывали</p>
    </div>
  );

  const newOrders = data?.pages.map(page => page.orders).flat();
  let orders = initialOrders;

  if (newOrders) {
    orders = [...orders, ...newOrders];
  }

  useLazyLoad(() => {
    if (!isFetchingNextPage) fetchNextPage();
  });

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
