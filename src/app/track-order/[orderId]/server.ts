'use server';

import { createServiceSupabaseClient } from "@/supabase/utils_server";
import { unstable_noStore } from "next/cache";

export async function getOrderInfo(orderId: number) {
  unstable_noStore();

  const supabase = createServiceSupabaseClient();

  const { data } = await supabase
    .from('order_details')
    .select('id,delivery_date')
    .eq('id', orderId)
    .single();

  return data ? data : null;
}