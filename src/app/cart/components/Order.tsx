'use client';

import { useRouter } from "next/navigation";
import { CartContext } from "@/src/reactContext";
import { useContext, useState } from "react";

import buyItems from '../buyItems';
import LoadingSpinner from "@/src/components/LoadingSpinner";
import clsx from "clsx";
import { Errors } from "../enums";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { getAPI } from "@/supabase/api";

interface Props {
  itemsTotalCount: number;
  total: number;
  uid: string;
  userBalance: number;
}

export default function Order({ itemsTotalCount, total, userBalance, uid }: Props) {
  const api = getAPI(createClientSupabaseClient())

  const router = useRouter();

  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { setCartItemsCount } = useContext(CartContext);

  const handler = async () => {
    setSubmitting(true);
    
    try {
      await buyItems(uid, address);
      await api.clearCart();
      setCartItemsCount(0);

      router.push('/orders');
    } catch(err) {
      const error = err as { message: Errors }
      setSubmitting(false);

      // handle buyItems errors
      switch(error.message) {
        case Errors.PRODUCTS_QUANTITY_CHANGED:
          router.refresh();
          break;
        case Errors.EMPTY_ADDRESS:
          break;
        case Errors.EMPTY_CART:
          break;
        case Errors.USER_OWNS_PRODUCT:
          break;
        case Errors.PRODUCTS_DONT_EXIST:
          break;
        case Errors.LOW_BALANCE:
          break;
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className={clsx({
        "flex-col gap-5 justify-center items-center absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 z-10": true,
        'flex': submitting,
        'hidden': !submitting
      })}>
        <LoadingSpinner />
        Оформляем заказ
      </div>
      <div>
        <div>Товаров в корзине: {itemsTotalCount}</div>
        <div>Баланс: <span className={userBalance < total ? 'text-red-500' : ''}>{userBalance}₽</span></div>
        <div>К оплате: {total}₽</div>
        {
          userBalance < total &&
          <p className="font-bold text-sm text-red-400 mt-4">Недостаточно средств на счёте.</p>
        }
      </div>
      <label className="flex flex-col gap-3">
        <span>Введите адрес доставки:</span>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="border p-1"
        />
      </label>
      <button
        className="border-2 p-3 border-sky-300 max-w-[300px] transition-all hover:bg-sky-300 disabled:hover:bg-transparent disabled:border-dashed disabled:border-gray-400 disabled:opacity-30"
        onClick={handler}
        disabled={userBalance < total || address === ''}
      >
        Заказать
      </button>
    </div>
  );
}