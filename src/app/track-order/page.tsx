'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [text, setText] = useState('');
  const router = useRouter();

  return (
    <div className="side-padding grow flex">
      <form
        className="m-auto flex flex-col gap-3"
        onSubmit={e => {
          e.preventDefault();
          router.push(`/track-order/${text}`);
        }}
      >
        <h2 className="text-sm">Введите трек-код для отслеживания заказа</h2>
        <div className="flex gap-3">
          <input
            type="number"
            className="border p-2 outline-none"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="border py-1 px-2">Найти</button>
        </div>
      </form>
    </div>
  );
}