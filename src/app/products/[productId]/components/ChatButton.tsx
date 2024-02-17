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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateChat = async () => {
    setLoading(true);
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
      const { data: chat } = await supabase
        .from('chat')
        .insert({
          customer_id: uid!,
          seller_id: productOwnerId,
          product_id: productId
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
    uid &&
      <Button
        className='bg-emerald-400'
        onClick={handleCreateChat}
      >
        Написать продавцу
      </Button>
  );
}
