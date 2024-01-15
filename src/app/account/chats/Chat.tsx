'use client';

import type { Message } from './page';

import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useState } from "react";
import clsx from "clsx";
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  uid: string;
  chat_id: number;
  messages: Message[] | null;
  anotherPersonName: string;
  product: Product;
  addMessage: (message: Message) => void;
}

export default function Chat({
  uid,
  chat_id,
  messages,
  addMessage,
  anotherPersonName,
  product
}: Props) {
  return (
    <div className="relative grow flex flex-col gap-3">
      <Link
        href={`/products/${product.id}`}
        className="bg-white border-b z-10 px-3 h-16 shrink-0 flex gap-3 items-center"
      >
        <Image
          src={product.img_urls![0]}
          alt='product picture'
          width={40}
          height={40}
          className="rounded-md"
        />
        <p className="line-clamp-1">{product.title}</p>
      </Link>
      <div className="relative flex flex-col-reverse gap-3 p-5 mt-5 h-full overflow-auto">
        {
          messages?.map(message =>
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
        className="w-full rounded-sm border border-gray-300 p-2 outline-none transition-all duration-300 focus:border-black"
        type="text"
        value={text}
        placeholder="Введите текст сообщения"
        onChange={e => setText(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <button
        onClick={handleSend}
        className="border rounded-sm py-2 px-5 transition-all duration-300 hover:border-black outline-none focus:border-black"
      >Отправить</button>
    </div>
  );
}