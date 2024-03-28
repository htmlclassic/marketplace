'use server';

import { createServiceSupabaseClient } from "@/supabase/utils_server";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function action(orderId: number) {
  unstable_noStore();
  
  const supabase = createServiceSupabaseClient();

  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price,
      product(owner)
    `)
    .eq('order_id', orderId);

  interface I {
    [key: string]: {
      total: number;
    }
  }

  const obj: I = {};

  if (orderItems) {
    for (const item of orderItems) {
      const ownerId = item.product!.owner;
      const total = item.quantity * item.price;

      if (obj[ownerId]) {
        obj[ownerId] = { total: obj[ownerId].total + total }
      } else {
        obj[ownerId] = { total };
      }
    }
  }

  for (const [userId, value] of Object.entries(obj)) {
    const { data: walletId } = await supabase
      .from('wallet')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    await supabase
      .rpc('deposit_on_wallet', {
        wallet_id: walletId!.id, action: 'sold_product', sum: value.total
      });
  }

  await supabase.rpc('set_order_payment_status_to_true', { orderid: orderId });

  revalidatePath('/');
}