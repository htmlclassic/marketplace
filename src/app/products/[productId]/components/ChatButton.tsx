'use client';

import Button from '@/src/components/Button';
import { createClientSupabaseClient } from '@/supabase/utils_client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  uid: string | null;
  productId: string;
  productOwnerId: string;
}

export default function ChatButton({ uid, productId, productOwnerId }: Props) {
  const router = useRouter();

  const handleCreateChat = async () => {
    if (!uid) router.push('/login');

    const supabase = createClientSupabaseClient();

    const { data: chat } = await supabase
      .from('chat')
      .select()
      .match({
        customer_id: uid,
        seller_id: productOwnerId,
        product_id: productId
      })
      .limit(1)
      .single();

    if (chat) {
      router.push(`/account/chats?activeChatId=${chat.id}`);
    } else {
      const { data: customerName } = await supabase.rpc('get_user_name', { userid: uid! });
      const { data: sellerName } = await supabase.rpc('get_user_name', { userid: productOwnerId! });

      const { data: chat } = await supabase
        .from('chat')
        .insert({
          customer_id: uid!,
          seller_id: productOwnerId,
          customer_name: customerName!,
          seller_name: sellerName!,
          product_id: productId,
        })
        .select()
        .limit(1)
        .single();

      if (chat) {
        router.push(`/account/chats?activeChatId=${chat.id}`);
      }
    }
  }

  return (
    <Button
      className='bg-emerald-400'
      onClick={handleCreateChat}
    >
      Написать продавцу
    </Button>
  );
}
