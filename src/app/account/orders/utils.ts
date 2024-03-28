import { createClientSupabaseClient } from "@/supabase/utils_client";
import { SupabaseClient } from "@supabase/supabase-js";

export const ORDERS_TO_FETCH_COUNT = 20;

export async function getOrders({ pageParam }: { pageParam: number }) {
  const supabase = createClientSupabaseClient();
  const from = pageParam * ORDERS_TO_FETCH_COUNT;
  const to = from + ORDERS_TO_FETCH_COUNT - 1;

  const { data: orders, error } = await supabase
    .from('order')
    .select
      (`id,
        delivery_date,
        address,
        created_at,
        phone_number,
        email,
        receiver_name,
  
        order_items(
          id, 
          quantity, 
          price, 
          product(
            id,
            title,
            img_urls
          )
        ),
  
        order_payment_details(
          payment_type,
          is_paid
        )`
      )
    .order('created_at', { ascending: false })
    .order('created_at', { referencedTable: 'order_items', ascending: true })
    .order('created_at', { referencedTable: 'order_payment_details', ascending: true })
    .range(from, to);
  
    const nextPage = orders?.length === ORDERS_TO_FETCH_COUNT ? pageParam + 1 : null;

    if (error) throw new Error(error.message);

    return {
      orders,
      nextPage
    };
}

export async function getInitialOrders(supabase: SupabaseClient<Database>) {
  const { data: orders} = await supabase
    .from('order')
    .select
      (`id,
        delivery_date,
        address,
        created_at,
        phone_number,
        email,
        receiver_name,
  
        order_items(
          id, 
          quantity, 
          price, 
          product(
            id,
            title,
            img_urls
          )
        ),
  
        order_payment_details(
          payment_type,
          is_paid
        )`
      )
    .order('created_at', { ascending: false })
    .order('created_at', { referencedTable: 'order_items', ascending: true })
    .order('created_at', { referencedTable: 'order_payment_details', ascending: true })
    .limit(ORDERS_TO_FETCH_COUNT);

  return orders?.length ? orders : null;
}