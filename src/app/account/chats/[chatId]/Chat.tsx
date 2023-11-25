'use client';

import type { Message } from './page';

import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  uid: string;
  chat_id: number;
  serverMessages: Message[];
  anotherPersonName: string;
  product: Product;
}

export default function Chat({
  uid,
  chat_id,
  serverMessages,
  anotherPersonName,
  product
}: Props) {
  const supabase = createClientSupabaseClient();
  const [messages, setMessages] = useState(serverMessages);
  const router = useRouter();

  function addMessage(message: Message) {
    setMessages(state => [
      { text: message.text, author_id: message.author_id, createdAt: message.createdAt },
      ...state,
    ]);
  };

  useEffect(() => {
    const channel = supabase.channel('realtime chat').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_message',
      filter: `chat_id=eq.${chat_id}`
    }, (payload) => {
      if (anotherPersonName === 'noname') router.refresh();

      const message = payload.new as RawMessage;

      if (message.author_id !== uid) {
        const newMessage: Message = {
          text: message.text,
          createdAt: message.created_at!,
          author_id: message.author_id
        };

        addMessage(newMessage);
      }

    }).subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [supabase]);

  return (
    <div className="relative grow border rounded border-slate-300 flex flex-col gap-3 max-w-[1000px] mx-auto max-h-[70vh] overflow-hidden">
      <Link
        href={`/products/${product.id}`}
        className="bg-gray-600 z-10 p-1 flex gap-3 text-white items-center"
      >
        <Image
          src={product.imageUrls![0]}
          alt='product picture'
          width={50}
          height={50}
        />
        <p className="line-clamp-2">{product.title}</p>
      </Link>
      <div className="relative flex flex-col-reverse gap-3 p-5 mt-5 h-full overflow-auto">
        {
          messages.map(message =>
            <div key={message.createdAt} className={clsx({
              "rounded-lg p-3 min-w-[100px] max-w-max [overflow-wrap:anywhere]": true,
              "self-end bg-blue-200": message.author_id === uid,
              "bg-green-200": message.author_id !== uid
            })}>
              <div
                className="font-bold text-gray-500 text-xs"
              >
                {message.author_id === uid && 'Вы:'} {message.author_id !== uid && anotherPersonName}
              </div>
              <div>{message.text}</div>
            </div>
          )
        }
      </div>
      <div className="p-5 pt-0">
        <SendMessage chat_id={chat_id} author_id={uid} addMessage={addMessage} />
      </div>
    </div>
  );
}

interface SendMessageProps {
  chat_id: number;
  author_id: string;
  addMessage: (message: Message) => void;
}

function SendMessage({ chat_id, author_id, addMessage }: SendMessageProps) {
  const supabase = createClientSupabaseClient();

  const [text, setText] = useState('');

  const handleSend = async () => {
    if (text !== '') {
      addMessage({ text, author_id, createdAt: Date.now().toString() });

      await supabase
        .from('chat_message')
        .insert({ author_id, chat_id, text });
      
      setText('');
    }
  };

  return (
    <div className="flex gap-3 flex-col items-center sm:flex-row">
      <input
        className="w-full rounded border border-gray-300 p-2"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <button
        onClick={handleSend}
        className="border-2 border-black rounded py-2 px-10 transition-all hover:bg-black hover:text-white"
      >Send</button>
    </div>
  );
}