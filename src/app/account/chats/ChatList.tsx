'use client';

import { useEffect, useState } from "react";
import Chat from "./Chat";
import { ChatsT, Message } from "./page";
import clsx from "clsx";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  chats: ChatsT;
}

export default function ChatList({ chats: chatsInitial }: Props) {
  if (!chatsInitial) return null;

  const supabase = createClientSupabaseClient();
  const router = useRouter();

  const [chats, setChats] = useState(chatsInitial);
  // const [showPreviews, setShowPreviews] = useState(false);

  const searchParams = useSearchParams();
  const activeChatIdParam = searchParams.get('activeChatId');
  const activeChatIdInitial = chats.find(chat => chat.id === Number(activeChatIdParam));
  const [activeChatId, setActiveChatId] = useState(activeChatIdInitial?.id || chats[0].id);

  const activeChat = chats.find(chat => chat.id === activeChatId)!;

  let hiddenChatIds: number[] = [];
  for (const chat of chats) {
    if (!(chat.messages?.length || (!chat.messages?.length && chat.creatorId === chat.uid))) {
      hiddenChatIds.push(chat.id);
    }
  }

  const chatIds = chats.map(chat => chat.id).join();

  // watch for new messages from known chats and update state
  useEffect(() => {
    const channel = supabase.channel('realtime chat').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_message',
      filter: `chat_id=in.(${chatIds})`
    }, (payload) => {
      const rawMessage = payload.new as RawMessage;

      if (rawMessage.author_id !== chats[0].uid) {
        addMessage({
          text: rawMessage.text,
          author_id: rawMessage.author_id,
          createdAt: rawMessage.created_at!
        }, rawMessage.chat_id);
      }

    }).subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [supabase, chats]);

  // watch for new chats and refresh route
  useEffect(() => {
    const channel = supabase.channel('realtime chat 2').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat',
      filter: `seller_id=eq.${chats[0].uid}`
    }, () => {
      router.refresh();
    }).subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [supabase]);

  // after route is refreshed, rerender the component
  useEffect(() => {
    if (chats.length !== chatsInitial.length) {
      setChats(chatsInitial);
    }
  }, [chatsInitial]);

  function addMessage(message: Message, chatId: number) {
    setChats(
      chats.map(chat => {
        if (chat.id !== chatId) return chat;
        const oldMessages = chat.messages ?? [];

        return {
          ...chat,
          messages: [
            { text: message.text, author_id: message.author_id, createdAt: message.createdAt },
            ...oldMessages,
          ]
        };
      })
    );
  };

  // jsx is a little bit complicated, refactor later.
  return (
    <div className="relative border rounded-lg grow">
      <div className="absolute w-full h-full flex">
        <div className="overflow-y-auto overflow-x-hidden rounded-tl-lg border-r md:w-[300px] shrink-0">
          <div 
            className="sticky top-0 px-3 h-16 flex items-center justify-center md:justify-between font-medium text-lg bg-white border-b border-r"
          >
            <span className="hidden md:inline">Сообщения</span>
            <div><MessageIcon /></div>
          </div>
          <div>
            {
              chats.map(chat => {
                const show = !hiddenChatIds.includes(chat.id);

                return (
                  show &&
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={clsx({
                      "group flex items-center cursor-pointer transition-all hover:bg-gray-100": true,
                      "bg-gray-100": chat.id === activeChat.id
                    })}
                  >
                    <div className="text-2xl font-medium p-3">{chat.anotherPersonName[0]}</div>
                    <div className="border-b group-last:border-none grow flex-col gap-2 p-3 hidden md:flex">
                      <div className="font-semibold">{chat.anotherPersonName}</div>
                      <div className="line-clamp-1">
                        {
                          chat.messages?.[0]?.author_id === chat.uid &&
                          <span className="text-gray-400">Вы: </span>
                        }
                        {
                          chat.messages?.[0]?.text ||
                          <span className="text-gray-400">Чат с продавцом</span>
                        }
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        {
          !hiddenChatIds.includes(activeChatId) &&
          <Chat
            uid={activeChat.uid}
            chat_id={activeChat.id}
            messages={activeChat.messages}
            anotherPersonName={activeChat.anotherPersonName}
            product={activeChat.product}
            addMessage={(message: Message) => addMessage(message, activeChat.id)}
          />
        }
      </div>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1 24.2604C12.3813 24.2604 11.7042 23.8958 11.225 23.2604L9.6625 21.1771C9.63125 21.1354 9.50625 21.0833 9.45417 21.0729H8.93333C4.58958 21.0729 1.90208 19.8958 1.90208 14.0416V8.83331C1.90208 4.22915 4.32917 1.80206 8.93333 1.80206H17.2667C21.8708 1.80206 24.2979 4.22915 24.2979 8.83331V14.0416C24.2979 18.6458 21.8708 21.0729 17.2667 21.0729H16.7458C16.6625 21.0729 16.5896 21.1146 16.5375 21.1771L14.975 23.2604C14.4958 23.8958 13.8188 24.2604 13.1 24.2604ZM8.93333 3.36456C5.20417 3.36456 3.46458 5.10415 3.46458 8.83331V14.0416C3.46458 18.75 5.07917 19.5104 8.93333 19.5104H9.45417C9.98542 19.5104 10.5896 19.8125 10.9125 20.2396L12.475 22.3229C12.8396 22.8021 13.3604 22.8021 13.725 22.3229L15.2875 20.2396C15.6313 19.7812 16.1729 19.5104 16.7458 19.5104H17.2667C20.9958 19.5104 22.7354 17.7708 22.7354 14.0416V8.83331C22.7354 5.10415 20.9958 3.36456 17.2667 3.36456H8.93333Z" fill="currentColor"/>
      <path d="M13.1 13C12.5167 13 12.0583 12.5313 12.0583 11.9584C12.0583 11.3854 12.5271 10.9167 13.1 10.9167C13.6729 10.9167 14.1417 11.3854 14.1417 11.9584C14.1417 12.5313 13.6833 13 13.1 13Z" fill="currentColor"/>
      <path d="M17.2667 13C16.6833 13 16.225 12.5313 16.225 11.9584C16.225 11.3854 16.6938 10.9167 17.2667 10.9167C17.8396 10.9167 18.3083 11.3854 18.3083 11.9584C18.3083 12.5313 17.85 13 17.2667 13Z" fill="currentColor"/>
      <path d="M8.93334 13C8.35001 13 7.89168 12.5313 7.89168 11.9584C7.89168 11.3854 8.36043 10.9167 8.93334 10.9167C9.50626 10.9167 9.97501 11.3854 9.97501 11.9584C9.97501 12.5313 9.51668 13 8.93334 13Z" fill="currentColor"/>
    </svg>
  );
}