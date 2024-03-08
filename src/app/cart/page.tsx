'use client';

import { useContext } from "react";
import ItemList from "./components/ItemList";
import EmptyCart from "./components/EmptyCart";
import { CartContext } from "@/src/CartContext";
import Link from "next/link";
import { numberWithSpaces } from "@/src/utils";
import Button from "@/src/components/Button";

export default function PageClient() {
  const { cart, removeItem, setItemQuantity } = useContext(CartContext);

  if (!cart.length) return <EmptyCart />
  
  const itemsTotalCount = cart.reduce((acc, item) => item.quantity + acc, 0)
  const total = cart.reduce((acc, item) => item.quantity * item.product.price + acc, 0)

  return (
    <div className="relative max-w-[1600px] mx-auto grow flex gap-5 flex-col lg:flex-row lg:justify-between lg:gap-10 side-padding top-margin">
      <div className="w-full max-w-5xl bg-white p-2">
        <ItemList
          cart={cart}
          removeCartItem={removeItem}
          setItemQuantity={setItemQuantity}
        />
      </div>
      <div className="text-sm sm:text-base transition-all duration-300 bottom-[calc(var(--mobile-menu-height)-1px)] sm:bottom-[-1px] top-[calc(var(--header-height)+1.5rem)] sticky shrink-0 h-max side-padding py-2 sm:p-10 bg-white sm:border border-[rgba(0,0,0,0.06)] rounded-lg hover:border-[rgba(0,0,0,0.16)]">
        <div>
          <h2 className="font-semibold text-lg mb-1">В корзине</h2>
          <div className="mb-2 sm:mb-5">{itemsTotalCount} {numMorph(itemsTotalCount)}</div>
          <div>Сумма к оплате: {numberWithSpaces(total)} ₽</div>
          <Button
            className="p-0 bg-sky-500 mt-3 sm:mt-7 sm:max-w-80"
          >
            <Link
              className="px-8 py-4 block"
              href="/order"
            >Перейти к оформлению</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function numMorph(n: number) {
  const w1 = 'товар';
  const w2 = 'товара';
  const w3 = 'товаров';

  n = (Math.abs(n) % 100); //отсекаем две последние цифры от цисла
	    
  // если это от 11 до 19, вернем множ. число
  if (n >= 11 && n <=19 ) return w3; 

  const n1= n % 10; //отсекаем от этого последнюю цифру

    //единственное число                     
  if (n1 == 1) return w1;

    //родительный падеж
  if (n1 > 1 && n1 < 5) return w2;
    
    //во всех остальных случаях множественное число
  return w3;
}