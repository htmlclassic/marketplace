'use client';

import { useEffect, useState } from "react";
import Order from "./Order";
import type { Orders } from "./types";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { getOrders } from "./utils";
import { useLazyLoad } from "../../hooks";

interface Props {
  orders: Orders;
  rangeFrom: number;
}

export default function OrderList({
  orders: ordersInitial,
  rangeFrom: rangeFromInitial
}: Props) {
  const [activeOrderId, setActiveOrderId] = useState(-1);
  const [orders, setOrders] = useState(ordersInitial);
  const [rangeFrom, setRangeFrom] = useState(rangeFromInitial);
  const [loading, setLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(true);

  if (!orders) return (
    <div className="h-full flex items-center justify-center text-center">
      <p>Вы ещё ничего не заказывали</p>
    </div>
  );

  const handleLoadMoreOrders = async () => {
    if (!shouldLoad || loading) return;

    setLoading(true);

    const supabase = createClientSupabaseClient();
    const ITEMS_COUNT = 20;
    const rangeTo = ITEMS_COUNT + rangeFrom - 1;

    const newOrders = await getOrders(rangeFrom, rangeTo, supabase);

    if (newOrders) {
      setOrders([ ...orders, ...newOrders ]);
      setRangeFrom(rangeTo + 1);

      if (newOrders.length < ITEMS_COUNT) {
        setShouldLoad(false);
      }
    }

    setLoading(false);
  };

  useLazyLoad(handleLoadMoreOrders);

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
