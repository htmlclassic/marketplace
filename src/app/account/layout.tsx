import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <div className="grow flex gap-10">
      <div className="flex flex-col">
        <Link className="p-3 transition-all rounded-md hover:bg-slate-700 hover:text-white" href="/account/profile">Профиль</Link>
        <Link className="p-3 transition-all rounded-md hover:bg-slate-700 hover:text-white" href="/account/orders">Ваши заказы</Link>
        <Link className="p-3 transition-all rounded-md hover:bg-slate-700 hover:text-white" href="/account/addproduct">Добавить продукт</Link>
        <Link className="p-3 transition-all rounded-md hover:bg-slate-700 hover:text-white" href="/account/sales">Стастика проданных товаров</Link>
        <Link className="p-3 transition-all rounded-md hover:bg-slate-700 hover:text-white" href="/account/chats">Все чаты</Link>
      </div>
      <div className="grow flex">
        { children }
      </div>
    </div>
  );
}
