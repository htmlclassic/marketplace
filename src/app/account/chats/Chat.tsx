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
        <div className="relative w-[40px] h-[40px]">
          <Image
            src={product.img_urls![0]}
            alt='product picture'
            fill
            className="rounded-md object-cover"
          />
        </div>
        <p className="line-clamp-1">{product.title}</p>
      </Link>
      <div className="relative flex flex-col-reverse gap-3 p-5 mt-5 h-full overflow-auto">
        {
          messages?.map(message =>
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
              }}
              className={clsx({
                "rounded-lg p-3 min-w-[100px] max-w-max [overflow-wrap:anywhere]": true,
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
              <div>{message.text}</div>
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