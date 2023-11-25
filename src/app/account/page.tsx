import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-3">
      <Link className="underline-offset-4 underline" href="/account/profile">Профиль</Link>
      <Link className="underline-offset-4 underline" href="/account/orders">Ваши заказы</Link>
      <Link className="underline-offset-4 underline" href="/account/addproduct">Добавить продукт</Link>
      <Link className="underline-offset-4 underline" href="/account/sales">Стастика проданных товаров</Link>
      <Link className="underline-offset-4 underline" href="/account/chats">Все чаты</Link>
    </div>
  );
}
