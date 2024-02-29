import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import OrderList from "./OrderList";
import { getOrders } from "./utils";

export default async function Orders() {
  const supabase = createServerComponentSupabaseClient();
  const orders = await getOrders(0, 20, supabase);
  
  return (
    <div className="grow">
      <OrderList orders={orders} />
    </div>
  )
}