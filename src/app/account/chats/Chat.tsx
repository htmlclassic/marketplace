'use client';

import type { Message, StrippedProduct } from './page';

import clsx from "clsx";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SendInput from './SendInput';

interface Props {
  uid: string;
  chat_id: number;
  messages: Message[] | null;
  anotherPersonName: string;
  product: StrippedProduct;
  addMessage: (message: Message) => void;
  closeChat: () => void;
}

export default function Chat({
  uid,
  chat_id,
  messages,
  addMessage,
  closeChat,
  anotherPersonName,
  product
}: Props) {
  return (
    <div className="relative grow flex flex-col gap-3">
      <div className="flex gap-5 items-center justify-between px-3 border-b overflow-hidden">
        <Link
          href={`/products/${product.id}`}
          className="z-10 h-16 shrink-0 flex gap-3 items-center grow max-w-[90%]"
        >
          <div className="relative w-[40px] h-[40px] shrink-0">
            <Image
              src={product.img_urls![0]}
              alt='product picture'
              fill
              className="rounded-md object-cover"
            />
          </div>
          <p className="line-clamp-1">{product.title}</p>
        </Link>
        <button
          onClick={closeChat}
          className="p-3 pr-0"
        >
          <CrossIcon />
        </button>
      </div>
      <div className="relative w-full flex flex-col-reverse gap-3 p-5 h-full overflow-auto">
        {
          messages?.map(message =>
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
              }}
              className={clsx({
                "rounded-lg p-3 w-max min-w-[100px] max-w-[300px] [overflow-wrap:anywhere]": true,
                "self-end bg-blue-200": message.author_id === uid,
                "bg-green-200": message.author_id !== uid
              })}
              key={message.created_at}
            >
              <div
                className="font-bold text-gray-500 text-xs"
              >
                {message.author_id === uid && 'Вы:'} {message.author_id !== uid && anotherPersonName}
              </div>
              <div className="overflow-hidden">{message.text}</div>
            </motion.div>
          )
        }
      </div>
      <div className="p-5 pt-0">
        <SendInput
          chat_id={chat_id}
          author_id={uid}
          addMessage={addMessage}
        />
      </div>
    </div>
  );
}

function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#292D32"
        d="M9.17 15.58c-.19 0-.38-.07-.53-.22a.754.754 0 010-1.06l5.66-5.66c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L9.7 15.36c-.14.15-.34.22-.53.22z"
      ></path>
      <path
        fill="#292D32"
        d="M14.83 15.58c-.19 0-.38-.07-.53-.22L8.64 9.7a.754.754 0 010-1.06c.29-.29.77-.29 1.06 0l5.66 5.66c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22z"
      ></path>
      <path
        fill="#292D32"
        d="M15 22.75H9c-5.43 0-7.75-2.32-7.75-7.75V9c0-5.43 2.32-7.75 7.75-7.75h6c5.43 0 7.75 2.32 7.75 7.75v6c0 5.43-2.32 7.75-7.75 7.75zm-6-20C4.39 2.75 2.75 4.39 2.75 9v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25V9c0-4.61-1.64-6.25-6.25-6.25H9z"
      ></path>
    </svg>
  );
}