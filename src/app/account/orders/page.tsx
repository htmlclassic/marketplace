import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import OrderList from "./OrderList";

export default async function Orders() {
  const api = getAPI(createServerComponentSupabaseClient());
  const orders = await api.getOrders();
  
  return (
    <div className="grow">
      {
        orders ? <OrderList orders={orders} />
        : <p>Вы ещё ничего не заказывали.</p>
      }
    </div>
  )
}