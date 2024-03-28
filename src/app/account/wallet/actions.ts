'use server';

import { createOtherSupabaseClient } from "@/supabase/utils_server";

export async function walletDeposit(walletId: number, sum: number) {
  const supabase = createOtherSupabaseClient();

  await supabase 
    .rpc('deposit_on_wallet', { wallet_id: walletId, sum, action: 'deposit' });
}