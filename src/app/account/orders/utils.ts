import { SupabaseClient } from "@supabase/supabase-js";

export async function getOrders(from: number, to: number, supabase: SupabaseClient<Database>) {
  const { data: orders } = await supabase
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
            description,
            category,
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
  
  return orders?.length ? orders : null;
}