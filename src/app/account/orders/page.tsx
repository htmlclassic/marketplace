import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import OrderList from "./OrderList";
import { getInitialOrders } from "./utils";

export default async function Orders() {
  const supabase = createServerComponentSupabaseClient();
  const orders = await getInitialOrders(supabase);
  
  return (
    <div className="grow">
      <OrderList initialOrders={orders} />
    </div>
  )
}