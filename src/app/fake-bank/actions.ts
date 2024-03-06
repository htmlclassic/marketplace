'use server';

import { createOtherSupabaseClient } from "@/supabase/utils_server";

export async function action(orderId: number) {
  const supabase = createOtherSupabaseClient();

  await supabase.rpc('set_order_payment_status_to_true', { orderid: orderId })
}