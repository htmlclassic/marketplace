import { createServiceSupabaseClient } from "@/supabase/utils_server";
import { unstable_noStore } from "next/cache";

export async function getOrder(orderId: number) {
  unstable_noStore();

  const supabase = createServiceSupabaseClient();

  const { data: order } = await supabase
    .from('order')
    .select
      (`id,
        delivery_date,
        created_at,
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
    .eq('id', orderId)
    .limit(1)
    .single();

  return order ? order : null;
}