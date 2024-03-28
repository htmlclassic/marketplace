'use client';

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
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
          <Input
            type="number"
            className="border p-2 outline-none"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Button>
            <MagnifyingGlassIcon className="w-6 h-6" />
          </Button>
        </div>
      </form>
    </div>
  );
}