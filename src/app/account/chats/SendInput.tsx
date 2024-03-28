'use client';

import { createClientSupabaseClient } from "@/supabase/utils_client";
import { Message } from "./page";
import { useRef, useState } from "react";
import Button from "@/src/components/Button";

interface Props {
  chat_id: number;
  author_id: string;
  addMessage: (message: Message) => void;
}

export default function SendInput({ chat_id, author_id, addMessage }: Props) {
  const supabase = createClientSupabaseClient();

  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = async () => {
    if (text !== '') {
      setText('');

      addMessage({ text, author_id, created_at: Date.now().toString() });

      await supabase
        .from('chat_message')
        .insert({ author_id, chat_id, text: text.slice(0, 2999) });
    }
  };

  return (
    <div className="flex gap-1">
      <input
        ref={inputRef}
        type="text"
        onKeyUp={e => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
        maxLength={3000}
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full border rounded-md p-2 outline-none transition-all duration-300 focus:border-gray-400"
        placeholder="Введите текст сообщения"
      />
      <Button
        onClick={() => {
          inputRef.current?.focus();
          handleSend();
        }}
        className="w-10 p-2 rounded-md font-normal"
      >
        <span className="hidden lg:inline">Отправить</span>
        <span className="inline lg:hidden"><SendIcon /></span>
      </Button>
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M5.41 21.75c-1.12 0-1.83-.38-2.28-.83-.88-.88-1.5-2.75.48-6.72l.87-1.73c.11-.23.11-.71 0-.94L3.61 9.8c-1.99-3.97-1.36-5.85-.48-6.72.87-.88 2.75-1.51 6.71.48l8.56 4.28c2.13 1.06 3.3 2.54 3.3 4.16s-1.17 3.1-3.29 4.16l-8.56 4.28c-1.94.97-3.38 1.31-4.44 1.31zm0-18c-.54 0-.96.13-1.22.39-.73.72-.44 2.59.76 4.98l.87 1.74c.32.65.32 1.63 0 2.28l-.87 1.73c-1.2 2.4-1.49 4.26-.76 4.98.72.73 2.59.44 4.99-.76l8.56-4.28c1.57-.78 2.46-1.81 2.46-2.82 0-1.01-.9-2.04-2.47-2.82L9.17 4.9c-1.52-.76-2.83-1.15-3.76-1.15z"
      ></path>
      <path
        fill="currentColor"
        d="M10.84 12.75h-5.4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5.4c.41 0 .75.34.75.75s-.34.75-.75.75z"
      ></path>
    </svg>
  );
}