import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import OrderList from "./OrderList";

export type Orders = Awaited<ReturnType<ReturnType<typeof getAPI>['getOrders']>>;
export type Order = ArrayElement<NonNullable<Orders>>;

export default async function Orders() {
  const api = getAPI(createServerComponentSupabaseClient());
  const orders = await api.getOrders(0, 20);
  
  return (
    <div className="grow">
      <OrderList orders={orders} />
    </div>
  )
}