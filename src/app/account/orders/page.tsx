import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import OrderList from "./OrderList";
import { getOrders } from "./utils";

export default async function Orders() {
  const OFFSET = 19;

  const supabase = createServerComponentSupabaseClient();
  const orders = await getOrders(0, OFFSET, supabase);
  
  return (
    <div className="grow">
      <OrderList orders={orders} rangeFrom={OFFSET + 1} />
    </div>
  )
}