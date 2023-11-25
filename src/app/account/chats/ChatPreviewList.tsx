'use client';

import { useEffect } from "react";
import ChatPreview from "./ChatPreview";
import type { Chats } from './page';
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/supabase/utils_client";

interface Props {
  chats: Chats;
  uid: string;
}

export default function ChatPreviewList({ chats, uid }: Props) {
  const supabase = createClientSupabaseClient();
  const router = useRouter();
  const chatIds = chats.map(chat => chat.id).join();
  const filteredChats = chats.filter(chat =>
    chat.message ||
    (!chat.message && chat.customer_id === uid)
  );

  if (!filteredChats.length) return <div>У вас нет чатов</div>

  useEffect(() => {
    const realtimeFilter = chats.length ? `chat_id=in.(${chatIds})` : undefined;

    const channel = supabase.channel('realtime chat list')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_message',
        filter: realtimeFilter
      }, () => router.refresh())
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat',
        filter: `seller_id=eq.${uid}`
      }, () => router.refresh())
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [supabase, chatIds]);

  return (
    filteredChats.map(chat =>
      <ChatPreview
        key={chat.id}
        lastMessage={chat.message?.text}
        anotherSideName={chat.anotherSideName}
        chatId={chat.id}
        authorId={chat.message?.authorId}
        uid={uid}
      />
    )    
  );
}
