'use client';

import LoadingSpinner from '@/src/components/LoadingSpinner';
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
        customer_id: '073d5810-2917-4c24-878a-c9cf61059180',
        seller_id: productOwnerId,
        product_id: productId
      })
      .limit(1)
      .single();

    if (chat) {
      router.push(`/account/chats/${chat.id}`)
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
        router.push(`/account/chats/${chat.id}`);
      }
    }
  }

  return (
    uid &&
      <button
        onClick={handleCreateChat}
        className="relative text-white bg-green-500 min-w-max h-14 w-full transition-all duration-300 hover:bg-green-600 rounded-lg"
      >
        Написать продавцу
        {
          loading &&
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
            <LoadingSpinner />
          </div>
        }
      </button>
  );
}
