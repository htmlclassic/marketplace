'use client';

import { useEffect, useState } from "react";
import ItemList from "./components/ItemList";
import Order from "./components/Order";
import { CartState } from "./page";
import EmptyCart from "./components/EmptyCart";

interface Props {
  products: Product[];
  cart: CartState[];
  itemsQuantityChanged: string[];
  userBalance: number;
  uid: string;
}

export default function PageClient(
  {
    products,
    cart: initialCart,
    itemsQuantityChanged,
    userBalance,
    uid
  }: Props
) {
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    const totalQuantityIntital = initialCart.reduce((acc, item) => item.quantity + acc, 0);
    const totalQuantityCurrentState = cart.reduce((acc, item) => item.quantity + acc, 0);

    if (totalQuantityCurrentState !== totalQuantityIntital) {
      setCart(initialCart);
    }
  }, [initialCart])

  if (cart.length === 0) return <EmptyCart />
  
  const itemsTotalCount = cart.reduce((acc, item) => item.quantity + acc, 0)
  const total = cart.reduce((acc, item) => item.quantity * item.price + acc, 0)

  return (
    <div className="relative grow flex flex-wrap gap-5 lg:gap-20 lg:flex-nowrap">
      <div className="grow max-w-5xl bg-white p-2 rounded-md border">
        <ItemList
          products={products}
          cart={cart}
          itemsQuantityChanged={itemsQuantityChanged}
          setCart={setCart}
        />
      </div>
      <div className="grow shrink-0 sm:min-w-[420px] bg-white p-2 rounded-md border">
        <Order
          itemsTotalCount={itemsTotalCount}
          total={total}
          userBalance={userBalance}
          uid={uid}
        />
      </div>
    </div>
  );
}