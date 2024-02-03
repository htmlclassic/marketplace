'use client';

import { useContext } from "react";
import ItemList from "./components/ItemList";
import EmptyCart from "./components/EmptyCart";
import { CartContext } from "@/src/CartContext";
import Link from "next/link";

interface Props {
  uid: string | null;
}

/*
1) выбрать адрес доставки.
  -выбрать способ оплаты: либо картой, либо с баланса (если авторизован).
  -выбрать дату доставки
  кнопка "оплатить онлайн" (если юзер не авторизован, то дополнительно попросить email для отсылки туда
  трек-кода заказа)
3) - если карта, то перекинуть на фейк страницу заполнения карточных данных. после заполнения и самбита. купить товары.

*/

export default function PageClient({ uid }: Props) {
  const { cart, removeItem, setItemQuantity } = useContext(CartContext);

  if (!cart.length) return <EmptyCart />
  
  const itemsTotalCount = cart.reduce((acc, item) => item.quantity + acc, 0)
  const total = cart.reduce((acc, item) => item.quantity * item.price + acc, 0)

  return (
    <div className="relative grow flex flex-wrap gap-5 lg:gap-20 lg:flex-nowrap side-padding top-margin">
      <div className="w-full max-w-5xl bg-white p-2 rounded-md border">
        <ItemList
          cart={cart}
          removeCartItem={removeItem}
          setItemQuantity={setItemQuantity}
        />
      </div>
      <div className="grow shrink-0 sm:min-w-[420px] bg-white p-2 rounded-md border flex flex-col gap-7">
        <Link
          className="border p-3 w-max"
          href="/order"
        >Перейти к оформлению</Link>
        <div>
          <h2 className="font-semibold text-lg mb-3">Ваша корзина</h2>
          <div>Сумма к оплате: {total} ₽</div>
          <div>Количество товаров: {itemsTotalCount}</div>
        </div>
      </div>
    </div>
  );
}